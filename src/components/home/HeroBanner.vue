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

      <!-- Hamburger Menu Button (Top Left) -->
      <button
        v-if="!isNavbarOpen"
        @click="toggleNavbarMenu"
        class="absolute top-6 left-6 z-40 w-10 h-10 bg-black/50 hover:bg-black/80 text-white rounded flex items-center justify-center transition-all"
      >
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>

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

    <!-- Mobile Navbar Overlay -->
    <Teleport to="body">
      <Transition
        enter-active-class="transition duration-300"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition duration-300"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div v-if="isNavbarOpen" class="fixed inset-0 z-30" @click="closeNavbarMenu">
          <!-- Backdrop -->
          <div class="absolute inset-0 bg-black/50"></div>

          <!-- Navbar Overlay -->
          <Transition
            enter-active-class="transition duration-300 transform"
            enter-from-class="-translate-x-full"
            enter-to-class="translate-x-0"
            leave-active-class="transition duration-300 transform"
            leave-from-class="translate-x-0"
            leave-to-class="-translate-x-full"
          >
            <nav
              v-if="isNavbarOpen"
              class="absolute top-0 left-0 h-full w-64 bg-gray-900 border-r border-gray-800 overflow-y-auto"
              @click.stop
            >
              <!-- Close Button -->
              <div class="flex items-center justify-between p-4 border-b border-gray-800">
                <h3 class="text-white font-semibold">Menu</h3>
                <button
                  @click="closeNavbarMenu"
                  class="text-gray-400 hover:text-white transition-colors"
                >
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <!-- Menu Items -->
              <div class="p-4 space-y-2">
                <router-link
                  to="/home"
                  class="flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-gray-800 rounded transition-colors"
                  @click="closeNavbarMenu"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M3 12l2-3m0 0l7-4 7 4M5 9v10a1 1 0 001 1h12a1 1 0 001-1V9m-9 11l4-4m0 0l4 4m-4-4v4"
                    />
                  </svg>
                  Home
                </router-link>

                <router-link
                  to="/profile"
                  class="flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-gray-800 rounded transition-colors"
                  @click="closeNavbarMenu"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  Profil
                </router-link>
              </div>
            </nav>
          </Transition>
        </div>
      </Transition>
    </Teleport>

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
const isNavbarOpen = ref(false)
let autoplayInterval: number | null = null

// Gunakan computed untuk menampilkan slide maksimal 5 buku atau sesuai jumlah buku
const displayedBooks = computed(() => {
  const maxSlides = Math.min(5, props.books.length)
  return props.books.slice(0, maxSlides)
})

const goToBookDetail = (bookId?: number) => {
  if (bookId) {
    router.push(`/book/${bookId}`)
  }
}

const toggleNavbarMenu = () => {
  isNavbarOpen.value = !isNavbarOpen.value
}

const closeNavbarMenu = () => {
  isNavbarOpen.value = false
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
