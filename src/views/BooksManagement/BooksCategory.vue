<template>
  <div>
    <DynamicLayout>
      <div class="grid grid-cols-12 gap-4 md:gap-6">
        <div class="col-span-12 space-y-6">
          <!-- Header -->
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Kategori Management</h1>
              <p class="text-gray-500 dark:text-gray-400 text-sm mt-1">
                Kelola semua kategori dalam sistem
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
              Buat Kategori
            </button>
          </div>

          <!-- Search and Filter -->
          <div class="flex flex-col sm:flex-row gap-3">
            <div class="flex-1">
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Cari berdasarkan nama kategori..."
                class="w-full px-4 py-2 border border-gray-200 rounded-lg dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              v-if="filteredCategories.length < categories.length"
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
              <p class="text-gray-500 dark:text-gray-400">Memuat kategori...</p>
            </div>
          </div>

          <div v-if="!isLoading">
            <TableCategoryManagement
              :categories="filteredCategories"
              @edit="openEditModal"
              @delete="confirmDelete"
            />
          </div>
        </div>
      </div>
    </DynamicLayout>

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
          class="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full pointer-events-auto"
        >
          <!-- Modal Header -->
          <div
            class="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700"
          >
            <h2 class="text-lg font-bold text-gray-900 dark:text-white">
              {{ editingId ? 'Edit Kategori' : 'Buat Kategori' }}
            </h2>
            <button
              @click="closeModal"
              class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
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

          <!-- Modal Body -->
          <div class="p-6 space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Nama Kategori
              </label>
              <input
                v-model="formData.name"
                type="text"
                placeholder="Masukkan nama kategori..."
                class="w-full px-4 py-2 border border-gray-300 rounded-lg dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p v-if="formErrors.name" class="text-red-600 dark:text-red-400 text-sm mt-1">
                {{ formErrors.name }}
              </p>
            </div>
          </div>

          <!-- Modal Footer -->
          <div
            class="flex items-center justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900"
          >
            <button
              @click="closeModal"
              class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 dark:border-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              Batal
            </button>
            <button
              @click="submitForm"
              :disabled="isSubmitting"
              class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 transition-colors font-medium"
            >
              <span v-if="isSubmitting">Menyimpan...</span>
              <span v-else>{{ editingId ? 'Update' : 'Buat' }}</span>
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
        <div
          class="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full pointer-events-auto"
        >
          <!-- Modal Header -->
          <div
            class="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700"
          >
            <h2 class="text-lg font-bold text-gray-900 dark:text-white">Hapus Kategori</h2>
            <button
              @click="closeDeleteConfirm"
              class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
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

          <!-- Modal Body -->
          <div class="p-6">
            <p class="text-gray-700 dark:text-gray-300">
              Apakah Anda yakin ingin menghapus kategori
              <strong>{{ deletingCategory?.name }}</strong
              >? Tindakan ini tidak dapat dibatalkan.
            </p>
          </div>

          <!-- Modal Footer -->
          <div
            class="flex items-center justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900"
          >
            <button
              @click="closeDeleteConfirm"
              class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 dark:border-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              Batal
            </button>
            <button
              @click="confirmDeleteAction"
              :disabled="isDeleting"
              class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-red-400 transition-colors font-medium"
            >
              <span v-if="isDeleting">Menghapus...</span>
              <span v-else>Hapus</span>
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import DynamicLayout from '@/components/layouts/DynamicLayout.vue'
import TableCategoryManagement from '@/components/tables/TableCategoryManagement.vue'
import type { Category } from '@/services/categoryService'
import {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from '@/services/categoryService'
import { useToast } from '@/composables/useToast'

const { success: showSuccessToast, error: showErrorToast } = useToast()

// State
const categories = ref<Category[]>([])
const searchQuery = ref('')
const isLoading = ref(false)
const isSubmitting = ref(false)
const isDeleting = ref(false)

// Modal states
const showModal = ref(false)
const showDeleteConfirm = ref(false)
const editingId = ref<number | null>(null)
const deletingCategory = ref<Category | null>(null)

// Form data
const formData = ref({
  name: '',
})

const formErrors = ref({
  name: '',
})

// Computed
const filteredCategories = computed(() => {
  if (!searchQuery.value) return categories.value

  const query = searchQuery.value.toLowerCase()
  return categories.value.filter((cat) => cat.name.toLowerCase().includes(query))
})

// Methods
const loadCategories = async () => {
  isLoading.value = true

  try {
    const data = await getAllCategories()
    categories.value = data
  } catch (error) {
    showErrorToast((error as Error).message || 'Gagal memuat kategori')
    console.error(error)
  } finally {
    isLoading.value = false
  }
}

const openCreateModal = () => {
  editingId.value = null
  formData.value = { name: '' }
  formErrors.value = { name: '' }
  showModal.value = true
}

const openEditModal = async (category: Category) => {
  editingId.value = category.id
  formData.value = { name: category.name }
  formErrors.value = { name: '' }
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  editingId.value = null
  formData.value = { name: '' }
  formErrors.value = { name: '' }
}

const validateForm = (): boolean => {
  formErrors.value = { name: '' }

  if (!formData.value.name.trim()) {
    formErrors.value.name = 'Nama kategori harus diisi'
    return false
  }

  return true
}

const submitForm = async () => {
  if (!validateForm()) return

  isSubmitting.value = true

  try {
    if (editingId.value) {
      // Update
      await updateCategory(editingId.value, formData.value.name)
      showSuccessToast('Kategori berhasil diperbarui')
    } else {
      // Create
      await createCategory(formData.value.name)
      showSuccessToast('Kategori berhasil dibuat')
    }

    closeModal()
    await loadCategories()
  } catch (error) {
    showErrorToast((error as Error).message || 'Gagal menyimpan kategori')
    console.error(error)
  } finally {
    isSubmitting.value = false
  }
}

const confirmDelete = (category: Category) => {
  deletingCategory.value = category
  showDeleteConfirm.value = true
}

const closeDeleteConfirm = () => {
  showDeleteConfirm.value = false
  deletingCategory.value = null
}

const confirmDeleteAction = async () => {
  if (!deletingCategory.value) return

  isDeleting.value = true

  try {
    await deleteCategory(deletingCategory.value.id)
    showSuccessToast('Kategori berhasil dihapus')
    closeDeleteConfirm()
    await loadCategories()
  } catch (error) {
    showErrorToast((error as Error).message || 'Gagal menghapus kategori')
    console.error(error)
  } finally {
    isDeleting.value = false
  }
}

const clearSearch = () => {
  searchQuery.value = ''
}

// Lifecycle
onMounted(() => {
  loadCategories()
})
</script>

<style scoped>
/* Page styles */
</style>
