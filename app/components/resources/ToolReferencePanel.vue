<script setup lang="ts">
import { BookOpenCheck } from 'lucide-vue-next'

withDefaults(defineProps<{
  id: string
  titleFa: string
  basisFa: string
  descriptionFa: string
  detailFa?: string
}>(), {
  detailFa: '',
})
</script>

<template>
  <aside
    class="tool-reference-panel min-w-0 rounded-xl border border-base-300 bg-base-200/60 p-5 md:p-6"
    :aria-labelledby="id"
  >
    <div class="flex items-start gap-3">
      <span class="flex size-11 shrink-0 items-center justify-center rounded-lg bg-primary/5 text-primary">
        <BookOpenCheck class="size-5" :stroke-width="1.6" aria-hidden="true" />
      </span>
      <div class="min-w-0">
        <h2 :id="id" class="text-base font-bold leading-7" dir="rtl">{{ titleFa }}</h2>
        <p class="mt-1 text-xs leading-6 text-primary/75" dir="rtl">{{ basisFa }}</p>
      </div>
    </div>

    <div class="mt-5 space-y-2 text-justify">
      <p class="text-sm leading-8 text-base-content/65" dir="rtl">{{ descriptionFa }}</p>
    </div>

    <div v-if="detailFa" class="mt-4 border-t border-base-300 pt-4 text-justify">
      <p v-if="detailFa" class="whitespace-pre-line text-xs leading-7 text-base-content/60" dir="rtl">{{ detailFa }}</p>
    </div>
  </aside>
</template>
