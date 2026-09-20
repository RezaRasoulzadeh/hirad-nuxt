<template>
  <ResourcePage
    section="tools"
    compact
    :breadcrumb-parent="{ title: resourcesCopy.tools.title.fa, to: '/resources/tools' }"
    :breadcrumb-title="copy.title.fa"
  >
    <div class="space-y-8" :class="comparisonRecords.length ? 'pb-24' : ''">
      <section data-resource-reveal aria-labelledby="material-reference-tool-heading">
        <div class="mb-6 flex flex-wrap items-end justify-between gap-x-4 gap-y-3">
          <div class="min-w-0">
            <p class="text-xs font-bold tracking-[0.2em] text-primary uppercase" lang="en" dir="ltr">{{ copy.eyebrow.en }}</p>
            <h1 id="material-reference-tool-heading" class="mt-2 text-2xl font-black leading-relaxed md:text-3xl">{{ copy.title.fa }}</h1>
          </div>
          <span class="shrink-0 rounded-full border border-primary/20 bg-primary/5 px-3 py-1.5 text-[11px] font-bold text-primary" lang="en" dir="ltr">{{ copy.badge.en }}</span>
        </div>

        <div class="grid gap-5 xl:grid-cols-[minmax(0,1.25fr)_minmax(19rem,0.75fr)]">
          <form class="min-w-0 rounded-xl border border-base-300 bg-base-100 p-5 md:p-6" @submit.prevent>
            <div class="grid gap-5 md:grid-cols-2">
              <div class="form-control relative min-w-0">
                <label for="material-reference-search" class="mb-2 text-sm font-bold">{{ labels.search.fa }}</label>
                <span class="relative block">
                  <Search
                    class="pointer-events-none absolute top-1/2 z-1 size-4 -translate-y-1/2 text-base-content/45"
                    style="left: 0.75rem !important; right: auto !important;"
                    aria-hidden="true"
                  />
                  <button
                    v-if="searchQuery"
                    type="button"
                    class="absolute top-1/2 z-1 flex size-7 -translate-y-1/2 items-center justify-center rounded-full text-base-content/50 transition-colors hover:bg-base-200 hover:text-base-content focus-visible:outline-2 focus-visible:outline-primary"
                    style="right: 0.75rem !important; left: auto !important;"
                    :aria-label="labels.search.fa"
                    @mousedown.prevent
                    @click="clearSearch"
                  >
                    <X class="size-4" aria-hidden="true" />
                  </button>
                  <input
                    id="material-reference-search"
                    ref="searchInputRef"
                    v-model="searchQuery"
                    type="text"
                    role="combobox"
                    autocomplete="off"
                    aria-autocomplete="list"
                    aria-controls="material-reference-suggestions"
                    :aria-expanded="searchOpen"
                    :aria-activedescendant="activeSuggestion?.id ? `material-reference-suggestion-${activeSuggestion.id}` : undefined"
                    :placeholder="labels.searchPlaceholder.fa"
                    :dir="searchQuery ? 'auto' : 'rtl'"
                    class="input input-bordered h-12 w-full appearance-none rounded-lg bg-base-100 pl-10 text-start text-sm focus:border-primary focus:outline-primary"
                    :class="searchQuery ? 'pr-10' : 'pr-3'"
                    @focus="openSearchSuggestions"
                    @input="onSearchInput"
                    @blur="scheduleSearchClose"
                    @keydown.down.prevent="moveSuggestion(1)"
                    @keydown.up.prevent="moveSuggestion(-1)"
                    @keydown.enter.prevent="selectActiveSuggestion"
                    @keydown.esc="closeSearchSuggestions"
                  />
                </span>
                <ul v-if="searchOpen && suggestedMaterials.length" id="material-reference-suggestions" class="absolute inset-x-0 top-full z-30 mt-2 max-h-72 overflow-y-auto overscroll-contain rounded-xl border border-base-300 bg-base-100 p-1.5" role="listbox" dir="ltr">
                  <li v-for="(material, index) in suggestedMaterials.slice(0, 8)" :key="material.id" role="presentation">
                    <button
                      :id="`material-reference-suggestion-${material.id}`"
                      type="button"
                      role="option"
                      tabindex="-1"
                      :aria-selected="activeSuggestionIndex === index"
                      class="flex min-h-11 w-full items-center justify-between gap-3 rounded-lg px-3 py-2 text-left transition-colors hover:bg-primary/5 focus:bg-primary/5 focus:outline-none"
                      :class="activeSuggestionIndex === index ? 'bg-primary/5 text-primary' : 'text-base-content'"
                      @mousedown.prevent="selectSuggestion(material)"
                    >
                      <span class="min-w-0">
                        <span class="block truncate text-sm font-bold" lang="en" dir="ltr">{{ material.sourceIdentifier }}</span>
                        <span class="mt-0.5 block whitespace-pre-line text-[11px] text-base-content/50" lang="en" dir="ltr">{{ material.category }}</span>
                      </span>
                      <span class="shrink-0 text-[11px] font-bold text-primary" lang="en" dir="ltr">{{ material.specification || material.grade }}</span>
                    </button>
                  </li>
                </ul>
              </div>

              <label class="form-control min-w-0">
                <span class="mb-2 text-sm font-bold">{{ labels.family.fa }}</span>
                <select v-model="selectedCategory" :dir="controlDirection()" class="select select-bordered h-12 w-full rounded-lg bg-base-100 text-end text-sm focus:border-primary focus:outline-primary">
                  <option value="">{{ labels.allFamilies.fa }}</option>
                  <option v-for="category in categories" :key="category" :value="category">{{ formatCategory(category) }}</option>
                </select>
              </label>
              <label class="form-control min-w-0">
                <span class="mb-2 text-sm font-bold">{{ labels.specification.fa }}</span>
                <select v-model="selectedSpecification" :dir="controlDirection()" class="select select-bordered h-12 w-full rounded-lg bg-base-100 text-end text-sm focus:border-primary focus:outline-primary">
                  <option value="">{{ labels.allSpecifications.fa }}</option>
                  <option v-for="specification in specifications" :key="specification" :value="specification">{{ specification }}</option>
                </select>
              </label>
              <label class="form-control min-w-0">
                <span class="mb-2 text-sm font-bold">{{ labels.grade.fa }}</span>
                <select v-model="selectedGrade" :dir="controlDirection()" class="select select-bordered h-12 w-full rounded-lg bg-base-100 text-end text-sm focus:border-primary focus:outline-primary">
                  <option value="">{{ labels.allGrades.fa }}</option>
                  <option v-for="grade in grades" :key="grade" :value="grade">{{ grade }}</option>
                </select>
              </label>
            </div>

            <div class="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-base-300 pt-4">
              <p class="text-sm text-base-content/60" aria-live="polite">
                <span class="font-bold text-base-content" lang="en" dir="ltr">{{ filteredMaterials.length }}</span>
                {{ labels.resultCount.fa }}
              </p>
              <button type="button" class="btn btn-ghost min-h-10 rounded-lg px-3 text-xs text-primary" :disabled="!hasActiveFilters" @click="clearFilters">
                <RotateCcw class="size-4" aria-hidden="true" />
                {{ labels.clearFilters.fa }}
              </button>
            </div>
          </form>

          <ToolReferencePanel
            id="material-reference-summary"
            :title-fa="copy.reference.fa"
            :basis-fa="copy.referenceBasis.fa"
            :description-fa="copy.referenceNote.fa"
          />
        </div>
      </section>

      <div class="grid items-start gap-6 xl:grid-cols-[minmax(21rem,0.72fr)_minmax(0,1.28fr)]">
        <section data-resource-reveal data-resource-delay="70" aria-labelledby="material-reference-results-heading" class="min-w-0 rounded-xl border border-base-300 bg-base-100">
        <div class="flex flex-wrap items-center justify-between gap-3 border-b border-base-300 px-5 py-4 md:px-6">
          <h2 id="material-reference-results-heading" class="text-xl font-bold leading-8">{{ labels.results.fa }}</h2>
          <span class="rounded-full bg-base-200 px-3 py-1.5 text-xs text-base-content/60"><bdi lang="en" dir="ltr" class="font-bold text-base-content">{{ filteredMaterials.length }}</bdi> {{ labels.resultCount.fa }}</span>
        </div>

        <div v-if="filteredMaterials.length" class="divide-y divide-base-300 xl:max-h-288 xl:overflow-y-auto">
          <article v-for="material in filteredMaterials" :key="material.id" class="relative p-4 md:p-5" :class="selectedMaterial?.id === material.id ? 'bg-primary/2.5' : ''">
            <span v-if="selectedMaterial?.id === material.id" class="absolute inset-y-4 inset-s-0 w-0.75 rounded-e-full bg-primary" aria-hidden="true" />
            <button type="button" class="block w-full rounded-lg text-start focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary" :aria-pressed="selectedMaterial?.id === material.id" @click="selectMaterial(material)">
              <span class="flex flex-wrap items-start justify-between gap-3">
                <span class="min-w-0"><span class="block text-base font-bold text-base-content" lang="en" dir="ltr">{{ material.sourceIdentifier }}</span><span class="mt-1 block whitespace-pre-line text-xs leading-6 text-base-content/55" lang="en" dir="ltr">{{ material.category }}</span></span>
                <span class="rounded-full border border-base-300 bg-base-100 px-2.5 py-1 text-[11px] font-bold text-primary" lang="en" dir="ltr">{{ material.specification || material.grade }}</span>
              </span>
              <span class="mt-4 grid grid-cols-2 gap-3 text-xs"><span><span class="block text-base-content/50">{{ labels.tensileStrengthMin.fa }}</span><bdi class="mt-1 block font-bold text-base-content" lang="en" dir="ltr">{{ displayValue(material.mechanicalProperties.tensileStrengthMin) }}</bdi></span><span><span class="block text-base-content/50">{{ labels.yieldStrengthMin.fa }}</span><bdi class="mt-1 block font-bold text-base-content" lang="en" dir="ltr">{{ displayValue(material.mechanicalProperties.yieldStrengthMin) }}</bdi></span></span>
              <span class="mt-4 flex items-center gap-2 text-xs font-bold text-primary">{{ labels.viewDetails.fa }}<ArrowLeft class="ms-auto size-4" aria-hidden="true" /></span>
            </button>
            <button type="button" class="mt-3 flex min-h-10 w-full items-center justify-center gap-2 rounded-lg border border-base-300 px-3 text-xs font-bold transition-colors hover:border-primary/30 hover:text-primary focus-visible:outline-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-45" :class="isCompared(material.id) ? 'border-primary/25 bg-primary/5 text-primary' : 'text-base-content/60'" :aria-pressed="isCompared(material.id)" :disabled="comparisonIds.length >= 3 && !isCompared(material.id)" @click="toggleComparison(material.id)"><Check v-if="isCompared(material.id)" class="size-4" aria-hidden="true" /><Plus v-else class="size-4" aria-hidden="true" />{{ isCompared(material.id) ? labels.removeComparison.fa : labels.addComparison.fa }}</button>
          </article>
        </div>
        <div v-else class="flex flex-col items-center px-6 py-14 text-center" role="status">
          <SearchX class="mx-auto size-8 text-primary/70" aria-hidden="true" />
          <p class="mt-4 max-w-md text-sm leading-8 text-base-content/60">{{ labels.noResults.fa }}</p>
        </div>
        </section>

        <section ref="detailRef" data-resource-reveal data-resource-delay="140" aria-labelledby="material-detail-heading" class="min-w-0 xl:sticky xl:top-24">
          <div v-if="selectedMaterial" class="overflow-hidden rounded-xl border border-base-300 bg-base-100">
            <header class="border-b border-base-300 bg-base-200/55 px-5 py-5 md:px-6">
              <p class="text-xs font-bold text-primary">{{ labels.selected.fa }}</p>
              <div class="mt-2 flex flex-wrap items-start justify-between gap-3"><div><h2 id="material-detail-heading" class="text-xl font-black" lang="en" dir="ltr">{{ selectedMaterial.sourceIdentifier }}</h2><p class="mt-1 whitespace-pre-line text-xs text-base-content/55" lang="en" dir="ltr">{{ selectedMaterial.category }}</p></div><button type="button" class="btn btn-outline btn-primary min-h-10 rounded-lg px-3 text-xs" :disabled="comparisonIds.length >= 3 && !isCompared(selectedMaterial.id)" @click="toggleComparison(selectedMaterial.id)"><Check v-if="isCompared(selectedMaterial.id)" class="size-4" aria-hidden="true" /><Plus v-else class="size-4" aria-hidden="true" />{{ isCompared(selectedMaterial.id) ? labels.removeComparison.fa : labels.addComparison.fa }}</button></div>
            </header>
            <div class="space-y-8 p-5 md:p-6">
              <section><h3 class="text-base font-bold">{{ labels.identification.fa }}</h3><dl class="mt-4 grid gap-px overflow-hidden rounded-lg border border-base-300 bg-base-300 sm:grid-cols-2"><div class="bg-base-100 p-4"><dt class="text-xs text-base-content/55">{{ labels.identifier.fa }}</dt><dd class="mt-2 text-sm font-bold" lang="en" dir="ltr">{{ selectedMaterial.sourceIdentifier }}</dd></div><div class="bg-base-100 p-4"><dt class="text-xs text-base-content/55">{{ labels.specification.fa }}</dt><dd class="mt-2 text-sm font-bold" lang="en" dir="ltr">{{ displayValue(selectedMaterial.specification) }}</dd></div><div class="bg-base-100 p-4"><dt class="text-xs text-base-content/55">{{ labels.grade.fa }}</dt><dd class="mt-2 text-sm font-bold" lang="en" dir="ltr">{{ selectedMaterial.grade }}</dd></div><div class="bg-base-100 p-4"><dt class="text-xs text-base-content/55">{{ labels.family.fa }}</dt><dd class="mt-2 whitespace-pre-line text-sm font-bold" lang="en" dir="ltr">{{ selectedMaterial.category }}</dd></div></dl><div v-if="selectedMaterial.sourceNotes?.length" class="mt-4 rounded-lg border border-primary/15 bg-primary/2.5 p-4"><p class="text-xs font-bold text-primary">{{ labels.notes.fa }}</p><ul class="mt-2 space-y-1 text-sm leading-7 text-base-content/70" lang="en" dir="ltr"><li v-for="note in selectedMaterial.sourceNotes" :key="note">{{ note }}</li></ul></div></section>
              <section><h3 class="text-base font-bold">{{ labels.composition.fa }}</h3><p class="mt-1 text-xs leading-6 text-base-content/50">{{ labels.compositionNote.fa }}</p><dl class="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5"><div v-for="entry in compositionEntries(selectedMaterial)" :key="entry.key" class="min-w-0 rounded-lg border border-base-300 bg-base-100 p-3 text-center"><dt class="text-xs font-bold text-primary" lang="en" dir="ltr">{{ entry.key }}</dt><dd class="mt-2 whitespace-pre-line wrap-break-word text-xs font-bold leading-6 text-base-content" lang="en" dir="ltr">{{ entry.value }}</dd></div></dl></section>
              <section><h3 class="text-base font-bold">{{ labels.mechanical.fa }}</h3><dl class="mt-4 rounded-lg border border-base-300 px-4 md:px-5"><div v-for="entry in mechanicalEntries(selectedMaterial)" :key="entry.key" class="flex flex-wrap items-baseline justify-between gap-3 border-b border-base-300 py-3 last:border-b-0"><dt class="text-xs leading-6 text-base-content/55">{{ entry.label }}</dt><dd class="whitespace-pre-line text-end text-sm font-bold leading-6 text-base-content" lang="en" dir="ltr">{{ entry.value }}</dd></div></dl></section>
            </div>
          </div>
        </section>
      </div>

      <section v-if="comparisonRecords.length" ref="comparisonRef" data-resource-reveal aria-labelledby="material-reference-comparison-heading" class="scroll-mt-6 rounded-2xl border border-base-300 bg-base-200/35 p-4 md:p-6">
        <header class="mb-6 rounded-xl border border-base-300 bg-base-100 p-4 md:p-5">
          <div class="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div class="flex flex-wrap items-center gap-2"><h2 id="material-reference-comparison-heading" class="text-xl font-bold leading-8">{{ labels.comparison.fa }}</h2><span class="rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-bold text-primary" lang="en" dir="ltr">{{ comparisonRecords.length }} / 3</span></div>
              <p class="mt-1 text-sm leading-7 text-base-content/60">{{ labels.comparisonDescription.fa }}</p>
              <p class="mt-1 text-xs leading-6 text-base-content/50">{{ labels.comparisonLimit.fa }}</p>
            </div>
            <button type="button" class="btn btn-ghost min-h-10 rounded-lg px-3 text-xs text-primary" @click="comparisonIds = []"><X class="size-4" aria-hidden="true" />{{ labels.clearComparison.fa }}</button>
          </div>
          <p class="mt-4 flex items-center gap-2 border-t border-base-300 pt-3 text-xs leading-6 text-base-content/55"><span class="size-2.5 shrink-0 rounded-sm bg-primary/15 ring-1 ring-primary/15" aria-hidden="true" />{{ labels.comparisonDifference.fa }}</p>
        </header>
        <div class="grid items-start gap-4" :class="comparisonRecords.length === 1 ? 'md:grid-cols-1' : comparisonRecords.length === 2 ? 'md:grid-cols-2' : 'md:grid-cols-2 xl:grid-cols-3'">
          <article v-for="(material, index) in comparisonRecords" :key="material.id" class="min-w-0 overflow-hidden rounded-xl border border-base-300 bg-base-100">
            <header class="flex items-start justify-between gap-3 border-b border-base-300 p-5">
              <div class="flex min-w-0 items-start gap-3"><span class="flex size-8 shrink-0 items-center justify-center rounded-lg bg-base-200 text-xs font-bold text-base-content/55" lang="en" dir="ltr">{{ index + 1 }}</span><div class="min-w-0"><h3 class="truncate font-bold" lang="en" dir="ltr">{{ material.sourceIdentifier }}</h3><p class="mt-1 whitespace-pre-line text-xs text-base-content/55" lang="en" dir="ltr">{{ material.specification || '—' }} · {{ material.grade }} · {{ material.category }}</p></div></div>
              <button type="button" class="btn btn-ghost btn-sm btn-circle shrink-0 text-base-content/55 hover:text-primary" :aria-label="`${labels.removeComparison.fa}: ${material.sourceIdentifier}`" @click="toggleComparison(material.id)"><X class="size-4" aria-hidden="true" /></button>
            </header>
            <dl class="space-y-3 border-b border-base-300 p-5 pb-4"><div v-for="entry in comparisonIdentityEntries(material)" :key="entry.key" class="flex items-start justify-between gap-4" :class="comparisonIdentityEntryDiffers(entry.key) ? 'rounded-lg bg-primary/[0.045] px-3 py-2.5' : ''" :data-different="comparisonIdentityEntryDiffers(entry.key) ? 'true' : undefined"><dt class="text-xs leading-6 text-base-content/55">{{ entry.label }}</dt><dd class="whitespace-pre-line break-words text-end text-xs font-bold leading-6 text-base-content" lang="en" dir="ltr">{{ entry.value }}</dd></div></dl>
            <dl class="space-y-3 p-5"><div v-for="entry in [...compositionEntries(material), ...mechanicalEntries(material)]" :key="entry.key" class="flex items-start justify-between gap-4 border-b border-base-300/75 pb-3 last:border-b-0 last:pb-0" :class="comparisonEntryDiffers(entry.key) ? 'rounded-lg bg-primary/[0.045] px-3 py-2.5' : ''" :data-different="comparisonEntryDiffers(entry.key) ? 'true' : undefined"><dt class="text-xs leading-6 text-base-content/55">{{ entry.label || entry.key }}</dt><dd class="whitespace-pre-line break-words text-end text-xs font-bold leading-6 text-base-content" lang="en" dir="ltr">{{ entry.value }}</dd></div></dl>
          </article>
        </div>
      </section>
    </div>

    <div v-if="comparisonRecords.length" class="fixed inset-x-0 bottom-0 z-40 px-3 pb-3 sm:px-6" role="region" :aria-label="labels.comparison.fa">
      <div class="mx-auto flex w-full max-w-3xl items-center justify-between gap-3 rounded-xl border border-primary/20 bg-base-100/95 px-4 py-3 backdrop-blur md:px-5">
        <p class="min-w-0 text-sm leading-6"><span class="font-bold text-primary" lang="en" dir="ltr">{{ comparisonRecords.length }} / 3</span><span class="ms-1 text-base-content/70">{{ labels.comparisonSelected.fa }}</span></p>
        <button type="button" class="btn btn-primary min-h-10 shrink-0 rounded-lg px-3 text-xs sm:px-4" @click="scrollToComparison">{{ labels.comparison.fa }}<ArrowLeft class="size-4" aria-hidden="true" /></button>
      </div>
    </div>
  </ResourcePage>
