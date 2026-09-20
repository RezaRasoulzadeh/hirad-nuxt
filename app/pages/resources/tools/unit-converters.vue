<template>
  <ResourcePage
    section="tools"
    compact
    :breadcrumb-parent="{ title: resourcesCopy.tools.title.fa, to: '/resources/tools' }"
    :breadcrumb-title="copy.title.fa"
  >
    <div class="space-y-8">
      <header data-resource-reveal>
        <p class="text-xs font-bold tracking-[0.2em] text-primary uppercase" lang="en" dir="ltr">{{ copy.eyebrow.en }}</p>
        <h1 class="mt-2 text-2xl font-black leading-relaxed md:text-3xl">{{ copy.title.fa }}</h1>
        <p class="mt-3 max-w-3xl text-sm leading-8 text-base-content/65">{{ copy.description.fa }}</p>
      </header>

      <div class="grid items-start gap-5 lg:grid-cols-[18rem_minmax(0,1fr)] xl:grid-cols-[20rem_minmax(0,1fr)]">
        <aside data-resource-reveal class="rounded-xl border border-base-300 bg-base-100 p-4 lg:sticky lg:top-5" aria-labelledby="converter-category-heading">
          <h2 id="converter-category-heading" class="px-1 text-base font-bold">{{ copy.chooseCategory.fa }}</h2>
          <label class="relative mt-4 block">
            <span class="sr-only">{{ copy.categorySearch.fa }}</span>
            <Search class="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-base-content/45" aria-hidden="true" />
            <input
              v-model="categoryQuery"
              type="search"
              class="input input-bordered h-11 w-full rounded-lg ps-10 pe-3 text-sm focus:border-primary focus:outline-primary"
              :placeholder="copy.categorySearchPlaceholder.fa"
              :aria-label="copy.categorySearch.fa"
            />
          </label>

          <div class="converter-category-list mt-3 max-h-96 space-y-1 overflow-y-auto pe-1">
            <button
              v-for="category in filteredCategories"
              :key="category.id"
              type="button"
              class="w-full rounded-lg border px-3 py-2.5 text-start transition-colors focus-visible:outline-2 focus-visible:outline-primary"
              :class="activeCategoryId === category.id ? 'border-primary/25 bg-primary/[0.045] text-primary' : 'border-transparent text-base-content hover:bg-base-200'"
              :aria-pressed="activeCategoryId === category.id"
              @click="activateCategory(category.id)"
            >
              <span class="block text-sm font-bold leading-6">{{ category.title.fa }}</span>
              <span class="mt-0.5 block text-[11px] leading-5 opacity-65" lang="en" dir="ltr">{{ category.title.en }}</span>
            </button>
            <p v-if="!filteredCategories.length" class="px-2 py-6 text-center text-xs leading-6 text-base-content/60">{{ copy.noCategories.fa }}</p>
          </div>
        </aside>

        <div class="min-w-0 space-y-5">
          <section data-resource-reveal data-resource-delay="70" aria-labelledby="active-converter-heading">
            <div class="mb-5">
              <p class="text-xs font-bold text-primary" lang="en" dir="ltr">{{ activeCategory.title.en }}</p>
              <h2 id="active-converter-heading" class="mt-1 text-xl font-bold leading-8">{{ activeCategory.title.fa }}</h2>
              <p class="mt-1 text-sm leading-7 text-base-content/60">{{ activeCategory.description.fa }}</p>
            </div>

            <div class="grid items-stretch gap-5 xl:grid-cols-[minmax(0,1.1fr)_minmax(19rem,.9fr)]">
              <form class="min-w-0 rounded-xl border border-base-300 bg-base-100 p-5 md:p-6" @submit.prevent>
                <div class="mb-5 flex flex-wrap items-center justify-between gap-3">
                  <h3 class="text-base font-bold">{{ copy.converter.fa }}</h3>
                  <button type="button" class="btn btn-ghost min-h-10 gap-2 rounded-lg px-3 text-xs text-base-content/65 hover:text-primary" @click="resetConverter">
                    <RotateCcw class="size-4" aria-hidden="true" />
                    {{ copy.reset.fa }}
                  </button>
                </div>

                <label for="converter-value" class="mb-2 block text-sm font-bold">{{ copy.value.fa }}</label>
                <input
                  id="converter-value"
                  v-model="inputValue"
                  type="text"
                  inputmode="decimal"
                  autocomplete="off"
                  dir="ltr"
                  class="input input-bordered h-14 w-full rounded-lg text-start text-lg font-bold focus:border-primary focus:outline-primary"
                  :class="parsedInput.status === 'invalid' ? 'border-error' : ''"
                  :aria-invalid="parsedInput.status === 'invalid' ? 'true' : undefined"
                  :aria-describedby="parsedInput.status === 'invalid' ? 'converter-input-error' : undefined"
                  placeholder="0"
                />
                <p v-if="parsedInput.status === 'invalid'" id="converter-input-error" class="mt-2 text-xs leading-6 text-error" role="alert">{{ copy.invalid.fa }}</p>

                <div class="mt-5 grid items-end gap-3 sm:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)]">
                  <label class="min-w-0">
                    <span class="mb-2 block text-sm font-bold">{{ copy.fromUnit.fa }}</span>
                    <select v-model="fromUnitId" class="select select-bordered h-12 w-full rounded-lg bg-base-100 text-start text-sm focus:border-primary focus:outline-primary" dir="rtl">
                      <option v-for="unit in activeCategory.units" :key="unit.id" :value="unit.id" dir="rtl">{{ unit.name.fa }} — ‎{{ unit.symbol }}‎</option>
                    </select>
                  </label>

                  <button
                    type="button"
                    class="btn btn-outline btn-primary mx-auto size-12 min-h-12 rounded-full p-0 sm:mb-0"
                    :aria-label="copy.swap.fa"
                    :title="copy.swap.fa"
                    :disabled="resultState.status !== 'done'"
                    @click="swapUnits"
                  >
                    <ArrowLeftRight class="size-5" aria-hidden="true" />
                  </button>

                  <label class="min-w-0">
                    <span class="mb-2 block text-sm font-bold">{{ copy.toUnit.fa }}</span>
                    <select v-model="toUnitId" class="select select-bordered h-12 w-full rounded-lg bg-base-100 text-start text-sm focus:border-primary focus:outline-primary" dir="rtl">
                      <option v-for="unit in activeCategory.units" :key="unit.id" :value="unit.id" dir="rtl">{{ unit.name.fa }} — ‎{{ unit.symbol }}‎</option>
                    </select>
                  </label>
                </div>
              </form>

              <section class="flex min-w-0 flex-col rounded-xl border border-primary/20 bg-primary/[0.025] p-5 md:p-6" aria-labelledby="converter-result-heading" aria-live="polite">
                <div class="flex items-center justify-between gap-3">
                  <h3 id="converter-result-heading" class="text-base font-bold">{{ copy.result.fa }}</h3>
                  <span class="rounded-full bg-primary/8 px-2.5 py-1 text-[11px] font-bold text-primary" lang="en" dir="ltr">{{ activeTargetUnit.symbol }}</span>
                </div>

                <div class="flex flex-1 flex-col justify-center py-8 text-center">
                  <p v-if="resultState.status === 'pending'" class="text-sm leading-8 text-base-content/60">{{ copy.pending.fa }}</p>
                  <p v-else-if="resultState.status === 'invalid'" class="text-sm leading-8 text-error" role="alert">{{ resultState.reason === 'range' ? copy.outOfRange.fa : copy.invalid.fa }}</p>
                  <template v-else>
                    <p class="text-xs text-base-content/55">{{ activeTargetUnit.name.fa }}</p>
                    <output class="mt-3 block overflow-x-auto py-1 text-3xl font-black tracking-tight text-primary" dir="ltr">
                      <bdi>{{ formatConversionValue(resultState.value) }} {{ activeTargetUnit.symbol }}</bdi>
                    </output>
                    <p class="mt-4 text-xs text-base-content/55" dir="ltr">
                      <bdi>{{ formatConversionValue(parsedNumericValue) }} {{ activeSourceUnit.symbol }}</bdi>
                    </p>
                  </template>
                </div>

                <button
                  type="button"
                  class="btn btn-primary min-h-11 w-full gap-2 rounded-lg text-sm"
                  :disabled="resultState.status !== 'done'"
                  @click="copyConvertedValue('target', resultState.status === 'done' ? resultState.value : 0, activeTargetUnit.symbol)"
                >
                  <Check v-if="copiedKey === 'target'" class="size-4" aria-hidden="true" />
                  <Copy v-else class="size-4" aria-hidden="true" />
                  {{ copiedKey === 'target' ? copy.copied.fa : copy.copy.fa }}
                </button>
                <p v-if="copyFailed" class="mt-2 text-center text-xs text-error" role="status">{{ copy.copyFailed.fa }}</p>
              </section>
            </div>
          </section>

          <section data-resource-reveal data-resource-delay="140" class="rounded-xl border border-base-300 bg-base-100 p-5 md:p-6" aria-labelledby="converter-equivalents-heading">
            <div class="mb-5 flex flex-wrap items-end justify-between gap-3">
              <div>
                <h2 id="converter-equivalents-heading" class="text-xl font-bold leading-8">{{ copy.equivalents.fa }}</h2>
                <p class="mt-1 text-xs leading-6 text-base-content/55">{{ copy.equivalentsDescription.fa }}</p>
              </div>
              <span v-if="resultState.status === 'done'" class="text-xs text-base-content/55" dir="ltr">
                <bdi>{{ formatConversionValue(parsedNumericValue) }} {{ activeSourceUnit.symbol }}</bdi>
              </span>
            </div>

            <p v-if="resultState.status !== 'done'" class="rounded-lg bg-base-200/60 px-4 py-7 text-center text-sm leading-7 text-base-content/60">{{ resultState.status === 'invalid' ? copy.invalid.fa : copy.pending.fa }}</p>
            <ul v-else class="grid gap-3 sm:grid-cols-2">
              <li
                v-for="equivalent in equivalents"
                :key="equivalent.unit.id"
                class="flex min-w-0 items-center gap-3 rounded-lg border p-4"
                :class="equivalent.unit.id === toUnitId ? 'border-primary/25 bg-primary/[0.035]' : 'border-base-300 bg-base-100'"
              >
                <div class="min-w-0 flex-1">
                  <div class="flex flex-wrap items-center gap-x-2 gap-y-1">
                    <span class="text-sm font-bold" lang="en" dir="ltr">{{ equivalent.unit.symbol }}</span>
                    <span v-if="equivalent.unit.id === toUnitId" class="rounded-full bg-primary/8 px-2 py-0.5 text-[10px] font-bold text-primary">{{ copy.selectedTarget.fa }}</span>
                  </div>
                  <p class="mt-1 overflow-x-auto text-base font-bold text-base-content" dir="ltr"><bdi>{{ formatConversionValue(equivalent.value) }}</bdi></p>
                  <p class="mt-1 text-[11px] leading-5 text-base-content/50">{{ equivalent.unit.name.fa }}</p>
                </div>
                <button
                  type="button"
                  class="btn btn-ghost size-10 min-h-10 shrink-0 rounded-lg p-0 text-base-content/55 hover:text-primary"
                  :aria-label="`${copy.copy.fa}: ${equivalent.unit.symbol}`"
                  @click="copyConvertedValue(equivalent.unit.id, equivalent.value, equivalent.unit.symbol)"
                >
                  <Check v-if="copiedKey === equivalent.unit.id" class="size-4" aria-hidden="true" />
                  <Copy v-else class="size-4" aria-hidden="true" />
                </button>
              </li>
            </ul>
          </section>

          <section v-if="activeCategory.note" data-resource-reveal data-resource-delay="180" class="rounded-xl border border-base-300 bg-base-200/60 p-5" aria-labelledby="converter-definition-heading">
            <h2 id="converter-definition-heading" class="text-sm font-bold">{{ copy.definition.fa }}</h2>
            <p class="mt-2 text-sm leading-8 text-base-content/65">{{ activeCategory.note.fa }}</p>
          </section>
        </div>
      </div>

      <ToolReferencePanel
        id="unit-converter-reference"
        :title-fa="copy.references.fa"
        :basis-fa="copy.referenceBasis.fa"
        :description-fa="copy.referenceNote.fa"
      />
    </div>
  </ResourcePage>
