<template>
  <div class="flex flex-col justify-center px-8 md:px-12 lg:px-20 py-12 md:py-16 md:w-[38%] lg:w-[35%] shrink-0 order-2 md:order-1">
    <p class="text-primary font-bold text-sm tracking-widest uppercase mb-3 text-center md:text-start">
      شرکت تجهیز فرآیند هیراد
    </p>

    <div class="relative overflow-hidden mb-4" style="min-height: 5rem;">
      <Transition name="slide-text" mode="out-in">
        <div v-if="gallery && gallery.length > 0" :key="activeSlide" class="slide-group">
          <h1 class="slide-title text-2xl md:text-3xl lg:text-3xl font-black text-base-content text-center md:text-start leading-snug mb-2">
            {{ gallery[activeSlide]?.title_fa ?? '' }}
          </h1>
          <p class="slide-subtitle text-base-content/60 text-sm leading-relaxed text-center md:text-justify" style="text-justify: kashida; word-spacing: -0.1em;">
            {{ gallery[activeSlide]?.description_fa ?? '' }}
          </p>
        </div>
      </Transition>
    </div>

    <div class="flex self-center md:self-start gap-2 mb-8 pointer-events-none select-none" v-if="gallery && gallery.length > 1">
      <div
        v-for="(_, i) in gallery"
        :key="i"
        class="h-1.5 rounded-full transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)]"
        :class="activeSlide === i ? 'w-6 bg-primary' : 'w-2 bg-base-content/20'"
      />
    </div>

    <div class="hidden xl:flex flex-col gap-1" v-if="items && items.length > 0">
      <NuxtLink
        v-for="item in items"
        :key="item.url ?? ''"
        :to="item.url ?? '/'"
        class="group flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-300 ease-[cubic-bezier(0.25,1,0.5,1)] hover:bg-primary/8 border border-transparent hover:border-primary/20 hover:-translate-x-1"
      >
        <div class="icon-mask size-10 shrink-0 bg-base-content group-hover:bg-primary transition-all duration-300 ease-[cubic-bezier(0.25,1,0.5,1)]" :style="maskStyle(item.icon ?? '')" />
        <div class="flex flex-col gap-0.5 min-w-0">
          <span class="text-base font-bold text-base-content group-hover:text-primary transition-colors duration-200">
            {{ (item.title_fa ?? '').split('|')[0]?.trim() ?? '' }} | {{ (item.meta_title ?? '').split('|')[0]?.trim() ?? '' }}
          </span>
          <span class="text-sm text-base-content/70 truncate">{{ item.sub_title_fa ?? '' }}</span>
        </div>
        <ChevronLeft class="size-5 text-base-content/40 group-hover:text-primary transition-all duration-300 ease-[cubic-bezier(0.25,1,0.5,1)] mr-auto shrink-0 group-hover:translate-x-0" />
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ChevronLeft } from 'lucide-vue-next'

defineProps<{
  metaTitle: string
  gallery: any[]
  activeSlide: number
  items: any[]
  maskStyle: (url: string) => Record<string, string>
}>()
</script>

<style scoped>
.slide-text-enter-active .slide-title,
.slide-text-enter-active .slide-subtitle,
.slide-text-leave-active .slide-title,
.slide-text-leave-active .slide-subtitle {
  transition: opacity 0.45s cubic-bezier(0.25, 1, 0.5, 1), transform 0.45s cubic-bezier(0.25, 1, 0.5, 1);
}

.slide-text-enter-from .slide-title,
.slide-text-enter-from .slide-subtitle {
  opacity: 0;
  transform: translateY(16px);
}

.slide-text-enter-active .slide-subtitle {
  transition-delay: 200ms;
}

.slide-text-leave-to .slide-title,
.slide-text-leave-to .slide-subtitle {
  opacity: 0;
  transform: translateY(-12px);
}

@media (prefers-reduced-motion: reduce) {
  .slide-text-enter-active .slide-title,
  .slide-text-enter-active .slide-subtitle {
    transition: none;
  }
}
</style>