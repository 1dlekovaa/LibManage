<template>
  <div>
    <AdminLayout>
      <div class="grid grid-cols-12 gap-4 md:gap-6">
        <div class="col-span-12 space-y-6">
          <!-- Header -->
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Manajemen Buku</h1>
              <p class="text-gray-500 dark:text-gray-400 text-sm mt-1">
                Kelola semua buku dalam sistem perpustakaan
              </p>
            </div>
            <button
              @click="openCreateModal"
              class="inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Tambah Buku
            </button>
          </div>

          <!-- Search and Filter -->
          <div class="flex flex-col sm:flex-row gap-3">
            <div class="flex-1">
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Cari berdasarkan judul atau penulis..."
                class="w-full px-4 py-2 border border-gray-200 rounded-lg dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              v-if="filteredBooks.length < books.length"
              @click="clearSearch"
              class="px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors"
            >
              Hapus Filter
            </button>
          </div>

          <!-- Loading State -->
          <div v-if="isLoading" class="flex items-center justify-center py-12">
            <div class="space-y-4 text-center">
              <div class="inline-block">
                <div
                  class="w-12 h-12 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin"
                />
              </div>
              <p class="text-gray-500 dark:text-gray-400">Memuat data buku...</p>
            </div>
          </div>

          <!-- Table -->
          <div v-if="!isLoading">
            <TableBookManagement
              :books="filteredBooks"
              @edit="openEditModal"
              @delete="confirmDelete"
            />
          </div>
        </div>
      </div>
    </AdminLayout>

    <!-- Create/Edit Modal -->
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
              <h2 class="text-lg font-bold text-gray-900 dark:text-white">
                {{ editingId ? 'Edit Buku' : 'Tambah Buku Baru' }}
              </h2>
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
                  class="relative border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 text-center hover:border-blue-400 dark:hover:border-blue-400 transition-colors cursor-pointer"
                  @click="triggerFileInput"
                >
                  <input
                    ref="fileInput"
                    type="file"
                    accept="image/jpeg,image/png,image/jpg,image/gif"
                    class="hidden"
                    @change="handleCoverChange"
                    :disabled="isSubmitting"
                  />
                  <div v-if="!coverPreview" class="py-4">
                    <svg
                      class="mx-auto w-8 h-8 text-gray-400 dark:text-gray-500 mb-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                    <p class="text-sm text-gray-600 dark:text-gray-400">
                      Klik atau drag image ke sini
                    </p>
                    <p class="text-xs text-gray-500 dark:text-gray-500 mt-1">
                      Format: JPEG, PNG, JPG, GIF (Max 2MB)
                    </p>
                  </div>
                  <div v-else class="py-2">
                    <img
                      :src="coverPreview"
                      alt="Preview"
                      class="mx-auto h-24 object-cover rounded mb-2"
                    />
                    <p class="text-sm text-gray-600 dark:text-gray-400">{{ coverFileName }}</p>
                  </div>
                </div>
                <button
                  v-if="coverPreview"
                  type="button"
                  @click="removeCover"
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
                placeholder="Masukkan deskripsi atau sinopsis buku..."
                rows="4"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
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
              <svg
                v-if="isSubmitting"
                class="w-4 h-4 animate-spin"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                />
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              {{ isSubmitting ? 'Menyimpan...' : editingId ? 'Update' : 'Tambah' }}
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
                class="w-6 h-6 text-red-600 dark:text-red-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fill-rule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clip-rule="evenodd"
                />
              </svg>
            </div>
            <h3 class="text-lg font-bold text-gray-900 dark:text-white">Hapus Buku</h3>
            <p class="text-gray-500 dark:text-gray-400 text-sm mt-2">
              Apakah Anda yakin ingin menghapus buku
              <span class="font-semibold">{{ deleteTarget?.title }}</span
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
              <svg
                v-if="isDeleting"
                class="w-4 h-4 animate-spin"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                />
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
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
import { ref, computed, onMounted } from 'vue'
import { AdminLayout } from '@/components/layouts/admin-layout'
import TableBookManagement from '@/components/tables/TableBookManagement.vue'
import type { Book, Category } from '@/services/bookService'
import {
  getAllBooks,
  createBook,
  updateBook,
  deleteBook,
  getAllCategories,
} from '@/services/bookService'
import { useToast } from '@/composables/useToast'

