/**
 * BINSIGHT — Formatting Utilities
 *
 * Centralized formatting helpers used across:
 * - dashboard
 * - maps
 * - organizations
 * - waste pages
 * - reports
 * - administration
 *
 * The helpers are intentionally dependency-free and safe for SSR.
 */

/* -------------------------------------------------------------------------- */
/* Types                                                                      */
/* -------------------------------------------------------------------------- */

export type DateFormat =
  | "short"
  | "medium"
  | "long"
  | "full";

export type RelativeDateStyle =
  | "auto"
  | "always";

/* -------------------------------------------------------------------------- */
/* Constants                                                                  */
/* -------------------------------------------------------------------------- */

const DEFAULT_LOCALE = "id-ID";

const DEFAULT_TIME_ZONE = "Asia/Makassar";

const DEFAULT_CURRENCY = "IDR";

/* -------------------------------------------------------------------------- */
/* Internal helpers                                                           */
/* -------------------------------------------------------------------------- */

function toValidDate(
  value: Date | string | number | null | undefined,
): Date | null {
  if (value === null || value === undefined) {
    return null;
  }

  const date =
    value instanceof Date
      ? new Date(value.getTime())
      : new Date(value);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date;
}

function pad(value: number): string {
  return value.toString().padStart(2, "0");
}

/* -------------------------------------------------------------------------- */
/* Number formatting                                                          */
/* -------------------------------------------------------------------------- */

export function formatNumber(
  value: number | null | undefined,
  options: Intl.NumberFormatOptions = {},
): string {
  if (
    value === null ||
    value === undefined ||
    !Number.isFinite(value)
  ) {
    return "—";
  }

  return new Intl.NumberFormat(
    DEFAULT_LOCALE,
    options,
  ).format(value);
}

export function formatInteger(
  value: number | null | undefined,
): string {
  return formatNumber(value, {
    maximumFractionDigits: 0,
  });
}

export function formatDecimal(
  value: number | null | undefined,
  fractionDigits = 2,
): string {
  const safeDigits = Math.min(
    20,
    Math.max(0, Math.trunc(fractionDigits)),
  );

  return formatNumber(value, {
    minimumFractionDigits: safeDigits,
    maximumFractionDigits: safeDigits,
  });
}

export function formatCompactNumber(
  value: number | null | undefined,
): string {
  return formatNumber(value, {
    notation: "compact",
    compactDisplay: "short",
    maximumFractionDigits: 1,
  });
}

export function formatPercentage(
  value: number | null | undefined,
  fractionDigits = 0,
): string {
  if (
    value === null ||
    value === undefined ||
    !Number.isFinite(value)
  ) {
    return "—";
  }

  return new Intl.NumberFormat(
    DEFAULT_LOCALE,
    {
      style: "percent",
      minimumFractionDigits: Math.max(
        0,
        Math.trunc(fractionDigits),
      ),
      maximumFractionDigits: Math.max(
        0,
        Math.trunc(fractionDigits),
      ),
    },
  ).format(value);
}

/**
 * Format a ratio as a percentage.
 *
 * Example:
 * formatRatioAsPercentage(25, 100) -> "25%"
 */
export function formatRatioAsPercentage(
  numerator: number | null | undefined,
  denominator: number | null | undefined,
  fractionDigits = 0,
): string {
  if (
    numerator === null ||
    numerator === undefined ||
    denominator === null ||
    denominator === undefined ||
    !Number.isFinite(numerator) ||
    !Number.isFinite(denominator) ||
    denominator === 0
  ) {
    return "—";
  }

  return formatPercentage(
    numerator / denominator,
    fractionDigits,
  );
}

/* -------------------------------------------------------------------------- */
/* Currency                                                                   */
/* -------------------------------------------------------------------------- */

