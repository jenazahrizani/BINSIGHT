import type { UserRole } from "@lib/auth/roles";

/* -------------------------------------------------------------------------- */
/* Types                                                                      */
/* -------------------------------------------------------------------------- */

export interface GuardUser {
  id: string;
  role: UserRole;
  active?: boolean;
  disabled?: boolean;
  emailVerified?: boolean;
}

export interface GuardResult {
  allowed: boolean;
  reason?: string;
}

export interface GuardOptions {
  requireActive?: boolean;
  requireVerifiedEmail?: boolean;
}

export interface OwnershipOptions {
  allowAdmin?: boolean;
  allowSuperAdmin?: boolean;
}

export interface OrganizationAccess {
  organizationId: string;
  ownerUserId?: string;
}

export type GuardPolicy =
  | "authenticated"
  | "organization"
  | "admin"
  | "super-admin"
  | "administrative";

/* -------------------------------------------------------------------------- */
/* Authentication                                                             */
/* -------------------------------------------------------------------------- */

export function isAuthenticated(
  user: GuardUser | null | undefined,
  options: GuardOptions = {},
): user is GuardUser {
  if (!user) {
    return false;
  }

  if (!user.id.trim()) {
    return false;
  }

  if (
    options.requireActive !== false &&
    (user.active === false || user.disabled === true)
  ) {
    return false;
  }

  if (
    options.requireVerifiedEmail === true &&
    user.emailVerified !== true
  ) {
    return false;
  }

  return true;
}

export function requireAuthenticated(
  user: GuardUser | null | undefined,
  options: GuardOptions = {},
): GuardResult {
  if (!user) {
    return {
      allowed: false,
      reason: "Authentication required.",
    };
  }

  if (!user.id.trim()) {
    return {
      allowed: false,
      reason: "Invalid authenticated user.",
    };
  }

  if (
    options.requireActive !== false &&
    (user.active === false || user.disabled === true)
  ) {
    return {
      allowed: false,
      reason: "User account is inactive.",
    };
  }

  if (
    options.requireVerifiedEmail === true &&
    user.emailVerified !== true
  ) {
    return {
      allowed: false,
      reason: "Email verification required.",
    };
  }

  return {
    allowed: true,
  };
}

/* -------------------------------------------------------------------------- */
/* Role guards                                                                */
/* -------------------------------------------------------------------------- */

export function hasRole(
  user: GuardUser | null | undefined,
  roles: readonly UserRole[],
  options: GuardOptions = {},
): boolean {
  if (!isAuthenticated(user, options)) {
    return false;
  }

  return roles.includes(user.role);
}

export function hasExactRole(
  user: GuardUser | null | undefined,
  role: UserRole,
  options: GuardOptions = {},
): boolean {
  return hasRole(user, [role], options);
}

export function requireRole(
  user: GuardUser | null | undefined,
  roles: readonly UserRole[],
  options: GuardOptions = {},
): GuardResult {
  if (roles.length === 0) {
    return {
      allowed: false,
      reason: "No authorized roles were provided.",
    };
  }

  const authenticatedUser = getAuthenticatedUser(
    user,
    options,
  );

  if (!authenticatedUser) {
    return {
      allowed: false,
      reason: getAuthenticationFailureReason(
        user,
        options,
      ),
    };
  }

  if (!roles.includes(authenticatedUser.role)) {
    return {
      allowed: false,
      reason: "Insufficient permissions.",
    };
  }

  return {
    allowed: true,
  };
}

export function requireExactRole(
  user: GuardUser | null | undefined,
  role: UserRole,
  options: GuardOptions = {},
): GuardResult {
  return requireRole(user, [role], options);
}

/* -------------------------------------------------------------------------- */
/* Common BINSIGHT role guards                                                */
/* -------------------------------------------------------------------------- */

export function isUser(
  user: GuardUser | null | undefined,
): boolean {
  return isAuthenticated(user);
}

export function isOrganization(
  user: GuardUser | null | undefined,
): boolean {
  return hasExactRole(user, "organization");
}

export function isAdmin(
  user: GuardUser | null | undefined,
): boolean {
  return hasExactRole(user, "admin");
}

export function isSuperAdmin(
  user: GuardUser | null | undefined,
): boolean {
  return hasExactRole(user, "super-admin");
}

export function isAdministrative(
  user: GuardUser | null | undefined,
): boolean {
  return hasRole(user, ["admin", "super-admin"]);
}

export function canManageOrganizationArea(
  user: GuardUser | null | undefined,
): boolean {
  return hasRole(user, [
    "organization",
    "admin",
    "super-admin",
  ]);
}

export function canAccessAdmin(
  user: GuardUser | null | undefined,
): boolean {
  return hasRole(user, [
    "admin",
    "super-admin",
  ]);
}

/* -------------------------------------------------------------------------- */
/* Ownership                                                                  */
/* -------------------------------------------------------------------------- */

export function ownsResource(
  user: GuardUser | null | undefined,
  ownerId: string | null | undefined,
  options: OwnershipOptions = {},
): boolean {
  const authenticatedUser =
    getAuthenticatedUser(user);

  if (!authenticatedUser) {
    return false;
  }

  const normalizedOwnerId = ownerId?.trim();

  if (!normalizedOwnerId) {
    return false;
  }

  if (
    options.allowSuperAdmin !== false &&
    authenticatedUser.role === "super-admin"
  ) {
    return true;
  }

  if (
    options.allowAdmin !== false &&
    authenticatedUser.role === "admin"
  ) {
    return true;
  }

  return authenticatedUser.id === normalizedOwnerId;
}

