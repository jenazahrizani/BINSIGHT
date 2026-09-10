/**
 * BINSIGHT — FIRESTORE DATA ACCESS
 * --------------------------------------------------------------------------
 * Central Firestore service layer.
 *
 * Responsibilities:
 * - Typed document reads
 * - Collection reads
 * - Query helpers
 * - Document creation
 * - Document updates
 * - Document deletion
 * - Batched writes
 * - Transactions
 * - Pagination with cursors
 * - Realtime subscriptions
 * - Timestamp normalization helpers
 *
 * Architecture:
 *
 *   UI / Pages
 *        │
 *        ▼
 *   src/lib/data/*
 *        │
 *        ▼
 *   src/lib/firebase/firestore.ts
 *        │
 *        ▼
 *   Firebase Firestore
 *
 * This file intentionally does NOT:
 * - define application roles
 * - implement authorization
 * - contain page-specific business logic
 * - hard-code organization / waste / report schemas
 *
 * Authorization remains enforced by:
 * - Firebase Authentication
 * - Firestore Security Rules
 * - src/lib/auth/*
 * --------------------------------------------------------------------------
 */

import {
  collection,
  deleteDoc,
  doc,
  documentId,
  getCountFromServer,
  getDoc,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  runTransaction,
  serverTimestamp,
  setDoc,
  startAfter,
  Timestamp,
  updateDoc,
  where,
  writeBatch,
  type CollectionReference,
  type DocumentData,
  type DocumentReference,
  type DocumentSnapshot,
  type QueryConstraint,
  type QueryDocumentSnapshot,
  type SetOptions,
  type Transaction,
  type Unsubscribe,
  type WhereFilterOp,
} from "firebase/firestore";

import {
  firebaseFirestore,
} from "@lib/firebase/config";

/* -------------------------------------------------------------------------- */
/* Public Types                                                               */
/* -------------------------------------------------------------------------- */

export type FirestoreScalar =
  | string
  | number
  | boolean
  | null
  | Timestamp
  | Date;

export type FirestoreValue =
  | FirestoreScalar
  | FirestoreValue[]
  | {
      [key: string]: FirestoreValue;
    };

export type FirestoreRecord =
  Record<string, unknown>;

export interface FirestoreDocument<
  T extends DocumentData
> {
  id: string;
  data: T;
}

export interface FirestoreDocumentWithMeta<
  T extends DocumentData
> extends FirestoreDocument<T> {
  ref: DocumentReference<T>;
  exists: true;
}

export interface FirestoreQueryResult<
  T extends DocumentData
> {
  items: Array<FirestoreDocument<T>>;
  snapshot: Awaited<
    ReturnType<typeof getDocs>
  >;
}

export interface PaginationOptions {
  pageSize?: number;
  cursor?: QueryDocumentSnapshot<DocumentData>;
}

export interface FirestorePaginationResult<
  T extends DocumentData
> {
  items: Array<FirestoreDocument<T>>;
  nextCursor:
    | QueryDocumentSnapshot<DocumentData>
    | null;
  hasMore: boolean;
}

export interface QueryFilter {
  field: string;
  operator: WhereFilterOp;
  value: unknown;
}

export interface OrderByConfig {
  field: string;
  direction?: "asc" | "desc";
}

export type FirestoreWriteResult =
  | {
      success: true;
    }
  | {
      success: false;
      error: FirestoreServiceError;
    };

export type FirestoreResult<T> =
  | {
      success: true;
      data: T;
    }
  | {
      success: false;
      error: FirestoreServiceError;
    };

export interface FirestoreServiceError {
  code: string;
  message: string;
  originalCode?: string;
}

/* -------------------------------------------------------------------------- */
/* Constants                                                                  */
/* -------------------------------------------------------------------------- */

const DEFAULT_PAGE_SIZE = 25;

const MAX_PAGE_SIZE = 100;

/* -------------------------------------------------------------------------- */
/* Error Normalization                                                        */
/* -------------------------------------------------------------------------- */