export function formatCurrency(
  value: number | null | undefined,
  currency = DEFAULT_CURRENCY,
): string {
  if (
    value === null ||
    value === undefined ||
    !Number.isFinite(value)
  ) {
    return "—";
  }

  return new Intl.NumberFormat(
    DEFAULT_LOCALE,
    {
      style: "currency",
      currency,
      currencyDisplay: "symbol",
      maximumFractionDigits:
        currency === "IDR" ? 0 : 2,
    },
  ).format(value);
}

export function formatRupiah(
  value: number | null | undefined,
): string {
  return formatCurrency(value, "IDR");
}

/* -------------------------------------------------------------------------- */
/* Date formatting                                                            */
/* -------------------------------------------------------------------------- */

export function formatDate(
  value: Date | string | number | null | undefined,
  format: DateFormat = "medium",
): string {
  const date = toValidDate(value);

  if (!date) {
    return "—";
  }

  const optionsByFormat: Record<
    DateFormat,
    Intl.DateTimeFormatOptions
  > = {
    short: {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    },

    medium: {
      day: "2-digit",
      month: "short",
      year: "numeric",
    },

    long: {
      day: "numeric",
      month: "long",
      year: "numeric",
    },

    full: {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    },
  };

  return new Intl.DateTimeFormat(
    DEFAULT_LOCALE,
    {
      ...optionsByFormat[format],
      timeZone: DEFAULT_TIME_ZONE,
    },
  ).format(date);
}

export function formatDateTime(
  value: Date | string | number | null | undefined,
): string {
  const date = toValidDate(value);

  if (!date) {
    return "—";
  }

  return new Intl.DateTimeFormat(
    DEFAULT_LOCALE,
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: DEFAULT_TIME_ZONE,
    },
  ).format(date);
}

export function formatTime(
  value: Date | string | number | null | undefined,
): string {
  const date = toValidDate(value);

  if (!date) {
    return "—";
  }

  return new Intl.DateTimeFormat(
    DEFAULT_LOCALE,
    {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: DEFAULT_TIME_ZONE,
    },
  ).format(date);
}

export function formatISODate(
  value: Date | string | number | null | undefined,
): string {
  const date = toValidDate(value);

  if (!date) {
    return "";
  }

  return [
    date.getUTCFullYear(),
    pad(date.getUTCMonth() + 1),
    pad(date.getUTCDate()),
  ].join("-");
}

/* -------------------------------------------------------------------------- */
/* Relative time                                                              */
/* -------------------------------------------------------------------------- */

export function formatRelativeTime(
  value: Date | string | number | null | undefined,
  now: Date = new Date(),
  style: RelativeDateStyle = "auto",
): string {
  const date = toValidDate(value);

  if (!date) {
    return "—";
  }

  const reference =
    toValidDate(now) ?? new Date();

  const differenceMs =
    date.getTime() -
    reference.getTime();

  const differenceSeconds =
    Math.round(differenceMs / 1000);

  if (
    style === "auto" &&
    Math.abs(differenceSeconds) < 60
  ) {
    return "baru saja";
  }

  const relative = new Intl.RelativeTimeFormat(
    DEFAULT_LOCALE,
    {
      numeric:
        style === "always"
          ? "always"
          : "auto",
    },
  );

  const absoluteSeconds =
    Math.abs(differenceSeconds);

  if (absoluteSeconds < 60) {
    return relative.format(
      differenceSeconds,
      "second",
    );
  }

  const differenceMinutes =
    Math.round(
      differenceSeconds / 60,
    );

  if (Math.abs(differenceMinutes) < 60) {
    return relative.format(
      differenceMinutes,
      "minute",
    );
  }

  const differenceHours =
    Math.round(
      differenceMinutes / 60,
    );

  if (Math.abs(differenceHours) < 24) {
    return relative.format(
      differenceHours,
      "hour",
    );
  }

  const differenceDays =
    Math.round(
      differenceHours / 24,
    );

  if (Math.abs(differenceDays) < 7) {
    return relative.format(
      differenceDays,
      "day",
    );
  }

  const differenceWeeks =
    Math.round(
      differenceDays / 7,
    );

  if (Math.abs(differenceWeeks) < 5) {
    return relative.format(
      differenceWeeks,
      "week",
    );
  }

  const differenceMonths =
    Math.round(
      differenceDays / 30,
    );

  if (Math.abs(differenceMonths) < 12) {
    return relative.format(
      differenceMonths,
      "month",
    );
  }

  const differenceYears =
    Math.round(
      differenceDays / 365,
    );

  return relative.format(
    differenceYears,
    "year",
  );
}

