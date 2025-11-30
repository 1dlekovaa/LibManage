<template>
  <LoansLayout>
    <div class="space-y-6 p-6">
      <!-- Header -->
      <div>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">My Books</h1>
        <p class="text-gray-600 dark:text-gray-400 mt-1">Kelola data peminjaman buku Anda</p>
      </div>

      <!-- Alert: Overdue Borrowings -->
      <div
        v-if="overdueCount > 0"
        class="bg-orange-500/10 border border-orange-500/30 rounded-lg p-4 flex gap-3"
      >
        <svg
          class="w-5 h-5 text-orange-600 dark:text-orange-400 flex-shrink-0 mt-0.5"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fill-rule="evenodd"
            d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
            clip-rule="evenodd"
          />
        </svg>
        <div>
          <p class="font-semibold text-orange-700 dark:text-orange-300">
            ⚠️ Anda memiliki {{ overdueCount }} peminjaman yang sudah telat
          </p>
          <p class="text-sm text-orange-600 dark:text-orange-400 mt-1">
            Segera kembalikan buku sebelum denda bertambah
          </p>
        </div>
      </div>

      <!-- Tab Navigation -->
      <div class="flex gap-2 border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
        <button
          v-for="(tab, index) in tabs"
          :key="index"
          @click="activeTab = index"
          :class="[
            'px-6 py-3 font-medium whitespace-nowrap transition-colors border-b-2',
            activeTab === index
              ? 'border-blue-600 text-blue-600 dark:text-blue-400'
              : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300',
          ]"
        >
          {{ tab }}
        </button>
      </div>

      <!-- Tab Content -->
      <div>
        <!-- Tab 1: Sedang Dipinjam -->
        <div v-if="activeTab === 0" class="space-y-4">
          <div v-if="isLoading" class="flex justify-center py-12">
            <svg
              class="animate-spin h-8 w-8 text-blue-600"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              ></circle>
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          </div>
          <div v-else-if="borrowingActive.length === 0" class="text-center py-12">
            <p class="text-gray-500 dark:text-gray-400 text-lg">Anda belum meminjam buku</p>
          </div>
          <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-4">
            <div
              v-for="borrowing in borrowingActive"
              :key="borrowing.id"
              class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition-shadow"
            >
              <div class="flex justify-between items-start mb-3">
                <div>
                  <p class="text-xs text-gray-500 dark:text-gray-400">No. Peminjaman</p>
                  <p class="font-semibold text-gray-900 dark:text-white">#{{ borrowing.id }}</p>
                </div>
                <span
                  :class="getDueDateBadgeClass(borrowing.due_date)"
                  class="px-3 py-1 rounded-full text-xs font-semibold inline-block"
                >
                  {{ getDueDateBadgeText(borrowing.due_date) }}
                </span>
              </div>

              <p class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                {{ borrowing.book?.title || 'N/A' }}
              </p>

              <div class="space-y-2 text-sm mb-4">
                <div class="flex justify-between">
                  <span class="text-gray-600 dark:text-gray-400">Tanggal Pinjam:</span>
                  <span class="text-gray-900 dark:text-white">{{
                    formatDate(borrowing.borrow_date)
                  }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600 dark:text-gray-400">Harus Kembali:</span>
                  <span class="text-gray-900 dark:text-white font-semibold">{{
                    formatDate(borrowing.due_date)
                  }}</span>
                </div>
              </div>

              <div class="pt-3 border-t border-gray-200 dark:border-gray-700">
                <span
                  class="inline-block px-3 py-1 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-full text-xs font-semibold"
                >
                  DIPINJAM
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Tab 2: Riwayat Peminjaman -->
        <div v-if="activeTab === 1" class="space-y-4">
          <div v-if="isLoading" class="flex justify-center py-12">
            <svg
              class="animate-spin h-8 w-8 text-blue-600"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              ></circle>
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          </div>
          <div v-else-if="borrowingHistory.length === 0" class="text-center py-12">
            <p class="text-gray-500 dark:text-gray-400 text-lg">Belum ada riwayat peminjaman</p>
          </div>
          <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-4">
            <div
              v-for="borrowing in borrowingHistory"
              :key="borrowing.id"
              class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition-shadow"
            >
              <div class="flex justify-between items-start mb-3">
                <div>
                  <p class="text-xs text-gray-500 dark:text-gray-400">No. Peminjaman</p>
                  <p class="font-semibold text-gray-900 dark:text-white">#{{ borrowing.id }}</p>
                </div>
                <span
                  :class="getHistoryStatusBadgeClass(borrowing.status)"
                  class="px-3 py-1 rounded-full text-xs font-semibold inline-block"
                >
                  {{ formatHistoryStatus(borrowing.status) }}
                </span>
              </div>

              <p class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                {{ borrowing.book?.title || 'N/A' }}
              </p>

              <div class="space-y-2 text-sm">
                <div class="flex justify-between">
                  <span class="text-gray-600 dark:text-gray-400">Pinjam - Kembali:</span>
                  <span class="text-gray-900 dark:text-white"
                    >{{ formatDate(borrowing.borrow_date) }} →
                    {{ formatDate(borrowing.return_date || '') }}</span
                  >
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </LoansLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import LoansLayout from '@/components/layouts/LoansLayout.vue'

interface Book {
  id: number
  title: string
  author: string
  cover_url?: string
}

interface Borrowing {
  id: number
  user_id: number
  book_id: number
  book?: Book
  borrow_date: string
  due_date: string
  return_date?: string
  status: 'dipinjam' | 'dikembalikan' | 'terlambat'
}

interface Fine {
  id: number
  borrowing_id: number
  book_title: string
  amount: number
  status: 'unpaid' | 'paid'
}

const tabs = ['Sedang Dipinjam', 'Riwayat Peminjaman']
const activeTab = ref(0)
const isLoading = ref(false)

const borrowings = ref<Borrowing[]>([])
const fines = ref<Fine[]>([])
const currentUserId = ref<number | null>(null)

// Computed properties
const borrowingActive = computed(() => {
  return borrowings.value.filter((b) => b.status === 'dipinjam')
})

const borrowingHistory = computed(() => {
  return borrowings.value.filter((b) => b.status === 'dikembalikan' || b.status === 'terlambat')
})

const userFines = computed(() => {
  return fines.value.filter((f) => {
    const borrowing = borrowings.value.find((b) => b.id === f.borrowing_id)
    return borrowing?.user_id === currentUserId.value
  })
})

const unpaidFines = computed(() => {
  return userFines.value.filter((f) => f.status === 'unpaid')
})

const paidFines = computed(() => {
  return userFines.value.filter((f) => f.status === 'paid')
})

const unpaidFinesCount = computed(() => unpaidFines.value.length)

const overdueCount = computed(() => {
  return borrowingActive.value.filter((b) => {
    return new Date() > new Date(b.due_date)
  }).length
})

// Helper functions
const formatDate = (dateStr: string): string => {
  if (!dateStr) return 'N/A'
  const date = new Date(dateStr)
  return date.toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

const getDueDateBadgeText = (dueDate: string): string => {
  const dueDateObj = new Date(dueDate)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  dueDateObj.setHours(0, 0, 0, 0)

  const diff = dueDateObj.getTime() - today.getTime()
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))

  if (days < 0) {
    return `⚠️ SUDAH TELAT ${Math.abs(days)} HARI`
  } else {
    return `✅ MASIH ${days} HARI LAGI`
  }
}

