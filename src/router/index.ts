import { createRouter, createWebHistory } from 'vue-router'
import { setupAuthGuard } from '../utils/authMiddleware'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(to, from, savedPosition) {
    return savedPosition || { left: 0, top: 0 }
  },
  routes: [
    // Authentication Routes
    {
      path: '/',
      name: 'Signin',
      component: () => import('../views/Auth/Admin/Signin.vue'),
      meta: {
        title: 'Signin',
      },
    },
    {
      path: '/signup',
      name: 'Signup',
      component: () => import('../views/Auth/Admin/Signup.vue'),
      meta: {
        title: 'Signup',
      },
    },
    {
      path: '/signin-petugas',
      name: 'SignIn Petugas',
      component: () => import('../views/Auth/Petugas/Signin.vue'),
      meta: {
        title: 'Signin Petugas',
      },
    },
    {
      path: '/signin-anggota',
      name: 'SignIn Anggota',
      component: () => import('../views/Auth/Anggota/Signin.vue'),
      meta: {
        title: 'Signin Anggota',
      },
    },

    // Dashboard Routes

    {
      path: '/dashboard-admin',
      name: 'DashboardAdmin',
      component: () => import('../views/Dashboard/DashboardAdmin.vue'),
      meta: {
        title: 'Dashboard Admin',
      },
    },
    {
      path: '/dashboard-petugas',
      name: 'DashboardPetugas',
      component: () => import('../views/Dashboard/DashboardPetugas.vue'),
      meta: {
        title: 'Dashboard Petugas',
      },
    },

    // Halaman Anggota

    {
      path: '/home',
      name: 'Home',
      component: () => import('../views/Home/Home.vue'),
      meta: {
        title: 'Home',
      },
    },

    //Account Managements Routes

    {
      path: '/admin-crud',
      name: 'CRUD Admin',
      component: () => import('../views/AccountManagement/AdminAccount.vue'),
      meta: {
        title: 'Admin Account Management',
      },
    },
    {
      path: '/petugas-crud',
      name: 'CRUD Petugas',
      component: () => import('../views/AccountManagement/PetugasAccount.vue'),
      meta: {
        title: 'Petugas Account Management',
      },
    },
    {
      path: '/anggota-crud',
      name: 'CRUD Anggota',
      component: () => import('../views/AccountManagement/AnggotaAccount.vue'),
      meta: {
        title: 'Anggota Account Management',
      },
    },

    //Books Managements Routes

    {
      path: '/books-list',
      name: 'Books',
      component: () => import('../views/BooksManagement/Books.vue'),
      meta: {
        title: 'Books Management',
      },
    },
    {
      path: '/book/:id',
      name: 'BooksPreview',
      component: () => import('../views/BooksManagement/BooksPreview.vue'),
      meta: {
        title: 'Books Preview',
      },
    },
    {
      path: '/books/:id',
      name: 'BookDetail',
      component: () => import('../views/BooksManagement/BookDetail.vue'),
      meta: {
        title: 'Book Detail',
      },
    },
    {
      path: '/books-category',
      name: 'Books Category',
      component: () => import('../views/BooksManagement/BooksCategory.vue'),
      meta: {
        title: 'Books Category',
      },
    },
  ],
})

export default router

// Setup authentication guard
setupAuthGuard(router)

// Update page title
router.beforeEach((to, from, next) => {
  document.title = `LibManage |  ${to.meta.title} `
  next()
})
