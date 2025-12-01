# LibManage Frontend (Vue.js)

Sistem manajemen perpustakaan sederhana berbasis Vue.js dengan Tailwind CSS.

Backend repo: https://github.com/1dlekovaa/LibManage-Backend.git

## Setup Project

Clone repo ini dan backend

Di folder frontend, jalankan:

```bash
npm install
npm run dev
```

Buka browser ke http://localhost:5173 dan ikuti petunjuk di README backend untuk API setup

## Akun Default

**Admin**

- Email: admin@libmanage.com
- Password: admin123

**Petugas**

- Email: petugas@libmanage.com
- Password: petugas123

**Anggota**

- Email: anggota1@libmanage.com / anggota2@libmanage.com / anggota3@libmanage.com
- Password: anggota123

## API URL

```
http://localhost:8000/api
```

## Struktur Project

```
src/
 components/     (UI Components, Modals, Forms, Tables)
 composables/    (useLayout, useSidebar, useToast)
 icons/          (SVG Icons)
 router/         (Vue Router Navigation)
 services/       (API Services - Auth, Book, Category, User)
 utils/          (Helper Functions, Middleware)
 views/          (Pages - Dashboard, MyBooks, MyLoans, etc)
```

## Role & Hak Akses

- **Admin**: Kelola user, buku, kategori, permintaan peminjaman
- **Petugas**: Kelola buku, kategori, proses peminjaman/pengembalian
- **Anggota**: Lihat buku, ajukan & cek status peminjaman

## Tech Stack

- Vue 3.x (Vite)
- Tailwind CSS 4.x
- TypeScript
- Vue Router 4
- Pinia (State Management)

## Build Production

```bash
npm run build
```
