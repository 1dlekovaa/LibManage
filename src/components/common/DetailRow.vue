<template>
  <div class="flex gap-3">
    <span class="text-gray-600 dark:text-gray-400 font-medium min-w-[120px]">{{ label }}</span>
    <span class="text-gray-900 dark:text-gray-100">
      <slot>{{ value }}</slot>
    </span>
  </div>
</template>

<script setup lang="ts">
interface Props {
  label: string
  value?: string | number
}

defineProps<Props>()
</script>

<style scoped></style>
