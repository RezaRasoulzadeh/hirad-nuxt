<template>
  <ResourcePage
    section="standards"
    compact
    :breadcrumb-parent="{ title: copy.title.fa, to: '/resources/standards' }"
    :breadcrumb-title="standard?.designation || copy.title.fa"
  >
    <div v-if="status === 'pending'" class="flex min-h-96 flex-col items-center justify-center gap-3" aria-live="polite">
      <span class="loading loading-spinner loading-lg text-primary" />
      <p class="text-sm text-base-content/55">در حال دریافت اطلاعات استاندارد...</p>
    </div>

    <section v-else-if="error || !standard" class="flex min-h-80 flex-col items-center justify-center rounded-xl border border-base-300 bg-base-200/40 px-6 text-center">
      <FileQuestion class="size-10 text-base-content/35" aria-hidden="true" />
      <h1 class="mt-5 text-xl font-bold">مرجع استاندارد یافت نشد</h1>
      <p class="mt-2 text-sm leading-7 text-base-content/60">این مرجع ممکن است حذف یا از حالت انتشار خارج شده باشد.</p>
      <NuxtLink to="/resources/standards" class="btn btn-outline btn-primary mt-6 rounded-xl">{{ copy.backToDirectory.fa }}</NuxtLink>
    </section>

    <article v-else class="w-full">
      <header data-resource-reveal class="relative overflow-hidden rounded-xl border border-base-300 bg-base-100 shadow-sm">
        <span class="absolute inset-y-0 start-0 w-1 bg-primary" aria-hidden="true" />
        <div class="grid gap-0 lg:grid-cols-[minmax(0,1fr)_19rem]">
          <div class="min-w-0 p-6 sm:p-8 lg:p-10">
            <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div class="flex flex-wrap items-center gap-2.5">
                <span class="text-xs font-bold tracking-[0.16em] text-primary uppercase" lang="en" dir="ltr">{{ copy.referenceEyebrow.en }}</span>
                <span class="size-1 rounded-full bg-base-content/20" aria-hidden="true" />
                <span class="text-xs font-semibold text-base-content/55">{{ standard.category_fa }}</span>
                <span v-if="standard.is_featured" class="badge badge-primary badge-soft badge-sm">{{ copy.featured.fa }}</span>
              </div>
              <p class="w-fit max-w-full shrink-0 rounded-lg bg-primary/5 px-4 py-2 font-mono text-lg font-black tracking-wide text-primary sm:text-xl" lang="en" dir="ltr">
                {{ standard.designation }}
              </p>
            </div>

            <h1 class="mt-7 max-w-5xl text-3xl font-black leading-relaxed tracking-tight md:text-4xl">{{ standard.title_fa }}</h1>
            <p v-if="standard.content_fa" class="mt-5 w-full text-justify text-sm leading-8 text-base-content/70 sm:text-base">{{ standard.short_description_fa }}</p>

            <div class="mt-7 flex flex-wrap gap-3">
              <a v-if="standard.official_url" :href="standard.official_url" target="_blank" rel="noopener noreferrer nofollow" class="btn btn-primary min-h-12 gap-2 rounded-xl px-5">
                {{ copy.officialSource.fa }}
                <ExternalLink class="size-4" aria-hidden="true" />
              </a>
              <NuxtLink to="/resources/standards" class="btn btn-ghost min-h-12 gap-2 rounded-xl px-4 text-base-content/65 hover:text-primary">
                <ArrowRight class="size-4" aria-hidden="true" />
                {{ copy.backToDirectory.fa }}
              </NuxtLink>
            </div>
          </div>

          <aside class="flex border-t border-base-300 bg-base-200/55 p-5 sm:p-6 lg:border-t-0 lg:border-r" :aria-label="copy.referenceFacts.fa">
            <div class="my-auto w-full space-y-3">
              <div class="flex min-h-14 items-center justify-between gap-4 rounded-xl border border-base-300 bg-base-100 p-3.5">
                <div class="flex min-w-0 items-center gap-3">
                  <span class="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/5 px-1.5 text-center font-mono text-xs font-black text-primary" lang="en" dir="ltr">{{ standard.organization }}</span>
                  <p class="text-xs text-base-content/50">{{ copy.organization.fa }}</p>
                </div>
                <p class="shrink-0 font-mono font-bold" lang="en" dir="ltr">{{ standard.organization }}</p>
              </div>

              <div class="space-y-3 text-sm">
                <div class="flex min-h-14 items-center justify-between gap-4 rounded-xl border border-base-300 bg-base-100 p-3.5">
                  <div class="flex min-w-0 items-center gap-3">
                    <Tag class="size-4 shrink-0 text-primary" :stroke-width="1.75" aria-hidden="true" />
                    <p class="text-xs text-base-content/50">{{ copy.category.fa }}</p>
                  </div>
                  <p class="text-end font-semibold leading-6">{{ standard.category_fa }}</p>
                </div>
                <div v-if="standard.edition" class="flex min-h-14 items-center justify-between gap-4 rounded-xl border border-base-300 bg-base-100 p-3.5">
                  <div class="flex min-w-0 items-center gap-3">
                    <RefreshCw class="size-4 shrink-0 text-primary" :stroke-width="1.75" aria-hidden="true" />
                    <p class="text-xs text-base-content/50">{{ copy.edition.fa }}</p>
                  </div>
                  <p class="truncate text-end font-semibold leading-6" dir="auto">{{ standard.edition }}</p>
                </div>
                <div v-if="standard.publication_year" class="flex min-h-14 items-center justify-between gap-4 rounded-xl border border-base-300 bg-base-100 p-3.5">
                  <div class="flex min-w-0 items-center gap-3">
                    <CalendarDays class="size-4 shrink-0 text-primary" :stroke-width="1.75" aria-hidden="true" />
                    <p class="text-xs text-base-content/50">{{ copy.publicationYear.fa }}</p>
                  </div>
                  <p class="shrink-0 font-mono font-bold" lang="en" dir="ltr">{{ standard.publication_year }}</p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </header>

      <div class="mt-6 grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_21rem]">
        <section v-if="standard.content_fa" data-resource-reveal class="rounded-xl border border-base-300 bg-base-100 p-6 md:p-8 lg:p-10" aria-labelledby="standard-description-title">
          <header class="flex items-center gap-3 border-b border-base-300 pb-5">
            <span class="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/5 text-primary">
              <BookOpenText class="size-5" :stroke-width="1.6" aria-hidden="true" />
            </span>
            <div>
              <p class="text-xs font-bold tracking-[0.14em] text-primary uppercase" lang="en" dir="ltr">Overview</p>
              <h2 id="standard-description-title" class="mt-0.5 text-xl font-bold">{{ copy.overviewTitle.fa }}</h2>
            </div>
          </header>
          <p class="mt-6 whitespace-pre-line text-justify text-sm leading-9 text-base-content/70 sm:text-[0.95rem]">{{ standard.content_fa }}</p>
        </section>

        <div v-else data-resource-reveal class="rounded-xl border border-dashed border-base-300 bg-base-200/35 p-6 md:p-8">
          <div class="flex items-start gap-4">
            <BookOpenText class="mt-1 size-5 shrink-0 text-primary" :stroke-width="1.6" aria-hidden="true" />
            <div>
              <h2 class="font-bold">{{ copy.summaryTitle.fa }}</h2>
              <p class="mt-2 text-justify text-sm leading-8 text-base-content/65">{{ standard.short_description_fa }}</p>
            </div>
          </div>
        </div>

        <aside class="space-y-4 lg:sticky lg:top-24">
          <section v-if="standard.resources.length" data-resource-reveal data-resource-delay="70" class="rounded-xl border border-base-300 bg-base-100 p-5" aria-labelledby="standard-resources-title">
            <div class="flex items-center gap-3">
              <span class="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/5 text-primary">
                <LibraryBig class="size-4.5" :stroke-width="1.6" aria-hidden="true" />
              </span>
              <div>
                <h2 id="standard-resources-title" class="font-bold">{{ copy.relatedResources.fa }}</h2>
                <p class="mt-0.5 text-xs text-base-content/50">{{ copy.relatedResourcesDescription.fa }}</p>
              </div>
            </div>
            <ul class="mt-5 space-y-2.5">
              <li v-for="resource in standard.resources" :key="resource.id">
                <a :href="resourceUrl(resource.url)" target="_blank" rel="noopener noreferrer nofollow" class="group flex min-h-12 items-center gap-3 rounded-lg border border-base-300 px-3 py-2.5 text-sm transition-colors hover:border-primary/35 hover:bg-primary/[0.025] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
                  <span class="flex size-8 shrink-0 items-center justify-center rounded-md bg-base-200 text-base-content/55 transition-colors group-hover:text-primary">
                    <component :is="resourceIcon(resource.kind)" class="size-4" :stroke-width="1.7" aria-hidden="true" />
                  </span>
                  <span class="min-w-0 flex-1 font-semibold leading-6">{{ resource.label_fa || resource.label_en }}</span>
                  <ExternalLink class="size-3.5 shrink-0 text-base-content/35 transition-colors group-hover:text-primary" aria-hidden="true" />
                </a>
              </li>
            </ul>
          </section>

          <section data-resource-reveal data-resource-delay="140" class="rounded-xl border border-primary/15 bg-primary/[0.035] p-5" aria-labelledby="standard-access-note-title">
            <div class="flex items-start gap-3">
              <ShieldCheck class="mt-0.5 size-5 shrink-0 text-primary" :stroke-width="1.6" aria-hidden="true" />
              <div>
                <h2 id="standard-access-note-title" class="font-bold">{{ copy.accessNoteTitle.fa }}</h2>
                <p class="mt-2 text-xs leading-7 text-base-content/65">{{ copy.resourceNotice.fa }}</p>
              </div>
            </div>
          </section>
        </aside>
      </div>
    </article>
  </ResourcePage>
