<template>
  <ResourcePage
    section="tools"
    compact
    :breadcrumb-parent="{ title: resourcesCopy.tools.title.fa, to: '/resources/tools' }"
    :breadcrumb-title="copy.title.fa"
  >
    <div class="space-y-8" :class="comparisonRecords.length ? 'pb-24' : ''">
      <section data-resource-reveal aria-labelledby="material-tool-heading">
        <div class="mb-6">
          <div class="flex flex-wrap items-end justify-between gap-x-4 gap-y-3">
            <div class="min-w-0">
              <p class="text-xs font-bold tracking-[0.2em] text-primary uppercase" lang="en" dir="ltr">{{ copy.eyebrow.en }}</p>
              <h1 id="material-tool-heading" class="mt-2 text-2xl font-black leading-relaxed md:text-3xl">{{ copy.title.fa }}</h1>
            </div>
            <span class="shrink-0 rounded-full border border-primary/20 bg-primary/5 px-3 py-1.5 text-[11px] font-bold text-primary" lang="en" dir="ltr">
              ASTM References · Industry basis
            </span>
          </div>
        </div>

        <div class="material-filter-layout">
          <form class="min-w-0 rounded-xl border border-base-300 bg-base-100 p-5 md:p-6" @submit.prevent>
            <div class="grid gap-5 md:grid-cols-2">
              <div class="form-control relative min-w-0">
                <label for="material-search" class="mb-2 text-sm font-bold">{{ copy.search.fa }}</label>
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
                    :aria-label="copy.clearSearch.fa"
                    @mousedown.prevent
                    @click="clearSearch"
                  >
                    <X class="size-4" aria-hidden="true" />
                  </button>
                  <input
                    id="material-search"
                    ref="searchInputRef"
                    v-model="searchQuery"
                    type="text"
                    role="combobox"
                    autocomplete="off"
                    aria-autocomplete="list"
                    aria-controls="material-suggestions"
                    :aria-expanded="searchOpen"
                    :aria-activedescendant="activeSuggestion?.id ? `material-suggestion-${activeSuggestion.id}` : undefined"
                    :dir="searchQuery ? 'auto' : 'rtl'"
                    :placeholder="copy.searchPlaceholder.fa"
                    class="input input-bordered h-12 w-full appearance-none rounded-lg bg-base-100 pl-10 text-start text-sm focus:border-primary focus:outline-primary"
                    :class="searchQuery ? 'pr-10' : 'pr-3'"
                    @focus="openSearchSuggestions"
                    @input="onSearchInput"
                    @blur="scheduleSearchClose"
                    @keydown.down.prevent="moveSuggestion(1)"
                    @keydown.up.prevent="moveSuggestion(-1)"
                    @keydown.enter.prevent="selectActiveSuggestion"
                    @keydown.esc="closeSearchSuggestions"
                  >
                </span>

                <ul
                  v-if="searchOpen && suggestedMaterials.length"
                  id="material-suggestions"
                  role="listbox"
                  class="absolute inset-x-0 top-full z-30 mt-2 overflow-y-auto overscroll-contain rounded-xl border border-base-300 bg-base-100 p-1.5"
                  style="max-height: 18rem; scrollbar-gutter: stable"
                  dir="ltr"
                >
                  <li v-for="(material, index) in suggestedMaterials" :key="material.id" role="presentation">
                    <button
                      :id="`material-suggestion-${material.id}`"
                      type="button"
                      role="option"
                      tabindex="-1"
                      :aria-selected="activeSuggestionIndex === index"
                      class="flex min-h-12 w-full items-center justify-between gap-3 rounded-lg px-3 py-2 text-left transition-colors hover:bg-primary/5 focus:bg-primary/5 focus:outline-none"
                      :class="activeSuggestionIndex === index ? 'bg-primary/5 text-primary' : 'text-base-content'"
                      @mousedown.prevent="selectSuggestion(material)"
                    >
                      <span class="min-w-0">
                        <span class="block text-sm font-bold">{{ material.sourceIdentifier }}</span>
                        <span class="mt-0.5 block text-[11px] text-base-content/50">{{ material.category }}</span>
                      </span>
                      <span class="shrink-0 text-[11px] font-bold text-primary">{{ material.specification || material.grade }}</span>
                    </button>
                  </li>
                </ul>
              </div>

              <label class="form-control min-w-0">
                <span class="mb-2 text-sm font-bold">{{ copy.specification.fa }}</span>
                <select v-model="selectedSpecification" :dir="controlDirection(selectedSpecification)" class="select select-bordered h-12 w-full rounded-lg bg-base-100 text-start text-sm focus:border-primary focus:outline-primary">
                  <option value="">{{ copy.allSpecifications.fa }}</option>
                  <option v-for="specification in specifications" :key="specification" :value="specification">{{ specification }}</option>
                </select>
              </label>

              <label class="form-control min-w-0">
                <span class="mb-2 text-sm font-bold">{{ copy.grade.fa }}</span>
                <select v-model="selectedGrade" :dir="controlDirection(selectedGrade)" class="select select-bordered h-12 w-full rounded-lg bg-base-100 text-start text-sm focus:border-primary focus:outline-primary">
                  <option value="">{{ copy.allGrades.fa }}</option>
                  <option v-for="grade in grades" :key="grade" :value="grade">{{ grade }}</option>
                </select>
              </label>

              <label class="form-control min-w-0">
                <span class="mb-2 text-sm font-bold">{{ copy.family.fa }}</span>
                <select v-model="selectedCategory" :dir="controlDirection(selectedCategory)" class="select select-bordered h-12 w-full rounded-lg bg-base-100 text-start text-sm focus:border-primary focus:outline-primary">
                  <option value="">{{ copy.allFamilies.fa }}</option>
                  <option v-for="category in categories" :key="category" :value="category">{{ category }}</option>
                </select>
              </label>
            </div>

            <div class="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-base-300 pt-4">
              <p class="text-sm text-base-content/60" aria-live="polite">
                <span class="font-bold text-base-content" lang="en" dir="ltr">{{ filteredMaterials.length }}</span>
                {{ copy.resultCount.fa }}
              </p>
              <button type="button" class="btn btn-ghost min-h-10 rounded-lg px-3 text-xs text-primary" :disabled="!hasActiveFilters" @click="clearFilters">
                <RotateCcw class="size-4" aria-hidden="true" />
                {{ copy.clearFilters.fa }}
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
        <section data-resource-reveal data-resource-delay="70" aria-labelledby="material-results-heading" class="min-w-0 rounded-xl border border-base-300 bg-base-100">
          <header class="flex flex-wrap items-center justify-between gap-3 border-b border-base-300 px-5 py-4 md:px-6">
            <h2 id="material-results-heading" class="text-xl font-bold">{{ copy.results.fa }}</h2>
            <span class="rounded-full bg-base-200 px-3 py-1 text-xs text-base-content/60">
              <bdi lang="en" dir="ltr" class="font-bold text-base-content">{{ filteredMaterials.length }}</bdi>
              {{ copy.resultCount.fa }}
            </span>
          </header>

          <div v-if="filteredMaterials.length" class="divide-y divide-base-300 xl:max-h-288 xl:overflow-y-auto">
            <article v-for="material in filteredMaterials" :key="material.id" class="relative p-4 md:p-5" :class="selectedMaterial?.id === material.id ? 'bg-primary/2.5' : ''">
              <span v-if="selectedMaterial?.id === material.id" class="absolute inset-y-4 inset-s-0 w-0.75 rounded-e-full bg-primary" aria-hidden="true" />
              <button
                type="button"
                class="block w-full rounded-lg text-start focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
                :aria-pressed="selectedMaterial?.id === material.id"
                @click="selectMaterial(material)"
              >
                <span class="flex flex-wrap items-start justify-between gap-3">
                  <span class="min-w-0">
                    <span class="block text-base font-bold text-base-content" lang="en" dir="ltr">{{ material.sourceIdentifier }}</span>
                    <span class="mt-1 block text-xs leading-6 text-base-content/55" lang="en" dir="ltr">{{ material.category }}</span>
                  </span>
                  <span class="rounded-full border border-base-300 bg-base-100 px-2.5 py-1 text-[11px] font-bold text-primary" lang="en" dir="ltr">
                    {{ material.specification || material.grade }}
                  </span>
                </span>
                <span class="mt-4 grid grid-cols-2 gap-3 text-xs">
                  <span>
                    <span class="block text-base-content/50">{{ copy.tensileStrengthMin.fa }}</span>
                    <bdi class="mt-1 block font-bold text-base-content" lang="en" dir="ltr">{{ material.mechanicalProperties.tensileStrengthMin || '—' }}</bdi>
                  </span>
                  <span>
                    <span class="block text-base-content/50">{{ copy.yieldStrengthMin.fa }}</span>
                    <bdi class="mt-1 block font-bold text-base-content" lang="en" dir="ltr">{{ material.mechanicalProperties.yieldStrengthMin || '—' }}</bdi>
                  </span>
                </span>
                <span class="mt-4 flex items-center gap-2 text-xs font-bold text-primary">
                  {{ copy.viewDetails.fa }}
                  <ArrowLeft class="ms-auto size-4" aria-hidden="true" />
                </span>
              </button>

              <button
                type="button"
                class="mt-3 flex min-h-10 w-full items-center justify-center gap-2 rounded-lg border border-base-300 px-3 text-xs font-bold transition-colors hover:border-primary/30 hover:text-primary focus-visible:outline-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-45"
                :class="isCompared(material.id) ? 'border-primary/25 bg-primary/5 text-primary' : 'text-base-content/60'"
                :aria-pressed="isCompared(material.id)"
                :disabled="comparisonIds.length >= comparisonLimit && !isCompared(material.id)"
                @click="toggleComparison(material.id)"
              >
                <Check v-if="isCompared(material.id)" class="size-4" aria-hidden="true" />
                <Plus v-else class="size-4" aria-hidden="true" />
                {{ isCompared(material.id) ? copy.removeComparison.fa : copy.addComparison.fa }}
              </button>
            </article>
          </div>

          <div v-else class="flex flex-col items-center px-6 py-14 text-center" role="status">
            <SearchX class="size-9 text-primary" :stroke-width="1.5" aria-hidden="true" />
            <p class="mt-4 max-w-md text-sm leading-8 text-base-content/60">{{ copy.noResults.fa }}</p>
          </div>
        </section>

        <section ref="detailRef" data-resource-reveal data-resource-delay="140" aria-labelledby="material-detail-heading" class="min-w-0 xl:sticky xl:top-24">
          <div v-if="selectedMaterial" class="overflow-hidden rounded-xl border border-base-300 bg-base-100">
            <header class="border-b border-base-300 bg-base-200/55 px-5 py-5 md:px-6">
              <p class="text-xs font-bold text-primary">{{ copy.selected.fa }}</p>
              <div class="mt-2 flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 id="material-detail-heading" class="text-xl font-black" lang="en" dir="ltr">{{ selectedMaterial.sourceIdentifier }}</h2>
                  <p class="mt-1 text-xs text-base-content/55" lang="en" dir="ltr">{{ selectedMaterial.category }}</p>
                </div>
                <button
                  type="button"
                  class="btn btn-outline btn-primary min-h-10 rounded-lg px-3 text-xs"
                  :disabled="comparisonIds.length >= comparisonLimit && !isCompared(selectedMaterial.id)"
                  @click="toggleComparison(selectedMaterial.id)"
                >
                  <Check v-if="isCompared(selectedMaterial.id)" class="size-4" aria-hidden="true" />
                  <Plus v-else class="size-4" aria-hidden="true" />
                  {{ isCompared(selectedMaterial.id) ? copy.removeComparison.fa : copy.addComparison.fa }}
                </button>
              </div>
            </header>

            <div class="space-y-8 p-5 md:p-6">
              <section aria-labelledby="material-identification-heading">
                <h3 id="material-identification-heading" class="text-base font-bold">{{ copy.identification.fa }}</h3>
                <dl class="mt-4 grid gap-px overflow-hidden rounded-lg border border-base-300 bg-base-300 sm:grid-cols-2">
                  <div class="bg-base-100 p-4">
                    <dt class="text-xs text-base-content/55">{{ copy.sourceIdentifier.fa }}</dt>
                    <dd class="mt-2 text-sm font-bold" lang="en" dir="ltr">{{ selectedMaterial.sourceIdentifier }}</dd>
                  </div>
                  <div class="bg-base-100 p-4">
                    <dt class="text-xs text-base-content/55">{{ copy.specification.fa }}</dt>
                    <dd class="mt-2 text-sm font-bold" lang="en" dir="ltr">{{ selectedMaterial.specification || '—' }}</dd>
                  </div>
                  <div class="bg-base-100 p-4">
                    <dt class="text-xs text-base-content/55">{{ copy.grade.fa }}</dt>
                    <dd class="mt-2 text-sm font-bold" lang="en" dir="ltr">{{ selectedMaterial.grade }}</dd>
                  </div>
                  <div class="bg-base-100 p-4">
                    <dt class="text-xs text-base-content/55">{{ copy.family.fa }}</dt>
                    <dd class="mt-2 text-sm font-bold" lang="en" dir="ltr">{{ selectedMaterial.category }}</dd>
                  </div>
                </dl>
                <div v-if="selectedMaterial.sourceNotes?.length" class="mt-4 rounded-lg border border-primary/15 bg-primary/2.5 p-4">
                  <p class="text-xs font-bold text-primary">{{ copy.sourceNotes.fa }}</p>
                  <ul class="mt-2 space-y-1 text-sm leading-7 text-base-content/70" lang="en" dir="ltr">
                    <li v-for="note in selectedMaterial.sourceNotes" :key="note">{{ note }}</li>
                  </ul>
                </div>
              </section>

              <section aria-labelledby="material-composition-heading">
                <div class="flex flex-wrap items-end justify-between gap-2">
                  <h3 id="material-composition-heading" class="text-base font-bold">{{ copy.composition.fa }}</h3>
                  <p class="text-xs text-base-content/50">{{ copy.compositionNote.fa }}</p>
                </div>
                <dl class="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
                  <div v-for="entry in presentComposition(selectedMaterial)" :key="entry.key" class="min-w-0 rounded-lg border border-base-300 bg-base-100 p-3 text-center">
                    <dt class="text-xs font-bold text-primary" :lang="entry.key === 'Other' ? undefined : 'en'" dir="ltr">{{ chemicalLabel(entry.key) }}</dt>
                    <dd class="mt-2 whitespace-pre-line wrap-break-word text-xs font-bold leading-6 text-base-content" lang="en" dir="ltr">{{ entry.value }}</dd>
                  </div>
                </dl>
              </section>

              <section aria-labelledby="material-mechanical-heading">
                <h3 id="material-mechanical-heading" class="text-base font-bold">{{ copy.mechanical.fa }}</h3>
                <dl class="mt-4 rounded-lg border border-base-300 px-4 md:px-5">
                  <EngineeringValueRow
                    v-for="entry in presentMechanical(selectedMaterial)"
                    :key="entry.key"
                    :label="mechanicalLabel(entry.key)"
                    :value="entry.value"
                  />
                </dl>
              </section>

            </div>
          </div>
        </section>
      </div>

      <section v-if="comparisonRecords.length" ref="comparisonRef" data-resource-reveal aria-labelledby="material-comparison-heading" class="scroll-mt-6 rounded-2xl border border-base-300 bg-base-200/35 p-4 md:p-6">
        <header class="mb-6 rounded-xl border border-base-300 bg-base-100 p-4 md:p-5">
          <div class="flex flex-wrap items-start justify-between gap-4">
            <div class="flex min-w-0 items-start gap-3">
              <span class="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <GitCompareArrows class="size-5" :stroke-width="1.7" aria-hidden="true" />
              </span>
              <div class="min-w-0">
                <div class="flex flex-wrap items-center gap-2">
                  <h2 id="material-comparison-heading" class="text-xl font-bold leading-8">{{ copy.comparison.fa }}</h2>
                  <span class="rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-bold text-primary" lang="en" dir="ltr">{{ comparisonRecords.length }} / {{ comparisonLimit }}</span>
                </div>
                <p class="mt-1 text-sm leading-7 text-base-content/60">{{ copy.comparisonDescription.fa }}</p>
                <p class="mt-1 text-xs leading-6 text-base-content/50">{{ copy.comparisonLimit.fa }}</p>
              </div>
            </div>
            <button type="button" class="btn btn-ghost min-h-10 rounded-lg px-3 text-xs text-primary" @click="comparisonIds = []">
              <X class="size-4" aria-hidden="true" />
              {{ copy.clearComparison.fa }}
            </button>
          </div>
          <p class="mt-4 flex items-center gap-2 border-t border-base-300 pt-3 text-xs leading-6 text-base-content/55">
            <span class="size-2.5 shrink-0 rounded-sm bg-primary/15 ring-1 ring-primary/15" aria-hidden="true" />
            {{ copy.comparisonDifference.fa }}
          </p>
        </header>

        <div class="grid items-start gap-4" :class="comparisonRecords.length === 1 ? 'md:grid-cols-1' : comparisonRecords.length === 2 ? 'md:grid-cols-2' : 'md:grid-cols-2 xl:grid-cols-3'">
          <article v-for="(material, index) in comparisonRecords" :key="material.id" class="relative min-w-0 overflow-hidden rounded-xl border border-base-300 bg-base-100">
            <span class="absolute inset-x-0 top-0 h-1 bg-primary/70" aria-hidden="true" />
            <header class="flex items-start justify-between gap-3 border-b border-base-300 bg-base-100 p-5 pt-6">
              <div class="flex min-w-0 items-start gap-3">
                <span class="flex size-8 shrink-0 items-center justify-center rounded-lg bg-base-200 text-xs font-bold text-base-content/55" lang="en" dir="ltr">{{ index + 1 }}</span>
                <div class="min-w-0">
                  <h3 class="truncate font-bold" lang="en" dir="ltr">{{ material.sourceIdentifier }}</h3>
                  <p class="mt-1 truncate text-xs text-base-content/55" lang="en" dir="ltr">{{ material.specification || '—' }} · {{ material.grade }}</p>
                  <p class="mt-1 truncate text-[11px] text-base-content/45" lang="en" dir="ltr">{{ material.category }}</p>
                </div>
              </div>
              <button type="button" class="btn btn-ghost btn-sm btn-circle shrink-0 text-base-content/55 hover:text-primary" :aria-label="`${copy.removeComparison.fa}: ${material.sourceIdentifier}`" @click="toggleComparison(material.id)">
                <X class="size-4" aria-hidden="true" />
              </button>
            </header>

            <div class="space-y-7 p-5">
              <section class="border-t border-base-300 pt-5 first:border-t-0 first:pt-0">
                <h4 class="flex items-center gap-2 text-sm font-bold"><span class="size-1.5 rounded-full bg-primary" aria-hidden="true" />{{ copy.identification.fa }}</h4>
                <dl class="mt-3 space-y-3">
                  <ComparisonRow :label="copy.specification.fa" :value="material.specification || '—'" :different="comparisonIdentityDifferences.specification" />
                  <ComparisonRow :label="copy.grade.fa" :value="material.grade" :different="comparisonIdentityDifferences.grade" />
                  <ComparisonRow :label="copy.family.fa" :value="material.category" :different="comparisonIdentityDifferences.category" />
                </dl>
              </section>

              <section class="border-t border-base-300 pt-5">
                <h4 class="flex items-center gap-2 text-sm font-bold"><span class="size-1.5 rounded-full bg-primary" aria-hidden="true" />{{ copy.composition.fa }}</h4>
                <dl class="mt-3 space-y-3">
                  <ComparisonRow
                    v-for="key in comparisonCompositionKeys"
                    :key="key"
                    :label="chemicalLabel(key)"
                    :value="material.chemicalComposition[key] || '—'"
                    :different="comparisonCompositionDifferences.has(key)"
                  />
                </dl>
              </section>

              <section class="border-t border-base-300 pt-5">
                <h4 class="flex items-center gap-2 text-sm font-bold"><span class="size-1.5 rounded-full bg-primary" aria-hidden="true" />{{ copy.mechanical.fa }}</h4>
                <dl class="mt-3 space-y-3">
                  <ComparisonRow
                    v-for="key in comparisonMechanicalKeys"
                    :key="key"
                    :label="mechanicalLabel(key)"
                    :value="material.mechanicalProperties[key] || '—'"
                    :different="comparisonMechanicalDifferences.has(key)"
                  />
                </dl>
              </section>
            </div>
          </article>
        </div>
      </section>
    </div>

    <div v-if="comparisonRecords.length" class="fixed inset-x-0 bottom-0 z-40 px-3 pb-3 sm:px-6" role="region" :aria-label="copy.comparison.fa">
      <div class="mx-auto flex w-full max-w-3xl items-center justify-between gap-3 rounded-xl border border-primary/20 bg-base-100/95 px-4 py-3 backdrop-blur md:px-5">
        <p class="min-w-0 text-sm leading-6">
          <span class="font-bold text-primary" lang="en" dir="ltr">{{ comparisonRecords.length }} / {{ comparisonLimit }}</span>
          <span class="ms-1 text-base-content/70">{{ copy.comparisonSelected.fa }}</span>
        </p>
        <button type="button" class="btn btn-primary min-h-10 shrink-0 rounded-lg px-3 text-xs sm:px-4" @click="scrollToComparison">
          {{ copy.viewComparison.fa }}
          <ArrowLeft class="size-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  </ResourcePage>
