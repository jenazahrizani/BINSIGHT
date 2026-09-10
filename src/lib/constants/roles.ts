/**
 * BINSIGHT — ROLE CONSTANTS
 * --------------------------------------------------------------------------
 * Single source of truth for user roles and capability definitions.
 *
 * Used by:
 * - src/lib/auth/roles.ts
 * - src/lib/auth/guards.ts
 * - src/lib/auth/session.ts
 * - Organization workspace
 * - Admin workspace
 * - Navigation / UI permission states
 *
 * Important:
 * - This file defines application-level role vocabulary.
 * - This file does NOT authenticate users.
 * - This file does NOT enforce Firebase Security Rules.
 * - This file does NOT grant permissions by itself.
 *
 * Security model:
 *
 *   Firebase Authentication
 *          │
 *          ▼
 *      User Identity
 *          │
 *          ▼
 *    Application Role
 *          │
 *          ▼
 *   Route / UI Capability
 *          │
 *          ▼
 *   Firebase Security Rules
 *
 * Firebase Security Rules remain authoritative.
 * --------------------------------------------------------------------------
 */

/* -------------------------------------------------------------------------- */
/* Role                                                                       */
/* -------------------------------------------------------------------------- */

/**
 * BINSIGHT intentionally keeps the role model small.
 *
 * community:
 * - Public/community user
 * - Can use community-facing features
 * - Can create and monitor own reports
 *
 * organization:
 * - Registered organization account
 * - Can manage its organization workspace
 *
 * admin:
 * - Internal platform administrator
 * - Can manage platform data and verification workflows
 */
export const USER_ROLE = {
  COMMUNITY: "community",
  ORGANIZATION: "organization",
  ADMIN: "admin",
} as const;

export type UserRole =
  (typeof USER_ROLE)[keyof typeof USER_ROLE];

/* -------------------------------------------------------------------------- */
/* Account Status                                                             */
/* -------------------------------------------------------------------------- */

export const ACCOUNT_STATUS = {
  ACTIVE: "active",
  PENDING: "pending",
  SUSPENDED: "suspended",
  DISABLED: "disabled",
} as const;

export type AccountStatus =
  (typeof ACCOUNT_STATUS)[keyof typeof ACCOUNT_STATUS];

/* -------------------------------------------------------------------------- */
/* Organization Membership                                                    */
/* -------------------------------------------------------------------------- */

export const ORGANIZATION_MEMBERSHIP_ROLE = {
  OWNER: "owner",
  MANAGER: "manager",
  EDITOR: "editor",
  VIEWER: "viewer",
} as const;

export type OrganizationMembershipRole =
  (typeof ORGANIZATION_MEMBERSHIP_ROLE)[keyof typeof ORGANIZATION_MEMBERSHIP_ROLE];

/* -------------------------------------------------------------------------- */
/* Verification Status                                                        */
/* -------------------------------------------------------------------------- */

export const ACCOUNT_VERIFICATION_STATUS = {
  UNVERIFIED: "unverified",
  PENDING: "pending",
  VERIFIED: "verified",
  REJECTED: "rejected",
} as const;

export type AccountVerificationStatus =
  (typeof ACCOUNT_VERIFICATION_STATUS)[keyof typeof ACCOUNT_VERIFICATION_STATUS];

/* -------------------------------------------------------------------------- */
/* Permission                                                                 */
/* -------------------------------------------------------------------------- */

export const PERMISSION = {
  /* Public */
  VIEW_PUBLIC_DATA: "view-public-data",
  VIEW_MAP: "view-map",
  VIEW_ORGANIZATIONS: "view-organizations",
  VIEW_WASTE: "view-waste",
  VIEW_REPORTS: "view-reports",
  CREATE_REPORT: "create-report",
  VIEW_OWN_REPORTS: "view-own-reports",

  /* Organization */
  VIEW_ORGANIZATION_WORKSPACE:
    "view-organization-workspace",
  MANAGE_ORGANIZATION_PROFILE:
    "manage-organization-profile",
  MANAGE_ORGANIZATION_WASTE:
    "manage-organization-waste",
  MANAGE_ORGANIZATION_PROCESS:
    "manage-organization-process",
  MANAGE_ORGANIZATION_PRODUCTS:
    "manage-organization-products",
  VIEW_ORGANIZATION_REPORTS:
    "view-organization-reports",

  /* Admin */
  VIEW_ADMIN: "view-admin",
  MANAGE_ORGANIZATIONS:
    "manage-organizations",
  VERIFY_ORGANIZATIONS:
    "verify-organizations",
  MANAGE_LOCATIONS:
    "manage-locations",
  MANAGE_WASTE:
    "manage-waste",
  MANAGE_REPORTS:
    "manage-reports",
  MANAGE_USERS:
    "manage-users",
  MANAGE_CONTENT:
    "manage-content",
} as const;

