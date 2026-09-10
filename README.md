# BINSIGHT

## Badung Waste Intelligence

BINSIGHT adalah platform **informasi, data, pemetaan, edukasi, dan pelaporan persampahan** untuk Kabupaten Badung, Bali.

Platform ini dirancang untuk menghubungkan masyarakat, organisasi pengelola sampah, dan administrator melalui satu sumber informasi yang terstruktur dan dapat dikembangkan secara bertahap.

> **Discover → Understand → Report**
> **Manage → Showcase**
> **Verify → Manage → Monitor**

---

## 1. Tujuan Platform

BINSIGHT bukan aplikasi pengangkutan sampah, marketplace, layanan pembayaran, atau aplikasi logistik.

Fokus utama BINSIGHT adalah membangun **intelligence layer** untuk ekosistem persampahan Kabupaten Badung.

Platform menyediakan:

* informasi organisasi pengelola sampah;
* informasi jenis dan kategori sampah;
* pemetaan lokasi persampahan;
* data dan dashboard ekosistem;
* proses pengelolaan sampah;
* edukasi publik;
* pelaporan masalah persampahan;
* administrasi dan verifikasi data.

Semua informasi operasional harus berasal dari data yang tersedia dan dapat diverifikasi.

BINSIGHT **tidak mengarang angka produksi, kapasitas, tonase, kilogram, jumlah layanan, atau metrik operasional** yang belum memiliki sumber data.

---

# 2. Product Pillars

## MAP

Peta adalah salah satu inti utama BINSIGHT.

Hierarki data:

```text
Kabupaten Badung
        ↓
Kecamatan / Area
        ↓
Lokasi
        ↓
Organisasi
        ↓
Aktivitas / Data
```

Peta dapat digunakan untuk menemukan:

* lokasi pengelolaan sampah;
* bank sampah;
* titik pengumpulan;
* fasilitas pengolahan;
* lokasi terkait organisasi;
* laporan masyarakat;
* area geografis.

---

## DATA

Dashboard menyediakan gambaran ekosistem persampahan.

Data yang ditampilkan harus merepresentasikan data nyata yang tersedia, seperti:

* jumlah organisasi;
* jumlah lokasi;
* distribusi kategori sampah;
* distribusi wilayah;
* laporan masyarakat;
* status laporan;
* distribusi aktivitas pengelolaan.

BINSIGHT tidak menggunakan angka fiktif hanya untuk membuat dashboard terlihat penuh.

---

## EDUCATION

BINSIGHT membantu masyarakat memahami:

* kategori sampah;
* material sampah;
* karakteristik sampah;
* metode pengelolaan;
* proses pengolahan;
* praktik pengurangan sampah;
* pemilahan;
* penggunaan kembali;
* daur ulang;
* composting;
* recovery;
* penanganan khusus.

---

## REPORT

Masyarakat dapat melaporkan persoalan persampahan seperti:

* pembuangan sampah ilegal;
* sampah meluap;
* pembakaran sampah;
* sampah berbahaya;
* pencemaran lingkungan;
* masalah persampahan lainnya.

Alur laporan:

```text
Create
  ↓
Pending
  ↓
Verified
  ↓
In Progress
  ↓
Resolved
```

Laporan dapat pula ditolak:

```text
Pending
   ↓
Rejected
```

---

# 3. Organization Experience

Organisasi memiliki area kerja tersendiri.

```text
Organization
├── Profile
├── Waste Managed
├── Management Process
└── Products
```

Organisasi dapat memperkenalkan:

* identitas;
* lokasi;
* informasi kontak;
* sampah yang dikelola;
* proses pengelolaan;
* produk atau hasil;
* informasi pendukung lainnya.

Data organisasi yang belum diverifikasi tidak boleh dianggap sebagai informasi publik terverifikasi.

---

# 4. Admin Experience

Administrator bertanggung jawab terhadap kualitas dan integritas platform.

Modul admin:

```text
Dashboard
├── Organizations
├── Locations
├── Waste
├── Reports
├── Users
└── Content
```

Fungsi utamanya:

```text
Verify
Manage
Monitor
```

Admin dapat menangani:

* verifikasi organisasi;
* pengelolaan lokasi;
* taxonomy sampah;
* laporan masyarakat;
* pengguna;
* konten edukasi;
* publikasi data.

---

# 5. Technology Stack

BINSIGHT menggunakan stack berikut:

| Teknologi               | Fungsi                    |
| ----------------------- | ------------------------- |
| Astro                   | Web framework / rendering |
| TypeScript              | Type safety               |
| Firebase Authentication | Authentication            |
| Cloud Firestore         | Database                  |
| Firebase Storage        | File dan image storage    |
| Leaflet                 | Interactive map           |
| Zod                     | Validation                |
| Lucide                  | Icon system               |
| CSS                     | Design system             |

Dependencies utama:

```text
astro
firebase
leaflet
zod
@lucide/astro
```

---

# 6. Project Structure

Struktur proyek dipertahankan sebagai berikut:

```text
BINSIGHT/
│
├── public/
│   ├── favicon.svg
│   ├── images/
│   │   ├── logo.svg
│   │   ├── hero/
│   │   ├── organizations/
│   │   └── waste/
│   └── icons/
│
├── src/
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navbar.astro
│   │   │   ├── Footer.astro
│   │   │   └── PageHeader.astro
│   │   │
│   │   ├── dashboard/
│   │   │   ├── StatCard.astro
│   │   │   ├── WasteDistribution.astro
│   │   │   ├── AreaDistribution.astro
│   │   │   └── ReportOverview.astro
│   │   │
│   │   ├── map/
│   │   │   ├── WasteMap.astro
│   │   │   ├── MapFilter.astro
│   │   │   ├── OrganizationMarker.astro
│   │   │   └── ReportMarker.astro
│   │   │
│   │   ├── organization/
│   │   │   ├── OrganizationCard.astro
│   │   │   ├── OrganizationHeader.astro
│   │   │   ├── OrganizationInfo.astro
│   │   │   ├── WasteManaged.astro
│   │   │   └── ManagementProcess.astro
│   │   │
│   │   ├── waste/
│   │   │   ├── WasteCard.astro
│   │   │   ├── WasteCategory.astro
│   │   │   ├── WasteProcess.astro
│   │   │   └── RelatedOrganizations.astro
│   │   │
│   │   ├── report/
│   │   │   ├── ReportForm.astro
│   │   │   ├── ReportLocation.astro
│   │   │   ├── ReportStatus.astro
│   │   │   └── ReportCard.astro
│   │   │
│   │   └── ui/
│   │       ├── Button.astro
│   │       ├── Badge.astro
│   │       ├── Modal.astro
│   │       ├── Select.astro
│   │       ├── Input.astro
│   │       └── EmptyState.astro
│   │
│   ├── layouts/
│   │   ├── PublicLayout.astro
│   │   ├── DashboardLayout.astro
│   │   ├── OrganizationLayout.astro
│   │   └── AdminLayout.astro
│   │
│   ├── pages/
│   │   ├── index.astro
│   │   ├── dashboard.astro
│   │   │
│   │   ├── map/
│   │   │   ├── index.astro
│   │   │   └── [area].astro
│   │   │
│   │   ├── organizations/
│   │   │   ├── index.astro
│   │   │   └── [slug].astro
│   │   │
│   │   ├── waste/
│   │   │   ├── index.astro
│   │   │   └── [slug].astro
│   │   │
│   │   ├── reports/
│   │   │   ├── index.astro
│   │   │   ├── create.astro
│   │   │   └── [id].astro
│   │   │
│   │   ├── company/
│   │   │   └── index.astro
│   │   │
│   │   ├── organization/
│   │   │   ├── index.astro
│   │   │   ├── profile.astro
│   │   │   ├── waste.astro
│   │   │   ├── process.astro
│   │   │   └── products.astro
│   │   │
│   │   └── admin/
│   │       ├── index.astro
│   │       ├── organizations.astro
│   │       ├── locations.astro
│   │       ├── waste.astro
│   │       ├── reports.astro
│   │       ├── users.astro
│   │       └── content.astro
│   │
│   ├── lib/
│   │   ├── firebase/
│   │   │   ├── config.ts
│   │   │   ├── auth.ts
│   │   │   ├── firestore.ts
│   │   │   └── storage.ts
│   │   │
│   │   ├── auth/
│   │   │   ├── guards.ts
│   │   │   ├── roles.ts
│   │   │   └── session.ts
│   │   │
│   │   ├── data/
│   │   │   ├── organizations.ts
│   │   │   ├── waste.ts
│   │   │   ├── locations.ts
│   │   │   └── reports.ts
│   │   │
│   │   ├── utils/
│   │   │   ├── format.ts
│   │   │   ├── slug.ts
│   │   │   └── validation.ts
│   │   │
│   │   └── constants/
│   │       ├── waste.ts
│   │       ├── report.ts
│   │       └── roles.ts
│   │
│   ├── styles/
│   │   ├── global.css
│   │   ├── variables.css
│   │   └── components.css
│   │
│   └── env.d.ts
│
├── firebase/
│   ├── firestore.rules
│   ├── firestore.indexes.json
│   └── storage.rules
│
├── .env
├── .env.example
├── astro.config.mjs
├── package.json
├── tsconfig.json
└── README.md
```