</template>

<script setup lang="ts">
import { ArrowLeftRight, Check, Copy, RotateCcw, Search } from 'lucide-vue-next'
import ResourcePage from '~/components/resources/ResourcePage.vue'
import ToolReferencePanel from '~/components/resources/ToolReferencePanel.vue'
import { resourcesCopy } from '~/data/resources'
import {
  getUnitConversionCategory,
  unitConversionCategories,
  type UnitConversionCategoryId,
} from '~/data/unitConversions'
import {
  UnitConversionError,
  convertToAllUnits,
  formatConversionValue,
  parseEngineeringNumber,
  swapUnitConversion,
} from '~/utils/unitConversions'

const copy = resourcesCopy.unitConverters
const firstCategory = unitConversionCategories[0]!
const activeCategoryId = ref<UnitConversionCategoryId>('pressure')
const categoryQuery = ref('')
const inputValue = ref('')
const fromUnitId = ref(firstCategory.defaultFromUnitId)
const toUnitId = ref(firstCategory.defaultToUnitId)
const copiedKey = ref('')
const copyFailed = ref(false)
let copyTimer: ReturnType<typeof setTimeout> | undefined

const activeCategory = computed(() => getUnitConversionCategory(activeCategoryId.value) || firstCategory)
const activeSourceUnit = computed(() => activeCategory.value.units.find(unit => unit.id === fromUnitId.value) || activeCategory.value.units[0]!)
const activeTargetUnit = computed(() => activeCategory.value.units.find(unit => unit.id === toUnitId.value) || activeCategory.value.units[0]!)
const parsedInput = computed(() => parseEngineeringNumber(inputValue.value))
const parsedNumericValue = computed(() => parsedInput.value.status === 'valid' ? parsedInput.value.value : 0)

