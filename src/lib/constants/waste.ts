/**
 * BINSIGHT — WASTE CONSTANTS
 * --------------------------------------------------------------------------
 * Single source of truth for waste-related constants and domain helpers.
 *
 * Used by:
 * - Waste pages
 * - Organization waste management
 * - Report forms
 * - Waste cards
 * - Filters
 * - Dashboard distributions
 * - Admin waste management
 *
 * Important:
 * - This file defines vocabulary / taxonomy, NOT live statistics.
 * - Do not place tonnage, counts, or other changing metrics here.
 * - Live data belongs to src/lib/data/waste.ts.
 * --------------------------------------------------------------------------
 */

/* -------------------------------------------------------------------------- */
/* Waste Category                                                             */
/* -------------------------------------------------------------------------- */

export const WASTE_CATEGORY = {
  ORGANIC: "organic",
  INORGANIC: "inorganic",
  HAZARDOUS: "hazardous",
  ELECTRONIC: "electronic",
  RESIDUAL: "residual",
} as const;

export type WasteCategory =
  (typeof WASTE_CATEGORY)[keyof typeof WASTE_CATEGORY];

/* -------------------------------------------------------------------------- */
/* Waste Material                                                             */
/* -------------------------------------------------------------------------- */

export const WASTE_MATERIAL = {
  FOOD: "food",
  LEAVES: "leaves",
  GARDEN: "garden",
  WOOD: "wood",
  PAPER: "paper",
  CARDBOARD: "cardboard",
  PLASTIC: "plastic",
  GLASS: "glass",
  METAL: "metal",
  TEXTILE: "textile",
  RUBBER: "rubber",
  OIL: "oil",
  BATTERY: "battery",
  CHEMICAL: "chemical",
  MEDICAL: "medical",
  ELECTRONIC: "electronic",
  MIXED: "mixed",
} as const;

export type WasteMaterial =
  (typeof WASTE_MATERIAL)[keyof typeof WASTE_MATERIAL];

/* -------------------------------------------------------------------------- */
/* Management Method                                                          */
/* -------------------------------------------------------------------------- */

export const WASTE_METHOD = {
  REDUCE: "reduce",
  REUSE: "reuse",
  RECYCLE: "recycle",
  COMPOST: "compost",
  RECOVERY: "recovery",
  SORTING: "sorting",
  COLLECTION: "collection",
  PROCESSING: "processing",
  STORAGE: "storage",
  TREATMENT: "treatment",
  DISPOSAL: "disposal",
  SPECIAL_HANDLING: "special-handling",
} as const;

export type WasteMethod =
  (typeof WASTE_METHOD)[keyof typeof WASTE_METHOD];

/* -------------------------------------------------------------------------- */
/* Waste State / Visibility                                                   */
/* -------------------------------------------------------------------------- */

export const WASTE_STATUS = {
  ACTIVE: "active",
  DRAFT: "draft",
  ARCHIVED: "archived",
} as const;

export type WasteStatus =
  (typeof WASTE_STATUS)[keyof typeof WASTE_STATUS];

export const WASTE_VISIBILITY = {
  PUBLIC: "public",
  PRIVATE: "private",
} as const;

export type WasteVisibility =
  (typeof WASTE_VISIBILITY)[keyof typeof WASTE_VISIBILITY];

/* -------------------------------------------------------------------------- */
/* Characteristics                                                            */
/* -------------------------------------------------------------------------- */

export const WASTE_CHARACTERISTIC = {
  BIODEGRADABLE: "biodegradable",
  RECYCLABLE: "recyclable",
  RECOVERABLE: "recoverable",
  REUSABLE: "reusable",
  RESIDUAL: "residual",
  HAZARDOUS: "hazardous",
  SPECIAL_HANDLING: "special-handling",
  VALUABLE: "valuable-material",
} as const;

export type WasteCharacteristic =
  (typeof WASTE_CHARACTERISTIC)[keyof typeof WASTE_CHARACTERISTIC];

/* -------------------------------------------------------------------------- */
/* Taxonomy Definition                                                        */
/* -------------------------------------------------------------------------- */

export interface WasteCategoryDefinition {
  id: WasteCategory;
  label: string;
  shortLabel: string;
  description: string;
  color: string;
  softColor: string;
  icon: string;
  order: number;
}

