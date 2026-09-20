<template>
  <ResourcePage
    section="tools"
    compact
    :breadcrumb-parent="{ title: resourcesCopy.tools.title.fa, to: '/resources/tools' }"
    :breadcrumb-title="copy.title.fa"
  >
    <div class="space-y-8" :class="filteredMaterials.length ? 'pb-6' : ''">
      <section data-resource-reveal aria-labelledby="valve-seat-tool-heading">
        <div class="mb-6 flex flex-wrap items-end justify-between gap-x-4 gap-y-3">
          <div class="min-w-0">
            <p class="text-xs font-bold tracking-[0.2em] text-primary uppercase" lang="en" dir="ltr">{{ copy.eyebrow.en }}</p>
            <h1 id="valve-seat-tool-heading" class="mt-2 text-2xl font-black leading-relaxed md:text-3xl">{{ copy.title.fa }}</h1>
          </div>
          <span class="shrink-0 rounded-full border border-primary/20 bg-primary/5 px-3 py-1.5 text-[11px] font-bold text-primary" lang="en" dir="ltr">Process-industry tool</span>
        </div>

        <div class="valve-seat-filter-layout">
          <form class="min-w-0 rounded-xl border border-base-300 bg-base-100 p-5 md:p-6" @submit.prevent>
            <div class="grid gap-5 md:grid-cols-2">
              <div class="form-control relative min-w-0">
                <span class="mb-2 text-sm font-bold">{{ copy.search.fa }}</span>
                <span class="relative block">
                  <Search class="pointer-events-none absolute top-1/2 z-1 size-4 -translate-y-1/2 text-base-content/45" style="left: 0.75rem !important; right: auto !important;" aria-hidden="true" />
                  <button v-if="searchQuery" type="button" class="absolute top-1/2 z-1 flex size-7 -translate-y-1/2 items-center justify-center rounded-full text-base-content/50 transition-colors hover:bg-base-200 hover:text-base-content focus-visible:outline-2 focus-visible:outline-primary" style="right: 0.75rem !important; left: auto !important;" :aria-label="copy.clearSearch.fa" @mousedown.prevent @click="clearSearch">
                    <X class="size-4" aria-hidden="true" />
                  </button>
                  <input
                    ref="searchInputRef"
                    v-model="searchQuery"
                    type="search"
                    role="combobox"
                    autocomplete="off"
                    aria-autocomplete="list"
                    aria-controls="valve-seat-suggestions"
                    :aria-expanded="searchOpen"
                    :aria-activedescendant="activeSuggestion?.id ? `valve-seat-suggestion-${activeSuggestion.id}` : undefined"
                    :placeholder="copy.searchPlaceholder.fa"
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
                <ul v-if="searchOpen && suggestedMaterials.length" id="valve-seat-suggestions" role="listbox" class="absolute inset-x-0 top-full z-30 mt-2 overflow-y-auto overscroll-contain rounded-xl border border-base-300 bg-base-100 p-1.5" style="max-height: 18rem; scrollbar-gutter: stable" dir="ltr">
                  <li v-for="(material, index) in suggestedMaterials" :key="material.id" role="presentation">
                    <button :id="`valve-seat-suggestion-${material.id}`" type="button" role="option" tabindex="-1" :aria-selected="activeSuggestionIndex === index" class="flex min-h-12 w-full items-center justify-between gap-3 rounded-lg px-3 py-2 text-left transition-colors hover:bg-primary/5 focus:bg-primary/5 focus:outline-none" :class="activeSuggestionIndex === index ? 'bg-primary/5 text-primary' : 'text-base-content'" @mousedown.prevent="selectSuggestion(material)">
                      <span class="min-w-0"><span class="block text-sm font-bold">{{ material.tradeMark }}</span><span class="mt-0.5 block text-[11px] text-base-content/50">{{ material.fullName }}</span></span>
                      <span class="shrink-0 text-[11px] font-bold text-primary">{{ material.temperatureText || copy.notSpecified.fa }}</span>
                    </button>
                  </li>
                </ul>
              </div>

              <div ref="characteristicsMenuRef" class="form-control relative min-w-0">
                <span class="mb-2 text-sm font-bold">{{ copy.characteristicsShort.fa }}</span>
                <button
                  id="valve-seat-characteristics"
                  type="button"
                  class="flex h-12 w-full items-center justify-between gap-3 rounded-lg border border-base-300 bg-base-100 px-3 text-start text-sm text-base-content transition-colors hover:border-primary/40 focus:border-primary focus:outline-2 focus:outline-primary"
                  aria-haspopup="listbox"
                  :aria-expanded="characteristicsOpen"
                  aria-controls="valve-seat-characteristics-options"
                  @click="toggleCharacteristicsMenu"
                  @keydown.esc="closeCharacteristicsMenu"
                >
                  <span class="min-w-0 truncate">{{ selectedCharacteristicSummary }}</span>
                  <ChevronDown class="size-4 shrink-0 text-base-content/50 transition-transform" :class="characteristicsOpen ? 'rotate-180' : ''" aria-hidden="true" />
                </button>
                <div v-if="characteristicsOpen" id="valve-seat-characteristics-options" class="absolute inset-x-0 top-full z-30 mt-2 overflow-hidden rounded-xl border border-base-300 bg-base-100 p-1.5" dir="rtl">
                  <ul role="listbox" aria-multiselectable="true" class="max-h-60 overflow-y-auto">
                    <li v-for="characteristic in dataset.characteristics" :key="characteristic.id">
                      <button
                        type="button"
                        role="option"
                        :aria-selected="selectedCharacteristics.includes(characteristic.id)"
                        class="flex min-h-10 w-full items-center gap-2 rounded-lg px-2.5 py-2 text-start text-sm transition-colors hover:bg-primary/5 focus:bg-primary/5 focus:outline-none"
                        :class="selectedCharacteristics.includes(characteristic.id) ? 'bg-primary/5 text-primary' : 'text-base-content'"
                        @click="toggleCharacteristic(characteristic.id)"
                      >
                        <span class="flex size-4 shrink-0 items-center justify-center rounded border" :class="selectedCharacteristics.includes(characteristic.id) ? 'border-primary bg-primary text-primary-content' : 'border-base-content/30'">
                          <Check v-if="selectedCharacteristics.includes(characteristic.id)" class="size-3" stroke-width="2.5" aria-hidden="true" />
                        </span>
                        <span class="min-w-0 truncate">{{ characteristic.fa }}</span>
                        <span class="ms-auto shrink-0 text-[10px] text-base-content/45" lang="en" dir="ltr">{{ characteristic.en }}</span>
                      </button>
                    </li>
                  </ul>
                </div>
              </div>

              <div class="grid min-w-0 grid-cols-[minmax(0,1fr)_9rem] gap-2" dir="rtl">
                <label class="form-control min-w-0">
                  <span class="mb-2 text-start text-sm font-bold" dir="rtl">{{ copy.temperature.fa }}</span>
                  <input v-model="temperatureValue" type="number" inputmode="decimal" placeholder="—" class="valve-seat-number input input-bordered h-12 w-full rounded-lg bg-base-100 text-start text-sm focus:border-primary focus:outline-primary" lang="en" dir="ltr" />
                </label>
                <label class="form-control min-w-0">
                  <span class="mb-2 text-start text-sm font-bold" dir="rtl">{{ copy.temperatureUnit.fa }}</span>
                  <select v-model="temperatureUnit" class="select select-bordered h-12 w-full rounded-lg bg-base-100 text-start text-sm focus:border-primary focus:outline-primary" dir="rtl">
                    <option value="F">{{ copy.fahrenheit.fa }}</option>
                    <option value="C">{{ copy.celsius.fa }}</option>
                  </select>
                </label>
              </div>

              <div class="grid min-w-0 grid-cols-[minmax(0,1fr)_9rem] gap-2" dir="rtl">
                <label class="form-control min-w-0">
                  <span class="mb-2 text-start text-sm font-bold" dir="rtl">{{ copy.pressure.fa }}</span>
                  <input v-model="pressureValue" type="number" inputmode="decimal" min="0" placeholder="—" class="valve-seat-number input input-bordered h-12 w-full rounded-lg bg-base-100 text-start text-sm focus:border-primary focus:outline-primary" lang="en" dir="ltr" />
                </label>
                <label class="form-control min-w-0">
                  <span class="mb-2 text-start text-sm font-bold" dir="rtl">{{ copy.pressureUnit.fa }}</span>
                  <select v-model="pressureUnit" class="select select-bordered h-12 w-full rounded-lg bg-base-100 text-start text-sm focus:border-primary focus:outline-primary" dir="rtl">
                    <option value="bar">{{ copy.bar.fa }}</option>
                    <option value="psi">{{ copy.psi.fa }}</option>
                  </select>
                </label>
              </div>
            </div>

            <div class="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-base-300 pt-4">
              <p class="text-sm text-base-content/60" aria-live="polite">
                <span class="font-bold text-base-content" lang="en" dir="ltr">{{ filteredMaterials.length }}</span>
                {{ copy.resultCount.fa }}
              </p>
              <button type="button" class="btn btn-ghost min-h-10 rounded-lg px-3 text-xs text-primary" :disabled="!hasActiveCriteria" @click="resetCriteria">
                <RotateCcw class="size-4" aria-hidden="true" />
                {{ copy.reset.fa }}
              </button>
            </div>
            <p class="mt-3 text-xs leading-6 text-base-content/50">{{ copy.filterNote.fa }}</p>
          </form>

          <ToolReferencePanel
            id="valve-seat-reference-heading"
            :title-fa="copy.sourceTitle.fa"
            :basis-fa="copy.referenceBasis.fa"
            :description-fa="copy.sourceDescription.fa"
            :detail-fa="copy.sourceBoundary.fa"
          />
        </div>
      </section>

      <section data-resource-reveal data-resource-delay="70" aria-labelledby="valve-seat-results-heading">
        <div class="mb-4 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 id="valve-seat-results-heading" class="text-xl font-bold leading-8">{{ copy.results.fa }}</h2>
          </div>
          <span class="rounded-full bg-primary/5 px-3 py-1.5 text-xs font-bold text-primary" lang="en" dir="ltr">{{ filteredMaterials.length }} / {{ dataset.records.length }}</span>
        </div>

        <div v-if="unknownMaterials.length && hasNumericCriteria" class="mb-5 rounded-xl border border-warning/30 bg-warning/5 p-4" role="status">
          <p class="text-sm font-bold">{{ unknownMaterials.length }} {{ copy.unknownCount.fa }}</p>
          <p class="mt-1 text-sm leading-7 text-base-content/65">{{ copy.unknownHelp.fa }}</p>
        </div>

        <div v-if="filteredMaterials.length" class="grid gap-4 lg:grid-cols-2">
          <article v-for="material in filteredMaterials" :key="material.id" class="min-w-0 rounded-xl border border-base-300 bg-base-100 p-5">
            <header class="flex items-start justify-between gap-4 border-b border-base-300 pb-4" :dir="textDirection(material.tradeMark)">
              <div class="min-w-0">
                <h3 class="text-lg font-bold" :class="textDirection(material.tradeMark) === 'ltr' ? 'text-left' : 'text-right'" :dir="textDirection(material.tradeMark)">{{ material.tradeMark }}</h3>
                <p class="mt-1 text-sm leading-7 text-base-content/65" :class="textDirection(material.fullName) === 'ltr' ? 'text-left' : 'text-right'" :dir="textDirection(material.fullName)">{{ material.fullName }}</p>
              </div>
              <span class="shrink-0 rounded-full bg-primary/5 px-2.5 py-1 text-xs font-bold text-primary" dir="auto">{{ material.color }}</span>
            </header>

            <dl class="mt-4 grid gap-px overflow-hidden rounded-lg border border-base-300 bg-base-300 sm:grid-cols-2">
              <div class="bg-base-100 p-3">
                <dt class="text-xs text-base-content/55">{{ copy.pressureValue.fa }}</dt>
                <dd class="mt-1 text-sm font-bold" lang="en" dir="ltr">{{ material.pressureText || copy.notSpecified.fa }}</dd>
              </div>
              <div class="bg-base-100 p-3">
                <dt class="text-xs text-base-content/55">{{ copy.temperatureValue.fa }}</dt>
                <dd class="mt-1 text-sm font-bold" lang="en" dir="ltr">{{ material.temperatureText || copy.notSpecified.fa }}</dd>
              </div>
            </dl>

            <div class="mt-4 flex flex-wrap gap-2">
              <span v-for="characteristic in materialCharacteristicLabels(material)" :key="characteristic.id" class="rounded-full border border-base-300 bg-base-200 px-2.5 py-1 text-[11px] text-base-content/70">{{ characteristic.fa }}</span>
            </div>

            <details class="mt-5 rounded-xl border border-base-300 bg-base-200/25 p-4">
              <summary class="flex cursor-pointer items-center gap-2 text-sm font-bold text-primary">
                <span dir="rtl">{{ copy.viewDetails.fa }}</span>
                <span class="text-xs font-medium text-base-content/50" lang="en" dir="ltr">{{ copy.viewDetails.en }}</span>
              </summary>
              <div class="mt-4 space-y-4">
                <section class="rounded-lg border border-base-300 bg-base-100 p-4">
                  <div class="flex flex-wrap items-baseline justify-between gap-2">
                    <h4 class="text-sm font-bold" dir="rtl">{{ copy.sourceDescriptionLabel.fa }}</h4>
                    <span class="text-xs text-base-content/50" lang="en" dir="ltr">{{ copy.sourceDescriptionLabel.en }}</span>
                  </div>
                  <div class="mt-3 grid gap-3 lg:grid-cols-2">
                    <p class="whitespace-pre-line text-sm leading-7 text-base-content/75" dir="rtl">{{ material.descriptionFa }}</p>
                    <p class="whitespace-pre-line text-sm leading-7 text-base-content/70" lang="en" dir="ltr">{{ material.description }}</p>
                  </div>
                </section>

                <section v-if="material.characteristics.length" class="rounded-lg border border-base-300 bg-base-100 p-4">
                  <div class="flex flex-wrap items-baseline justify-between gap-2">
                    <h4 class="text-sm font-bold" dir="rtl">{{ copy.characteristics.fa }}</h4>
                    <span class="text-xs text-base-content/50" lang="en" dir="ltr">{{ copy.characteristics.en }}</span>
                  </div>
                  <ul class="mt-3 grid gap-2 sm:grid-cols-2">
                    <li v-for="characteristic in materialCharacteristicLabels(material)" :key="characteristic.id" class="rounded-lg border border-base-300 px-3 py-2">
                      <span class="block text-sm" dir="rtl">{{ characteristic.fa }}</span>
                      <span class="mt-0.5 block text-xs text-base-content/50" lang="en" dir="ltr">{{ characteristic.en }}</span>
                    </li>
                  </ul>
                </section>

                <section v-if="material.qualifiers?.length" class="rounded-lg border border-warning/25 bg-warning/5 p-4">
                  <div class="flex flex-wrap items-baseline justify-between gap-2">
                    <h4 class="text-sm font-bold" dir="rtl">{{ copy.qualifiers.fa }}</h4>
                    <span class="text-xs text-base-content/50" lang="en" dir="ltr">{{ copy.qualifiers.en }}</span>
                  </div>
                  <ul class="mt-3 space-y-2">
                    <li v-for="(qualifier, index) in material.qualifiers" :key="qualifier" class="border-s-2 border-warning/50 ps-3">
                      <p class="text-sm leading-7" dir="rtl">{{ material.qualifiersFa?.[index] || qualifier }}</p>
                      <p class="mt-0.5 text-xs leading-6 text-base-content/55" lang="en" dir="ltr">{{ qualifier }}</p>
                    </li>
                  </ul>
                </section>
              </div>
            </details>
          </article>
        </div>

        <div v-else class="rounded-xl border border-base-300 bg-base-200/60 p-8 text-center">
          <SearchX class="mx-auto size-8 text-primary/70" aria-hidden="true" />
          <p class="mt-3 text-base font-bold">{{ copy.noResults.fa }}</p>
          <p class="mt-1 text-sm leading-7 text-base-content/60">{{ copy.noResultsHelp.fa }}</p>
        </div>
      </section>
    </div>
  </ResourcePage>
