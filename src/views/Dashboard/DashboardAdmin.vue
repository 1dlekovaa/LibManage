<template>
  <AdminLayout>
    <div class="grid grid-cols-12 gap-4 md:gap-6">
      <div class="col-span-12 space-y-6 xl:col-span-7"></div>
      <div class="col-span-12 xl:col-span-5">
        <div
          class="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]"
        >
          <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 class="text-lg font-semibold text-gray-800 dark:text-white">Informasi Sistem</h2>
          </div>
          <div class="p-6">
            <p class="text-gray-600 dark:text-gray-300">
              Selamat datang di halaman dashboard admin. Konten sedang dimuat...
            </p>
          </div>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<script>
import { AdminLayout } from '@/components/layouts/admin-layout'

export default {
  components: {
    AdminLayout,
  },
  name: 'Ecommerce',
}
</script>
