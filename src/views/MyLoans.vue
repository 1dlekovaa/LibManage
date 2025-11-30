<template>
  <LoansLayout>
    <div class="space-y-6 p-6">
      <!-- Header -->
      <div class="flex justify-between items-center">
        <div>
          <h1 class="text-3xl font-bold text-gray-900 dark:text-white">My Loans</h1>
          <p class="text-gray-600 dark:text-gray-400 mt-1">Kelola data buku yang sedang dipinjam</p>
        </div>
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

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard title="Total Loans" :value="totalLoans" :icon="'📚'" color="bg-blue-500/10">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="size-8 text-blue-600 dark:text-blue-400"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25"
            />
          </svg>
        </StatCard>
        <StatCard title="Active" :value="activeLoans" :icon="'✓'" color="bg-green-500/10">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="size-8 text-green-600 dark:text-green-400"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
            />
          </svg>
        </StatCard>
        <StatCard title="Pending" :value="pendingLoans" :icon="'⏳'" color="bg-yellow-500/10">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="size-8 text-yellow-600 dark:text-yellow-400"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
            />
          </svg>
        </StatCard>
        <StatCard title="Rejected" :value="rejectedLoans" :icon="'✕'" color="bg-red-500/10">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="size-8 text-red-600 dark:text-red-400"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
            />
          </svg>
        </StatCard>
      </div>

      <!-- Error Message -->
      <div
        v-if="error"
        class="p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-600 dark:text-red-400"
      >
        {{ error }}
      </div>

      <!-- Table -->
      <div
        class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
      >
        <!-- Table Header -->
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
                <th
                  class="px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300"
                >
                  Book Title
                </th>
                <th
                  class="px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300"
                >
                  Author
                </th>
                <th
                  class="px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300"
                >
                  Request Date
                </th>
                <th
                  class="px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300"
                >
                  Due Date
                </th>
                <th
                  class="px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300"
                >
                  Status
                </th>
                <th
                  class="px-6 py-4 text-right text-sm font-semibold text-gray-700 dark:text-gray-300"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              <!-- Loading State -->
              <tr v-if="isLoading && loans.length === 0">
                <td colspan="6" class="px-6 py-8 text-center">
                  <div class="flex justify-center">
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
                </td>
              </tr>

              <!-- Empty State -->
              <tr v-else-if="loans.length === 0">
                <td colspan="6" class="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                  <p class="text-lg">Belum ada data peminjaman</p>
                </td>
              </tr>

              <!-- Data Rows -->
              <tr
                v-for="loan in loans"
                :key="loan.id"
                class="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors"
              >
                <td class="px-6 py-4 text-sm text-gray-900 dark:text-gray-100 font-medium">
                  {{ loan.book?.title || 'N/A' }}
                </td>
                <td class="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                  {{ loan.book?.author || 'N/A' }}
                </td>
                <td class="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                  {{ formatDate(loan.request_date) }}
                </td>
                <td class="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                  {{ formatDate(loan.due_date) }}
                </td>
                <td class="px-6 py-4 text-sm">
                  <span
                    :class="getStatusClass(loan.status)"
                    class="px-3 py-1 rounded-full text-xs font-semibold inline-block"
                  >
                    {{ formatStatus(loan.status) }}
                  </span>
                </td>
                <td class="px-6 py-4 text-right text-sm">
                  <div class="flex justify-end gap-2">
                    <button
                      @click="viewDetail(loan)"
                      class="px-3 py-1 bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 dark:text-blue-400 rounded-lg transition-colors text-xs font-medium"
                    >
                      Detail
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Detail Modal -->
    <DetailModal v-if="selectedLoan" :loan="selectedLoan" @close="selectedLoan = null" />
  </LoansLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import LoansLayout from '@/components/layouts/LoansLayout.vue'
import StatCard from '@/components/common/StatCard.vue'
import DetailModal from '@/components/bookDetail/LoanDetailModal.vue'

interface Book {
  id: number
  title: string
  author: string
  cover_url?: string
}

interface BorrowRequest {
  id: number
  user_id: number
  book_id: number
  book?: Book
  request_date: string
  due_date: string
  status: 'pending' | 'approved' | 'rejected' | 'returned'
  created_at: string
  updated_at: string
}

const loans = ref<BorrowRequest[]>([])
const isLoading = ref(false)
const error = ref<string | null>(null)
const selectedLoan = ref<BorrowRequest | null>(null)

const totalLoans = computed(() => loans.value.length)
const activeLoans = computed(() => loans.value.filter((l) => l.status === 'approved').length)
const pendingLoans = computed(() => loans.value.filter((l) => l.status === 'pending').length)
const rejectedLoans = computed(() => loans.value.filter((l) => l.status === 'rejected').length)

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

// Format status
const formatStatus = (status: string): string => {
  const statusMap: Record<string, string> = {
    pending: 'Pending',
    approved: 'Approved',
    rejected: 'Rejected',
    returned: 'Returned',
  }
  return statusMap[status] || status
}

// Get status color class
const getStatusClass = (status: string): string => {
  const classMap: Record<string, string> = {
    pending: 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400',
    approved: 'bg-green-500/10 text-green-700 dark:text-green-400',
    rejected: 'bg-red-500/10 text-red-700 dark:text-red-400',
    returned: 'bg-blue-500/10 text-blue-700 dark:text-blue-400',
  }
  return classMap[status] || 'bg-gray-500/10 text-gray-700 dark:text-gray-400'
}

// Fetch loans
const fetchLoans = async () => {
  isLoading.value = true
  error.value = null

  try {
    const token = localStorage.getItem('auth_token')
    const userData = localStorage.getItem('user_data')

    if (!token) {
      throw new Error('You must login first')
    }

    if (!userData) {
      throw new Error('User data not found')
    }

    const currentUser = JSON.parse(userData)
    const currentUserId = currentUser.id

    const response = await fetch('http://localhost:8000/api/borrow-requests', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error('Failed to fetch loans')
    }

    const data = await response.json()
    // Filter hanya loan milik user yang sedang login
    loans.value = (data.data || []).filter((loan: BorrowRequest) => loan.user_id === currentUserId)
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'An error occurred'
    loans.value = []
  } finally {
    isLoading.value = false
  }
}

// Refresh data
const refreshData = () => {
  fetchLoans()
}

// View detail
const viewDetail = (loan: BorrowRequest) => {
  selectedLoan.value = loan
}

// Load data on mount
onMounted(() => {
  fetchLoans()
})
</script>

<style scoped></style>