</template>

<script setup lang="ts">
import { Check, ChevronDown, RotateCcw, Search, SearchX, X } from 'lucide-vue-next'
import ResourcePage from '~/components/resources/ResourcePage.vue'
import ToolReferencePanel from '~/components/resources/ToolReferencePanel.vue'
import { resourcesCopy } from '~/data/resources'
import { valveSeatMaterialDataset, type ValveSeatMaterialRecord, type ValveSeatTemperatureUnit, type ValveSeatUnit } from '~/data/valveSeatMaterials'

const copy = resourcesCopy.valveSeatMaterial
const dataset = valveSeatMaterialDataset
const searchQuery = ref('')
const searchOpen = ref(false)
const activeSuggestionIndex = ref(-1)
const searchInputRef = ref<HTMLInputElement | null>(null)
const temperatureValue = ref('')
const temperatureUnit = ref<ValveSeatTemperatureUnit>('F')
const pressureValue = ref('')
const pressureUnit = ref<ValveSeatUnit>('bar')
const selectedCharacteristics = ref<string[]>([])
const characteristicsOpen = ref(false)
const characteristicsMenuRef = ref<HTMLElement | null>(null)
let searchCloseTimer: ReturnType<typeof setTimeout> | undefined

function textDirection(value: string): 'ltr' | 'rtl' {
  return /[\u0590-\u08FF]/.test(value) ? 'rtl' : 'ltr'
}

