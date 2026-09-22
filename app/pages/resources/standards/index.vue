<template>
  <ResourcePage section="standards">
    <section aria-labelledby="standard-families-title">
      <div v-if="organizationCards.length" class="mb-10">
        <h2 id="standard-families-title" data-resource-reveal class="mb-5 text-center text-xl font-bold">{{ copy.familiesTitle.fa }}</h2>
        <ul class="flex flex-wrap justify-center gap-3">
          <li v-for="(item, index) in organizationCards" :key="item.id" data-resource-reveal :data-resource-delay="(index % 4) * 70" class="w-full sm:w-[20rem]">
            <button
              type="button"
              class="group flex min-h-24 w-full items-center gap-4 rounded-xl border bg-base-100 p-4 text-start transition-colors hover:border-primary/35 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              :class="selectedOrganization === item.id ? 'border-primary bg-primary/5' : 'border-base-300'"
              :aria-pressed="selectedOrganization === item.id"
              @click="selectedOrganization = selectedOrganization === item.id ? '' : item.id"
            >
              <span class="flex size-12 shrink-0 items-center justify-center rounded-lg bg-primary/5 px-1.5 text-center text-xs font-black leading-4 text-primary transition-colors group-hover:bg-primary/10" lang="en" dir="ltr">{{ item.label }}</span>
              <span class="min-w-0 flex-1">
                <span class="block text-sm font-bold leading-6">{{ item.title.fa }}</span>
                <span class="mt-0.5 block truncate text-xs text-base-content/50">{{ item.description.fa }}</span>
              </span>
              <span class="flex size-8 shrink-0 items-center justify-center rounded-full border border-base-300 bg-base-200 text-xs font-bold text-base-content/65" :aria-label="`${item.count.toLocaleString('fa-IR')} ${copy.organizationCount.fa}`"><bdi>{{ item.count.toLocaleString('fa-IR') }}</bdi></span>
            </button>
          </li>
        </ul>
      </div>

      <div v-if="selectedOrganization" data-resource-reveal class="mx-auto mb-5 flex max-w-6xl items-center justify-between gap-4">
        <p class="text-sm font-semibold text-base-content/60"><bdi>{{ filteredStandards.length.toLocaleString('fa-IR') }}</bdi> {{ copy.resultCount.fa }}</p>
        <button type="button" class="btn btn-ghost btn-sm rounded-lg text-primary" @click="selectedOrganization = ''">{{ copy.allStandards.fa }}</button>
      </div>

      <div v-if="status === 'pending'" class="mx-auto mt-7 grid max-w-6xl gap-5 md:grid-cols-2" aria-live="polite">
        <div v-for="item in 4" :key="item" class="h-72 animate-pulse rounded-xl border border-base-300 bg-base-200/60" />
      </div>

      <div v-else-if="error" class="mt-7 flex flex-col items-center rounded-xl border border-error/20 bg-error/5 px-6 py-12 text-center">
        <WifiOff class="size-8 text-error" aria-hidden="true" />
        <h3 class="mt-4 font-bold">{{ copy.loadErrorTitle.fa }}</h3>
        <p class="mt-2 text-sm leading-7 text-base-content/60">{{ copy.loadErrorDescription.fa }}</p>
        <button type="button" class="btn btn-outline btn-error btn-sm mt-5 rounded-lg" @click="refresh">{{ copy.retry.fa }}</button>
      </div>

      <ul
        v-else-if="filteredStandards.length"
        class="mx-auto grid gap-5"
        :class="filteredStandards.length === 1 ? 'max-w-2xl' : 'max-w-6xl md:grid-cols-2'"
      >
        <li v-for="(standard, index) in filteredStandards" :key="standard.slug" data-resource-reveal :data-resource-delay="(index % 3) * 70">
          <NuxtLink :to="`/resources/standards/${standard.slug}`" class="group relative flex h-full overflow-hidden rounded-xl border border-base-300 bg-base-100 transition-colors duration-200 hover:border-primary/35 hover:bg-primary/[0.015] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary">
            <span class="absolute inset-y-0 start-0 w-0.5 bg-primary/70 opacity-0 transition-opacity group-hover:opacity-100" aria-hidden="true" />
            <div class="flex w-full flex-col p-6">
              <div class="flex items-center justify-between gap-4">
                <div class="flex min-w-0 items-center gap-2">
                  <span class="flex min-h-10 min-w-14 shrink-0 items-center justify-center rounded-lg bg-primary/5 px-3 text-center text-xs font-black text-primary" lang="en" dir="ltr">{{ standard.organization }}</span>
                  <span v-if="standard.is_featured" class="badge badge-primary badge-soft badge-sm">{{ copy.featured.fa }}</span>
                </div>
                <p class="min-w-0 truncate font-mono text-sm font-bold text-primary" lang="en" dir="ltr">{{ standard.designation }}</p>
              </div>

              <div class="mt-5">
                <h3 class="text-lg font-bold leading-8">{{ standard.title_fa }}</h3>
                <p v-if="standard.title_en" class="mt-1 line-clamp-1 text-xs leading-6 text-base-content/45" lang="en" dir="ltr">{{ standard.title_en }}</p>
                <p class="mt-4 line-clamp-3 text-justify text-sm leading-7 text-base-content/60">{{ standard.short_description_fa }}</p>
              </div>

              <div class="mt-auto pt-5">
                <div class="flex flex-wrap items-center gap-x-2 gap-y-1.5 border-t border-base-300 pt-4 text-xs text-base-content/50">
                  <span class="font-medium text-base-content/65">{{ standard.category_fa }}</span>
                  <span v-if="standard.edition" class="before:ms-0.5 before:me-2 before:text-base-content/20 before:content-['•']" dir="auto">{{ standard.edition }}</span>
                  <span v-if="standard.publication_year" class="before:ms-0.5 before:me-2 before:text-base-content/20 before:content-['•']" dir="ltr">{{ standard.publication_year }}</span>
                </div>
                <span class="mt-4 inline-flex items-center gap-2 text-sm font-bold text-primary">
                  {{ copy.viewDetails.fa }}
                  <ArrowLeft class="size-4 transition-transform group-hover:-translate-x-1 motion-reduce:transform-none" aria-hidden="true" />
                </span>
              </div>
            </div>
          </NuxtLink>
        </li>
      </ul>

      <div v-else class="flex flex-col items-center rounded-xl border border-dashed border-base-content/15 bg-base-200/50 px-6 py-12 text-center md:py-16">
        <span class="flex size-16 items-center justify-center rounded-full border border-base-300 bg-base-100 text-primary"><Files class="size-7" :stroke-width="1.5" aria-hidden="true" /></span>
        <h3 class="mt-5 text-base font-bold">{{ copy.emptyTitle.fa }}</h3>
        <p class="mt-2 max-w-lg text-sm leading-8 text-base-content/60">{{ selectedOrganization ? copy.selectedOrganizationEmpty.fa : copy.emptyDescription.fa }}</p>
      </div>
    </section>
  </ResourcePage>
