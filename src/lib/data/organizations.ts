/**
 * ============================================================================
 * BINSIGHT — ORGANIZATIONS DATA
 * ============================================================================
 * Badung Waste Intelligence
 *
 * Single source of truth untuk data organisasi pengelola persampahan.
 *
 * Responsibilities:
 * - Organization data model
 * - Organization dataset
 * - Organization lookup
 * - Organization filtering
 * - Verification visibility
 * - Area lookup
 * - Waste relationship
 *
 * Important:
 * - File ini tidak melakukan fetch Firebase.
 * - File ini tidak melakukan authorization.
 * - Jangan menyimpan data tonase / kilogram tanpa sumber yang valid.
 * ============================================================================
 */

import {
  WASTE_CATEGORY,
  type WasteCategory,
} from "@lib/constants/waste";

/**
 * ============================================================================
 * TYPES
 * ============================================================================
 */

export type OrganizationStatus =
  | "verified"
  | "pending"
  | "unverified";

export type OrganizationType =
  | "government"
  | "community"
  | "private"
  | "social-enterprise"
  | "cooperative"
  | "educational"
  | "nonprofit"
  | "other";

export interface OrganizationLocation {
  area: string;
  address?: string;
  latitude?: number;
  longitude?: number;
}

export interface OrganizationContact {
  phone?: string;
  email?: string;
  website?: string;
  instagram?: string;
  facebook?: string;
  whatsapp?: string;
}

export interface OrganizationProcess {
  id: string;
  name: string;
  description: string;
  order: number;
}

export interface OrganizationProduct {
  id: string;
  name: string;
  description?: string;
  category?: string;
}

export interface Organization {
  id: string;
  slug: string;

  name: string;
  shortName?: string;

  description: string;
  shortDescription?: string;

  type: OrganizationType;

  status: OrganizationStatus;

  verified: boolean;

  logo?: string;
  coverImage?: string;

  location: OrganizationLocation;

  contact?: OrganizationContact;

  wasteManaged: WasteCategory[];

  processes: OrganizationProcess[];

  products: OrganizationProduct[];

  establishedYear?: number;

  tags: string[];

  isPublic: boolean;

  isFeatured: boolean;

  createdAt: string;
  updatedAt: string;
}

/**
 * ============================================================================
 * DATASET
 * ============================================================================
 *
 * Dataset awal bersifat internal/demo.
 * Tidak ada klaim volume sampah.
 * ============================================================================
 */

export const organizations: Organization[] = [
  {
    id: "org-badung-001",
    slug: "organisasi-pengelola-sampah-badung",

    name: "Organisasi Pengelola Sampah Badung",
    shortName: "OPSB",

    description:
      "Organisasi pengelola persampahan yang berfokus pada pengelolaan, edukasi, dan penguatan ekosistem persampahan di Kabupaten Badung.",

    shortDescription:
      "Pengelola persampahan dan edukasi lingkungan di Kabupaten Badung.",

    type: "community",

    status: "verified",

    verified: true,

    logo:
      "/images/organizations/organization-default.svg",

    location: {
      area: "Kabupaten Badung",
    },

    contact: {},

    wasteManaged: [
      WASTE_CATEGORY.ORGANIC,
      WASTE_CATEGORY.INORGANIC,
      WASTE_CATEGORY.RESIDUAL,
    ],

    processes: [
      {
        id: "sorting",
        name: "Pemilahan",
        description:
          "Pemilahan material berdasarkan kategori dan karakteristik sampah.",
        order: 1,
      },
      {
        id: "processing",
        name: "Pengolahan",
        description:
          "Pengolahan material sesuai karakteristik dan potensi pemanfaatannya.",
        order: 2,
      },
    ],

    products: [],

    tags: [
      "persampahan",
      "lingkungan",
      "badung",
      "edukasi",
    ],

    isPublic: true,

    isFeatured: true,

    createdAt:
      "2026-01-01T00:00:00.000Z",

    updatedAt:
      "2026-01-01T00:00:00.000Z",
  },

  {
    id: "org-community-002",
    slug: "komunitas-lingkungan-badung",

    name: "Komunitas Lingkungan Badung",
    shortName: "KLB",

    description:
      "Komunitas yang mendorong keterlibatan masyarakat dalam pengurangan, pemilahan, dan pengelolaan sampah.",

    shortDescription:
      "Komunitas masyarakat yang bergerak dalam edukasi dan pengelolaan lingkungan.",

    type: "community",

    status: "verified",

    verified: true,

    logo:
      "/images/organizations/organization-default.svg",

    location: {
      area: "Kabupaten Badung",
    },

    contact: {},

    wasteManaged: [
      WASTE_CATEGORY.ORGANIC,
      WASTE_CATEGORY.INORGANIC,
    ],

    processes: [
      {
        id: "education",
        name: "Edukasi",
        description:
          "Edukasi masyarakat mengenai pemilahan dan pengurangan sampah.",
        order: 1,
      },
      {
        id: "collection",
        name: "Pengumpulan Terpilah",
        description:
          "Pengumpulan material yang telah dipilah oleh masyarakat.",
        order: 2,
      },
    ],

    products: [],

    tags: [
      "komunitas",
      "edukasi",
      "lingkungan",
    ],

    isPublic: true,

    isFeatured: false,

    createdAt:
      "2026-01-01T00:00:00.000Z",

    updatedAt:
      "2026-01-01T00:00:00.000Z",
  },

  {
    id: "org-recycling-003",
    slug: "mitra-pengelolaan-material-badung",

    name: "Mitra Pengelolaan Material Badung",
    shortName: "MPMB",

    description:
      "Pengelola material yang berfokus pada pemilahan dan pengolahan material sesuai karakteristiknya.",

    shortDescription:
      "Pengelola material dan proses pengolahan persampahan.",

    type: "private",

    status: "verified",

    verified: true,

    logo:
      "/images/organizations/organization-default.svg",

    location: {
      area: "Kabupaten Badung",
    },

    contact: {},

    wasteManaged: [
      WASTE_CATEGORY.INORGANIC,
      WASTE_CATEGORY.ELECTRONIC,
    ],

    processes: [
      {
        id: "material-sorting",
        name: "Pemilahan Material",
        description:
          "Pemilahan material berdasarkan jenis dan karakteristik.",
        order: 1,
      },
      {
        id: "material-processing",
        name: "Pengolahan Material",
        description:
          "Pengolahan material sesuai karakteristik dan tujuan pemanfaatannya.",
        order: 2,
      },
    ],

    products: [
      {
        id: "processed-material",
        name: "Material Hasil Pengolahan",
        description:
          "Material hasil proses pemilahan dan pengolahan.",
        category: "processed-material",
      },
    ],

    tags: [
      "material",
      "pengolahan",
      "elektronik",
    ],

    isPublic: true,

    isFeatured: false,

    createdAt:
      "2026-01-01T00:00:00.000Z",

    updatedAt:
      "2026-01-01T00:00:00.000Z",
  },
];