export type Permission =
  (typeof PERMISSION)[keyof typeof PERMISSION];

/* -------------------------------------------------------------------------- */
/* Route Access                                                               */
/* -------------------------------------------------------------------------- */

export const APP_ROUTE = {
  PUBLIC: "public",
  COMMUNITY_REPORTS: "community-reports",
  ORGANIZATION: "organization",
  ADMIN: "admin",
} as const;

export type AppRoute =
  (typeof APP_ROUTE)[keyof typeof APP_ROUTE];

/* -------------------------------------------------------------------------- */
/* Definitions                                                                */
/* -------------------------------------------------------------------------- */

export interface RoleDefinition {
  id: UserRole;
  label: string;
  shortLabel: string;
  description: string;
  permissions: readonly Permission[];
  routes: readonly AppRoute[];
  order: number;
}

export interface AccountStatusDefinition {
  id: AccountStatus;
  label: string;
  description: string;
  color: string;
  softColor: string;
}

export interface OrganizationMembershipDefinition {
  id: OrganizationMembershipRole;
  label: string;
  description: string;
}

export interface VerificationStatusDefinition {
  id: AccountVerificationStatus;
  label: string;
  description: string;
  color: string;
  softColor: string;
}

/* -------------------------------------------------------------------------- */
/* Role Permissions                                                           */
/* -------------------------------------------------------------------------- */

const COMMUNITY_PERMISSIONS: readonly Permission[] = [
  PERMISSION.VIEW_PUBLIC_DATA,
  PERMISSION.VIEW_MAP,
  PERMISSION.VIEW_ORGANIZATIONS,
  PERMISSION.VIEW_WASTE,
  PERMISSION.VIEW_REPORTS,
  PERMISSION.CREATE_REPORT,
  PERMISSION.VIEW_OWN_REPORTS,
] as const;

const ORGANIZATION_PERMISSIONS: readonly Permission[] = [
  ...COMMUNITY_PERMISSIONS,
  PERMISSION.VIEW_ORGANIZATION_WORKSPACE,
  PERMISSION.MANAGE_ORGANIZATION_PROFILE,
  PERMISSION.MANAGE_ORGANIZATION_WASTE,
  PERMISSION.MANAGE_ORGANIZATION_PROCESS,
  PERMISSION.MANAGE_ORGANIZATION_PRODUCTS,
  PERMISSION.VIEW_ORGANIZATION_REPORTS,
] as const;

const ADMIN_PERMISSIONS: readonly Permission[] = [
  PERMISSION.VIEW_PUBLIC_DATA,
  PERMISSION.VIEW_MAP,
  PERMISSION.VIEW_ORGANIZATIONS,
  PERMISSION.VIEW_WASTE,
  PERMISSION.VIEW_REPORTS,
  PERMISSION.CREATE_REPORT,
  PERMISSION.VIEW_OWN_REPORTS,

  PERMISSION.VIEW_ADMIN,
  PERMISSION.MANAGE_ORGANIZATIONS,
  PERMISSION.VERIFY_ORGANIZATIONS,
  PERMISSION.MANAGE_LOCATIONS,
  PERMISSION.MANAGE_WASTE,
  PERMISSION.MANAGE_REPORTS,
  PERMISSION.MANAGE_USERS,
  PERMISSION.MANAGE_CONTENT,
] as const;

/* -------------------------------------------------------------------------- */
/* Role Definitions                                                           */
/* -------------------------------------------------------------------------- */