const filteredCategories = computed(() => {
  const query = categoryQuery.value.trim().toLocaleLowerCase('fa')
  if (!query) return unitConversionCategories
  return unitConversionCategories.filter(category => {
    const searchText = [
      category.title.fa,
      category.title.en,
      category.description.fa,
      category.description.en,
      ...category.units.flatMap(unit => [unit.symbol, unit.name.fa, unit.name.en]),
    ].join(' ').toLocaleLowerCase('fa')
    return searchText.includes(query)
  })
})

type ResultState =
  | { status: 'pending' }
  | { status: 'invalid'; reason: 'syntax' | 'range' }
  | { status: 'done'; value: number; equivalents: ReturnType<typeof convertToAllUnits> }

const resultState = computed<ResultState>(() => {
  if (parsedInput.value.status === 'empty') return { status: 'pending' }
  if (parsedInput.value.status === 'invalid') return { status: 'invalid', reason: 'syntax' }
  try {
    const equivalents = convertToAllUnits(activeCategoryId.value, parsedInput.value.value, fromUnitId.value)
    const target = equivalents.find(equivalent => equivalent.unit.id === toUnitId.value)
    if (!target) throw new UnitConversionError('unit')
    return {
      status: 'done',
      value: target.value,
      equivalents,
    }
  } catch (error) {
    if (error instanceof UnitConversionError && error.code === 'finite') return { status: 'invalid', reason: 'range' }
    throw error
  }
})

