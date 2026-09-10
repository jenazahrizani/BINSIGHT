/**
 * BINSIGHT — Authorization Roles
 *
 * Single source of truth for application roles and their permissions.
 *
 * Role hierarchy:
 * - user
 * - organization
 * - admin
 * - super-admin
 *
 * Permission hierarchy:
 * user < organization < admin < super-admin
 */

export const USER_ROLE = {
  USER: "user",
  ORGANIZATION: "organization",
  ADMIN: "admin",
  SUPER_ADMIN: "super-admin",
} as const;

export type UserRole =
  (typeof USER_ROLE)[keyof typeof USER_ROLE];

export const USER_ROLES = [
  USER_ROLE.USER,
  USER_ROLE.ORGANIZATION,
  USER_ROLE.ADMIN,
  USER_ROLE.SUPER_ADMIN,
] as const satisfies readonly UserRole[];

/* -------------------------------------------------------------------------- */
/* Role metadata                                                              */
/* -------------------------------------------------------------------------- */

export interface RoleDefinition {
  id: UserRole;
  label: string;
  description: string;
  level: number;
  isAdministrative: boolean;
  canManageOrganizations: boolean;
  canManageReports: boolean;
  canManageContent: boolean;
  canManageUsers: boolean;
  canManageSystem: boolean;
}

export const ROLE_DEFINITIONS: Record<
  UserRole,
  RoleDefinition
> = {
  [USER_ROLE.USER]: {
    id: USER_ROLE.USER,
    label: "Pengguna",
    description:
      "Pengguna umum yang dapat menjelajahi informasi BINSIGHT dan membuat laporan.",
    level: 10,
    isAdministrative: false,
    canManageOrganizations: false,
    canManageReports: false,
    canManageContent: false,
    canManageUsers: false,
    canManageSystem: false,
  },

  [USER_ROLE.ORGANIZATION]: {
    id: USER_ROLE.ORGANIZATION,
    label: "Organisasi",
    description:
      "Pengelola organisasi yang dapat mengelola profil, informasi sampah, proses, dan produk organisasinya.",
    level: 20,
    isAdministrative: false,
    canManageOrganizations: true,
    canManageReports: false,
    canManageContent: false,
    canManageUsers: false,
    canManageSystem: false,
  },

  [USER_ROLE.ADMIN]: {
    id: USER_ROLE.ADMIN,
    label: "Administrator",
    description:
      "Administrator yang mengelola organisasi, lokasi, sampah, laporan, pengguna, dan konten platform.",
    level: 30,
    isAdministrative: true,
    canManageOrganizations: true,
    canManageReports: true,
    canManageContent: true,
    canManageUsers: true,
    canManageSystem: false,
  },

  [USER_ROLE.SUPER_ADMIN]: {
    id: USER_ROLE.SUPER_ADMIN,
    label: "Super Administrator",
    description:
      "Administrator penuh dengan akses terhadap seluruh fitur dan konfigurasi platform.",
    level: 40,
    isAdministrative: true,
    canManageOrganizations: true,
    canManageReports: true,
    canManageContent: true,
    canManageUsers: true,
    canManageSystem: true,
  },
};

/* -------------------------------------------------------------------------- */
/* Role validation                                                             */
/* -------------------------------------------------------------------------- */

export function isUserRole(
  value: unknown,
): value is UserRole {
  return (
    typeof value === "string" &&
    (USER_ROLES as readonly string[]).includes(value)
  );
}

export function normalizeUserRole(
  value: unknown,
): UserRole {
  if (isUserRole(value)) {
    return value;
  }

  return USER_ROLE.USER;
}

export function getRoleDefinition(
  role: UserRole,
): RoleDefinition {
  return ROLE_DEFINITIONS[role];
}

/* -------------------------------------------------------------------------- */
/* Role hierarchy                                                              */
/* -------------------------------------------------------------------------- */

export function getRoleLevel(
  role: UserRole,
): number {
  return ROLE_DEFINITIONS[role].level;
}

export function hasMinimumRole(
  role: UserRole,
  requiredRole: UserRole,
): boolean {
  return (
    getRoleLevel(role) >=
    getRoleLevel(requiredRole)
  );
}

export function compareRoles(
  first: UserRole,
  second: UserRole,
): number {
  return getRoleLevel(first) - getRoleLevel(second);
}