const { success: showSuccessToast, error: showErrorToast } = useToast()

// State
const books = ref<Book[]>([])
const categories = ref<Category[]>([])
const searchQuery = ref('')
const isLoading = ref(false)
const categoriesLoading = ref(false)
const isSubmitting = ref(false)
const isDeleting = ref(false)

// Modal state
const showModal = ref(false)
const editingId = ref<number | null>(null)
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
const deleteTarget = ref<Book | null>(null)

// Computed
const filteredBooks = computed(() => {
  if (!searchQuery.value) return books.value

  const query = searchQuery.value.toLowerCase()
  return books.value.filter(
    (book) => book.title.toLowerCase().includes(query) || book.author.toLowerCase().includes(query),
  )
})

// Load data on mount
onMounted(() => {
  loadBooks()
  loadCategories()
})

// Functions
const loadBooks = async () => {
  isLoading.value = true

  try {
    const result = await getAllBooks()
    books.value = result
  } catch (error) {
    showErrorToast((error as Error).message || 'Gagal memuat data buku')
    console.error('Load books error:', error)
  } finally {
    isLoading.value = false
  }
}

const loadCategories = async () => {
  categoriesLoading.value = true

  try {
    const result = await getAllCategories()
    categories.value = result
  } catch (error) {
    showErrorToast((error as Error).message || 'Gagal memuat kategori')
    console.error('Load categories error:', error)
  } finally {
    categoriesLoading.value = false
  }
}

const openCreateModal = () => {
  editingId.value = null
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
  showModal.value = true
}

const openEditModal = (book: Book) => {
  editingId.value = book.id
  formData.value = {
    title: book.title,
    author: book.author,
    category_id: book.category_id.toString(),
    stock: book.stock,
    sinopsis: book.sinopsis || '',
  }
  coverFile.value = null
  coverPreview.value = book.cover_url || ''
  coverFileName.value = ''
  formErrors.value = { title: '', author: '', category_id: '', stock: '', cover: '' }
  modalError.value = ''
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  editingId.value = null
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
  if (!validateForm()) return

  isSubmitting.value = true
  modalError.value = ''

  try {
    if (editingId.value) {
      // Update
      await updateBook(
        editingId.value,
        formData.value.title,
        formData.value.author,
        Number(formData.value.category_id),
        formData.value.stock,
        coverFile.value || undefined,
        formData.value.sinopsis,
      )
      showSuccessToast('Buku berhasil diperbarui')
    } else {
      // Create
      await createBook(
        formData.value.title,
        formData.value.author,
        Number(formData.value.category_id),
        formData.value.stock,
        coverFile.value || undefined,
        formData.value.sinopsis,
      )
      showSuccessToast('Buku berhasil ditambahkan')
    }

    closeModal()
    await loadBooks()
  } catch (error) {
    modalError.value = (error as Error).message || 'Gagal menyimpan buku'
    console.error('Submit form error:', error)
  } finally {
    isSubmitting.value = false
  }
}

const confirmDelete = (book: Book) => {
  deleteTarget.value = book
  showDeleteConfirm.value = true
}

const closeDeleteConfirm = () => {
  showDeleteConfirm.value = false
  deleteTarget.value = null
}

const performDelete = async () => {
  if (!deleteTarget.value) return

  isDeleting.value = true

  try {
    await deleteBook(deleteTarget.value.id)
    showSuccessToast('Buku berhasil dihapus')
    closeDeleteConfirm()
    await loadBooks()
  } catch (error) {
    showErrorToast((error as Error).message || 'Gagal menghapus buku')
    console.error('Delete book error:', error)
  } finally {
    isDeleting.value = false
  }
}

const clearSearch = () => {
  searchQuery.value = ''
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
</script>

<style scoped>
/* Page styles */
</style>