---

# 7. Public Routes

## Home

```text
/
```

Landing page BINSIGHT.

---

## Dashboard

```text
/dashboard
```

Public data overview dan ecosystem intelligence.

---

## Map

```text
/map
/map/[area]
```

Pemetaan lokasi dan organisasi berdasarkan area.

---

## Organizations

```text
/organizations
/organizations/[slug]
```

Directory organisasi dan detail organisasi.

---

## Waste

```text
/waste
/waste/[slug]
```

Taxonomy dan edukasi jenis sampah.

---

## Reports

```text
/reports
/reports/create
/reports/[id]
```

Laporan masyarakat dan pelacakan status.

---

## Company

```text
/company
```

Informasi BINSIGHT dan platform.

---

# 8. Organization Routes

Area khusus organisasi:

```text
/organization
/organization/profile
/organization/waste
/organization/process
/organization/products
```

Area ini digunakan untuk:

* profile management;
* waste management;
* process management;
* product showcase.

---

# 9. Admin Routes

```text
/admin
/admin/organizations
/admin/locations
/admin/waste
/admin/reports
/admin/users
/admin/content
```

Admin area tidak dimaksudkan sebagai public interface.

---

# 10. Waste Taxonomy

BINSIGHT menggunakan kategori utama:

```text
ORGANIC
INORGANIC
HAZARDOUS
ELECTRONIC
RESIDUAL
```

Material dikelola melalui taxonomy terstruktur, termasuk material seperti:

```text
food
leaves
garden
wood
paper
cardboard
plastic
glass
metal
textile
rubber
oil
battery
chemical
medical
electronic
mixed
```

Metode pengelolaan meliputi:

```text
reduce
reuse
recycle
compost
recovery
sorting
collection
processing
storage
treatment
disposal
special-handling
```

Taxonomy berada pada:

```text
src/lib/constants/waste.ts
```

---

# 11. Report Taxonomy

Status laporan:

```text
pending
verified
in-progress
resolved
rejected
```

Prioritas:

```text
low
medium
high
```

Jenis laporan:

```text
illegal-dumping
overflowing-waste
burning-waste
hazardous-waste
environmental-pollution
other
```

Source:

```text
src/lib/constants/report.ts
```

---

# 12. User Roles

BINSIGHT menggunakan tiga role utama:

```text
admin
organization
user
```

## Admin

Memiliki akses penuh terhadap platform.

Digunakan untuk:

* verification;
* data management;
* report management;
* user management;
* content management.

---

## Organization

Digunakan oleh organisasi pengelola sampah.

Organization user memiliki hubungan dengan:

```text
organizationId
```

Hak akses diarahkan pada organisasi miliknya.

---

## User

Pengguna umum / masyarakat.

Digunakan untuk:

* melihat data publik;
* membuat laporan;
* melihat status laporan;
* mengelola profile sendiri.

---

# 13. Authentication

Authentication dikelola menggunakan Firebase Authentication.

File utama:

```text
src/lib/firebase/auth.ts
src/lib/auth/guards.ts
src/lib/auth/roles.ts
src/lib/auth/session.ts
```

Authorization tidak boleh hanya bergantung pada UI.

Security enforcement dilakukan di:

```text
Firebase Authentication
        +
Firestore Rules
        +
Storage Rules
        +
Application Guards
```

---

# 14. Firestore

Firestore digunakan sebagai primary data store.

Collection utama:

```text
users
organizations
areas
locations
waste
reports
content
products
```

Relasi konseptual:

```text
Area
 ├── Locations
 │    └── Organizations
 │
 └── Reports

Organization
 ├── Waste
 ├── Processes
 ├── Products
 └── Locations

Waste
 └── Related Organizations

Report
 ├── Location
 ├── Reporter
 └── Organization
```

---

# 15. Firestore Security

Security rules berada di:

```text
firebase/firestore.rules
```

Prinsip:

```text
Public
  ↓
Public / verified / active data only

User
  ↓
Own profile
Own reports

Organization
  ↓
Own organization data

Admin
  ↓
Full administration
```

Default security adalah deny:

```text
allow read, write: if false;
```

Collection baru harus memiliki rule eksplisit sebelum digunakan oleh client.

---

# 16. Firestore Indexes

Index definition berada di:

```text
firebase/firestore.indexes.json
```

Index digunakan untuk query kombinasi seperti:

```text
status
visibility
category
organizationId
areaId
priority
type
createdAt
updatedAt
name
```

Firestore dapat meminta composite index tambahan apabila sebuah query baru membutuhkan kombinasi field yang belum tersedia.

---

# 17. Firebase Storage

Storage rules:

```text
firebase/storage.rules
```

Struktur storage yang digunakan:

```text
public/

organizations/
├── {organizationId}/
│   ├── logo/
│   ├── cover/
│   ├── gallery/
│   ├── products/
│   └── documents/

waste/
├── {wasteId}/
│   ├── images/
│   └── documents/

reports/
├── {reportId}/
│   ├── images/
│   └── attachments/

content/
├── {contentId}/
│   ├── images/
│   ├── media/
│   └── documents/

users/
├── {uid}/
│   ├── avatar/
│   └── documents/
```

Upload menggunakan batas ukuran dan validasi MIME type yang ditentukan oleh Storage Rules.

---

# 18. Environment Variables

Environment configuration berada di:

```text
.env
.env.example
```

Jangan commit credential sensitif.

Contoh:

```env
PUBLIC_FIREBASE_API_KEY=
PUBLIC_FIREBASE_AUTH_DOMAIN=
PUBLIC_FIREBASE_PROJECT_ID=
PUBLIC_FIREBASE_STORAGE_BUCKET=
PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
PUBLIC_FIREBASE_APP_ID=
```

`.env.example` digunakan sebagai template.

`.env` digunakan untuk environment lokal dan harus tetap privat.

---

# 19. Firebase Configuration

Firebase client configuration berada di:

```text
src/lib/firebase/config.ts
```

Authentication:

```text
src/lib/firebase/auth.ts
```

Firestore:

```text
src/lib/firebase/firestore.ts
```

Storage:

```text
src/lib/firebase/storage.ts
```

Firebase initialization sebaiknya dilakukan satu kali dan digunakan kembali oleh module lain.

---

# 20. Data Layer

Business/data access dipisahkan dari UI.

Organization:

```text
src/lib/data/organizations.ts
```

Waste:

```text
src/lib/data/waste.ts
```

Locations:

```text
src/lib/data/locations.ts
```

Reports:

```text
src/lib/data/reports.ts
```

Komponen UI sebaiknya tidak mengandung logic Firestore yang kompleks.

---

# 21. Utility Layer

Utility functions berada di:

```text
src/lib/utils/
```

Formatting:

```text
format.ts
```

Slug:

```text
slug.ts
```

Validation:

```text
validation.ts
```

Utility harus dibuat reusable dan tidak bergantung pada halaman tertentu.

---

# 22. Styling System

Global design tokens:

```text
src/styles/variables.css
```

Global styles:

```text
src/styles/global.css
```

Component styles:

```text
src/styles/components.css
```

Visual direction:

```text
Institutional
Environmental
Clean
Modern
Data-driven
Trustworthy
Accessible
```

---

# 23. Design Tokens

Primary:

```text
#166534
```

Primary dark:

```text
#14532D
```

Primary light:

```text
#DCFCE7
```

Accent:

```text
#84CC16
```

Background:

```text
#F8FAFC
```

Surface:

```text
#FFFFFF
```

Text:

```text
#0F172A
```

Secondary text:

```text
#64748B
```

Border:

```text
#E2E8F0
```

Danger:

```text
#DC2626
```

Warning:

```text
#F59E0B
```

Info:

```text
#2563EB
```

---

# 24. Component Architecture

Reusable components berada di:

```text
src/components/
```

Komponen dibagi berdasarkan domain.

```text
layout/
dashboard/
map/
organization/
waste/
report/
ui/
```

Komponen generik seperti:

```text
Button
Badge
Modal
Select
Input
EmptyState
```

tidak seharusnya mengandung business logic yang spesifik terhadap halaman tertentu.

---

# 25. Layout Architecture

Public:

```text
PublicLayout.astro
```

Dashboard:

```text
DashboardLayout.astro
```

Organization:

```text
OrganizationLayout.astro
```

Admin:

```text
AdminLayout.astro
```

Layout bertanggung jawab terhadap:

* page shell;
* navigation;
* global metadata;
* global styling;
* layout-specific UI.

---

# 26. Map Architecture

Map utama:

```text
src/components/map/WasteMap.astro
```

Filter:

```text
src/components/map/MapFilter.astro
```

Organization marker:

```text
src/components/map/OrganizationMarker.astro
```

Report marker:

```text
src/components/map/ReportMarker.astro
```

Leaflet digunakan sebagai rendering engine untuk interactive map.

Map data berasal dari data layer dan tidak boleh bergantung pada hard-coded production data.

---

# 27. Reporting Architecture

Report form:

```text
src/components/report/ReportForm.astro
```

Location:

```text
src/components/report/ReportLocation.astro
```

Status:

```text
src/components/report/ReportStatus.astro
```

Card:

```text
src/components/report/ReportCard.astro
```

Report workflow:

```text
User
 ↓
Create Report
 ↓
Validation
 ↓
Pending
 ↓
Review
 ↓
Verified / Rejected
 ↓
In Progress
 ↓
Resolved
```

Laporan harus memiliki validasi input sebelum dikirim.

---

# 28. Organization ↔ Waste Relationship

BINSIGHT menggunakan hubungan dua arah secara konseptual:

```text
Waste
 ↓
Related Organizations
```

dan:

```text
Organization
 ↓
Waste Managed
```

Dengan demikian pengguna dapat bergerak:

```text
Jenis Sampah
    ↓
Siapa yang mengelolanya?
    ↓
Organisasi
```

atau:

```text
Organisasi
    ↓
Apa yang dikelola?
    ↓
Jenis Sampah
```

---

# 29. Data Integrity Principles

BINSIGHT mengikuti prinsip:

### No fake metrics

Jangan membuat:

```text
1.240 ton/bulan
87% recycling rate
42.500 kg collected
```

tanpa sumber data nyata.

### No fake organizations

Organisasi tidak boleh ditampilkan sebagai verified apabila belum melalui proses verifikasi.

### No fake locations

Koordinat tidak boleh dibuat secara acak untuk membuat peta terlihat penuh.

### No fake reports

Laporan demo harus jelas diperlakukan sebagai sample/demo data dan tidak boleh disajikan sebagai laporan masyarakat nyata.

### No false operational claims

Platform tidak boleh mengklaim:

* pickup tersedia;
* pembayaran tersedia;
* pengangkutan tersedia;
* kapasitas fasilitas tersedia;
* layanan tertentu tersedia;