const FIRESTORE_ERROR_MESSAGES: Record<
  string,
  string
> = {
  "permission-denied":
    "Anda tidak memiliki izin untuk mengakses data ini.",

  unauthenticated:
    "Anda harus login untuk melakukan tindakan ini.",

  "not-found":
    "Data yang diminta tidak ditemukan.",

  "already-exists":
    "Data tersebut sudah ada.",

  aborted:
    "Operasi dibatalkan. Silakan coba lagi.",

  "failed-precondition":
    "Operasi tidak dapat dilakukan karena kondisi data belum terpenuhi.",

  unavailable:
    "Layanan data sedang tidak tersedia. Silakan coba lagi.",

  "deadline-exceeded":
    "Permintaan data terlalu lama. Silakan coba lagi.",

  "resource-exhausted":
    "Batas penggunaan layanan telah tercapai.",

  "invalid-argument":
    "Parameter data tidak valid.",

  "out-of-range":
    "Parameter berada di luar rentang yang valid.",

  cancelled:
    "Operasi dibatalkan.",

  "data-loss":
    "Terjadi kehilangan atau kerusakan data.",

  internal:
    "Terjadi kesalahan internal pada layanan data.",

  unknown:
    "Terjadi kesalahan saat mengakses data.",
};

const normalizeFirestoreError = (
  error: unknown
): FirestoreServiceError => {
  if (
    typeof error === "object" &&
    error !== null &&
    "code" in error
  ) {
    const firebaseError =
      error as {
        code?: unknown;
        message?: unknown;
      };

    const rawCode =
      typeof firebaseError.code === "string"
        ? firebaseError.code
        : "unknown";

    const code =
      rawCode.replace(
        /^firestore\//,
        ""
      );

    return {
      code,
      message:
        FIRESTORE_ERROR_MESSAGES[code] ??
        "Terjadi kesalahan saat mengakses data.",
      originalCode: rawCode,
    };
  }

  if (error instanceof Error) {
    return {
      code: "unknown",
      message:
        error.message ||
        "Terjadi kesalahan saat mengakses data.",
    };
  }

  return {
    code: "unknown",
    message:
      "Terjadi kesalahan saat mengakses data.",
  };
};

const safeFirestoreCall = async <T>(
  operation: () => Promise<T>
): Promise<FirestoreResult<T>> => {
  try {
    const data = await operation();

    return {
      success: true,
      data,
    };
  } catch (error) {
    return {
      success: false,
      error: normalizeFirestoreError(error),
    };
  }
};

/* -------------------------------------------------------------------------- */
/* Path Helpers                                                               */
/* -------------------------------------------------------------------------- */

export const normalizeCollectionPath = (
  path: string
): string => {
  const normalized = path
    .trim()
    .replace(/^\/+|\/+$/g, "");

  if (!normalized) {
    throw new Error(
      "Firestore collection path tidak boleh kosong."
    );
  }

  return normalized;
};

export const normalizeDocumentPath = (
  path: string
): string => {
  const normalized = path
    .trim()
    .replace(/^\/+|\/+$/g, "");

  if (!normalized) {
    throw new Error(
      "Firestore document path tidak boleh kosong."
    );
  }

  const segmentCount =
    normalized.split("/").length;

  if (segmentCount % 2 !== 0) {
    throw new Error(
      `Firestore document path tidak valid: "${path}".`
    );
  }

  return normalized;
};

const getCollectionReference = <
  T extends DocumentData
>(
  path: string
): CollectionReference<T> => {
  const normalized =
    normalizeCollectionPath(path);

  return collection(
    firebaseFirestore,
    normalized
  ) as CollectionReference<T>;
};

const getDocumentReference = <
  T extends DocumentData
>(
  path: string
): DocumentReference<T> => {
  const normalized =
    normalizeDocumentPath(path);

  return doc(
    firebaseFirestore,
    normalized
  ) as DocumentReference<T>;
};

