<template>
  <div class="flex flex-col gap-4 w-full" dir="rtl">
    <div class="flex flex-col gap-2">
      <div class="flex items-center gap-1 text-sm text-base-content/60">
        <span>کد محصول:</span>
        <span class="font-mono font-bold text-primary select-all">{{ sku }}</span>
        <button 
          @click="$emit('copySku')" 
          class="btn btn-ghost btn-sm -mt-1 -mr-2 btn-circle text-base-content/60 hover:text-primary"
          :class="{ 'tooltip tooltip-open tooltip-top tooltip-success': copiedSku }"
          :data-tip="copiedSku ? 'کپی شد!' : 'کپی کد'"
        >
        <Copy class="size-4" />
        </button>
      </div>
      <h1 class="text-2xl md:text-3xl font-black text-base-content">
        {{ nameFa }} | {{ name }}
      </h1>
    </div>

    <p class="text-base-content/80 leading-relaxed text-justify">
      {{ descriptionFa || description }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { Copy } from 'lucide-vue-next';

defineProps<{
  sku: string
  name: string
  nameFa?: string
  description: string
  descriptionFa?: string
  copiedSku: boolean
}>()

defineEmits<{
  (e: 'copySku'): void
}>()
</script>