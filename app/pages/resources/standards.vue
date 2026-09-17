<template>
  <ResourcePage section="standards">
    <section aria-labelledby="standard-families">
      <h2 id="standard-families" data-resource-reveal class="mb-7 text-xl font-bold">{{ resourcesCopy.standards.familiesTitle.fa }}</h2>
      <ul class="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <li v-for="(category, index) in standardCategories" :key="category.code" data-resource-reveal :data-resource-delay="(index % 4) * 70"
          class="flex min-w-0 items-center gap-4 rounded-xl border border-base-300 bg-base-100 p-5">
          <span class="flex size-14 shrink-0 items-center justify-center rounded-xl bg-primary/5 text-sm font-bold text-primary" lang="en" dir="ltr">{{ category.code }}</span>
          <div class="min-w-0">
            <h3 class="text-sm font-bold leading-7">{{ category.title.fa }}</h3>
            <p class="mt-1 text-xs leading-6 text-base-content/60">{{ category.description.fa }}</p>
          </div>
        </li>
      </ul>

      <div data-resource-reveal class="mt-8 flex flex-col items-center rounded-xl border border-dashed border-base-content/15 bg-base-200/50 px-6 py-12 text-center md:py-16">
        <span class="flex size-16 items-center justify-center rounded-full border border-base-300 bg-base-100 text-primary">
          <Files class="size-7" :stroke-width="1.5" aria-hidden="true" />
        </span>
        <h3 class="mt-5 text-base font-bold">{{ resourcesCopy.standards.emptyTitle.fa }}</h3>
        <p class="mt-2 max-w-lg text-sm leading-8 text-base-content/60">{{ resourcesCopy.standards.emptyDescription.fa }}</p>
      </div>
    </section>
  </ResourcePage>
</template>

<script setup lang="ts">
import { Files } from 'lucide-vue-next'
import ResourcePage from '~/components/resources/ResourcePage.vue'
import { resourcesCopy, standardCategories } from '~/data/resources'

useSeoMeta({
  title: resourcesCopy.standards.seoTitle.fa,
  description: resourcesCopy.standards.description.fa,
  ogTitle: resourcesCopy.standards.seoTitle.en,
  ogDescription: resourcesCopy.standards.description.en,
  ogType: 'website',
})
</script>