/* -------------------------------------------------------------------------- */
/* Timestamp Helpers                                                          */
/* -------------------------------------------------------------------------- */

export const toTimestamp = (
  value: Date
): Timestamp => {
  return Timestamp.fromDate(value);
};

export const toDate = (
  value:
    | Timestamp
    | Date
    | null
    | undefined
): Date | null => {
  if (!value) {
    return null;
  }

  if (value instanceof Date) {
    return value;
  }

  if (value instanceof Timestamp) {
    return value.toDate();
  }

  return null;
};

export const isTimestamp = (
  value: unknown
): value is Timestamp => {
  return value instanceof Timestamp;
};

export const firestoreServerTimestamp =
  () => serverTimestamp();

/* -------------------------------------------------------------------------- */
/* Document Reads                                                             */
/* -------------------------------------------------------------------------- */

export const getDocument = async <
  T extends DocumentData
>(
  path: string
): Promise<
  FirestoreResult<
    FirestoreDocumentWithMeta<T> | null
  >
> => {
  return safeFirestoreCall(
    async () => {
      const reference =
        getDocumentReference<T>(path);

      const snapshot =
        await getDoc(reference);

      if (!snapshot.exists()) {
        return null;
      }

      return {
        id: snapshot.id,
        data: snapshot.data(),
        ref: reference,
        exists: true as const,
      };
    }
  );
};

export const getDocumentById = async <
  T extends DocumentData
>(
  collectionPath: string,
  id: string
): Promise<
  FirestoreResult<
    FirestoreDocumentWithMeta<T> | null
  >
> => {
  const cleanCollection =
    normalizeCollectionPath(
      collectionPath
    );

  const cleanId = id.trim();

  if (!cleanId) {
    return {
      success: false,
      error: {
        code: "invalid-id",
        message:
          "Document ID tidak boleh kosong.",
      },
    };
  }

  return getDocument<T>(
    `${cleanCollection}/${cleanId}`
  );
};

/* -------------------------------------------------------------------------- */
/* Collection Reads                                                           */
/* -------------------------------------------------------------------------- */

export const getCollection = async <
  T extends DocumentData
>(
  collectionPath: string,
  constraints: QueryConstraint[] = []
): Promise<
  FirestoreResult<Array<FirestoreDocument<T>>>
> => {
  return safeFirestoreCall(
    async () => {
      const reference =
        getCollectionReference<T>(
          collectionPath
        );

      const collectionQuery =
        constraints.length > 0
          ? query(
              reference,
              ...constraints
            )
          : reference;

      const snapshot =
        await getDocs(
          collectionQuery
        );

      return snapshot.docs.map(
        (document) => ({
          id: document.id,
          data: document.data(),
        })
      );
    }
  );
};

export const queryCollection = async <
  T extends DocumentData
>(
  collectionPath: string,
  options?: {
    filters?: QueryFilter[];
    orderBy?: OrderByConfig[];
    limit?: number;
  }
): Promise<
  FirestoreResult<Array<FirestoreDocument<T>>>
> => {
  return safeFirestoreCall(
    async () => {
      const reference =
        getCollectionReference<T>(
          collectionPath
        );

      const constraints: QueryConstraint[] =
        [];

      for (
        const filter of
          options?.filters ?? []
      ) {
        constraints.push(
          where(
            filter.field,
            filter.operator,
            filter.value
          )
        );
      }

      for (
        const sorting of
          options?.orderBy ?? []
      ) {
        constraints.push(
          orderBy(
            sorting.field,
            sorting.direction ?? "asc"
          )
        );
      }

      if (
        typeof options?.limit ===
        "number"
      ) {
        constraints.push(
          limit(
            normalizePageSize(
              options.limit
            )
          )
        );
      }

      const collectionQuery =
        constraints.length > 0
          ? query(
              reference,
              ...constraints
            )
          : reference;

      const snapshot =
        await getDocs(
          collectionQuery
        );

      return snapshot.docs.map(
        (document) => ({
          id: document.id,
          data: document.data(),
        })
      );
    }
  );
};