</template>

<script setup lang="ts">
import { ArrowLeft, Check, GitCompareArrows, Plus, RotateCcw, Search, SearchX, X } from 'lucide-vue-next'
import ResourcePage from '~/components/resources/ResourcePage.vue'
import ToolReferencePanel from '~/components/resources/ToolReferencePanel.vue'
import EngineeringValueRow from '~/components/resources/EngineeringValueRow.vue'
import {
  chemicalCompositionOrder,
  mechanicalPropertyOrder,
  pipeWeldingFittingsMaterials,
  type ChemicalCompositionKey,
  type MaterialRecord,
  type MechanicalPropertyKey,
} from '~/data/materials'
import { resourcesCopy } from '~/data/resources'

const ComparisonRow = defineComponent({
  name: 'MaterialComparisonRow',
  props: {
    label: { type: String, required: true },
    value: { type: String, required: true },
    different: { type: Boolean, default: false },
  },
  setup(props) {
    return () => h('div', {
      class: [
        'flex items-start justify-between gap-4 border-b border-base-300/75 pb-3 last:border-b-0 last:pb-0',
        props.different ? 'rounded-lg bg-primary/[0.045] px-3 py-2.5' : '',
      ],
      'data-different': props.different ? 'true' : undefined,
    }, [
      h('dt', { class: 'text-xs leading-6 text-base-content/55' }, props.label),
      h('dd', { class: 'whitespace-pre-line break-words text-end text-xs font-bold leading-6 text-base-content', lang: 'en', dir: 'ltr' }, props.value),
    ])
  },
})

