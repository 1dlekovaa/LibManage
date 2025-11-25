<template>
  <div>
    <AdminLayout>
      <div class="grid grid-cols-12 gap-4 md:gap-6">
        <div class="col-span-12 space-y-6">
          <!-- Header -->
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Member Management</h1>
              <p class="text-gray-500 dark:text-gray-400 text-sm mt-1">
                Manage all member accounts in the system
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
              Create Member
            </button>
          </div>

          <!-- Search and Filter -->
          <div class="flex flex-col sm:flex-row gap-3">
            <div class="flex-1">
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Search by name or email..."
                class="w-full px-4 py-2 border border-gray-200 rounded-lg dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              v-if="filteredUsers.length < users.length"
              @click="clearSearch"
              class="px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors"
            >
              Clear Filter
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
              <p class="text-gray-500 dark:text-gray-400">Loading members...</p>
            </div>
          </div>

          <!-- Error Message -->
          <div
            v-if="errorMessage"
            class="p-4 bg-red-50 border border-red-200 rounded-lg dark:bg-red-500/10 dark:border-red-500/30"
          >
            <div class="flex items-start gap-3">
              <svg
                class="w-5 h-5 text-red-600 dark:text-red-500 flex-shrink-0 mt-0.5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fill-rule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clip-rule="evenodd"
                />
              </svg>
              <div>
                <h3 class="font-medium text-red-800 dark:text-red-200">Error</h3>
                <p class="text-red-700 dark:text-red-300 text-sm mt-1">{{ errorMessage }}</p>
              </div>
              <button
                @click="errorMessage = ''"
                class="ml-auto text-red-600 hover:text-red-800 dark:text-red-400"
              >
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fill-rule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clip-rule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </div>

          <!-- Table -->
          <div v-if="!isLoading">
            <TableAccountManagement
              :users="filteredUsers"
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
        class="fixed inset-0 bg-black/40 backdrop-blur-md flex items-center justify-center p-4 z-99999"
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
          class="bg-white dark:bg-gray-800 rounded-xl shadow-lg w-full max-w-md max-h-[90vh] overflow-y-auto pointer-events-auto"
          @click.stop
        >
          <!-- Modal Header -->
          <div
            class="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4"
          >
            <div class="flex items-center justify-between">
              <h2 class="text-lg font-bold text-gray-900 dark:text-white">
                {{ modalMode === 'create' ? 'Create Member' : 'Edit Member' }}
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
            <!-- Name -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Name <span class="text-error-500">*</span>
              </label>
              <input
                v-model="formData.name"
                type="text"
                placeholder="Enter name"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                :disabled="isSubmitting"
              />
            </div>

            <!-- Email -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email <span class="text-error-500">*</span>
              </label>
              <input
                v-model="formData.email"
                type="email"
                placeholder="Enter email"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                :disabled="isSubmitting"
              />
            </div>

            <!-- Password (only for create) -->
            <div v-if="modalMode === 'create'">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Password <span class="text-error-500">*</span>
              </label>
              <input
                v-model="formData.password"
                type="password"
                placeholder="Enter password"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                :disabled="isSubmitting"
              />
            </div>

            <!-- Password (optional for edit) -->
            <div v-if="modalMode === 'edit'">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Password
                <span class="text-gray-400 font-normal text-xs">(leave blank to keep current)</span>
              </label>
              <input
                v-model="formData.password"
                type="password"
                placeholder="Enter new password (optional)"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                :disabled="isSubmitting"
              />
            </div>

            <!-- Role -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Role
              </label>
              <div
                class="w-full px-3 py-2 border border-gray-300 rounded-lg dark:border-gray-600 text-gray-700 dark:text-white bg-gray-50 dark:bg-gray-800"
              >
                <p class="font-medium">Anggota (Member)</p>
              </div>
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
              Cancel
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
              {{ isSubmitting ? 'Saving...' : modalMode === 'create' ? 'Create' : 'Update' }}
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
        class="fixed inset-0 bg-black/40 backdrop-blur-md flex items-center justify-center p-4 z-99999"
        @click="cancelDelete"
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
          class="bg-white dark:bg-gray-800 rounded-xl shadow-lg w-full max-w-sm pointer-events-auto"
          @click.stop
        >
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
            <h3 class="text-lg font-bold text-gray-900 dark:text-white">Delete Member</h3>
            <p class="text-gray-500 dark:text-gray-400 text-sm mt-2">
              Are you sure you want to delete
              <span class="font-semibold">{{ deleteTarget?.name }}</span
              >? This action cannot be undone.
            </p>
          </div>

          <!-- Confirmation Buttons -->
          <div class="p-6 flex gap-3">
            <button
              @click="cancelDelete"
              class="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors font-medium"
              :disabled="isDeleting"
            >
              Cancel
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
              {{ isDeleting ? 'Deleting...' : 'Delete' }}
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
import TableAccountManagement from '@/components/tables/TableAccountManagement.vue'
import { useToast } from '@/composables/useToast'
import { getAllUsers, createUser, updateUser, deleteUser, type User } from '@/services/userService'