/**
 * ============================================================================
 * PUBLIC DATA
 * ============================================================================
 */

/**
 * Mengembalikan seluruh organisasi.
 *
 * Array dan collection internal dibuat salinan agar pemanggil tidak secara
 * tidak sengaja memodifikasi dataset utama.
 */
export const getOrganizations =
  (): Organization[] =>
    organizations.map(
      (organization) => ({
        ...organization,

        location: {
          ...organization.location,
        },

        contact: organization.contact
          ? {
              ...organization.contact,
            }
          : undefined,

        wasteManaged: [
          ...organization.wasteManaged,
        ],

        processes:
          organization.processes.map(
            (process) => ({
              ...process,
            })
          ),

        products:
          organization.products.map(
            (product) => ({
              ...product,
            })
          ),

        tags: [
          ...organization.tags,
        ],
      })
    );

/**
 * Hanya organisasi yang dapat ditampilkan kepada publik.
 */
export const getPublicOrganizations =
  (): Organization[] =>
    organizations.filter(
      (organization) =>
        organization.isPublic &&
        organization.verified &&
        organization.status ===
          "verified"
    );

/**
 * Organisasi unggulan yang dapat ditampilkan publik.
 */
export const getFeaturedOrganizations =
  (): Organization[] =>
    getPublicOrganizations().filter(
      (organization) =>
        organization.isFeatured
    );

/**
 * ============================================================================
 * LOOKUPS
 * ============================================================================
 */

export const getOrganizationById = (
  id: string
): Organization | undefined =>
  organizations.find(
    (organization) =>
      organization.id === id
  );

export const getOrganizationBySlug = (
  slug: string
): Organization | undefined =>
  organizations.find(
    (organization) =>
      organization.slug === slug
  );

export const getOrganizationByName = (
  name: string
): Organization | undefined => {
  const normalizedName =
    name
      .trim()
      .toLocaleLowerCase();

  return organizations.find(
    (organization) =>
      organization.name
        .trim()
        .toLocaleLowerCase() ===
      normalizedName
  );
};

/**
 * ============================================================================
 * FILTERING
 * ============================================================================
 */

export interface OrganizationFilters {
  type?: OrganizationType;
  status?: OrganizationStatus;
  area?: string;
  wasteCategory?: WasteCategory;
  search?: string;
  verifiedOnly?: boolean;
  publicOnly?: boolean;
  featuredOnly?: boolean;
}

