/**
 * BINSIGHT — FIREBASE STORAGE
 * --------------------------------------------------------------------------
 * Firebase Cloud Storage data-access layer.
 *
 * Responsibilities:
 * - File validation
 * - Upload from browser File / Blob
 * - Upload with deterministic or generated paths
 * - Upload progress
 * - Download URL retrieval
 * - File metadata retrieval
 * - File deletion
 * - Safe path helpers
 *
 * Intended BINSIGHT assets:
 * - Community report photos
 * - Organization logos
 * - Organization showcase images
 * - Waste / education images
 *
 * Architecture:
 *
 *   UI / Components
 *        │
 *        ▼
 *   src/lib/data/*
 *        │
 *        ▼
 *   src/lib/firebase/storage.ts
 *        │
 *        ▼
 *   Firebase Cloud Storage
 *
 * Important:
 * - This layer validates files for UX and data hygiene.
 * - Firebase Storage Security Rules remain authoritative.
 * - Do NOT put service-account credentials here.
 * - Do NOT rely on client validation as a security boundary.
 * --------------------------------------------------------------------------
 */

import {
  deleteObject,
  getDownloadURL,
  getMetadata,
  ref,
  uploadBytes,
  uploadBytesResumable,
  type FullMetadata,
  type StorageReference,
  type UploadMetadata,
  type UploadTask,
} from "firebase/storage";

import {
  firebaseStorage,
} from "@lib/firebase/config";

/* -------------------------------------------------------------------------- */
/* Types                                                                      */
/* -------------------------------------------------------------------------- */

export interface StorageResult<T> {
  success: true;
  data: T;
}

export interface StorageErrorResult {
  success: false;
  error: StorageServiceError;
}

export type StorageOperationResult<T> =
  | StorageResult<T>
  | StorageErrorResult;

export interface StorageServiceError {
  code: string;
  message: string;
  originalCode?: string;
}

export interface FileValidationOptions {
  maxBytes?: number;
  allowedMimeTypes?: readonly string[];
  allowedExtensions?: readonly string[];
}

export interface ValidatedFile {
  file: File;
  name: string;
  extension: string;
  mimeType: string;
  size: number;
}

export interface UploadOptions {
  path: string;
  file: Blob | Uint8Array;
  metadata?: UploadMetadata;
}

export interface ResumableUploadOptions {
  path: string;
  file: Blob | Uint8Array;
  metadata?: UploadMetadata;
  onProgress?: (
    progress: UploadProgress
  ) => void;
  onComplete?: (
    result: UploadResult
  ) => void;
  onError?: (
    error: StorageServiceError
  ) => void;
}

export interface UploadProgress {
  bytesTransferred: number;
  totalBytes: number;
  percentage: number;
  state:
    | "running"
    | "paused"
    | "success"
    | "canceled"
    | "error";
}

export interface UploadResult {
  path: string;
  name: string;
  fullPath: string;
  downloadURL: string;
  metadata: FullMetadata;
}

export interface StorageFile {
  name: string;
  fullPath: string;
  bucket: string;
  contentType?: string;
  size?: number;
  updatedAt?: string;
  createdAt?: string;
  downloadURL: string;
}

/* -------------------------------------------------------------------------- */
/* Constants                                                                  */
/* -------------------------------------------------------------------------- */

export const MAX_FILE_SIZE = {
  reportPhoto: 10 * 1024 * 1024,
  organizationLogo: 5 * 1024 * 1024,
  organizationImage: 10 * 1024 * 1024,
  wasteImage: 10 * 1024 * 1024,
} as const;

export const MIME_TYPES = {
  image: [
    "image/jpeg",
    "image/png",
    "image/webp",
  ],
  imageWithSvg: [
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/svg+xml",
  ],
} as const;

const STORAGE_ERROR_MESSAGES: Record<
  string,
  string
> = {
  "object-not-found":
    "File yang diminta tidak ditemukan.",

  "bucket-not-found":
    "Storage bucket BINSIGHT tidak ditemukan.",

  unauthorized:
    "Anda tidak memiliki izin untuk mengakses file ini.",

  unauthenticated:
    "Anda harus login untuk melakukan tindakan ini.",

  "retry-limit-exceeded":
    "Batas percobaan telah tercapai. Silakan coba lagi.",

  "invalid-checksum":
    "Integritas file tidak dapat diverifikasi.",

  "invalid-event-name":
    "Event Storage tidak valid.",

  "invalid-url":
    "URL file tidak valid.",

  "invalid-argument":
    "Parameter file tidak valid.",

  "canceled":
    "Upload dibatalkan.",

  "quota-exceeded":
    "Kuota penyimpanan telah tercapai.",

  "server-file-wrong-size":
    "Ukuran file tidak sesuai dengan yang diharapkan.",

  "unknown":
    "Terjadi kesalahan saat mengakses file.",
};

