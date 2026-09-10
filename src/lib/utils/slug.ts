/**
 * BINSIGHT — Slug Utilities
 *
 * Centralized helpers for creating and validating URL-safe slugs.
 *
 * Characteristics:
 * - deterministic
 * - dependency-free
 * - SSR-safe
 * - Unicode-aware
 * - Indonesian-friendly
 * - strict TypeScript
 */

export interface SlugOptions {
  maxLength?: number;
  collapseSeparators?: boolean;
  lowercase?: boolean;
  separator?: string;
  allowNumbers?: boolean;
}

export interface UniqueSlugOptions
  extends SlugOptions {
  existingSlugs?: readonly string[];
  maxAttempts?: number;
}

export const DEFAULT_SLUG_MAX_LENGTH = 100;

export const DEFAULT_SLUG_SEPARATOR = "-";

export const DEFAULT_SLUG_MAX_ATTEMPTS = 1000;

const CHARACTER_MAP: Readonly<
  Record<string, string>
> = {
  æ: "ae",
  Æ: "AE",
  œ: "oe",
  Œ: "OE",
  ø: "o",
  Ø: "O",
  đ: "d",
  Đ: "D",
  ð: "d",
  Ð: "D",
  þ: "th",
  Þ: "Th",
  ł: "l",
  Ł: "L",
  ħ: "h",
  Ħ: "H",
  ı: "i",
  ĸ: "k",
  ŧ: "t",
  Ŧ: "T",
};

/* -------------------------------------------------------------------------- */
/* Internal helpers                                                           */
/* -------------------------------------------------------------------------- */

function applyCharacterMap(
  value: string,
): string {
  return value.replace(
    /[æÆœŒøØđĐðÐþÞłŁħĦıĸŧŦ]/g,
    (character) =>
      CHARACTER_MAP[character] ?? character,
  );
}

function stripDiacritics(
  value: string,
): string {
  return value
    .normalize("NFKD")
    .replace(
      /[\u0300-\u036f]/g,
      "",
    );
}

function normalizeSeparator(
  separator: string | undefined,
): string {
  const normalized =
    separator?.trim() ?? "";

  return (
    normalized ||
    DEFAULT_SLUG_SEPARATOR
  );
}

function normalizeMaxLength(
  maxLength: number | undefined,
): number {
  if (
    maxLength === undefined ||
    !Number.isFinite(maxLength)
  ) {
    return DEFAULT_SLUG_MAX_LENGTH;
  }

  return Math.max(
    1,
    Math.trunc(maxLength),
  );
}

function normalizeMaxAttempts(
  maxAttempts: number | undefined,
): number {
  if (
    maxAttempts === undefined ||
    !Number.isFinite(maxAttempts)
  ) {
    return DEFAULT_SLUG_MAX_ATTEMPTS;
  }

  return Math.max(
    1,
    Math.trunc(maxAttempts),
  );
}

function escapeRegExp(
  value: string,
): string {
  return value.replace(
    /[.*+?^${}()|[\]\\]/g,
    "\\$&",
  );
}

/* -------------------------------------------------------------------------- */
/* Basic normalization                                                        */
/* -------------------------------------------------------------------------- */

export function normalizeSlugSource(
  value: string | null | undefined,
): string {
  if (
    value === null ||
    value === undefined
  ) {
    return "";
  }

  return applyCharacterMap(
    stripDiacritics(value.trim()),
  );
}

export function slugify(
  value: string | null | undefined,
  options: SlugOptions = {},
): string {
  const separator =
    normalizeSeparator(
      options.separator,
    );

  const maxLength =
    normalizeMaxLength(
      options.maxLength,
    );

  const lowercase =
    options.lowercase !== false;

  const collapseSeparators =
    options.collapseSeparators !== false;

  const allowNumbers =
    options.allowNumbers !== false;

  let result = normalizeSlugSource(value);

  if (!result) {
    return "";
  }

  if (lowercase) {
    result = result.toLowerCase();
  }

  const allowedPattern = allowNumbers
    ? /[^a-zA-Z0-9\s]+/g
    : /[^a-zA-Z\s]+/g;

  result = result.replace(
    allowedPattern,
    " ",
  );

  result = result.replace(
    /\s+/g,
    separator,
  );

  if (collapseSeparators) {
    const escapedSeparator =
      escapeRegExp(separator);

    result = result.replace(
      new RegExp(
        `${escapedSeparator}+`,
        "g",
      ),
      separator,
    );
  }

  const escapedSeparator =
    escapeRegExp(separator);

  result = result
    .replace(
      new RegExp(
        `^${escapedSeparator}+`,
        "g",
      ),
      "",
    )
    .replace(
      new RegExp(
        `${escapedSeparator}+$`,
        "g",
      ),
      "",
    );

  if (result.length <= maxLength) {
    return result;
  }

  result = result.slice(
    0,
    maxLength,
  );

  const separatorIndex =
    result.lastIndexOf(separator);

  if (
    separatorIndex > 0 &&
    separatorIndex >=
      Math.floor(maxLength * 0.6)
  ) {
    result = result.slice(
      0,
      separatorIndex,
    );
  }

  return result.replace(
    new RegExp(
      `${escapedSeparator}+$`,
      "g",
    ),
    "",
  );
}