</template>

<script setup lang="ts">
import { ArrowLeft, Check, Plus, RotateCcw, Search, SearchX, X } from 'lucide-vue-next'
import ResourcePage from '~/components/resources/ResourcePage.vue'
import ToolReferencePanel from '~/components/resources/ToolReferencePanel.vue'
import { chemicalCompositionOrder, mechanicalPropertyOrder, type ChemicalCompositionKey, type MaterialDataset, type MaterialRecord, type MechanicalPropertyKey } from '~/data/materials'
import { resourcesCopy, type ResourceText } from '~/data/resources'

interface MaterialToolCopy {
  eyebrow: ResourceText
  title: ResourceText
  description: ResourceText
  badge: ResourceText
  reference: ResourceText
  referenceBasis: ResourceText
  referenceNote: ResourceText
}

const props = defineProps<{ dataset: MaterialDataset; copy: MaterialToolCopy }>()
const labels = resourcesCopy.materialReference
const dataset = props.dataset
const copy = props.copy
const searchQuery = ref('')
const searchOpen = ref(false)
const activeSuggestionIndex = ref(-1)
const searchInputRef = ref<HTMLInputElement | null>(null)
const selectedSpecification = ref('')
const selectedGrade = ref('')
const selectedCategory = ref('')
const selectedMaterialId = ref('')
const comparisonIds = ref<string[]>([])
const comparisonRef = ref<HTMLElement | null>(null)
const detailRef = ref<HTMLElement | null>(null)
let searchCloseTimer: ReturnType<typeof setTimeout> | undefined

