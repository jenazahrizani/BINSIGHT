/**
 * BINSIGHT — Validation Utilities
 *
 * Centralized validation helpers for:
 * - public forms
 * - organization management
 * - waste management
 * - location management
 * - reports
 * - authentication
 * - administration
 *
 * Characteristics:
 * - strict TypeScript
 * - SSR safe
 * - dependency-free
 * - reusable on client and server
 */

/* -------------------------------------------------------------------------- */
/* Types                                                                      */
/* -------------------------------------------------------------------------- */

export interface ValidationResult {
  valid: boolean;
  message?: string;
}

export interface FieldValidationResult
  extends ValidationResult {
  field: string;
}

export interface ValidationIssue {
  field: string;
  message: string;
  code: string;
}

export interface ValidationSummary {
  valid: boolean;
  issues: ValidationIssue[];
}

export interface StringValidationOptions {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  trim?: boolean;
  pattern?: RegExp;
  message?: string;
}

export interface NumberValidationOptions {
  required?: boolean;
  min?: number;
  max?: number;
  integer?: boolean;
  finite?: boolean;
  message?: string;
}

export interface ArrayValidationOptions {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  message?: string;
}

/* -------------------------------------------------------------------------- */
/* Messages                                                                   */
/* -------------------------------------------------------------------------- */

export const VALIDATION_MESSAGES = {
  REQUIRED: "Field wajib diisi.",
  INVALID: "Nilai tidak valid.",
  TOO_SHORT: "Nilai terlalu pendek.",
  TOO_LONG: "Nilai terlalu panjang.",
  INVALID_EMAIL: "Format email tidak valid.",
  INVALID_PHONE:
    "Format nomor telepon tidak valid.",
  INVALID_URL: "Format URL tidak valid.",
  INVALID_NUMBER:
    "Format angka tidak valid.",
  NOT_INTEGER:
    "Nilai harus berupa bilangan bulat.",
  TOO_SMALL:
    "Nilai berada di bawah batas minimum.",
  TOO_LARGE:
    "Nilai melebihi batas maksimum.",
  INVALID_PATTERN:
    "Format nilai tidak sesuai.",
  PASSWORD_SHORT:
    "Password terlalu pendek.",
  PASSWORD_WEAK:
    "Password belum memenuhi persyaratan keamanan.",
  PASSWORD_MISMATCH:
    "Konfirmasi password tidak cocok.",
} as const;

/* -------------------------------------------------------------------------- */
/* Internal helpers                                                           */
/* -------------------------------------------------------------------------- */

function normalizeText(
  value: string | null | undefined,
): string {
  return value?.trim() ?? "";
}

function safeLength(
  value: number | undefined,
  fallback: number,
): number {
  if (
    value === undefined ||
    !Number.isFinite(value)
  ) {
    return fallback;
  }

  return Math.max(
    0,
    Math.trunc(value),
  );
}

/* -------------------------------------------------------------------------- */
/* Required                                                                   */
/* -------------------------------------------------------------------------- */

export function isPresent(
  value: unknown,
): boolean {
  if (
    value === null ||
    value === undefined
  ) {
    return false;
  }

  if (typeof value === "string") {
    return value.trim().length > 0;
  }

  if (Array.isArray(value)) {
    return value.length > 0;
  }

  return true;
}

export function validateRequired(
  value: unknown,
  message =
    VALIDATION_MESSAGES.REQUIRED,
): ValidationResult {
  return isPresent(value)
    ? { valid: true }
    : {
        valid: false,
        message,
      };
}

/* -------------------------------------------------------------------------- */
/* String                                                                     */
/* -------------------------------------------------------------------------- */

export function validateString(
  value: string | null | undefined,
  options: StringValidationOptions = {},
): ValidationResult {
  const required =
    options.required === true;

  const normalized =
    options.trim === false
      ? value ?? ""
      : normalizeText(value);

  if (!normalized) {
    return required
      ? {
          valid: false,
          message:
            options.message ??
            VALIDATION_MESSAGES.REQUIRED,
        }
      : {
          valid: true,
        };
  }

  if (
    options.minLength !== undefined &&
    normalized.length <
      safeLength(
        options.minLength,
        0,
      )
  ) {
    return {
      valid: false,
      message:
        options.message ??
        VALIDATION_MESSAGES.TOO_SHORT,
    };
  }

  if (
    options.maxLength !== undefined &&
    normalized.length >
      safeLength(
        options.maxLength,
        Number.MAX_SAFE_INTEGER,
      )
  ) {
    return {
      valid: false,
      message:
        options.message ??
        VALIDATION_MESSAGES.TOO_LONG,
    };
  }

  if (
    options.pattern &&
    !options.pattern.test(normalized)
  ) {
    return {
      valid: false,
      message:
        options.message ??
        VALIDATION_MESSAGES.INVALID_PATTERN,
    };
  }

  return {
    valid: true,
  };
}

