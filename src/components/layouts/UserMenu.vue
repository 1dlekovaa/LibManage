<template>
  <div class="relative" ref="dropdownRef">
    <button
      class="flex items-center text-gray-700 dark:text-gray-400"
      @click.prevent="toggleDropdown"
    >
      <span class="mr-3 overflow-hidden rounded-full h-11 w-11">
        <img src="/images/user/owner.jpg" alt="User" />
      </span>

      <span class="block mr-1 font-medium text-theme-sm">{{ userName }}</span>

      <ChevronDownIcon :class="{ 'rotate-180': dropdownOpen }" />
    </button>

    <!-- Dropdown Start -->
    <div
      v-if="dropdownOpen"
      class="absolute right-0 mt-[17px] flex w-[260px] flex-col rounded-2xl border border-gray-200 bg-white p-3 shadow-theme-lg dark:border-gray-800 dark:bg-gray-dark"
    >
      <div>
        <span class="block font-medium text-gray-700 text-theme-sm dark:text-gray-400">
          {{ userName }}
        </span>
        <span class="mt-0.5 block text-theme-xs text-gray-500 dark:text-gray-400">
          {{ userEmail }}
        </span>
      </div>

      <ul class="flex flex-col gap-1 pt-4 pb-3 border-b border-gray-200 dark:border-gray-800">
        <li v-for="item in menuItems" :key="item.href">
          <router-link
            :to="item.href"
            class="flex items-center gap-3 px-3 py-2 font-medium text-gray-700 rounded-lg group text-theme-sm hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
          >
            <component
              :is="item.icon"
              class="text-gray-500 group-hover:text-gray-700 dark:group-hover:text-gray-300"
            />
            {{ item.text }}
          </router-link>
        </li>
      </ul>
      <button
        @click="showLogoutConfirmation"
        class="flex items-center gap-3 px-3 py-2 mt-3 font-medium text-gray-700 rounded-lg group text-theme-sm hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300 w-full text-left"
      >
        <LogoutIcon
          class="text-gray-500 group-hover:text-gray-700 dark:group-hover:text-gray-300"
        />
        Sign out
      </button>
    </div>
    <!-- Dropdown End -->

    <!-- Confirmation Modal -->
    <Transition name="modal">
      <div
        v-if="showConfirmModal"
        class="fixed inset-0 z-[999999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
        @click="closeConfirmModal"
      >
        <div
          class="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6 transform animate-scale-in"
          @click.stop
        >
          <!-- Warning Icon -->
          <div class="flex justify-center mb-4">
            <div
              class="w-16 h-16 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center animate-pulse-slow"
            >
              <svg
                class="w-8 h-8 text-yellow-600 dark:text-yellow-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
          </div>

          <!-- Content -->
          <div class="text-center mb-6">
            <h3 class="text-xl font-bold text-gray-800 dark:text-white mb-2">Confirm Logout</h3>
            <p class="text-gray-600 dark:text-gray-300">
              Are you sure you want to sign out? You'll need to sign in again to access your
              account.
            </p>
          </div>

          <!-- Buttons -->
          <div class="flex gap-3">
            <button
              @click="closeConfirmModal"
              class="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
            <button
              @click="confirmSignOut"
              class="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Success Logout Modal -->
    <Transition name="modal">
      <div
        v-if="showSuccessModal"
        class="fixed inset-0 z-[999999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      >
        <div
          class="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-8 transform"
        >
          <!-- Animated Wave Icon -->
          <div class="flex justify-center mb-6">
            <div class="relative">
              <div
                class="w-20 h-20 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center animate-scale-in"
              >
                <svg
                  class="w-10 h-10 text-blue-600 dark:text-blue-400 animate-wave"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11"
                  />
                </svg>
              </div>
              <!-- Particles -->
              <div class="absolute inset-0">
                <div class="particle particle-1"></div>
                <div class="particle particle-2"></div>
                <div class="particle particle-3"></div>
                <div class="particle particle-4"></div>
              </div>
            </div>
          </div>

          <!-- Content -->
          <div class="text-center animate-fade-in-up">
            <h2 class="text-2xl font-bold text-gray-800 dark:text-white mb-3">See You Soon! 👋</h2>
            <p class="text-gray-600 dark:text-gray-300 mb-6">
              You've been successfully logged out. Thanks for using our service!
            </p>

            <!-- Progress Bar -->
            <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-4 overflow-hidden">
              <div class="bg-blue-500 h-full rounded-full animate-progress"></div>
            </div>

            <p class="text-sm text-gray-500 dark:text-gray-400">
              Redirecting to sign in in {{ countdown }} seconds...
            </p>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { UserCircleIcon, ChevronDownIcon, LogoutIcon, SettingsIcon, InfoCircleIcon } from '@/icons'
import { RouterLink, useRouter } from 'vue-router'
import { ref, onMounted, onUnmounted, computed, watch } from 'vue'
import { getUserData, logout } from '@/services/authService'

