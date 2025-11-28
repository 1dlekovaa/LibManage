<template>
  <div :class="color" class="p-6 rounded-lg border border-gray-200 dark:border-gray-700">
    <div class="flex items-center justify-between">
      <div>
        <p class="text-gray-600 dark:text-gray-400 text-sm font-medium">{{ title }}</p>
        <p class="text-3xl font-bold text-gray-900 dark:text-white mt-2">{{ value }}</p>
      </div>
      <div class="text-4xl">{{ icon }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title: string
  value: number | string
  icon: string
  color?: string
}

withDefaults(defineProps<Props>(), {
  color: 'bg-gray-50 dark:bg-gray-900',
})
</script>

<style scoped></style>
