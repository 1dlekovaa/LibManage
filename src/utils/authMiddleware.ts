/**
 * Authentication Middleware
 * Handles role-based access control and route protection
 */

import type { RouteLocationNormalized } from 'vue-router'
import { getUserData, isAuthenticated } from '../services/authService'

export type UserRole = 'admin' | 'petugas' | 'anggota'

/**
 * Get current user's role
 */
export const getUserRole = (): UserRole | null => {
  const user = getUserData()
  return user?.role as UserRole | null
}

/**
 * Check if user is authenticated
 */
export const checkAuth = (): boolean => {
  return isAuthenticated()
}

/**
 * Check if user has specific role
 */
export const hasRole = (role: UserRole | UserRole[]): boolean => {
  const userRole = getUserRole()
  if (!userRole) return false

  if (Array.isArray(role)) {
    return role.includes(userRole)
  }

  return userRole === role
}

/**
 * Get allowed routes based on user role
 */
export const getRoutesByRole = (role: UserRole): string[] => {
  const routeMap: Record<UserRole, string[]> = {
    admin: [
      'Signin',
      'DashboardAdmin',
      'CRUD Admin',
      'CRUD Petugas',
      'CRUD Anggota',
      'Books',
      'BookDetail',
      'Books Category',
    ],
    petugas: ['SignIn Petugas', 'DashboardPetugas', 'Books', 'BookDetail', 'Books Category'],
    anggota: ['SignIn Anggota', 'DashboardAnggota', 'Books', 'BookDetail'],
  }

  return routeMap[role] || []
}

/**
 * Get appropriate signin page based on role
 */
export const getSigninPageByRole = (role: UserRole): string => {
  const signinMap: Record<UserRole, string> = {
    admin: '/dashboard-admin',
    petugas: '/dashboard-petugas',
    anggota: '/home',
  }

  return signinMap[role]
}

/**
 * Get appropriate signin endpoint based on signin page
 */
export const getRoleFromSigninPage = (path: string): UserRole | null => {
  const roleMap: Record<string, UserRole> = {
    '/': 'admin',
    '/signin-petugas': 'petugas',
    '/signin-anggota': 'anggota',
  }

  return roleMap[path] || null
}

/**
 * Main navigation guard for route protection
 */
export const setupAuthGuard = (router: any) => {
  router.beforeEach((to: RouteLocationNormalized, from: RouteLocationNormalized, next: any) => {
    const isAuth = checkAuth()
    const userRole = getUserRole()

    // List of public routes that don't require authentication
    const publicRoutes = ['Signin', 'Signup', 'SignIn Petugas', 'SignIn Anggota']

    // If accessing public routes
    if (publicRoutes.includes(to.name as string)) {
      // If user is already authenticated, redirect to their dashboard
      if (isAuth && userRole) {
        const dashboardPath = getSigninPageByRole(userRole)
        return next(dashboardPath)
      }
      return next()
    }

    // If accessing protected routes without authentication
    if (!isAuth) {
      return next('/')
    }

    // Dashboard Access Control - Only allow dashboard sesuai dengan role
    if (to.name === 'DashboardAdmin' && !hasRole('admin')) {
      return next(getSigninPageByRole(userRole))
    }
    if (to.name === 'DashboardPetugas' && !hasRole('petugas')) {
      return next(getSigninPageByRole(userRole))
    }

    // Account Management Access Control - Only admin can access
    if (
      (to.name === 'CRUD Admin' || to.name === 'CRUD Petugas' || to.name === 'CRUD Anggota') &&
      !hasRole('admin')
    ) {
      return next(getSigninPageByRole(userRole))
    }

    // Allow route
    next()
  })
}
