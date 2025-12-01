<template>
  <Teleport to="body">
    <!-- Success Modal -->
    <Transition name="modal-fade">
      <div
        v-if="showSuccessModal"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
        @click="closeSuccessModal"
      >
        <div
          class="relative bg-gray-900 dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-8 transform"
          @click.stop
        >
          <!-- Animated Check Icon -->
          <div class="flex justify-center mb-6">
            <div class="relative">
              <div
                class="w-20 h-20 bg-green-500/20 dark:bg-green-900/30 rounded-full flex items-center justify-center animate-scale-in border border-green-500/30"
              >
                <svg
                  class="w-10 h-10 text-green-400 dark:text-green-400 animate-check-draw"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="3"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <!-- Confetti particles -->
              <div class="absolute inset-0 animate-confetti">
                <div class="particle particle-1"></div>
                <div class="particle particle-2"></div>
                <div class="particle particle-3"></div>
                <div class="particle particle-4"></div>
                <div class="particle particle-5"></div>
                <div class="particle particle-6"></div>
              </div>
            </div>
          </div>

          <!-- Content -->
          <div class="text-center animate-fade-in-up">
            <h2 class="text-2xl font-bold text-white mb-3">Berhasil! 🎉</h2>
            <p class="text-gray-300 mb-2">
              Anda berhasil meminta buku, Silahkan menunggu persetujuan Staff
            </p>
            <p class="text-gray-400">
              Silahkan cek halaman
              <span class="text-green-400 font-semibold">"My Loans"</span>
            </p>

            <!-- Progress Bar -->
            <div
              class="w-full bg-gray-700 dark:bg-gray-700 rounded-full h-2 mb-4 mt-6 overflow-hidden"
            >
              <div class="bg-green-500 h-full rounded-full animate-progress"></div>
            </div>

            <p class="text-sm text-gray-400">Menutup dalam {{ successCountdown }} detik...</p>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Borrow Modal -->
    <Transition name="modal-fade">
      <div
        v-if="isOpen"
        class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
        @click.self="handleClose"
      >
        <Transition name="modal-slide">
          <div
            class="bg-gray-900 rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto modal-scrollbar"
          >
            <!-- Header -->
            <div
              class="sticky top-0 z-10 bg-gray-950 border-b border-gray-700 px-6 py-4 flex justify-between items-center"
            >
              <h2 class="text-2xl font-bold text-white">Pinjam Buku</h2>
              <button @click="handleClose" class="text-gray-400 hover:text-white transition-colors">
                ✕
              </button>
            </div>

            <!-- Content -->
            <div class="p-6 space-y-6">
              <!-- Book Info Section -->
              <div class="flex gap-6">
                <!-- Book Cover -->
                <div class="flex-shrink-0">
                  <img
                    :src="book.cover_url || '/images/placeholder.jpg'"
                    :alt="book.title"
                    class="w-32 h-40 object-cover rounded-lg shadow-lg"
                  />
                </div>

                <!-- Book Details -->
                <div class="flex-1">
                  <h3 class="text-xl font-bold text-white mb-2">{{ book.title }}</h3>
                  <p class="text-gray-400 text-sm mb-4">{{ book.author }}</p>

                  <div class="space-y-3">
                    <!-- Genre -->
                    <div class="flex items-start gap-2">
                      <span class="text-gray-400 font-medium min-w-[80px]">Genre:</span>
                      <span
                        class="inline-block px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm"
                      >
                        {{ book.category?.name || 'Unknown' }}
                      </span>
                    </div>

                    <!-- Stock Status -->
                    <div class="flex items-center gap-2">
                      <span class="text-gray-400 font-medium">Stok:</span>
                      <span
                        :class="
                          book.stock > 0
                            ? 'px-3 py-1 bg-green-500/20 text-green-400'
                            : 'px-3 py-1 bg-red-500/20 text-red-400'
                        "
                        class="rounded-lg text-sm font-semibold"
                      >
                        {{ book.stock > 0 ? `${book.stock} Tersedia` : 'Tidak Tersedia' }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Divider -->
              <div class="border-t border-gray-700"></div>

              <!-- Form Section -->
              <div class="space-y-4">
                <!-- Error Message -->
                <div
                  v-if="error"
                  class="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm"
                >
                  {{ error }}
                </div>

                <!-- Member Name -->
                <div>
                  <label class="block text-gray-300 font-medium mb-2 text-sm">Nama Anggota</label>
                  <input
                    v-model="formData.memberName"
                    type="text"
                    disabled
                    class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-300 placeholder-gray-500 cursor-not-allowed opacity-75 text-sm"
                  />
                  <p class="text-xs text-gray-400 mt-1">Data terisi otomatis dari profil anda</p>
                </div>

                <!-- Tanggal Peminjaman dengan DateRangePicker -->
                <div>
                  <label class="block text-gray-300 font-medium mb-3">Tanggal Peminjaman</label>
                  <DateRangePicker
                    :start-date="formData.requestDate"
                    :end-date="formData.dueDate"
                    @update-start-date="formData.requestDate = $event"
                    @update-end-date="formData.dueDate = $event"
                  />
                </div>
              </div>

              <!-- Divider -->
              <div class="border-t border-gray-700"></div>

              <!-- Action Buttons -->
              <div class="flex gap-3 justify-end pt-4">
                <button
                  @click="handleClose"
                  :disabled="isLoading"
                  class="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-lg transition-colors disabled:opacity-50"
                >
                  Batal
                </button>
                <button
                  @click="handleSubmit"
                  :disabled="!isFormValid || isLoading"
                  :class="{
                    'opacity-50 cursor-not-allowed': !isFormValid || isLoading,
                  }"
                  class="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors disabled:hover:bg-blue-600 flex items-center gap-2"
                >
                  <span v-if="isLoading" class="animate-spin">⟳</span>
                  {{ isLoading ? 'Mengajukan...' : 'Konfirmasi Peminjaman' }}
                </button>
              </div>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, watch } from 'vue'
