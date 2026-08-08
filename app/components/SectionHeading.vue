<template>
  <div class="max-w-3xl">
    <p class="flex items-center gap-2 text-sm font-semibold text-primary"><span class="h-px w-7 bg-primary" />{{ eyebrow }}</p>
    <h2 class="mt-3 text-2xl font-black leading-relaxed text-base-content md:text-4xl">{{ title }}</h2>
    <p v-if="description" class="mt-4 text-base leading-8 text-base-content/60">{{ description }}</p>
  </div>
</template>

<script setup lang="ts">
defineProps<{ eyebrow: string; title: string; description?: string }>()
</script>
