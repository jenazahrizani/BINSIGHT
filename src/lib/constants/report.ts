/**
 * BINSIGHT — REPORT CONSTANTS
 * --------------------------------------------------------------------------
 * Single source of truth for the community reporting domain.
 *
 * Used by:
 * - ReportForm.astro
 * - ReportLocation.astro
 * - ReportStatus.astro
 * - ReportCard.astro
 * - Reports pages
 * - Admin reports
 * - Validation helpers
 * - Dashboard report overview
 *
 * Important:
 * - This file contains stable vocabulary / workflow definitions.
 * - This file does NOT contain live report data.
 * - Counts, timestamps, locations, reporters, and actual report records
 *   belong to src/lib/data/reports.ts / Firestore.
 * --------------------------------------------------------------------------
 */

/* -------------------------------------------------------------------------- */
/* Report Category                                                            */
/* -------------------------------------------------------------------------- */

export const REPORT_CATEGORY = {
  ILLEGAL_DUMPING: "illegal-dumping",
  WASTE_ACCUMULATION: "waste-accumulation",
  BURNING: "burning",
  UNSORTED_WASTE: "unsorted-waste",
  WASTE_CONTAINER: "waste-container",
  WASTE_COLLECTION: "waste-collection",
  WASTE_TRANSPORTATION: "waste-transportation",
  WASTE_PROCESSING: "waste-processing",
  HAZARDOUS_WASTE: "hazardous-waste",
  POLLUTION: "pollution",
  OTHER: "other",
} as const;

export type ReportCategory =
  (typeof REPORT_CATEGORY)[keyof typeof REPORT_CATEGORY];

/* -------------------------------------------------------------------------- */
/* Report Status                                                              */
/* -------------------------------------------------------------------------- */

export const REPORT_STATUS = {
  SUBMITTED: "submitted",
  UNDER_REVIEW: "under-review",
  VERIFIED: "verified",
  IN_PROGRESS: "in-progress",
  RESOLVED: "resolved",
  REJECTED: "rejected",
  CLOSED: "closed",
} as const;

export type ReportStatus =
  (typeof REPORT_STATUS)[keyof typeof REPORT_STATUS];

/* -------------------------------------------------------------------------- */
/* Report Priority                                                            */
/* -------------------------------------------------------------------------- */

export const REPORT_PRIORITY = {
  LOW: "low",
  MEDIUM: "medium",
  HIGH: "high",
  CRITICAL: "critical",
} as const;

export type ReportPriority =
  (typeof REPORT_PRIORITY)[keyof typeof REPORT_PRIORITY];

/* -------------------------------------------------------------------------- */
/* Report Visibility                                                          */
/* -------------------------------------------------------------------------- */

export const REPORT_VISIBILITY = {
  PUBLIC: "public",
  INTERNAL: "internal",
  PRIVATE: "private",
} as const;

export type ReportVisibility =
  (typeof REPORT_VISIBILITY)[keyof typeof REPORT_VISIBILITY];

/* -------------------------------------------------------------------------- */
/* Reporter Type                                                              */
/* -------------------------------------------------------------------------- */

export const REPORTER_TYPE = {
  COMMUNITY: "community",
  ORGANIZATION: "organization",
  ADMIN: "admin",
} as const;

export type ReporterType =
  (typeof REPORTER_TYPE)[keyof typeof REPORTER_TYPE];

/* -------------------------------------------------------------------------- */
/* Location Source                                                            */
/* -------------------------------------------------------------------------- */

export const REPORT_LOCATION_SOURCE = {
  MAP_PICKER: "map-picker",
  DEVICE_LOCATION: "device-location",
  MANUAL: "manual",
} as const;

export type ReportLocationSource =
  (typeof REPORT_LOCATION_SOURCE)[keyof typeof REPORT_LOCATION_SOURCE];

/* -------------------------------------------------------------------------- */
/* Verification Status                                                        */
/* -------------------------------------------------------------------------- */