apabila data tersebut belum benar-benar terintegrasi.

---

# 30. Local Development

Install dependency:

```bash
npm install
```

Run development server:

```bash
npm run dev
```

Alternative:

```bash
npm start
```

Default Astro development server biasanya berjalan pada:

```text
http://localhost:4321
```

---

# 31. Type Checking

Jalankan:

```bash
npm run check
```

Command ini menggunakan:

```text
astro check
```

Semua error TypeScript/Astro harus diperbaiki sebelum melanjutkan ke tahap berikutnya.

Target kualitas:

```text
0 errors
0 warnings
0 avoidable hints
```

---

# 32. Production Build

Jalankan:

```bash
npm run build
```

Build script menjalankan:

```text
astro check
+
astro build
```

Dengan demikian type checking dilakukan sebelum production build.

---

# 33. Preview Production Build

Setelah build:

```bash
npm run preview
```

Gunakan preview untuk memeriksa hasil production build secara lokal.

---

# 34. Firebase Deployment

Firebase configuration harus disesuaikan dengan Firebase project yang digunakan.

Firestore rules:

```bash
firebase deploy --only firestore:rules
```

Firestore indexes:

```bash
firebase deploy --only firestore:indexes
```

Storage rules:

```bash
firebase deploy --only storage
```

Pastikan Firebase CLI sudah login:

```bash
firebase login
```

dan project telah dipilih dengan benar.

---

# 35. Recommended Development Workflow

Urutan pengembangan:

```text
1. Design System
       ↓
2. UI Components
       ↓
3. Layouts
       ↓
4. Firebase Config
       ↓
5. Constants
       ↓
6. Data Layer
       ↓
7. Auth
       ↓
8. Dashboard Components
       ↓
9. Map Components
       ↓
10. Organization Components
       ↓
11. Waste Components
       ↓
12. Report Components
       ↓
13. Public Pages
       ↓
14. Organization Pages
       ↓
15. Admin Pages
       ↓
16. Firebase Rules
       ↓
17. Indexes
       ↓
18. Storage Rules
       ↓
19. Documentation
```

Setelah setiap tahap:

```bash
npm run check
```

---

# 36. Code Quality Rules

## TypeScript

Project menggunakan strict TypeScript.

Hindari:

```ts
any
```

kecuali benar-benar diperlukan dan terisolasi.

Gunakan explicit types untuk data domain.

---

## Astro

Komponen Astro harus memiliki props yang terdefinisi.

Prefer:

```ts
interface Props {
  title: string;
}
```

daripada prop tanpa type.

---

## Icons

Gunakan `@lucide/astro`.

Gunakan nama icon yang tersedia pada versi dependency yang terpasang dan hindari alias icon deprecated.

SVG attributes menggunakan:

```astro
stroke-width
```

bukan:

```astro
strokeWidth
```

untuk penggunaan langsung pada komponen Astro.

---

# 37. Accessibility

BINSIGHT harus mendukung:

* keyboard navigation;
* semantic HTML;
* visible focus state;
* ARIA labels yang tepat;
* accessible form errors;
* sufficient contrast;
* screen-reader friendly labels;
* modal keyboard handling;
* responsive navigation.

Interactive elements harus menggunakan:

```text
button
a
input
select
textarea
```

secara semantik.

---

# 38. Responsive Design

Platform harus bekerja pada:

```text
Mobile
Tablet
Desktop
Large Desktop
```

Layout tidak boleh bergantung pada resolusi tertentu.

Map, dashboard, table, cards, modal, dan navigation harus memiliki perilaku responsive.

---

# 39. Security Principles

Jangan menyimpan:

```text
private API secrets
service account keys
admin credentials
password
private tokens
```

di client-side code.

Firebase client configuration yang memang bersifat public tidak boleh dianggap sebagai security boundary.

Security utama ditentukan oleh:

```text
Authentication
Authorization
Firestore Rules
Storage Rules
Validation
```

---

# 40. Demo Data

Demo data dapat digunakan selama development.

