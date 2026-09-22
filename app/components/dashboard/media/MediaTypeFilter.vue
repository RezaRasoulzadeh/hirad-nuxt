<template>
  <div class="inline-flex w-full rounded-xl border border-base-300 bg-base-200/55 p-1 sm:w-auto" role="group" aria-label="فیلتر نوع فایل">
    <button
      v-for="option in options"
      :key="option.value"
      type="button"
      class="flex min-h-10 flex-1 items-center justify-center gap-2 rounded-lg px-4 text-sm font-semibold transition-colors sm:flex-none"
      :class="modelValue === option.value ? 'bg-base-100 text-primary' : 'text-base-content/55 hover:text-base-content'"
      :aria-pressed="modelValue === option.value"
      :disabled="disabled"
      @click="$emit('update:modelValue', option.value)"
    >
      <component :is="option.icon" class="size-4" :stroke-width="1.7" aria-hidden="true" />
      {{ option.label }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { FileText, Files, Image } from 'lucide-vue-next'
import type { MediaAssetKind } from '~/utils/mediaAssets'

defineProps<{
  modelValue: MediaAssetKind
  disabled?: boolean
}>()

defineEmits<{
  'update:modelValue': [value: MediaAssetKind]
}>()

const options = [
  { value: 'all' as const, label: 'همه فایل‌ها', icon: Files },
  { value: 'image' as const, label: 'تصاویر', icon: Image },
  { value: 'document' as const, label: 'اسناد', icon: FileText },
]
</script>