export const REPORT_VERIFICATION = {
  UNVERIFIED: "unverified",
  VERIFIED: "verified",
  REJECTED: "rejected",
} as const;

export type ReportVerification =
  (typeof REPORT_VERIFICATION)[keyof typeof REPORT_VERIFICATION];

/* -------------------------------------------------------------------------- */
/* Attachment Types                                                           */
/* -------------------------------------------------------------------------- */

export const REPORT_ATTACHMENT_TYPE = {
  PHOTO: "photo",
  VIDEO: "video",
  DOCUMENT: "document",
} as const;

export type ReportAttachmentType =
  (typeof REPORT_ATTACHMENT_TYPE)[keyof typeof REPORT_ATTACHMENT_TYPE];

/* -------------------------------------------------------------------------- */
/* Report Workflow                                                            */
/* -------------------------------------------------------------------------- */

export const REPORT_WORKFLOW = {
  SUBMITTED: REPORT_STATUS.SUBMITTED,
  REVIEW: REPORT_STATUS.UNDER_REVIEW,
  VERIFIED: REPORT_STATUS.VERIFIED,
  PROCESSING: REPORT_STATUS.IN_PROGRESS,
  RESOLVED: REPORT_STATUS.RESOLVED,
  REJECTED: REPORT_STATUS.REJECTED,
  CLOSED: REPORT_STATUS.CLOSED,
} as const;

export type ReportWorkflowStatus =
  (typeof REPORT_WORKFLOW)[keyof typeof REPORT_WORKFLOW];

/* -------------------------------------------------------------------------- */
/* Report Category Definition                                                 */
/* -------------------------------------------------------------------------- */

export interface ReportCategoryDefinition {
  id: ReportCategory;
  label: string;
  shortLabel: string;
  description: string;
  guidance: string;
  icon: string;
  order: number;
}

/* -------------------------------------------------------------------------- */
/* Report Status Definition                                                   */
/* -------------------------------------------------------------------------- */

export interface ReportStatusDefinition {
  id: ReportStatus;
  label: string;
  description: string;
  color: string;
  softColor: string;
  icon: string;
  order: number;
  terminal: boolean;
}

/* -------------------------------------------------------------------------- */
/* Report Priority Definition                                                 */
/* -------------------------------------------------------------------------- */

export interface ReportPriorityDefinition {
  id: ReportPriority;
  label: string;
  description: string;
  color: string;
  softColor: string;
  order: number;
}

/* -------------------------------------------------------------------------- */
/* Category Definitions                                                       */
/* -------------------------------------------------------------------------- */