function uniqueSorted(values: string[]) {
  return [...new Set(values)].sort((a, b) => a.localeCompare(b, 'en', { numeric: true }))
}

const specifications = computed(() => uniqueSorted(dataset.records.map(record => record.specification || '—')))
const grades = computed(() => uniqueSorted(dataset.records.map(record => record.grade)))
const categories = computed(() => uniqueSorted(dataset.records.map(record => record.category)))

function normaliseSearch(value: string) {
  return value.toLocaleUpperCase('en-US').normalize('NFKD').replace(/[^A-Z0-9]+/g, '')
}

function controlDirection() {
  // Keep native selects in the page's RTL flow even when their option values are English.
  return 'rtl'
}

function formatCategory(value: string) {
  return value.replace(/\s*\n\s*/g, ' · ')
}

function displayValue(value: string | undefined) {
  return value === undefined || value === '' ? labels.notSpecified.en : value
}

function materialSearchText(material: MaterialRecord) {
  return normaliseSearch([
    material.sourceIdentifier,
    material.specification,
    material.grade,
    material.category,
    ...(material.sourceNotes || []),
  ].filter(Boolean).join(' '))
}

const suggestedMaterials = computed(() => {
  const query = normaliseSearch(searchQuery.value)
  return query ? dataset.records.filter(material => materialSearchText(material).includes(query)) : dataset.records
})
const activeSuggestion = computed(() => suggestedMaterials.value.slice(0, 8)[activeSuggestionIndex.value])

