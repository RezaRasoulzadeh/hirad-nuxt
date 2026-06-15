<template>
  <section class="bg-base-100 mx-auto px-4 py-6 lg:py-14 lg:px-0">
    <div class="flex flex-col items-center text-center mb-8">
      <span class="text-xs font-bold tracking-[0.2em] text-primary uppercase mb-3">FAQ</span>
      <h2 class="text-2xl md:text-3xl font-black text-base-content tracking-tight">سوالات متداول</h2>
      <div class="h-1 w-12 bg-primary mt-4 rounded-full opacity-80" />
    </div>

    <div class="mx-auto max-w-4xl divide-y space-y-2 divide-base-200/50">
      <div
        v-for="(faq, idx) in items"
        :key="faq.id"
        class="group p-4 bg-base-200 rounded-2xl"
      >
        <button
          @click="toggle(idx)"
          class="flex w-full items-center justify-between gap-3 text-right font-bold text-base-content hover:text-primary transition-colors select-none cursor-pointer"
        >
          <span>{{ faq.title.fa }}</span>
          <ChevronDown 
            class="size-4 text-base-content/40 transition-transform duration-300 shrink-0"
            :class="{ 'rotate-180 text-primary': activeIndex === idx }"
          />
        </button>
        
        <div 
          class="grid transition-[grid-template-rows] duration-300 ease-in-out"
          :style="{ gridTemplateRows: activeIndex === idx ? '1fr' : '0fr' }"
        >
          <div class="overflow-hidden">
            <div class="mt-3 pt-3 border-t border-t-base-300 text-sm text-base-content/70 leading-relaxed">
              {{ faq.description.fa }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>


<script setup lang="ts">
import { ChevronDown } from 'lucide-vue-next';

defineProps<{
  items: FaqItem[]
}>()

const activeIndex = ref<number | null>(null)

const toggle = (index: number) => {
  activeIndex.value = activeIndex.value === index ? null : index
}
</script>