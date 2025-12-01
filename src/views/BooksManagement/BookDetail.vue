<template>
  <div>
    <DynamicLayout>
      <div class="grid grid-cols-12 gap-4 md:gap-6">
        <div class="col-span-12">
          <!-- Back Button -->
          <button
            @click="goBack"
            class="inline-flex items-center gap-2 mb-6 px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Kembali
          </button>

          <!-- Loading State -->
          <div v-if="isLoading" class="flex items-center justify-center py-12">
            <div class="space-y-4 text-center">
              <div class="inline-block">
                <div
                  class="w-12 h-12 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin"
                />
              </div>
              <p class="text-gray-500 dark:text-gray-400">Memuat detail buku...</p>
            </div>
          </div>

          <!-- Error State -->
          <div
            v-if="error && !isLoading"
            class="p-6 bg-red-50 border border-red-200 rounded-lg dark:bg-red-500/10 dark:border-red-500/30"
          >
            <p class="text-red-700 dark:text-red-300">{{ error }}</p>
          </div>

          <!-- Book Detail -->
          <div v-if="book && !isLoading" class="space-y-6">
            <!-- Header Section -->
            <div
              class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden"
            >
              <div class="grid grid-cols-1 md:grid-cols-4 gap-6 p-6">
                <!-- Cover Image -->
                <div class="md:col-span-1">
                  <div
                    class="w-full aspect-[3/4] bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden flex items-center justify-center"
                  >
                    <img
                      v-if="getCoverUrl(book)"
                      :src="getCoverUrl(book)"
                      :alt="book.title"
                      class="w-full h-full object-cover"
                      @error="handleImageError"
                    />
                    <div v-else class="flex items-center justify-center w-full h-full">
                      <svg
                        class="w-16 h-16 text-gray-400"
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
                  </div>
                </div>

                <!-- Book Info -->
                <div class="md:col-span-3 space-y-4">
                  <div>
                    <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
                      {{ book.title }}
                    </h1>
                    <p class="text-gray-600 dark:text-gray-400 mt-2">
                      oleh <span class="font-medium">{{ book.author }}</span>
                    </p>
                  </div>

                  <div class="grid grid-cols-2 gap-4">
                    <div>
                      <p class="text-sm text-gray-600 dark:text-gray-400">Kategori</p>
                      <p class="text-lg font-medium text-gray-900 dark:text-white">
                        {{ book.category?.name || '-' }}
                      </p>
                    </div>
                    <div>
                      <p class="text-sm text-gray-600 dark:text-gray-400">Stok Tersedia</p>
                      <div class="mt-1">
                        <span
                          :class="[
                            'px-3 py-1 rounded-full text-sm font-medium inline-block',
                            {
                              'bg-green-100 text-green-800 dark:bg-green-500/20 dark:text-green-300':
                                book.stock > 0,
                              'bg-red-100 text-red-800 dark:bg-red-500/20 dark:text-red-300':
                                book.stock === 0,
                            },
                          ]"
                        >
                          {{ book.stock }}
                          {{ book.stock === 1 ? 'buku' : 'buku' }}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div class="flex gap-3 pt-4">
                    <button
                      @click="openEditModal"
                      class="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                      Edit
                    </button>
                    <button
                      @click="confirmDelete"
                      class="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                    >
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                      Hapus
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Sinopsis Section -->
            <div
              class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6"
            >
              <h2 class="text-lg font-bold text-gray-900 dark:text-white mb-4">Sinopsis</h2>
              <p class="text-gray-700 dark:text-gray-300 leading-relaxed">
                {{ book.sinopsis || 'Tidak ada sinopsis tersedia' }}
              </p>
            </div>

            <!-- Additional Info -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div
                class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6"
              >
                <h3
                  class="text-sm font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-4"
                >
                  Informasi Tambahan
                </h3>
                <div class="space-y-3">
                  <div class="flex justify-between">
                    <span class="text-gray-600 dark:text-gray-400">ID Buku</span>
                    <span class="font-medium text-gray-900 dark:text-white">{{ book.id }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-600 dark:text-gray-400">Dibuat</span>
                    <span class="font-medium text-gray-900 dark:text-white">
                      {{ formatDate(book.created_at) }}
                    </span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-600 dark:text-gray-400">Diperbarui</span>
                    <span class="font-medium text-gray-900 dark:text-white">
                      {{ formatDate(book.updated_at) }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DynamicLayout>

    <!-- Edit Modal (reuse dari Books.vue) -->
    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="showModal"
        class="fixed inset-0 bg-black/40 backdrop-blur-md z-99999"
        @click="closeModal"
      />
    </Transition>

    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0 translate-y-10"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 translate-y-10"
    >
      <div
        v-if="showModal"
        class="fixed inset-0 flex items-center justify-center p-4 z-99999 pointer-events-none"
      >
        <div
          class="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full pointer-events-auto max-h-[90vh] overflow-y-auto"
        >
          <!-- Modal Header -->
          <div
            class="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4"
          >
            <div class="flex items-center justify-between">
              <h2 class="text-lg font-bold text-gray-900 dark:text-white">Edit Buku</h2>
              <button
                @click="closeModal"
                class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fill-rule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clip-rule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </div>

          <!-- Modal Body -->
          <div class="px-6 py-4 space-y-4">
            <!-- Title -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Judul Buku <span class="text-red-500">*</span>
              </label>
              <input
                v-model="formData.title"
                type="text"
                placeholder="Masukkan judul buku..."
                class="w-full px-3 py-2 border border-gray-300 rounded-lg dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                :disabled="isSubmitting"
              />
              <p v-if="formErrors.title" class="text-red-600 dark:text-red-400 text-sm mt-1">
                {{ formErrors.title }}
              </p>
            </div>

            <!-- Author -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Penulis <span class="text-red-500">*</span>
              </label>
              <input
                v-model="formData.author"
                type="text"
                placeholder="Masukkan nama penulis..."
                class="w-full px-3 py-2 border border-gray-300 rounded-lg dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                :disabled="isSubmitting"
              />
              <p v-if="formErrors.author" class="text-red-600 dark:text-red-400 text-sm mt-1">
                {{ formErrors.author }}
              </p>
            </div>

            <!-- Category -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Kategori <span class="text-red-500">*</span>
              </label>
              <select
                v-model.number="formData.category_id"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                :disabled="isSubmitting || categoriesLoading"
              >
                <option value="">Pilih Kategori</option>
                <option v-for="cat in categories" :key="cat.id" :value="cat.id">
                  {{ cat.name }}
                </option>
              </select>
              <p v-if="formErrors.category_id" class="text-red-600 dark:text-red-400 text-sm mt-1">
                {{ formErrors.category_id }}
              </p>
            </div>

            <!-- Stock -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Stok <span class="text-red-500">*</span>
              </label>
              <input
                v-model.number="formData.stock"
                type="number"
                min="0"
                placeholder="Masukkan jumlah stok..."
                class="w-full px-3 py-2 border border-gray-300 rounded-lg dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                :disabled="isSubmitting"
              />
              <p v-if="formErrors.stock" class="text-red-600 dark:text-red-400 text-sm mt-1">
                {{ formErrors.stock }}
              </p>
            </div>

            <!-- Cover Upload -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Upload Cover
              </label>
              <div class="space-y-2">
                <div
                  @click="triggerFileInput"
                  class="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 cursor-pointer hover:border-blue-500 dark:hover:border-blue-400 transition-colors text-center"
                >
                  <input
                    ref="fileInput"
                    type="file"
                    accept="image/*"
                    class="hidden"
                    @change="handleCoverChange"
                  />
                  <div v-if="!coverPreview" class="space-y-2">
                    <svg
                      class="w-10 h-10 text-gray-400 mx-auto"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <div>
                      <p class="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Klik atau drag file gambar di sini
                      </p>
                      <p class="text-xs text-gray-500 dark:text-gray-400">
                        Max 2MB, format: JPEG/PNG/JPG/GIF
                      </p>
                    </div>
                  </div>
                  <div v-else class="space-y-2">
                    <img
                      :src="coverPreview"
                      :alt="coverFileName"
                      class="max-h-40 mx-auto rounded"
                    />
                    <p class="text-sm text-gray-600 dark:text-gray-400">{{ coverFileName }}</p>
                  </div>
                </div>
                <button
                  v-if="coverPreview || coverFile"
                  @click="removeCover"
                  type="button"
                  class="w-full px-3 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 dark:border-red-600 dark:text-red-400 dark:hover:bg-red-500/10 transition-colors text-sm"
                >
                  Hapus Cover
                </button>
              </div>
              <p v-if="formErrors.cover" class="text-red-600 dark:text-red-400 text-sm mt-1">
                {{ formErrors.cover }}
              </p>
            </div>

            <!-- Sinopsis -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Sinopsis
              </label>
              <textarea
                v-model="formData.sinopsis"
                rows="4"
                placeholder="Masukkan deskripsi buku..."
                class="w-full px-3 py-2 border border-gray-300 rounded-lg dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                :disabled="isSubmitting"
              />
              <p class="text-gray-500 dark:text-gray-400 text-xs mt-1">Opsional</p>
            </div>

            <!-- Modal Error -->
            <div
              v-if="modalError"
              class="p-3 bg-red-50 border border-red-200 rounded-lg dark:bg-red-500/10 dark:border-red-500/30"
            >
              <p class="text-red-700 dark:text-red-300 text-sm">{{ modalError }}</p>
            </div>
          </div>

          <!-- Modal Footer -->
          <div
            class="sticky bottom-0 bg-gray-50 dark:bg-gray-700/50 border-t border-gray-200 dark:border-gray-700 px-6 py-4 flex gap-3"
          >
            <button
              @click="closeModal"
              class="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors font-medium"
              :disabled="isSubmitting"
            >
              Batal
            </button>
            <button
              @click="submitForm"
              class="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              :disabled="isSubmitting"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
              {{ isSubmitting ? 'Menyimpan...' : 'Update' }}
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Delete Confirmation Modal -->
    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="showDeleteConfirm"
        class="fixed inset-0 bg-black/40 backdrop-blur-md z-99999"
        @click="closeDeleteConfirm"
      />
    </Transition>

    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0 translate-y-10"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 translate-y-10"
    >
      <div
        v-if="showDeleteConfirm"
        class="fixed inset-0 flex items-center justify-center p-4 z-99999 pointer-events-none"
      >
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-sm pointer-events-auto">
          <!-- Confirmation Icon -->
          <div class="p-6 text-center border-b border-gray-200 dark:border-gray-700">
            <div
              class="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-100 dark:bg-red-500/20 mb-4"
            >
              <svg
                class="w-6 h-6 text-red-600 dark:text-red-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fill-rule="evenodd"
                  d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                  clip-rule="evenodd"
                />
              </svg>
            </div>
            <h3 class="text-lg font-bold text-gray-900 dark:text-white">Hapus Buku</h3>
            <p class="text-gray-500 dark:text-gray-400 text-sm mt-2">
              Apakah Anda yakin ingin menghapus buku
              <span class="font-semibold">{{ book?.title }}</span
              >? Tindakan ini tidak dapat dibatalkan.
            </p>
          </div>

          <!-- Confirmation Buttons -->
          <div class="p-6 flex gap-3">
            <button
              @click="closeDeleteConfirm"
              class="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors font-medium"
              :disabled="isDeleting"
            >
              Batal
            </button>
            <button
              @click="performDelete"
              class="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              :disabled="isDeleting"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
              {{ isDeleting ? 'Menghapus...' : 'Hapus' }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import DynamicLayout from '@/components/layouts/DynamicLayout.vue'
import type { Book, Category } from '@/services/bookService'
import { getBookById, updateBook, deleteBook, getAllCategories } from '@/services/bookService'
import { useToast } from '@/composables/useToast'

const router = useRouter()
const route = useRoute()
const { success: showSuccessToast, error: showErrorToast } = useToast()

// State
const book = ref<Book | null>(null)
const categories = ref<Category[]>([])
const isLoading = ref(false)
const categoriesLoading = ref(false)
const error = ref('')

// Modal state
const showModal = ref(false)
const isSubmitting = ref(false)
const modalError = ref('')
const fileInput = ref<HTMLInputElement | null>(null)
const coverPreview = ref<string>('')
const coverFileName = ref<string>('')
const coverFile = ref<File | null>(null)

const formData = ref({
  title: '',
  author: '',
  category_id: '',
  stock: 0,
  sinopsis: '',
})

const formErrors = ref({
  title: '',
  author: '',
  category_id: '',
  stock: '',
  cover: '',
})

// Delete confirmation state
const showDeleteConfirm = ref(false)

// Load data on mount
onMounted(() => {
  const bookId = route.params.id as string
  if (bookId) {
    loadBook(Number(bookId))
    loadCategories()
  }
})

// Functions
const loadBook = async (id: number) => {
  isLoading.value = true
  error.value = ''

  try {
    const result = await getBookById(id)
    book.value = result
  } catch (err) {
    error.value = (err as Error).message || 'Gagal memuat detail buku'
    console.error('Load book error:', err)
  } finally {
    isLoading.value = false
  }
}

const loadCategories = async () => {
  categoriesLoading.value = true

  try {
    const result = await getAllCategories()
    categories.value = result
  } catch (err) {
    showErrorToast((err as Error).message || 'Gagal memuat kategori')
    console.error('Load categories error:', err)
  } finally {
    categoriesLoading.value = false
  }
}

const getCoverUrl = (book: Book): string => {
  if (book.cover_url && !book.cover_url.includes('/books/books/')) {
    return book.cover_url
  }

  if (book.cover) {
    let coverPath = book.cover
    coverPath = coverPath.replace(/^books\//, '')
    const encodedPath = encodeURI(coverPath)
    return `http://localhost:8000/storage/books/${encodedPath}`
  }

  return ''
}

const handleImageError = () => {
  console.error('Failed to load book cover image')
}

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const goBack = () => {
  router.back()
}

const openEditModal = () => {
  if (!book.value) return

  formData.value = {
    title: book.value.title,
    author: book.value.author,
    category_id: book.value.category_id.toString(),
    stock: book.value.stock,
    sinopsis: book.value.sinopsis || '',
  }
  coverFile.value = null
  coverPreview.value = book.value.cover_url || ''
  coverFileName.value = ''
  formErrors.value = { title: '', author: '', category_id: '', stock: '', cover: '' }
  modalError.value = ''
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  formData.value = {
    title: '',
    author: '',
    category_id: '',
    stock: 0,
    sinopsis: '',
  }
  coverFile.value = null
  coverPreview.value = ''
  coverFileName.value = ''
  formErrors.value = { title: '', author: '', category_id: '', stock: '', cover: '' }
  modalError.value = ''
}

const validateForm = (): boolean => {
  formErrors.value = { title: '', author: '', category_id: '', stock: '', cover: '' }

  if (!formData.value.title.trim()) {
    formErrors.value.title = 'Judul buku harus diisi'
    return false
  }

  if (!formData.value.author.trim()) {
    formErrors.value.author = 'Nama penulis harus diisi'
    return false
  }

  if (!formData.value.category_id) {
    formErrors.value.category_id = 'Kategori harus dipilih'
    return false
  }

  if (formData.value.stock < 0) {
    formErrors.value.stock = 'Stok tidak boleh negatif'
    return false
  }

  return true
}

const submitForm = async () => {
  if (!validateForm() || !book.value) return

  isSubmitting.value = true
  modalError.value = ''

  try {
    await updateBook(
      book.value.id,
      formData.value.title,
      formData.value.author,
      Number(formData.value.category_id),
      formData.value.stock,
      coverFile.value || undefined,
      formData.value.sinopsis,
    )
    showSuccessToast('Buku berhasil diperbarui')
    closeModal()
    const bookId = route.params.id as string
    await loadBook(Number(bookId))
  } catch (err) {
    modalError.value = (err as Error).message || 'Gagal menyimpan buku'
    console.error('Submit form error:', err)
  } finally {
    isSubmitting.value = false
  }
}

const confirmDelete = () => {
  showDeleteConfirm.value = true
}

const closeDeleteConfirm = () => {
  showDeleteConfirm.value = false
}

const performDelete = async () => {
  if (!book.value) return

  isDeleting.value = true

  try {
    await deleteBook(book.value.id)
    showSuccessToast('Buku berhasil dihapus')
    closeDeleteConfirm()
    router.push('/books')
  } catch (err) {
    showErrorToast((err as Error).message || 'Gagal menghapus buku')
    console.error('Delete book error:', err)
  } finally {
    isDeleting.value = false
  }
}

const triggerFileInput = () => {
  fileInput.value?.click()
}

const handleCoverChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]

  if (!file) return

  // Validasi file size (max 2MB)
  if (file.size > 2 * 1024 * 1024) {
    formErrors.value.cover = 'Ukuran file tidak boleh lebih dari 2MB'
    return
  }

  // Validasi file type
  const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif']
  if (!allowedTypes.includes(file.type)) {
    formErrors.value.cover = 'Format file harus JPEG, PNG, JPG, atau GIF'
    return
  }

  formErrors.value.cover = ''
  coverFile.value = file
  coverFileName.value = file.name

  // Create preview
  const reader = new FileReader()
  reader.onload = (e) => {
    coverPreview.value = e.target?.result as string
  }
  reader.readAsDataURL(file)
}

const removeCover = () => {
  coverFile.value = null
  coverPreview.value = ''
  coverFileName.value = ''
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

// For delete state
const isDeleting = ref(false)
</script>

<style scoped>
/* Page styles */
</style>
