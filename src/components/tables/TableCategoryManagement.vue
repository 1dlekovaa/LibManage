<template>
  <div
    class="overflow-x-auto bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
  >
    <table class="w-full">
      <thead>
        <tr class="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
          <th class="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
            Nomor
          </th>
          <th class="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
            Nama Kategori
          </th>
          <th class="px-6 py-3 text-right text-sm font-semibold text-gray-900 dark:text-white">
            Aksi
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="categories.length === 0" class="border-b border-gray-200 dark:border-gray-700">
          <td colspan="3" class="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
            Tidak ada kategori
          </td>
        </tr>
        <tr
          v-for="category in categories"
          :key="category.id"
          class="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors"
        >
          <td class="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">
            {{ category.id }}
          </td>
          <td class="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">
            {{ category.name }}
          </td>
          <td class="px-6 py-4 text-right text-sm">
            <div class="flex items-center justify-end gap-2">
              <button
                @click="$emit('edit', category)"
                class="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200 dark:bg-blue-500/20 dark:text-blue-400 dark:hover:bg-blue-500/30 transition-colors"
                title="Edit"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
              </button>
              <button
                @click="$emit('delete', category)"
                class="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 dark:bg-red-500/20 dark:text-red-400 dark:hover:bg-red-500/30 transition-colors"
                title="Delete"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'
import type { Category } from '@/services/categoryService'

interface Props {
  categories: Category[]
}

defineProps<Props>()
defineEmits<{
  edit: [category: Category]
  delete: [category: Category]
}>()
</script>

<style scoped>
/* Table styles */
</style>