export const REPORT_CATEGORIES: readonly ReportCategoryDefinition[] =
  [
    {
      id: REPORT_CATEGORY.ILLEGAL_DUMPING,
      label: "Pembuangan Sampah Sembarangan",
      shortLabel: "Pembuangan Sembarangan",
      description:
        "Laporan mengenai pembuangan sampah pada lokasi yang tidak semestinya.",
      guidance:
        "Cantumkan lokasi yang jelas dan, bila memungkinkan, foto kondisi di lokasi.",
      icon: "triangle-alert",
      order: 1,
    },

    {
      id: REPORT_CATEGORY.WASTE_ACCUMULATION,
      label: "Penumpukan Sampah",
      shortLabel: "Penumpukan",
      description:
        "Laporan mengenai penumpukan sampah dalam jumlah yang mengganggu kondisi lingkungan.",
      guidance:
        "Jelaskan lokasi dan kondisi penumpukan serta kapan kondisi tersebut terlihat.",
      icon: "layers-3",
      order: 2,
    },

    {
      id: REPORT_CATEGORY.BURNING,
      label: "Pembakaran Sampah",
      shortLabel: "Pembakaran",
      description:
        "Laporan mengenai aktivitas pembakaran sampah yang berpotensi mengganggu lingkungan.",
      guidance:
        "Jelaskan lokasi dan kondisi pembakaran yang terlihat.",
      icon: "flame",
      order: 3,
    },

    {
      id: REPORT_CATEGORY.UNSORTED_WASTE,
      label: "Sampah Tidak Terpilah",
      shortLabel: "Tidak Terpilah",
      description:
        "Laporan mengenai sampah yang tercampur atau tidak dipilah sesuai jalur pengelolaannya.",
      guidance:
        "Sertakan informasi lokasi dan jenis sampah yang terlihat bila diketahui.",
      icon: "list-filter",
      order: 4,
    },

    {
      id: REPORT_CATEGORY.WASTE_CONTAINER,
      label: "Kondisi Tempat Sampah",
      shortLabel: "Tempat Sampah",
      description:
        "Laporan mengenai kondisi tempat sampah, wadah, atau fasilitas penampungan sampah.",
      guidance:
        "Jelaskan masalah yang terlihat seperti kerusakan, kapasitas penuh, atau kondisi lain yang relevan.",
      icon: "container",
      order: 5,
    },

    {
      id: REPORT_CATEGORY.WASTE_COLLECTION,
      label: "Pengumpulan Sampah",
      shortLabel: "Pengumpulan",
      description:
        "Laporan terkait kondisi atau proses pengumpulan sampah di suatu lokasi.",
      guidance:
        "Jelaskan lokasi dan kondisi pengumpulan yang menjadi perhatian.",
      icon: "truck",
      order: 6,
    },

    {
      id: REPORT_CATEGORY.WASTE_TRANSPORTATION,
      label: "Pengangkutan Sampah",
      shortLabel: "Pengangkutan",
      description:
        "Laporan terkait kondisi atau proses pemindahan dan pengangkutan sampah.",
      guidance:
        "Jelaskan lokasi, kondisi, dan informasi yang relevan terhadap pengangkutan.",
      icon: "truck",
      order: 7,
    },

    {
      id: REPORT_CATEGORY.WASTE_PROCESSING,
      label: "Pengelolaan / Pengolahan",
      shortLabel: "Pengolahan",
      description:
        "Laporan mengenai kondisi yang berkaitan dengan pengelolaan atau pengolahan sampah.",
      guidance:
        "Jelaskan kondisi atau persoalan pengelolaan yang ditemukan.",
      icon: "recycle",
      order: 8,
    },

    {
      id: REPORT_CATEGORY.HAZARDOUS_WASTE,
      label: "Sampah Berbahaya / Khusus",
      shortLabel: "Sampah Khusus",
      description:
        "Laporan mengenai material yang memerlukan perhatian atau penanganan khusus.",
      guidance:
        "Jangan menyentuh atau memindahkan material yang diduga berbahaya. Laporkan lokasi dan kondisi dari jarak aman.",
      icon: "shield-alert",
      order: 9,
    },

    {
      id: REPORT_CATEGORY.POLLUTION,
      label: "Pencemaran Lingkungan",
      shortLabel: "Pencemaran",
      description:
        "Laporan mengenai kondisi lingkungan yang diduga berkaitan dengan persoalan persampahan.",
      guidance:
        "Jelaskan lokasi dan kondisi lingkungan yang terlihat secara faktual.",
      icon: "droplets",
      order: 10,
    },

    {
      id: REPORT_CATEGORY.OTHER,
      label: "Lainnya",
      shortLabel: "Lainnya",
      description:
        "Laporan persoalan persampahan yang tidak termasuk kategori lain.",
      guidance:
        "Jelaskan kondisi secara singkat, jelas, dan faktual.",
      icon: "ellipsis",
      order: 11,
    },
  ] as const;

/* -------------------------------------------------------------------------- */
/* Status Definitions                                                         */
/* -------------------------------------------------------------------------- */