</template>

<script setup lang="ts">
import { ArrowLeft, Files, WifiOff } from 'lucide-vue-next'
import ResourcePage from '~/components/resources/ResourcePage.vue'
import { resourcesCopy, standardOrganizations } from '~/data/resources'
import type { PublicStandard, StandardApiResponse } from '~/types/standard'

const copy = resourcesCopy.standards
const selectedOrganization = ref('')
const { data: response, status, error, refresh } = await useFetch<StandardApiResponse<PublicStandard[]>>('/api/standards')
const standards = computed(() => response.value?.data || [])
const organizationCards = computed(() => {
  const presetCodes = new Set(standardOrganizations.flatMap(item => item.codes))
  const presets = standardOrganizations
    .map(item => ({
      ...item,
      count: standards.value.filter(standard => item.codes.includes(standard.organization)).length,
    }))
    .filter(item => item.count > 0)
  const additions = [...new Set(standards.value.map(item => item.organization).filter(code => !presetCodes.has(code)))]
    .sort((a, b) => a.localeCompare(b, 'en'))
    .map(code => ({ id: `dynamic-${code}`, codes: [code], label: code, title: { fa: `استانداردهای ${code}`, en: `${code} Standards` }, description: { fa: 'سازمان استاندارد', en: 'Standards organization' }, count: standards.value.filter(item => item.organization === code).length }))
  return [...presets, ...additions]
})
const filteredStandards = computed(() => {
  if (!selectedOrganization.value) return standards.value
  const selected = organizationCards.value.find(item => item.id === selectedOrganization.value)
  return selected ? standards.value.filter(standard => selected.codes.includes(standard.organization)) : standards.value
})

useSeoMeta({
  title: copy.seoTitle.fa,
  description: copy.description.fa,
  ogTitle: copy.seoTitle.en,
  ogDescription: copy.description.en,
  ogType: 'website',
})
</script>