/* -------------------------------------------------------------------------- */
/* Pagination                                                                 */
/* -------------------------------------------------------------------------- */

const normalizePageSize = (
  value?: number
): number => {
  const requested =
    value ?? DEFAULT_PAGE_SIZE;

  if (
    !Number.isFinite(requested) ||
    requested <= 0
  ) {
    return DEFAULT_PAGE_SIZE;
  }

  return Math.min(
    Math.floor(requested),
    MAX_PAGE_SIZE
  );
};

export const getCollectionPage =
  async <T extends DocumentData>(
    collectionPath: string,
    options?: PaginationOptions & {
      filters?: QueryFilter[];
      orderBy?: OrderByConfig[];
    }
  ): Promise<
    FirestoreResult<
      FirestorePaginationResult<T>
    >
  > => {
    return safeFirestoreCall(
      async () => {
        const reference =
          getCollectionReference<T>(
            collectionPath
          );

        const constraints: QueryConstraint[] =
          [];

        for (
          const filter of
            options?.filters ?? []
        ) {
          constraints.push(
            where(
              filter.field,
              filter.operator,
              filter.value
            )
          );
        }

        const ordering =
          options?.orderBy ?? [
            {
              field: "__name__",
              direction:
                "asc" as const,
            },
          ];

        for (const sorting of ordering) {
          constraints.push(
            orderBy(
              sorting.field,
              sorting.direction ?? "asc"
            )
          );
        }

        if (options?.cursor) {
          constraints.push(
            startAfter(
              options.cursor
            )
          );
        }

        const pageSize =
          normalizePageSize(
            options?.pageSize
          );

        constraints.push(
          limit(pageSize + 1)
        );

        const collectionQuery =
          query(
            reference,
            ...constraints
          );

        const snapshot =
          await getDocs(
            collectionQuery
          );

        const hasMore =
          snapshot.docs.length >
          pageSize;

        const pageDocs = hasMore
          ? snapshot.docs.slice(
              0,
              pageSize
            )
          : snapshot.docs;

        const lastDocument =
          pageDocs[
            pageDocs.length - 1
          ];

        const nextCursor =
          hasMore && lastDocument
            ? lastDocument
            : null;

        return {
          items: pageDocs.map(
            (document) => ({
              id: document.id,
              data: document.data(),
            })
          ),
          nextCursor,
          hasMore,
        };
      }
    );
  };

/* -------------------------------------------------------------------------- */
/* Count                                                                      */
/* -------------------------------------------------------------------------- */

export const countCollection = async (
  collectionPath: string,
  constraints: QueryConstraint[] = []
): Promise<FirestoreResult<number>> => {
  return safeFirestoreCall(
    async () => {
      const reference =
        getCollectionReference(
          collectionPath
        );

      const collectionQuery =
        constraints.length > 0
          ? query(
              reference,
              ...constraints
            )
          : reference;

      const aggregate =
        await getCountFromServer(
          collectionQuery
        );

      return aggregate.data().count;
    }
  );
};

/* -------------------------------------------------------------------------- */
/* Writes                                                                     */
/* -------------------------------------------------------------------------- */

export const setDocument = async <
  T extends DocumentData
>(
  path: string,
  data: T,
  options?: SetOptions
): Promise<FirestoreWriteResult> => {
  const result =
    options === undefined
      ? await safeFirestoreCall(() =>
          setDoc(
            getDocumentReference<T>(
              path
            ),
            data
          )
        )
      : await safeFirestoreCall(() =>
          setDoc(
            getDocumentReference<T>(
              path
            ),
            data,
            options
          )
        );

  return result.success
    ? { success: true }
    : result;
};