/* -------------------------------------------------------------------------- */
/* Error Handling                                                             */
/* -------------------------------------------------------------------------- */

const normalizeStorageError = (
  error: unknown
): StorageServiceError => {
  if (
    typeof error === "object" &&
    error !== null &&
    "code" in error
  ) {
    const storageError =
      error as {
        code?: unknown;
        message?: unknown;
      };

    const originalCode =
      typeof storageError.code === "string"
        ? storageError.code
        : "unknown";

    const code =
      originalCode.startsWith("storage/")
        ? originalCode.slice("storage/".length)
        : originalCode;

    return {
      code,
      message:
        STORAGE_ERROR_MESSAGES[code] ??
        "Terjadi kesalahan saat mengakses file.",
      originalCode,
    };
  }

  if (error instanceof Error) {
    return {
      code: "unknown",
      message:
        error.message ||
        "Terjadi kesalahan saat mengakses file.",
    };
  }

  return {
    code: "unknown",
    message:
      "Terjadi kesalahan saat mengakses file.",
  };
};

const safeStorageCall = async <T>(
  operation: () => Promise<T>
): Promise<StorageOperationResult<T>> => {
  try {
    const data = await operation();

    return {
      success: true,
      data,
    };
  } catch (error) {
    return {
      success: false,
      error: normalizeStorageError(error),
    };
  }
};

/* -------------------------------------------------------------------------- */
/* Browser Guard                                                              */
/* -------------------------------------------------------------------------- */

/**
 * File objects are browser APIs.
 *
 * This guard allows the module to remain importable in Astro
 * build / server environments without attempting browser-only work.
 */
export const isBrowser = (): boolean => {
  return typeof window !== "undefined";
};

/* -------------------------------------------------------------------------- */
/* Path Helpers                                                               */
/* -------------------------------------------------------------------------- */

/**
 * Normalize a Storage path.
 *
 * Prevents accidental:
 * - leading slash
 * - trailing slash
 * - duplicated separators
 * - empty path segments caused by whitespace
 */
export const normalizeStoragePath = (
  path: string
): string => {
  const normalized = path
    .trim()
    .replace(/\\/g, "/")
    .replace(/^\/+|\/+$/g, "")
    .replace(/\/{2,}/g, "/");

  if (!normalized) {
    throw new Error(
      "Storage path tidak boleh kosong."
    );
  }

  if (normalized.includes("..")) {
    throw new Error(
      "Storage path tidak boleh menggunakan parent traversal."
    );
  }

  return normalized;
};

/**
 * Get a Storage reference from a path.
 */
export const getStorageRef = (
  path: string
): StorageReference => {
  return ref(
    firebaseStorage,
    normalizeStoragePath(path)
  );
};

/**
 * Sanitize a filename while preserving its extension.
 */
export const sanitizeFileName = (
  fileName: string
): string => {
  const normalized =
    fileName
      .trim()
      .normalize("NFKC")
      .replace(/[^\w.\-() ]/g, "_")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");

  const safeName =
    normalized || "file";

  return safeName.slice(0, 180);
};

/**
 * Get lowercase extension without ".".
 */
export const getFileExtension = (
  fileName: string
): string => {
  const cleanName =
    fileName
      .trim()
      .toLowerCase();

  const dotIndex =
    cleanName.lastIndexOf(".");

  if (
    dotIndex <= 0 ||
    dotIndex === cleanName.length - 1
  ) {
    return "";
  }

  return cleanName.slice(
    dotIndex + 1
  );
};

/**
 * Generate a simple client-side unique identifier.
 */
