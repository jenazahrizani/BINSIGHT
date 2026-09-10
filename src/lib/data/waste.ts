import {
  WASTE_CATEGORY,
  WASTE_CHARACTERISTIC,
  type WasteCategory,
} from "@lib/constants/waste";

export type WasteStatus = "active" | "inactive";

export interface WasteProcess {
  step: number;
  title: string;
  description: string;
}

export interface WasteItem {
  id: string;
  slug: string;
  name: string;
  shortDescription: string;
  description: string;
  category: WasteCategory;
  status: WasteStatus;
  icon?: string;
  image?: string;
  examples: string[];
  handling: string[];
  processes: WasteProcess[];
  characteristics: string[];
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface WasteFilters {
  search?: string;
  category?: WasteCategory;
  status?: WasteStatus;
  tag?: string;
}

const now = new Date().toISOString();

export const waste: WasteItem[] = [
  {
    id: "organic",
    slug: "organik",
    name: "Sampah Organik",
    shortDescription:
      "Sampah yang berasal dari material alami dan mudah terurai.",
    description:
      "Sampah organik merupakan sampah yang berasal dari bahan hayati seperti sisa makanan, daun, rumput, dan material alami lainnya. Pengelolaan yang tepat dapat mengurangi beban sampah sekaligus menghasilkan material yang bermanfaat.",
    category: WASTE_CATEGORY.ORGANIC,
    status: "active",
    icon: "leaf",
    image: "/images/waste/organic.svg",
    examples: [
      "Sisa makanan",
      "Kulit buah dan sayur",
      "Daun kering",
      "Rumput",
      "Sisa tanaman",
    ],
    handling: [
      "Pisahkan dari sampah anorganik.",
      "Hindari mencampur dengan limbah B3.",
      "Gunakan wadah tertutup untuk mengurangi bau.",
      "Manfaatkan untuk kompos bila memungkinkan.",
    ],
    processes: [
      {
        step: 1,
        title: "Pemilahan",
        description: "Pisahkan sampah organik dari kategori sampah lainnya.",
      },
      {
        step: 2,
        title: "Pengumpulan",
        description: "Kumpulkan material organik pada tempat yang sesuai.",
      },
      {
        step: 3,
        title: "Pengolahan",
        description: "Organik dapat diolah menjadi kompos atau produk turunan.",
      },
      {
        step: 4,
        title: "Pemanfaatan",
        description:
          "Hasil pengolahan dapat dimanfaatkan kembali sebagai material yang bernilai.",
      },
    ],
    characteristics: [
      WASTE_CHARACTERISTIC.BIODEGRADABLE,
      WASTE_CHARACTERISTIC.RECOVERABLE,
    ],
    tags: ["kompos", "organik", "hayati", "mudah-terurai"],
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "inorganic",
    slug: "anorganik",
    name: "Sampah Anorganik",
    shortDescription:
      "Sampah berbahan non-organik yang dapat dipilah dan dimanfaatkan kembali.",
    description:
      "Sampah anorganik mencakup material seperti plastik, kertas, kaca, dan logam yang memiliki karakteristik berbeda-beda dalam pengelolaannya. Pemilahan menjadi langkah penting agar material yang masih bernilai dapat dimanfaatkan.",
    category: WASTE_CATEGORY.INORGANIC,
    status: "active",
    icon: "recycle",
    image: "/images/waste/inorganic.svg",
    examples: [
      "Botol plastik",
      "Kemasan plastik",
      "Kertas",
      "Kardus",
      "Kaleng",
      "Botol kaca",
    ],
    handling: [
      "Pisahkan berdasarkan material.",
      "Pastikan material relatif bersih dan kering.",
      "Gunakan wadah terpisah untuk material bernilai.",
      "Salurkan kepada pengelola yang sesuai.",
    ],
    processes: [
      {
        step: 1,
        title: "Pemilahan",
        description:
          "Pisahkan plastik, kertas, kaca, logam, dan material lainnya.",
      },
      {
        step: 2,
        title: "Pembersihan",
        description:
          "Bersihkan material dari sisa makanan atau kontaminan yang mengganggu.",
      },
      {
        step: 3,
        title: "Pengelompokan",
        description:
          "Kelompokkan berdasarkan jenis dan karakteristik material.",
      },
      {
        step: 4,
        title: "Pemanfaatan",
        description:
          "Material yang masih bernilai dapat dipakai kembali atau didaur ulang.",
      },
    ],
    characteristics: [
      WASTE_CHARACTERISTIC.RECYCLABLE,
      WASTE_CHARACTERISTIC.REUSABLE,
      WASTE_CHARACTERISTIC.RECOVERABLE,
      WASTE_CHARACTERISTIC.VALUABLE,
    ],
    tags: ["plastik", "kertas", "kaca", "logam", "daur-ulang"],
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "hazardous",
    slug: "b3",
    name: "Sampah B3",
    shortDescription:
      "Sampah yang memiliki sifat berbahaya dan memerlukan penanganan khusus.",
    description:
      "Sampah B3 memerlukan perhatian khusus karena dapat mengandung bahan yang berbahaya bagi manusia dan lingkungan. Pemilahan, penyimpanan, dan penyerahan kepada pengelola yang sesuai harus dilakukan secara hati-hati.",
    category: WASTE_CATEGORY.HAZARDOUS,
    status: "active",
    icon: "triangle-alert",
    image: "/images/waste/hazardous.svg",
    examples: [
      "Baterai",
      "Lampu tertentu",
      "Kemasan bahan kimia",
      "Cat dan sisa bahan kimia",
      "Material terkontaminasi",
    ],
    handling: [
      "Jangan mencampur dengan sampah rumah tangga biasa.",
      "Gunakan wadah yang aman dan sesuai.",
      "Hindari kontak langsung dengan material.",
      "Serahkan kepada pengelola berwenang.",
    ],
    processes: [
      {
        step: 1,
        title: "Identifikasi",
        description:
          "Kenali material yang memiliki karakteristik berbahaya.",
      },
      {
        step: 2,
        title: "Pemisahan",
        description:
          "Pisahkan material B3 dari seluruh kategori sampah lainnya.",
      },
      {
        step: 3,
        title: "Penyimpanan",
        description:
          "Simpan secara aman untuk mencegah kebocoran atau paparan.",
      },
      {
        step: 4,
        title: "Penanganan khusus",
        description:
          "Serahkan kepada pihak yang memiliki fasilitas dan kewenangan yang sesuai.",
      },
    ],
    characteristics: [
      WASTE_CHARACTERISTIC.HAZARDOUS,
      WASTE_CHARACTERISTIC.SPECIAL_HANDLING,
    ],
    tags: ["b3", "berbahaya", "khusus", "limbah-berbahaya"],
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "electronic",
    slug: "elektronik",
    name: "Sampah Elektronik",
    shortDescription:
      "Perangkat elektronik yang sudah tidak digunakan dan membutuhkan penanganan yang tepat.",
    description:
      "Sampah elektronik berasal dari perangkat listrik dan elektronik yang sudah tidak digunakan. Material di dalamnya dapat memiliki nilai guna maupun memerlukan penanganan khusus sehingga tidak sebaiknya dibuang bersama sampah umum.",
    category: WASTE_CATEGORY.ELECTRONIC,
    status: "active",
    icon: "cpu",
    image: "/images/waste/electronic.svg",
    examples: [
      "Ponsel rusak",
      "Komputer",
      "Kabel",
      "Charger",
      "Peralatan elektronik kecil",
    ],
    handling: [
      "Jangan membuang perangkat elektronik bersama sampah umum.",
      "Pisahkan baterai bila memungkinkan dan aman dilakukan.",
      "Simpan di tempat yang terlindung dari air.",
      "Salurkan kepada pengelola atau fasilitas yang menerima e-waste.",
    ],
    processes: [
      {
        step: 1,
        title: "Pengumpulan",
        description:
          "Kumpulkan perangkat elektronik yang sudah tidak digunakan.",
      },
      {
        step: 2,
        title: "Pemeriksaan",
        description:
          "Identifikasi bagian yang masih dapat digunakan atau dipulihkan.",
      },
      {
        step: 3,
        title: "Pemulihan material",
        description:
          "Komponen dan material bernilai dapat dipisahkan untuk dimanfaatkan kembali.",
      },
      {
        step: 4,
        title: "Penanganan akhir",
        description:
          "Material yang memerlukan perlakuan khusus diserahkan kepada pengelola yang sesuai.",
      },
    ],
    characteristics: [
      WASTE_CHARACTERISTIC.RECYCLABLE,
      WASTE_CHARACTERISTIC.REUSABLE,
      WASTE_CHARACTERISTIC.SPECIAL_HANDLING,
      WASTE_CHARACTERISTIC.VALUABLE,
    ],
    tags: ["elektronik", "e-waste", "perangkat", "komponen"],
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "residual",
    slug: "residu",
    name: "Sampah Residu",
    shortDescription:
      "Sampah yang tersisa setelah pemilahan dan tidak memiliki opsi pemanfaatan yang sesuai.",
    description:
      "Sampah residu adalah material yang tersisa setelah proses pemilahan dan tidak dapat dimanfaatkan melalui jalur pengelolaan yang tersedia. Pemilahan sejak sumber tetap penting untuk meminimalkan jumlah residu.",
    category: WASTE_CATEGORY.RESIDUAL,
    status: "active",
    icon: "trash-2",
    image: "/images/waste/residual.svg",
    examples: [
      "Tisu bekas tertentu",
      "Material tercampur yang sulit dipisahkan",
      "Material yang sangat terkontaminasi",
      "Sampah yang tidak memiliki jalur pemanfaatan",
    ],
    handling: [
      "Kurangi jumlah residu melalui pemilahan dari sumber.",
      "Jangan mencampur dengan limbah B3.",
      "Pastikan residu dikumpulkan pada tempat yang sesuai.",
      "Ikuti sistem pengelolaan residu yang berlaku.",
    ],
    processes: [
      {
        step: 1,
        title: "Pemilahan",
        description:
          "Pastikan material yang masih dapat dimanfaatkan sudah dipisahkan.",
      },
      {
        step: 2,
        title: "Pemeriksaan",
        description:
          "Pastikan tidak terdapat material B3 atau material bernilai di dalam residu.",
      },
      {
        step: 3,
        title: "Pengumpulan",
        description: "Kumpulkan residu secara terpisah.",
      },
      {
        step: 4,
        title: "Pengelolaan akhir",
        description:
          "Salurkan sesuai fasilitas atau sistem pengelolaan yang tersedia.",
      },
    ],
    characteristics: [WASTE_CHARACTERISTIC.RESIDUAL],
    tags: ["residu", "sisa", "akhir"],
    createdAt: now,
    updatedAt: now,
  },
];

export function getWaste(): WasteItem[] {
  return [...waste];
}

export function getPublicWaste(): WasteItem[] {
  return waste.filter((item) => item.status === "active");
}

export function getFeaturedWaste(limit = 6): WasteItem[] {
  return getPublicWaste().slice(0, Math.max(0, limit));
}

export function getWasteById(id: string): WasteItem | undefined {
  return waste.find((item) => item.id === id);
}

export function getWasteBySlug(slug: string): WasteItem | undefined {
  return waste.find((item) => item.slug === slug);
}

export function getWasteByCategory(
  category: WasteCategory,
): WasteItem[] {
  return waste.filter((item) => item.category === category);
}

export function filterWaste(filters: WasteFilters = {}): WasteItem[] {
  const normalizedSearch = filters.search?.trim().toLowerCase();

  return waste.filter((item) => {
    if (filters.category && item.category !== filters.category) {
      return false;
    }

    if (filters.status && item.status !== filters.status) {
      return false;
    }

    if (filters.tag && !item.tags.includes(filters.tag)) {
      return false;
    }

    if (normalizedSearch) {
      const searchableText = [
        item.name,
        item.slug,
        item.shortDescription,
        item.description,
        ...item.examples,
        ...item.tags,
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

export function getWasteExamples(slug: string): string[] {
  return getWasteBySlug(slug)?.examples ?? [];
}

export function getWasteHandling(slug: string): string[] {
  return getWasteBySlug(slug)?.handling ?? [];
}

export function getWasteProcesses(slug: string): WasteProcess[] {
  return getWasteBySlug(slug)?.processes ?? [];
}

export function wasteCategoryExists(category: string): boolean {
  return Object.values(WASTE_CATEGORY).includes(
    category as WasteCategory,
  );
}

export function wasteSlugExists(slug: string): boolean {
  return waste.some((item) => item.slug === slug);
}

export function isWastePublic(slug: string): boolean {
  return getWasteBySlug(slug)?.status === "active";
}

export function getWasteCount(): number {
  return waste.length;
}

export function getActiveWasteCount(): number {
  return waste.filter((item) => item.status === "active").length;
}

export function createEmptyWaste(): WasteItem {
  const timestamp = new Date().toISOString();

  return {
    id: "",
    slug: "",
    name: "",
    shortDescription: "",
    description: "",
    category: WASTE_CATEGORY.RESIDUAL,
    status: "inactive",
    icon: "",
    image: "",
    examples: [],
    handling: [],
    processes: [],
    characteristics: [],
    tags: [],
    createdAt: timestamp,
    updatedAt: timestamp,
  };
}

export const emptyWaste = createEmptyWaste;