export const ROLE_DEFINITIONS:
  readonly RoleDefinition[] =
  [
    {
      id: USER_ROLE.COMMUNITY,
      label: "Masyarakat",
      shortLabel: "Masyarakat",
      description:
        "Pengguna umum yang dapat menjelajahi informasi BINSIGHT dan menyampaikan laporan persampahan.",
      permissions:
        COMMUNITY_PERMISSIONS,
      routes: [
        APP_ROUTE.PUBLIC,
        APP_ROUTE.COMMUNITY_REPORTS,
      ],
      order: 1,
    },

    {
      id: USER_ROLE.ORGANIZATION,
      label: "Organisasi",
      shortLabel: "Organisasi",
      description:
        "Akun organisasi pengelola persampahan yang dapat mengelola informasi organisasi melalui workspace BINSIGHT.",
      permissions:
        ORGANIZATION_PERMISSIONS,
      routes: [
        APP_ROUTE.PUBLIC,
        APP_ROUTE.COMMUNITY_REPORTS,
        APP_ROUTE.ORGANIZATION,
      ],
      order: 2,
    },

    {
      id: USER_ROLE.ADMIN,
      label: "Administrator",
      shortLabel: "Admin",
      description:
        "Pengguna internal yang mengelola verifikasi, data, laporan, pengguna, dan konten platform BINSIGHT.",
      permissions:
        ADMIN_PERMISSIONS,
      routes: [
        APP_ROUTE.PUBLIC,
        APP_ROUTE.COMMUNITY_REPORTS,
        APP_ROUTE.ADMIN,
      ],
      order: 3,
    },
  ] as const;

/* -------------------------------------------------------------------------- */
/* Account Status Definitions                                                 */
/* -------------------------------------------------------------------------- */

export const ACCOUNT_STATUS_DEFINITIONS:
  readonly AccountStatusDefinition[] =
  [
    {
      id: ACCOUNT_STATUS.ACTIVE,
      label: "Aktif",
      description:
        "Akun dapat menggunakan fitur yang diizinkan oleh role-nya.",
      color: "#16A34A",
      softColor: "#DCFCE7",
    },

    {
      id: ACCOUNT_STATUS.PENDING,
      label: "Menunggu",
      description:
        "Akun masih menunggu proses tertentu sebelum dapat digunakan secara penuh.",
      color: "#D97706",
      softColor: "#FEF3C7",
    },

    {
      id: ACCOUNT_STATUS.SUSPENDED,
      label: "Ditangguhkan",
      description:
        "Akses akun sementara ditangguhkan.",
      color: "#DC2626",
      softColor: "#FEE2E2",
    },

    {
      id: ACCOUNT_STATUS.DISABLED,
      label: "Dinonaktifkan",
      description:
        "Akun tidak dapat digunakan.",
      color: "#64748B",
      softColor: "#F1F5F9",
    },
  ] as const;

/* -------------------------------------------------------------------------- */
/* Organization Membership Definitions                                         */
/* -------------------------------------------------------------------------- */

export const ORGANIZATION_MEMBERSHIP_DEFINITIONS:
  readonly OrganizationMembershipDefinition[] =
  [
    {
      id: ORGANIZATION_MEMBERSHIP_ROLE.OWNER,
      label: "Pemilik",
      description:
        "Memiliki kendali utama atas workspace organisasi.",
    },

    {
      id: ORGANIZATION_MEMBERSHIP_ROLE.MANAGER,
      label: "Manajer",
      description:
        "Mengelola informasi operasional organisasi.",
    },

    {
      id: ORGANIZATION_MEMBERSHIP_ROLE.EDITOR,
      label: "Editor",
      description:
        "Dapat memperbarui informasi yang diberikan akses.",
    },

    {
      id: ORGANIZATION_MEMBERSHIP_ROLE.VIEWER,
      label: "Viewer",
      description:
        "Hanya dapat melihat informasi workspace yang diizinkan.",
    },
  ] as const;

/* -------------------------------------------------------------------------- */
/* Verification Definitions                                                   */
/* -------------------------------------------------------------------------- */

export const ACCOUNT_VERIFICATION_DEFINITIONS:
  readonly VerificationStatusDefinition[] =
  [
    {
      id: ACCOUNT_VERIFICATION_STATUS.UNVERIFIED,
      label: "Belum Diverifikasi",
      description:
        "Informasi akun atau organisasi belum melewati proses verifikasi.",
      color: "#64748B",
      softColor: "#F1F5F9",
    },

    {
      id: ACCOUNT_VERIFICATION_STATUS.PENDING,
      label: "Menunggu Verifikasi",
      description:
        "Data sedang menunggu pemeriksaan administrator.",
      color: "#D97706",
      softColor: "#FEF3C7",
    },

    {
      id: ACCOUNT_VERIFICATION_STATUS.VERIFIED,
      label: "Terverifikasi",
      description:
        "Data telah melewati proses verifikasi.",
      color: "#16A34A",
      softColor: "#DCFCE7",
    },

    {
      id: ACCOUNT_VERIFICATION_STATUS.REJECTED,
      label: "Ditolak",
      description:
        "Data tidak lolos proses verifikasi.",
      color: "#DC2626",
      softColor: "#FEE2E2",
    },
  ] as const;