const copy = resourcesCopy.materialDatabase
const dataset = pipeWeldingFittingsMaterials
const searchQuery = ref('')
const searchOpen = ref(false)
const activeSuggestionIndex = ref(-1)
const searchInputRef = ref<HTMLInputElement | null>(null)
const selectedSpecification = ref('')
const selectedGrade = ref('')
const selectedCategory = ref('')
const selectedMaterial = ref<MaterialRecord | undefined>(dataset.records[0])
const comparisonIds = ref<string[]>([])
const comparisonLimit = 3
const detailRef = ref<HTMLElement | null>(null)
const comparisonRef = ref<HTMLElement | null>(null)
let searchCloseTimer: ReturnType<typeof setTimeout> | undefined

function uniqueSorted(values: (string | undefined)[]) {
  return [...new Set(values.filter((value): value is string => Boolean(value)))]
    .sort((a, b) => a.localeCompare(b, 'en', { numeric: true }))
}

const specifications = computed(() => uniqueSorted(dataset.records.map(record => record.specification)))
const grades = computed(() => uniqueSorted(dataset.records.map(record => record.grade)))
const categories = computed(() => uniqueSorted(dataset.records.map(record => record.category)))

function normaliseSearch(value: string) {
  return value.toLocaleUpperCase('en-US').normalize('NFKD').replace(/[^A-Z0-9]+/g, '')
}