export const REPORT_STATUS_DEFINITIONS:
  readonly ReportStatusDefinition[] =
  [
    {
      id: REPORT_STATUS.SUBMITTED,
      label: "Dikirim",
      description:
        "Laporan telah diterima oleh sistem BINSIGHT.",
      color: "#2563EB",
      softColor: "#DBEAFE",
      icon: "send",
      order: 1,
      terminal: false,
    },

    {
      id: REPORT_STATUS.UNDER_REVIEW,
      label: "Sedang Ditinjau",
      description:
        "Laporan sedang diperiksa untuk memastikan informasi yang tersedia.",
      color: "#7C3AED",
      softColor: "#EDE9FE",
      icon: "search-check",
      order: 2,
      terminal: false,
    },

    {
      id: REPORT_STATUS.VERIFIED,
      label: "Terverifikasi",
      description:
        "Laporan telah diverifikasi berdasarkan proses pemeriksaan BINSIGHT.",
      color: "#0891B2",
      softColor: "#CFFAFE",
      icon: "badge-check",
      order: 3,
      terminal: false,
    },

    {
      id: REPORT_STATUS.IN_PROGRESS,
      label: "Sedang Ditangani",
      description:
        "Laporan sedang berada dalam proses tindak lanjut.",
      color: "#D97706",
      softColor: "#FEF3C7",
      icon: "refresh-cw",
      order: 4,
      terminal: false,
    },

    {
      id: REPORT_STATUS.RESOLVED,
      label: "Selesai",
      description:
        "Tindak lanjut laporan telah dinyatakan selesai.",
      color: "#16A34A",
      softColor: "#DCFCE7",
      icon: "circle-check",
      order: 5,
      terminal: true,
    },

    {
      id: REPORT_STATUS.REJECTED,
      label: "Ditolak",
      description:
        "Laporan tidak dapat diverifikasi atau ditindaklanjuti berdasarkan hasil pemeriksaan.",
      color: "#DC2626",
      softColor: "#FEE2E2",
      icon: "circle-x",
      order: 6,
      terminal: true,
    },

    {
      id: REPORT_STATUS.CLOSED,
      label: "Ditutup",
      description:
        "Laporan telah ditutup dan tidak lagi berada dalam alur penanganan aktif.",
      color: "#64748B",
      softColor: "#F1F5F9",
      icon: "archive",
      order: 7,
      terminal: true,
    },
  ] as const;

/* -------------------------------------------------------------------------- */
/* Priority Definitions                                                       */
/* -------------------------------------------------------------------------- */

export const REPORT_PRIORITIES:
  readonly ReportPriorityDefinition[] =
  [
    {
      id: REPORT_PRIORITY.LOW,
      label: "Rendah",
      description:
        "Persoalan yang tidak menunjukkan kebutuhan penanganan segera.",
      color: "#64748B",
      softColor: "#F1F5F9",
      order: 1,
    },

    {
      id: REPORT_PRIORITY.MEDIUM,
      label: "Sedang",
      description:
        "Persoalan yang membutuhkan perhatian tetapi tidak menunjukkan kondisi mendesak.",
      color: "#2563EB",
      softColor: "#DBEAFE",
      order: 2,
    },

    {
      id: REPORT_PRIORITY.HIGH,
      label: "Tinggi",
      description:
        "Persoalan yang membutuhkan perhatian lebih cepat berdasarkan kondisi yang dilaporkan.",
      color: "#D97706",
      softColor: "#FEF3C7",
      order: 3,
    },

    {
      id: REPORT_PRIORITY.CRITICAL,
      label: "Kritis",
      description:
        "Persoalan yang menunjukkan potensi risiko serius dan membutuhkan perhatian segera.",
      color: "#DC2626",
      softColor: "#FEE2E2",
      order: 4,
    },
  ] as const;

/* -------------------------------------------------------------------------- */
/* Labels                                                                     */
/* -------------------------------------------------------------------------- */

export const REPORT_CATEGORY_LABELS: Record<
  ReportCategory,
  string
