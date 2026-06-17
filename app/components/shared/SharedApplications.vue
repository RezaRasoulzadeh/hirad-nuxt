<template>
  <section v-if="items && items.length > 0" class="container mx-auto px-4 lg:px-0 py-6 mb-8" dir="rtl">
    <div class="flex flex-col items-center text-center mb-8">
      <span class="text-xs font-bold tracking-[0.2em] text-primary uppercase mb-3">Applications</span>
      <h2 class="text-2xl md:text-3xl font-black text-base-content tracking-tight">کاربردها</h2>
      <div class="h-1 w-12 bg-primary mt-4 rounded-full opacity-80" />
      <p class="text-base-content/60 text-sm mt-4 leading-relaxed">
        تجهیزات و خدمات ما در صنایع مختلف از جمله نفت، گاز، پتروشیمی، دارویی و غذایی کاربرد دارند.
        ما با ارائه راه‌حل‌های تخصصی، به بهبود فرآیندها و افزایش بهره‌وری در این صنایع کمک می‌کنیم.
      </p>
    </div>

    <div class="flex flex-wrap justify-center gap-4">
      <div
        v-for="app in items"
        :key="app?.id"
        class="group flex flex-col items-center text-center gap-3 bg-base-100 border border-base-200 rounded-2xl p-6 transition-all duration-200 hover:-translate-y-0.5 w-full sm:w-[calc(50%-0.5rem)] lg:w-[calc(33.333%-0.667rem)] xl:w-[calc(20%-0.8rem)]"
      >
        <div class="size-22 rounded-2xl bg-base-200 flex items-center justify-center transition-colors overflow-hidden">
          <img
            v-if="app?.icon"
            :src="resolveUrl(app.icon)"
            :alt="app?.title_fa || 'Application Icon'"
            class="size-16 object-contain"
            loading="lazy"
            @error="handleImageError"
          />
          <Cog v-else class="size-12 text-base-content" />
        </div>
        <h3 class="text-sm font-bold text-base-content group-hover:text-primary transition-colors">
          {{ app?.title_fa || '---' }}
        </h3>
        <p class="text-xs text-base-content/60 leading-relaxed">
          {{ app?.description_fa || '' }}
        </p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { Cog } from 'lucide-vue-next'
import placeholderImg from '~/assets/placeholder.png'

export interface ApplicationItem {
  id?: string | number
  icon?: string | null
  title_fa?: string
  description_fa?: string
}

defineProps<{
  items: ApplicationItem[]
  resolveUrl: (path?: string | null) => string
}>()

function handleImageError(event: Event) {
  const target = event.target as HTMLImageElement | null
  if (target && target.src !== placeholderImg) {
    target.src = placeholderImg
  }
}
</script>