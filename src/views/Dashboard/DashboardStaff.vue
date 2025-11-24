<template>
  <StaffLayout>
    <div class="p-6 bg-white dark:bg-gray-800 rounded-lg">
      <h1 class="text-3xl font-bold text-gray-800 dark:text-white mb-6">Dashboard Staff</h1>
      <p class="text-gray-600 dark:text-gray-300 mb-8">
        Selamat datang di halaman dashboard staff. Konten sedang dimuat...
      </p>

      <!-- Simple Card for Testing -->
      <div
        class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6"
      >
        <h2 class="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">Status Sistem</h2>
        <p class="text-blue-800 dark:text-blue-200">✓ Layout berhasil dimuat</p>
      </div>
    </div>
  </StaffLayout>
</template>

<script setup lang="ts">
import StaffLayout from '@/components/layouts/staff-layout/StaffLayout.vue'
</script>