> = {
  [REPORT_CATEGORY.ILLEGAL_DUMPING]:
    "Pembuangan Sampah Sembarangan",

  [REPORT_CATEGORY.WASTE_ACCUMULATION]:
    "Penumpukan Sampah",

  [REPORT_CATEGORY.BURNING]:
    "Pembakaran Sampah",

  [REPORT_CATEGORY.UNSORTED_WASTE]:
    "Sampah Tidak Terpilah",

  [REPORT_CATEGORY.WASTE_CONTAINER]:
    "Kondisi Tempat Sampah",

  [REPORT_CATEGORY.WASTE_COLLECTION]:
    "Pengumpulan Sampah",

  [REPORT_CATEGORY.WASTE_TRANSPORTATION]:
    "Pengangkutan Sampah",

  [REPORT_CATEGORY.WASTE_PROCESSING]:
    "Pengelolaan / Pengolahan",

  [REPORT_CATEGORY.HAZARDOUS_WASTE]:
    "Sampah Berbahaya / Khusus",

  [REPORT_CATEGORY.POLLUTION]:
    "Pencemaran Lingkungan",

  [REPORT_CATEGORY.OTHER]:
    "Lainnya",
};

export const REPORT_STATUS_LABELS: Record<
  ReportStatus,
  string
> = {
  [REPORT_STATUS.SUBMITTED]:
    "Dikirim",

  [REPORT_STATUS.UNDER_REVIEW]:
    "Sedang Ditinjau",

  [REPORT_STATUS.VERIFIED]:
    "Terverifikasi",

  [REPORT_STATUS.IN_PROGRESS]:
    "Sedang Ditangani",

  [REPORT_STATUS.RESOLVED]:
    "Selesai",

  [REPORT_STATUS.REJECTED]:
    "Ditolak",

  [REPORT_STATUS.CLOSED]:
    "Ditutup",
};

export const REPORT_PRIORITY_LABELS: Record<
  ReportPriority,
  string
> = {
  [REPORT_PRIORITY.LOW]:
    "Rendah",

  [REPORT_PRIORITY.MEDIUM]:
    "Sedang",

  [REPORT_PRIORITY.HIGH]:
    "Tinggi",

  [REPORT_PRIORITY.CRITICAL]:
    "Kritis",
};

export const REPORT_VISIBILITY_LABELS: Record<
  ReportVisibility,
  string
> = {
  [REPORT_VISIBILITY.PUBLIC]:
    "Publik",

  [REPORT_VISIBILITY.INTERNAL]:
    "Internal",

  [REPORT_VISIBILITY.PRIVATE]:
    "Privat",
};

export const REPORTER_TYPE_LABELS: Record<
  ReporterType,
  string
> = {
  [REPORTER_TYPE.COMMUNITY]:
    "Masyarakat",

  [REPORTER_TYPE.ORGANIZATION]:
    "Organisasi",

  [REPORTER_TYPE.ADMIN]:
    "Administrator",
};

export const REPORT_LOCATION_SOURCE_LABELS: Record<
  ReportLocationSource,
  string
> = {
  [REPORT_LOCATION_SOURCE.MAP_PICKER]:
    "Pilih dari peta",

  [REPORT_LOCATION_SOURCE.DEVICE_LOCATION]:
    "Lokasi perangkat",

  [REPORT_LOCATION_SOURCE.MANUAL]:
    "Masukkan manual",
};

export const REPORT_VERIFICATION_LABELS: Record<
  ReportVerification,
  string
> = {
  [REPORT_VERIFICATION.UNVERIFIED]:
    "Belum diverifikasi",

  [REPORT_VERIFICATION.VERIFIED]:
    "Terverifikasi",

  [REPORT_VERIFICATION.REJECTED]:
    "Ditolak",
};

export const REPORT_ATTACHMENT_TYPE_LABELS: Record<
  ReportAttachmentType,
  string
> = {
  [REPORT_ATTACHMENT_TYPE.PHOTO]:
    "Foto",

  [REPORT_ATTACHMENT_TYPE.VIDEO]:
    "Video",

  [REPORT_ATTACHMENT_TYPE.DOCUMENT]:
    "Dokumen",
};

