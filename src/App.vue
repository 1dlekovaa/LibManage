<template>
  <ThemeProvider>
    <SidebarProvider>
      <ScrollProgressBar />
      <RouterView />
      <ToastNotification />
    </SidebarProvider>
  </ThemeProvider>
</template>

<script setup lang="ts">
import ThemeProvider from './components/layout/ThemeProvider.vue'
import SidebarProvider from './components/layout/SidebarProvider.vue'
import ToastNotification from './components/common/ToastNotification.vue'
import ScrollProgressBar from './components/common/ScrollProgressBar.vue'
</script>
