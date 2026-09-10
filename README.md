```
01  package.json
02  astro.config.mjs
03  tsconfig.json
04  .env.example
05  .env
06  src/env.d.ts

07  src/styles/variables.css
08  src/styles/global.css
09  src/styles/components.css

10  src/components/ui/Button.astro
11  src/components/ui/Badge.astro
12  src/components/ui/Modal.astro
13  src/components/ui/Select.astro
14  src/components/ui/Input.astro
15  src/components/ui/EmptyState.astro

16  src/components/layout/Navbar.astro
17  src/components/layout/Footer.astro
18  src/components/layout/PageHeader.astro

19  src/layouts/PublicLayout.astro
20  src/layouts/DashboardLayout.astro
21  src/layouts/OrganizationLayout.astro
22  src/layouts/AdminLayout.astro

23  src/lib/firebase/config.ts
24  src/lib/firebase/auth.ts
25  src/lib/firebase/firestore.ts
26  src/lib/firebase/storage.ts

27  src/lib/constants/waste.ts
28  src/lib/constants/report.ts
29  src/lib/constants/roles.ts

30  src/lib/data/organizations.ts
31  src/lib/data/waste.ts
32  src/lib/data/locations.ts
33  src/lib/data/reports.ts

34  src/lib/auth/guards.ts
35  src/lib/auth/roles.ts
36  src/lib/auth/session.ts

37  src/lib/utils/format.ts
38  src/lib/utils/slug.ts
39  src/lib/utils/validation.ts

40  src/components/dashboard/StatCard.astro
41  src/components/dashboard/WasteDistribution.astro
42  src/components/dashboard/AreaDistribution.astro
43  src/components/dashboard/ReportOverview.astro

44  src/components/map/WasteMap.astro
45  src/components/map/MapFilter.astro
46  src/components/map/OrganizationMarker.astro
47  src/components/map/ReportMarker.astro

48  src/components/organization/OrganizationCard.astro
49  src/components/organization/OrganizationHeader.astro
50  src/components/organization/OrganizationInfo.astro
51  src/components/organization/WasteManaged.astro
52  src/components/organization/ManagementProcess.astro

53  src/components/waste/WasteCard.astro
54  src/components/waste/WasteCategory.astro
55  src/components/waste/WasteProcess.astro
56  src/components/waste/RelatedOrganizations.astro

57  src/components/report/ReportForm.astro
58  src/components/report/ReportLocation.astro
59  src/components/report/ReportStatus.astro
60  src/components/report/ReportCard.astro

61  src/pages/index.astro
62  src/pages/dashboard.astro

63  src/pages/map/index.astro
64  src/pages/map/[area].astro

65  src/pages/organizations/index.astro
66  src/pages/organizations/[slug].astro

67  src/pages/waste/index.astro
68  src/pages/waste/[slug].astro

69  src/pages/reports/index.astro
70  src/pages/reports/create.astro
71  src/pages/reports/[id].astro

72  src/pages/company/index.astro

73  src/pages/organization/index.astro
74  src/pages/organization/profile.astro
75  src/pages/organization/waste.astro
76  src/pages/organization/process.astro
77  src/pages/organization/products.astro

78  src/pages/admin/index.astro
79  src/pages/admin/organizations.astro
80  src/pages/admin/locations.astro
81  src/pages/admin/waste.astro
82  src/pages/admin/reports.astro
83  src/pages/admin/users.astro
84  src/pages/admin/content.astro

85  firebase/firestore.rules
86  firebase/firestore.indexes.json
87  firebase/storage.rules

88  README.md
```
```
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
