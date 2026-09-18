<template>
  <ResourcePage section="landing">
    <template #actions>
      <div data-resource-reveal data-resource-delay="210" class="mt-7 flex flex-wrap justify-center gap-3">
        <NuxtLink to="/resources/tools"
          class="btn btn-primary min-h-12 gap-3 rounded-lg px-6 text-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary">
          {{ resourcesCopy.landing.exploreTools.fa }}
          <ArrowLeft class="size-4" aria-hidden="true" />
        </NuxtLink>
        <NuxtLink to="/resources/standards"
          class="btn btn-outline btn-primary min-h-12 rounded-lg px-6 text-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary">
          {{ resourcesCopy.landing.browseStandards.fa }}
        </NuxtLink>
      </div>
    </template>

    <section aria-labelledby="resource-categories">
      <header data-resource-reveal class="mx-auto mb-9 max-w-2xl text-center">
        <p class="text-xs font-bold tracking-[0.2em] text-primary uppercase" lang="en" dir="ltr">{{
          resourcesCopy.landing.categoriesEyebrow.en }}</p>
        <h2 id="resource-categories" class="mt-3 text-2xl font-black leading-relaxed md:text-3xl">{{
          resourcesCopy.landing.categoriesTitle.fa }}</h2>
        <span class="mx-auto mt-4 block h-1 w-12 rounded-full bg-primary/80" aria-hidden="true" />
        <p class="mt-4 text-sm leading-8 text-base-content/65">{{ resourcesCopy.landing.categoriesDescription.fa }}</p>
      </header>
      <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-3 xl:gap-5">
        <ResourceCard v-for="(item, index) in resourceCategories" :key="item.id" :item="item" :data-resource-delay="index * 70" />
      </div>
    </section>
  </ResourcePage>
</template>

<script setup lang="ts">
import { ArrowLeft } from 'lucide-vue-next'
import ResourcePage from '~/components/resources/ResourcePage.vue'
import ResourceCard from '~/components/resources/ResourceCard.vue'
import { resourceCategories, resourcesCopy } from '~/data/resources'

useSeoMeta({
  title: resourcesCopy.landing.seoTitle.fa,
  description: resourcesCopy.landing.description.fa,
  ogTitle: resourcesCopy.landing.seoTitle.en,
  ogDescription: resourcesCopy.landing.description.en,
  ogType: 'website',
})
</script>