export function isNonEmptyString(
  value: string | null | undefined,
): value is string {
  return (
    normalizeText(value).length > 0
  );
}

/* -------------------------------------------------------------------------- */
/* Length                                                                     */
/* -------------------------------------------------------------------------- */

export function hasMinLength(
  value: string | null | undefined,
  minLength: number,
): boolean {
  return (
    normalizeText(value).length >=
    Math.max(
      0,
      Math.trunc(minLength),
    )
  );
}

export function hasMaxLength(
  value: string | null | undefined,
  maxLength: number,
): boolean {
  return (
    normalizeText(value).length <=
    Math.max(
      0,
      Math.trunc(maxLength),
    )
  );
}

export function isLengthBetween(
  value: string | null | undefined,
  minLength: number,
  maxLength: number,
): boolean {
  const length =
    normalizeText(value).length;

  return (
    length >=
      Math.max(
        0,
        Math.trunc(minLength),
      ) &&
    length <=
      Math.max(
        0,
        Math.trunc(maxLength),
      )
  );
}

/* -------------------------------------------------------------------------- */
/* Email                                                                      */
/* -------------------------------------------------------------------------- */

const EMAIL_PATTERN =
  /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

export function isValidEmail(
  value: string | null | undefined,
): boolean {
  const normalized =
    normalizeText(value);

  return (
    normalized.length > 0 &&
    EMAIL_PATTERN.test(normalized)
  );
}

export function validateEmail(
  value: string | null | undefined,
  required = true,
): ValidationResult {
  const normalized =
    normalizeText(value);

  if (!normalized) {
    return required
      ? {
          valid: false,
          message:
            VALIDATION_MESSAGES.REQUIRED,
        }
      : {
          valid: true,
        };
  }

  return isValidEmail(normalized)
    ? { valid: true }
    : {
        valid: false,
        message:
          VALIDATION_MESSAGES.INVALID_EMAIL,
      };
}

/* -------------------------------------------------------------------------- */
/* Phone                                                                      */
/* -------------------------------------------------------------------------- */

export function normalizePhone(
  value: string | null | undefined,
): string {
  return (
    value
      ?.replace(/[^\d+]/g, "")
      .trim() ?? ""
  );
}

export function isValidPhone(
  value: string | null | undefined,
): boolean {
  const normalized =
    normalizePhone(value);

  if (!normalized) {
    return false;
  }

  const international =
    /^\+?[1-9]\d{7,14}$/;

  const localIndonesia =
    /^08\d{8,11}$/;

  const indonesia62 =
    /^62\d{9,12}$/;

  return (
    international.test(normalized) ||
    localIndonesia.test(normalized) ||
    indonesia62.test(normalized)
  );
}

export function validatePhone(
  value: string | null | undefined,
  required = false,
): ValidationResult {
  const normalized =
    normalizeText(value);

  if (!normalized) {
    return required
      ? {
          valid: false,
          message:
            VALIDATION_MESSAGES.REQUIRED,
        }
      : {
          valid: true,
        };
  }

  return isValidPhone(normalized)
    ? { valid: true }
    : {
        valid: false,
        message:
          VALIDATION_MESSAGES.INVALID_PHONE,
      };
}

/* -------------------------------------------------------------------------- */
/* URL                                                                        */
/* -------------------------------------------------------------------------- */

export function isValidUrl(
  value: string | null | undefined,
): boolean {
  const normalized =
    normalizeText(value);

  if (!normalized) {
    return false;
  }

  try {
    const url = new URL(normalized);

    return (
      url.protocol === "http:" ||
      url.protocol === "https:"
    );
  } catch {
    return false;
  }
}