function controlDirection(value: string) {
  return value ? 'auto' : 'rtl'
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
  return query
    ? dataset.records.filter(material => materialSearchText(material).includes(query))
    : dataset.records
})

const activeSuggestion = computed(() => suggestedMaterials.value[activeSuggestionIndex.value])

const filteredMaterials = computed(() => {
  const query = normaliseSearch(searchQuery.value)
  return dataset.records.filter((material) => {
    return (!query || materialSearchText(material).includes(query))
      && (!selectedSpecification.value || material.specification === selectedSpecification.value)
      && (!selectedGrade.value || material.grade === selectedGrade.value)
      && (!selectedCategory.value || material.category === selectedCategory.value)
  })
})

const hasActiveFilters = computed(() => Boolean(
  searchQuery.value || selectedSpecification.value || selectedGrade.value || selectedCategory.value,
))

const comparisonRecords = computed(() => comparisonIds.value
  .map(id => dataset.records.find(record => record.id === id))
  .filter((record): record is MaterialRecord => Boolean(record)))

function sourceValuesDiffer(values: (string | undefined)[]) {
  return new Set(values.map(value => value ?? '')).size > 1
}

const comparisonIdentityDifferences = computed(() => ({
  specification: sourceValuesDiffer(comparisonRecords.value.map(record => record.specification)),
  grade: sourceValuesDiffer(comparisonRecords.value.map(record => record.grade)),
  category: sourceValuesDiffer(comparisonRecords.value.map(record => record.category)),
}))

