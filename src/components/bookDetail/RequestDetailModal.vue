<template>
  <Teleport to="body">
    <Transition name="modal-fade">
      <div
        v-if="request"
        class="fixed inset-0 bg-black/50 flex items-center justify-center z-99999 p-4"
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
              <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Request Details</h2>
              <button
                @click="$emit('close')"
                class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                ✕
              </button>
            </div>

            <!-- Content -->
            <div class="p-6 space-y-6">
              <!-- Member Info -->
              <div class="border-b border-gray-200 dark:border-gray-700 pb-6">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Member Information
                </h3>
                <div class="space-y-3">
                  <DetailRow label="Name" :value="request.user?.name || 'N/A'" />
                  <DetailRow label="Email" :value="request.user?.email || 'N/A'" />
                </div>
              </div>

              <!-- Book Info -->
              <div class="border-b border-gray-200 dark:border-gray-700 pb-6">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Book Information
                </h3>
                <div class="space-y-3">
                  <DetailRow label="Title" :value="request.book?.title || 'N/A'" />
                  <DetailRow label="Author" :value="request.book?.author || 'N/A'" />
                </div>
              </div>

              <!-- Request Info -->
              <div class="border-b border-gray-200 dark:border-gray-700 pb-6">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Request Information
                </h3>
                <div class="space-y-3">
                  <DetailRow label="Request Date" :value="formatDate(request.request_date)" />
                  <DetailRow label="Due Date" :value="formatDate(request.due_date)" />
                  <DetailRow label="Status">
                    <span
                      :class="getStatusClass(request.status)"
                      class="px-3 py-1 rounded-full text-sm font-semibold inline-block"
                    >
                      {{ formatStatus(request.status) }}
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
                      formatDateTime(request.created_at)
                    }}</span>
                  </div>
                  <div class="flex gap-3">
                    <span class="text-gray-600 dark:text-gray-400 min-w-[120px]">Updated:</span>
                    <span class="text-gray-900 dark:text-gray-100">{{
                      formatDateTime(request.updated_at)
                    }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import DetailRow from '@/components/common/DetailRow.vue'

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

interface Props {
  request: BorrowRequest | null
}

defineProps<Props>()
defineEmits<{
  (e: 'close'): void
}>()

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