export interface WasteMaterialDefinition {
  id: WasteMaterial;
  label: string;
  category: WasteCategory;
  description: string;
  characteristics: readonly WasteCharacteristic[];
  recommendedMethods: readonly WasteMethod[];
  order: number;
}

/* -------------------------------------------------------------------------- */
/* Category Definitions                                                        */
/* -------------------------------------------------------------------------- */

export const WASTE_CATEGORIES:
  readonly WasteCategoryDefinition[] =
  [
    {
      id: WASTE_CATEGORY.ORGANIC,
      label: "Organik",
      shortLabel: "Organik",
      description:
        "Material yang umumnya berasal dari sisa makhluk hidup dan dapat terurai secara biologis.",
      color: "#16A34A",
      softColor: "#DCFCE7",
      icon: "leaf",
      order: 1,
    },

    {
      id: WASTE_CATEGORY.INORGANIC,
      label: "Anorganik",
      shortLabel: "Anorganik",
      description:
        "Material yang umumnya membutuhkan proses pemilahan, penggunaan kembali, atau daur ulang.",
      color: "#2563EB",
      softColor: "#DBEAFE",
      icon: "package",
      order: 2,
    },

    {
      id: WASTE_CATEGORY.HAZARDOUS,
      label: "B3 / Berbahaya",
      shortLabel: "B3",
      description:
        "Material yang memerlukan penanganan khusus karena memiliki karakteristik berbahaya.",
      color: "#DC2626",
      softColor: "#FEE2E2",
      icon: "triangle-alert",
      order: 3,
    },

    {
      id: WASTE_CATEGORY.ELECTRONIC,
      label: "Elektronik",
      shortLabel: "Elektronik",
      description:
        "Peralatan atau komponen elektronik yang sudah tidak digunakan dan memerlukan pengelolaan khusus.",
      color: "#7C3AED",
      softColor: "#EDE9FE",
      icon: "cpu",
      order: 4,
    },

    {
      id: WASTE_CATEGORY.RESIDUAL,
      label: "Residu",
      shortLabel: "Residu",
      description:
        "Sisa material setelah pemilahan dan pengelolaan yang tidak memiliki jalur pemanfaatan yang tersedia.",
      color: "#64748B",
      softColor: "#F1F5F9",
      icon: "trash-2",
      order: 5,
    },
  ] as const;

/* -------------------------------------------------------------------------- */
/* Material Definitions                                                       */
/* -------------------------------------------------------------------------- */

