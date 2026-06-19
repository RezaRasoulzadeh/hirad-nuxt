<template>
  <div class="relative w-full h-screen flex flex-col items-center bg-base-100" dir="rtl">
    <div class="w-full h-[91vh] flex justify-center items-center">
      
      <iframe
        src="/flipHTML/index.html"
        class="w-full h-full border-0"
        title="Flip HTML Viewer"
        allowfullscreen
      ></iframe>

    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'

onMounted(() => {
  if (process.client) {
    window.dispatchEvent(new Event('page-loaded'))
  }
})
</script>