import type { Book } from '@/services/bookService'
import DateRangePicker from './DateRangePicker.vue'

interface Props {
  book: Book
  isOpen: boolean
}

interface Emits {
  (e: 'close'): void
  (e: 'submit', data: BorrowData): void
  (e: 'success', message: string): void
  (e: 'error', message: string): void
}

export interface BorrowData {
  memberName: string
  startDate: Date
  endDate: Date
  bookId: number
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const formData = ref({
  memberName: '',
  userId: null as number | null,
  requestDate: null as Date | null,
  dueDate: null as Date | null,
})

const isLoading = ref(false)
const error = ref<string | null>(null)
const showSuccessModal = ref(false)
const successCountdown = ref(3)
let successCountdownInterval: number | null = null

// Helper function untuk format date ke 'YYYY-MM-DD'
const formatDateToString = (date: Date | null): string => {
  if (!date) return ''
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

// Helper function untuk parse 'YYYY-MM-DD' ke Date
const parseStringToDate = (dateStr: string): Date => {
  const [year, month, day] = dateStr.split('-').map(Number)
  return new Date(year, month - 1, day)
}

// Helper function untuk tambah hari ke date
const addDays = (date: Date, days: number): Date => {
  const result = new Date(date)
  result.setDate(result.getDate() + days)
  return result
}

// Helper function untuk get today's date (tanpa waktu)
const getTodayDate = (): Date => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return today
}

// Function untuk ambil nama dan ID dari database
const loadMemberData = async () => {
  try {
    const token = localStorage.getItem('auth_token')
    if (!token) {
      console.error('No auth token found')
      return
    }

    const response = await fetch('http://localhost:8000/api/auth/me', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    })

    if (!response.ok) {
      console.error('Failed to fetch user data, status:', response.status)
      return
    }

    const data = await response.json()
    const name = data.data?.name || data.name
    const userId = data.data?.id || data.id

    if (name) {
      formData.value.memberName = name
    }
    if (userId) {
      formData.value.userId = userId
    }
  } catch (e) {
    console.error('Error loading member data:', e)
  }
}

// Set default dates saat modal dibuka
const setDefaultDates = () => {
  const today = getTodayDate()
  formData.value.requestDate = today
  // dueDate akan di-set otomatis oleh DateRangePicker saat user memilih
}

// Tidak perlu watch requestDate karena DateRangePicker yang handle datenya

// Ambil data saat component mount
onMounted(() => {
  loadMemberData()
})

// Watch isOpen prop
watch(
  () => props.isOpen,
  (newVal) => {
    if (newVal) {
      loadMemberData()
      setDefaultDates()
      error.value = null
    }
  },
)

// Validasi form
const isFormValid = computed(
  () =>
    formData.value.memberName.trim() !== '' &&
    formData.value.requestDate &&
    formData.value.dueDate &&
    formData.value.requestDate <= formData.value.dueDate &&
    props.book?.id,
)