export const WASTE_MATERIALS:
  readonly WasteMaterialDefinition[] =
  [
    {
      id: WASTE_MATERIAL.FOOD,
      label: "Sisa Makanan",
      category: WASTE_CATEGORY.ORGANIC,
      description:
        "Sisa makanan dan bahan pangan yang tidak lagi digunakan.",
      characteristics: [
        WASTE_CHARACTERISTIC.BIODEGRADABLE,
      ],
      recommendedMethods: [
        WASTE_METHOD.SORTING,
        WASTE_METHOD.COMPOST,
      ],
      order: 1,
    },

    {
      id: WASTE_MATERIAL.LEAVES,
      label: "Daun",
      category: WASTE_CATEGORY.ORGANIC,
      description:
        "Daun kering atau basah yang berasal dari aktivitas taman dan lingkungan.",
      characteristics: [
        WASTE_CHARACTERISTIC.BIODEGRADABLE,
      ],
      recommendedMethods: [
        WASTE_METHOD.SORTING,
        WASTE_METHOD.COMPOST,
      ],
      order: 2,
    },

    {
      id: WASTE_MATERIAL.GARDEN,
      label: "Sisa Kebun",
      category: WASTE_CATEGORY.ORGANIC,
      description:
        "Sisa aktivitas perawatan taman dan kebun seperti rumput atau potongan tanaman.",
      characteristics: [
        WASTE_CHARACTERISTIC.BIODEGRADABLE,
      ],
      recommendedMethods: [
        WASTE_METHOD.SORTING,
        WASTE_METHOD.COMPOST,
      ],
      order: 3,
    },

    {
      id: WASTE_MATERIAL.WOOD,
      label: "Kayu",
      category: WASTE_CATEGORY.ORGANIC,
      description:
        "Potongan kayu atau material berbasis kayu dari aktivitas rumah tangga atau usaha.",
      characteristics: [
        WASTE_CHARACTERISTIC.RECOVERABLE,
      ],
      recommendedMethods: [
        WASTE_METHOD.SORTING,
        WASTE_METHOD.REUSE,
        WASTE_METHOD.RECOVERY,
      ],
      order: 4,
    },

    {
      id: WASTE_MATERIAL.PAPER,
      label: "Kertas",
      category: WASTE_CATEGORY.INORGANIC,
      description:
        "Kertas yang sudah tidak digunakan dan masih mungkin dipilah untuk didaur ulang.",
      characteristics: [
        WASTE_CHARACTERISTIC.RECYCLABLE,
        WASTE_CHARACTERISTIC.VALUABLE,
      ],
      recommendedMethods: [
        WASTE_METHOD.SORTING,
        WASTE_METHOD.REUSE,
        WASTE_METHOD.RECYCLE,
      ],
      order: 5,
    },

    {
      id: WASTE_MATERIAL.CARDBOARD,
      label: "Kardus",
      category: WASTE_CATEGORY.INORGANIC,
      description:
        "Kardus dan kemasan berbahan dasar kertas yang dapat dipilah untuk pemanfaatan kembali atau daur ulang.",
      characteristics: [
        WASTE_CHARACTERISTIC.RECYCLABLE,
        WASTE_CHARACTERISTIC.VALUABLE,
      ],
      recommendedMethods: [
        WASTE_METHOD.SORTING,
        WASTE_METHOD.REUSE,
        WASTE_METHOD.RECYCLE,
      ],
      order: 6,
    },

    {
      id: WASTE_MATERIAL.PLASTIC,
      label: "Plastik",
      category: WASTE_CATEGORY.INORGANIC,
      description:
        "Berbagai kemasan dan material berbahan plastik yang dapat dipilah berdasarkan jenisnya.",
      characteristics: [
        WASTE_CHARACTERISTIC.RECYCLABLE,
        WASTE_CHARACTERISTIC.VALUABLE,
      ],
      recommendedMethods: [
        WASTE_METHOD.SORTING,
        WASTE_METHOD.REUSE,
        WASTE_METHOD.RECYCLE,
      ],
      order: 7,
    },

    {
      id: WASTE_MATERIAL.GLASS,
      label: "Kaca",
      category: WASTE_CATEGORY.INORGANIC,
      description:
        "Botol, wadah, dan material kaca yang dapat dipilah dengan memperhatikan keselamatan penanganan.",
      characteristics: [
        WASTE_CHARACTERISTIC.RECYCLABLE,
        WASTE_CHARACTERISTIC.VALUABLE,
        WASTE_CHARACTERISTIC.SPECIAL_HANDLING,
      ],
      recommendedMethods: [
        WASTE_METHOD.SORTING,
        WASTE_METHOD.REUSE,
        WASTE_METHOD.RECYCLE,
      ],
      order: 8,
    },

    {
      id: WASTE_MATERIAL.METAL,
      label: "Logam",
      category: WASTE_CATEGORY.INORGANIC,
      description:
        "Material logam seperti kaleng dan komponen logam yang dapat dipilah dan dimanfaatkan kembali.",
      characteristics: [
        WASTE_CHARACTERISTIC.RECYCLABLE,
        WASTE_CHARACTERISTIC.VALUABLE,
      ],
      recommendedMethods: [
        WASTE_METHOD.SORTING,
        WASTE_METHOD.REUSE,
        WASTE_METHOD.RECYCLE,
      ],
      order: 9,
    },

    {
      id: WASTE_MATERIAL.TEXTILE,
      label: "Tekstil",
      category: WASTE_CATEGORY.INORGANIC,
      description:
        "Pakaian, kain, dan material tekstil yang sudah tidak digunakan.",
      characteristics: [
        WASTE_CHARACTERISTIC.REUSABLE,
      ],
      recommendedMethods: [
        WASTE_METHOD.SORTING,
        WASTE_METHOD.REUSE,
        WASTE_METHOD.RECYCLE,
      ],
      order: 10,
    },

    {
      id: WASTE_MATERIAL.RUBBER,
      label: "Karet",
      category: WASTE_CATEGORY.INORGANIC,
      description:
        "Material berbahan karet seperti komponen atau produk karet yang sudah tidak digunakan.",
      characteristics: [
        WASTE_CHARACTERISTIC.RECOVERABLE,
      ],
      recommendedMethods: [
        WASTE_METHOD.SORTING,
        WASTE_METHOD.RECOVERY,
      ],
      order: 11,
    },

    {
      id: WASTE_MATERIAL.OIL,
      label: "Minyak Bekas",
      category: WASTE_CATEGORY.HAZARDOUS,
      description:
        "Minyak bekas yang memerlukan penanganan dan penyimpanan sesuai karakteristik materialnya.",
      characteristics: [
        WASTE_CHARACTERISTIC.SPECIAL_HANDLING,
        WASTE_CHARACTERISTIC.HAZARDOUS,
      ],
      recommendedMethods: [
        WASTE_METHOD.COLLECTION,
        WASTE_METHOD.STORAGE,
        WASTE_METHOD.SPECIAL_HANDLING,
        WASTE_METHOD.TREATMENT,
      ],
      order: 12,
    },

    {
      id: WASTE_MATERIAL.BATTERY,
      label: "Baterai",
      category: WASTE_CATEGORY.HAZARDOUS,
      description:
        "Baterai bekas yang memerlukan pemilahan dan jalur penanganan khusus.",
      characteristics: [
        WASTE_CHARACTERISTIC.HAZARDOUS,
        WASTE_CHARACTERISTIC.SPECIAL_HANDLING,
      ],
      recommendedMethods: [
        WASTE_METHOD.COLLECTION,
        WASTE_METHOD.STORAGE,
        WASTE_METHOD.SPECIAL_HANDLING,
      ],
      order: 13,
    },

    {
      id: WASTE_MATERIAL.CHEMICAL,
      label: "Bahan Kimia",
      category: WASTE_CATEGORY.HAZARDOUS,
      description:
        "Material atau sisa bahan kimia yang memerlukan penanganan khusus.",
      characteristics: [
        WASTE_CHARACTERISTIC.HAZARDOUS,
        WASTE_CHARACTERISTIC.SPECIAL_HANDLING,
      ],
      recommendedMethods: [
        WASTE_METHOD.COLLECTION,
        WASTE_METHOD.STORAGE,
        WASTE_METHOD.TREATMENT,
        WASTE_METHOD.SPECIAL_HANDLING,
      ],
      order: 14,
    },

    {
      id: WASTE_MATERIAL.MEDICAL,
      label: "Limbah Medis",
      category: WASTE_CATEGORY.HAZARDOUS,
      description:
        "Material sisa kegiatan pelayanan kesehatan yang memerlukan pengelolaan dan penanganan khusus.",
      characteristics: [
        WASTE_CHARACTERISTIC.HAZARDOUS,
        WASTE_CHARACTERISTIC.SPECIAL_HANDLING,
      ],
      recommendedMethods: [
        WASTE_METHOD.COLLECTION,
        WASTE_METHOD.STORAGE,
        WASTE_METHOD.TREATMENT,
        WASTE_METHOD.SPECIAL_HANDLING,
      ],
      order: 15,
    },

    {
      id: WASTE_MATERIAL.ELECTRONIC,
      label: "Perangkat Elektronik",
      category: WASTE_CATEGORY.ELECTRONIC,
      description:
        "Perangkat atau komponen elektronik yang sudah tidak digunakan.",
      characteristics: [
        WASTE_CHARACTERISTIC.RECOVERABLE,
        WASTE_CHARACTERISTIC.SPECIAL_HANDLING,
      ],
      recommendedMethods: [
        WASTE_METHOD.SORTING,
        WASTE_METHOD.COLLECTION,
        WASTE_METHOD.RECOVERY,
        WASTE_METHOD.SPECIAL_HANDLING,
      ],
      order: 16,
    },

    {
      id: WASTE_MATERIAL.MIXED,
      label: "Campuran",
      category: WASTE_CATEGORY.RESIDUAL,
      description:
        "Material sampah yang belum dipilah sehingga komposisinya terdiri dari beberapa jenis.",
      characteristics: [
        WASTE_CHARACTERISTIC.RESIDUAL,
      ],
      recommendedMethods: [
        WASTE_METHOD.SORTING,
        WASTE_METHOD.PROCESSING,
        WASTE_METHOD.DISPOSAL,
      ],
      order: 17,
    },
  ] as const;