/* -------------------------------------------------------------------------- */
/* Options for UI                                                             */
/* -------------------------------------------------------------------------- */

export const REPORT_CATEGORY_OPTIONS =
  REPORT_CATEGORIES.map(
    (category) => ({
      value: category.id,
      label: category.label,
    })
  );

export const REPORT_STATUS_OPTIONS =
  REPORT_STATUS_DEFINITIONS.map(
    (status) => ({
      value: status.id,
      label: status.label,
    })
  );

export const REPORT_PRIORITY_OPTIONS =
  REPORT_PRIORITIES.map(
    (priority) => ({
      value: priority.id,
      label: priority.label,
    })
  );

export const REPORT_VISIBILITY_OPTIONS =
  Object.values(
    REPORT_VISIBILITY
  ).map((visibility) => ({
    value: visibility,
    label:
      REPORT_VISIBILITY_LABELS[
        visibility
      ],
  }));

export const REPORT_LOCATION_SOURCE_OPTIONS =
  Object.values(
    REPORT_LOCATION_SOURCE
  ).map((source) => ({
    value: source,
    label:
      REPORT_LOCATION_SOURCE_LABELS[
        source
      ],
  }));

/* -------------------------------------------------------------------------- */
/* Workflow                                                                   */
/* -------------------------------------------------------------------------- */

/**
 * Normal lifecycle:
 *
 * submitted
 *    ↓
 * under-review
 *    ↓
 * verified
 *    ↓
 * in-progress
 *    ↓
 * resolved
 *
 * Alternative terminal paths:
 *
 * under-review → rejected
 * in-progress → closed
 * resolved → closed
 */
export const REPORT_STATUS_TRANSITIONS: Readonly<
  Record<
    ReportStatus,
    readonly ReportStatus[]
  >
> = {
  [REPORT_STATUS.SUBMITTED]: [
    REPORT_STATUS.UNDER_REVIEW,
    REPORT_STATUS.REJECTED,
  ],

  [REPORT_STATUS.UNDER_REVIEW]: [
    REPORT_STATUS.VERIFIED,
    REPORT_STATUS.REJECTED,
  ],

  [REPORT_STATUS.VERIFIED]: [
    REPORT_STATUS.IN_PROGRESS,
    REPORT_STATUS.REJECTED,
  ],

  [REPORT_STATUS.IN_PROGRESS]: [
    REPORT_STATUS.RESOLVED,
    REPORT_STATUS.CLOSED,
  ],

  [REPORT_STATUS.RESOLVED]: [
    REPORT_STATUS.CLOSED,
  ],

  [REPORT_STATUS.REJECTED]: [],

  [REPORT_STATUS.CLOSED]: [],
};

/**
 * Determine whether a status may transition into another status.
 */
export const canTransitionReportStatus = (
  from: ReportStatus,
  to: ReportStatus
): boolean => {
  return (
    REPORT_STATUS_TRANSITIONS[from]?.includes(
      to
    ) ?? false
  );
};

/**
 * Return valid next statuses for a report.
 */
export const getNextReportStatuses = (
  status: ReportStatus
): readonly ReportStatus[] => {
  return (
    REPORT_STATUS_TRANSITIONS[status] ??
    []
  );
};

/**
 * Determine whether the status is terminal.
 */
export const isTerminalReportStatus = (
  status: ReportStatus
): boolean => {
  return (
    REPORT_STATUS_DEFINITIONS.find(
      (definition) =>
        definition.id === status
    )?.terminal ?? false
  );
};

/* -------------------------------------------------------------------------- */
/* Category Helpers                                                           */
/* -------------------------------------------------------------------------- */

export const getReportCategory =
  (
    category: ReportCategory
  ): ReportCategoryDefinition | undefined => {
    return REPORT_CATEGORIES.find(
      (item) => item.id === category
    );
  };

