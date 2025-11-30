## Dynamic Layout System Implementation

Sistem layout dinamis telah diimplementasikan untuk secara otomatis memilih layout berdasarkan role pengguna.

### Komponen Utama:

1. **`useLayout.ts` Composable** (`src/composables/useLayout.ts`)

   - Membaca role pengguna dari `authService`
   - Menentukan layout mana yang harus digunakan:
     - `admin` → AdminLayout
     - `petugas` → StaffLayout
     - `anggota` → Member layout (default content)

2. **`DynamicLayout.vue` Component** (`src/components/layouts/DynamicLayout.vue`)
   - Smart wrapper component yang otomatis menampilkan layout yang sesuai
   - Menggunakan `v-if` untuk conditional rendering
   - Menerima slot untuk content

### File yang Telah Diupdate:

Semua file di bawah ini sekarang menggunakan `DynamicLayout` instead of `AdminLayout`:

- `src/views/LoanRequest.vue`
- `src/views/ManageBorrowings.vue`
- `src/views/BooksManagement/BooksCategory.vue`
- `src/views/BooksManagement/Books.vue`
- `src/views/BooksManagement/BookDetail.vue`
- `src/views/Dashboard/DashboardAdmin.vue`

### Cara Kerja:

Ketika user dengan role `petugas` mengakses route seperti `/loan-request`:

1. Component akan merender `<DynamicLayout>`
2. `DynamicLayout` akan check role via `useLayout()` composable
3. Karena role adalah `petugas`, akan render `<StaffLayout>` dengan StaffSidebar dan StaffHeader
4. Content akan di-wrap dengan layout petugas

### Keuntungan:

✅ Single component source code untuk admin dan petugas  
✅ Automatic layout selection based on role  
✅ DRY principle - tidak perlu duplicate view files  
✅ Mudah di-maintain dan scale

### Future Enhancement:

Untuk member (anggota), bisa membuat `MemberLayout` component dan update `DynamicLayout` untuk support semua 3 role dengan proper layout.
