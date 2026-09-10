import {
  WASTE_CATEGORY,
  type WasteCategory,
} from "@lib/constants/waste";

export type ReportStatus =
  | "pending"
  | "verified"
  | "in-progress"
  | "resolved"
  | "rejected";

export type ReportPriority = "low" | "medium" | "high";

export type ReportType =
  | "illegal-dumping"
  | "overflowing-waste"
  | "burning-waste"
  | "hazardous-waste"
  | "environmental-pollution"
  | "other";

export interface ReportCoordinates {
  lat: number;
  lng: number;
}

export interface ReportLocation {
  address: string;
  areaId: string;
  areaName: string;
  coordinates: ReportCoordinates;
}

export interface Report {
  id: string;
  title: string;
  description: string;
  type: ReportType;
  category: WasteCategory;
  status: ReportStatus;
  priority: ReportPriority;
  location: ReportLocation;
  reporterName?: string;
  reporterContact?: string;
  image?: string;
  images: string[];
  notes: string[];
  resolution?: string;
  verifiedAt?: string;
  resolvedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ReportFilters {
  search?: string;
  status?: ReportStatus;
  priority?: ReportPriority;
  type?: ReportType;
  category?: WasteCategory;
  areaId?: string;
}

const now = new Date().toISOString();

/* -------------------------------------------------------------------------- */
/* Demo / seed reports                                                        */
/* -------------------------------------------------------------------------- */

export const reports: Report[] = [
  {
    id: "report-001",
    title: "Penumpukan sampah di area permukiman",
    description:
      "Ditemukan penumpukan sampah pada area permukiman yang berpotensi mengganggu kebersihan lingkungan.",
    type: "overflowing-waste",
    category: WASTE_CATEGORY.RESIDUAL,
    status: "pending",
    priority: "medium",
    location: {
      address: "Abiansemal, Kabupaten Badung, Bali",
      areaId: "abiansemal",
      areaName: "Abiansemal",
      coordinates: {
        lat: -8.5496,
        lng: 115.2037,
      },
    },
    images: [],
    notes: [],
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "report-002",
    title: "Pembuangan sampah tidak pada tempatnya",
    description:
      "Terdapat indikasi pembuangan sampah pada area publik yang tidak diperuntukkan sebagai lokasi pembuangan.",
    type: "illegal-dumping",
    category: WASTE_CATEGORY.INORGANIC,
    status: "verified",
    priority: "high",
    location: {
      address: "Kuta, Kabupaten Badung, Bali",
      areaId: "kuta",
      areaName: "Kuta",
      coordinates: {
        lat: -8.7182,
        lng: 115.1686,
      },
    },
    images: [],
    notes: [
      "Laporan telah diverifikasi secara administratif.",
    ],
    verifiedAt: now,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "report-003",
    title: "Sampah elektronik di area terbuka",
    description:
      "Ditemukan beberapa perangkat elektronik bekas pada area terbuka yang sebaiknya ditangani melalui jalur pengelolaan khusus.",
    type: "hazardous-waste",
    category: WASTE_CATEGORY.ELECTRONIC,
    status: "in-progress",
    priority: "high",
    location: {
      address: "Kuta Selatan, Kabupaten Badung, Bali",
      areaId: "kuta-selatan",
      areaName: "Kuta Selatan",
      coordinates: {
        lat: -8.8006,
        lng: 115.1625,
      },
    },
    images: [],
    notes: [
      "Laporan diteruskan untuk tindak lanjut pengelolaan material elektronik.",
    ],
    verifiedAt: now,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "report-004",
    title: "Pembakaran sampah di area terbuka",
    description:
      "Dilaporkan adanya aktivitas pembakaran sampah pada area terbuka.",
    type: "burning-waste",
    category: WASTE_CATEGORY.ORGANIC,
    status: "resolved",
    priority: "high",
    location: {
      address: "Mengwi, Kabupaten Badung, Bali",
      areaId: "mengwi",
      areaName: "Mengwi",
      coordinates: {
        lat: -8.5437,
        lng: 115.1728,
      },
    },
    images: [],
    notes: [
      "Tindak lanjut telah dilakukan.",
    ],
    resolution:
      "Laporan telah ditindaklanjuti dan status dinyatakan selesai.",
    verifiedAt: now,
    resolvedAt: now,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "report-005",
    title: "Temuan material berbahaya",
    description:
      "Ditemukan material yang diduga membutuhkan penanganan khusus pada area publik.",
    type: "hazardous-waste",
    category: WASTE_CATEGORY.HAZARDOUS,
    status: "pending",
    priority: "high",
    location: {
      address: "Petang, Kabupaten Badung, Bali",
      areaId: "petang",
      areaName: "Petang",
      coordinates: {
        lat: -8.3923,
        lng: 115.2377,
      },
    },
    images: [],
    notes: [],
    createdAt: now,
    updatedAt: now,
  },
];

/* -------------------------------------------------------------------------- */
/* Basic getters                                                              */
/* -------------------------------------------------------------------------- */

export function getReports(): Report[] {
  return [...reports];
}

export function getPublicReports(): Report[] {
  return reports.filter(
    (report) => report.status !== "rejected",
  );
}

export function getReportById(id: string): Report | undefined {
  return reports.find((report) => report.id === id);
}

export function getReportsByStatus(
  status: ReportStatus,
): Report[] {
  return reports.filter((report) => report.status === status);
}

export function getReportsByPriority(
  priority: ReportPriority,
): Report[] {
  return reports.filter(
    (report) => report.priority === priority,
  );
}

export function getReportsByType(
  type: ReportType,
): Report[] {
  return reports.filter((report) => report.type === type);
}

export function getReportsByCategory(
  category: WasteCategory,
): Report[] {
  return reports.filter(
    (report) => report.category === category,
  );
}

export function getReportsByArea(
  areaId: string,
): Report[] {
  return reports.filter(
    (report) => report.location.areaId === areaId,
  );
}

/* -------------------------------------------------------------------------- */
/* Filtering                                                                  */
/* -------------------------------------------------------------------------- */

export function filterReports(
  filters: ReportFilters = {},
): Report[] {
  const normalizedSearch = filters.search?.trim().toLowerCase();

  return reports.filter((report) => {
    if (
      filters.status &&
      report.status !== filters.status
    ) {
      return false;
    }

    if (
      filters.priority &&
      report.priority !== filters.priority
    ) {
      return false;
    }

    if (filters.type && report.type !== filters.type) {
      return false;
    }

    if (
      filters.category &&
      report.category !== filters.category
    ) {
      return false;
    }

    if (
      filters.areaId &&
      report.location.areaId !== filters.areaId
    ) {
      return false;
    }

    if (normalizedSearch) {
      const searchableText = [
        report.id,
        report.title,
        report.description,
        report.type,
        report.category,
        report.status,
        report.priority,
        report.location.address,
        report.location.areaName,
        report.reporterName ?? "",
        report.resolution ?? "",
        ...report.notes,
      ]
        .join(" ")
        .toLowerCase();

      if (!searchableText.includes(normalizedSearch)) {
        return false;
      }
    }

    return true;
  });
}

/* -------------------------------------------------------------------------- */
/* Status helpers                                                             */
/* -------------------------------------------------------------------------- */

export function isReportPending(
  id: string,
): boolean {
  return getReportById(id)?.status === "pending";
}

export function isReportVerified(
  id: string,
): boolean {
  const status = getReportById(id)?.status;

  return (
    status === "verified" ||
    status === "in-progress" ||
    status === "resolved"
  );
}

export function isReportResolved(
  id: string,
): boolean {
  return getReportById(id)?.status === "resolved";
}

export function isReportRejected(
  id: string,
): boolean {
  return getReportById(id)?.status === "rejected";
}

export function isReportPublic(
  id: string,
): boolean {
  return getReportById(id)?.status !== "rejected";
}

/* -------------------------------------------------------------------------- */
/* Statistics                                                                 */
/* -------------------------------------------------------------------------- */

export function getReportCount(): number {
  return reports.length;
}

export function getPublicReportCount(): number {
  return reports.filter(
    (report) => report.status !== "rejected",
  ).length;
}

export function getPendingReportCount(): number {
  return reports.filter(
    (report) => report.status === "pending",
  ).length;
}

export function getVerifiedReportCount(): number {
  return reports.filter(
    (report) =>
      report.status === "verified" ||
      report.status === "in-progress" ||
      report.status === "resolved",
  ).length;
}

export function getInProgressReportCount(): number {
  return reports.filter(
    (report) => report.status === "in-progress",
  ).length;
}

export function getResolvedReportCount(): number {
  return reports.filter(
    (report) => report.status === "resolved",
  ).length;
}

export function getRejectedReportCount(): number {
  return reports.filter(
    (report) => report.status === "rejected",
  ).length;
}

export function getHighPriorityReportCount(): number {
  return reports.filter(
    (report) => report.priority === "high",
  ).length;
}

/* -------------------------------------------------------------------------- */
/* Statistics by dimension                                                    */
/* -------------------------------------------------------------------------- */

export function getReportCountByStatus(): Record<
  ReportStatus,
  number
> {
  const counts: Record<ReportStatus, number> = {
    pending: 0,
    verified: 0,
    "in-progress": 0,
    resolved: 0,
    rejected: 0,
  };

  for (const report of reports) {
    counts[report.status] += 1;
  }

  return counts;
}

export function getReportCountByPriority(): Record<
  ReportPriority,
  number
> {
  const counts: Record<ReportPriority, number> = {
    low: 0,
    medium: 0,
    high: 0,
  };

  for (const report of reports) {
    counts[report.priority] += 1;
  }

  return counts;
}

export function getReportCountByType(): Record<
  ReportType,
  number
> {
  const counts: Record<ReportType, number> = {
    "illegal-dumping": 0,
    "overflowing-waste": 0,
    "burning-waste": 0,
    "hazardous-waste": 0,
    "environmental-pollution": 0,
    other: 0,
  };

  for (const report of reports) {
    counts[report.type] += 1;
  }

  return counts;
}

export function getReportCountByArea(): Record<
  string,
  number
> {
  const counts: Record<string, number> = {};

  for (const report of reports) {
    const areaId = report.location.areaId;

    counts[areaId] = (counts[areaId] ?? 0) + 1;
  }

  return counts;
}

export function getReportCountByCategory(): Record<
  WasteCategory,
  number
> {
  const counts: Record<WasteCategory, number> = {
    [WASTE_CATEGORY.ORGANIC]: 0,
    [WASTE_CATEGORY.INORGANIC]: 0,
    [WASTE_CATEGORY.HAZARDOUS]: 0,
    [WASTE_CATEGORY.ELECTRONIC]: 0,
    [WASTE_CATEGORY.RESIDUAL]: 0,
  };

  for (const report of reports) {
    counts[report.category] += 1;
  }

  return counts;
}

/* -------------------------------------------------------------------------- */
/* Sorting                                                                    */
/* -------------------------------------------------------------------------- */

export type ReportSort =
  | "newest"
  | "oldest"
  | "priority"
  | "status";

export function sortReports(
  items: Report[],
  sort: ReportSort = "newest",
): Report[] {
  const result = [...items];

  const priorityWeight: Record<ReportPriority, number> = {
    high: 3,
    medium: 2,
    low: 1,
  };

  const statusWeight: Record<ReportStatus, number> = {
    pending: 5,
    "in-progress": 4,
    verified: 3,
    resolved: 2,
    rejected: 1,
  };

  result.sort((a, b) => {
    if (sort === "oldest") {
      return (
        new Date(a.createdAt).getTime() -
        new Date(b.createdAt).getTime()
      );
    }

    if (sort === "priority") {
      return (
        priorityWeight[b.priority] -
        priorityWeight[a.priority]
      );
    }

    if (sort === "status") {
      return (
        statusWeight[b.status] -
        statusWeight[a.status]
      );
    }

    return (
      new Date(b.createdAt).getTime() -
      new Date(a.createdAt).getTime()
    );
  });

  return result;
}

/* -------------------------------------------------------------------------- */
/* Recent / dashboard helpers                                                 */
/* -------------------------------------------------------------------------- */

export function getRecentReports(
  limit = 5,
): Report[] {
  const safeLimit = Math.max(0, limit);

  return sortReports(reports, "newest").slice(
    0,
    safeLimit,
  );
}

export function getRecentPublicReports(
  limit = 5,
): Report[] {
  const safeLimit = Math.max(0, limit);

  return sortReports(getPublicReports(), "newest").slice(
    0,
    safeLimit,
  );
}

export function getPriorityReports(
  limit = 5,
): Report[] {
  const safeLimit = Math.max(0, limit);

  return sortReports(
    reports.filter((report) => report.priority === "high"),
    "newest",
  ).slice(0, safeLimit);
}

/* -------------------------------------------------------------------------- */
/* Report validation                                                           */
/* -------------------------------------------------------------------------- */

export function reportExists(id: string): boolean {
  return reports.some((report) => report.id === id);
}

export function reportHasLocation(id: string): boolean {
  const report = getReportById(id);

  return Boolean(
    report?.location.address &&
      report.location.areaId &&
      report.location.areaName,
  );
}

export function reportHasImages(id: string): boolean {
  const report = getReportById(id);

  return Boolean(
    report?.image ||
      report?.images.some((image) => Boolean(image)),
  );
}

/* -------------------------------------------------------------------------- */
/* Lifecycle helpers                                                          */
/* -------------------------------------------------------------------------- */

export function getReportStatusLabel(
  status: ReportStatus,
): string {
  switch (status) {
    case "pending":
      return "Menunggu";
    case "verified":
      return "Terverifikasi";
    case "in-progress":
      return "Dalam proses";
    case "resolved":
      return "Selesai";
    case "rejected":
      return "Ditolak";
  }
}

export function getReportPriorityLabel(
  priority: ReportPriority,
): string {
  switch (priority) {
    case "low":
      return "Rendah";
    case "medium":
      return "Sedang";
    case "high":
      return "Tinggi";
  }
}

export function getReportTypeLabel(
  type: ReportType,
): string {
  switch (type) {
    case "illegal-dumping":
      return "Pembuangan ilegal";
    case "overflowing-waste":
      return "Sampah meluap";
    case "burning-waste":
      return "Pembakaran sampah";
    case "hazardous-waste":
      return "Limbah berbahaya";
    case "environmental-pollution":
      return "Pencemaran lingkungan";
    case "other":
      return "Lainnya";
  }
}

/* -------------------------------------------------------------------------- */
/* Factory                                                                    */
/* -------------------------------------------------------------------------- */

export function createEmptyReport(): Report {
  const timestamp = new Date().toISOString();

  return {
    id: "",
    title: "",
    description: "",
    type: "other",
    category: WASTE_CATEGORY.RESIDUAL,
    status: "pending",
    priority: "medium",
    location: {
      address: "",
      areaId: "",
      areaName: "",
      coordinates: {
        lat: 0,
        lng: 0,
      },
    },
    reporterName: "",
    reporterContact: "",
    image: "",
    images: [],
    notes: [],
    resolution: "",
    createdAt: timestamp,
    updatedAt: timestamp,
  };
}

export const emptyReport = createEmptyReport;