export const getReportCategoryLabel = (
  category: ReportCategory
): string => {
  return (
    REPORT_CATEGORY_LABELS[
      category
    ] ?? category
  );
};

/* -------------------------------------------------------------------------- */
/* Status Helpers                                                             */
/* -------------------------------------------------------------------------- */

export const getReportStatus =
  (
    status: ReportStatus
  ): ReportStatusDefinition | undefined => {
    return REPORT_STATUS_DEFINITIONS.find(
      (item) => item.id === status
    );
  };

export const getReportStatusLabel = (
  status: ReportStatus
): string => {
  return (
    REPORT_STATUS_LABELS[status] ??
    status
  );
};

/* -------------------------------------------------------------------------- */
/* Priority Helpers                                                           */
/* -------------------------------------------------------------------------- */

export const getReportPriority =
  (
    priority: ReportPriority
  ): ReportPriorityDefinition | undefined => {
    return REPORT_PRIORITIES.find(
      (item) => item.id === priority
    );
  };

export const getReportPriorityLabel = (
  priority: ReportPriority
): string => {
  return (
    REPORT_PRIORITY_LABELS[
      priority
    ] ?? priority
  );
};

/* -------------------------------------------------------------------------- */
/* Validation                                                                 */
/* -------------------------------------------------------------------------- */

export const isReportCategory = (
  value: unknown
): value is ReportCategory => {
  return (
    typeof value === "string" &&
    (
      Object.values(
        REPORT_CATEGORY
      ) as string[]
    ).includes(value)
  );
};

export const isReportStatus = (
  value: unknown
): value is ReportStatus => {
  return (
    typeof value === "string" &&
    (
      Object.values(
        REPORT_STATUS
      ) as string[]
    ).includes(value)
  );
};

export const isReportPriority = (
  value: unknown
): value is ReportPriority => {
  return (
    typeof value === "string" &&
    (
      Object.values(
        REPORT_PRIORITY
      ) as string[]
    ).includes(value)
  );
};

export const isReportVisibility = (
  value: unknown
): value is ReportVisibility => {
  return (
    typeof value === "string" &&
    (
      Object.values(
        REPORT_VISIBILITY
      ) as string[]
    ).includes(value)
  );
};

export const isReporterType = (
  value: unknown
): value is ReporterType => {
  return (
    typeof value === "string" &&
    (
      Object.values(
        REPORTER_TYPE
      ) as string[]
    ).includes(value)
  );
};

export const isReportLocationSource = (
  value: unknown
): value is ReportLocationSource => {
  return (
    typeof value === "string" &&
    (
      Object.values(
        REPORT_LOCATION_SOURCE
      ) as string[]
    ).includes(value)
  );
};

export const isReportVerification = (
  value: unknown
): value is ReportVerification => {
  return (
    typeof value === "string" &&
    (
      Object.values(
        REPORT_VERIFICATION
      ) as string[]
    ).includes(value)
  );
};

/* -------------------------------------------------------------------------- */
/* Sorting Helpers                                                            */
/* -------------------------------------------------------------------------- */

export const sortReportCategories =
  (
    categories: readonly ReportCategoryDefinition[]
  ): ReportCategoryDefinition[] => {
    return [...categories].sort(
      (a, b) => a.order - b.order
    );
  };

export const sortReportStatuses =
  (
    statuses: readonly ReportStatusDefinition[]
  ): ReportStatusDefinition[] => {
    return [...statuses].sort(
      (a, b) => a.order - b.order
    );
  };

export const sortReportPriorities =
  (
    priorities: readonly ReportPriorityDefinition[]
  ): ReportPriorityDefinition[] => {
    return [...priorities].sort(
      (a, b) => a.order - b.order
    );
  };

/* -------------------------------------------------------------------------- */
/* Recommended Report Form Constraints                                        */
/* -------------------------------------------------------------------------- */

/**
 * These values are UI/data-quality defaults.
 *
 * Server-side / Firebase Rules must still enforce any actual
 * security or storage constraints.
 */