export const filterOrganizations = (
  filters: OrganizationFilters = {}
): Organization[] => {
  const search =
    filters.search
      ?.trim()
      .toLocaleLowerCase() || "";

  return organizations.filter(
    (organization) => {
      if (
        filters.type &&
        organization.type !==
          filters.type
      ) {
        return false;
      }

      if (
        filters.status &&
        organization.status !==
          filters.status
      ) {
        return false;
      }

      if (
        filters.area &&
        !organization.location.area
          .toLocaleLowerCase()
          .includes(
            filters.area
              .trim()
              .toLocaleLowerCase()
          )
      ) {
        return false;
      }

      if (
        filters.wasteCategory &&
        !organization.wasteManaged.includes(
          filters.wasteCategory
        )
      ) {
        return false;
      }

      if (
        filters.verifiedOnly &&
        !organization.verified
      ) {
        return false;
      }

      if (
        filters.publicOnly &&
        !organization.isPublic
      ) {
        return false;
      }

      if (
        filters.featuredOnly &&
        !organization.isFeatured
      ) {
        return false;
      }

      if (search) {
        const searchableText = [
          organization.name,
          organization.shortName ?? "",
          organization.description,
          organization.shortDescription ?? "",
          organization.location.area,
          organization.tags.join(" "),
        ]
          .join(" ")
          .toLocaleLowerCase();

        if (
          !searchableText.includes(
            search
          )
        ) {
          return false;
        }
      }

      return true;
    }
  );
};

/**
 * ============================================================================
 * RELATED DATA
 * ============================================================================
 */

/**
 * Mendapatkan organisasi publik yang mengelola kategori sampah tertentu.
 */
export const getOrganizationsByWaste = (
  wasteCategory: WasteCategory
): Organization[] =>
  getPublicOrganizations().filter(
    (organization) =>
      organization.wasteManaged.includes(
        wasteCategory
      )
  );

/**
 * Mendapatkan organisasi berdasarkan area.
 */
export const getOrganizationsByArea = (
  area: string
): Organization[] =>
  filterOrganizations({
    area,
    publicOnly: true,
    verifiedOnly: true,
  });

/**
 * Mengelompokkan organisasi publik berdasarkan area.
 */
export const getOrganizationsGroupedByArea =
  (): Record<
    string,
    Organization[]
  > => {
    return getPublicOrganizations().reduce<
      Record<string, Organization[]>
    >(
      (groups, organization) => {
        const area =
          organization.location.area;

        const existing =
          groups[area];

        if (existing) {
          existing.push(organization);
        } else {
          groups[area] = [
            organization,
          ];
        }

        return groups;
      },
      {}
    );
  };

/**
 * ============================================================================
 * COUNTS / METRICS
 * ============================================================================
 *
 * Semua metrik di bawah hanya menghitung entitas.
 * Tidak ada estimasi berat / volume sampah.
 * ============================================================================
 */

export const getOrganizationCount =
  (): number =>
    getPublicOrganizations().length;

export const getVerifiedOrganizationCount =
  (): number =>
    organizations.filter(
      (organization) =>
        organization.verified
    ).length;

export const getOrganizationCountByType =
  (): Record<
    OrganizationType,
    number
  > => {
    const result: Record<
      OrganizationType,
      number
    > = {
      government: 0,
      community: 0,
      private: 0,
      "social-enterprise": 0,
      cooperative: 0,
      educational: 0,
      nonprofit: 0,
      other: 0,
    };

    for (
      const organization of
        getPublicOrganizations()
    ) {
      result[organization.type] += 1;
    }

    return result;
  };

/**
 * ============================================================================
 * VALIDATION HELPERS
 * ============================================================================
 */

export const organizationExists = (
  id: string
): boolean =>
  organizations.some(
    (organization) =>
      organization.id === id
  );

export const organizationSlugExists = (
  slug: string
): boolean =>
  organizations.some(
    (organization) =>
      organization.slug === slug
  );

export const isOrganizationPublic = (
  organization: Organization
): boolean =>
  organization.isPublic &&
  organization.verified &&
  organization.status ===
    "verified";

/**
 * ============================================================================
 * EMPTY MODEL
 * ============================================================================
 */

export const createEmptyOrganization =
  (): Organization => ({
    id: "",
    slug: "",

    name: "",
    shortName: undefined,

    description: "",
    shortDescription: undefined,

    type: "other",

    status: "unverified",

    verified: false,

    logo: undefined,
    coverImage: undefined,

    location: {
      area: "",
      address: undefined,
      latitude: undefined,
      longitude: undefined,
    },

    contact: {},

    wasteManaged: [],

    processes: [],

    products: [],

    establishedYear: undefined,

    tags: [],

    isPublic: false,

    isFeatured: false,

    createdAt: "",

    updatedAt: "",
  });

/**
 * Backward-compatible alias.
 */
export const emptyOrganization =
  createEmptyOrganization;