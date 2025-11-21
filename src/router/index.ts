import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(to, from, savedPosition) {
    return savedPosition || { left: 0, top: 0 }
  },
  routes: [
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
  ],
})

export default router

router.beforeEach((to, from, next) => {
  document.title = `Vue.js ${to.meta.title} | TailAdmin - Vue.js Tailwind CSS Dashboard Template`
  next()
})