/* -------------------------------------------------------------------------- */
/* Duration                                                                   */
/* -------------------------------------------------------------------------- */

export function formatDuration(
  milliseconds: number | null | undefined,
): string {
  if (
    milliseconds === null ||
    milliseconds === undefined ||
    !Number.isFinite(milliseconds) ||
    milliseconds < 0
  ) {
    return "—";
  }

  const totalSeconds =
    Math.floor(milliseconds / 1000);

  const days =
    Math.floor(totalSeconds / 86400);

  const hours =
    Math.floor(
      (totalSeconds % 86400) / 3600,
    );

  const minutes =
    Math.floor(
      (totalSeconds % 3600) / 60,
    );

  const seconds =
    totalSeconds % 60;

  const parts: string[] = [];

  if (days > 0) {
    parts.push(`${days} hari`);
  }

  if (hours > 0) {
    parts.push(`${hours} jam`);
  }

  if (minutes > 0) {
    parts.push(`${minutes} menit`);
  }

  if (
    seconds > 0 &&
    parts.length < 2
  ) {
    parts.push(`${seconds} detik`);
  }

  return parts.length > 0
    ? parts.join(" ")
    : "0 detik";
}

/* -------------------------------------------------------------------------- */
/* File size                                                                  */
/* -------------------------------------------------------------------------- */

export function formatFileSize(
  bytes: number | null | undefined,
): string {
  if (
    bytes === null ||
    bytes === undefined ||
    !Number.isFinite(bytes) ||
    bytes < 0
  ) {
    return "—";
  }

  if (bytes === 0) {
    return "0 B";
  }

  const units = [
    "B",
    "KB",
    "MB",
    "GB",
    "TB",
  ];

  const exponent = Math.min(
    Math.floor(
      Math.log(bytes) / Math.log(1024),
    ),
    units.length - 1,
  );

  const value =
    bytes /
    Math.pow(1024, exponent);

  const digits =
    value >= 10 || exponent === 0
      ? 0
      : 1;

  return `${value.toFixed(digits)} ${
    units[exponent]
  }`;
}

/* -------------------------------------------------------------------------- */
/* Text formatting                                                            */
/* -------------------------------------------------------------------------- */

export function formatText(
  value: string | null | undefined,
  fallback = "—",
): string {
  const normalized =
    value?.trim() ?? "";

  return normalized || fallback;
}

export function capitalize(
  value: string | null | undefined,
): string {
  const normalized =
    value?.trim() ?? "";

  if (!normalized) {
    return "";
  }

  return (
    normalized.charAt(0).toUpperCase() +
    normalized.slice(1)
  );
}

export function titleCase(
  value: string | null | undefined,
): string {
  const normalized =
    value?.trim() ?? "";

  if (!normalized) {
    return "";
  }

  return normalized
    .toLowerCase()
    .split(/\s+/)
    .map((word) => capitalize(word))
    .join(" ");
}

export function truncate(
  value: string | null | undefined,
  maxLength: number,
  suffix = "…",
): string {
  const normalized =
    value?.trim() ?? "";

  const safeLength = Math.max(
    0,
    Math.trunc(maxLength),
  );

  if (normalized.length <= safeLength) {
    return normalized;
  }

  if (safeLength <= suffix.length) {
    return normalized.slice(
      0,
      safeLength,
    );
  }

  return (
    normalized.slice(
      0,
      safeLength - suffix.length,
    ) + suffix
  );
}

/* -------------------------------------------------------------------------- */
/* List formatting                                                            */
/* -------------------------------------------------------------------------- */

