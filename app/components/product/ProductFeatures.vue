<template>
  <div class="card bg-base-100 border border-base-200 shadow-sm" dir="rtl">
    <div class="card-body p-5">
      <h3 class="card-title text-lg font-bold mb-3 text-base-content border-r-4 border-primary pr-2">
        مشخصات کلیدی
      </h3>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div 
          v-for="(feature, idx) in features" 
          :key="idx" 
          class="flex flex-col p-3 rounded-xl bg-base-200/60 border border-base-200"
        >
          <span class="text-xs font-bold text-base-content/50 mb-1">
            {{ Object.keys(feature)[0] }}
          </span>
          <span class="text-sm font-semibold text-base-content">
            {{ Object.values(feature)[0] || '---' }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { FeatureItem } from '~/composables/useProduct'

defineProps<{
  features: FeatureItem[]
}>()
</script>