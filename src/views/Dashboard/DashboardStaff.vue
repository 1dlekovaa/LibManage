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

      <!-- Grid untuk components (dengan fallback) -->
      <div class="grid grid-cols-12 gap-4 md:gap-6">
        <div class="col-span-12 space-y-6 xl:col-span-7">
          <EcommerceMetrics />
          <MonthlyTarget />
        </div>
        <div class="col-span-12 xl:col-span-5">
          <MonthlySale />
        </div>

        <div class="col-span-12">
          <StatisticsChart />
        </div>

        <div class="col-span-12 xl:col-span-5">
          <CustomerDemographic />
        </div>

        <div class="col-span-12 xl:col-span-7">
          <RecentOrders />
        </div>
      </div>
    </div>
  </StaffLayout>
</template>

<script setup lang="ts">
import StaffLayout from '@/components/layouts/staff-layout/StaffLayout.vue'
import EcommerceMetrics from '@/components/ecommerce/EcommerceMetrics.vue'
import MonthlyTarget from '@/components/ecommerce/MonthlyTarget.vue'
import MonthlySale from '@/components/ecommerce/MonthlySale.vue'
import CustomerDemographic from '@/components/ecommerce/CustomerDemographic.vue'
import StatisticsChart from '@/components/ecommerce/StatisticsChart.vue'
import RecentOrders from '@/components/ecommerce/RecentOrders.vue'
</script>
