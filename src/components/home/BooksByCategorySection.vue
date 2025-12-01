<template>
  <div v-if="booksByCategory.length > 0" class="space-y-12">
    <div
      v-for="categoryBooks in booksByCategory.slice(0, 3)"
      :key="categoryBooks.categoryId"
      class="space-y-4"
    >
      <div class="flex items-center justify-between">
        <h2 class="text-3xl font-bold text-white">
          {{ categoryBooks.categoryName }}
        </h2>
        <a
          @click.prevent="
            showCategoryBooks(
              categoryBooks.categoryId,
              categoryBooks.categoryName,
              categoryBooks.books,
            )
          "
          href="#"
          class="text-red-600 hover:text-red-500 font-semibold cursor-pointer"
        >
          Lihat Semua →
        </a>
      </div>

      <!-- Books Grid with Horizontal Scroll -->
      <div class="overflow-x-auto scrollbar-hide">
        <div class="flex gap-4 pb-4 min-w-min">
          <div
            v-for="book in categoryBooks.books.slice(0, 6)"
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

    <!-- Modal Overlay for Category Books -->
    <transition
      enter-active-class="transition-opacity duration-300 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-300 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="isModalOpen"
        @click.self="closeModal"
        class="fixed inset-0 bg-black z-50 flex flex-col p-6 overflow-hidden"
      >
        <!-- Modal Header -->
        <div class="flex items-center justify-between mb-6 flex-shrink-0">
          <h2 class="text-3xl font-bold text-white">Buku {{ modalCategoryName }}</h2>
          <button @click="closeModal" class="text-gray-400 hover:text-white text-3xl leading-none">
            ×
          </button>
        </div>

        <!-- Books Grid -->
        <div
          class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 overflow-y-auto flex-1"
        >
          <div
            v-for="book in modalBooks"
            :key="book.id"
            @click="goToBookDetail(book.id)"
            class="cursor-pointer group"
          >
            <!-- Book Card -->
            <div class="relative mb-3 overflow-hidden rounded-lg shadow-lg">
              <img
                :src="book.cover_url || '/images/placeholder.jpg'"
                :alt="book.title"
                class="w-full h-48 object-cover group-hover:scale-110 transition duration-300"
              />
              <!-- Hover Overlay -->
              <div
                class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition duration-300 flex items-center justify-center"
              >
                <div class="text-center">
                  <p class="text-white font-bold text-sm">▶ Detail</p>
                </div>
              </div>
            </div>

            <!-- Book Info -->
            <div class="space-y-1">
              <h3
                class="text-white font-semibold line-clamp-2 text-sm group-hover:text-red-600 transition"
              >
                {{ book.title }}
              </h3>
              <p class="text-gray-400 text-xs">{{ book.author }}</p>
              <span
                class="text-xs font-bold block"
                :class="book.stock > 0 ? 'text-green-500' : 'text-red-500'"
              >
                {{ book.stock > 0 ? `${book.stock} tersedia` : 'Tidak tersedia' }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import type { Book } from '@/services/bookService'

interface CategoryBooks {
  categoryId: number
  categoryName: string
  books: Book[]
}

interface Props {
  booksByCategory: CategoryBooks[]
}

defineProps<Props>()

const router = useRouter()
const isModalOpen = ref(false)
const modalCategoryName = ref('')
const modalBooks = ref<Book[]>([])

const goToBookDetail = (bookId: number) => {
  isModalOpen.value = false
  router.push(`/book/${bookId}`)
}

const showCategoryBooks = (categoryId: number, categoryName: string, books: Book[]) => {
  modalCategoryName.value = categoryName
  modalBooks.value = books
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
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
