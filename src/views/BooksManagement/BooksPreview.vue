<template>
  <div class="min-h-screen bg-gray-950">
    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center min-h-screen">
      <div class="text-center">
        <div class="inline-block mb-4">
          <div
            class="w-12 h-12 border-4 border-gray-700 border-t-blue-500 rounded-full animate-spin"
          ></div>
        </div>
        <p class="text-gray-400">Memuat detail buku...</p>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="flex items-center justify-center min-h-screen">
      <div class="text-center max-w-md">
        <div class="mb-4 text-red-500">
          <svg class="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 9v2m0 4v2m0 4v2M6.343 3.665c.886-.887 2.318-.887 3.203 0l7.778 7.778c.886.886.886 2.318 0 3.203l-7.778 7.778c-.885.886-2.317.886-3.203 0L.565 13.85c-.886-.886-.886-2.318 0-3.203L6.343 3.665z"
            />
          </svg>
        </div>
        <h2 class="text-2xl font-bold text-white mb-2">Terjadi Kesalahan</h2>
        <p class="text-gray-400 mb-6">{{ error }}</p>
        <button
          @click="goHome"
          class="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
        >
          Kembali ke Beranda
        </button>
      </div>
    </div>

    <!-- Content -->
    <div v-else-if="book">
      <!-- Banner Section -->
      <BookDetailBanner :book="book" />

      <!-- Details Section -->
      <BookDetailsSection :book="book" />

      <!-- Similar Books Section -->
      <SimilarBooksSection :current-book="book" :all-books="allBooks" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { getBookById, getAllBooks, type Book } from '@/services/bookService'
import BookDetailBanner from '@/components/bookDetail/BookDetailBanner.vue'
import BookDetailsSection from '@/components/bookDetail/BookDetailsSection.vue'
import SimilarBooksSection from '@/components/bookDetail/SimilarBooksSection.vue'

const router = useRouter()
const route = useRoute()

const book = ref<Book | null>(null)
const allBooks = ref<Book[]>([])
const loading = ref(true)
const error = ref<string | null>(null)

const goHome = () => {
  router.push('/home')
}

const loadBookDetail = async (bookId: number) => {
  loading.value = true
  error.value = null

  try {
    if (!bookId) {
      error.value = 'ID buku tidak valid'
      return
    }

    // Fetch book detail and all books in parallel
    const [bookData, booksData] = await Promise.all([getBookById(bookId), getAllBooks()])

    book.value = bookData
    allBooks.value = booksData
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Gagal memuat detail buku'
    console.error('Error loading book detail:', err)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  const bookId = Number(route.params.id)
  loadBookDetail(bookId)
})

// Watch for route parameter changes
watch(
  () => route.params.id,
  (newId) => {
    const bookId = Number(newId)
    loadBookDetail(bookId)
  },
)
</script>