export function isHigherRole(
  first: UserRole,
  second: UserRole,
): boolean {
  return compareRoles(first, second) > 0;
}

export function isLowerRole(
  first: UserRole,
  second: UserRole,
): boolean {
  return compareRoles(first, second) < 0;
}

/* -------------------------------------------------------------------------- */
/* Administrative roles                                                       */
/* -------------------------------------------------------------------------- */

export function isAdministrativeRole(
  role: UserRole,
): boolean {
  return ROLE_DEFINITIONS[role].isAdministrative;
}

export function isAdminRole(
  role: UserRole,
): boolean {
  return role === USER_ROLE.ADMIN;
}

export function isSuperAdminRole(
  role: UserRole,
): boolean {
  return role === USER_ROLE.SUPER_ADMIN;
}

export function isOrganizationRole(
  role: UserRole,
): boolean {
  return role === USER_ROLE.ORGANIZATION;
}

export function isStandardUserRole(
  role: UserRole,
): boolean {
  return role === USER_ROLE.USER;
}

/* -------------------------------------------------------------------------- */
/* Permission model                                                            */
/* -------------------------------------------------------------------------- */

export const PERMISSION = {
  VIEW_PUBLIC_CONTENT: "view:public-content",

  CREATE_REPORT: "report:create",
  VIEW_REPORT: "report:view",
  MANAGE_REPORT: "report:manage",
  VERIFY_REPORT: "report:verify",

  VIEW_ORGANIZATION: "organization:view",
  MANAGE_OWN_ORGANIZATION: "organization:manage-own",
  MANAGE_ORGANIZATIONS: "organization:manage",
  VERIFY_ORGANIZATION: "organization:verify",

  VIEW_LOCATIONS: "location:view",
  MANAGE_LOCATIONS: "location:manage",

  VIEW_WASTE: "waste:view",
  MANAGE_WASTE: "waste:manage",

  VIEW_USERS: "user:view",
  MANAGE_USERS: "user:manage",

  VIEW_CONTENT: "content:view",
  MANAGE_CONTENT: "content:manage",

  MANAGE_SYSTEM: "system:manage",
} as const;

export type Permission =
  (typeof PERMISSION)[keyof typeof PERMISSION];

export const ROLE_PERMISSIONS: Record<
  UserRole,
  readonly Permission[]
> = {
  [USER_ROLE.USER]: [
    PERMISSION.VIEW_PUBLIC_CONTENT,
    PERMISSION.VIEW_REPORT,
    PERMISSION.CREATE_REPORT,
    PERMISSION.VIEW_ORGANIZATION,
    PERMISSION.VIEW_LOCATIONS,
    PERMISSION.VIEW_WASTE,
  ],

  [USER_ROLE.ORGANIZATION]: [
    PERMISSION.VIEW_PUBLIC_CONTENT,
    PERMISSION.VIEW_REPORT,
    PERMISSION.CREATE_REPORT,
    PERMISSION.VIEW_ORGANIZATION,
    PERMISSION.MANAGE_OWN_ORGANIZATION,
    PERMISSION.VIEW_LOCATIONS,
    PERMISSION.VIEW_WASTE,
  ],

  [USER_ROLE.ADMIN]: [
    PERMISSION.VIEW_PUBLIC_CONTENT,
    PERMISSION.CREATE_REPORT,
    PERMISSION.VIEW_REPORT,
    PERMISSION.MANAGE_REPORT,
    PERMISSION.VERIFY_REPORT,
    PERMISSION.VIEW_ORGANIZATION,
    PERMISSION.MANAGE_OWN_ORGANIZATION,
    PERMISSION.MANAGE_ORGANIZATIONS,
    PERMISSION.VERIFY_ORGANIZATION,
    PERMISSION.VIEW_LOCATIONS,
    PERMISSION.MANAGE_LOCATIONS,
    PERMISSION.VIEW_WASTE,
    PERMISSION.MANAGE_WASTE,
    PERMISSION.VIEW_USERS,
    PERMISSION.MANAGE_USERS,
    PERMISSION.VIEW_CONTENT,
    PERMISSION.MANAGE_CONTENT,
  ],

  [USER_ROLE.SUPER_ADMIN]: [
    PERMISSION.VIEW_PUBLIC_CONTENT,
    PERMISSION.CREATE_REPORT,
    PERMISSION.VIEW_REPORT,
    PERMISSION.MANAGE_REPORT,
    PERMISSION.VERIFY_REPORT,
    PERMISSION.VIEW_ORGANIZATION,
    PERMISSION.MANAGE_OWN_ORGANIZATION,
    PERMISSION.MANAGE_ORGANIZATIONS,
    PERMISSION.VERIFY_ORGANIZATION,
    PERMISSION.VIEW_LOCATIONS,
    PERMISSION.MANAGE_LOCATIONS,
    PERMISSION.VIEW_WASTE,
    PERMISSION.MANAGE_WASTE,
    PERMISSION.VIEW_USERS,
    PERMISSION.MANAGE_USERS,
    PERMISSION.VIEW_CONTENT,
    PERMISSION.MANAGE_CONTENT,
    PERMISSION.MANAGE_SYSTEM,
  ],
};