export function formatList(
  values: readonly (
    | string
    | null
    | undefined
  )[],
  separator = ", ",
  fallback = "—",
): string {
  const filtered = values
    .map((value) =>
      typeof value === "string"
        ? value.trim()
        : "",
    )
    .filter(
      (value) => value.length > 0,
    );

  return filtered.length > 0
    ? filtered.join(separator)
    : fallback;
}

/* -------------------------------------------------------------------------- */
/* Address formatting                                                         */
/* -------------------------------------------------------------------------- */

export interface AddressParts {
  address?: string | null;
  areaName?: string | null;
  regency?: string | null;
  province?: string | null;
  country?: string | null;
}

export function formatAddress(
  parts: AddressParts,
  separator = ", ",
): string {
  return formatList(
    [
      parts.address,
      parts.areaName,
      parts.regency,
      parts.province,
      parts.country,
    ],
    separator,
  );
}

/* -------------------------------------------------------------------------- */
/* Coordinate formatting                                                      */
/* -------------------------------------------------------------------------- */

export function formatCoordinate(
  value: number | null | undefined,
  fractionDigits = 6,
): string {
  if (
    value === null ||
    value === undefined ||
    !Number.isFinite(value)
  ) {
    return "—";
  }

  const digits = Math.min(
    12,
    Math.max(
      0,
      Math.trunc(fractionDigits),
    ),
  );

  return value.toFixed(digits);
}

export function formatCoordinates(
  lat: number | null | undefined,
  lng: number | null | undefined,
  fractionDigits = 6,
): string {
  if (
    lat === null ||
    lat === undefined ||
    lng === null ||
    lng === undefined ||
    !Number.isFinite(lat) ||
    !Number.isFinite(lng)
  ) {
    return "—";
  }

  return `${formatCoordinate(
    lat,
    fractionDigits,
  )}, ${formatCoordinate(
    lng,
    fractionDigits,
  )}`;
}

/* -------------------------------------------------------------------------- */
/* Phone formatting                                                           */
/* -------------------------------------------------------------------------- */

export function formatPhone(
  value: string | null | undefined,
): string {
  const normalized =
    value
      ?.replace(/[^\d+]/g, "")
      .trim() ?? "";

  if (!normalized) {
    return "—";
  }

  if (
    normalized.startsWith("+62")
  ) {
    const local =
      normalized.slice(3);

    return `+62 ${groupPhoneDigits(
      local,
    )}`;
  }

  if (
    normalized.startsWith("62")
  ) {
    const local =
      normalized.slice(2);

    return `+62 ${groupPhoneDigits(
      local,
    )}`;
  }

  if (
    normalized.startsWith("0")
  ) {
    return `0${groupPhoneDigits(
      normalized.slice(1),
    )}`;
  }

  return normalized;
}

function groupPhoneDigits(
  value: string,
): string {
  const groups: string[] = [];

  for (
    let index = 0;
    index < value.length;
    index += 4
  ) {
    groups.push(
      value.slice(
        index,
        index + 4,
      ),
    );
  }

  return groups.join(" ");
}

/* -------------------------------------------------------------------------- */
/* Email formatting                                                           */
/* -------------------------------------------------------------------------- */

export function formatEmail(
  value: string | null | undefined,
): string {
  return value?.trim().toLowerCase() || "—";
}

/* -------------------------------------------------------------------------- */
/* Boolean formatting                                                         */
/* -------------------------------------------------------------------------- */

export function formatBoolean(
  value: boolean | null | undefined,
  labels: {
    trueLabel?: string;
    falseLabel?: string;
    emptyLabel?: string;
  } = {},
): string {
  if (value === undefined || value === null) {
    return labels.emptyLabel ?? "—";
  }

  return value
    ? labels.trueLabel ?? "Ya"
    : labels.falseLabel ?? "Tidak";
}

/* -------------------------------------------------------------------------- */
/* Ordinal / count formatting                                                 */
/* -------------------------------------------------------------------------- */

