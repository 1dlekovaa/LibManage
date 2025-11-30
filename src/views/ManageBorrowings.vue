<template>
  <DynamicLayout>
    <div class="space-y-6 p-6">
      <!-- Header -->
      <div class="flex justify-between items-center">
        <div>
          <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Kelola Peminjaman</h1>
          <p class="text-gray-600 dark:text-gray-400 mt-1">
            Kelola pengembalian dan riwayat peminjaman buku
          </p>
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

      <!-- Error Message -->
      <div
        v-if="error"
        class="p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-600 dark:text-red-400"
      >
        {{ error }}
      </div>

      <!-- Tab Navigation -->
      <div class="flex gap-2 border-b border-gray-200 dark:border-gray-700">
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

      <!-- TAB 1: PROSES RETURN BUKU -->
      <div v-if="activeTab === 0" class="space-y-4">
        <!-- Info Stats -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
            <p class="text-sm text-gray-600 dark:text-gray-400">Total Sedang Dipinjam</p>
            <p class="text-3xl font-bold text-blue-600 dark:text-blue-400">
              {{ activeBorrowings.length }}
            </p>
          </div>
          <div class="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
            <p class="text-sm text-gray-600 dark:text-gray-400">Dalam Waktu</p>
            <p class="text-3xl font-bold text-green-600 dark:text-green-400">{{ onTimeCount }}</p>
          </div>
          <div class="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
            <p class="text-sm text-gray-600 dark:text-gray-400">Sudah Telat</p>
            <p class="text-3xl font-bold text-red-600 dark:text-red-400">{{ overdueCount }}</p>
          </div>
        </div>

        <!-- Table -->
        <div
          class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
        >
          <div class="overflow-auto">
            <table class="w-full table-fixed">
              <thead>
                <tr
                  class="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900"
                >
                  <th
                    class="w-10 px-2 py-2 text-left text-xs font-semibold text-gray-700 dark:text-gray-300"
                  >
                    No
                  </th>
                  <th
                    class="w-28 px-2 py-2 text-left text-xs font-semibold text-gray-700 dark:text-gray-300"
                  >
                    Member
                  </th>
                  <th
                    class="px-2 py-2 text-left text-xs font-semibold text-gray-700 dark:text-gray-300"
                  >
                    Email
                  </th>
                  <th
                    class="px-2 py-2 text-left text-xs font-semibold text-gray-700 dark:text-gray-300"
                  >
                    Judul Buku
                  </th>
                  <th
                    class="w-24 px-2 py-2 text-left text-xs font-semibold text-gray-700 dark:text-gray-300"
                  >
                    Pinjam
                  </th>
                  <th
                    class="w-24 px-2 py-2 text-left text-xs font-semibold text-gray-700 dark:text-gray-300"
                  >
                    Deadline
                  </th>
                  <th
                    class="w-28 px-2 py-2 text-left text-xs font-semibold text-gray-700 dark:text-gray-300"
                  >
                    Status
                  </th>
                  <th
                    class="w-20 px-2 py-2 text-center text-xs font-semibold text-gray-700 dark:text-gray-300"
                  >
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="isLoading && activeBorrowings.length === 0">
                  <td colspan="8" class="px-6 py-8 text-center">
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

                <tr v-else-if="activeBorrowings.length === 0">
                  <td colspan="8" class="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                    Belum ada peminjaman aktif
                  </td>
                </tr>

                <tr
                  v-for="(borrowing, index) in activeBorrowings"
                  :key="borrowing.id"
                  class="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors"
                >
                  <td class="px-2 py-2 text-xs text-gray-900 dark:text-gray-100">
                    {{ index + 1 }}
                  </td>
                  <td
                    class="px-2 py-2 text-xs font-medium text-gray-900 dark:text-gray-100 truncate"
                    :title="borrowing.user?.name"
                  >
                    {{ borrowing.user?.name || 'N/A' }}
                  </td>
                  <td
                    class="px-2 py-2 text-xs text-gray-600 dark:text-gray-400 truncate"
                    :title="borrowing.user?.email"
                  >
                    {{ borrowing.user?.email || 'N/A' }}
                  </td>
                  <td
                    class="px-2 py-2 text-xs text-gray-900 dark:text-gray-100 truncate"
                    :title="borrowing.book?.title"
                  >
                    {{ borrowing.book?.title || 'N/A' }}
                  </td>
                  <td class="px-2 py-2 text-xs text-gray-600 dark:text-gray-400 whitespace-nowrap">
                    {{ formatDateShort(borrowing.borrow_date) }}
                  </td>
                  <td class="px-2 py-2 text-xs text-gray-600 dark:text-gray-400 whitespace-nowrap">
                    {{ formatDateShort(borrowing.due_date) }}
                  </td>
                  <td class="px-2 py-2 text-xs">
                    <span
                      :class="getStatusClass(borrowing.due_date)"
                      class="px-2 py-1 rounded text-xs font-medium inline-block whitespace-nowrap"
                    >
                      {{ getStatusText(borrowing.due_date) }}
                    </span>
                  </td>
                  <td class="px-2 py-2 text-center text-xs">
                    <button
                      @click="processReturn(borrowing)"
                      :disabled="isProcessing"
                      class="px-2 py-1 bg-green-500/10 hover:bg-green-500/20 text-green-600 dark:text-green-400 rounded transition-colors text-xs font-medium disabled:opacity-50"
                    >
                      {{ isProcessing ? '...' : '✓' }}
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- TAB 2: RIWAYAT PEMINJAMAN -->
      <div v-if="activeTab === 1" class="space-y-4">
        <!-- Table -->
        <div
          class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
        >
          <div class="overflow-auto">
            <table class="w-full table-fixed">
              <thead>
                <tr
                  class="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900"
                >
                  <th
                    class="w-10 px-2 py-2 text-left text-xs font-semibold text-gray-700 dark:text-gray-300"
                  >
                    No
                  </th>
                  <th
                    class="w-32 px-2 py-2 text-left text-xs font-semibold text-gray-700 dark:text-gray-300"
                  >
                    Member
                  </th>
                  <th
                    class="px-2 py-2 text-left text-xs font-semibold text-gray-700 dark:text-gray-300"
                  >
                    Email
                  </th>
                  <th
                    class="px-2 py-2 text-left text-xs font-semibold text-gray-700 dark:text-gray-300"
                  >
                    Judul Buku
                  </th>
                  <th
                    class="w-24 px-2 py-2 text-left text-xs font-semibold text-gray-700 dark:text-gray-300"
                  >
                    Pinjam
                  </th>
                  <th
                    class="w-24 px-2 py-2 text-left text-xs font-semibold text-gray-700 dark:text-gray-300"
                  >
                    Kembali
                  </th>
                  <th
                    class="w-28 px-2 py-2 text-left text-xs font-semibold text-gray-700 dark:text-gray-300"
                  >
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="isLoading && allBorrowings.length === 0">
                  <td colspan="7" class="px-6 py-8 text-center">
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

                <tr v-else-if="allBorrowings.length === 0">
                  <td colspan="7" class="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                    Belum ada riwayat peminjaman
                  </td>
                </tr>

                <tr
                  v-for="(borrowing, index) in allBorrowings"
                  :key="borrowing.id"
                  class="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors"
                >
                  <td class="px-2 py-2 text-xs text-gray-900 dark:text-gray-100">
                    {{ index + 1 }}
                  </td>
                  <td
                    class="px-2 py-2 text-xs font-medium text-gray-900 dark:text-gray-100 truncate"
                    :title="borrowing.user?.name"
                  >
                    {{ borrowing.user?.name || 'N/A' }}
                  </td>
                  <td
                    class="px-2 py-2 text-xs text-gray-600 dark:text-gray-400 truncate"
                    :title="borrowing.user?.email"
                  >
                    {{ borrowing.user?.email || 'N/A' }}
                  </td>
                  <td
                    class="px-2 py-2 text-xs text-gray-900 dark:text-gray-100 truncate"
                    :title="borrowing.book?.title"
                  >
                    {{ borrowing.book?.title || 'N/A' }}
                  </td>
                  <td class="px-2 py-2 text-xs text-gray-600 dark:text-gray-400 whitespace-nowrap">
                    {{ formatDateShort(borrowing.borrow_date) }}
                  </td>
                  <td class="px-2 py-2 text-xs text-gray-600 dark:text-gray-400 whitespace-nowrap">
                    {{ borrowing.return_date ? formatDateShort(borrowing.return_date) : '-' }}
                  </td>
                  <td class="px-2 py-2 text-xs">
                    <span
                      :class="getStatusBadgeClass(borrowing.status)"
                      class="px-2 py-1 rounded text-xs font-medium inline-block whitespace-nowrap"
                    >
                      {{ formatStatus(borrowing.status) }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <!-- Return Confirmation Modal -->
    <Transition name="modal">
      <div
        v-if="showReturnConfirmModal"
        class="fixed inset-0 z-[999999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
        @click="closeReturnConfirmModal"
      >
        <div
          class="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6 transform animate-scale-in"
          @click.stop
        >
          <!-- Info Icon -->
          <div class="flex justify-center mb-4">
            <div
              class="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center animate-pulse-slow"
            >
              <svg
                class="w-8 h-8 text-blue-600 dark:text-blue-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>

          <!-- Content -->
          <div class="text-center mb-6">
            <h3 class="text-xl font-bold text-gray-800 dark:text-white mb-2">
              Konfirmasi Pengembalian Buku
            </h3>
            <p class="text-gray-600 dark:text-gray-300 mb-4">
              Anda akan memproses pengembalian buku:
            </p>
            <div class="bg-blue-50 dark:bg-blue-900/30 rounded-lg p-3 mb-3">
              <p class="font-semibold text-gray-900 dark:text-white text-sm">
                {{ selectedBorrowing?.book?.title || 'N/A' }}
              </p>
              <p class="text-xs text-gray-600 dark:text-gray-400 mt-1">
                dari {{ selectedBorrowing?.user?.name || 'N/A' }}
              </p>
            </div>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              Apakah Anda yakin ingin melanjutkan?
            </p>
          </div>

          <!-- Buttons -->
          <div class="flex gap-3">
            <button
              @click="closeReturnConfirmModal"
              class="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              Batal
            </button>
            <button
              @click="confirmReturn"
              :disabled="isProcessing"
              class="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-green-500 rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ isProcessing ? 'Memproses...' : 'Konfirmasi' }}
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Return Success Modal -->
    <Transition name="modal">
      <div
        v-if="showReturnSuccessModal"
        class="fixed inset-0 z-[999999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      >
        <div
          class="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-8 transform"
        >
          <!-- Animated Success Icon -->
          <div class="flex justify-center mb-6">
            <div class="relative">
              <div
                class="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center animate-scale-in"
              >
                <svg
                  class="w-10 h-10 text-green-600 dark:text-green-400 animate-bounce"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <!-- Particles -->
              <div class="absolute inset-0">
                <div class="particle particle-1"></div>
                <div class="particle particle-2"></div>
                <div class="particle particle-3"></div>
                <div class="particle particle-4"></div>
              </div>
            </div>
          </div>

          <!-- Content -->
          <div class="text-center animate-fade-in-up">
            <h2 class="text-2xl font-bold text-gray-800 dark:text-white mb-3">
              Buku Berhasil Dikembalikan! ✅
            </h2>
            <p class="text-gray-600 dark:text-gray-300 mb-2 font-semibold">
              {{ successMessage }}
            </p>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              Data telah diperbarui di dalam sistem
            </p>

            <!-- Progress Bar -->
            <div
              class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-6 mb-3 overflow-hidden"
            >
              <div class="bg-green-500 h-full rounded-full animate-progress"></div>
            </div>

            <p class="text-xs text-gray-500 dark:text-gray-400">
              Ditutup dalam {{ returnCountdown }} detik...
            </p>
          </div>
        </div>
      </div>
    </Transition>
  </DynamicLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import DynamicLayout from '@/components/layouts/DynamicLayout.vue'

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

const tabs = ['Proses Return Buku', 'Riwayat Peminjaman']
const activeTab = ref(0)
const isLoading = ref(false)
const isProcessing = ref(false)
const error = ref<string | null>(null)

const allBorrowings = ref<Borrowing[]>([])

// Modal states
const showReturnConfirmModal = ref(false)
const showReturnSuccessModal = ref(false)
const selectedBorrowing = ref<Borrowing | null>(null)
const successMessage = ref('')
const returnCountdown = ref(3)
let returnCountdownInterval: ReturnType<typeof setInterval> | null = null

// Computed for active borrowings (status = 'dipinjam')
const activeBorrowings = computed(() => {
  return allBorrowings.value.filter((b) => b.status === 'dipinjam')
})

// Computed properties for stats
const onTimeCount = computed(() => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return activeBorrowings.value.filter((b) => {
    const dueDate = new Date(b.due_date)
    dueDate.setHours(0, 0, 0, 0)
    return dueDate >= today
  }).length
})

