<template>
  <ResourcePage section="tools">
    <section aria-labelledby="tool-directory">
      <div data-resource-reveal class="mb-7 flex flex-wrap items-center justify-between gap-3">
        <h2 id="tool-directory" class="text-xl font-bold">{{ resourcesCopy.tools.directoryTitle.fa }}</h2>
        <p class="flex items-center gap-2 text-xs leading-6 text-base-content/60">
          <Clock3 class="size-4 shrink-0 text-primary" aria-hidden="true" />
          {{ resourcesCopy.tools.note.fa }}
        </p>
      </div>
      <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-3 xl:gap-5">
        <ResourceCard v-for="(item, index) in resourceTools" :key="item.id" :item="item" :data-resource-delay="(index % 3) * 70" />
      </div>
    </section>
  </ResourcePage>
</template>

<script setup lang="ts">
import { Clock3 } from 'lucide-vue-next'
import ResourcePage from '~/components/resources/ResourcePage.vue'
import ResourceCard from '~/components/resources/ResourceCard.vue'
import { resourceTools, resourcesCopy } from '~/data/resources'

useSeoMeta({
  title: resourcesCopy.tools.seoTitle.fa,
  description: resourcesCopy.tools.description.fa,
  ogTitle: resourcesCopy.tools.seoTitle.en,
  ogDescription: resourcesCopy.tools.description.en,
  ogType: 'website',
})
</script>