export const createStorageId = (): string => {
  if (
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID === "function"
  ) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 12)}`;
};

/**
 * Create a safe unique storage filename.
 */
export const createUniqueFileName = (
  originalFileName: string
): string => {
  const safeName =
    sanitizeFileName(originalFileName);

  const extension =
    getFileExtension(safeName);

  const withoutExtension =
    extension
      ? safeName.slice(
          0,
          -(extension.length + 1)
        )
      : safeName;

  const id =
    createStorageId();

  return extension
    ? `${withoutExtension}-${id}.${extension}`
    : `${withoutExtension}-${id}`;
};

/* -------------------------------------------------------------------------- */
/* File Validation                                                            */
/* -------------------------------------------------------------------------- */

export const validateFile = (
  file: File,
  options: FileValidationOptions = {}
): StorageOperationResult<ValidatedFile> => {
  const {
    maxBytes,
    allowedMimeTypes,
    allowedExtensions,
  } = options;

  if (!(file instanceof File)) {
    return {
      success: false,
      error: {
        code: "invalid-file",
        message:
          "File yang diberikan tidak valid.",
      },
    };
  }

  if (file.size <= 0) {
    return {
      success: false,
      error: {
        code: "empty-file",
        message:
          "File tidak boleh kosong.",
      },
    };
  }

  if (
    typeof maxBytes === "number" &&
    file.size > maxBytes
  ) {
    return {
      success: false,
      error: {
        code: "file-too-large",
        message:
          `Ukuran file melebihi batas ${formatBytes(maxBytes)}.`,
      },
    };
  }

  const mimeType =
    file.type
      .trim()
      .toLowerCase();

  if (
    allowedMimeTypes &&
    !allowedMimeTypes.includes(
      mimeType
    )
  ) {
    return {
      success: false,
      error: {
        code: "unsupported-type",
        message:
          "Format file tidak didukung.",
      },
    };
  }

  const extension =
    getFileExtension(file.name);

  if (
    allowedExtensions &&
    !allowedExtensions.includes(
      extension
    )
  ) {
    return {
      success: false,
      error: {
        code: "unsupported-extension",
        message:
          "Ekstensi file tidak didukung.",
      },
    };
  }

  return {
    success: true,
    data: {
      file,
      name: sanitizeFileName(
        file.name
      ),
      extension,
      mimeType,
      size: file.size,
    },
  };
};

export const validateImageFile = (
  file: File,
  options: {
    maxBytes?: number;
    allowSvg?: boolean;
  } = {}
): StorageOperationResult<ValidatedFile> => {
  const allowedMimeTypes =
    options.allowSvg
      ? MIME_TYPES.imageWithSvg
      : MIME_TYPES.image;

  return validateFile(file, {
    maxBytes:
      options.maxBytes ??
      MAX_FILE_SIZE.reportPhoto,
    allowedMimeTypes,
  });
};

/* -------------------------------------------------------------------------- */
/* Upload                                                                     */
/* -------------------------------------------------------------------------- */

/**
 * Upload a file/blob in one operation.
 *
 * Best for relatively small files such as logos or standard report photos.
 */
export const uploadFile = async (
  options: UploadOptions
): Promise<
  StorageOperationResult<UploadResult>
> => {
  const normalizedPath =
    normalizeStoragePath(
      options.path
    );

  if (
    typeof Blob !== "undefined" &&
    options.file instanceof Blob
  ) {
    if (options.file.size <= 0) {
      return {
        success: false,
        error: {
          code: "empty-file",
          message:
            "File tidak boleh kosong.",
        },
      };
    }
  }

  const storageRef =
    getStorageRef(
      normalizedPath
    );

  return safeStorageCall(
    async () => {
      const snapshot =
        await uploadBytes(
          storageRef,
          options.file,
          options.metadata
        );

      const metadata =
        await getMetadata(
          snapshot.ref
        );

      const downloadURL =
        await getDownloadURL(
          snapshot.ref
        );

      return {
        path: normalizedPath,
        name: snapshot.ref.name,
        fullPath:
          snapshot.ref.fullPath,
        downloadURL,
        metadata,
      };
    }
  );
};

/* -------------------------------------------------------------------------- */
/* Resumable Upload                                                           */
/* -------------------------------------------------------------------------- */

/**
 * Start a resumable upload.
 *
 * The returned UploadTask can be used by UI code for:
 * - pause()
 * - resume()
 * - cancel()
 *
 * This function intentionally does not wrap the task in a Promise because
 * consumers often need live progress state.
 */
export const uploadFileResumable = (
  options: ResumableUploadOptions
): UploadTask => {
  const normalizedPath =
    normalizeStoragePath(
      options.path
    );

  const storageRef =
    getStorageRef(
      normalizedPath
    );

  const task =
    uploadBytesResumable(
      storageRef,
      options.file,
      options.metadata
    );

  task.on(
    "state_changed",
    (snapshot) => {
      const totalBytes =
        snapshot.totalBytes;

      const bytesTransferred =
        snapshot.bytesTransferred;

      const percentage =
        totalBytes > 0
          ? Math.round(
              (bytesTransferred /
                totalBytes) *
                100
            )
          : 0;

      let state:
        | "running"
        | "paused"
        | "success"
        | "canceled"
        | "error";

      switch (snapshot.state) {
        case "paused":
          state = "paused";
          break;

        case "running":
          state = "running";
          break;

        default:
          state = "running";
      }

      options.onProgress?.({
        bytesTransferred,
        totalBytes,
        percentage,
        state,
      });
    },
    (error) => {
      options.onError?.(
        normalizeStorageError(error)
      );
    },
    async () => {
      try {
        const metadata =
          await getMetadata(
            task.snapshot.ref
          );

        const downloadURL =
          await getDownloadURL(
            task.snapshot.ref
          );

        const result: UploadResult = {
          path: normalizedPath,
          name:
            task.snapshot.ref.name,
          fullPath:
            task.snapshot.ref.fullPath,
          downloadURL,
          metadata,
        };

        options.onProgress?.({
          bytesTransferred:
            task.snapshot
              .totalBytes,
          totalBytes:
            task.snapshot
              .totalBytes,
          percentage: 100,
          state: "success",
        });

        options.onComplete?.(
          result
        );
      } catch (error) {
        options.onError?.(
          normalizeStorageError(
            error
          )
        );
      }
    }
  );

  return task;
};

/**
 * Promise-based resumable upload helper.
 *
 * Useful when the caller only needs the final result while still receiving
 * progress callbacks.
 */
export const uploadFileWithProgress =
  (
    options: ResumableUploadOptions
  ): Promise<
    StorageOperationResult<UploadResult>
  > => {
    return new Promise(
      (resolve) => {
        let completed = false;

        const resolveOnce = (
          result:
            | StorageOperationResult<UploadResult>
        ) => {
          if (completed) {
            return;
          }

          completed = true;
          resolve(result);
        };

        const task =
          uploadFileResumable({
            ...options,

            onComplete: (result) => {
              options.onComplete?.(
                result
              );

              resolveOnce({
                success: true,
                data: result,
              });
            },

            onError: (error) => {
              options.onError?.(
                error
              );

              resolveOnce({
                success: false,
                error,
              });
            },
          });

        /**
         * If the task is canceled, Firebase reports it through onError.
         * Keeping this reference here also makes the helper easy to debug.
         */
        void task;
      }
    );
  };

/* -------------------------------------------------------------------------- */
/* File Access                                                                */
/* -------------------------------------------------------------------------- */

/**
 * Get a public Firebase download URL for an object.
 *
 * Firebase Storage rules still control whether this operation is allowed.
 */
export const getFileDownloadURL =
  async (
    path: string
  ): Promise<
    StorageOperationResult<string>
  > => {
    return safeStorageCall(
      () =>
        getDownloadURL(
          getStorageRef(path)
        )
    );
  };

/**
 * Get raw Firebase Storage metadata.
 */
export const getFileMetadata =
  async (
    path: string
  ): Promise<
    StorageOperationResult<FullMetadata>
  > => {
    return safeStorageCall(
      () =>
        getMetadata(
          getStorageRef(path)
        )
    );
  };

/**
 * Return a normalized application-level file object.
 */
export const getFileInfo = async (
  path: string
): Promise<
  StorageOperationResult<StorageFile>
> => {
  const normalizedPath =
    normalizeStoragePath(path);

  const metadataResult =
    await getFileMetadata(
      normalizedPath
    );

  if (
    !metadataResult.success
  ) {
    return metadataResult;
  }

  const urlResult =
    await getFileDownloadURL(
      normalizedPath
    );

  if (!urlResult.success) {
    return urlResult;
  }

  return {
    success: true,
    data: {
      name:
        metadataResult.data.name,
      fullPath:
        metadataResult.data.fullPath,
      bucket:
        metadataResult.data.bucket,
      contentType:
        metadataResult.data.contentType,
      size:
        metadataResult.data.size,
      updatedAt:
        metadataResult.data.updated,
      createdAt:
        metadataResult.data.timeCreated,
      downloadURL:
        urlResult.data,
    },
  };
};

/* -------------------------------------------------------------------------- */
/* Delete                                                                     */
/* -------------------------------------------------------------------------- */

export const deleteFile = async (
  path: string
): Promise<StorageOperationResult<void>> => {
  const result =
    await safeStorageCall(() =>
      deleteObject(
        getStorageRef(path)
      )
    );

  if (!result.success) {
    return result;
  }

  return {
    success: true,
    data: undefined,
  };
};

/* -------------------------------------------------------------------------- */
/* Domain Path Builders                                                       */
/* -------------------------------------------------------------------------- */

/**
 * Standardized BINSIGHT Storage paths.
 *
 * Keeping these in one place prevents different pages from inventing
 * inconsistent folder structures.
 */

export const storagePaths = {
  reportPhoto: (
    reportId: string,
    fileName: string
  ): string =>
    `reports/${sanitizePathSegment(
      reportId
    )}/photos/${createUniqueFileName(
      fileName
    )}`,

  organizationLogo: (
    organizationId: string,
    fileName: string
  ): string =>
    `organizations/${sanitizePathSegment(
      organizationId
    )}/logo/${createUniqueFileName(
      fileName
    )}`,

  organizationImage: (
    organizationId: string,
    fileName: string
  ): string =>
    `organizations/${sanitizePathSegment(
      organizationId
    )}/images/${createUniqueFileName(
      fileName
    )}`,

  wasteImage: (
    wasteSlug: string,
    fileName: string
  ): string =>
    `waste/${sanitizePathSegment(
      wasteSlug
    )}/images/${createUniqueFileName(
      fileName
    )}`,

  contentImage: (
    contentId: string,
    fileName: string
  ): string =>
    `content/${sanitizePathSegment(
      contentId
    )}/images/${createUniqueFileName(
      fileName
    )}`,
};

/**
 * Protect dynamic IDs used inside paths.
 */
export const sanitizePathSegment = (
  value: string
): string => {
  return value
    .trim()
    .replace(/\\/g, "-")
    .replace(/\//g, "-")
    .replace(/\.\./g, "-")
    .replace(/[^\w\-:.]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 120);
};

/* -------------------------------------------------------------------------- */
/* Formatting                                                                 */
/* -------------------------------------------------------------------------- */

export const formatBytes = (
  bytes: number,
  decimals = 1
): string => {
  if (!Number.isFinite(bytes)) {
    return "0 B";
  }

  if (bytes <= 0) {
    return "0 B";
  }

  const units = [
    "B",
    "KB",
    "MB",
    "GB",
    "TB",
  ];

  const index = Math.min(
    Math.floor(
      Math.log(bytes) /
        Math.log(1024)
    ),
    units.length - 1
  );

  const value =
    bytes /
    Math.pow(1024, index);

  return `${value.toFixed(
    index === 0
      ? 0
      : Math.max(0, decimals)
  )} ${units[index]}`;
};

/* -------------------------------------------------------------------------- */
/* Recommended Upload Configurations                                         */
/* -------------------------------------------------------------------------- */

export const uploadPolicies = {
  reportPhoto: {
    maxBytes:
      MAX_FILE_SIZE.reportPhoto,
    allowedMimeTypes:
      MIME_TYPES.image,
  },

  organizationLogo: {
    maxBytes:
      MAX_FILE_SIZE.organizationLogo,
    allowedMimeTypes:
      MIME_TYPES.imageWithSvg,
  },

  organizationImage: {
    maxBytes:
      MAX_FILE_SIZE.organizationImage,
    allowedMimeTypes:
      MIME_TYPES.image,
  },

  wasteImage: {
    maxBytes:
      MAX_FILE_SIZE.wasteImage,
    allowedMimeTypes:
      MIME_TYPES.image,
  },
} as const;

/**
 * Validate according to a standard BINSIGHT upload policy.
 */
export const validateForUpload = (
  file: File,
  policy:
    | keyof typeof uploadPolicies
): StorageOperationResult<ValidatedFile> => {
  const configuration =
    uploadPolicies[policy];

  return validateFile(
    file,
    configuration
  );
};

/* -------------------------------------------------------------------------- */
/* Default Service                                                            */
/* -------------------------------------------------------------------------- */

const storageService =
  Object.freeze({
    isBrowser,

    normalizeStoragePath,
    sanitizeFileName,
    sanitizePathSegment,
    getFileExtension,
    createStorageId,
    createUniqueFileName,

    validateFile,
    validateImageFile,
    validateForUpload,

    uploadFile,
    uploadFileResumable,
    uploadFileWithProgress,

    getFileDownloadURL,
    getFileMetadata,
    getFileInfo,

    deleteFile,

    getStorageRef,

    storagePaths,
    uploadPolicies,

    formatBytes,
  });

export {
  firebaseStorage,
};

export default storageService;