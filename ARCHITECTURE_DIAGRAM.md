# System Architecture Diagram

## Overall Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                     USER LOGIN                                   │
│  ┌──────────────┬─────────────────┬──────────────────┐           │
│  │              │                 │                  │           │
│  ▼              ▼                 ▼                  ▼           │
│ Admin        Petugas           Anggota            Member         │
│ role         role             role                (anggota)      │
│ =========    ==========       ==========           ==========    │
└─────────────────────────────────────────────────────────────────┘
       │              │                │                  │
       │ localStorage │ localStorage   │ localStorage    │ localStorage
       └──────────────┴────────────────┴──────────────────┴───────────┘
                              │
                              ▼
                    ┌─────────────────────┐
                    │   Page Navigation   │
                    │  /loan-request      │
                    │  /books-list        │
                    │  /books-category    │
                    │  /manage-borrowings │
                    └─────────────────────┘
                              │
                              ▼
                    ┌─────────────────────────────────┐
                    │     DynamicLayout.vue           │
                    │  (Smart Wrapper Component)      │
                    └─────────────────────────────────┘
                              │
                    ┌─────────┴─────────┬──────────────┐
                    │                   │              │
                    ▼                   ▼              ▼
         ┌────────────────────┐ ┌──────────────┐  ┌─────────┐
         │  useLayout()       │ │ useLayout()  │  │ useLayout()
         │  Composable        │ │ Composable   │  │ Composable
         │                    │ │              │  │
         │ role: "admin"      │ │ role:        │  │ (other)
         │ → isAdminLayout    │ │ "petugas"    │  │
         │ → true             │ │ →            │  │
         └────────────────────┘ │ isStaffLayout│  │
                 │              │ → true       │  │
                 │              └──────────────┘  └─────────┘
         ┌───────┴──────────────┐         │
         │                      │         │
         ▼                      ▼         ▼
    ┌─────────────┐      ┌──────────────────┐    ┌──────────┐
    │ AdminLayout │      │  StaffLayout     │    │ Default  │
    ├─────────────┤      ├──────────────────┤    │ Content  │
    │AdminSidebar │      │ StaffSidebar     │    └──────────┘
    │  +          │      │  + (NO Account   │
    │ AdminHeader │      │    Management)   │
    │             │      │ + StaffHeader    │
    │  MENU:      │      │                  │
    │  ✓ Dashboard│      │  MENU:           │
    │  ✓ Accounts │      │  ✓ Dashboard     │
    │  ✓ Books    │      │  ✓ Books         │
    │  ✓ Loans    │      │  ✓ Loans         │
    │  ✓ Kelola   │      │  ✓ Kelola        │
    └─────────────┘      └──────────────────┘
         │                      │
         │ Content              │ Content
         │ Slot                 │ Slot
         ▼                      ▼
    ┌─────────────────────────────────────┐
    │   Page Content                       │
    │  (Books.vue, LoanRequest.vue, etc)  │
    │                                     │
    │   Same Page Component               │
    │   Different Layout                  │
    │   Based on User Role                │
    └─────────────────────────────────────┘
```

## Component Tree

```
App.vue
├── ThemeProvider
├── SidebarProvider
├── ScrollProgressBar
├── RouterView
│   └── (Route Component)
│       └── DynamicLayout (NEW)
│           ├── useLayout() composable (NEW)
│           │   ├── Reads: getUserRole()
│           │   └── Returns: layout type
│           │
│           ├── IF isAdminLayout
│           │   └── AdminLayout
│           │       ├── AdminSidebar (5 menu items)
│           │       │   ├── Dashboard
│           │       │   ├── Accounts Management ← ADMIN ONLY
│           │       │   ├── Books Management
│           │       │   ├── Loan Request
│           │       │   └── Kelola Peminjaman
│           │       ├── AdminHeader
│           │       └── <slot/> (Page Content)
│           │
│           ├── ELSE IF isStaffLayout
│           │   └── StaffLayout
│           │       ├── StaffSidebar (4 menu items)
│           │       │   ├── Dashboard
│           │       │   ├── Books Management
│           │       │   ├── Loan Request
│           │       │   └── Kelola Peminjaman
│           │       ├── StaffHeader
│           │       └── <slot/> (Page Content)
│           │
│           └── ELSE
│               └── <slot/> (Default Content)
│
└── ToastNotification
```

## Data Flow: Admin vs Staff at /loan-request

```
ADMIN USER                          STAFF USER (Petugas)
═════════════════════════════════════════════════════════════

localStorage                        localStorage
{                                   {
  user: {                             user: {
    id: 1,                              id: 2,
    name: "Admin",                      name: "Petugas",
    role: "admin"  ◄─────────────────►  role: "petugas"
  },                                  },
  token: "..."                        token: "..."
}                                   }
    │                                   │
    └────────────┬───────────────────────┘
                 │
                 ▼
    GET /loan-request
    (Same page component)
                 │
    ┌────────────┴───────────────┐
    │                            │
    ▼                            ▼
