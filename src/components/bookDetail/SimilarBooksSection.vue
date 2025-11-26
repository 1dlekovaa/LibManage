<template>
  <div class="px-4 md:px-8 py-12 bg-gray-950">
    <div class="container mx-auto max-w-7xl">
      <!-- Section Title -->
      <div class="mb-8">
        <h2 class="text-3xl font-bold text-white">Buku Sejenis</h2>
        <p class="text-gray-400 mt-2">
          Buku lainnya dalam kategori {{ currentBook.category?.name }}
        </p>
      </div>

      <!-- Books Grid -->
      <div
        v-if="similarBooks.length > 0"
        class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
      >
        <div
          v-for="book in similarBooks"
          :key="book.id"
          class="group cursor-pointer transform transition-all hover:scale-105"
          @click="navigateToBook(book.id)"
        >
          <!-- Book Card -->
          <div class="mb-4 overflow-hidden rounded-lg">
            <img
              :src="book.cover_url || '/images/placeholder.jpg'"
              :alt="book.title"
              class="w-full aspect-[4/3] object-cover group-hover:scale-110 transition-transform duration-300"
            />
          </div>

          <!-- Book Info -->
          <h3
            class="font-bold text-white mb-2 line-clamp-2 group-hover:text-blue-400 transition-colors"
          >
            {{ book.title }}
          </h3>
          <p class="text-sm text-gray-400 mb-3 line-clamp-1">{{ book.author }}</p>

          <!-- Stock Badge -->
          <div
            class="inline-block px-3 py-1 rounded-full text-xs font-medium"
            :class="
              book.stock > 0 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
            "
          >
            {{ book.stock > 0 ? 'Tersedia' : 'Habis' }}
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="flex items-center justify-center py-12">
        <div class="text-center">
          <p class="text-gray-400 text-lg">Tidak ada buku lain dalam kategori ini</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import type { Book } from '@/services/bookService'

interface Props {
  currentBook: Book
  allBooks: Book[]
}

const props = defineProps<Props>()
const router = useRouter()

const similarBooks = computed(() => {
  return props.allBooks.filter(
    (book) =>
      book.category_id === props.currentBook.category_id && book.id !== props.currentBook.id,
  )
})

const navigateToBook = (bookId: number) => {
  router.push(`/books/${bookId}`)
}
</script>