const router = useRouter()

const dropdownOpen = ref(false)
const dropdownRef = ref(null)
const currentUser = ref(null)
const showConfirmModal = ref(false)
const showSuccessModal = ref(false)
const countdown = ref(3)
const redirectUrl = ref('/')
let countdownInterval = null

// Computed properties untuk nama dan email pengguna
const userName = computed(() => {
  if (currentUser.value?.name) {
    const nameParts = currentUser.value.name.split(' ')
    return nameParts[0]
  }
  return 'User'
})

const userEmail = computed(() => currentUser.value?.email || 'user@example.com')

const loadUserData = () => {
  currentUser.value = getUserData()
}

const menuItems = [
  { href: '/profile', icon: UserCircleIcon, text: 'Edit profile' },
  { href: '/chat', icon: SettingsIcon, text: 'Account settings' },
  { href: '/profile', icon: InfoCircleIcon, text: 'Support' },
]

const toggleDropdown = () => {
  dropdownOpen.value = !dropdownOpen.value
}

const closeDropdown = () => {
  dropdownOpen.value = false
}

const showLogoutConfirmation = () => {
  closeDropdown()
  showConfirmModal.value = true
}

const closeConfirmModal = () => {
  showConfirmModal.value = false
}

const startCountdown = () => {
  countdown.value = 3
  countdownInterval = setInterval(() => {
    countdown.value--
    if (countdown.value === 0) {
      if (countdownInterval) clearInterval(countdownInterval)
      // Redirect to signin page based on role
      router.push(redirectUrl.value)
    }
  }, 1000)
}

watch(showSuccessModal, (newValue) => {
  if (newValue) {
    startCountdown()
  }
})

const confirmSignOut = () => {
  // Close confirmation modal
  showConfirmModal.value = false

  // Get user data and check role
  const userRole = currentUser.value?.role?.toLowerCase() || 'admin'
  console.log('User role:', userRole)

  // Determine redirect URL based on role
  // Backend roles: admin, petugas, anggota
  let finalRedirectUrl = '/'
  if (userRole.includes('petugas')) {
    finalRedirectUrl = '/signin-petugas'
  } else if (userRole.includes('anggota')) {
    finalRedirectUrl = '/signin-anggota'
  } else if (userRole.includes('admin')) {
    finalRedirectUrl = '/'
  }

  redirectUrl.value = finalRedirectUrl
  console.log(`Redirect URL for role '${userRole}':`, redirectUrl.value)

  // Clear user data from localStorage
  logout()
  currentUser.value = null

  // Show success modal
  showSuccessModal.value = true

  console.log(
    `User with role '${userRole}' logged out successfully, redirecting to ${redirectUrl.value}`,
  )
}

const handleClickOutside = (event) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
    closeDropdown()
  }
}

onMounted(() => {
  // Load user data from localStorage
  currentUser.value = getUserData()
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
  if (countdownInterval) clearInterval(countdownInterval)
})
</script>

<style scoped>
/* Modal Transitions */
.modal-enter-active {
  animation: modal-fade-in 0.3s ease-out;
}

.modal-leave-active {
  animation: modal-fade-out 0.2s ease-in;
}

@keyframes modal-fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes modal-fade-out {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}

/* Scale In Animation */
@keyframes scale-in {
  0% {
    transform: scale(0.8);
    opacity: 0;
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

.animate-scale-in {
  animation: scale-in 0.4s ease-out;
}

/* Pulse Slow Animation */
@keyframes pulse-slow {
  0%,
  100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.05);
    opacity: 0.8;
  }
}

.animate-pulse-slow {
  animation: pulse-slow 2s ease-in-out infinite;
}

/* Wave Animation */
@keyframes wave {
  0%,
  100% {
    transform: rotate(0deg);
  }
  10%,
  30%,
  50%,
  70% {
    transform: rotate(-10deg);
  }
  20%,
  40%,
  60% {
    transform: rotate(10deg);
  }
  80% {
    transform: rotate(0deg);
  }
}

.animate-wave {
  animation: wave 2s ease-in-out 0.3s;
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

/* Particles */
.particle {
  position: absolute;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  opacity: 0;
}

.particle-1 {
  background: #3b82f6;
  top: 10%;
  left: 10%;
  animation: particle-float 1.5s ease-out 0.5s;
}

.particle-2 {
  background: #10b981;
  top: 20%;
  right: 10%;
  animation: particle-float 1.3s ease-out 0.6s;
}

.particle-3 {
  background: #f59e0b;
  bottom: 20%;
  left: 15%;
  animation: particle-float 1.4s ease-out 0.7s;
}

.particle-4 {
  background: #8b5cf6;
  bottom: 10%;
  right: 15%;
  animation: particle-float 1.6s ease-out 0.5s;
}

@keyframes particle-float {
  0% {
    transform: translateY(0) scale(0);
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  100% {
    transform: translateY(-60px) scale(1);
    opacity: 0;
  }
}
</style>