const equivalents = computed(() => {
  if (resultState.value.status !== 'done') return []
  return resultState.value.equivalents
    .filter(equivalent => equivalent.unit.id !== fromUnitId.value)
})

function clearCopyState() {
  if (copyTimer) clearTimeout(copyTimer)
  copiedKey.value = ''
  copyFailed.value = false
}

watch([inputValue, fromUnitId, toUnitId], clearCopyState)

function activateCategory(id: UnitConversionCategoryId) {
  activeCategoryId.value = id
  const category = getUnitConversionCategory(id)
  if (!category) return
  fromUnitId.value = category.defaultFromUnitId
  toUnitId.value = category.defaultToUnitId
  clearCopyState()
}

function resetConverter() {
  inputValue.value = ''
  fromUnitId.value = activeCategory.value.defaultFromUnitId
  toUnitId.value = activeCategory.value.defaultToUnitId
  clearCopyState()
}

function swapUnits() {
  if (parsedInput.value.status !== 'valid' || resultState.value.status !== 'done') return
  const swapped = swapUnitConversion(activeCategoryId.value, parsedInput.value.value, fromUnitId.value, toUnitId.value)
  inputValue.value = String(swapped.value)
  fromUnitId.value = swapped.fromUnitId
  toUnitId.value = swapped.toUnitId
  clearCopyState()
}

async function copyConvertedValue(key: string, value: number, symbol: string) {
  clearCopyState()
  try {
    if (!navigator.clipboard?.writeText) throw new Error('Clipboard API unavailable')
    await navigator.clipboard.writeText(`${formatConversionValue(value)} ${symbol}`)
    copiedKey.value = key
    copyTimer = setTimeout(() => { copiedKey.value = '' }, 1800)
  } catch {
    copyFailed.value = true
  }
}

onBeforeUnmount(() => {
  if (copyTimer) clearTimeout(copyTimer)
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
.converter-category-list {
  scrollbar-width: thin;
  scrollbar-color: color-mix(in oklab, var(--color-primary) 22%, transparent) transparent;
}
</style>
