# Quick Reference Guide - Dynamic Layout System

## For Developers

### ✅ What's New

1. **`src/composables/useLayout.ts`** - New composable

   - Determines layout based on user role
   - Usage: `const { isAdminLayout, isStaffLayout } = useLayout()`

2. **`src/components/layouts/DynamicLayout.vue`** - New wrapper component

   - Automatically selects layout based on role
   - Wraps page content in appropriate layout

3. **`src/components/layouts/staff-layout/StaffSidebar.vue`** - Already created
   - Staff version of sidebar (without Account Management)

### ✅ What's Changed

**6 Page Components Now Use DynamicLayout:**

- `LoanRequest.vue`
- `ManageBorrowings.vue`
- `BooksCategory.vue`
- `Books.vue`
- `BookDetail.vue`
- `DashboardAdmin.vue`

Change template from:

```vue
<AdminLayout>
  <!-- content -->
</AdminLayout>
```

To:

```vue
<DynamicLayout>
  <!-- content -->
</DynamicLayout>
```

And update import from:

```ts
import AdminLayout from '@/components/layouts/admin-layout/AdminLayout.vue'
```

To:

```ts
import DynamicLayout from '@/components/layouts/DynamicLayout.vue'
```

### ✅ How To Use

#### Option 1: Use DynamicLayout (Recommended for shared pages)

```vue
<template>
  <DynamicLayout>
    <div class="p-6">
      <h1>My Page</h1>
      <!-- page content -->
    </div>
  </DynamicLayout>
</template>

<script setup>
import DynamicLayout from '@/components/layouts/DynamicLayout.vue'
</script>
```

**Result:**

- Admin users → See AdminLayout with full sidebar
- Staff users → See StaffLayout with limited sidebar
- Automatic! No manual checking needed

#### Option 2: Use Specific Layout (For role-specific pages)

```vue
<template>
  <AdminLayout>
    <!-- admin only content -->
  </AdminLayout>
</template>

<script setup>
import { AdminLayout } from '@/components/layouts'
</script>
```

Or for staff:

```vue
<template>
  <StaffLayout>
    <!-- staff only content -->
  </StaffLayout>
</template>

<script setup>
import { StaffLayout } from '@/components/layouts'
</script>
```

### ✅ Role-Based Logic

Sometimes you need to show/hide content based on role:

```vue
<template>
  <DynamicLayout>
    <div v-if="isAdmin" class="admin-section">
      <!-- admin only -->
    </div>
    <div v-else-if="isStaff" class="staff-section">
      <!-- staff only -->
    </div>
  </DynamicLayout>
</template>

<script setup>
import DynamicLayout from '@/components/layouts/DynamicLayout.vue'
import { useLayout } from '@/composables/useLayout'

const { isAdminLayout, isStaffLayout } = useLayout()

const isAdmin = isAdminLayout.value
const isStaff = isStaffLayout.value
</script>
```

Or using the auth middleware directly:

```vue
<script setup>
import { hasRole } from '@/utils/authMiddleware'

const isAdmin = hasRole('admin')
const canEdit = hasRole(['admin', 'petugas']) // multiple roles
</script>
```

### ✅ Adding a New Shared Page

If you create a new page that should work for both admin and staff:

1. **Create the page component:**

   ```
   src/views/MyNewPage.vue
   ```

2. **Add route to router/index.ts:**

   ```ts
   {
     path: '/my-new-page',
     name: 'MyNewPage',
     component: () => import('../views/MyNewPage.vue'),
     meta: { title: 'My New Page' }
   }
   ```

3. **Use DynamicLayout in template:**

   ```vue
   <template>
     <DynamicLayout>
       <!-- page content -->
     </DynamicLayout>
   </template>

   <script setup>
   import DynamicLayout from '@/components/layouts/DynamicLayout.vue'
   </script>
   ```

4. **Add to StaffSidebar menu (if needed):**

   ```ts
   // In StaffSidebar.vue
   const menuGroups = [
     {
       title: 'Menu',
       items: [
         // ... existing items ...
         {
           icon: YourIcon,
           name: 'My New Page',
           path: '/my-new-page',
         },
       ],
     },
   ]
   ```

