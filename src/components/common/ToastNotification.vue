<template>
  <TransitionGroup
    tag="div"
    class="fixed top-4 right-4 z-99999 space-y-2 pointer-events-none"
    enter-active-class="transition duration-500 ease-out"
    enter-from-class="opacity-0 translate-x-full scale-95"
    enter-to-class="opacity-100 translate-x-0 scale-100"
    leave-active-class="transition duration-400 ease-in"
    leave-from-class="opacity-100 translate-x-0 scale-100"
    leave-to-class="opacity-0 translate-x-full scale-95"
    move-class="transition duration-300"
  >
    <div
      v-for="toast in toasts"
      :key="toast.id"
      :class="[
        'p-4 rounded-lg shadow-lg flex items-start gap-3 max-w-sm pointer-events-auto',
        {
          'bg-green-50 border border-green-200 dark:bg-green-500/10 dark:border-green-500/30':
            toast.type === 'success',
          'bg-red-50 border border-red-200 dark:bg-red-500/10 dark:border-red-500/30':
            toast.type === 'error',
          'bg-blue-50 border border-blue-200 dark:bg-blue-500/10 dark:border-blue-500/30':
            toast.type === 'info',
          'bg-yellow-50 border border-yellow-200 dark:bg-yellow-500/10 dark:border-yellow-500/30':
            toast.type === 'warning',
        },
      ]"
    >
      <!-- Icon -->
      <div class="flex-shrink-0 mt-0.5">
        <svg
          v-if="toast.type === 'success'"
          class="w-5 h-5 text-green-600 dark:text-green-500"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fill-rule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
            clip-rule="evenodd"
          />
        </svg>
        <svg
          v-else-if="toast.type === 'error'"
          class="w-5 h-5 text-red-600 dark:text-red-500"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fill-rule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
            clip-rule="evenodd"
          />
        </svg>
        <svg
          v-else-if="toast.type === 'info'"
          class="w-5 h-5 text-blue-600 dark:text-blue-500"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fill-rule="evenodd"
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
            clip-rule="evenodd"
          />
        </svg>
        <svg
          v-else
          class="w-5 h-5 text-yellow-600 dark:text-yellow-500"
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

      <!-- Message -->
      <div class="flex-1">
        <p
          :class="[
            'text-sm font-medium',
            {
              'text-green-800 dark:text-green-200': toast.type === 'success',
              'text-red-800 dark:text-red-200': toast.type === 'error',
              'text-blue-800 dark:text-blue-200': toast.type === 'info',
              'text-yellow-800 dark:text-yellow-200': toast.type === 'warning',
            },
          ]"
        >
          {{ toast.message }}
        </p>
      </div>

      <!-- Close Button -->
      <button
        @click="removeToast(toast.id)"
        :class="[
          'flex-shrink-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300',
          {
            'text-green-400 hover:text-green-600 dark:hover:text-green-400':
              toast.type === 'success',
            'text-red-400 hover:text-red-600 dark:hover:text-red-400': toast.type === 'error',
            'text-blue-400 hover:text-blue-600 dark:hover:text-blue-400': toast.type === 'info',
            'text-yellow-400 hover:text-yellow-600 dark:hover:text-yellow-400':
              toast.type === 'warning',
          },
        ]"
      >
        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path
            fill-rule="evenodd"
            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
            clip-rule="evenodd"
          />
        </svg>
      </button>
    </div>
  </TransitionGroup>
</template>

<script setup lang="ts">
import { useToast } from '@/composables/useToast'

const { toasts, removeToast } = useToast()
</script>
