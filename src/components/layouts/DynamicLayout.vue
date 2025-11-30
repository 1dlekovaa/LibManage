<template>
  <AdminLayout v-if="isAdminLayout">
    <slot></slot>
  </AdminLayout>
  <StaffLayout v-else-if="isStaffLayout">
    <slot></slot>
  </StaffLayout>
  <div v-else>
    <!-- Member layout or default content -->
    <slot></slot>
  </div>
</template>

<script setup>
import { useLayout } from '@/composables/useLayout'
import AdminLayout from './admin-layout/AdminLayout.vue'
import StaffLayout from './staff-layout/StaffLayout.vue'

const { isAdminLayout, isStaffLayout } = useLayout()
</script>