/* -------------------------------------------------------------------------- */
/* Permission helpers                                                          */
/* -------------------------------------------------------------------------- */

export function getRolePermissions(
  role: UserRole,
): readonly Permission[] {
  return ROLE_PERMISSIONS[role];
}

export function hasPermission(
  role: UserRole,
  permission: Permission,
): boolean {
  return ROLE_PERMISSIONS[role].includes(permission);
}

export function hasAnyPermission(
  role: UserRole,
  permissions: readonly Permission[],
): boolean {
  return permissions.some((permission) =>
    hasPermission(role, permission),
  );
}

export function hasAllPermissions(
  role: UserRole,
  permissions: readonly Permission[],
): boolean {
  return permissions.every((permission) =>
    hasPermission(role, permission),
  );
}

export function requirePermission(
  role: UserRole,
  permission: Permission,
): boolean {
  return hasPermission(role, permission);
}

/* -------------------------------------------------------------------------- */
/* Role transition                                                             */
/* -------------------------------------------------------------------------- */

export function canAssignRole(
  actorRole: UserRole,
  targetRole: UserRole,
): boolean {
  if (actorRole === USER_ROLE.SUPER_ADMIN) {
    return true;
  }

  if (actorRole === USER_ROLE.ADMIN) {
    return (
      targetRole === USER_ROLE.USER ||
      targetRole === USER_ROLE.ORGANIZATION
    );
  }

  return false;
}

export function canManageRole(
  actorRole: UserRole,
  targetRole: UserRole,
): boolean {
  return canAssignRole(actorRole, targetRole);
}

export function canPromoteToRole(
  actorRole: UserRole,
  targetRole: UserRole,
): boolean {
  return canAssignRole(actorRole, targetRole);
}

export function canDemoteRole(
  actorRole: UserRole,
  targetRole: UserRole,
): boolean {
  return canAssignRole(actorRole, targetRole);
}

/* -------------------------------------------------------------------------- */
/* Labels                                                                      */
/* -------------------------------------------------------------------------- */

export function getRoleLabel(
  role: UserRole,
): string {
  return ROLE_DEFINITIONS[role].label;
}

export function getRoleDescription(
  role: UserRole,
): string {
  return ROLE_DEFINITIONS[role].description;
}

/* -------------------------------------------------------------------------- */
/* Collections                                                                */
/* -------------------------------------------------------------------------- */

export function getAllRoles(): readonly UserRole[] {
  return USER_ROLES;
}

export function getAdministrativeRoles(): readonly UserRole[] {
  return [
    USER_ROLE.ADMIN,
    USER_ROLE.SUPER_ADMIN,
  ];
}

export function getNonAdministrativeRoles(): readonly UserRole[] {
  return [
    USER_ROLE.USER,
    USER_ROLE.ORGANIZATION,
  ];
}

/* -------------------------------------------------------------------------- */
/* Safe serialization                                                          */
/* -------------------------------------------------------------------------- */

export interface SerializedRole {
  role: UserRole;
  label: string;
  level: number;
  isAdministrative: boolean;
}

export function serializeRole(
  role: UserRole,
): SerializedRole {
  const definition = getRoleDefinition(role);

  return {
    role: definition.id,
    label: definition.label,
    level: definition.level,
    isAdministrative: definition.isAdministrative,
  };
}