const filteredMaterials = computed(() => {
  const query = normaliseSearch(searchQuery.value)
  return dataset.records.filter(material => {
    const specification = material.specification || '—'
    return (!query || materialSearchText(material).includes(query))
      && (!selectedSpecification.value || specification === selectedSpecification.value)
      && (!selectedGrade.value || material.grade === selectedGrade.value)
      && (!selectedCategory.value || material.category === selectedCategory.value)
  })
})

const selectedMaterial = computed(() => filteredMaterials.value.find(material => material.id === selectedMaterialId.value) || filteredMaterials.value[0])
const hasActiveFilters = computed(() => Boolean(searchQuery.value || selectedSpecification.value || selectedGrade.value || selectedCategory.value))
const comparisonRecords = computed(() => comparisonIds.value.map(id => dataset.records.find(record => record.id === id)).filter((record): record is MaterialRecord => Boolean(record)))

function sourceValuesDiffer(values: (string | undefined)[]) {
  return new Set(values.map(value => value ?? '')).size > 1
}

function comparisonEntryDiffers(key: string) {
  if ((chemicalCompositionOrder as readonly string[]).includes(key)) {
    return sourceValuesDiffer(comparisonRecords.value.map(record => record.chemicalComposition[key as ChemicalCompositionKey]))
  }
  return sourceValuesDiffer(comparisonRecords.value.map(record => record.mechanicalProperties[key as MechanicalPropertyKey]))
}