const comparisonCompositionKeys = computed(() => chemicalCompositionOrder.filter(key =>
  comparisonRecords.value.some(record => record.chemicalComposition[key] !== undefined),
))

const comparisonCompositionDifferences = computed(() => new Set(
  comparisonCompositionKeys.value.filter(key => sourceValuesDiffer(
    comparisonRecords.value.map(record => record.chemicalComposition[key]),
  )),
))

const comparisonMechanicalKeys = computed(() => mechanicalPropertyOrder.filter(key =>
  comparisonRecords.value.some(record => record.mechanicalProperties[key] !== undefined),
))

const comparisonMechanicalDifferences = computed(() => new Set(
  comparisonMechanicalKeys.value.filter(key => sourceValuesDiffer(
    comparisonRecords.value.map(record => record.mechanicalProperties[key]),
  )),
))

function clearFilters() {
  searchQuery.value = ''
  selectedSpecification.value = ''
  selectedGrade.value = ''
  selectedCategory.value = ''
  closeSearchSuggestions()
}

function openSearchSuggestions() {
  if (searchCloseTimer) clearTimeout(searchCloseTimer)
  searchOpen.value = true
  activeSuggestionIndex.value = -1
}

function onSearchInput() {
  searchOpen.value = true
  activeSuggestionIndex.value = -1
}

