<template>
  <ResourcePage section="tools">
    <div class="space-y-8">
      <section data-resource-reveal aria-labelledby="pipe-tool-heading">
        <div class="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p class="text-xs font-bold tracking-[0.2em] text-primary uppercase" lang="en" dir="ltr">{{ resourcesCopy.pipeDimensions.eyebrow.en }}</p>
            <h2 id="pipe-tool-heading" class="mt-2 text-2xl font-black leading-relaxed md:text-3xl">{{ resourcesCopy.pipeDimensions.title.fa }}</h2>
          </div>
          <span class="rounded-full border border-primary/20 bg-primary/5 px-3 py-1.5 text-xs font-bold text-primary" lang="en" dir="ltr">ASME B36.10 / B36.19</span>
        </div>

        <div class="grid gap-5 xl:grid-cols-[minmax(0,1.25fr)_minmax(19rem,0.75fr)]">
          <form class="rounded-xl border border-base-300 bg-base-100 p-5 shadow-sm md:p-6" @submit.prevent>
            <div class="grid gap-5 sm:grid-cols-2">
              <label class="form-control min-w-0">
                <span class="mb-2 text-sm font-bold">{{ resourcesCopy.pipeDimensions.standard.fa }}</span>
                <select v-model="selectedStandardId" lang="en" dir="ltr" class="select select-bordered h-12 w-full rounded-lg bg-base-100 text-start text-sm focus:border-primary focus:outline-primary" :aria-label="resourcesCopy.pipeDimensions.standard.en">
                  <option v-for="standard in pipeStandards" :key="standard.id" :value="standard.id">
                    {{ standard.code }} — {{ standard.title.en }}
                  </option>
                </select>
                <span class="mt-2 text-xs leading-6 text-base-content/55">{{ selectedStandard?.description.fa }}</span>
              </label>

              <label class="form-control min-w-0">
                <span class="mb-2 text-sm font-bold">{{ resourcesCopy.pipeDimensions.nps.fa }}</span>
                <select v-model="selectedNps" class="select select-bordered h-12 w-full rounded-lg bg-base-100 text-sm focus:border-primary focus:outline-primary" :aria-label="resourcesCopy.pipeDimensions.nps.fa">
                  <option v-for="pipe in availableNps" :key="pipe.nps" :value="pipe.nps">
                    NPS {{ pipe.nps }} in
                  </option>
                </select>
                <span class="mt-2 text-xs leading-6 text-base-content/55" lang="en" dir="ltr">OD {{ selectedNpsRow?.outsideDiameterMm.toFixed(2) }} mm</span>
              </label>

              <label class="form-control min-w-0">
                <span class="mb-2 text-sm font-bold">{{ resourcesCopy.pipeDimensions.schedule.fa }}</span>
                <select v-model="selectedSchedule" class="select select-bordered h-12 w-full rounded-lg bg-base-100 text-sm focus:border-primary focus:outline-primary" :aria-label="resourcesCopy.pipeDimensions.schedule.fa">
                  <option v-for="item in availableSchedules" :key="item.schedule" :value="item.schedule">
                    {{ item.schedule }}
                  </option>
                </select>
                <span class="mt-2 text-xs leading-6 text-base-content/55">{{ availableSchedules.length }} {{ resourcesCopy.pipeDimensions.schedule.fa }}</span>
              </label>

              <fieldset class="min-w-0">
                <legend class="mb-2 text-sm font-bold">{{ resourcesCopy.pipeDimensions.unitSystem.fa }}</legend>
                <div class="grid grid-cols-2 gap-2 rounded-lg bg-base-200 p-1" role="radiogroup" :aria-label="resourcesCopy.pipeDimensions.unitSystem.fa">
                  <button v-for="unit in units" :key="unit.id" type="button" role="radio" :aria-checked="unitSystem === unit.id" class="min-h-10 rounded-md px-3 text-xs font-bold transition-colors focus-visible:outline-2 focus-visible:outline-primary" :class="unitSystem === unit.id ? 'bg-primary text-primary-content shadow-sm' : 'text-base-content/60 hover:text-primary'" @click="unitSystem = unit.id">
                    {{ unit.fa }} <span class="ms-1 font-medium opacity-80" lang="en" dir="ltr">{{ unit.en }}</span>
                  </button>
                </div>
              </fieldset>
            </div>

            <div class="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-base-300 pt-5">
              <p class="text-xs leading-6 text-base-content/55">{{ resourcesCopy.pipeDimensions.sourceNote.fa }}</p>
              <button type="button" class="btn btn-ghost min-h-10 rounded-lg px-4 text-xs" @click="resetTool">{{ resourcesCopy.pipeDimensions.reset.fa }}</button>
            </div>
          </form>

          <aside class="rounded-xl border border-base-300 bg-base-200/60 p-5 md:p-6" aria-labelledby="pipe-reference-heading">
            <div class="flex items-start gap-3">
              <span class="flex size-11 shrink-0 items-center justify-center rounded-lg bg-primary/5 text-primary">
                <FileText class="size-5" :stroke-width="1.6" aria-hidden="true" />
              </span>
              <div>
                <h3 id="pipe-reference-heading" class="text-base font-bold leading-7">{{ resourcesCopy.pipeDimensions.reference.fa }}</h3>
                <p class="mt-1 text-xs leading-6 text-base-content/60" lang="en" dir="ltr">{{ pipeDimensionsSource.reference }}</p>
              </div>
            </div>
            <p class="mt-5 text-sm leading-8 text-base-content/65">{{ resourcesCopy.pipeDimensions.sourceNote.fa }}</p>
            <div class="mt-5 border-t border-base-300 pt-4 text-xs leading-6 text-base-content/55">
              <span class="font-bold text-base-content/75">{{ resourcesCopy.pipeDimensions.standard.fa }}:</span>
              <span class="ms-1" lang="en" dir="ltr">{{ selectedStandard?.code }}</span>
            </div>
          </aside>
        </div>
      </section>

      <section v-if="selectedNpsRow && selectedScheduleRow && calculatedValues" data-resource-reveal data-resource-delay="70" aria-labelledby="pipe-result-heading">
        <div class="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 id="pipe-result-heading" class="text-xl font-bold leading-8">{{ resourcesCopy.pipeDimensions.resultTitle.fa }}</h2>
            <p class="mt-1 text-sm leading-7 text-base-content/60"><span lang="en" dir="ltr">NPS {{ selectedNps }} / {{ selectedSchedule }}</span></p>
          </div>
          <div class="flex flex-wrap items-center gap-2 text-[11px] text-base-content/55">
            <span class="rounded-full bg-primary/5 px-2.5 py-1 text-primary">{{ resourcesCopy.pipeDimensions.sourceValue.fa }}</span>
            <span class="rounded-full bg-base-200 px-2.5 py-1">{{ resourcesCopy.pipeDimensions.calculatedValue.fa }}</span>
          </div>
        </div>

        <div class="grid gap-5 lg:grid-cols-2">
          <div class="rounded-xl border border-base-300 bg-base-100 p-5 md:p-6">
            <div class="mb-3 flex items-center justify-between gap-3">
              <h3 class="text-base font-bold">{{ resourcesCopy.pipeDimensions.resultTitle.fa }}</h3>
              <span class="text-xs text-base-content/55" lang="en" dir="ltr">{{ selectedStandard?.code }}</span>
            </div>
            <dl>
              <EngineeringValueRow :label="resourcesCopy.pipeDimensions.npsLabel.fa" :value="`NPS ${selectedNps} in`" />
              <EngineeringValueRow v-if="selectedNpsRow.dn" :label="resourcesCopy.pipeDimensions.dnLabel.fa" :value="`DN ${selectedNpsRow.dn}`" />
              <EngineeringValueRow :label="resourcesCopy.pipeDimensions.outsideDiameter.fa" :value="formatDimension(selectedNpsRow.outsideDiameterMm)" :unit="dimensionUnit" />
              <EngineeringValueRow :label="resourcesCopy.pipeDimensions.wallThickness.fa" :value="formatDimension(selectedScheduleRow.wallThicknessMm)" :unit="dimensionUnit" />
              <EngineeringValueRow :label="resourcesCopy.pipeDimensions.mass.fa" :value="formatMass(selectedScheduleRow.massKgPerM)" :unit="massUnit" />
            </dl>
          </div>

          <div class="rounded-xl border border-primary/20 bg-primary/[0.025] p-5 md:p-6">
            <div class="mb-3 flex items-center justify-between gap-3">
              <h3 class="text-base font-bold">{{ resourcesCopy.pipeDimensions.calculatedValue.fa }}</h3>
              <Calculator class="size-5 text-primary" :stroke-width="1.5" aria-hidden="true" />
            </div>
            <dl>
              <EngineeringValueRow :label="resourcesCopy.pipeDimensions.insideDiameter.fa" :value="formatDimension(calculatedValues.insideDiameterMm)" :unit="dimensionUnit" />
              <EngineeringValueRow :label="resourcesCopy.pipeDimensions.area.fa" :value="formatArea(calculatedValues.internalAreaMm2)" :unit="areaUnit" />
              <EngineeringValueRow :label="resourcesCopy.pipeDimensions.volume.fa" :value="formatVolume(calculatedValues.internalVolumeLPerM)" :unit="volumeUnit" />
            </dl>
            <p class="mt-4 text-xs leading-6 text-base-content/55">{{ resourcesCopy.pipeDimensions.sourceNote.fa }}</p>
          </div>
        </div>
      </section>

      <section v-if="selectedNpsRow" data-resource-reveal data-resource-delay="120" aria-labelledby="pipe-comparison-heading">
        <div class="mb-4 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 id="pipe-comparison-heading" class="text-xl font-bold leading-8">{{ resourcesCopy.pipeDimensions.comparisonTitle.fa }}</h2>
            <p class="mt-1 text-sm leading-7 text-base-content/60">{{ resourcesCopy.pipeDimensions.comparisonDescription.fa }}</p>
          </div>
          <button type="button" disabled class="btn btn-outline min-h-10 rounded-lg border-base-300 px-4 text-xs text-base-content/50" :title="resourcesCopy.pipeDimensions.exportUnavailable.fa">
            <Download class="size-4" aria-hidden="true" />
            {{ resourcesCopy.pipeDimensions.disabledExport.fa }}
          </button>
        </div>

        <TechnicalTable>
          <thead class="bg-base-200 text-xs text-base-content/65">
            <tr>
              <th scope="col" class="px-5 py-4 font-bold">{{ resourcesCopy.pipeDimensions.scheduleColumn.fa }}</th>
              <th scope="col" class="px-5 py-4 font-bold">{{ resourcesCopy.pipeDimensions.wallThickness.fa }}</th>
              <th scope="col" class="px-5 py-4 font-bold">{{ resourcesCopy.pipeDimensions.insideDiameter.fa }}</th>
              <th scope="col" class="px-5 py-4 font-bold">{{ resourcesCopy.pipeDimensions.mass.fa }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in availableSchedules" :key="item.schedule" class="border-t border-base-300/80 transition-colors hover:bg-base-200/60" :class="item.schedule === selectedSchedule ? 'bg-primary/[0.045]' : ''" :data-resource-reveal="true" :data-resource-delay="Math.min(index * 25, 150)">
              <th scope="row" class="px-5 py-3 text-start font-bold" lang="en" dir="ltr">
                <button type="button" class="rounded px-2 py-1 text-primary underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-primary" :aria-pressed="item.schedule === selectedSchedule" @click="selectedSchedule = item.schedule">{{ item.schedule }}</button>
              </th>
              <td class="px-5 py-3" lang="en" dir="ltr">{{ formatDimension(item.wallThicknessMm) }} {{ dimensionUnit }}</td>
              <td class="px-5 py-3" lang="en" dir="ltr">{{ formatDimension(calculatePipeValues(selectedNpsRow, item).insideDiameterMm) }} {{ dimensionUnit }}</td>
              <td class="px-5 py-3" lang="en" dir="ltr">{{ formatMass(item.massKgPerM) }} {{ massUnit }}</td>
            </tr>
          </tbody>
        </TechnicalTable>
      </section>

      <div v-else class="rounded-xl border border-base-300 bg-base-200/60 p-8 text-center" role="status">
        <p class="text-base font-bold">{{ resourcesCopy.pipeDimensions.unavailable.fa }}</p>
      </div>
    </div>
  </ResourcePage>
</template>

<script setup lang="ts">
import { Calculator, Download, FileText } from 'lucide-vue-next'
import ResourcePage from '~/components/resources/ResourcePage.vue'
import EngineeringValueRow from '~/components/resources/EngineeringValueRow.vue'
import TechnicalTable from '~/components/resources/TechnicalTable.vue'
import { getPipeNps, getPipeStandard, pipeDimensionsSource, pipeStandards, type PipeStandardId } from '~/data/pipeDimensions'
import { calculatePipeValues, kilogramsPerMetreToPoundsPerFoot, litresPerMetreToCubicFeetPerFoot, millimetresToInches, squareMillimetresToSquareInches } from '~/utils/pipeCalculations'
import { resourcesCopy } from '~/data/resources'

const selectedStandardId = ref<PipeStandardId>('ASME_B36_10')
const selectedNps = ref('4')
const selectedSchedule = ref('40')
const unitSystem = ref<'metric' | 'imperial'>('metric')

const units = [
  { id: 'metric', fa: resourcesCopy.pipeDimensions.metric.fa, en: 'mm, kg/m' },
  { id: 'imperial', fa: resourcesCopy.pipeDimensions.imperial.fa, en: 'in, lb/ft' },
] as const

const selectedStandard = computed(() => getPipeStandard(selectedStandardId.value))
const availableNps = computed(() => selectedStandard.value?.rows || [])
const selectedNpsRow = computed(() => getPipeNps(selectedStandardId.value, selectedNps.value))
const availableSchedules = computed(() => selectedNpsRow.value?.schedules || [])
const selectedScheduleRow = computed(() => availableSchedules.value.find(item => item.schedule === selectedSchedule.value))
const calculatedValues = computed(() => selectedNpsRow.value && selectedScheduleRow.value ? calculatePipeValues(selectedNpsRow.value, selectedScheduleRow.value) : undefined)

watch(selectedStandardId, () => {
  selectedNps.value = availableNps.value[0]?.nps || ''
})

watch([selectedStandardId, selectedNps], () => {
  selectedSchedule.value = availableSchedules.value[0]?.schedule || ''
})

function resetTool() {
  selectedStandardId.value = 'ASME_B36_10'
  selectedNps.value = '4'
  selectedSchedule.value = '40'
  unitSystem.value = 'metric'
}

function formatNumber(value: number | undefined, fractionDigits: number) {
  if (value === undefined || !Number.isFinite(value)) return '—'
  return new Intl.NumberFormat('en-US', { maximumFractionDigits: fractionDigits, minimumFractionDigits: fractionDigits }).format(value)
}

function formatDimension(value: number | undefined) {
  return formatNumber(unitSystem.value === 'metric' ? value : (value === undefined ? undefined : millimetresToInches(value)), unitSystem.value === 'metric' ? 2 : 3)
}

function formatMass(value: number | undefined) {
  return formatNumber(unitSystem.value === 'metric' ? value : (value === undefined ? undefined : kilogramsPerMetreToPoundsPerFoot(value)), unitSystem.value === 'metric' ? 2 : 2)
}

function formatArea(value: number) {
  return formatNumber(unitSystem.value === 'metric' ? value : squareMillimetresToSquareInches(value), unitSystem.value === 'metric' ? 0 : 3)
}

function formatVolume(value: number) {
  return formatNumber(unitSystem.value === 'metric' ? value : litresPerMetreToCubicFeetPerFoot(value), unitSystem.value === 'metric' ? 2 : 4)
}

const dimensionUnit = computed(() => unitSystem.value === 'metric' ? 'mm' : 'in')
const massUnit = computed(() => unitSystem.value === 'metric' ? 'kg/m' : 'lb/ft')
const areaUnit = computed(() => unitSystem.value === 'metric' ? 'mm²' : 'in²')
const volumeUnit = computed(() => unitSystem.value === 'metric' ? 'L/m' : 'ft³/ft')

useSeoMeta({
  title: resourcesCopy.pipeDimensions.seoTitle.fa,
  description: resourcesCopy.pipeDimensions.description.fa,
  ogTitle: resourcesCopy.pipeDimensions.seoTitle.en,
  ogDescription: resourcesCopy.pipeDimensions.description.en,
  ogType: 'website',
})
</script>
