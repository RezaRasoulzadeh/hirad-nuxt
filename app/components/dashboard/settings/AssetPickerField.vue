<template>
  <div class="min-w-0">
    <div class="group relative h-36 w-full overflow-hidden rounded-xl border border-dashed border-base-300 bg-base-200/35 transition hover:border-primary focus-within:border-primary">
      <button type="button" class="absolute inset-0 z-10 flex size-full items-center justify-center"
        :aria-label="modelValue ? `تغییر ${label}` : `انتخاب ${label}`" @click="$emit('select')">
        <template v-if="modelValue">
          <img :src="previewUrl" :alt="label"
            class="absolute inset-0 z-0 size-full object-contain p-2"
            @error="useFallback">
          <span
            class="pointer-events-none absolute inset-0 z-10 bg-black/45 opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-within:opacity-100"
            aria-hidden="true" />
          <span
            class="btn btn-sm relative z-20 border border-white/70 bg-base-100 text-base-content opacity-95 shadow-lg ring-1 ring-black/5 transition duration-200 md:scale-95 md:opacity-0 md:group-hover:scale-100 md:group-hover:opacity-100 md:group-focus-within:scale-100 md:group-focus-within:opacity-100">
            <ImagePlus class="size-4" /> تغییر تصویر
          </span>
        </template>
        <span v-else class="flex flex-col items-center gap-2 text-base-content/55 transition group-hover:text-primary">
          <span class="flex size-10 items-center justify-center rounded-full bg-base-100 shadow-sm">
            <ImagePlus class="size-5" />
          </span>
          <span class="text-xs font-bold">انتخاب از رسانه‌ها</span>
        </span>
      </button>

      <button v-if="modelValue" type="button"
        class="btn btn-circle btn-error btn-xs absolute inset-e-2 top-2 z-30 shadow-sm"
        :aria-label="`حذف ${label}`" @click="$emit('update:modelValue', '')">
        <Trash class="size-3.5" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { ImagePlus, Trash } from 'lucide-vue-next'
import { resolveAssetUrl } from '~/utils/resolveAssetUrl'

const props = withDefaults(defineProps<{
  modelValue?: string
  label?: string
  description?: string
}>(), {
  modelValue: '',
  label: 'تصویر',
  description: 'یک تصویر از کتابخانه رسانه انتخاب کنید.',
})

defineEmits<{
  select: []
  'update:modelValue': [value: string]
}>()

const previewUrl = computed(() => resolveAssetUrl(props.modelValue))

const useFallback = (event: Event) => {
  const image = event.currentTarget as HTMLImageElement
  const fallback = resolveAssetUrl()
  if (image.src !== fallback) image.src = fallback
}
</script>
