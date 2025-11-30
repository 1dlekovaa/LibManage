<template>
  <DynamicLayout>
    <div class="space-y-6 p-6">
      <!-- Header -->
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 class="text-4xl font-bold text-gray-900 dark:text-white">Dashboard Admin</h1>
          <p class="text-gray-600 dark:text-gray-400 mt-2">
            Selamat datang, kelola sistem perpustakaan dengan mudah
          </p>
        </div>
        <div class="flex gap-3">
          <button
            @click="refreshData"
            :disabled="isLoading"
            class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            <svg
              v-if="!isLoading"
              class="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            <span v-else class="animate-spin">⟳</span>
            {{ isLoading ? 'Loading...' : 'Refresh' }}
          </button>
        </div>
      </div>

      <!-- Stats Grid - Top Row -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <!-- Total Buku -->
        <div
          class="bg-gradient-to-br from-blue-500/10 to-blue-600/10 border border-blue-500/30 rounded-lg p-6 hover:shadow-lg transition-shadow"
        >
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Buku</p>
              <p class="text-3xl font-bold text-blue-600 dark:text-blue-400">
                {{ stats.totalBooks }}
              </p>
            </div>
            <div class="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center">
              <svg
                class="w-6 h-6 text-blue-600 dark:text-blue-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.669 0-3.218.51-4.5 1.385A7.968 7.968 0 009 4.804z"
                />
              </svg>
            </div>
          </div>
        </div>

        <!-- Total Member -->
        <div
          class="bg-gradient-to-br from-green-500/10 to-green-600/10 border border-green-500/30 rounded-lg p-6 hover:shadow-lg transition-shadow"
        >
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Member</p>
              <p class="text-3xl font-bold text-green-600 dark:text-green-400">
                {{ stats.totalMembers }}
              </p>
            </div>
            <div class="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
              <svg
                class="w-6 h-6 text-green-600 dark:text-green-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fill-rule="evenodd"
                  d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                  clip-rule="evenodd"
                />
              </svg>
            </div>
          </div>
        </div>

        <!-- Peminjaman Aktif -->
        <div
          class="bg-gradient-to-br from-yellow-500/10 to-yellow-600/10 border border-yellow-500/30 rounded-lg p-6 hover:shadow-lg transition-shadow"
        >
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600 dark:text-gray-400 mb-1">Peminjaman Aktif</p>
              <p class="text-3xl font-bold text-yellow-600 dark:text-yellow-400">
                {{ stats.activeBorrowings }}
              </p>
            </div>
            <div class="w-12 h-12 bg-yellow-500/20 rounded-full flex items-center justify-center">
              <svg
                class="w-6 h-6 text-yellow-600 dark:text-yellow-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
        </div>

        <!-- Request Pending -->
        <div
          class="bg-gradient-to-br from-red-500/10 to-red-600/10 border border-red-500/30 rounded-lg p-6 hover:shadow-lg transition-shadow"
        >
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600 dark:text-gray-400 mb-1">Request Pending</p>
              <p class="text-3xl font-bold text-red-600 dark:text-red-400">
                {{ stats.pendingRequests }}
              </p>
            </div>
            <div class="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="size-6 text-red-600 dark:text-red-400"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Main Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Left Column - Charts & Details -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Status Overview -->
          <div
            class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
          >
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Status Overview
            </h3>
            <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
              <!-- Buku Tersedia -->
              <div
                class="bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-800/20 rounded-lg p-4"
              >
                <p class="text-xs text-gray-600 dark:text-gray-400 mb-1">Buku Tersedia</p>
                <p class="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                  {{ stats.availableBooks }}
                </p>
                <p class="text-xs text-gray-500 dark:text-gray-500 mt-2">
                  dari {{ stats.totalBooks }}
                </p>
              </div>

              <!-- Buku Dipinjam -->
              <div
                class="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-lg p-4"
              >
                <p class="text-xs text-gray-600 dark:text-gray-400 mb-1">Buku Dipinjam</p>
                <p class="text-2xl font-bold text-orange-600 dark:text-orange-400">
                  {{ stats.borrowedBooks }}
                </p>
                <p class="text-xs text-gray-500 dark:text-gray-500 mt-2">
                  dari {{ stats.totalBooks }}
                </p>
              </div>

              <!-- Permintaan Disetujui -->
              <div
                class="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-lg p-4"
              >
                <p class="text-xs text-gray-600 dark:text-gray-400 mb-1">Disetujui</p>
                <p class="text-2xl font-bold text-green-600 dark:text-green-400">
                  {{ stats.approvedRequests }}
                </p>
                <p class="text-xs text-gray-500 dark:text-gray-500 mt-2">request</p>
              </div>

              <!-- Request Ditolak -->
              <div
                class="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 rounded-lg p-4"
              >
                <p class="text-xs text-gray-600 dark:text-gray-400 mb-1">Ditolak</p>
                <p class="text-2xl font-bold text-red-600 dark:text-red-400">
                  {{ stats.rejectedRequests }}
                </p>
                <p class="text-xs text-gray-500 dark:text-gray-500 mt-2">request</p>
              </div>

              <!-- Buku Terlambat -->
              <div
                class="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-lg p-4"
              >
                <p class="text-xs text-gray-600 dark:text-gray-400 mb-1">Terlambat</p>
                <p class="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {{ stats.overdueBooks }}
                </p>
                <p class="text-xs text-gray-500 dark:text-gray-500 mt-2">buku</p>
              </div>

              <!-- Kategori Buku -->
              <div
                class="bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-900/20 dark:to-indigo-800/20 rounded-lg p-4"
              >
                <p class="text-xs text-gray-600 dark:text-gray-400 mb-1">Kategori</p>
                <p class="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                  {{ stats.totalCategories }}
                </p>
                <p class="text-xs text-gray-500 dark:text-gray-500 mt-2">kategori</p>
              </div>
            </div>
          </div>

          <!-- Recent Activity -->
          <div
            class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
          >
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Aktivitas Terbaru</h3>
              <router-link
                to="/manage-borrowings"
                class="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
              >
                Lihat Semua →
              </router-link>
            </div>
            <div class="space-y-3">
              <div
                v-if="recentBorrowings.length > 0"
                v-for="borrowing in recentBorrowings.slice(0, 5)"
                :key="borrowing.id"
                class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg"
              >
                <div class="flex-1">
                  <p class="text-sm font-medium text-gray-900 dark:text-white">
                    {{ borrowing.user?.name || 'Unknown' }} -
                    {{ borrowing.book?.title || 'Unknown Book' }}
                  </p>
                  <p class="text-xs text-gray-500 dark:text-gray-400">
                    {{ formatDate(borrowing.borrow_date) }}
                  </p>
                </div>
                <span
                  :class="getActivityStatus(borrowing.due_date)"
                  class="px-2 py-1 rounded text-xs font-medium"
                >
                  {{ getActivityStatusText(borrowing.due_date) }}
                </span>
              </div>
              <div v-else class="text-center py-8 text-gray-500 dark:text-gray-400">
                <p>Belum ada aktivitas peminjaman</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Column - Quick Access -->
        <div class="space-y-6">
          <!-- Quick Actions -->
          <div
            class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
          >
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Akses Cepat</h3>
            <div class="space-y-2">
              <router-link
                to="/manage-borrowings"
                class="flex items-center gap-3 p-3 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 dark:text-blue-400 transition-colors"
              >
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.669 0-3.218.51-4.5 1.385A7.968 7.968 0 009 4.804z"
                  />
                </svg>
                <span class="font-medium text-sm">Kelola Peminjaman</span>
              </router-link>

              <router-link
                to="/loan-request"
                class="flex items-center gap-3 p-3 rounded-lg bg-green-500/10 hover:bg-green-500/20 text-green-600 dark:text-green-400 transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="size-5"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z"
                  />
                </svg>

                <span class="font-medium text-sm">Loan Request</span>
              </router-link>

              <router-link
                to="/books-management"
                class="flex items-center gap-3 p-3 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 text-purple-600 dark:text-purple-400 transition-colors"
              >
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
                </svg>
                <span class="font-medium text-sm">Kelola Buku</span>
              </router-link>

              <router-link
                to="/profile"
                class="flex items-center gap-3 p-3 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 transition-colors"
              >
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fill-rule="evenodd"
                    d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                    clip-rule="evenodd"
                  />
                </svg>
                <span class="font-medium text-sm">Profil & Pengaturan</span>
              </router-link>
            </div>
          </div>

          <!-- System Info -->
          <div
            class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
          >
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Informasi Sistem
            </h3>
            <div class="space-y-3">
              <div
                class="flex items-center justify-between pb-3 border-b border-gray-200 dark:border-gray-700"
              >
                <span class="text-sm text-gray-600 dark:text-gray-400">Versi Aplikasi</span>
                <span class="text-sm font-medium text-gray-900 dark:text-white">1.0.0</span>
              </div>
              <div
                class="flex items-center justify-between pb-3 border-b border-gray-200 dark:border-gray-700"
              >
                <span class="text-sm text-gray-600 dark:text-gray-400">Status</span>
                <span class="flex items-center gap-2">
                  <span class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                  <span class="text-sm font-medium text-green-600 dark:text-green-400">Online</span>
                </span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-sm text-gray-600 dark:text-gray-400">Tanggal Update</span>
                <span class="text-sm font-medium text-gray-900 dark:text-white">{{
                  currentDate
                }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </DynamicLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import DynamicLayout from '@/components/layouts/DynamicLayout.vue'
import { RouterLink } from 'vue-router'

interface User {
  id: number
  name: string
  email: string
}

interface Book {
  id: number
  title: string
}

interface Borrowing {
  id: number
  user_id: number
  book_id: number
  user?: User
  book?: Book
  borrow_date: string
  due_date: string
  return_date?: string
  status: string
}

const isLoading = ref(false)
const recentBorrowings = ref<Borrowing[]>([])
const currentDate = ref('')

const stats = ref({
  totalBooks: 0,
  totalMembers: 0,
  activeBorrowings: 0,
  pendingRequests: 0,
  availableBooks: 0,
  borrowedBooks: 0,
  approvedRequests: 0,
  rejectedRequests: 0,
  overdueBooks: 0,
  totalCategories: 0,
})

// Format date
const formatDate = (dateStr: string): string => {
  if (!dateStr) return 'N/A'
  const date = new Date(dateStr)
  return date.toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

// Get activity status color
const getActivityStatus = (dueDate: string): string => {
  const dueDateObj = new Date(dueDate)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  dueDateObj.setHours(0, 0, 0, 0)

  const diff = dueDateObj.getTime() - today.getTime()
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))

  if (days < 0) {
    return 'bg-red-500/10 text-red-700 dark:text-red-400'
  } else if (days <= 3) {
    return 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400'
  } else {
    return 'bg-green-500/10 text-green-700 dark:text-green-400'
  }
}