const overdueCount = computed(() => {
  return activeBorrowings.value.length - onTimeCount.value
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

const formatDateShort = (dateStr: string): string => {
  if (!dateStr) return 'N/A'
  const date = new Date(dateStr)
  const day = date.getDate()
  const month = date.getMonth() + 1
  const year = date.getFullYear().toString().slice(-2)
  return `${day}/${month}/${year}`
}

const formatStatus = (status: string): string => {
  const statusMap: Record<string, string> = {
    dipinjam: '📚 Pinjam',
    dikembalikan: '✅ Kembali',
    returned: '✅ Kembali',
  }
  return statusMap[status] || status
}

const getStatusText = (dueDate: string): string => {
  const dueDateObj = new Date(dueDate)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  dueDateObj.setHours(0, 0, 0, 0)

  const diff = dueDateObj.getTime() - today.getTime()
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))

  if (days < 0) {
    return `⚠️ -${Math.abs(days)}h`
  } else if (days <= 3) {
    return `⏰ ${days}h`
  } else {
    return `✅ ${days}h`
  }
}

const getStatusClass = (dueDate: string): string => {
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

const getStatusBadgeClass = (status: string): string => {
  const classMap: Record<string, string> = {
    dipinjam: 'bg-blue-500/10 text-blue-700 dark:text-blue-400',
    dikembalikan: 'bg-green-500/10 text-green-700 dark:text-green-400',
    returned: 'bg-green-500/10 text-green-700 dark:text-green-400',
  }
  return classMap[status] || 'bg-gray-500/10 text-gray-700 dark:text-gray-400'
}

// API calls
const fetchBorrowings = async () => {
  try {
    const token = localStorage.getItem('auth_token')
    if (!token) throw new Error('Token not found')

    const response = await fetch('http://localhost:8000/api/borrowings', {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    })

    if (response.ok) {
      const data = await response.json()
      allBorrowings.value = data.data || []
    }
  } catch (err) {
    console.error('Error fetching borrowings:', err)
    error.value = 'Gagal mengambil data peminjaman'
  }
}

const refreshData = async () => {
  isLoading.value = true
  error.value = null

  await fetchBorrowings()

  isLoading.value = false
}

const processReturn = async (borrowing: Borrowing) => {
  selectedBorrowing.value = borrowing
  showReturnConfirmModal.value = true
}

const closeReturnConfirmModal = () => {
  showReturnConfirmModal.value = false
  selectedBorrowing.value = null
}

const startReturnCountdown = () => {
  returnCountdown.value = 3
  returnCountdownInterval = setInterval(() => {
    returnCountdown.value--
    if (returnCountdown.value === 0) {
      if (returnCountdownInterval) clearInterval(returnCountdownInterval)
      showReturnSuccessModal.value = false
      refreshData()
    }
  }, 1000)
}

watch(showReturnSuccessModal, (newValue) => {
  if (newValue) {
    startReturnCountdown()
  }
})

const confirmReturn = async () => {
  if (!selectedBorrowing.value) return

  isProcessing.value = true

  try {
    const token = localStorage.getItem('auth_token')
    if (!token) throw new Error('Token not found')

    const response = await fetch(
      `http://localhost:8000/api/borrowings/${selectedBorrowing.value.id}/return`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      },
    )

    if (!response.ok) throw new Error('Gagal proses return')

    successMessage.value = `"${selectedBorrowing.value.book?.title}" berhasil dikembalikan oleh ${selectedBorrowing.value.user?.name}`

    // Close confirmation modal and show success modal
    closeReturnConfirmModal()
    showReturnSuccessModal.value = true
  } catch (err) {
    alert('Error: ' + (err instanceof Error ? err.message : 'Unknown error'))
  } finally {
    isProcessing.value = false
  }
}