export const createSlug = slugify;

/* -------------------------------------------------------------------------- */
/* Slug validation                                                            */
/* -------------------------------------------------------------------------- */

export function isValidSlug(
  value: string | null | undefined,
  options: SlugOptions = {},
): boolean {
  if (
    value === null ||
    value === undefined ||
    value.trim() === ""
  ) {
    return false;
  }

  const separator =
    normalizeSeparator(
      options.separator,
    );

  const maxLength =
    normalizeMaxLength(
      options.maxLength,
    );

  if (value !== value.trim()) {
    return false;
  }

  if (value.length > maxLength) {
    return false;
  }

  if (
    options.lowercase !== false &&
    value !== value.toLowerCase()
  ) {
    return false;
  }

  const escapedSeparator =
    escapeRegExp(separator);

  const allowedPattern =
    options.allowNumbers === false
      ? new RegExp(
          `^[a-zA-Z]+(?:${escapedSeparator}[a-zA-Z]+)*$`,
        )
      : new RegExp(
          `^[a-zA-Z0-9]+(?:${escapedSeparator}[a-zA-Z0-9]+)*$`,
        );

  if (!allowedPattern.test(value)) {
    return false;
  }

  if (
    options.collapseSeparators !== false &&
    new RegExp(
      `${escapedSeparator}{2,}`,
    ).test(value)
  ) {
    return false;
  }

  return true;
}

/* -------------------------------------------------------------------------- */
/* Sanitization                                                               */
/* -------------------------------------------------------------------------- */

export function sanitizeSlug(
  value: string | null | undefined,
  options: SlugOptions = {},
): string {
  /*
   * Explicitly narrow `value` before returning it.
   *
   * `isValidSlug()` returns a boolean, not a TypeScript
   * type predicate, so TypeScript cannot narrow `value`
   * automatically from that call alone.
   */
  if (
    typeof value === "string" &&
    isValidSlug(value, options)
  ) {
    return value;
  }

  return slugify(value, options);
}

/* -------------------------------------------------------------------------- */
/* Unique slugs                                                               */
/* -------------------------------------------------------------------------- */

export function makeUniqueSlug(
  value: string | null | undefined,
  options: UniqueSlugOptions = {},
): string {
  const baseSlug = slugify(
    value,
    options,
  );

  if (!baseSlug) {
    return "";
  }

  const existing = new Set(
    (options.existingSlugs ?? [])
      .map((slug) =>
        slugify(slug, options),
      )
      .filter(
        (slug) => slug.length > 0,
      ),
  );

  if (!existing.has(baseSlug)) {
    return baseSlug;
  }

  const separator =
    normalizeSeparator(
      options.separator,
    );

  const maxLength =
    normalizeMaxLength(
      options.maxLength,
    );

  const maxAttempts =
    normalizeMaxAttempts(
      options.maxAttempts,
    );

  const escapedSeparator =
    escapeRegExp(separator);

  for (
    let counter = 2;
    counter <= maxAttempts + 1;
    counter += 1
  ) {
    const suffix =
      `${separator}${counter}`;

    const availableLength =
      maxLength - suffix.length;

    if (availableLength <= 0) {
      continue;
    }

    const truncatedBase =
      baseSlug
        .slice(
          0,
          availableLength,
        )
        .replace(
          new RegExp(
            `${escapedSeparator}+$`,
            "g",
          ),
          "",
        );

    const candidate =
      `${truncatedBase}${suffix}`;

    if (!existing.has(candidate)) {
      return candidate;
    }
  }

  const fallbackSuffix =
    `${separator}x`;

  const fallbackLength =
    maxLength -
    fallbackSuffix.length;

  if (fallbackLength <= 0) {
    return baseSlug.slice(
      0,
      maxLength,
    );
  }

  return (
    baseSlug.slice(
      0,
      fallbackLength,
    ) + fallbackSuffix
  );
}

export const createUniqueSlug =
  makeUniqueSlug;

/* -------------------------------------------------------------------------- */
/* Slug comparison                                                            */
/* -------------------------------------------------------------------------- */

export function slugsEqual(
  first: string | null | undefined,
  second: string | null | undefined,
): boolean {
  const firstSlug =
    sanitizeSlug(first);

  const secondSlug =
    sanitizeSlug(second);

  return (
    firstSlug !== "" &&
    secondSlug !== "" &&
    firstSlug === secondSlug
  );
}