function normaliseSearch(value: string) {
  return value.toLocaleUpperCase('en-US').normalize('NFKD').replace(/[^A-Z0-9]+/g, '')
}

function materialSearchText(material: ValveSeatMaterialRecord) {
  return normaliseSearch([
    material.tradeMark,
    material.fullName,
    material.pressureText,
    material.temperatureText,
    material.description,
    material.color,
    material.chemicalProperties.carbon,
    material.chemicalProperties.other,
  ].filter(Boolean).join(' '))
}

const suggestedMaterials = computed(() => {
  const query = normaliseSearch(searchQuery.value)
  return query ? dataset.records.filter(material => materialSearchText(material).includes(query)) : dataset.records
})

const activeSuggestion = computed(() => suggestedMaterials.value[activeSuggestionIndex.value])

function openSearchSuggestions() {
  if (searchCloseTimer) clearTimeout(searchCloseTimer)
  searchOpen.value = true
  activeSuggestionIndex.value = -1
}

function onSearchInput() {
  searchOpen.value = true
  activeSuggestionIndex.value = -1
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

function clearSearch() {
  searchQuery.value = ''
  openSearchSuggestions()
  nextTick(() => searchInputRef.value?.focus())
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

function selectSuggestion(material: ValveSeatMaterialRecord) {
  searchQuery.value = material.tradeMark
  closeSearchSuggestions()
  nextTick(() => searchInputRef.value?.focus())
}

function fahrenheitToCelsius(value: number) {
  return (value - 32) * 5 / 9
}

function celsiusToFahrenheit(value: number) {
  return value * 9 / 5 + 32
}

function psiToBar(value: number) {
  return value * 0.0689475729
}

function barToPsi(value: number) {
  return value / 0.0689475729
}

function numericValue(value: string) {
  if (!value.trim()) return undefined
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : undefined
}

const requestedTemperature = computed(() => numericValue(temperatureValue.value))
const requestedPressure = computed(() => numericValue(pressureValue.value))
const hasNumericCriteria = computed(() => requestedTemperature.value !== undefined || requestedPressure.value !== undefined)
const selectedCharacteristicSummary = computed(() => {
  const selected = dataset.characteristics.filter(characteristic => selectedCharacteristics.value.includes(characteristic.id))
  if (!selected.length) return copy.characteristicsShort.fa
  if (selected.length === 1) return selected[0].fa
  return `${selected[0].fa} + ${selected.length - 1}`
})
const hasActiveCriteria = computed(() => Boolean(searchQuery.value || hasNumericCriteria.value || selectedCharacteristics.value.length))

function temperatureMatches(material: ValveSeatMaterialRecord) {
  if (requestedTemperature.value === undefined) return 'match' as const
  if (material.temperature?.min == null || material.temperature?.max == null) return 'unknown' as const
  const requested = material.temperature.unit === temperatureUnit.value
    ? requestedTemperature.value
    : temperatureUnit.value === 'F'
      ? fahrenheitToCelsius(requestedTemperature.value)
      : celsiusToFahrenheit(requestedTemperature.value)
  return requested >= material.temperature.min && requested <= material.temperature.max ? 'match' as const : 'excluded' as const
}

function pressureMatches(material: ValveSeatMaterialRecord) {
  if (requestedPressure.value === undefined) return 'match' as const
  if (!material.pressure) return 'unknown' as const
  const requested = material.pressure.unit === pressureUnit.value
    ? requestedPressure.value
    : pressureUnit.value === 'bar'
      ? barToPsi(requestedPressure.value)
      : psiToBar(requestedPressure.value)
  return requested <= material.pressure.value ? 'match' as const : 'excluded' as const
}

function characteristicMatches(material: ValveSeatMaterialRecord) {
  return selectedCharacteristics.value.every(characteristic => material.characteristics.includes(characteristic))
}

const filteredMaterials = computed(() => {
  const query = normaliseSearch(searchQuery.value)
  return dataset.records.filter((material) => {
    const numericMatches = temperatureMatches(material) === 'match' && pressureMatches(material) === 'match'
    return (!query || materialSearchText(material).includes(query)) && numericMatches && characteristicMatches(material)
  })
})

const unknownMaterials = computed(() => dataset.records.filter(material => temperatureMatches(material) === 'unknown' || pressureMatches(material) === 'unknown'))
function materialCharacteristicLabels(material: ValveSeatMaterialRecord) {
  return material.characteristics
    .map(id => dataset.characteristics.find(characteristic => characteristic.id === id))
    .filter((characteristic): characteristic is (typeof dataset.characteristics)[number] => Boolean(characteristic))
}

function toggleCharacteristicsMenu() {
  characteristicsOpen.value = !characteristicsOpen.value
}

function closeCharacteristicsMenu() {
  characteristicsOpen.value = false
}

function toggleCharacteristic(id: string) {
  selectedCharacteristics.value = selectedCharacteristics.value.includes(id)
    ? selectedCharacteristics.value.filter(selectedId => selectedId !== id)
    : [...selectedCharacteristics.value, id]
}

function onCharacteristicsOutsidePointerDown(event: PointerEvent) {
  if (characteristicsOpen.value && !characteristicsMenuRef.value?.contains(event.target as Node)) closeCharacteristicsMenu()
}

function resetCriteria() {
  searchQuery.value = ''
  temperatureValue.value = ''
  temperatureUnit.value = 'F'
  pressureValue.value = ''
  pressureUnit.value = 'bar'
  selectedCharacteristics.value = []
  closeSearchSuggestions()
  closeCharacteristicsMenu()
}

onMounted(() => document.addEventListener('pointerdown', onCharacteristicsOutsidePointerDown))
onBeforeUnmount(() => {
  if (searchCloseTimer) clearTimeout(searchCloseTimer)
  document.removeEventListener('pointerdown', onCharacteristicsOutsidePointerDown)
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
.valve-seat-filter-layout {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

@media (min-width: 1024px) {
  .valve-seat-filter-layout {
    display: grid;
    grid-template-columns: minmax(0, 2fr) minmax(20rem, 1fr);
    align-items: stretch;
  }
}

.valve-seat-number::-webkit-inner-spin-button,
.valve-seat-number::-webkit-outer-spin-button {
  margin: 0;
  -webkit-appearance: none;
}

.valve-seat-number {
  -moz-appearance: textfield;
  appearance: textfield;
}

</style>