/* -------------------------------------------------------------------------- */
/* Labels                                                                     */
/* -------------------------------------------------------------------------- */

export const USER_ROLE_LABELS: Record<
  UserRole,
  string
> = {
  [USER_ROLE.COMMUNITY]:
    "Masyarakat",

  [USER_ROLE.ORGANIZATION]:
    "Organisasi",

  [USER_ROLE.ADMIN]:
    "Administrator",
};

export const ACCOUNT_STATUS_LABELS: Record<
  AccountStatus,
  string
> = {
  [ACCOUNT_STATUS.ACTIVE]:
    "Aktif",

  [ACCOUNT_STATUS.PENDING]:
    "Menunggu",

  [ACCOUNT_STATUS.SUSPENDED]:
    "Ditangguhkan",

  [ACCOUNT_STATUS.DISABLED]:
    "Dinonaktifkan",
};

export const ORGANIZATION_MEMBERSHIP_ROLE_LABELS: Record<
  OrganizationMembershipRole,
  string
> = {
  [ORGANIZATION_MEMBERSHIP_ROLE.OWNER]:
    "Pemilik",

  [ORGANIZATION_MEMBERSHIP_ROLE.MANAGER]:
    "Manajer",

  [ORGANIZATION_MEMBERSHIP_ROLE.EDITOR]:
    "Editor",

  [ORGANIZATION_MEMBERSHIP_ROLE.VIEWER]:
    "Viewer",
};

export const ACCOUNT_VERIFICATION_STATUS_LABELS: Record<
  AccountVerificationStatus,
  string
> = {
  [ACCOUNT_VERIFICATION_STATUS.UNVERIFIED]:
    "Belum Diverifikasi",

  [ACCOUNT_VERIFICATION_STATUS.PENDING]:
    "Menunggu Verifikasi",

  [ACCOUNT_VERIFICATION_STATUS.VERIFIED]:
    "Terverifikasi",

  [ACCOUNT_VERIFICATION_STATUS.REJECTED]:
    "Ditolak",
};

/* -------------------------------------------------------------------------- */
/* Permission Labels                                                          */
/* -------------------------------------------------------------------------- */

export const PERMISSION_LABELS: Record<
  Permission,
  string
> = {
  [PERMISSION.VIEW_PUBLIC_DATA]:
    "Melihat data publik",

  [PERMISSION.VIEW_MAP]:
    "Melihat peta",

  [PERMISSION.VIEW_ORGANIZATIONS]:
    "Melihat organisasi",

  [PERMISSION.VIEW_WASTE]:
    "Melihat data sampah",

  [PERMISSION.VIEW_REPORTS]:
    "Melihat laporan",

  [PERMISSION.CREATE_REPORT]:
    "Membuat laporan",

  [PERMISSION.VIEW_OWN_REPORTS]:
    "Melihat laporan sendiri",

  [PERMISSION.VIEW_ORGANIZATION_WORKSPACE]:
    "Mengakses workspace organisasi",

  [PERMISSION.MANAGE_ORGANIZATION_PROFILE]:
    "Mengelola profil organisasi",

  [PERMISSION.MANAGE_ORGANIZATION_WASTE]:
    "Mengelola sampah yang dikelola",

  [PERMISSION.MANAGE_ORGANIZATION_PROCESS]:
    "Mengelola proses pengelolaan",

  [PERMISSION.MANAGE_ORGANIZATION_PRODUCTS]:
    "Mengelola produk / hasil",

  [PERMISSION.VIEW_ORGANIZATION_REPORTS]:
    "Melihat laporan organisasi",

  [PERMISSION.VIEW_ADMIN]:
    "Mengakses area admin",

  [PERMISSION.MANAGE_ORGANIZATIONS]:
    "Mengelola organisasi",

  [PERMISSION.VERIFY_ORGANIZATIONS]:
    "Memverifikasi organisasi",

  [PERMISSION.MANAGE_LOCATIONS]:
    "Mengelola lokasi",

  [PERMISSION.MANAGE_WASTE]:
    "Mengelola data sampah",

  [PERMISSION.MANAGE_REPORTS]:
    "Mengelola laporan",

  [PERMISSION.MANAGE_USERS]:
    "Mengelola pengguna",

  [PERMISSION.MANAGE_CONTENT]:
    "Mengelola konten",
};

