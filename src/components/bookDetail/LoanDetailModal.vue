<template>
  <Teleport to="body">
    <!-- Main Detail Modal -->
    <Transition name="modal-fade">
      <div
        v-if="loan"
        class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
        @click.self="$emit('close')"
      >
        <Transition name="modal-slide">
          <div
            class="bg-white dark:bg-gray-800 rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto detail-scrollbar"
          >
            <!-- Header -->
            <div
              class="sticky top-0 z-10 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex justify-between items-center"
            >
              <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Loan Details</h2>
              <button
                @click="$emit('close')"
                class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                ✕
              </button>
            </div>

            <!-- Content -->
            <div class="p-6 space-y-6">
              <!-- Book Info -->
              <div class="border-b border-gray-200 dark:border-gray-700 pb-6">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Book Information
                </h3>
                <div class="space-y-3">
                  <DetailRow label="Title" :value="loan.book?.title || 'N/A'" />
                  <DetailRow label="Author" :value="loan.book?.author || 'N/A'" />
                </div>
              </div>

              <!-- Loan Info -->
              <div class="border-b border-gray-200 dark:border-gray-700 pb-6">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Loan Information
                </h3>
                <div class="space-y-3">
                  <DetailRow label="Request Date" :value="formatDate(loan.request_date)" />
                  <DetailRow label="Due Date" :value="formatDate(loan.due_date)" />
                  <DetailRow label="Status">
                    <span
                      :class="getStatusClass(loan.status)"
                      class="px-3 py-1 rounded-full text-sm font-semibold inline-block"
                    >
                      {{ formatStatus(loan.status) }}
                    </span>
                  </DetailRow>
                </div>
              </div>

              <!-- Timeline -->
              <div>
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Timeline</h3>
                <div class="space-y-2 text-sm">
                  <div class="flex gap-3">
                    <span class="text-gray-600 dark:text-gray-400 min-w-[120px]">Created:</span>
                    <span class="text-gray-900 dark:text-gray-100">{{
                      formatDateTime(loan.created_at)
                    }}</span>
                  </div>
                  <div class="flex gap-3">
                    <span class="text-gray-600 dark:text-gray-400 min-w-[120px]">Updated:</span>
                    <span class="text-gray-900 dark:text-gray-100">{{
                      formatDateTime(loan.updated_at)
                    }}</span>
                  </div>
                </div>
              </div>

              <!-- Action Buttons -->
              <div
                v-if="loan.status === 'pending'"
                class="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700"
              >
                <button
                  @click="showCancelConfirm = true"
                  class="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors"
                >
                  Cancel Loan
                </button>
              </div>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>

    <!-- Cancel Confirmation Modal -->
    <Transition name="modal-fade">
      <div
        v-if="showCancelConfirm"
        class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
        @click.self="showCancelConfirm = false"
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
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clip-rule="evenodd"
                  />
                </svg>
              </div>
            </div>

            <!-- Content -->
            <h3 class="text-xl font-bold text-gray-900 dark:text-white text-center mb-2">
              Cancel Loan?
            </h3>
            <p class="text-gray-600 dark:text-gray-400 text-center mb-6">
              Are you sure you want to cancel this loan request? This action cannot be undone.
            </p>

            <!-- Buttons -->
            <div class="flex gap-3">
              <button
                @click="showCancelConfirm = false"
                class="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-medium rounded-lg transition-colors"
              >
                Keep Loan
              </button>
              <button
                @click="confirmCancel"
                :disabled="isCancelling"
                class="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <span v-if="isCancelling" class="animate-spin">⟳</span>
                {{ isCancelling ? 'Cancelling...' : 'Yes, Cancel' }}
              </button>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import DetailRow from '@/components/common/DetailRow.vue'

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

interface Props {
  loan: BorrowRequest | null
}

const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'close'): void
}>()

const showCancelConfirm = ref(false)
const isCancelling = ref(false)

// Format date
const formatDate = (dateStr: string): string => {
  if (!dateStr) return 'N/A'
  const date = new Date(dateStr)
  return date.toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

// Format date time
const formatDateTime = (dateStr: string): string => {
  if (!dateStr) return 'N/A'
  const date = new Date(dateStr)
  return date.toLocaleString('id-ID', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
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

// Confirm cancel
const confirmCancel = async () => {
  if (!props.loan) return

  isCancelling.value = true

  try {
    const token = localStorage.getItem('auth_token')
    if (!token) {
      throw new Error('You must login first')
    }

    const response = await fetch(`http://localhost:8000/api/borrow-requests/${props.loan.id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error('Failed to cancel loan')
    }

    // Close modals and refresh
    showCancelConfirm.value = false
    emit('close')
    window.location.reload()
  } catch (err) {
    alert(err instanceof Error ? err.message : 'An error occurred')
    isCancelling.value = false
  }
}
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

/* Custom dark scrollbar for detail modal */
.detail-scrollbar::-webkit-scrollbar {
  width: 8px;
}

.detail-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}

.detail-scrollbar::-webkit-scrollbar-thumb {
  background: rgb(55, 65, 81);
  border-radius: 4px;
}

.detail-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgb(75, 85, 99);
}
</style>
