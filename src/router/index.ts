import { createRouter, createWebHistory } from 'vue-router'

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
      path: '/signin-staff',
      name: 'SignIn Staff',
      component: () => import('../views/Auth/Staff/Signin.vue'),
      meta: {
        title: 'Signin Staff',
      },
    },
    {
      path: '/signin-member',
      name: 'SignIn Member',
      component: () => import('../views/Auth/Member/Signin.vue'),
      meta: {
        title: 'Signin Member',
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
      path: '/dashboard-staff',
      name: 'DashboardStaff',
      component: () => import('../views/Dashboard/DashboardStaff.vue'),
      meta: {
        title: 'Dashboard Staff',
      },
    },
    {
      path: '/dashboard-member',
      name: 'DashboardMember',
      component: () => import('../views/Dashboard/DashboardMember.vue'),
      meta: {
        title: 'Dashboard Member',
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
      path: '/staff-crud',
      name: 'CRUD Staff',
      component: () => import('../views/AccountManagement/StaffAccount.vue'),
      meta: {
        title: 'Staff Account Management',
      },
    },
    {
      path: '/member-crud',
      name: 'CRUD Member',
      component: () => import('../views/AccountManagement/MemberAccount.vue'),
      meta: {
        title: 'Member Account Management',
      },
    },

    //Books Managements Routes

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

router.beforeEach((to, from, next) => {
  document.title = `Vue.js ${to.meta.title} | TailAdmin - Vue.js Tailwind CSS Dashboard Template`
  next()
})