/* -------------------------------------------------------------------------- */
/* Role Lookup                                                                */
/* -------------------------------------------------------------------------- */

export const getRoleDefinition = (
  role: UserRole
): RoleDefinition | undefined => {
  return ROLE_DEFINITIONS.find(
    (definition) =>
      definition.id === role
  );
};

export const getRoleLabel = (
  role: UserRole
): string => {
  return (
    USER_ROLE_LABELS[role] ??
    role
  );
};

/* -------------------------------------------------------------------------- */
/* Permission Lookup                                                          */
/* -------------------------------------------------------------------------- */

export const getRolePermissions = (
  role: UserRole
): readonly Permission[] => {
  return (
    getRoleDefinition(
      role
    )?.permissions ?? []
  );
};

export const hasPermission = (
  role: UserRole,
  permission: Permission
): boolean => {
  return getRolePermissions(
    role
  ).includes(permission);
};

export const hasAnyPermission = (
  role: UserRole,
  permissions: readonly Permission[]
): boolean => {
  if (permissions.length === 0) {
    return false;
  }

  const rolePermissions =
    getRolePermissions(role);

  return permissions.some(
    (permission) =>
      rolePermissions.includes(
        permission
      )
  );
};

export const hasAllPermissions = (
  role: UserRole,
  permissions: readonly Permission[]
): boolean => {
  if (permissions.length === 0) {
    return true;
  }

  const rolePermissions =
    getRolePermissions(role);

  return permissions.every(
    (permission) =>
      rolePermissions.includes(
        permission
      )
  );
};

/* -------------------------------------------------------------------------- */
/* Route Access                                                               */
/* -------------------------------------------------------------------------- */

export const getRoleRoutes = (
  role: UserRole
): readonly AppRoute[] => {
  return (
    getRoleDefinition(
      role
    )?.routes ?? []
  );
};

export const canAccessRoute = (
  role: UserRole,
  route: AppRoute
): boolean => {
  return getRoleRoutes(role).includes(
    route
  );
};

/* -------------------------------------------------------------------------- */
/* Role Hierarchy                                                             */
/* -------------------------------------------------------------------------- */

/**
 * Application role hierarchy.
 *
 * Higher numeric value means broader application responsibility.
 *
 * This is useful for UI / business checks only.
 * It must NOT be treated as a substitute for Firebase authorization.
 */
export const ROLE_LEVEL: Record<
  UserRole,
  number
> = {
  [USER_ROLE.COMMUNITY]: 10,
  [USER_ROLE.ORGANIZATION]: 20,
  [USER_ROLE.ADMIN]: 100,
};

export const getRoleLevel = (
  role: UserRole
): number => {
  return ROLE_LEVEL[role];
};

export const isRoleAtLeast = (
  role: UserRole,
  minimumRole: UserRole
): boolean => {
  return (
    getRoleLevel(role) >=
    getRoleLevel(minimumRole)
  );
};

/* -------------------------------------------------------------------------- */
/* Role Predicates                                                            */
/* -------------------------------------------------------------------------- */

export const isCommunityRole = (
  role: UserRole
): boolean => {
  return role === USER_ROLE.COMMUNITY;
};

export const isOrganizationRole = (
  role: UserRole
): boolean => {
  return role === USER_ROLE.ORGANIZATION;
};

export const isAdminRole = (
  role: UserRole
): boolean => {
  return role === USER_ROLE.ADMIN;
};

/* -------------------------------------------------------------------------- */
/* Organization Membership Helpers                                            */
/* -------------------------------------------------------------------------- */

export const getOrganizationMembershipDefinition =
  (
    role: OrganizationMembershipRole
  ):
    | OrganizationMembershipDefinition
    | undefined => {
    return ORGANIZATION_MEMBERSHIP_DEFINITIONS.find(
      (definition) =>
        definition.id === role
    );
  };

