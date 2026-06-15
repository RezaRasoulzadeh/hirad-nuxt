<template>
  <section class="container mx-auto px-4 lg:px-0 py-8">
    <div class="flex flex-col gap-1 items-stretch">
      <div class="w-full h-[50vh] bg-base-200 rounded-t-3xl overflow-hidden">
        <img
          :src="coverImageUrl || placeholderImg"
          :alt="title"
          loading="eager"
          fetchpriority="high"
          @error="handleImgError"
          class="w-full h-full object-cover aspect-auto"
        />
      </div>
      <div class="w-full flex flex-col justify-center bg-base-200 rounded-b-3xl p-8 lg:ps-12 gap-4">
        <h1 class="text-2xl md:text-3xl font-black text-primary leading-snug">
          {{ hero.title_fa }}
        </h1>
        <h2 class="text-base md:text-lg font-bold text-base-content/80">
          {{ hero.sub_title_fa }}
        </h2>
        <p class="text-base-content/70 text-sm leading-relaxed font-light">
          {{ hero.description_fa }}
        </p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import placeholderImg from '~/assets/placeholder.png'
import type { PageContent } from '~/composables/useCategoryPage'

defineProps<{
  title: string
  coverImageUrl: string
  hero: PageContent['hero']
}>()

const handleImgError = (e: Event) => {
  const target = e.target as HTMLImageElement
  if (target.src !== placeholderImg) {
    target.src = placeholderImg
  }
}
</script>