</template>

<script setup lang="ts">
import {
  ArrowRight,
  BadgeCheck,
  BookOpenText,
  CalendarDays,
  ExternalLink,
  FileDown,
  FileQuestion,
  LibraryBig,
  Link2,
  RefreshCw,
  ShieldCheck,
  Tag,
} from 'lucide-vue-next'
import ResourcePage from '~/components/resources/ResourcePage.vue'
import { resourcesCopy } from '~/data/resources'
import type { Component } from 'vue'
import type { PublicStandard, StandardApiResponse, StandardResourceKind } from '~/types/standard'

const route = useRoute()
const requestUrl = useRequestURL()
const copy = resourcesCopy.standards
const slug = computed(() => String(route.params.slug || ''))
const { data: response, status, error } = await useFetch<StandardApiResponse<PublicStandard>>(
  () => `/api/standards/${encodeURIComponent(slug.value)}`,
  { watch: [slug] },
)
const standard = computed(() => response.value?.data || null)

function resourceUrl(url: string): string {
  return url.startsWith('/uploads/') ? `/api${url}` : url
}

function resourceIcon(kind: StandardResourceKind): Component {
  if (kind === 'document') return FileDown
  if (kind === 'official') return BadgeCheck
  return Link2
}

const canonicalUrl = computed(() => `${requestUrl.origin}/resources/standards/${encodeURIComponent(slug.value)}`)

useHead(() => ({
  link: [{ rel: 'canonical', href: canonicalUrl.value }],
}))

useSeoMeta({
  title: () => standard.value?.meta_title_fa || (standard.value ? `${standard.value.designation} | ${standard.value.title_fa}` : copy.seoTitle.fa),
  description: () => standard.value?.meta_description_fa || standard.value?.short_description_fa || copy.description.fa,
  ogTitle: () => standard.value?.meta_title_en || standard.value?.title_en || standard.value?.designation || copy.seoTitle.en,
  ogDescription: () => standard.value?.meta_description_en || standard.value?.short_description_en || standard.value?.short_description_fa || copy.description.en,
  ogType: 'article',
  robots: 'index, follow',
})
</script>