/* -------------------------------------------------------------------------- */
/* Characteristics Labels                                                     */
/* -------------------------------------------------------------------------- */

export const WASTE_CHARACTERISTIC_LABELS: Record<
  WasteCharacteristic,
  string
> = {
  [WASTE_CHARACTERISTIC.BIODEGRADABLE]:
    "Mudah terurai",

  [WASTE_CHARACTERISTIC.RECYCLABLE]:
    "Dapat didaur ulang",

  [WASTE_CHARACTERISTIC.RECOVERABLE]:
    "Dapat dipulihkan / dimanfaatkan",

  [WASTE_CHARACTERISTIC.REUSABLE]:
    "Dapat digunakan kembali",

  [WASTE_CHARACTERISTIC.RESIDUAL]:
    "Residu",

  [WASTE_CHARACTERISTIC.HAZARDOUS]:
    "Berbahaya",

  [WASTE_CHARACTERISTIC.SPECIAL_HANDLING]:
    "Perlu penanganan khusus",

  [WASTE_CHARACTERISTIC.VALUABLE]:
    "Memiliki nilai material",
};

/* -------------------------------------------------------------------------- */
/* Management Method Labels                                                   */
/* -------------------------------------------------------------------------- */

export const WASTE_METHOD_LABELS: Record<
  WasteMethod,
  string