export function formatCount(
  value: number | null | undefined,
  singular: string,
  plural?: string,
): string {
  if (
    value === null ||
    value === undefined ||
    !Number.isFinite(value)
  ) {
    return "—";
  }

  const count = Math.trunc(value);

  const label =
    Math.abs(count) === 1
      ? singular
      : plural ?? `${singular}`;

  return `${formatInteger(
    count,
  )} ${label}`;
}

/* -------------------------------------------------------------------------- */
/* Waste-specific formatting                                                  */
/* -------------------------------------------------------------------------- */

export function formatWasteCategory(
  value: string | null | undefined,
): string {
  const normalized =
    value?.trim().toLowerCase() ?? "";

  const labels: Record<
    string,
    string
  > = {
    organic: "Organik",
    inorganic: "Anorganik",
    hazardous: "B3",
    electronic: "Elektronik",
    residual: "Residu",
  };

  return (
    labels[normalized] ??
    capitalize(normalized) ??
    "—"
  );
}

/* -------------------------------------------------------------------------- */
/* Report-specific formatting                                                 */
/* -------------------------------------------------------------------------- */

export function formatReportStatus(
  value: string | null | undefined,
): string {
  const normalized =
    value?.trim().toLowerCase() ?? "";

  const labels: Record<
    string,
    string
  > = {
    pending: "Menunggu",
    verified: "Terverifikasi",
    "in-progress": "Dalam proses",
    resolved: "Selesai",
    rejected: "Ditolak",
  };

  return labels[normalized] ?? "—";
}

export function formatReportPriority(
  value: string | null | undefined,
): string {
  const normalized =
    value?.trim().toLowerCase() ?? "";

  const labels: Record<
    string,
    string
  > = {
    low: "Rendah",
    medium: "Sedang",
    high: "Tinggi",
  };

  return labels[normalized] ?? "—";
}

export function formatReportType(
  value: string | null | undefined,
): string {
  const normalized =
    value?.trim().toLowerCase() ?? "";

  const labels: Record<
    string,
    string
  > = {
    "illegal-dumping":
      "Pembuangan ilegal",
    "overflowing-waste":
      "Sampah meluap",
    "burning-waste":
      "Pembakaran sampah",
    "hazardous-waste":
      "Limbah berbahaya",
    "environmental-pollution":
      "Pencemaran lingkungan",
    other: "Lainnya",
  };

  return labels[normalized] ?? "—";
}

/* -------------------------------------------------------------------------- */
/* Organization formatting                                                    */
/* -------------------------------------------------------------------------- */

export function formatOrganizationType(
  value: string | null | undefined,
): string {
  const normalized =
    value?.trim().toLowerCase() ?? "";

  const labels: Record<
    string,
    string
  > = {
    community: "Komunitas",
    business: "Usaha",
    government: "Pemerintah",
    non_profit: "Organisasi Nirlaba",
    ngo: "LSM",
    institution: "Institusi",
    other: "Lainnya",
  };

  return labels[normalized] ?? "—";
}

export function formatOrganizationStatus(
  value: string | null | undefined,
): string {
  const normalized =
    value?.trim().toLowerCase() ?? "";

  const labels: Record<
    string,
    string
  > = {
    draft: "Draft",
    pending: "Menunggu verifikasi",
    verified: "Terverifikasi",
    active: "Aktif",
    inactive: "Tidak aktif",
    rejected: "Ditolak",
  };

  return labels[normalized] ?? "—";
}

/* -------------------------------------------------------------------------- */
/* Generic safe formatting                                                    */
/* -------------------------------------------------------------------------- */

export function formatValue(
  value:
    | string
    | number
    | boolean
    | Date
    | null
    | undefined,
): string {
  if (
    value === null ||
    value === undefined
  ) {
    return "—";
  }

  if (value instanceof Date) {
    return formatDate(value);
  }

  if (typeof value === "number") {
    return formatNumber(value);
  }

  if (typeof value === "boolean") {
    return formatBoolean(value);
  }

  return formatText(value);
}