export const createDocumentById =
  async <T extends DocumentData>(
    collectionPath: string,
    id: string,
    data: T
  ): Promise<FirestoreWriteResult> => {
    const cleanId = id.trim();

    if (!cleanId) {
      return {
        success: false,
        error: {
          code: "invalid-id",
          message:
            "Document ID tidak boleh kosong.",
        },
      };
    }

    return setDocument<T>(
      `${normalizeCollectionPath(
        collectionPath
      )}/${cleanId}`,
      data
    );
  };

export const updateDocument = async (
  path: string,
  data: Record<string, unknown>
): Promise<FirestoreWriteResult> => {
  if (
    Object.keys(data).length === 0
  ) {
    return {
      success: false,
      error: {
        code: "empty-update",
        message:
          "Data pembaruan tidak boleh kosong.",
      },
    };
  }

  const result =
    await safeFirestoreCall(() =>
      updateDoc(
        getDocumentReference(path),
        data
      )
    );

  return result.success
    ? { success: true }
    : result;
};

export const deleteDocument = async (
  path: string
): Promise<FirestoreWriteResult> => {
  const result =
    await safeFirestoreCall(() =>
      deleteDoc(
        getDocumentReference(path)
      )
    );

  return result.success
    ? { success: true }
    : result;
};

/* -------------------------------------------------------------------------- */
/* Batch Writes                                                               */
/* -------------------------------------------------------------------------- */

export const commitBatch = async (
  operations: Array<
    | {
        type: "set";
        path: string;
        data: DocumentData;
        options?: SetOptions;
      }
    | {
        type: "update";
        path: string;
        data: Record<string, unknown>;
      }
    | {
        type: "delete";
        path: string;
      }
  >
): Promise<FirestoreWriteResult> => {
  if (operations.length === 0) {
    return {
      success: false,
      error: {
        code: "empty-batch",
        message:
          "Batch tidak boleh kosong.",
      },
    };
  }

  const result =
    await safeFirestoreCall(
      async () => {
        const batch =
          writeBatch(
            firebaseFirestore
          );

        for (const operation of operations) {
          const reference =
            getDocumentReference(
              operation.path
            );

          if (
            operation.type === "set"
          ) {
            if (
              operation.options ===
              undefined
            ) {
              batch.set(
                reference,
                operation.data
              );
            } else {
              batch.set(
                reference,
                operation.data,
                operation.options
              );
            }

            continue;
          }

          if (
            operation.type === "update"
          ) {
            batch.update(
              reference,
              operation.data
            );

            continue;
          }

          batch.delete(reference);
        }

        await batch.commit();
      }
    );

  return result.success
    ? { success: true }
    : result;
};

/* -------------------------------------------------------------------------- */
/* Transactions                                                               */
/* -------------------------------------------------------------------------- */

export const runFirestoreTransaction =
  async <T>(
    callback: (
      transaction: Transaction
    ) => Promise<T> | T
  ): Promise<
    FirestoreResult<T>
  > => {
    return safeFirestoreCall(
      () =>
        runTransaction(
          firebaseFirestore,
          async (transaction) => {
            return await callback(
              transaction
            );
          }
        )
    );
  };

/* -------------------------------------------------------------------------- */
/* Realtime Subscriptions                                                     */
/* -------------------------------------------------------------------------- */

export const subscribeToDocument = <
  T extends DocumentData
>(
  path: string,
  callback: (
    document:
      | FirestoreDocument<T>
      | null,
    error?: FirestoreServiceError
  ) => void
): Unsubscribe => {
  const reference =
    getDocumentReference<T>(path);

  return onSnapshot(
    reference,
    (snapshot) => {
      if (!snapshot.exists()) {
        callback(null);
        return;
      }

      callback({
        id: snapshot.id,
        data: snapshot.data(),
      });
    },
    (error) => {
      callback(
        null,
        normalizeFirestoreError(
          error
        )
      );
    }
  );
};

