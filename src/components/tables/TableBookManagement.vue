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
            Cover
          </th>
          <th class="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
            Judul
          </th>
          <th class="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
            Penulis
          </th>
          <th class="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
            Kategori
          </th>
          <th class="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
            Stok
          </th>
          <th class="px-6 py-3 text-right text-sm font-semibold text-gray-900 dark:text-white">
            Aksi
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="books.length === 0" class="border-b border-gray-200 dark:border-gray-700">
          <td colspan="7" class="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
            Tidak ada buku
          </td>
        </tr>
        <tr
          v-for="(book, index) in books"
          :key="book.id"
          class="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors h-20"
        >
          <td class="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">
            {{ index + 1 }}
          </td>
          <td class="px-6 py-4 text-sm">
            <div
              v-if="getCoverUrl(book)"
              class="w-10 h-16 bg-gray-200 dark:bg-gray-700 rounded overflow-hidden flex items-center justify-center flex-shrink-0"
              :title="getCoverUrl(book)"
            >
              <img
                :src="getCoverUrl(book)"
                :alt="book.title"
                class="w-full h-full object-cover"
                loading="lazy"
                @error="
                  (e) => {
                    const target = e.target as HTMLImageElement
                    if (target) {
                      console.error('Image failed to load:', target.src)
                      target.style.display = 'none'
                    }
                  }
                "
                @load="
                  (e) => {
                    console.log('Image loaded successfully:', (e.target as HTMLImageElement).src)
                  }
                "
              />
            </div>
            <div
              v-else
              class="w-10 h-16 bg-gray-300 dark:bg-gray-600 rounded flex items-center justify-center flex-shrink-0"
              title="No cover URL"
            >
              <svg
                class="w-6 h-6 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 6.253v13m0-13C6.5 6.253 2 10.998 2 17s4.5 10.747 10 10.747c5.5 0 10-4.998 10-10.747S17.5 6.253 12 6.253z"
                />
              </svg>
            </div>
          </td>
          <td class="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">
            <div
              class="font-medium cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors truncate"
              @click="navigateToDetail(book)"
              :title="book.title"
            >
              {{ book.title }}
            </div>
          </td>
          <td class="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">
            {{ book.author }}
          </td>
          <td class="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">
            <span
              class="px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-500/20 dark:text-blue-300 rounded text-xs font-medium inline-block truncate"
              :title="book.category?.name || '-'"
            >
              {{ book.category?.name || '-' }}
            </span>
          </td>
          <td class="px-6 py-4 text-sm">
            <div
              :class="[
                'px-2 py-1 rounded text-xs font-medium inline-block whitespace-nowrap',
                {
                  'bg-green-100 text-green-800 dark:bg-green-500/20 dark:text-green-300':
                    book.stock > 0,
                  'bg-red-100 text-red-800 dark:bg-red-500/20 dark:text-red-300': book.stock === 0,
                },
              ]"
            >
              {{ book.stock }} Buku
            </div>
          </td>
          <td class="px-6 py-4 text-right text-sm">
            <div class="flex items-center justify-end gap-2">
              <button
                @click="$emit('edit', book)"
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
                @click="$emit('delete', book)"
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
import { defineProps, defineEmits, computed } from 'vue'
import { useRouter } from 'vue-router'
import type { Book } from '@/services/bookService'

interface Props {
  books: Book[]
}

const props = defineProps<Props>()
const router = useRouter()

defineEmits<{
  edit: [book: Book]
  delete: [book: Book]
}>()

// Helper untuk mendapatkan URL cover yang benar
const getCoverUrl = (book: Book): string => {
  // Jika ada cover_url dan tidak double path, gunakan langsung
  if (book.cover_url && !book.cover_url.includes('/books/books/')) {
    console.log(`Using cover_url: ${book.cover_url}`)
    return book.cover_url
  }

  // Jika cover ada, construct URL dari scratch dengan encoding unicode
  if (book.cover) {
    let coverPath = book.cover
    // Hapus prefix 'books/' jika double
    coverPath = coverPath.replace(/^books\//, '')
    // Encode unicode characters
    const encodedPath = encodeURI(coverPath)
    const url = `http://localhost:8000/storage/books/${encodedPath}`
    console.log(`Book: ${book.title}, constructed URL: ${url}, original cover: ${book.cover}`)
    return url
  }

  console.log(`Book: ${book.title}, no cover`)
  return ''
}

const navigateToDetail = (book: Book) => {
  router.push(`/books/${book.id}`)
}

const truncateSinopsis = (sinopsis: string | undefined): string => {
  if (!sinopsis) return '-'

  const words = sinopsis.trim().split(/\s+/)
  if (words.length <= 3) {
    return sinopsis
  }

  return words.slice(0, 3).join(' ') + '...'
}
</script>

<style scoped>
/* Table styles */
</style>