export function slugMatches(
  value: string | null | undefined,
  expected: string | null | undefined,
): boolean {
  if (
    value === null ||
    value === undefined ||
    expected === null ||
    expected === undefined
  ) {
    return false;
  }

  return (
    slugify(value) ===
    slugify(expected)
  );
}

/* -------------------------------------------------------------------------- */
/* Slug extraction                                                            */
/* -------------------------------------------------------------------------- */

export function extractSlug(
  value: string | null | undefined,
): string {
  if (
    value === null ||
    value === undefined
  ) {
    return "";
  }

  const normalized =
    value.trim();

  if (!normalized) {
    return "";
  }

  const withoutQuery =
    normalized.split("?", 1)[0] ?? "";

  const withoutHash =
    withoutQuery.split("#", 1)[0] ??
    "";

  const parts =
    withoutHash.split("/");

  const lastNonEmpty =
    [...parts]
      .reverse()
      .find(
        (part) =>
          part.trim().length > 0,
      );

  return sanitizeSlug(
    lastNonEmpty ?? "",
  );
}

/* -------------------------------------------------------------------------- */
/* Path helpers                                                               */
/* -------------------------------------------------------------------------- */

export function slugPath(
  ...parts: Array<
    string | null | undefined
  >
): string {
  return parts
    .map((part) =>
      slugify(part),
    )
    .filter(
      (part) => part.length > 0,
    )
    .join("/");
}

export function appendSlug(
  path: string | null | undefined,
  slug: string | null | undefined,
): string {
  const normalizedPath =
    path?.trim().replace(
      /\/+$/,
      "",
    ) ?? "";

  const normalizedSlug =
    slugify(slug);

  if (!normalizedPath) {
    return normalizedSlug
      ? `/${normalizedSlug}`
      : "";
  }

  if (!normalizedSlug) {
    return normalizedPath;
  }

  return `${normalizedPath}/${normalizedSlug}`;
}

/* -------------------------------------------------------------------------- */
/* Prefix helpers                                                             */
/* -------------------------------------------------------------------------- */

export function slugStartsWith(
  slug: string | null | undefined,
  prefix: string | null | undefined,
): boolean {
  const normalizedSlug =
    slugify(slug);

  const normalizedPrefix =
    slugify(prefix);

  if (
    !normalizedSlug ||
    !normalizedPrefix
  ) {
    return false;
  }

  return (
    normalizedSlug ===
      normalizedPrefix ||
    normalizedSlug.startsWith(
      `${normalizedPrefix}-`,
    )
  );
}

/* -------------------------------------------------------------------------- */
/* BINSIGHT-specific helpers                                                  */
/* -------------------------------------------------------------------------- */

export function slugFromTitle(
  title: string | null | undefined,
): string {
  return slugify(title, {
    maxLength: 100,
    lowercase: true,
    collapseSeparators: true,
    allowNumbers: true,
    separator: "-",
  });
}

export function slugFromName(
  name: string | null | undefined,
): string {
  return slugFromTitle(name);
}

export function slugFromOrganization(
  name: string | null | undefined,
): string {
  return slugify(name, {
    maxLength: 100,
    lowercase: true,
    collapseSeparators: true,
    allowNumbers: true,
  });
}

export function slugFromWaste(
  name: string | null | undefined,
): string {
  return slugify(name, {
    maxLength: 100,
    lowercase: true,
    collapseSeparators: true,
    allowNumbers: true,
  });
}

export function slugFromArea(
  name: string | null | undefined,
): string {
  return slugify(name, {
    maxLength: 80,
    lowercase: true,
    collapseSeparators: true,
    allowNumbers: true,
  });
}

/* -------------------------------------------------------------------------- */
/* Safe IDs                                                                   */
/* -------------------------------------------------------------------------- */

export function slugifyId(
  value: string | null | undefined,
): string {
  return (
    slugify(value, {
      maxLength: 100,
      lowercase: true,
      allowNumbers: true,
    }) || "item"
  );
}

/* -------------------------------------------------------------------------- */
/* Utility predicates                                                         */
/* -------------------------------------------------------------------------- */

export function hasSlug(
  value: string | null | undefined,
): boolean {
  return (
    sanitizeSlug(value).length > 0
  );
}

export function isEmptySlug(
  value: string | null | undefined,
): boolean {
  return (
    sanitizeSlug(value).length === 0
  );
}

/* -------------------------------------------------------------------------- */
/* Constants                                                                  */
/* -------------------------------------------------------------------------- */

export const SLUG_MAX_LENGTH =
  DEFAULT_SLUG_MAX_LENGTH;

export const SLUG_SEPARATOR =
  DEFAULT_SLUG_SEPARATOR;
