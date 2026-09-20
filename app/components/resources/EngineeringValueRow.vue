<template>
  <div class="flex min-h-12 items-center justify-between gap-4 border-b border-base-300/80 py-3 last:border-b-0">
    <dt class="text-sm leading-7 text-base-content/65">{{ label }}</dt>
    <dd class="text-end text-sm font-bold text-base-content" :lang="valueLang" :dir="valueLang === 'fa' ? 'rtl' : 'ltr'">
      <span>{{ value }}</span>
      <span v-if="unit" class="ms-1 text-xs font-medium text-base-content/55">{{ unit }}</span>
    </dd>
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  label: string
  value: string
  unit?: string
  valueLang?: 'fa' | 'en'
}>(), {
  valueLang: 'en',
})
</script>