// Format date untuk display
const formatDate = (date: Date | null) => {
  if (!date) return ''
  return date.toLocaleDateString('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

// Calculate durasi peminjaman
const calculateDuration = () => {
  if (!formData.value.requestDate || !formData.value.dueDate) return 0
  const time = formData.value.dueDate.getTime() - formData.value.requestDate.getTime()
  return Math.ceil(time / (1000 * 60 * 60 * 24)) + 1
}

// Submit form
const handleSubmit = async () => {
  // Validation
  if (!props.book?.id) {
    error.value = 'Pilih buku terlebih dahulu'
    return
  }

  if (!formData.value.requestDate) {
    error.value = 'Pilih tanggal peminjaman'
    return
  }

  if (!formData.value.dueDate || formData.value.dueDate <= formData.value.requestDate) {
    error.value = 'Tanggal pengembalian harus setelah tanggal peminjaman'
    return
  }

  if (!formData.value.userId) {
    error.value = 'User ID tidak ditemukan'
    return
  }

  isLoading.value = true
  error.value = null

  try {
    const token = localStorage.getItem('auth_token')
    if (!token) {
      throw new Error('Anda harus login terlebih dahulu')
    }

    const payload = {
      user_id: formData.value.userId,
      book_id: props.book.id,
      request_date: formatDateToString(formData.value.requestDate),
      due_date: formatDateToString(formData.value.dueDate),
    }

    const response = await fetch('http://localhost:8000/api/borrow-requests', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      const errorData = await response.json()
      const errorMessage = errorData.message || 'Gagal membuat permintaan peminjaman'
      throw new Error(errorMessage)
    }

    const result = await response.json()

    // Success - fade out borrow modal dan show success modal
    emit('success', 'Permintaan peminjaman berhasil dibuat!')

    // Close borrow modal dengan transition
    emit('close')

    // Delay untuk membiarkan modal fade out sebelum success modal muncul
    setTimeout(() => {
      showSuccessModal.value = true
      startSuccessCountdown()
    }, 300)
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Terjadi kesalahan'
    error.value = errorMessage
    emit('error', errorMessage)
  } finally {
    isLoading.value = false
  }
}

// Close modal
const handleClose = () => {
  formData.value = {
    memberName: '',
    userId: null,
    requestDate: null,
    dueDate: null,
  }
  error.value = null
  emit('close')
}

// Close success modal
const closeSuccessModal = () => {
  showSuccessModal.value = false
  if (successCountdownInterval) clearInterval(successCountdownInterval)
}

// Start countdown untuk close success modal
const startSuccessCountdown = () => {
  successCountdown.value = 3
  successCountdownInterval = setInterval(() => {
    successCountdown.value--
    if (successCountdown.value === 0) {
      if (successCountdownInterval) clearInterval(successCountdownInterval)
      closeSuccessModal()
      handleClose()
    }
  }, 1000)
}
</script>

<style scoped>
/* Fade animation untuk overlay background */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

/* Slide animation untuk modal content */
.modal-slide-enter-active,
.modal-slide-leave-active {
  transition: all 0.3s ease;
}

.modal-slide-enter-from {
  transform: scale(0.95) translateY(-10px);
  opacity: 0;
}

.modal-slide-leave-to {
  transform: scale(0.95) translateY(10px);
  opacity: 0;
}

/* Custom scrollbar styling */
.modal-scrollbar::-webkit-scrollbar {
  width: 8px;
}

.modal-scrollbar::-webkit-scrollbar-track {
  background: rgb(17, 24, 39);
}

.modal-scrollbar::-webkit-scrollbar-thumb {
  background: rgb(55, 65, 81);
  border-radius: 4px;
}

.modal-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgb(75, 85, 99);
}

/* Scale In Animation */
@keyframes scale-in {
  0% {
    transform: scale(0);
    opacity: 0;
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

.animate-scale-in {
  animation: scale-in 0.5s ease-out;
}

/* Check Draw Animation */
@keyframes check-draw {
  0% {
    stroke-dasharray: 0 100;
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  100% {
    stroke-dasharray: 100 100;
    opacity: 1;
  }
}

.animate-check-draw {
  animation: check-draw 0.6s ease-out 0.3s forwards;
  stroke-dasharray: 0 100;
}

/* Fade In Up Animation */
@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in-up {
  animation: fade-in-up 0.5s ease-out 0.4s both;
}

/* Progress Bar Animation */
@keyframes progress {
  from {
    width: 0%;
  }
  to {
    width: 100%;
  }
}

.animate-progress {
  animation: progress 3s linear forwards;
}

/* Confetti Particles */
.particle {
  position: absolute;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  opacity: 0;
}

.particle-1 {
  background: #3b82f6;
  top: 0;
  left: 10%;
  animation: particle-fall 1s ease-out 0.5s;
}

.particle-2 {
  background: #10b981;
  top: 0;
  left: 30%;
  animation: particle-fall 1.2s ease-out 0.6s;
}

.particle-3 {
  background: #f59e0b;
  top: 0;
  right: 30%;
  animation: particle-fall 1.1s ease-out 0.7s;
}

.particle-4 {
  background: #ef4444;
  top: 0;
  right: 10%;
  animation: particle-fall 1.3s ease-out 0.5s;
}

.particle-5 {
  background: #8b5cf6;
  top: 0;
  left: 50%;
  animation: particle-fall 1s ease-out 0.8s;
}

.particle-6 {
  background: #ec4899;
  top: 0;
  left: 70%;
  animation: particle-fall 1.4s ease-out 0.6s;
}

@keyframes particle-fall {
  0% {
    transform: translateY(0) rotate(0deg);
    opacity: 1;
  }
  100% {
    transform: translateY(100px) rotate(360deg);
    opacity: 0;
  }
}
</style>
