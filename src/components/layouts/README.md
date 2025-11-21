# Layout Structure - LibManage Dashboard

Dokumentasi struktur layout yang sudah diorganisir untuk berbagai role di aplikasi LibManage.

## 📁 Struktur Folder

```
src/components/layouts/
├── admin-layout/
│   ├── AdminLayout.vue      # Main layout component
│   ├── AdminHeader.vue       # Header dengan menu dan notifikasi
│   ├── AdminSidebar.vue      # Sidebar dengan menu item admin
│   └── index.ts              # Export barrel
│
├── member-layout/
│   ├── MemberLayout.vue      # Main layout component
│   ├── MemberHeader.vue      # Header dengan menu yang disederhanakan
│   ├── MemberSidebar.vue     # Sidebar dengan menu item member
│   └── index.ts              # Export barrel
│
├── staff-layout/
│   ├── StaffLayout.vue       # Main layout component
│   ├── StaffHeader.vue       # Header dengan menu staff
│   ├── StaffSidebar.vue      # Sidebar dengan menu item staff
│   └── index.ts              # Export barrel
│
├── shared/                   # (untuk future use - shared components)
└── index.ts                  # Main export barrel
```

## 🎯 Penggunaan

### Admin Dashboard

```vue
<template>
  <AdminLayout>
    <div>
      <!-- Your admin content here -->
    </div>
  </AdminLayout>
</template>

<script>
import { AdminLayout } from '@/components/layouts/admin-layout'

export default {
  components: {
    AdminLayout,
  },
}
</script>
```

### Member Dashboard

```vue
<template>
  <MemberLayout>
    <div>
      <!-- Your member content here -->
    </div>
  </MemberLayout>
</template>

<script>
import { MemberLayout } from '@/components/layouts/member-layout'

export default {
  components: {
    MemberLayout,
  },
}
</script>
```

### Staff Dashboard

```vue
<template>
  <StaffLayout>
    <div>
      <!-- Your staff content here -->
    </div>
  </StaffLayout>
</template>

<script>
import { StaffLayout } from '@/components/layouts/staff-layout'

export default {
  components: {
    StaffLayout,
  },
}
</script>
```

## 📦 Imports

### Individual Import

```javascript
import { AdminLayout, AdminHeader, AdminSidebar } from '@/components/layouts/admin-layout'
```

### Grouped Import

```javascript
import { AdminLayout } from '@/components/layouts'
import { MemberLayout } from '@/components/layouts'
import { StaffLayout } from '@/components/layouts'
```

## 🔧 Fitur Setiap Layout

### AdminLayout

- **Header**: Lengkap dengan search, notifications, user menu, dan theme toggle
- **Sidebar**: Menu komprehensif dengan submenu
- **Menu Items**: Dashboard, Authentication, dan menu admin lainnya

### MemberLayout

- **Header**: Search, notifications, user menu, dan theme toggle
- **Sidebar**: Menu yang disederhanakan untuk member
- **Menu Items**: Dashboard Member, Messages, Account Settings

### StaffLayout

- **Header**: Search, notifications, user menu, dan theme toggle
- **Sidebar**: Menu khusus staff dengan management items
- **Menu Items**: Dashboard Staff, Tasks, Books Management, Members Management

## 📝 File yang Sudah Diupdate

- ✅ `src/views/Dashboard/DashboardAdmin.vue` - Menggunakan AdminLayout
- ✅ `src/views/Dashboard/DashboardMember.vue` - Menggunakan MemberLayout
- ✅ `src/views/Dashboard/DashboardStaff.vue` - Menggunakan StaffLayout

## 🚀 Tips & Best Practices

1. **Shared Components**: Header dan Sidebar components menggunakan shared icons dan utilities
2. **Sidebar State**: Gunakan composable `useSidebar()` untuk manage sidebar state
3. **Customization**: Untuk menambah menu item, edit `menuGroups` array di sidebar component masing-masing role
4. **Responsive**: Semua layout sudah fully responsive untuk mobile dan desktop

## 🔄 Menambah Menu Item

Setiap sidebar memiliki `menuGroups` array. Untuk menambah menu:

```javascript
const menuGroups = [
  {
    title: 'Menu',
    items: [
      {
        icon: GridIcon, // Icon component
        name: 'Dashboard', // Display name
        path: '/dashboard', // Route path (optional)
        subItems: [
          // Submenu items (optional)
          { name: 'Overview', path: '/dashboard/overview' },
        ],
      },
      // Add more items...
    ],
  },
]
```

---

**Catatan**: Jika perlu menambah layout baru untuk role lainnya, duplikasi folder salah satu layout yang ada dan sesuaikan menu items-nya.
