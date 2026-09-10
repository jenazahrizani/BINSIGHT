import {
  USER_ROLE,
  isUserRole,
  normalizeUserRole,
  type UserRole,
} from "@lib/auth/roles";

/* -------------------------------------------------------------------------- */
/* Types                                                                      */
/* -------------------------------------------------------------------------- */

export interface SessionUser {
  id: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  role: UserRole;
  active: boolean;
  emailVerified: boolean;
}

export interface Session {
  id: string;
  user: SessionUser;
  createdAt: string;
  expiresAt?: string;
  lastActivityAt: string;
}

export interface SessionUserInput {
  id: string;
  email?: string | null;
  displayName?: string | null;
  photoURL?: string | null;
  role?: unknown;
  active?: boolean | null;
  emailVerified?: boolean | null;
}

export interface SessionOptions {
  sessionId?: string;
  expiresInMs?: number;
  now?: Date;
}

export interface SessionValidationResult {
  valid: boolean;
  reason?: string;
  session?: Session;
}

/* -------------------------------------------------------------------------- */
/* Constants                                                                  */
/* -------------------------------------------------------------------------- */

export const SESSION_DEFAULT_TTL_MS =
  1000 * 60 * 60 * 24 * 7;

export const SESSION_MIN_TTL_MS =
  1000 * 60 * 5;

export const SESSION_MAX_TTL_MS =
  1000 * 60 * 60 * 24 * 30;

/* -------------------------------------------------------------------------- */
/* Utilities                                                                  */
/* -------------------------------------------------------------------------- */

function createSessionId(): string {
  const timestamp = Date.now().toString(36);

  const randomPart =
    typeof globalThis.crypto?.randomUUID ===
    "function"
      ? globalThis.crypto.randomUUID()
      : Math.random().toString(36).slice(2);

  return `session_${timestamp}_${randomPart}`;
}

function normalizeDate(
  value: string | Date | undefined,
): Date | undefined {
  if (!value) {
    return undefined;
  }

  const date =
    value instanceof Date
      ? value
      : new Date(value);

  if (Number.isNaN(date.getTime())) {
    return undefined;
  }

  return date;
}

function normalizeExpiresInMs(
  value: number | undefined,
): number {
  if (
    value === undefined ||
    !Number.isFinite(value)
  ) {
    return SESSION_DEFAULT_TTL_MS;
  }

  return Math.min(
    SESSION_MAX_TTL_MS,
    Math.max(
      SESSION_MIN_TTL_MS,
      value,
    ),
  );
}

/* -------------------------------------------------------------------------- */
/* Session user                                                               */
/* -------------------------------------------------------------------------- */

export function createSessionUser(
  input: SessionUserInput,
): SessionUser {
  return {
    id: input.id.trim(),
    email: input.email?.trim() ?? "",
    displayName:
      input.displayName?.trim() ||
      undefined,
    photoURL:
      input.photoURL?.trim() ||
      undefined,
    role: normalizeUserRole(input.role),
    active: input.active !== false,
    emailVerified:
      input.emailVerified === true,
  };
}

export function isSessionUser(
  value: unknown,
): value is SessionUser {
  if (
    typeof value !== "object" ||
    value === null
  ) {
    return false;
  }

  const candidate =
    value as Partial<SessionUser>;

  return (
    typeof candidate.id === "string" &&
    candidate.id.trim().length > 0 &&
    typeof candidate.email === "string" &&
    typeof candidate.active === "boolean" &&
    typeof candidate.emailVerified ===
      "boolean" &&
    isUserRole(candidate.role)
  );
}

/* -------------------------------------------------------------------------- */
/* Session creation                                                           */
/* -------------------------------------------------------------------------- */