export const REPORT_FORM_LIMITS = {
  titleMinLength: 5,
  titleMaxLength: 120,

  descriptionMinLength: 10,
  descriptionMaxLength: 2000,

  maxPhotos: 5,

  latitudeMin: -90,
  latitudeMax: 90,

  longitudeMin: -180,
  longitudeMax: 180,
} as const;

/* -------------------------------------------------------------------------- */
/* Report Workflow Display                                                    */
/* -------------------------------------------------------------------------- */

export const REPORT_WORKFLOW_STEPS = [
  {
    status: REPORT_STATUS.SUBMITTED,
    label: "Dikirim",
    description:
      "Laporan diterima oleh sistem.",
  },

  {
    status: REPORT_STATUS.UNDER_REVIEW,
    label: "Ditinjau",
    description:
      "Informasi laporan sedang diperiksa.",
  },

  {
    status: REPORT_STATUS.VERIFIED,
    label: "Terverifikasi",
    description:
      "Laporan telah diverifikasi.",
  },

  {
    status: REPORT_STATUS.IN_PROGRESS,
    label: "Ditangani",
    description:
      "Laporan sedang ditindaklanjuti.",
  },

  {
    status: REPORT_STATUS.RESOLVED,
    label: "Selesai",
    description:
      "Tindak lanjut telah selesai.",
  },
] as const;

/* -------------------------------------------------------------------------- */
/* Default Values                                                             */
/* -------------------------------------------------------------------------- */

export const REPORT_DEFAULTS = {
  status: REPORT_STATUS.SUBMITTED,
  priority: REPORT_PRIORITY.MEDIUM,
  visibility: REPORT_VISIBILITY.PUBLIC,
  reporterType: REPORTER_TYPE.COMMUNITY,
  locationSource:
    REPORT_LOCATION_SOURCE.MANUAL,
  verification:
    REPORT_VERIFICATION.UNVERIFIED,
} as const;

/* -------------------------------------------------------------------------- */
/* Default Export                                                             */
/* -------------------------------------------------------------------------- */

const reportConstants = Object.freeze({
  REPORT_CATEGORY,
  REPORT_STATUS,
  REPORT_PRIORITY,
  REPORT_VISIBILITY,
  REPORTER_TYPE,
  REPORT_LOCATION_SOURCE,
  REPORT_VERIFICATION,
  REPORT_ATTACHMENT_TYPE,
  REPORT_WORKFLOW,

  REPORT_CATEGORIES,
  REPORT_STATUS_DEFINITIONS,
  REPORT_PRIORITIES,

  REPORT_CATEGORY_LABELS,
  REPORT_STATUS_LABELS,
  REPORT_PRIORITY_LABELS,
  REPORT_VISIBILITY_LABELS,
  REPORTER_TYPE_LABELS,
  REPORT_LOCATION_SOURCE_LABELS,
  REPORT_VERIFICATION_LABELS,
  REPORT_ATTACHMENT_TYPE_LABELS,

  REPORT_CATEGORY_OPTIONS,
  REPORT_STATUS_OPTIONS,
  REPORT_PRIORITY_OPTIONS,
  REPORT_VISIBILITY_OPTIONS,
  REPORT_LOCATION_SOURCE_OPTIONS,

  REPORT_STATUS_TRANSITIONS,
  REPORT_WORKFLOW_STEPS,
  REPORT_FORM_LIMITS,
  REPORT_DEFAULTS,

  canTransitionReportStatus,
  getNextReportStatuses,
  isTerminalReportStatus,

  getReportCategory,
  getReportCategoryLabel,

  getReportStatus,
  getReportStatusLabel,

  getReportPriority,
  getReportPriorityLabel,

  isReportCategory,
  isReportStatus,
  isReportPriority,
  isReportVisibility,
  isReporterType,
  isReportLocationSource,
  isReportVerification,

  sortReportCategories,
  sortReportStatuses,
  sortReportPriorities,
});

export default reportConstants;