function clearSearch() {
  searchQuery.value = ''
  openSearchSuggestions()
  nextTick(() => searchInputRef.value?.focus())
}

function scrollToComparison() {
  nextTick(() => comparisonRef.value?.scrollIntoView({ behavior: 'smooth', block: 'start' }))
}

function closeSearchSuggestions() {
  if (searchCloseTimer) clearTimeout(searchCloseTimer)
  searchCloseTimer = undefined
  searchOpen.value = false
  activeSuggestionIndex.value = -1
}

function scheduleSearchClose() {
  searchCloseTimer = setTimeout(closeSearchSuggestions, 120)
}

function moveSuggestion(direction: 1 | -1) {
  if (!searchOpen.value) searchOpen.value = true
  const count = suggestedMaterials.value.length
  if (!count) return
  activeSuggestionIndex.value = activeSuggestionIndex.value < 0
    ? (direction === 1 ? 0 : count - 1)
    : (activeSuggestionIndex.value + direction + count) % count
}

function selectActiveSuggestion() {
  const material = activeSuggestion.value || suggestedMaterials.value[0]
  if (material) selectSuggestion(material)
}

function selectSuggestion(material: MaterialRecord) {
  searchQuery.value = material.sourceIdentifier
  selectedMaterial.value = material
  closeSearchSuggestions()
  nextTick(() => searchInputRef.value?.focus())
}