export function validateUrl(
  value: string | null | undefined,
  required = false,
): ValidationResult {
  const normalized =
    normalizeText(value);

  if (!normalized) {
    return required
      ? {
          valid: false,
          message:
            VALIDATION_MESSAGES.REQUIRED,
        }
      : {
          valid: true,
        };
  }

  return isValidUrl(normalized)
    ? { valid: true }
    : {
        valid: false,
        message:
          VALIDATION_MESSAGES.INVALID_URL,
      };
}

/* -------------------------------------------------------------------------- */
/* Number                                                                     */
/* -------------------------------------------------------------------------- */

export function isValidNumber(
  value: unknown,
): value is number {
  return (
    typeof value === "number" &&
    Number.isFinite(value)
  );
}

export function validateNumber(
  value: number | null | undefined,
  options: NumberValidationOptions = {},
): ValidationResult {
  const required =
    options.required === true;

  /*
   * `value` is intentionally number | null | undefined.
   * Do not compare it against a string such as "".
   */
  if (
    value === null ||
    value === undefined
  ) {
    return required
      ? {
          valid: false,
          message:
            options.message ??
            VALIDATION_MESSAGES.REQUIRED,
        }
      : {
          valid: true,
        };
  }

  if (
    typeof value !== "number" ||
    (options.finite !== false &&
      !Number.isFinite(value))
  ) {
    return {
      valid: false,
      message:
        options.message ??
        VALIDATION_MESSAGES.INVALID_NUMBER,
    };
  }

  if (
    options.integer === true &&
    !Number.isInteger(value)
  ) {
    return {
      valid: false,
      message:
        options.message ??
        VALIDATION_MESSAGES.NOT_INTEGER,
    };
  }

  if (
    options.min !== undefined &&
    value < options.min
  ) {
    return {
      valid: false,
      message:
        options.message ??
        VALIDATION_MESSAGES.TOO_SMALL,
    };
  }

  if (
    options.max !== undefined &&
    value > options.max
  ) {
    return {
      valid: false,
      message:
        options.message ??
        VALIDATION_MESSAGES.TOO_LARGE,
    };
  }

  return {
    valid: true,
  };
}

/* -------------------------------------------------------------------------- */
/* Integer / range                                                            */
/* -------------------------------------------------------------------------- */

export function isInteger(
  value: unknown,
): value is number {
  return (
    typeof value === "number" &&
    Number.isInteger(value)
  );
}

export function isWithinRange(
  value: number,
  min: number,
  max: number,
): boolean {
  if (!Number.isFinite(value)) {
    return false;
  }

  return (
    value >= min &&
    value <= max
  );
}

export function isPositiveNumber(
  value: unknown,
): value is number {
  return (
    typeof value === "number" &&
    Number.isFinite(value) &&
    value > 0
  );
}

export function isNonNegativeNumber(
  value: unknown,
): value is number {
  return (
    typeof value === "number" &&
    Number.isFinite(value) &&
    value >= 0
  );
}

/* -------------------------------------------------------------------------- */
/* Arrays                                                                     */
/* -------------------------------------------------------------------------- */

export function validateArray<T>(
  value:
    | readonly T[]
    | null
    | undefined,
  options: ArrayValidationOptions = {},
): ValidationResult {
  const required =
    options.required === true;

  if (
    value === null ||
    value === undefined
  ) {
    return required
      ? {
          valid: false,
          message:
            options.message ??
            VALIDATION_MESSAGES.REQUIRED,
        }
      : {
          valid: true,
        };
  }

  if (!Array.isArray(value)) {
    return {
      valid: false,
      message:
        options.message ??
        VALIDATION_MESSAGES.INVALID,
    };
  }

  if (
    options.minLength !== undefined &&
    value.length <
      Math.max(
        0,
        Math.trunc(
          options.minLength,
        ),
      )
  ) {
    return {
      valid: false,
      message:
        options.message ??
        VALIDATION_MESSAGES.TOO_SHORT,
    };
  }

  if (
    options.maxLength !== undefined &&
    value.length >
      Math.max(
        0,
        Math.trunc(
          options.maxLength,
        ),
      )
  ) {
    return {
      valid: false,
      message:
        options.message ??
        VALIDATION_MESSAGES.TOO_LONG,
    };
  }

  return {
    valid: true,
  };
}

export function isNonEmptyArray(
  value: unknown,
): value is readonly unknown[] {
  return (
    Array.isArray(value) &&
    value.length > 0
  );
}

