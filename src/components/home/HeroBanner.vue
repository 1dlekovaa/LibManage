<template>
  <div v-if="books.length > 0" class="relative">
    <!-- Hero Banner Slideshow -->
    <div class="relative h-[85vh] min-h-[600px] overflow-hidden">
      <!-- Slides Container -->
      <div class="relative h-full">
        <!-- Current Slide -->
        <div
          v-for="(book, index) in displayedBooks"
          :key="book.id"
          class="absolute inset-0 transition-opacity duration-1000"
          :style="{ opacity: index === currentSlide ? 1 : 0 }"
        >
          <!-- Background Image with better positioning -->
          <img
            :src="book.cover_url || '/images/placeholder.jpg'"
            :alt="book.title"
            class="w-full h-full object-cover object-center"
          />

          <!-- Layered Gradient Overlays -->
          <div
            class="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent"
          ></div>
          <div
            class="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"
          ></div>
          <div class="absolute inset-0 bg-black/10"></div>
        </div>
      </div>

      <!-- Hero Content -->
      <div class="absolute inset-0 flex items-center">
        <div class="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div class="max-w-2xl">
            <!-- Featured Badge -->
            <div class="mb-6 flex items-center gap-2">
              <div class="w-8 h-8 bg-red-600 flex items-center justify-center">
                <span class="text-white font-bold text-lg">P</span>
              </div>
              <span class="text-white text-sm font-medium tracking-widest uppercase">
                Featured
              </span>
            </div>

            <!-- Book Title -->
            <h1
              class="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black text-white mb-4 leading-tight tracking-tight drop-shadow-2xl"
            >
              {{ displayedBooks[currentSlide]?.title }}
            </h1>

            <!-- Metadata Row -->
            <div class="flex items-center gap-4 mb-6">
              <span class="text-green-500 font-semibold text-base"> Genre </span>
              <span class="text-gray-300 text-base">
                {{ displayedBooks[currentSlide]?.category?.name || 'General' }}
              </span>
            </div>

            <!-- Book Author -->
            <p class="text-lg text-gray-300 mb-6 font-medium">
              by {{ displayedBooks[currentSlide]?.author }}
            </p>

            <!-- Book Synopsis -->
            <p
              class="text-base sm:text-lg text-gray-200 mb-8 line-clamp-3 max-w-xl leading-relaxed"
            >
              {{
                displayedBooks[currentSlide]?.sinopsis ||
                'Discover this amazing book from our library collection'
              }}
            </p>

            <!-- Action Buttons -->
            <div class="flex items-center gap-4">
              <button
                @click="goToBookDetail(displayedBooks[currentSlide]?.id)"
                class="flex items-center gap-2 px-8 py-3 bg-white text-black font-bold rounded hover:bg-gray-200 transition-colors"
              >
                Detail
              </button>
              <button
                class="flex items-center gap-2 px-8 py-3 bg-gray-600/80 text-white font-bold rounded hover:bg-gray-600 transition-colors"
              >
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                More Info
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Navigation Arrows -->
      <button
        @click="previousSlide"
        class="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-black/50 hover:bg-black/80 text-white rounded-full flex items-center justify-center transition-all opacity-0 hover:opacity-100 group-hover:opacity-100"
      >
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>
      <button
        @click="nextSlide"
        class="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-black/50 hover:bg-black/80 text-white rounded-full flex items-center justify-center transition-all opacity-0 hover:opacity-100 group-hover:opacity-100"
      >
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
      </button>

      <!-- Slide Indicators -->
      <div class="absolute bottom-8 right-8 z-20 flex gap-2">
        <button
          v-for="(_, index) in displayedBooks"
          :key="index"
          @click="currentSlide = index"
          class="h-1 rounded-full transition-all duration-300"
          :class="index === currentSlide ? 'bg-white w-8' : 'bg-gray-500 w-6 hover:bg-gray-400'"
        ></button>
      </div>

      <!-- Fade to Black Bottom -->
      <div
        class="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-gray-950 to-transparent"
      ></div>
    </div>

    <!-- Gradient Bridge Section -->
    <div class="h-24 bg-gradient-to-b from-gray-950 to-gray-950"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, computed } from 'vue'
import { useRouter } from 'vue-router'
import type { Book } from '@/services/bookService'

interface Props {
  books: Book[]
}

const props = defineProps<Props>()

const router = useRouter()
const currentSlide = ref(0)
let autoplayInterval: number | null = null

// Gunakan computed untuk menampilkan slide maksimal 5 buku atau sesuai jumlah buku
const displayedBooks = computed(() => {
  const maxSlides = Math.min(5, props.books.length)
  return props.books.slice(0, maxSlides)
})

const goToBookDetail = (bookId?: number) => {
  if (bookId) {
    router.push(`/books/${bookId}`)
  }
}

const nextSlide = () => {
  currentSlide.value = (currentSlide.value + 1) % displayedBooks.value.length
  resetAutoplay()
}

const previousSlide = () => {
  const length = displayedBooks.value.length
  currentSlide.value = (currentSlide.value - 1 + length) % length
  resetAutoplay()
}

const startAutoplay = () => {
  autoplayInterval = window.setInterval(() => {
    currentSlide.value = (currentSlide.value + 1) % displayedBooks.value.length
  }, 5000) // Change slide every 5 seconds
}

const resetAutoplay = () => {
  if (autoplayInterval) {
    clearInterval(autoplayInterval)
  }
  startAutoplay()
}

onMounted(() => {
  startAutoplay()
})

onBeforeUnmount(() => {
  if (autoplayInterval) {
    clearInterval(autoplayInterval)
  }
})
</script>