> = {
  [WASTE_METHOD.REDUCE]:
    "Mengurangi",

  [WASTE_METHOD.REUSE]:
    "Guna ulang",

  [WASTE_METHOD.RECYCLE]:
    "Daur ulang",

  [WASTE_METHOD.COMPOST]:
    "Pengomposan",

  [WASTE_METHOD.RECOVERY]:
    "Pemulihan material",

  [WASTE_METHOD.SORTING]:
    "Pemilahan",

  [WASTE_METHOD.COLLECTION]:
    "Pengumpulan",

  [WASTE_METHOD.PROCESSING]:
    "Pengolahan",

  [WASTE_METHOD.STORAGE]:
    "Penyimpanan",

  [WASTE_METHOD.TREATMENT]:
    "Penanganan / pengolahan khusus",

  [WASTE_METHOD.DISPOSAL]:
    "Pembuangan akhir",

  [WASTE_METHOD.SPECIAL_HANDLING]:
    "Penanganan khusus",
};

/* -------------------------------------------------------------------------- */
/* Status Labels                                                              */
/* -------------------------------------------------------------------------- */

export const WASTE_STATUS_LABELS: Record<
  WasteStatus,
  string
> = {
  [WASTE_STATUS.ACTIVE]:
    "Aktif",

  [WASTE_STATUS.DRAFT]:
    "Draft",

  [WASTE_STATUS.ARCHIVED]:
    "Arsip",
};

export const WASTE_VISIBILITY_LABELS: Record<
  WasteVisibility,
  string
> = {
  [WASTE_VISIBILITY.PUBLIC]:
    "Publik",

  [WASTE_VISIBILITY.PRIVATE]:
    "Privat",
};

/* -------------------------------------------------------------------------- */
/* Helper Functions                                                           */
/* -------------------------------------------------------------------------- */

export const getWasteCategory =
  (
    category: WasteCategory
  ): WasteCategoryDefinition | undefined => {
    return WASTE_CATEGORIES.find(
      (item) => item.id === category
    );
  };

export const getWasteMaterial =
  (
    material: WasteMaterial
  ): WasteMaterialDefinition | undefined => {
    return WASTE_MATERIALS.find(
      (item) => item.id === material
    );
  };

export const getWasteMaterialsByCategory =
  (
    category: WasteCategory
  ): readonly WasteMaterialDefinition[] => {
    return WASTE_MATERIALS.filter(
      (item) =>
        item.category === category
    );
  };

export const getWasteMaterialsByMethod =
  (
    method: WasteMethod
  ): readonly WasteMaterialDefinition[] => {
    return WASTE_MATERIALS.filter(
      (item) =>
        item.recommendedMethods.includes(
          method
        )
    );
  };

export const getWasteMaterialsByCharacteristic =
  (
    characteristic: WasteCharacteristic
  ): readonly WasteMaterialDefinition[] => {
    return WASTE_MATERIALS.filter(
      (item) =>
        item.characteristics.includes(
          characteristic
        )
    );
  };

export const getWasteCategoryLabel = (
  category: WasteCategory
): string => {
  return (
    getWasteCategory(
      category
    )?.label ?? category
  );
};

export const getWasteMaterialLabel = (
  material: WasteMaterial
): string => {
  return (
    getWasteMaterial(
      material
    )?.label ?? material
  );
};