// Get activity status text
const getActivityStatusText = (dueDate: string): string => {
  const dueDateObj = new Date(dueDate)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  dueDateObj.setHours(0, 0, 0, 0)

  const diff = dueDateObj.getTime() - today.getTime()
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))

  if (days < 0) {
    return `Terlambat ${Math.abs(days)} hari`
  } else if (days === 0) {
    return 'Deadline Hari Ini'
  } else if (days <= 3) {
    return `${days} hari lagi`
  } else {
    return 'On Time'
  }
}

// Fetch dashboard data
const fetchDashboardData = async () => {
  isLoading.value = true

  try {
    const token = localStorage.getItem('auth_token')
    if (!token) throw new Error('Token not found')

    // Fetch all data in parallel
    const [borrowingsRes, requestsRes, booksRes, usersRes, categoriesRes] = await Promise.all([
      fetch('http://localhost:8000/api/borrowings', {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      }),
      fetch('http://localhost:8000/api/borrow-requests', {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      }),
      fetch('http://localhost:8000/api/books', {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      }),
      fetch('http://localhost:8000/api/users', {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      }),
      fetch('http://localhost:8000/api/categories', {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      }),
    ])

    // Process borrowings
    if (borrowingsRes.ok) {
      const borrowingsData = await borrowingsRes.json()
      const allBorrowings = borrowingsData.data || []
      recentBorrowings.value = allBorrowings

      const activeBorrowings = allBorrowings.filter((b: Borrowing) => b.status === 'dipinjam')
      const overdueCount = activeBorrowings.filter((b: Borrowing) => {
        const dueDate = new Date(b.due_date)
        const today = new Date()
        return dueDate < today
      }).length

      stats.value.activeBorrowings = activeBorrowings.length
      stats.value.overdueBooks = overdueCount
    }

    // Process requests
    if (requestsRes.ok) {
      const requestsData = await requestsRes.json()
      const allRequests = requestsData.data || []
      stats.value.pendingRequests = allRequests.filter((r: any) => r.status === 'pending').length
      stats.value.approvedRequests = allRequests.filter((r: any) => r.status === 'approved').length
      stats.value.rejectedRequests = allRequests.filter((r: any) => r.status === 'rejected').length
    }

    // Process books
    if (booksRes.ok) {
      const booksData = await booksRes.json()
      const allBooks = booksData.data || []
      stats.value.totalBooks = allBooks.length
      stats.value.availableBooks = allBooks.filter((b: any) => b.stock > 0).length
      stats.value.borrowedBooks = stats.value.totalBooks - stats.value.availableBooks
    }

    // Process users
    if (usersRes.ok) {
      const usersData = await usersRes.json()
      const allUsers = usersData.data || []
      stats.value.totalMembers = allUsers.filter(
        (u: any) => u.role !== 'admin' && u.role !== 'petugas',
      ).length
    }

    // Process categories
    if (categoriesRes.ok) {
      const categoriesData = await categoriesRes.json()
      stats.value.totalCategories = (categoriesData.data || []).length
    }
  } catch (err) {
    console.error('Error fetching dashboard data:', err)
  } finally {
    isLoading.value = false
  }
}

// Refresh data
const refreshData = async () => {
  await fetchDashboardData()
}

// Set current date
const setCurrentDate = () => {
  const today = new Date()
  currentDate.value = today.toLocaleDateString('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

onMounted(() => {
  setCurrentDate()
  fetchDashboardData()
})
</script>

<style scoped></style>