watch(filteredMaterials, materials => {
  if (!materials.some(material => material.id === selectedMaterialId.value)) selectedMaterialId.value = materials[0]?.id || ''
}, { immediate: true })

function openSearchSuggestions() {
  if (searchCloseTimer) clearTimeout(searchCloseTimer)
  searchOpen.value = true
  activeSuggestionIndex.value = -1
}

function onSearchInput() {
  searchOpen.value = true
  activeSuggestionIndex.value = -1
}

function scheduleSearchClose() {
  searchCloseTimer = setTimeout(closeSearchSuggestions, 120)
}

function closeSearchSuggestions() {
  if (searchCloseTimer) clearTimeout(searchCloseTimer)
  searchCloseTimer = undefined
  searchOpen.value = false
  activeSuggestionIndex.value = -1
}

function moveSuggestion(step: number) {
  if (!searchOpen.value) searchOpen.value = true
  const options = suggestedMaterials.value.slice(0, 8)
  if (!options.length) return
  activeSuggestionIndex.value = activeSuggestionIndex.value < 0
    ? (step > 0 ? 0 : options.length - 1)
    : (activeSuggestionIndex.value + step + options.length) % options.length
}

function selectActiveSuggestion() {
  const material = suggestedMaterials.value.slice(0, 8)[activeSuggestionIndex.value]
  if (material) selectSuggestion(material)
}