/* -------------------------------------------------------------------------- */
/* Password                                                                   */
/* -------------------------------------------------------------------------- */

export interface PasswordValidationOptions {
  minLength?: number;
  requireUppercase?: boolean;
  requireLowercase?: boolean;
  requireNumber?: boolean;
  requireSpecialCharacter?: boolean;
}

export function validatePassword(
  password:
    | string
    | null
    | undefined,
  options: PasswordValidationOptions = {},
): ValidationResult {
  const value = password ?? "";

  const minLength =
    Math.max(
      8,
      Math.trunc(
        options.minLength ?? 8,
      ),
    );

  if (value.length < minLength) {
    return {
      valid: false,
      message:
        VALIDATION_MESSAGES.PASSWORD_SHORT,
    };
  }

  if (
    options.requireUppercase !== false &&
    !/[A-Z]/.test(value)
  ) {
    return {
      valid: false,
      message:
        VALIDATION_MESSAGES.PASSWORD_WEAK,
    };
  }

  if (
    options.requireLowercase !== false &&
    !/[a-z]/.test(value)
  ) {
    return {
      valid: false,
      message:
        VALIDATION_MESSAGES.PASSWORD_WEAK,
    };
  }

  if (
    options.requireNumber !== false &&
    !/\d/.test(value)
  ) {
    return {
      valid: false,
      message:
        VALIDATION_MESSAGES.PASSWORD_WEAK,
    };
  }

  if (
    options.requireSpecialCharacter !==
      false &&
    !/[^A-Za-z0-9]/.test(value)
  ) {
    return {
      valid: false,
      message:
        VALIDATION_MESSAGES.PASSWORD_WEAK,
    };
  }

  return {
    valid: true,
  };
}

export function passwordsMatch(
  password:
    | string
    | null
    | undefined,
  confirmation:
    | string
    | null
    | undefined,
): boolean {
  return (
    password !== undefined &&
    password !== null &&
    confirmation !== undefined &&
    confirmation !== null &&
    password === confirmation
  );
}

export function validatePasswordConfirmation(
  password:
    | string
    | null
    | undefined,
  confirmation:
    | string
    | null
    | undefined,
): ValidationResult {
  return passwordsMatch(
    password,
    confirmation,
  )
    ? { valid: true }
    : {
        valid: false,
        message:
          VALIDATION_MESSAGES.PASSWORD_MISMATCH,
      };
}

/* -------------------------------------------------------------------------- */
/* Slug                                                                       */
/* -------------------------------------------------------------------------- */

export function isValidSlug(
  value: string | null | undefined,
): boolean {
  const normalized =
    normalizeText(value);

  if (
    !normalized ||
    normalized.length > 100
  ) {
    return false;
  }

  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(
    normalized,
  );
}

export function validateSlug(
  value: string | null | undefined,
  required = true,
): ValidationResult {
  const normalized =
    normalizeText(value);

  if (!normalized) {
    return required
      ? {
          valid: false,
          message:
            VALIDATION_MESSAGES.REQUIRED,
        }
      : {
          valid: true,
        };
  }

  return isValidSlug(normalized)
    ? { valid: true }
    : {
        valid: false,
        message:
          VALIDATION_MESSAGES.INVALID_PATTERN,
      };
}

/* -------------------------------------------------------------------------- */
/* Coordinates                                                                */
/* -------------------------------------------------------------------------- */

export function isValidLatitude(
  value: unknown,
): value is number {
  return (
    typeof value === "number" &&
    Number.isFinite(value) &&
    value >= -90 &&
    value <= 90
  );
}

export function isValidLongitude(
  value: unknown,
): value is number {
  return (
    typeof value === "number" &&
    Number.isFinite(value) &&
    value >= -180 &&
    value <= 180
  );
}

export function validateCoordinates(
  lat: number | null | undefined,
  lng: number | null | undefined,
): ValidationResult {
  if (
    !isValidLatitude(lat) ||
    !isValidLongitude(lng)
  ) {
    return {
      valid: false,
      message:
        "Koordinat lokasi tidak valid.",
    };
  }

  return {
    valid: true,
  };
}

/* -------------------------------------------------------------------------- */
/* Date                                                                       */
/* -------------------------------------------------------------------------- */