export function requireOwnership(
  user: GuardUser | null | undefined,
  ownerId: string | null | undefined,
  options: OwnershipOptions = {},
): GuardResult {
  const authenticatedUser =
    getAuthenticatedUser(user);

  if (!authenticatedUser) {
    return {
      allowed: false,
      reason: "Authentication required.",
    };
  }

  const normalizedOwnerId = ownerId?.trim();

  if (!normalizedOwnerId) {
    return {
      allowed: false,
      reason: "Resource owner is missing.",
    };
  }

  if (
    options.allowSuperAdmin !== false &&
    authenticatedUser.role === "super-admin"
  ) {
    return {
      allowed: true,
    };
  }

  if (
    options.allowAdmin !== false &&
    authenticatedUser.role === "admin"
  ) {
    return {
      allowed: true,
    };
  }

  if (authenticatedUser.id !== normalizedOwnerId) {
    return {
      allowed: false,
      reason: "You do not own this resource.",
    };
  }

  return {
    allowed: true,
  };
}

/* -------------------------------------------------------------------------- */
/* Organization access                                                        */
/* -------------------------------------------------------------------------- */

export function canAccessOrganization(
  user: GuardUser | null | undefined,
  organization:
    | OrganizationAccess
    | null
    | undefined,
): boolean {
  if (!organization?.organizationId.trim()) {
    return false;
  }

  const authenticatedUser =
    getAuthenticatedUser(user);

  if (!authenticatedUser) {
    return false;
  }

  if (
    authenticatedUser.role === "admin" ||
    authenticatedUser.role === "super-admin"
  ) {
    return true;
  }

  if (
    authenticatedUser.role !== "organization"
  ) {
    return false;
  }

  if (!organization.ownerUserId?.trim()) {
    return false;
  }

  return (
    authenticatedUser.id ===
    organization.ownerUserId
  );
}

export function requireOrganizationAccess(
  user: GuardUser | null | undefined,
  organization:
    | OrganizationAccess
    | null
    | undefined,
): GuardResult {
  const authenticatedUser =
    getAuthenticatedUser(user);

  if (!authenticatedUser) {
    return {
      allowed: false,
      reason: "Authentication required.",
    };
  }

  if (!organization?.organizationId.trim()) {
    return {
      allowed: false,
      reason: "Organization information is missing.",
    };
  }

  if (
    authenticatedUser.role === "admin" ||
    authenticatedUser.role === "super-admin"
  ) {
    return {
      allowed: true,
    };
  }

  if (
    authenticatedUser.role !== "organization"
  ) {
    return {
      allowed: false,
      reason: "Organization access required.",
    };
  }

  if (!organization.ownerUserId?.trim()) {
    return {
      allowed: false,
      reason: "Organization owner is not configured.",
    };
  }

  if (
    authenticatedUser.id !==
    organization.ownerUserId
  ) {
    return {
      allowed: false,
      reason:
        "You do not have access to this organization.",
    };
  }

  return {
    allowed: true,
  };
}

/* -------------------------------------------------------------------------- */
/* Route guards                                                               */
/* -------------------------------------------------------------------------- */

export function canAccess(
  user: GuardUser | null | undefined,
  policy: GuardPolicy,
  options: GuardOptions = {},
): boolean {
  switch (policy) {
    case "authenticated":
      return isAuthenticated(user, options);

    case "organization":
      return hasExactRole(
        user,
        "organization",
        options,
      );

    case "admin":
      return hasExactRole(
        user,
        "admin",
        options,
      );

    case "super-admin":
      return hasExactRole(
        user,
        "super-admin",
        options,
      );

    case "administrative":
      return hasRole(
        user,
        ["admin", "super-admin"],
        options,
      );
  }
}

export function requireAccess(
  user: GuardUser | null | undefined,
  policy: GuardPolicy,
  options: GuardOptions = {},
): GuardResult {
  switch (policy) {
    case "authenticated":
      return requireAuthenticated(
        user,
        options,
      );

    case "organization":
      return requireExactRole(
        user,
        "organization",
        options,
      );

    case "admin":
      return requireExactRole(
        user,
        "admin",
        options,
      );

    case "super-admin":
      return requireExactRole(
        user,
        "super-admin",
        options,
      );

    case "administrative":
      return requireRole(
        user,
        ["admin", "super-admin"],
        options,
      );
  }
}

/* -------------------------------------------------------------------------- */
/* Internal narrowing helpers                                                 */
/* -------------------------------------------------------------------------- */

function getAuthenticatedUser(
  user: GuardUser | null | undefined,
  options: GuardOptions = {},
): GuardUser | null {
  if (!isAuthenticated(user, options)) {
    return null;
  }

  return user;
}

function getAuthenticationFailureReason(
  user: GuardUser | null | undefined,
  options: GuardOptions = {},
): string {
  if (!user) {
    return "Authentication required.";
  }

  if (!user.id.trim()) {
    return "Invalid authenticated user.";
  }

  if (
    options.requireActive !== false &&
    (user.active === false ||
      user.disabled === true)
  ) {
    return "User account is inactive.";
  }

  if (
    options.requireVerifiedEmail === true &&
    user.emailVerified !== true
  ) {
    return "Email verification required.";
  }

  return "Authentication required.";
}

/* -------------------------------------------------------------------------- */
/* Convenience aliases                                                        */
/* -------------------------------------------------------------------------- */

export const guardAuthenticated =
  requireAuthenticated;

export const guardRole = requireRole;

export const guardAdmin = (
  user: GuardUser | null | undefined,
): GuardResult =>
  requireRole(user, [
    "admin",
    "super-admin",
  ]);

export const guardOrganization = (
  user: GuardUser | null | undefined,
): GuardResult =>
  requireExactRole(
    user,
    "organization",
  );

export const guardSuperAdmin = (
  user: GuardUser | null | undefined,
): GuardResult =>
  requireExactRole(
    user,
    "super-admin",
  );