useLayout() calls          useLayout() calls
getUserRole()              getUserRole()
    │                            │
    ▼                            ▼
role = "admin"             role = "petugas"
    │                            │
    ▼                            ▼
Maps to:                   Maps to:
LayoutType = "admin"       LayoutType = "staff"
    │                            │
    ▼                            ▼
isAdminLayout = true       isStaffLayout = true
    │                            │
    ┌────────────┴───────────────┘
    │                            │
    ▼                            ▼
Renders:                   Renders:
<AdminLayout>              <StaffLayout>
    │                            │
    ├── AdminSidebar            ├── StaffSidebar
    │   ├── Dashboard            │   ├── Dashboard
    │   ├── ⭐Accounts           │   ├── Books Mgmt
    │   ├── Books Mgmt           │   ├── Loan Request
    │   ├── Loan Request         │   └── Kelola
    │   └── Kelola               │
    │                            │
    ├── AdminHeader             ├── StaffHeader
    │                            │
    └── <LoanRequest.vue/>       └── <LoanRequest.vue/>
        Content                      Content
        (Same                         (Same
         component)                   component)
    │                            │
    ▼                            ▼
FULL ADMIN LAYOUT          FULL STAFF LAYOUT
(With Account Mgmt)        (Without Account Mgmt)
```

## State Management (useLayout)

```
useLayout.ts
═════════════════════════════════════════════════

Input:
  getUserRole() → "admin" | "petugas" | "anggota"

Processing:
  switch (role) {
    case "admin" → return "admin"
    case "petugas" → return "staff"
    case "anggota" → return "member"
    default → return "admin"
  }

Output (Computed Properties):
  layout: "admin" | "staff" | "member"
  isAdminLayout: boolean
  isStaffLayout: boolean
  isMemberLayout: boolean

Usage in DynamicLayout:
  <AdminLayout v-if="isAdminLayout" />
  <StaffLayout v-else-if="isStaffLayout" />
  <div v-else><!-- default --></div>
```

## Route Access Control Matrix

```
                   Admin    Staff    Member   Guest
                   ====     ====     ======   =====
/dashboard-admin   ✅       ❌       ❌       ❌
/dashboard-petugas ✅       ✅       ❌       ❌
/home              ✅       ❌       ✅       ❌
/books-list        ✅*      ✅*      ❌       ❌
/books-category    ✅*      ✅*      ❌       ❌
/loan-request      ✅*      ✅*      ❌       ❌
/manage-borrowings ✅*      ✅*      ❌       ❌
/admin-crud        ✅       ❌       ❌       ❌
/petugas-crud      ✅       ❌       ❌       ❌
/anggota-crud      ✅       ❌       ❌       ❌

* Different layout based on role
✅ Allowed
❌ Blocked by auth guard
```

## Sidebar Menu Comparison

```
ADMIN SIDEBAR                  STAFF SIDEBAR
═════════════════════════════════════════════════════════════

MENU                           MENU
──────────────────────         ──────────────────
1. Dashboard      →            1. Dashboard      →
   /dashboard-admin               /dashboard-petugas

2. ⭐Accounts     →            (NOT PRESENT)
   Management
   ├─ Admin Account
   ├─ Staff Account
   └─ Member Account

3. Books          →            2. Books          →
   Management                      Management
   ├─ Books Category              ├─ Books Category
   └─ Books List                  └─ Books List

4. Loan Request   →            3. Loan Request   →
   /loan-request                   /loan-request

5. Kelola         →            4. Kelola         →
   Peminjaman                      Peminjaman
   /manage-borrowings              /manage-borrowings

RESULT:                        RESULT:
✓ 5 menu items                 ✓ 4 menu items
✓ Can manage accounts          ✗ Cannot manage accounts
✓ Full access                  ✓ Limited access
```

## File Dependencies

```
Books.vue (Example Page)
    │
    ├── imports
    │   ├── DynamicLayout
    │   │   │
    │   │   └── imports
    │   │       ├── useLayout()
    │   │       │   │
    │   │       │   └── imports
    │   │       │       └── getUserRole()
    │   │       │           (from authMiddleware)
    │   │       │
    │   │       ├── AdminLayout
    │   │       │   └── AdminSidebar
    │   │       │
    │   │       └── StaffLayout
    │   │           └── StaffSidebar
    │   │
    │   ├── bookService
    │   ├── useToast
    │   └── TableBookManagement
    │
    └── provides
        └── Content for DynamicLayout
```

---

**This architecture ensures:**

- ✅ Clean separation of concerns
- ✅ Easy role-based UI customization
- ✅ No code duplication
- ✅ Single source of truth for pages
- ✅ Automatic layout selection
- ✅ Type-safe implementation
