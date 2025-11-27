<template>
  <div class="px-4 md:px-8 py-12 bg-gray-950">
    <div class="container mx-auto max-w-7xl">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Left: Cover Image (4:3 aspect ratio) -->
        <div class="lg:col-span-1">
          <div class="sticky top-24">
            <img
              :src="book.cover_url || '/images/placeholder.jpg'"
              :alt="book.title"
              class="w-full aspect-[4/3] object-cover rounded-lg shadow-2xl"
            />
            <!-- Action Buttons -->
            <div class="mt-6 flex flex-col gap-3">
              <button
                @click="isBorrowModalOpen = true"
                class="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
              >
                🔖 Pinjam Buku
              </button>
              <button
                class="w-full px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-lg transition-colors"
              >
                ❤️ Tambah Wishlist
              </button>
            </div>
          </div>
        </div>

        <!-- Right: Book Details -->
        <div class="lg:col-span-2">
          <!-- Full Synopsis -->
          <div class="mb-8">
            <h2 class="text-2xl font-bold text-white mb-4">Sinopsis</h2>
            <p class="text-gray-300 leading-relaxed text-justify">
              {{ book.sinopsis || 'No synopsis available' }}
            </p>
          </div>

          <!-- Book Information Grid -->
          <div class="space-y-6 border-t border-gray-700 pt-6">
            <!-- Genre -->
            <div class="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
              <span class="text-gray-400 font-medium min-w-[120px]">Genre</span>
              <div class="flex flex-wrap gap-2">
                <span
                  class="inline-block px-4 py-2 bg-blue-500/20 text-blue-400 rounded-full text-sm font-medium border border-blue-500/50"
                >
                  {{ book.category?.name || 'Unknown' }}
                </span>
              </div>
            </div>

            <!-- Category -->
            <div class="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
              <span class="text-gray-400 font-medium min-w-[120px]">Kategori</span>
              <span class="text-white font-medium">{{
                book.category?.name || 'Uncategorized'
              }}</span>
            </div>

            <!-- Author -->
            <div class="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
              <span class="text-gray-400 font-medium min-w-[120px]">Pengarang</span>
              <span class="text-white font-medium">{{ book.author }}</span>
            </div>

            <!-- Stock Status -->
            <div class="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
              <span class="text-gray-400 font-medium min-w-[120px]">Stok</span>
              <div class="flex items-center gap-2">
                <span
                  class="inline-block px-4 py-2 rounded-lg font-semibold"
                  :class="
                    book.stock > 0 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                  "
                >
                  {{ book.stock > 0 ? `${book.stock} Tersedia` : 'Tidak Tersedia' }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Borrow Modal -->
  <BorrowModal
    :book="book"
    :is-open="isBorrowModalOpen"
    @close="isBorrowModalOpen = false"
    @success="handleBorrowSuccess"
    @error="handleBorrowError"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { Book } from '@/services/bookService'
import BorrowModal from './BorrowModal.vue'

interface Props {
  book: Book
}

defineProps<Props>()

const isBorrowModalOpen = ref(false)

const handleBorrowSuccess = (message: string) => {
  console.log('Success:', message)
  // TODO: Show success toast/notification
  // Emit event ke parent atau call useToast() jika ada
  isBorrowModalOpen.value = false
}

const handleBorrowError = (message: string) => {
  console.error('Error:', message)
  // TODO: Show error toast/notification
}
</script>
