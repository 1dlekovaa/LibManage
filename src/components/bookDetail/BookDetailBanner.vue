<template>
  <div class="relative w-full h-[500px] overflow-hidden">
    <!-- Background Banner Image -->
    <img
      :src="book.cover_url || '/images/placeholder.jpg'"
      :alt="book.title"
      class="w-full h-full object-cover object-center scale-110"
    />

    <!-- Gradient Overlay -->
    <div
      class="absolute inset-0 bg-gradient-to-r from-gray-950 via-gray-950/70 to-transparent"
    ></div>
    <div
      class="absolute inset-0 bg-gradient-to-t from-gray-950 via-transparent to-transparent"
    ></div>
    <div class="absolute inset-0 bg-black/30"></div>

    <!-- Back Button - Top Left -->
    <div class="absolute top-6 left-4 sm:left-6 lg:left-8 z-10">
      <button
        @click="goBack"
        class="inline-flex items-center gap-2 px-4 py-2 bg-black/50 hover:bg-black/70 text-white font-semibold rounded-lg transition-colors backdrop-blur-md"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M15 19l-7-7 7-7"
          />
        </svg>
        <span>Kembali</span>
      </button>
    </div>

    <!-- Content -->
    <div class="absolute inset-0 flex items-center">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div class="max-w-3xl">
          <!-- Category Badge -->
          <div class="mb-6 flex items-center gap-2">
            <div class="w-8 h-8 bg-blue-600 flex items-center justify-center rounded">
              <span class="text-white font-bold text-lg">📖</span>
            </div>
            <span class="text-white text-sm font-medium tracking-widest uppercase">
              {{ book.category?.name || 'Category' }}
            </span>
          </div>

          <!-- Book Title -->
          <h1
            class="text-5xl sm:text-6xl lg:text-7xl font-black text-white mb-4 leading-tight tracking-tight drop-shadow-2xl"
          >
            {{ book.title }}
          </h1>

          <!-- Author -->
          <p class="text-lg text-gray-300 font-medium mb-6">
            by <span class="text-white font-semibold">{{ book.author }}</span>
          </p>

          <!-- Synopsis Preview -->
          <p class="text-base sm:text-lg text-gray-200 line-clamp-2 max-w-2xl leading-relaxed">
            {{ book.sinopsis || 'No synopsis available' }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import type { Book } from '@/services/bookService'

interface Props {
  book: Book
}

defineProps<Props>()

const router = useRouter()

const goBack = () => {
  router.push('/home')
}
</script>