export function createSession(
  user: SessionUserInput,
  options: SessionOptions = {},
): Session {
  const createdAt =
    options.now ?? new Date();

  const expiresInMs =
    normalizeExpiresInMs(
      options.expiresInMs,
    );

  const expiresAt = new Date(
    createdAt.getTime() +
      expiresInMs,
  );

  return {
    id:
      options.sessionId?.trim() ||
      createSessionId(),

    user: createSessionUser(user),

    createdAt:
      createdAt.toISOString(),

    expiresAt:
      expiresAt.toISOString(),

    lastActivityAt:
      createdAt.toISOString(),
  };
}

/* -------------------------------------------------------------------------- */
/* Validation                                                                 */
/* -------------------------------------------------------------------------- */

export function validateSession(
  session: Session | null | undefined,
  now = new Date(),
): SessionValidationResult {
  if (!session) {
    return {
      valid: false,
      reason: "Session not found.",
    };
  }

  if (
    typeof session.id !== "string" ||
    session.id.trim().length === 0
  ) {
    return {
      valid: false,
      reason: "Invalid session ID.",
    };
  }

  if (!isSessionUser(session.user)) {
    return {
      valid: false,
      reason: "Invalid session user.",
    };
  }

  if (!session.user.active) {
    return {
      valid: false,
      reason: "User account is inactive.",
    };
  }

  const createdAt = normalizeDate(
    session.createdAt,
  );

  if (!createdAt) {
    return {
      valid: false,
      reason:
        "Invalid session creation time.",
    };
  }

  const lastActivityAt =
    normalizeDate(
      session.lastActivityAt,
    );

  if (!lastActivityAt) {
    return {
      valid: false,
      reason:
        "Invalid session activity time.",
    };
  }

  if (session.expiresAt) {
    const expiresAt = normalizeDate(
      session.expiresAt,
    );

    if (!expiresAt) {
      return {
        valid: false,
        reason:
          "Invalid session expiry time.",
      };
    }

    if (
      expiresAt.getTime() <=
      now.getTime()
    ) {
      return {
        valid: false,
        reason:
          "Session has expired.",
      };
    }
  }

  return {
    valid: true,
    session,
  };
}

export function isSessionValid(
  session: Session | null | undefined,
  now = new Date(),
): session is Session {
  return validateSession(
    session,
    now,
  ).valid;
}

export function isSessionExpired(
  session: Session | null | undefined,
  now = new Date(),
): boolean {
  if (!session?.expiresAt) {
    return false;
  }

  const expiresAt = normalizeDate(
    session.expiresAt,
  );

  if (!expiresAt) {
    return true;
  }

  return (
    expiresAt.getTime() <=
    now.getTime()
  );
}

/* -------------------------------------------------------------------------- */
/* Activity                                                                   */
/* -------------------------------------------------------------------------- */

export function touchSession(
  session: Session,
  now = new Date(),
): Session {
  return {
    ...session,
    lastActivityAt:
      now.toISOString(),
  };
}

export function refreshSession(
  session: Session,
  expiresInMs =
    SESSION_DEFAULT_TTL_MS,
  now = new Date(),
): Session {
  const safeTtl =
    normalizeExpiresInMs(
      expiresInMs,
    );

  return {
    ...session,
    expiresAt: new Date(
      now.getTime() + safeTtl,
    ).toISOString(),
    lastActivityAt:
      now.toISOString(),
  };
}

/* -------------------------------------------------------------------------- */
/* Destruction                                                                */
/* -------------------------------------------------------------------------- */

export function destroySession(
  session: Session | null | undefined,
): null {
  void session;
  return null;
}

/* -------------------------------------------------------------------------- */
/* Serialization                                                              */
/* -------------------------------------------------------------------------- */

export function serializeSession(
  session: Session,
): string {
  return JSON.stringify(session);
}

