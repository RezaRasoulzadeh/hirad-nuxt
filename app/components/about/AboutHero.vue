<template>
  <section
    class="relative w-full min-h-[60vh] flex items-end overflow-hidden rounded-b-box"
    dir="rtl"
  >
    <img
      v-if="coverImage"
      :src="resolveAssetUrl(coverImage)"
      alt=""
      class="absolute inset-0 w-full h-full object-cover"
      loading="eager"
    />
    <div class="absolute inset-0 bg-linear-to-t from-base-100 via-base-100/60 to-base-content/30" />

    <div class="relative container mx-auto px-4 lg:px-0 pb-12 md:pb-16 pt-32">
      <h1 class="text-3xl md:text-5xl font-black text-base-content mb-4 field-animate" style="--fi: 0">
        {{ titleFa }}
      </h1>
      <p class="text-base md:text-lg text-base-content/70 field-animate" style="--fi: 1">
        {{ summaryFa }}
      </p>
    </div>
  </section>
</template>

<script setup lang="ts">
import { resolveAssetUrl } from '~/utils/resolveAssetUrl'

defineProps<{
  titleFa: string
  summaryFa: string
  coverImage: string | null
}>()
</script>