function clearFilters() {
  searchQuery.value = ''
  selectedSpecification.value = ''
  selectedGrade.value = ''
  selectedCategory.value = ''
  closeSearchSuggestions()
}

function clearSearch() {
  searchQuery.value = ''
  openSearchSuggestions()
  nextTick(() => searchInputRef.value?.focus())
}

function selectSuggestion(material: MaterialRecord) {
  searchQuery.value = material.sourceIdentifier
  selectedMaterialId.value = material.id
  closeSearchSuggestions()
  nextTick(() => searchInputRef.value?.focus())
}

function selectMaterial(material: MaterialRecord) {
  selectedMaterialId.value = material.id
  if (import.meta.client && window.innerWidth < 1280) {
    nextTick(() => detailRef.value?.scrollIntoView({ behavior: 'smooth', block: 'start' }))
  }
}

function isCompared(id: string) {
  return comparisonIds.value.includes(id)
}

function toggleComparison(id: string) {
  if (isCompared(id)) comparisonIds.value = comparisonIds.value.filter(item => item !== id)
  else if (comparisonIds.value.length < 3) comparisonIds.value = [...comparisonIds.value, id]
}

function compositionEntries(material: MaterialRecord) {
  return chemicalCompositionOrder.map(key => ({ key, value: displayValue(material.chemicalComposition[key]) }))
}

function mechanicalEntries(material: MaterialRecord) {
  const labelsByKey = {
    tensileStrengthMin: labels.tensileStrengthMin.fa,
    yieldStrengthMin: labels.yieldStrengthMin.fa,
    elongationBreak: labels.elongationBreak.fa,
    reductionOfArea: labels.reductionOfArea.fa,
    hardnessMax: labels.hardnessMax.fa,
  }
  return mechanicalPropertyOrder.map(key => ({ key, label: labelsByKey[key], value: displayValue(material.mechanicalProperties[key]) }))
}

function comparisonIdentityEntries(material: MaterialRecord) {
  return [
    { key: 'specification', label: labels.specification.fa, value: displayValue(material.specification) },
    { key: 'grade', label: labels.grade.fa, value: material.grade },
    { key: 'category', label: labels.family.fa, value: material.category },
  ]
}

function comparisonIdentityEntryDiffers(key: string) {
  return sourceValuesDiffer(comparisonRecords.value.map(record => {
    if (key === 'specification') return record.specification
    if (key === 'grade') return record.grade
    return record.category
  }))
}

function scrollToComparison() {
  nextTick(() => comparisonRef.value?.scrollIntoView({ behavior: 'smooth', block: 'start' }))
}
</script>
