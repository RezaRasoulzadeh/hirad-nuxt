<template>
  <section class="container mx-auto px-4 lg:px-0 py-12 md:py-20" dir="rtl">
    <div class="flex flex-col items-center text-center mb-12 md:mb-16">
      <span class="text-primary text-xs font-bold tracking-[0.2em] uppercase mb-3" dir="ltr">
        Our Journey
      </span>
      <h2 class="text-2xl md:text-3xl font-black text-base-content tracking-tight">مسیر رشد ما</h2>
      <div class="h-1 w-12 bg-primary mt-4 rounded-full opacity-80" />
    </div>

    <div class="relative mx-auto w-full">
      <div 
        class="absolute top-4 h-0.5 bg-linear-to-r from-base-200 via-primary/30 to-base-200 hidden md:block z-0" 
        :style="{
          left: `calc(50% / ${history.length})`,
          right: `calc(50% / ${history.length})`
        }"
        aria-hidden="true"
      ></div>

      <div class="flex flex-col md:flex-row items-center md:items-start relative z-10 w-full gap-0">
        <div
          v-for="(entry, idx) in history"
          :key="entry.year"
          class="flex flex-col items-center relative flex-1 w-full group"
        >
          <div :class="{ 'hidden': idx === 0 }" class="md:hidden w-px h-8 bg-base-300 z-0"></div>

          <div class="relative z-20 flex items-center justify-center w-8 h-8 rounded-full bg-base-100 border-2 border-primary text-primary transition-all duration-300 group-hover:bg-primary group-hover:text-primary-content shrink-0 font-black text-xs select-none">
            {{ idx + 1 }}
          </div>

          <div class="w-px h-6 bg-base-300 z-0"></div>

          <div class="w-full md:px-3 max-w-sm">
            <div class="card-lift bg-base-100 border border-base-200/70 p-5 rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:border-primary/20 relative flex flex-col items-center text-center">
              
              <div class="w-full flex justify-center mb-2">
                <div class="inline-flex items-center justify-center px-3 py-1 bg-primary/5 rounded-full">
                  <span class="text-primary font-black text-2xl pt-1 tracking-wide">
                    {{ entry.year_fa }}
                  </span>
                </div>
              </div>
              
              <p class="text-xs md:text-sm text-base-content/70 leading-relaxed font-medium">
                {{ entry.description_fa }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { HistoryEntry } from '~/composables/useAboutCompany'

defineProps<{
  history: HistoryEntry[]
}>()
</script>