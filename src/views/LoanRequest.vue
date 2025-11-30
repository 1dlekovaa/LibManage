<template>
  <AdminLayout>
    <div class="space-y-6 p-6">
      <!-- Header -->
      <div class="flex justify-between items-center">
        <div>
          <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Loan Requests</h1>
          <p class="text-gray-600 dark:text-gray-400 mt-1">
            Manage all borrow requests from members
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

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard title="Total Requests" :value="totalRequests" :icon="'📋'" color="bg-blue-500/10">
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
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </StatCard>
        <StatCard title="Pending" :value="pendingCount" :icon="'⏳'" color="bg-yellow-500/10">
          <svg
            class="w-8 h-8 text-yellow-600 dark:text-yellow-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </StatCard>
        <StatCard title="Approved" :value="approvedCount" :icon="'✓'" color="bg-green-500/10">
          <svg
            class="w-8 h-8 text-green-600 dark:text-green-400"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fill-rule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clip-rule="evenodd"
            />
          </svg>
        </StatCard>
        <StatCard title="Rejected" :value="rejectedCount" :icon="'✕'" color="bg-red-500/10">
          <svg
            class="w-8 h-8 text-red-600 dark:text-red-400"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fill-rule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clip-rule="evenodd"
            />
          </svg>
        </StatCard>
      </div>

      <!-- Filters -->
      <div class="flex gap-3 flex-wrap">
        <button
          v-for="status in ['all', 'pending', 'approved', 'rejected']"
          :key="status"
          @click="selectedStatus = status"
          :class="
            selectedStatus === status
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 hover:bg-gray-300 dark:hover:bg-gray-600'
          "
          class="px-4 py-2 rounded-lg font-medium transition-colors text-sm"
        >
          {{ status === 'all' ? 'All' : formatStatus(status) }}
        </button>
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
                  Member Name
                </th>
                <th
                  class="px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300"
                >
                  Book Title
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
              <tr v-if="isLoading && filteredRequests.length === 0">
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
              <tr v-else-if="filteredRequests.length === 0">
                <td colspan="6" class="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                  <p class="text-lg">Belum ada request</p>
                </td>
              </tr>

              <!-- Data Rows -->
              <tr
                v-for="request in filteredRequests"
                :key="request.id"
                class="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors"
              >
                <td class="px-6 py-4 text-sm text-gray-900 dark:text-gray-100 font-medium">
                  {{ request.user?.name || 'N/A' }}
                </td>
                <td class="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                  {{ request.book?.title || 'N/A' }}
                </td>
                <td class="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                  {{ formatDate(request.request_date) }}
                </td>
                <td class="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                  {{ formatDate(request.due_date) }}
                </td>
                <td class="px-6 py-4 text-sm">
                  <span
                    :class="getStatusClass(request.status)"
                    class="px-3 py-1 rounded-full text-xs font-semibold inline-block"
                  >
                    {{ formatStatus(request.status) }}
                  </span>
                </td>
                <td class="px-6 py-4 text-right text-sm">
                  <div class="flex justify-end gap-2">
                    <button
                      v-if="request.status === 'pending'"
                      @click="openApproveModal(request)"
                      class="px-3 py-1 bg-green-500/10 hover:bg-green-500/20 text-green-600 dark:text-green-400 rounded-lg transition-colors text-xs font-medium"
                    >
                      Approve
                    </button>
                    <button
                      v-if="request.status === 'pending'"
                      @click="openRejectModal(request)"
                      class="px-3 py-1 bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 rounded-lg transition-colors text-xs font-medium"
                    >
                      Reject
                    </button>
                    <button
                      @click="viewDetail(request)"
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
    <RequestDetailModal
      v-if="selectedRequest"
      :request="selectedRequest"
      @close="selectedRequest = null"
    />

    <!-- Approve Confirmation Modal -->
    <Transition name="modal-fade">
      <div
        v-if="showApproveConfirm"
        class="fixed inset-0 bg-black/50 flex items-center justify-center z-99999 p-4"
        @click.self="showApproveConfirm = false"
      >
        <Transition name="modal-slide">
          <div
            class="bg-white dark:bg-gray-800 rounded-lg shadow-2xl max-w-md w-full p-6"
            @click.stop
          >
            <!-- Icon -->
            <div class="flex justify-center mb-4">
              <div
                class="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center border border-green-500/30"
              >
                <svg
                  class="w-8 h-8 text-green-600 dark:text-green-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fill-rule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clip-rule="evenodd"
                  />
                </svg>
              </div>
            </div>

            <!-- Content -->
            <h3 class="text-xl font-bold text-gray-900 dark:text-white text-center mb-2">
              Approve Request?
            </h3>
            <p class="text-gray-600 dark:text-gray-400 text-center mb-6">
              {{ approveRequest?.user?.name }} akan meminjam {{ approveRequest?.book?.title }}
            </p>

            <!-- Buttons -->
            <div class="flex gap-3">
              <button
                @click="showApproveConfirm = false"
                class="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-medium rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                @click="confirmApprove"
                :disabled="isProcessing"
                class="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <span v-if="isProcessing" class="animate-spin">⟳</span>
                {{ isProcessing ? 'Approving...' : 'Yes, Approve' }}
              </button>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>

    <!-- Reject Confirmation Modal -->
    <Transition name="modal-fade">
      <div
        v-if="showRejectConfirm"
        class="fixed inset-0 bg-black/50 flex items-center justify-center z-99999 p-4"
        @click.self="showRejectConfirm = false"
      >
        <Transition name="modal-slide">
          <div
            class="bg-white dark:bg-gray-800 rounded-lg shadow-2xl max-w-md w-full p-6"
            @click.stop
          >
            <!-- Icon -->
            <div class="flex justify-center mb-4">
              <div
                class="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center border border-red-500/30"
              >
                <svg
                  class="w-8 h-8 text-red-600 dark:text-red-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fill-rule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clip-rule="evenodd"
                  />
                </svg>
              </div>
            </div>

            <!-- Content -->
            <h3 class="text-xl font-bold text-gray-900 dark:text-white text-center mb-2">
              Reject Request?
            </h3>
            <p class="text-gray-600 dark:text-gray-400 text-center mb-6">
              Menolak permintaan peminjaman dari {{ rejectRequest?.user?.name }}
            </p>

            <!-- Buttons -->
            <div class="flex gap-3">
              <button
                @click="showRejectConfirm = false"
                class="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-medium rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                @click="confirmReject"
                :disabled="isProcessing"
                class="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <span v-if="isProcessing" class="animate-spin">⟳</span>
                {{ isProcessing ? 'Rejecting...' : 'Yes, Reject' }}
              </button>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import AdminLayout from '@/components/layouts/admin-layout/AdminLayout.vue'
