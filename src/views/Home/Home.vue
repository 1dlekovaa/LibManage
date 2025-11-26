<template>
  <div class="min-h-screen bg-gray-950">
    <!-- Hero Section / Featured Book with Slideshow -->
    <HeroBanner :books="books" />

    <!-- Book Sections -->
    <div class="px-4 md:px-8 py-12 space-y-12">
      <!-- Popular Books Section -->
      <PopularBooksSection :books="books" />

      <!-- Books by Category Section -->
      <BooksByCategorySection :books-by-category="booksByCategory" />

      <!-- Loading State -->
      <div v-if="loading" class="flex items-center justify-center py-12">
        <div class="text-gray-400">Memuat buku-buku...</div>
      </div>

      <!-- Empty State -->
      <div v-if="!loading && books.length === 0" class="flex items-center justify-center py-12">
        <div class="text-center">
          <p class="text-gray-400 text-lg">Belum ada buku tersedia</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { getAllBooks, type Book } from '@/services/bookService'
import HeroBanner from '@/components/home/HeroBanner.vue'
import PopularBooksSection from '@/components/home/PopularBooksSection.vue'
import BooksByCategorySection from '@/components/home/BooksByCategorySection.vue'

const books = ref<Book[]>([])
const loading = ref(true)

const booksByCategory = computed(() => {
  const categoryMap = new Map<number, { categoryId: number; categoryName: string; books: Book[] }>()

  books.value.forEach((book) => {
    const categoryId = book.category_id
    const categoryName = book.category?.name || 'Lainnya'

    if (!categoryMap.has(categoryId)) {
      categoryMap.set(categoryId, {
        categoryId,
        categoryName,
        books: [],
      })
    }

    categoryMap.get(categoryId)?.books.push(book)
  })

  return Array.from(categoryMap.values())
})

onMounted(async () => {
  try {
    const fetchedBooks = await getAllBooks()
    books.value = fetchedBooks
  } catch (error) {
    console.error('Error loading books:', error)
  } finally {
    loading.value = false
  }
})
</script>