export const getWasteCharacteristicLabel = (
  characteristic: WasteCharacteristic
): string => {
  return (
    WASTE_CHARACTERISTIC_LABELS[
      characteristic
    ] ?? characteristic
  );
};

export const getWasteMethodLabel = (
  method: WasteMethod
): string => {
  return (
    WASTE_METHOD_LABELS[method] ??
    method
  );
};

/* -------------------------------------------------------------------------- */
/* Sort Helpers                                                               */
/* -------------------------------------------------------------------------- */

export const sortWasteCategories =
  (
    categories: readonly WasteCategoryDefinition[]
  ): WasteCategoryDefinition[] => {
    return [...categories].sort(
      (a, b) => a.order - b.order
    );
  };

export const sortWasteMaterials =
  (
    materials: readonly WasteMaterialDefinition[]
  ): WasteMaterialDefinition[] => {
    return [...materials].sort(
      (a, b) => a.order - b.order
    );
  };

/* -------------------------------------------------------------------------- */
/* Validation Helpers                                                         */
/* -------------------------------------------------------------------------- */

export const isWasteCategory = (
  value: unknown
): value is WasteCategory => {
  return (
    typeof value === "string" &&
    (
      Object.values(
        WASTE_CATEGORY
      ) as string[]
    ).includes(value)
  );
};

export const isWasteMaterial = (
  value: unknown
): value is WasteMaterial => {
  return (
    typeof value === "string" &&
    (
      Object.values(
        WASTE_MATERIAL
      ) as string[]
    ).includes(value)
  );
};

export const isWasteMethod = (
  value: unknown
): value is WasteMethod => {
  return (
    typeof value === "string" &&
    (
      Object.values(
        WASTE_METHOD
      ) as string[]
    ).includes(value)
  );
};

export const isWasteCharacteristic = (
  value: unknown
): value is WasteCharacteristic => {
  return (
    typeof value === "string" &&
    (
      Object.values(
        WASTE_CHARACTERISTIC
      ) as string[]
    ).includes(value)
  );
};

/* -------------------------------------------------------------------------- */
/* Public Lists                                                               */
/* -------------------------------------------------------------------------- */

export const WASTE_CATEGORY_OPTIONS =
  WASTE_CATEGORIES.map(
    (category) => ({
      value: category.id,
      label: category.label,
    })
  );

export const WASTE_MATERIAL_OPTIONS =
  WASTE_MATERIALS.map(
    (material) => ({
      value: material.id,
      label: material.label,
    })
  );

export const WASTE_METHOD_OPTIONS =
  Object.values(WASTE_METHOD).map(
    (method) => ({
      value: method,
      label:
        WASTE_METHOD_LABELS[method],
    })
  );

export const WASTE_CHARACTERISTIC_OPTIONS =
  Object.values(
    WASTE_CHARACTERISTIC
  ).map(
    (characteristic) => ({
      value: characteristic,
      label:
        WASTE_CHARACTERISTIC_LABELS[
          characteristic
        ],
    })
  );

/* -------------------------------------------------------------------------- */
/* Default Export                                                             */
/* -------------------------------------------------------------------------- */

const wasteConstants = Object.freeze({
  WASTE_CATEGORY,
  WASTE_MATERIAL,
  WASTE_METHOD,
  WASTE_STATUS,
  WASTE_VISIBILITY,
  WASTE_CHARACTERISTIC,

  WASTE_CATEGORIES,
  WASTE_MATERIALS,

  WASTE_CHARACTERISTIC_LABELS,
  WASTE_METHOD_LABELS,
  WASTE_STATUS_LABELS,
  WASTE_VISIBILITY_LABELS,

  WASTE_CATEGORY_OPTIONS,
  WASTE_MATERIAL_OPTIONS,
  WASTE_METHOD_OPTIONS,
  WASTE_CHARACTERISTIC_OPTIONS,

  getWasteCategory,
  getWasteMaterial,
  getWasteMaterialsByCategory,
  getWasteMaterialsByMethod,
  getWasteMaterialsByCharacteristic,

  getWasteCategoryLabel,
  getWasteMaterialLabel,
  getWasteCharacteristicLabel,
  getWasteMethodLabel,

  sortWasteCategories,
  sortWasteMaterials,

  isWasteCategory,
  isWasteMaterial,
  isWasteMethod,
  isWasteCharacteristic,
});

export default wasteConstants;