function selectMaterial(material: MaterialRecord) {
  selectedMaterial.value = material
  if (import.meta.client && window.innerWidth < 1280) {
    nextTick(() => detailRef.value?.scrollIntoView({ behavior: 'smooth', block: 'start' }))
  }
}

function isCompared(id: string) {
  return comparisonIds.value.includes(id)
}

function toggleComparison(id: string) {
  if (isCompared(id)) {
    comparisonIds.value = comparisonIds.value.filter(item => item !== id)
    return
  }
  if (comparisonIds.value.length < comparisonLimit) comparisonIds.value = [...comparisonIds.value, id]
}

function presentComposition(material: MaterialRecord) {
  return chemicalCompositionOrder
    .filter(key => material.chemicalComposition[key] !== undefined)
    .map(key => ({ key, value: material.chemicalComposition[key] as string }))
}

function presentMechanical(material: MaterialRecord) {
  return mechanicalPropertyOrder
    .filter(key => material.mechanicalProperties[key] !== undefined)
    .map(key => ({ key, value: material.mechanicalProperties[key] as string }))
}

function chemicalLabel(key: ChemicalCompositionKey) {
  return key === 'Other' ? 'سایر' : key
}

function mechanicalLabel(key: MechanicalPropertyKey) {
  return copy[key].fa
}

onBeforeUnmount(() => {
  if (searchCloseTimer) clearTimeout(searchCloseTimer)
})

useSeoMeta({
  title: copy.seoTitle.fa,
  description: copy.description.fa,
  ogTitle: copy.seoTitle.en,
  ogDescription: copy.description.en,
  ogType: 'website',
})
</script>

<style scoped>
.material-filter-layout {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

@media (min-width: 1024px) {
  .material-filter-layout {
    display: grid;
    grid-template-columns: minmax(0, 2fr) minmax(20rem, 1fr);
    align-items: stretch;
  }
}
</style>