export function isValidDate(
  value:
    | Date
    | string
    | number
    | null
    | undefined,
): boolean {
  if (
    value === null ||
    value === undefined
  ) {
    return false;
  }

  const date =
    value instanceof Date
      ? new Date(value.getTime())
      : new Date(value);

  return !Number.isNaN(
    date.getTime(),
  );
}

export function validateDate(
  value:
    | Date
    | string
    | number
    | null
    | undefined,
  required = true,
): ValidationResult {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return required
      ? {
          valid: false,
          message:
            VALIDATION_MESSAGES.REQUIRED,
        }
      : {
          valid: true,
        };
  }

  return isValidDate(value)
    ? { valid: true }
    : {
        valid: false,
        message:
          VALIDATION_MESSAGES.INVALID,
      };
}

/* -------------------------------------------------------------------------- */
/* Enum / option                                                              */
/* -------------------------------------------------------------------------- */

export function isOneOf<T>(
  value: unknown,
  values: readonly T[],
): value is T {
  return values.includes(
    value as T,
  );
}

export function validateOneOf<T>(
  value: unknown,
  values: readonly T[],
  required = true,
): ValidationResult {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return required
      ? {
          valid: false,
          message:
            VALIDATION_MESSAGES.REQUIRED,
        }
      : {
          valid: true,
        };
  }

  return isOneOf(value, values)
    ? { valid: true }
    : {
        valid: false,
        message:
          VALIDATION_MESSAGES.INVALID,
      };
}

/* -------------------------------------------------------------------------- */
/* Form validation                                                            */
/* -------------------------------------------------------------------------- */

export interface FormFieldRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  type?:
    | "string"
    | "email"
    | "phone"
    | "url"
    | "number"
    | "integer"
    | "slug";
  min?: number;
  max?: number;
}

export type FormRules<
  T extends Record<string, unknown>,
> = Partial<
  Record<
    keyof T,
    FormFieldRule
  >
>;

export function validateField(
  field: string,
  value: unknown,
  rule: FormFieldRule,
): FieldValidationResult {
  switch (rule.type) {
    case "email": {
      const result =
        validateEmail(
          typeof value === "string"
            ? value
            : undefined,
          rule.required !== false,
        );

      return {
        field,
        ...result,
      };
    }

    case "phone": {
      const result =
        validatePhone(
          typeof value === "string"
            ? value
            : undefined,
          rule.required === true,
        );

      return {
        field,
        ...result,
      };
    }

    case "url": {
      const result =
        validateUrl(
          typeof value === "string"
            ? value
            : undefined,
          rule.required === true,
        );

      return {
        field,
        ...result,
      };
    }

    case "number": {
      const numericValue =
        typeof value === "number"
          ? value
          : undefined;

      const result =
        validateNumber(
          numericValue,
          {
            required:
              rule.required === true,
            min: rule.min,
            max: rule.max,
            finite: true,
          },
        );

      return {
        field,
        ...result,
      };
    }

    case "integer": {
      const numericValue =
        typeof value === "number"
          ? value
          : undefined;

      const result =
        validateNumber(
          numericValue,
          {
            required:
              rule.required === true,
            min: rule.min,
            max: rule.max,
            integer: true,
            finite: true,
          },
        );

      return {
        field,
        ...result,
      };
    }

    case "slug": {
      const result =
        validateSlug(
          typeof value === "string"
            ? value
            : undefined,
          rule.required !== false,
        );

      return {
        field,
        ...result,
      };
    }

    case "string":
    default: {
      const result =
        validateString(
          typeof value === "string"
            ? value
            : undefined,
          {
            required:
              rule.required === true,
            minLength:
              rule.minLength,
            maxLength:
              rule.maxLength,
            pattern:
              rule.pattern,
          },
        );

      return {
        field,
        ...result,
      };
    }
  }
}

export function validateForm<
  T extends Record<string, unknown>,
>(
  values: T,
  rules: FormRules<T>,
): ValidationSummary {
  const issues: ValidationIssue[] = [];

  for (const key of Object.keys(
    rules,
  ) as Array<keyof T>) {
    const rule = rules[key];

    if (!rule) {
      continue;
    }

    const result =
      validateField(
        String(key),
        values[key],
        rule,
      );

    if (!result.valid) {
      issues.push({
        field: result.field,
        message:
          result.message ??
          VALIDATION_MESSAGES.INVALID,
        code: getValidationCode(
          result.message,
        ),
      });
    }
  }

  return {
    valid: issues.length === 0,
    issues,
  };
}