const getDueDateBadgeClass = (dueDate: string): string => {
  const dueDateObj = new Date(dueDate)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  dueDateObj.setHours(0, 0, 0, 0)

  const diff = dueDateObj.getTime() - today.getTime()
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))

  if (days < 0) {
    return 'bg-red-500/10 text-red-700 dark:text-red-400'
  } else {
    return 'bg-green-500/10 text-green-700 dark:text-green-400'
  }
}

const formatHistoryStatus = (status: string): string => {
  const statusMap: Record<string, string> = {
    dikembalikan: 'DIKEMBALIKAN',
    terlambat: 'TERLAMBAT',
    dipinjam: 'DIPINJAM',
  }
  return statusMap[status] || status
}

const getHistoryStatusBadgeClass = (status: string): string => {
  const classMap: Record<string, string> = {
    dikembalikan: 'bg-blue-500/10 text-blue-700 dark:text-blue-400',
    terlambat: 'bg-red-500/10 text-red-700 dark:text-red-400',
    dipinjam: 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400',
  }
  return classMap[status] || 'bg-gray-500/10 text-gray-700 dark:text-gray-400'
}

// API calls
const fetchData = async () => {
  isLoading.value = true

  try {
    // Get current user
    const userData = localStorage.getItem('user_data')
    if (!userData) {
      throw new Error('User data not found')
    }

    const user = JSON.parse(userData)
    currentUserId.value = user.id

    const token = localStorage.getItem('auth_token')
    if (!token) {
      throw new Error('Token not found')
    }

    // Fetch borrowings
    const borrowResponse = await fetch('http://localhost:8000/api/borrowings', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    })

    if (borrowResponse.ok) {
      const data = await borrowResponse.json()
      // Filter hanya borrowing milik user yang sedang login
      borrowings.value = (data.data || []).filter(
        (b: Borrowing) => b.user_id === currentUserId.value,
      )
    }

    // Fetch fines
    const finesResponse = await fetch('http://localhost:8000/api/fines', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    })

    if (finesResponse.ok) {
      const data = await finesResponse.json()
      fines.value = data.data || []
    }
  } catch (err) {
    console.error('Error fetching data:', err)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchData()
})
</script>

<style scoped></style>
