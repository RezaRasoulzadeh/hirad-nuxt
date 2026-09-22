<template>
  <ResourcePage section="tools">
    <section aria-labelledby="tool-directory">
      <h2 id="tool-directory" data-resource-reveal class="mb-7 text-xl font-bold">{{ resourcesCopy.tools.directoryTitle.fa }}</h2>
      <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-3 xl:gap-5">
        <ResourceCard v-for="(item, index) in resourceTools" :key="item.id" :item="item" flat :data-resource-delay="(index % 3) * 70" />
      </div>
    </section>
  </ResourcePage>
</template>

<script setup lang="ts">
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
