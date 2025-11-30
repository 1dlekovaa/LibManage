<template>
  <div class="flex h-screen bg-gray-50 dark:bg-gray-950">
    <!-- Sidebar -->
    <aside
      class="w-64 bg-gray-900 border-r border-gray-800 fixed left-0 top-0 h-screen overflow-y-auto flex flex-col"
    >
      <!-- Logo Section -->
      <div class="p-6 border-b border-gray-800">
        <router-link to="/home" class="flex items-center gap-2">
          <div>
            <h2 class="text-white font-bold text-lg">LibManage</h2>
            <p class="text-gray-400 text-xs">Library System</p>
          </div>
        </router-link>
      </div>

      <!-- Navigation Menu -->
      <nav class="flex-1 px-4 py-6 space-y-2">
        <!-- Home Link -->
        <router-link
          to="/home"
          class="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:text-white hover:bg-gray-800 transition-colors"
          :class="{ 'bg-blue-600 text-white': isActive('/home') }"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M3 12l2-3m0 0l7-4 7 4M5 9v10a1 1 0 001 1h12a1 1 0 001-1V9m-9 11l4-4m0 0l4 4m-4-4v4"
            />
          </svg>
          <span class="font-medium">Home</span>
        </router-link>

        <!-- My Loans Link -->
        <router-link
          to="/my-loans"
          class="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:text-white hover:bg-gray-800 transition-colors"
          :class="{ 'bg-blue-600 text-white': isActive('/my-loans') }"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="size-5"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M3.75 9.776c.112-.017.227-.026.344-.026h15.812c.117 0 .232.009.344.026m-16.5 0a2.25 2.25 0 0 0-1.883 2.542l.857 6a2.25 2.25 0 0 0 2.227 1.932H19.05a2.25 2.25 0 0 0 2.227-1.932l.857-6a2.25 2.25 0 0 0-1.883-2.542m-16.5 0V6A2.25 2.25 0 0 1 6 3.75h3.879a1.5 1.5 0 0 1 1.06.44l2.122 2.12a1.5 1.5 0 0 0 1.06.44H18A2.25 2.25 0 0 1 20.25 9v.776"
            />
          </svg>

          <span class="font-medium">My Loans</span>
        </router-link>

        <!-- My Books Link -->
        <router-link
          to="/my-books"
          class="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:text-white hover:bg-gray-800 transition-colors"
          :class="{ 'bg-blue-600 text-white': isActive('/my-books') }"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25"
            />
          </svg>
          <span class="font-medium">My Books</span>
        </router-link>
      </nav>

      <!-- Logout Button -->
      <div class="px-4 py-4 border-t border-gray-800">
        <button
          @click="openLogoutConfirm"
          class="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-red-600/10 hover:bg-red-600/20 text-red-400 hover:text-red-300 transition-colors font-medium"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
          <span>Logout</span>
        </button>
      </div>
    </aside>

    <!-- Main Content -->
    <main class="flex-1 overflow-auto ml-64">
      <slot />
    </main>

    <!-- Logout Confirmation Modal -->
    <Transition name="modal">
      <div
        v-if="showLogoutModal"
        class="fixed inset-0 z-[999999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
        @click="closeLogoutConfirm"
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
              @click="closeLogoutConfirm"
              class="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
            <button
              @click="confirmLogout"
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

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()
const showLogoutModal = ref(false)
const showSuccessModal = ref(false)
const countdown = ref(3)
let countdownInterval: number | null = null

const isActive = (path: string) => {
  return route.path === path
}

const openLogoutConfirm = () => {
  showLogoutModal.value = true
}

const closeLogoutConfirm = () => {
  showLogoutModal.value = false
}

const startCountdown = () => {
  countdown.value = 3
  countdownInterval = window.setInterval(() => {
    countdown.value--
    if (countdown.value === 0) {
      if (countdownInterval) clearInterval(countdownInterval)
      router.push('/signin-anggota')
    }
  }, 1000)
}

watch(showSuccessModal, (newValue) => {
  if (newValue) {
    startCountdown()
  }
})

const confirmLogout = () => {
  showLogoutModal.value = false
  localStorage.removeItem('auth_token')
  localStorage.removeItem('user_data')
  showSuccessModal.value = true
}
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