export const getOrganizationMembershipLabel =
  (
    role: OrganizationMembershipRole
  ): string => {
    return (
      ORGANIZATION_MEMBERSHIP_ROLE_LABELS[
        role
      ] ?? role
    );
  };

/**
 * Workspace editing capability.
 *
 * Owner, manager, and editor can edit workspace content.
 * Viewer is read-only.
 */
export const canEditOrganizationWorkspace =
  (
    role: OrganizationMembershipRole
  ): boolean => {
    return (
      role ===
        ORGANIZATION_MEMBERSHIP_ROLE.OWNER ||
      role ===
        ORGANIZATION_MEMBERSHIP_ROLE.MANAGER ||
      role ===
        ORGANIZATION_MEMBERSHIP_ROLE.EDITOR
    );
  };

export const canManageOrganizationWorkspace =
  (
    role: OrganizationMembershipRole
  ): boolean => {
    return (
      role ===
        ORGANIZATION_MEMBERSHIP_ROLE.OWNER ||
      role ===
        ORGANIZATION_MEMBERSHIP_ROLE.MANAGER
    );
  };

export const isOrganizationOwner = (
  role: OrganizationMembershipRole
): boolean => {
  return (
    role ===
    ORGANIZATION_MEMBERSHIP_ROLE.OWNER
  );
};

/* -------------------------------------------------------------------------- */
/* Account Status Helpers                                                     */
/* -------------------------------------------------------------------------- */

export const getAccountStatusDefinition =
  (
    status: AccountStatus
  ):
    | AccountStatusDefinition
    | undefined => {
    return ACCOUNT_STATUS_DEFINITIONS.find(
      (definition) =>
        definition.id === status
    );
  };

export const getAccountStatusLabel = (
  status: AccountStatus
): string => {
  return (
    ACCOUNT_STATUS_LABELS[status] ??
    status
  );
};

export const isAccountActive = (
  status: AccountStatus
): boolean => {
  return (
    status === ACCOUNT_STATUS.ACTIVE
  );
};

export const isAccountBlocked = (
  status: AccountStatus
): boolean => {
  return (
    status === ACCOUNT_STATUS.SUSPENDED ||
    status === ACCOUNT_STATUS.DISABLED
  );
};

/* -------------------------------------------------------------------------- */
/* Verification Helpers                                                       */
/* -------------------------------------------------------------------------- */

export const getVerificationDefinition =
  (
    status: AccountVerificationStatus
  ):
    | VerificationStatusDefinition
    | undefined => {
    return ACCOUNT_VERIFICATION_DEFINITIONS.find(
      (definition) =>
        definition.id === status
    );
  };

export const getVerificationStatusLabel = (
  status: AccountVerificationStatus
): string => {
  return (
    ACCOUNT_VERIFICATION_STATUS_LABELS[
      status
    ] ?? status
  );
};

export const isVerified = (
  status: AccountVerificationStatus
): boolean => {
  return (
    status ===
    ACCOUNT_VERIFICATION_STATUS.VERIFIED
  );
};

/* -------------------------------------------------------------------------- */
/* Validation                                                                 */
/* -------------------------------------------------------------------------- */

export const isUserRole = (
  value: unknown
): value is UserRole => {
  return (
    typeof value === "string" &&
    (
      Object.values(
        USER_ROLE
      ) as string[]
    ).includes(value)
  );
};

export const isAccountStatus = (
  value: unknown
): value is AccountStatus => {
  return (
    typeof value === "string" &&
    (
      Object.values(
        ACCOUNT_STATUS
      ) as string[]
    ).includes(value)
  );
};

export const isOrganizationMembershipRole = (
  value: unknown
): value is OrganizationMembershipRole => {
  return (
    typeof value === "string" &&
    (
      Object.values(
        ORGANIZATION_MEMBERSHIP_ROLE
      ) as string[]
    ).includes(value)
  );
};

export const isAccountVerificationStatus = (
  value: unknown
): value is AccountVerificationStatus => {
  return (
    typeof value === "string" &&
    (
      Object.values(
        ACCOUNT_VERIFICATION_STATUS
      ) as string[]
    ).includes(value)
  );
};

export const isPermission = (
  value: unknown
): value is Permission => {
  return (
    typeof value === "string" &&
    (
      Object.values(
        PERMISSION
      ) as string[]
    ).includes(value)
  );
};

