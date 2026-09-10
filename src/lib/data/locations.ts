export type LocationStatus = "active" | "inactive";

export type LocationType =
  | "collection-point"
  | "recycling-center"
  | "waste-bank"
  | "processing-facility"
  | "drop-point"
  | "other";

export interface Area {
  id: string;
  slug: string;
  name: string;
  description: string;
  status: LocationStatus;
  createdAt: string;
  updatedAt: string;
}

export interface LocationCoordinates {
  lat: number;
  lng: number;
}

export interface WasteLocation {
  id: string;
  slug: string;
  name: string;
  description: string;
  address: string;
  areaId: string;
  areaName: string;
  type: LocationType;
  status: LocationStatus;
  coordinates: LocationCoordinates;
  organizationIds: string[];
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface LocationFilters {
  search?: string;
  areaId?: string;
  type?: LocationType;
  status?: LocationStatus;
  organizationId?: string;
  tag?: string;
}

const now = new Date().toISOString();

/**
 * BINSIGHT area master.
 *
 * Data ini sengaja menggunakan level kecamatan/area sebagai
 * sumber hierarchy utama. Koordinat lokasi individual dapat
 * ditambahkan atau diperbarui ketika data lapangan resmi tersedia.
 */
export const areas: Area[] = [
  {
    id: "abiansemal",
    slug: "abiansemal",
    name: "Abiansemal",
    description:
      "Area Kecamatan Abiansemal dalam wilayah Kabupaten Badung.",
    status: "active",
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "kuta",
    slug: "kuta",
    name: "Kuta",
    description:
      "Area Kecamatan Kuta dalam wilayah Kabupaten Badung.",
    status: "active",
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "kuta-selatan",
    slug: "kuta-selatan",
    name: "Kuta Selatan",
    description:
      "Area Kecamatan Kuta Selatan dalam wilayah Kabupaten Badung.",
    status: "active",
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "kuta-utara",
    slug: "kuta-utara",
    name: "Kuta Utara",
    description:
      "Area Kecamatan Kuta Utara dalam wilayah Kabupaten Badung.",
    status: "active",
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "mengwi",
    slug: "mengwi",
    name: "Mengwi",
    description:
      "Area Kecamatan Mengwi dalam wilayah Kabupaten Badung.",
    status: "active",
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "petang",
    slug: "petang",
    name: "Petang",
    description:
      "Area Kecamatan Petang dalam wilayah Kabupaten Badung.",
    status: "active",
    createdAt: now,
    updatedAt: now,
  },
];

export const locations: WasteLocation[] = [
  {
    id: "location-abiansemal-001",
    slug: "titik-pengelolaan-abiansemal",
    name: "Titik Pengelolaan Sampah Abiansemal",
    description:
      "Lokasi contoh untuk menampilkan titik pengelolaan sampah pada peta BINSIGHT.",
    address: "Abiansemal, Kabupaten Badung, Bali",
    areaId: "abiansemal",
    areaName: "Abiansemal",
    type: "collection-point",
    status: "active",
    coordinates: {
      lat: -8.5496,
      lng: 115.2037,
    },
    organizationIds: [],
    tags: ["abiansemal", "pengumpulan", "komunitas"],
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "location-kuta-001",
    slug: "titik-pengelolaan-kuta",
    name: "Titik Pengelolaan Sampah Kuta",
    description:
      "Lokasi contoh untuk menampilkan titik pengelolaan sampah pada kawasan Kuta.",
    address: "Kuta, Kabupaten Badung, Bali",
    areaId: "kuta",
    areaName: "Kuta",
    type: "collection-point",
    status: "active",
    coordinates: {
      lat: -8.7182,
      lng: 115.1686,
    },
    organizationIds: [],
    tags: ["kuta", "pengumpulan", "publik"],
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "location-kuta-selatan-001",
    slug: "titik-pengelolaan-kuta-selatan",
    name: "Titik Pengelolaan Sampah Kuta Selatan",
    description:
      "Lokasi contoh untuk menampilkan titik pengelolaan sampah pada kawasan Kuta Selatan.",
    address: "Kuta Selatan, Kabupaten Badung, Bali",
    areaId: "kuta-selatan",
    areaName: "Kuta Selatan",
    type: "drop-point",
    status: "active",
    coordinates: {
      lat: -8.8006,
      lng: 115.1625,
    },
    organizationIds: [],
    tags: ["kuta-selatan", "drop-point"],
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "location-kuta-utara-001",
    slug: "titik-pengelolaan-kuta-utara",
    name: "Titik Pengelolaan Sampah Kuta Utara",
    description:
      "Lokasi contoh untuk menampilkan titik pengelolaan sampah pada kawasan Kuta Utara.",
    address: "Kuta Utara, Kabupaten Badung, Bali",
    areaId: "kuta-utara",
    areaName: "Kuta Utara",
    type: "recycling-center",
    status: "active",
    coordinates: {
      lat: -8.6478,
      lng: 115.1495,
    },
    organizationIds: [],
    tags: ["kuta-utara", "daur-ulang"],
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "location-mengwi-001",
    slug: "titik-pengelolaan-mengwi",
    name: "Titik Pengelolaan Sampah Mengwi",
    description:
      "Lokasi contoh untuk menampilkan titik pengelolaan sampah pada kawasan Mengwi.",
    address: "Mengwi, Kabupaten Badung, Bali",
    areaId: "mengwi",
    areaName: "Mengwi",
    type: "processing-facility",
    status: "active",
    coordinates: {
      lat: -8.5437,
      lng: 115.1728,
    },
    organizationIds: [],
    tags: ["mengwi", "pengolahan"],
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "location-petang-001",
    slug: "titik-pengelolaan-petang",
    name: "Titik Pengelolaan Sampah Petang",
    description:
      "Lokasi contoh untuk menampilkan titik pengelolaan sampah pada kawasan Petang.",
    address: "Petang, Kabupaten Badung, Bali",
    areaId: "petang",
    areaName: "Petang",
    type: "waste-bank",
    status: "active",
    coordinates: {
      lat: -8.3923,
      lng: 115.2377,
    },
    organizationIds: [],
    tags: ["petang", "bank-sampah", "komunitas"],
    createdAt: now,
    updatedAt: now,
  },
];

/* -------------------------------------------------------------------------- */
/* Area helpers                                                               */
/* -------------------------------------------------------------------------- */

export function getAreas(): Area[] {
  return [...areas];
}

export function getPublicAreas(): Area[] {
  return areas.filter((area) => area.status === "active");
}

export function getAreaById(id: string): Area | undefined {
  return areas.find((area) => area.id === id);
}

export function getAreaBySlug(slug: string): Area | undefined {
  return areas.find((area) => area.slug === slug);
}

export function areaSlugExists(slug: string): boolean {
  return areas.some((area) => area.slug === slug);
}

export function areaExists(id: string): boolean {
  return areas.some((area) => area.id === id);
}

export function isAreaPublic(slug: string): boolean {
  return getAreaBySlug(slug)?.status === "active";
}

/* -------------------------------------------------------------------------- */
/* Location helpers                                                           */
/* -------------------------------------------------------------------------- */

export function getLocations(): WasteLocation[] {
  return [...locations];
}

export function getPublicLocations(): WasteLocation[] {
  return locations.filter((location) => location.status === "active");
}

export function getLocationById(id: string): WasteLocation | undefined {
  return locations.find((location) => location.id === id);
}

export function getLocationBySlug(
  slug: string,
): WasteLocation | undefined {
  return locations.find((location) => location.slug === slug);
}

export function getLocationsByArea(areaId: string): WasteLocation[] {
  return locations.filter((location) => location.areaId === areaId);
}

export function getLocationsByType(
  type: LocationType,
): WasteLocation[] {
  return locations.filter((location) => location.type === type);
}

export function getLocationsByOrganization(
  organizationId: string,
): WasteLocation[] {
  return locations.filter((location) =>
    location.organizationIds.includes(organizationId),
  );
}

export function getLocationsByTag(tag: string): WasteLocation[] {
  return locations.filter((location) =>
    location.tags.includes(tag),
  );
}

/* -------------------------------------------------------------------------- */
/* Filtering                                                                  */
/* -------------------------------------------------------------------------- */

export function filterLocations(
  filters: LocationFilters = {},
): WasteLocation[] {
  const normalizedSearch = filters.search?.trim().toLowerCase();

  return locations.filter((location) => {
    if (filters.areaId && location.areaId !== filters.areaId) {
      return false;
    }

    if (filters.type && location.type !== filters.type) {
      return false;
    }

    if (filters.status && location.status !== filters.status) {
      return false;
    }

    if (
      filters.organizationId &&
      !location.organizationIds.includes(filters.organizationId)
    ) {
      return false;
    }

    if (filters.tag && !location.tags.includes(filters.tag)) {
      return false;
    }

    if (normalizedSearch) {
      const searchableText = [
        location.name,
        location.slug,
        location.description,
        location.address,
        location.areaName,
        location.type,
        ...location.tags,
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

/* -------------------------------------------------------------------------- */
/* Statistics                                                                 */
/* -------------------------------------------------------------------------- */

export function getLocationCount(): number {
  return locations.length;
}

export function getActiveLocationCount(): number {
  return locations.filter(
    (location) => location.status === "active",
  ).length;
}

export function getAreaCount(): number {
  return areas.length;
}

export function getActiveAreaCount(): number {
  return areas.filter((area) => area.status === "active").length;
}

export function getLocationCountByType(): Record<
  LocationType,
  number
> {
  const counts: Record<LocationType, number> = {
    "collection-point": 0,
    "recycling-center": 0,
    "waste-bank": 0,
    "processing-facility": 0,
    "drop-point": 0,
    other: 0,
  };

  for (const location of locations) {
    counts[location.type] += 1;
  }

  return counts;
}

export function getLocationCountByArea(): Record<
  string,
  number
> {
  const counts: Record<string, number> = {};

  for (const location of locations) {
    counts[location.areaId] = (counts[location.areaId] ?? 0) + 1;
  }

  return counts;
}

/* -------------------------------------------------------------------------- */
/* Grouping                                                                   */
/* -------------------------------------------------------------------------- */

export interface AreaLocationGroup {
  area: Area;
  locations: WasteLocation[];
}

export function getLocationsGroupedByArea(): AreaLocationGroup[] {
  return getPublicAreas().map((area) => ({
    area,
    locations: getPublicLocations().filter(
      (location) => location.areaId === area.id,
    ),
  }));
}

export function getAreasWithLocations(): Area[] {
  return getPublicAreas().filter((area) =>
    locations.some(
      (location) =>
        location.areaId === area.id &&
        location.status === "active",
    ),
  );
}

/* -------------------------------------------------------------------------- */
/* Validation / existence                                                     */
/* -------------------------------------------------------------------------- */

export function locationExists(id: string): boolean {
  return locations.some((location) => location.id === id);
}

export function locationSlugExists(slug: string): boolean {
  return locations.some((location) => location.slug === slug);
}

export function isLocationPublic(id: string): boolean {
  return getLocationById(id)?.status === "active";
}

/* -------------------------------------------------------------------------- */
/* Utility helpers                                                            */
/* -------------------------------------------------------------------------- */

export function getLocationCoordinates(
  id: string,
): LocationCoordinates | undefined {
  return getLocationById(id)?.coordinates;
}

export function getLocationArea(
  locationId: string,
): Area | undefined {
  const location = getLocationById(locationId);

  if (!location) {
    return undefined;
  }

  return getAreaById(location.areaId);
}

export function getAreaLocationCount(areaId: string): number {
  return getPublicLocations().filter(
    (location) => location.areaId === areaId,
  ).length;
}

export function createEmptyArea(): Area {
  const timestamp = new Date().toISOString();

  return {
    id: "",
    slug: "",
    name: "",
    description: "",
    status: "inactive",
    createdAt: timestamp,
    updatedAt: timestamp,
  };
}

export function createEmptyLocation(): WasteLocation {
  const timestamp = new Date().toISOString();

  return {
    id: "",
    slug: "",
    name: "",
    description: "",
    address: "",
    areaId: "",
    areaName: "",
    type: "other",
    status: "inactive",
    coordinates: {
      lat: 0,
      lng: 0,
    },
    organizationIds: [],
    tags: [],
    createdAt: timestamp,
    updatedAt: timestamp,
  };
}

/**
 * Backward-compatible aliases.
 */
export const emptyArea = createEmptyArea;
export const emptyLocation = createEmptyLocation;