const { success: showSuccessToast, error: showErrorToast } = useToast()

// State
const users = ref<User[]>([])
const isLoading = ref(false)
const isSubmitting = ref(false)
const isDeleting = ref(false)
const errorMessage = ref('')
const searchQuery = ref('')

// Modal state
const showModal = ref(false)
const modalMode = ref<'create' | 'edit'>('create')
const modalError = ref('')
const editingUserId = ref<number | null>(null)
const formData = ref({
  name: '',
  email: '',
  password: '',
  role: '',
})

// Delete confirmation state
const showDeleteConfirm = ref(false)
const deleteTarget = ref<User | null>(null)

// Computed
const filteredUsers = computed(() => {
  let filtered = users.value.filter((user) => user.role === 'anggota')

  if (!searchQuery.value) return filtered

  const query = searchQuery.value.toLowerCase()
  return filtered.filter(
    (user) => user.name.toLowerCase().includes(query) || user.email.toLowerCase().includes(query),
  )
})

// Load users on mount
onMounted(() => {
  loadUsers()
})

// Functions
const loadUsers = async () => {
  isLoading.value = true
  errorMessage.value = ''

  try {
    const result = await getAllUsers()

    if (result.success && result.data) {
      users.value = result.data
    } else {
      errorMessage.value = result.error?.message || 'Failed to load members'
    }
  } catch (error) {
    errorMessage.value = 'An unexpected error occurred'
    console.error('Load members error:', error)
  } finally {
    isLoading.value = false
  }
}

const openCreateModal = () => {
  modalMode.value = 'create'
  formData.value = {
    name: '',
    email: '',
    password: '',
    role: '',
  }
  modalError.value = ''
  showModal.value = true
}

const openEditModal = (user: User) => {
  modalMode.value = 'edit'
  editingUserId.value = user.id
  formData.value = {
    name: user.name,
    email: user.email,
    password: '',
    role: user.role,
  }
  modalError.value = ''
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  editingUserId.value = null
  formData.value = {
    name: '',
    email: '',
    password: '',
    role: '',
  }
  modalError.value = ''
}

const submitForm = async () => {
  modalError.value = ''

  // Validation
  if (!formData.value.name.trim()) {
    modalError.value = 'Name is required'
    return
  }
  if (!formData.value.email.trim()) {
    modalError.value = 'Email is required'
    return
  }
  if (modalMode.value === 'create' && !formData.value.password) {
    modalError.value = 'Password is required'
    return
  }

  isSubmitting.value = true

  try {
    let result

    if (modalMode.value === 'create') {
      result = await createUser(
        formData.value.name,
        formData.value.email,
        formData.value.password,
        'anggota',
      )

      if (result.success) {
        showSuccessToast('Member created successfully')
        closeModal()
        await loadUsers()
      } else {
        modalError.value = result.error?.message || 'Failed to create member'
      }
    } else {
      // Edit mode
      if (editingUserId.value) {
        result = await updateUser(
          editingUserId.value,
          formData.value.name,
          formData.value.email,
          'anggota',
          formData.value.password || undefined,
        )

        if (result.success) {
          showSuccessToast('Member updated successfully')
          closeModal()
          await loadUsers()
        } else {
          modalError.value = result.error?.message || 'Failed to update member'
        }
      }
    }
  } catch (error) {
    modalError.value = 'An unexpected error occurred'
    console.error('Submit form error:', error)
  } finally {
    isSubmitting.value = false
  }
}

const confirmDelete = (user: User) => {
  deleteTarget.value = user
  showDeleteConfirm.value = true
}

const cancelDelete = () => {
  showDeleteConfirm.value = false
  deleteTarget.value = null
}

const performDelete = async () => {
  if (!deleteTarget.value) return

  isDeleting.value = true
  errorMessage.value = ''

  try {
    const result = await deleteUser(deleteTarget.value.id)

    if (result.success) {
      showSuccessToast('Member deleted successfully')
      showDeleteConfirm.value = false
      deleteTarget.value = null
      await loadUsers()
    } else {
      errorMessage.value = result.error?.message || 'Failed to delete member'
    }
  } catch (error) {
    errorMessage.value = 'An unexpected error occurred'
    console.error('Delete member error:', error)
  } finally {
    isDeleting.value = false
  }
}

const clearSearch = () => {
  searchQuery.value = ''
}
</script>