function getValidationCode(
  message: string | undefined,
): string {
  switch (message) {
    case VALIDATION_MESSAGES.REQUIRED:
      return "required";

    case VALIDATION_MESSAGES.TOO_SHORT:
      return "too_short";

    case VALIDATION_MESSAGES.TOO_LONG:
      return "too_long";

    case VALIDATION_MESSAGES.INVALID_EMAIL:
      return "invalid_email";

    case VALIDATION_MESSAGES.INVALID_PHONE:
      return "invalid_phone";

    case VALIDATION_MESSAGES.INVALID_URL:
      return "invalid_url";

    case VALIDATION_MESSAGES.INVALID_NUMBER:
      return "invalid_number";

    case VALIDATION_MESSAGES.NOT_INTEGER:
      return "not_integer";

    case VALIDATION_MESSAGES.TOO_SMALL:
      return "too_small";

    case VALIDATION_MESSAGES.TOO_LARGE:
      return "too_large";

    case VALIDATION_MESSAGES.PASSWORD_SHORT:
      return "password_short";

    case VALIDATION_MESSAGES.PASSWORD_WEAK:
      return "password_weak";

    case VALIDATION_MESSAGES.PASSWORD_MISMATCH:
      return "password_mismatch";

    default:
      return "invalid";
  }
}

/* -------------------------------------------------------------------------- */
/* BINSIGHT-specific validation                                               */
/* -------------------------------------------------------------------------- */

export function validateOrganizationName(
  value: string | null | undefined,
): ValidationResult {
  return validateString(value, {
    required: true,
    minLength: 2,
    maxLength: 150,
  });
}

export function validateWasteName(
  value: string | null | undefined,
): ValidationResult {
  return validateString(value, {
    required: true,
    minLength: 2,
    maxLength: 100,
  });
}

export function validateLocationName(
  value: string | null | undefined,
): ValidationResult {
  return validateString(value, {
    required: true,
    minLength: 2,
    maxLength: 150,
  });
}

export function validateReportTitle(
  value: string | null | undefined,
): ValidationResult {
  return validateString(value, {
    required: true,
    minLength: 5,
    maxLength: 150,
  });
}

export function validateDescription(
  value: string | null | undefined,
  minLength = 10,
  maxLength = 5000,
): ValidationResult {
  return validateString(value, {
    required: true,
    minLength,
    maxLength,
  });
}

/* -------------------------------------------------------------------------- */
/* Uniqueness                                                                 */
/* -------------------------------------------------------------------------- */

export function isUniqueValue(
  value: string | null | undefined,
  existingValues:
    | readonly string[]
    | null
    | undefined,
): boolean {
  const normalized =
    normalizeText(value).toLowerCase();

  if (!normalized) {
    return false;
  }

  return !(existingValues ?? []).some(
    (existing) =>
      normalizeText(existing)
        .toLowerCase() ===
      normalized,
  );
}

export function isUniqueSlug(
  slug: string | null | undefined,
  existingSlugs:
    | readonly string[]
    | null
    | undefined,
): boolean {
  const normalized =
    normalizeText(slug).toLowerCase();

  if (!isValidSlug(normalized)) {
    return false;
  }

  return !(existingSlugs ?? []).some(
    (existing) =>
      normalizeText(existing)
        .toLowerCase() ===
      normalized,
  );
}

/* -------------------------------------------------------------------------- */
/* Normalization                                                              */
/* -------------------------------------------------------------------------- */

export function trimString(
  value: string | null | undefined,
): string {
  return normalizeText(value);
}

export function normalizeEmail(
  value: string | null | undefined,
): string {
  return normalizeText(value)
    .toLowerCase();
}

export function normalizeUrl(
  value: string | null | undefined,
): string {
  return normalizeText(value);
}

/* -------------------------------------------------------------------------- */
/* Result helpers                                                             */
/* -------------------------------------------------------------------------- */

export function validationSuccess(): ValidationResult {
  return {
    valid: true,
  };
}

export function validationFailure(
  message =
    VALIDATION_MESSAGES.INVALID,
): ValidationResult {
  return {
    valid: false,
    message,
  };
}

export function getValidationMessage(
  result: ValidationResult,
  fallback =
    VALIDATION_MESSAGES.INVALID,
): string {
  return (
    result.message ??
    fallback
  );
}