export const subscribeToCollection =
  <T extends DocumentData>(
    collectionPath: string,
    constraints: QueryConstraint[] = [],
    callback: (
      documents: Array<
        FirestoreDocument<T>
      >,
      error?: FirestoreServiceError
    ) => void
  ): Unsubscribe => {
    const reference =
      getCollectionReference<T>(
        collectionPath
      );

    const collectionQuery =
      constraints.length > 0
        ? query(
            reference,
            ...constraints
          )
        : reference;

    return onSnapshot(
      collectionQuery,
      (snapshot) => {
        callback(
          snapshot.docs.map(
            (document) => ({
              id: document.id,
              data: document.data(),
            })
          )
        );
      },
      (error) => {
        callback(
          [],
          normalizeFirestoreError(
            error
          )
        );
      }
    );
  };

/* -------------------------------------------------------------------------- */
/* Query Helpers                                                              */
/* -------------------------------------------------------------------------- */

export const buildQueryConstraints = (
  options?: {
    filters?: QueryFilter[];
    orderBy?: OrderByConfig[];
    limit?: number;
  }
): QueryConstraint[] => {
  const constraints: QueryConstraint[] =
    [];

  for (
    const filter of
      options?.filters ?? []
  ) {
    constraints.push(
      where(
        filter.field,
        filter.operator,
        filter.value
      )
    );
  }

  for (
    const sorting of
      options?.orderBy ?? []
  ) {
    constraints.push(
      orderBy(
        sorting.field,
        sorting.direction ?? "asc"
      )
    );
  }

  if (
    typeof options?.limit === "number"
  ) {
    constraints.push(
      limit(
        normalizePageSize(
          options.limit
        )
      )
    );
  }

  return constraints;
};

export const whereDocumentId = (
  operator: WhereFilterOp,
  value: unknown
): QueryConstraint => {
  return where(
    documentId(),
    operator,
    value
  );
};

/* -------------------------------------------------------------------------- */
/* Document Mapping                                                           */
/* -------------------------------------------------------------------------- */

export const mapDocument = <
  T extends DocumentData
>(
  snapshot: DocumentSnapshot<T>
): FirestoreDocument<T> | null => {
  if (!snapshot.exists()) {
    return null;
  }

  return {
    id: snapshot.id,
    data: snapshot.data(),
  };
};

export const mapDocuments = <
  T extends DocumentData
>(
  snapshots: Array<
    QueryDocumentSnapshot<T>
  >
): Array<FirestoreDocument<T>> => {
  return snapshots.map(
    (snapshot) => ({
      id: snapshot.id,
      data: snapshot.data(),
    })
  );
};

/* -------------------------------------------------------------------------- */
/* Collection / Document References                                           */
/* -------------------------------------------------------------------------- */

export const getCollectionRef = <
  T extends DocumentData
>(
  collectionPath: string
): CollectionReference<T> => {
  return getCollectionReference<T>(
    collectionPath
  );
};

export const getDocumentRef = <
  T extends DocumentData
>(
  documentPath: string
): DocumentReference<T> => {
  return getDocumentReference<T>(
    documentPath
  );
};

/* -------------------------------------------------------------------------- */
/* Firestore Instance                                                         */
/* -------------------------------------------------------------------------- */

export {
  firebaseFirestore,
};

/* -------------------------------------------------------------------------- */
/* Default Service                                                            */
/* -------------------------------------------------------------------------- */

const firestoreService = Object.freeze({
  normalizeCollectionPath,
  normalizeDocumentPath,

  getDocument,
  getDocumentById,
  getCollection,
  queryCollection,
  getCollectionPage,
  countCollection,

  setDocument,
  createDocumentById,
  updateDocument,
  deleteDocument,

  commitBatch,
  runFirestoreTransaction,

  subscribeToDocument,
  subscribeToCollection,

  buildQueryConstraints,
  whereDocumentId,

  mapDocument,
  mapDocuments,

  getCollectionRef,
  getDocumentRef,

  toTimestamp,
  toDate,
  isTimestamp,
  firestoreServerTimestamp,
});

export default firestoreService;