export function parseSession(
  value: string | null | undefined,
): Session | null {
  if (!value?.trim()) {
    return null;
  }

  try {
    const parsed: unknown =
      JSON.parse(value);

    if (
      typeof parsed !== "object" ||
      parsed === null
    ) {
      return null;
    }

    const candidate =
      parsed as Partial<Session>;

    if (
      typeof candidate.id !== "string" ||
      !isSessionUser(
        candidate.user,
      )
    ) {
      return null;
    }

    if (
      typeof candidate.createdAt !==
        "string" ||
      typeof candidate.lastActivityAt !==
        "string"
    ) {
      return null;
    }

    return {
      id: candidate.id,
      user: candidate.user,
      createdAt:
        candidate.createdAt,
      expiresAt:
        typeof candidate.expiresAt ===
        "string"
          ? candidate.expiresAt
          : undefined,
      lastActivityAt:
        candidate.lastActivityAt,
    };
  } catch {
    return null;
  }
}

/* -------------------------------------------------------------------------- */
/* Identity helpers                                                           */
/* -------------------------------------------------------------------------- */

export function getSessionUser(
  session: Session | null | undefined,
): SessionUser | null {
  return session?.user ?? null;
}

export function getSessionUserId(
  session: Session | null | undefined,
): string | null {
  return session?.user.id ?? null;
}

export function getSessionUserRole(
  session: Session | null | undefined,
): UserRole {
  return (
    session?.user.role ??
    USER_ROLE.USER
  );
}

export function getSessionUserEmail(
  session: Session | null | undefined,
): string | null {
  return session?.user.email ?? null;
}

/* -------------------------------------------------------------------------- */
/* Session state                                                              */
/* -------------------------------------------------------------------------- */

export function hasActiveSession(
  session: Session | null | undefined,
  now = new Date(),
): boolean {
  return isSessionValid(
    session,
    now,
  );
}

export function isSessionAuthenticated(
  session: Session | null | undefined,
  now = new Date(),
): boolean {
  return isSessionValid(
    session,
    now,
  );
}

/* -------------------------------------------------------------------------- */
/* Role helpers                                                               */
/* -------------------------------------------------------------------------- */

export function sessionHasRole(
  session: Session | null | undefined,
  role: UserRole,
  now = new Date(),
): boolean {
  if (!isSessionValid(session, now)) {
    return false;
  }

  return session.user.role === role;
}

export function sessionHasAnyRole(
  session: Session | null | undefined,
  roles: readonly UserRole[],
  now = new Date(),
): boolean {
  if (!isSessionValid(session, now)) {
    return false;
  }

  return roles.includes(
    session.user.role,
  );
}

export function sessionIsAdmin(
  session: Session | null | undefined,
  now = new Date(),
): boolean {
  return sessionHasAnyRole(
    session,
    [
      USER_ROLE.ADMIN,
      USER_ROLE.SUPER_ADMIN,
    ],
    now,
  );
}

export function sessionIsSuperAdmin(
  session: Session | null | undefined,
  now = new Date(),
): boolean {
  return sessionHasRole(
    session,
    USER_ROLE.SUPER_ADMIN,
    now,
  );
}

export function sessionIsOrganization(
  session: Session | null | undefined,
  now = new Date(),
): boolean {
  return sessionHasRole(
    session,
    USER_ROLE.ORGANIZATION,
    now,
  );
}

/* -------------------------------------------------------------------------- */
/* Session capability                                                         */
/* -------------------------------------------------------------------------- */

export function canUseSession(
  session: Session | null | undefined,
  now = new Date(),
): boolean {
  return isSessionAuthenticated(
    session,
    now,
  );
}

/* -------------------------------------------------------------------------- */
/* Public-safe projection                                                    */
/* -------------------------------------------------------------------------- */

export interface PublicSessionUser {
  id: string;
  displayName?: string;
  photoURL?: string;
  role: UserRole;
}

export function getPublicSessionUser(
  session: Session | null | undefined,
  now = new Date(),
): PublicSessionUser | null {
  if (!isSessionValid(session, now)) {
    return null;
  }

  const { user } = session;

  return {
    id: user.id,
    displayName: user.displayName,
    photoURL: user.photoURL,
    role: user.role,
  };
}

/* -------------------------------------------------------------------------- */
/* Aliases                                                                    */
/* -------------------------------------------------------------------------- */

export const createUserSession =
  createSession;

export const validateUserSession =
  validateSession;

export const clearSession =
  destroySession;