onMounted(() => {
  refreshData()
})

onUnmounted(() => {
  if (returnCountdownInterval) clearInterval(returnCountdownInterval)
})
</script>

<style scoped>
/* Modal Transitions */
.modal-enter-active {
  animation: modal-fade-in 0.3s ease-out;
}

.modal-leave-active {
  animation: modal-fade-out 0.2s ease-in;
}

@keyframes modal-fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes modal-fade-out {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}

/* Scale In Animation */
@keyframes scale-in {
  0% {
    transform: scale(0.8);
    opacity: 0;
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

.animate-scale-in {
  animation: scale-in 0.4s ease-out;
}

/* Pulse Slow Animation */
@keyframes pulse-slow {
  0%,
  100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.05);
    opacity: 0.8;
  }
}

.animate-pulse-slow {
  animation: pulse-slow 2s ease-in-out infinite;
}

/* Fade In Up Animation */
@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in-up {
  animation: fade-in-up 0.5s ease-out 0.4s both;
}

/* Progress Bar Animation */
@keyframes progress {
  from {
    width: 0%;
  }
  to {
    width: 100%;
  }
}

.animate-progress {
  animation: progress 3s linear forwards;
}

/* Particles */
.particle {
  position: absolute;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  opacity: 0;
}

.particle-1 {
  background: #10b981;
  top: 10%;
  left: 10%;
  animation: particle-float 1.5s ease-out 0.5s;
}

.particle-2 {
  background: #3b82f6;
  top: 20%;
  right: 10%;
  animation: particle-float 1.3s ease-out 0.6s;
}

.particle-3 {
  background: #f59e0b;
  bottom: 20%;
  left: 15%;
  animation: particle-float 1.4s ease-out 0.7s;
}

.particle-4 {
  background: #8b5cf6;
  bottom: 10%;
  right: 15%;
  animation: particle-float 1.6s ease-out 0.5s;
}

@keyframes particle-float {
  0% {
    transform: translateY(0) scale(0);
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  100% {
    transform: translateY(-60px) scale(1);
    opacity: 0;
  }
}
</style>
