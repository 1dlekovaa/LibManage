<template>
  <div v-if="books.length > 0" class="space-y-4">
    <div class="flex items-center justify-between">
      <h2 class="text-3xl font-bold text-white">Buku Populer</h2>
      <a href="#" class="text-red-600 hover:text-red-500 font-semibold"> Lihat Semua → </a>
    </div>

    <!-- Books Grid with Horizontal Scroll -->
    <div class="overflow-x-auto scrollbar-hide">
      <div class="flex gap-4 pb-4 min-w-min">
        <div
          v-for="book in books.slice(0, 6)"
          :key="book.id"
          @click="goToBookDetail(book.id)"
          class="flex-shrink-0 w-48 cursor-pointer group"
        >
          <!-- Book Card -->
          <div class="relative mb-3 overflow-hidden rounded-lg shadow-lg">
            <img
              :src="book.cover_url || '/images/placeholder.jpg'"
              :alt="book.title"
              class="w-full h-72 object-cover group-hover:scale-110 transition duration-300"
            />
            <!-- Hover Overlay -->
            <div
              class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition duration-300 flex items-center justify-center"
            >
              <div class="text-center">
                <p class="text-white font-bold mb-2">▶ Lihat Detail</p>
              </div>
            </div>
          </div>

          <!-- Book Info -->
          <div class="space-y-2">
            <h3 class="text-white font-semibold line-clamp-2 group-hover:text-red-600 transition">
              {{ book.title }}
            </h3>
            <p class="text-gray-400 text-sm">{{ book.author }}</p>
            <div class="flex items-center justify-between">
              <span class="text-xs text-gray-500">{{ book.category?.name }}</span>
              <span
                class="text-xs font-bold"
                :class="book.stock > 0 ? 'text-green-500' : 'text-red-500'"
              >
                {{ book.stock > 0 ? `${book.stock} tersedia` : 'Tidak tersedia' }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import type { Book } from '@/services/bookService'

interface Props {
  books: Book[]
}

defineProps<Props>()

const router = useRouter()

const goToBookDetail = (bookId: number) => {
  router.push(`/books/${bookId}`)
}
</script>

<style scoped>
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
</style>