5. **Add to AdminSidebar menu (if needed):**
   ```ts
   // Same as above in AdminSidebar.vue
   ```

### ✅ Testing Role-Based Layout

Test script to verify layout changes:

```typescript
// Test in browser console

// 1. Check current role
import { getUserRole } from '@/utils/authMiddleware'
console.log(getUserRole()) // Should show 'admin' or 'petugas'

// 2. Check layout type
import { useLayout } from '@/composables/useLayout'
const { layout, isAdminLayout, isStaffLayout } = useLayout()
console.log('Layout:', layout.value)
console.log('Is Admin:', isAdminLayout.value)
console.log('Is Staff:', isStaffLayout.value)

// 3. Check which sidebar is showing
const sidebar = document.querySelector('aside')
console.log('Sidebar visible:', sidebar ? 'Yes' : 'No')
```

### ✅ Common Issues & Solutions

**Issue:** Page shows wrong layout

```
Solution:
1. Check localStorage has correct role
2. Refresh page
3. Verify useLayout() returns correct layout type
4. Check browser console for errors
```

**Issue:** Staff user can see "Account Management" menu

```
Solution:
1. Verify StaffSidebar is being used (not AdminSidebar)
2. Check DynamicLayout conditional rendering
3. Verify role is "petugas" not "admin"
```

**Issue:** New page doesn't show in sidebar

```
Solution:
1. Add menu item to both AdminSidebar and StaffSidebar
2. Use correct path matching route
3. Verify route is accessible to user role
4. Clear browser cache and refresh
```

### ✅ File Locations Quick Links

```
Core System:
- useLayout composable     → src/composables/useLayout.ts
- DynamicLayout wrapper    → src/components/layouts/DynamicLayout.vue
- Auth utilities           → src/utils/authMiddleware.ts
- Auth service             → src/services/authService.ts

Layouts:
- Admin layout             → src/components/layouts/admin-layout/AdminLayout.vue
- Admin sidebar            → src/components/layouts/admin-layout/AdminSidebar.vue
- Admin header             → src/components/layouts/admin-layout/AdminHeader.vue
- Staff layout             → src/components/layouts/staff-layout/StaffLayout.vue
- Staff sidebar            → src/components/layouts/staff-layout/StaffSidebar.vue
- Staff header             → src/components/layouts/staff-layout/StaffHeader.vue

Pages Using DynamicLayout:
- Loan Request             → src/views/LoanRequest.vue
- Manage Borrowings        → src/views/ManageBorrowings.vue
- Books Category           → src/views/BooksManagement/BooksCategory.vue
- Books List               → src/views/BooksManagement/Books.vue
- Book Detail              → src/views/BooksManagement/BookDetail.vue
- Dashboard Admin          → src/views/Dashboard/DashboardAdmin.vue

Router:
- Routes configuration     → src/router/index.ts
```

### ✅ Performance Tips

1. **DynamicLayout is lightweight**

   - ~320 bytes total
   - No runtime overhead
   - Layout selected once at load time

2. **Computed properties are cached**

   - `isAdminLayout`, `isStaffLayout` are computed
   - Only recalculates when role changes

3. **Use proper imports**

   ```ts
   // ✅ Good - Direct import
   import DynamicLayout from '@/components/layouts/DynamicLayout.vue'

   // ✅ Also good - Via index
   import { DynamicLayout } from '@/components/layouts'

   // ❌ Avoid - Specifying .vue unnecessarily
   import DynamicLayout from '@/components/layouts/DynamicLayout'
   ```

### ✅ TypeScript Support

Full TypeScript support for layout system:

```typescript
import { useLayout, type LayoutType } from '@/composables/useLayout'
import { type UserRole } from '@/utils/authMiddleware'

const { layout } = useLayout()
const currentLayout: LayoutType = layout.value // 'admin' | 'staff' | 'member'

// Type checking for roles
const role: UserRole | null = getUserRole() // 'admin' | 'petugas' | 'anggota' | null
```

---

**Need Help?**

- Check FINAL_VERIFICATION_REPORT.md for full system verification
- Check IMPLEMENTATION_SUMMARY.md for detailed architecture
- Check ARCHITECTURE_DIAGRAM.md for visual flow diagrams