Namun demo data harus:

* mudah dibedakan dari data production;
* tidak mengandung klaim faktual palsu;
* tidak dianggap sebagai statistik resmi;
* tidak dipakai untuk mengukur performa ekosistem nyata.

Production seed data harus melalui proses validasi yang jelas.

---

# 41. SEO

Setiap public page sebaiknya memiliki:

```text
title
description
canonical
Open Graph metadata
structured data
```

SEO tidak boleh mengandung informasi yang tidak tersedia di halaman.

Untuk dynamic page seperti:

```text
/organizations/[slug]
/waste/[slug]
/reports/[id]
```

metadata harus mengikuti resource yang sedang ditampilkan.

---

# 42. Performance

Prioritas performance:

```text
Fast initial render
Minimal JavaScript
Optimized images
Lazy loading
Efficient Firestore queries
Limited client-side dependencies
```

Astro digunakan untuk mempertahankan pendekatan server-rendered/static-first sedapat mungkin.

---

# 43. File Naming

Gunakan:

```text
PascalCase
```

untuk component:

```text
OrganizationCard.astro
ReportForm.astro
WasteMap.astro
```

Gunakan:

```text
camelCase
```

untuk functions/variables.

Gunakan:

```text
kebab-case
```

untuk route slug.

Contoh:

```text
illegal-dumping
```

---

# 44. Git

Sebelum commit:

```bash
npm run check
npm run build
```

Commit sebaiknya hanya dilakukan ketika application berada dalam kondisi buildable.

Jangan commit:

```text
.env
node_modules/
dist/
credentials
private keys
```

Gunakan `.env.example` untuk dokumentasi environment variables.

---

# 45. Current Architecture Summary

```text
                    BINSIGHT
                        │
        ┌───────────────┼───────────────┐
        │               │               │
       MAP             DATA         EDUCATION
        │               │               │
        └───────────────┼───────────────┘
                        │
                      REPORT
                        │
             ┌──────────┴──────────┐
             │                     │
          PUBLIC              ORGANIZATION
             │                     │
       Discover                 Manage
       Understand              Showcase
       Report
             │                     │
             └──────────┬──────────┘
                        │
                      ADMIN
                        │
                 Verify / Manage
                     Monitor
```

---

# 46. Core Data Flow

```text
Firebase Authentication
          │
          ▼
       Session
          │
          ▼
      Role Guard
          │
     ┌────┼────┐
     │    │    │
    User Org  Admin
     │    │    │
     ▼    ▼    ▼
 Reports Organization
          │
          ▼
       Firestore
          │
          ├── Organizations
          ├── Locations
          ├── Waste
          ├── Reports
          ├── Content
          └── Products
```

---

# 47. Platform Philosophy

BINSIGHT harus menjadi platform yang:

```text
Useful
Verified
Transparent
Understandable
Data-driven
Community-oriented
Scalable
Maintainable
```

Prioritas utama bukan sekadar membuat UI terlihat kompleks.

Prioritasnya adalah:

```text
Reliable data
+
Clear information architecture
+
Useful map
+
Trustworthy reports
+
Strong administration
```

---

# 48. Final Checklist

Sebelum menganggap sebuah feature selesai:

```text
[ ] UI selesai
[ ] Responsive
[ ] Accessible
[ ] Type-safe
[ ] Validation tersedia
[ ] Loading state tersedia
[ ] Empty state tersedia
[ ] Error state tersedia
[ ] Security rule sesuai
[ ] Firestore query efisien
[ ] Storage rule sesuai
[ ] Tidak ada data palsu
[ ] npm run check lulus
[ ] npm run build lulus
```

---

# 49. BINSIGHT

**BINSIGHT — Badung Waste Intelligence**

Platform untuk membantu Kabupaten Badung memahami ekosistem persampahan melalui:

```text
MAP
DATA
EDUCATION
REPORT
```

Dengan prinsip:

> **Discover. Understand. Report.**

dan untuk pengelola:

> **Manage. Showcase.**

serta untuk administrator:

> **Verify. Manage. Monitor.**