import StatCard from '@/components/common/StatCard.vue'
import RequestDetailModal from '@/components/bookDetail/RequestDetailModal.vue'

interface User {
  id: number
  name: string
  email: string
}

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
  user?: User
  book?: Book
  request_date: string
  due_date: string
  status: 'pending' | 'approved' | 'rejected' | 'returned'
  created_at: string
  updated_at: string
}

const requests = ref<BorrowRequest[]>([])
const isLoading = ref(false)
const isProcessing = ref(false)
const error = ref<string | null>(null)
const selectedStatus = ref('pending')
const selectedRequest = ref<BorrowRequest | null>(null)
const showApproveConfirm = ref(false)
const showRejectConfirm = ref(false)
const approveRequest = ref<BorrowRequest | null>(null)
const rejectRequest = ref<BorrowRequest | null>(null)

const filteredRequests = computed(() => {
  if (selectedStatus.value === 'all') {
    return requests.value
  }
  return requests.value.filter((r) => r.status === selectedStatus.value)
})

const totalRequests = computed(() => requests.value.length)
const pendingCount = computed(() => requests.value.filter((r) => r.status === 'pending').length)
const approvedCount = computed(() => requests.value.filter((r) => r.status === 'approved').length)
const rejectedCount = computed(() => requests.value.filter((r) => r.status === 'rejected').length)

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

// Fetch requests
const fetchRequests = async () => {
  isLoading.value = true
  error.value = null

  try {
    const token = localStorage.getItem('auth_token')
    if (!token) {
      throw new Error('You must login first')
    }

    const response = await fetch('http://localhost:8000/api/borrow-requests', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error('Failed to fetch requests')
    }

    const data = await response.json()
    requests.value = data.data || []
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'An error occurred'
    requests.value = []
  } finally {
    isLoading.value = false
  }
}

// Refresh data
const refreshData = () => {
  fetchRequests()
}

// View detail
const viewDetail = (request: BorrowRequest) => {
  selectedRequest.value = request
}

// Open approve modal
const openApproveModal = (request: BorrowRequest) => {
  approveRequest.value = request
  showApproveConfirm.value = true
}

// Open reject modal
const openRejectModal = (request: BorrowRequest) => {
  rejectRequest.value = request
  showRejectConfirm.value = true
}

// Confirm approve
const confirmApprove = async () => {
  if (!approveRequest.value) return

  isProcessing.value = true

  try {
    const token = localStorage.getItem('auth_token')
    if (!token) {
      throw new Error('You must login first')
    }

    const response = await fetch(
      `http://localhost:8000/api/borrow-requests/${approveRequest.value.id}/approve`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      },
    )

    if (!response.ok) {
      throw new Error('Failed to approve request')
    }

    // Close modal and refresh
    showApproveConfirm.value = false
    await fetchRequests()
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'An error occurred'
    isProcessing.value = false
  }
}

// Confirm reject
const confirmReject = async () => {
  if (!rejectRequest.value) return

  isProcessing.value = true

  try {
    const token = localStorage.getItem('auth_token')
    if (!token) {
      throw new Error('You must login first')
    }

    const response = await fetch(
      `http://localhost:8000/api/borrow-requests/${rejectRequest.value.id}/reject`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      },
    )

    if (!response.ok) {
      throw new Error('Failed to reject request')
    }

    // Close modal and refresh
    showRejectConfirm.value = false
    await fetchRequests()
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'An error occurred'
    isProcessing.value = false
  }
}

// Load data on mount
onMounted(() => {
  fetchRequests()
})
</script>

<style scoped>
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-slide-enter-active,
.modal-slide-leave-active {
  transition: all 0.3s ease;
}

.modal-slide-enter-from {
  transform: scale(0.95) translateY(-10px);
  opacity: 0;
}

.modal-slide-leave-to {
  transform: scale(0.95) translateY(10px);
  opacity: 0;
}
</style>