export const isAppRoute = (
  value: unknown
): value is AppRoute => {
  return (
    typeof value === "string" &&
    (
      Object.values(
        APP_ROUTE
      ) as string[]
    ).includes(value)
  );
};

/* -------------------------------------------------------------------------- */
/* UI Options                                                                 */
/* -------------------------------------------------------------------------- */

export const USER_ROLE_OPTIONS =
  ROLE_DEFINITIONS.map(
    (definition) => ({
      value: definition.id,
      label: definition.label,
    })
  );

export const ACCOUNT_STATUS_OPTIONS =
  ACCOUNT_STATUS_DEFINITIONS.map(
    (definition) => ({
      value: definition.id,
      label: definition.label,
    })
  );

export const ORGANIZATION_MEMBERSHIP_OPTIONS =
  ORGANIZATION_MEMBERSHIP_DEFINITIONS.map(
    (definition) => ({
      value: definition.id,
      label: definition.label,
    })
  );

export const ACCOUNT_VERIFICATION_OPTIONS =
  ACCOUNT_VERIFICATION_DEFINITIONS.map(
    (definition) => ({
      value: definition.id,
      label: definition.label,
    })
  );

export const PERMISSION_OPTIONS =
  Object.values(PERMISSION).map(
    (permission) => ({
      value: permission,
      label:
        PERMISSION_LABELS[permission],
    })
  );

/* -------------------------------------------------------------------------- */
/* Default Account Values                                                     */
/* -------------------------------------------------------------------------- */

export const ROLE_DEFAULTS = {
  community: {
    role: USER_ROLE.COMMUNITY,
    accountStatus:
      ACCOUNT_STATUS.ACTIVE,
    verification:
      ACCOUNT_VERIFICATION_STATUS.UNVERIFIED,
  },

  organization: {
    role: USER_ROLE.ORGANIZATION,
    accountStatus:
      ACCOUNT_STATUS.ACTIVE,
    verification:
      ACCOUNT_VERIFICATION_STATUS.PENDING,
  },

  admin: {
    role: USER_ROLE.ADMIN,
    accountStatus:
      ACCOUNT_STATUS.ACTIVE,
    verification:
      ACCOUNT_VERIFICATION_STATUS.VERIFIED,
  },
} as const;

/* -------------------------------------------------------------------------- */
/* Default Export                                                             */
/* -------------------------------------------------------------------------- */

const roleConstants = Object.freeze({
  USER_ROLE,
  ACCOUNT_STATUS,
  ORGANIZATION_MEMBERSHIP_ROLE,
  ACCOUNT_VERIFICATION_STATUS,
  PERMISSION,
  APP_ROUTE,

  ROLE_DEFINITIONS,
  ACCOUNT_STATUS_DEFINITIONS,
  ORGANIZATION_MEMBERSHIP_DEFINITIONS,
  ACCOUNT_VERIFICATION_DEFINITIONS,

  USER_ROLE_LABELS,
  ACCOUNT_STATUS_LABELS,
  ORGANIZATION_MEMBERSHIP_ROLE_LABELS,
  ACCOUNT_VERIFICATION_STATUS_LABELS,
  PERMISSION_LABELS,

  USER_ROLE_OPTIONS,
  ACCOUNT_STATUS_OPTIONS,
  ORGANIZATION_MEMBERSHIP_OPTIONS,
  ACCOUNT_VERIFICATION_OPTIONS,
  PERMISSION_OPTIONS,

  ROLE_DEFAULTS,
  ROLE_LEVEL,

  getRoleDefinition,
  getRoleLabel,
  getRolePermissions,
  hasPermission,
  hasAnyPermission,
  hasAllPermissions,

  getRoleRoutes,
  canAccessRoute,

  getRoleLevel,
  isRoleAtLeast,

  isCommunityRole,
  isOrganizationRole,
  isAdminRole,

  getOrganizationMembershipDefinition,
  getOrganizationMembershipLabel,
  canEditOrganizationWorkspace,
  canManageOrganizationWorkspace,
  isOrganizationOwner,

  getAccountStatusDefinition,
  getAccountStatusLabel,
  isAccountActive,
  isAccountBlocked,

  getVerificationDefinition,
  getVerificationStatusLabel,
  isVerified,

  isUserRole,
  isAccountStatus,
  isOrganizationMembershipRole,
  isAccountVerificationStatus,
  isPermission,
  isAppRoute,
});

export default roleConstants;