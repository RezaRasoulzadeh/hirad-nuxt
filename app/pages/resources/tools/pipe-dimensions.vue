<template>
  <ResourcePage
    section="tools"
    compact
    :breadcrumb-parent="{ title: resourcesCopy.tools.title.fa, to: '/resources/tools' }"
    :breadcrumb-title="resourcesCopy.pipeDimensions.title.fa"
  >
    <div class="space-y-8">
      <section data-resource-reveal aria-labelledby="pipe-tool-heading">
        <div class="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p class="text-xs font-bold tracking-[0.2em] text-primary uppercase" lang="en" dir="ltr">{{ resourcesCopy.pipeDimensions.eyebrow.en }}</p>
            <h1 id="pipe-tool-heading" class="mt-2 text-2xl font-black leading-relaxed md:text-3xl">{{ resourcesCopy.pipeDimensions.title.fa }}</h1>
          </div>
          <span class="rounded-full border border-primary/20 bg-primary/5 px-3 py-1.5 text-xs font-bold text-primary" lang="en" dir="ltr">ASME B36.10 / B36.19</span>
        </div>

        <div class="grid gap-5 xl:grid-cols-[minmax(0,1.25fr)_minmax(19rem,0.75fr)]">
          <form class="rounded-xl border border-base-300 bg-base-100 p-5 md:p-6" @submit.prevent>
            <div class="grid gap-5 sm:grid-cols-2">
              <label class="form-control min-w-0">
                <span class="mb-2 text-sm font-bold">{{ resourcesCopy.pipeDimensions.standard.fa }}</span>
                <select v-model="selectedStandardId" lang="en" dir="rtl" class="select select-bordered h-12 w-full rounded-lg bg-base-100 text-end text-sm focus:border-primary focus:outline-primary" :aria-label="resourcesCopy.pipeDimensions.standard.en">
                  <option v-for="standard in pipeStandards" :key="standard.id" :value="standard.id">
                    {{ standard.code }} — {{ standard.title.en }}
                  </option>
                </select>
              </label>

              <label class="form-control min-w-0">
                <span class="mb-2 text-sm font-bold">{{ resourcesCopy.pipeDimensions.nps.fa }}</span>
                <select v-model="selectedNps" class="select select-bordered h-12 w-full rounded-lg bg-base-100 text-sm focus:border-primary focus:outline-primary" :aria-label="resourcesCopy.pipeDimensions.nps.fa">
                  <option v-for="pipe in availableNps" :key="pipe.nps" :value="pipe.nps">
                    NPS {{ pipe.nps }} in
                  </option>
                </select>
                <span class="mt-2 text-xs leading-6 text-base-content/55" lang="en" dir="ltr">OD {{ formatDimension(selectedNpsRow?.outsideDiameterMm, selectedNpsRow?.outsideDiameterIn) }} {{ dimensionUnit }}</span>
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
                  <button v-for="unit in units" :key="unit.id" type="button" role="radio" :aria-checked="unitSystem === unit.id" class="min-h-10 rounded-md px-3 text-xs font-bold transition-colors focus-visible:outline-2 focus-visible:outline-primary" :class="unitSystem === unit.id ? 'bg-primary text-primary-content' : 'text-base-content/60 hover:text-primary'" @click="unitSystem = unit.id">
                    {{ unit.fa }} <span class="ms-1 font-medium opacity-80" lang="en" dir="ltr">{{ unit.en }}</span>
                  </button>
                </div>
              </fieldset>
            </div>

          </form>

          <ToolReferencePanel
            id="pipe-reference-heading"
            :title-fa="resourcesCopy.pipeDimensions.reference.fa"
            :basis-fa="resourcesCopy.pipeDimensions.referenceBasis.fa"
            :description-fa="resourcesCopy.pipeDimensions.sourceNote.fa"
            :detail-fa="`${resourcesCopy.pipeDimensions.standard.fa}: ${selectedStandard?.code || '—'}`"
          />
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
              <EngineeringValueRow :label="resourcesCopy.pipeDimensions.outsideDiameter.fa" :value="formatDimension(selectedNpsRow.outsideDiameterMm, selectedNpsRow.outsideDiameterIn)" :unit="dimensionUnit" />
              <EngineeringValueRow :label="resourcesCopy.pipeDimensions.wallThickness.fa" :value="formatDimension(selectedScheduleRow.wallThicknessMm, selectedScheduleRow.wallThicknessIn)" :unit="dimensionUnit" />
              <EngineeringValueRow :label="resourcesCopy.pipeDimensions.mass.fa" :value="formatMass(selectedScheduleRow.massKgPerM, selectedScheduleRow.massLbPerFt)" :unit="massUnit" />
              <EngineeringValueRow :label="resourcesCopy.pipeDimensions.shippingVolume.fa" :value="formatShippingVolume(selectedNpsRow.shippingVolumeM3PerM, selectedNpsRow.shippingVolumeFt3PerFt)" :unit="shippingVolumeUnit" />
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
          </div>
        </div>
      </section>

      <section v-if="selectedNpsRow" aria-labelledby="pipe-comparison-heading">
        <div class="mb-4 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 id="pipe-comparison-heading" class="text-xl font-bold leading-8">{{ resourcesCopy.pipeDimensions.comparisonTitle.fa }}</h2>
            <p class="mt-1 text-sm leading-7 text-base-content/60">{{ resourcesCopy.pipeDimensions.comparisonDescription.fa }}</p>
          </div>
          <div class="flex flex-wrap items-center gap-2" role="group" :aria-label="resourcesCopy.pipeDimensions.downloadSource.en">
            <span class="me-1 text-xs font-bold text-base-content/55">{{ resourcesCopy.pipeDimensions.downloadSource.fa }}</span>
            <a :href="activeDownload.href" :download="activeDownload.fileName" class="btn btn-outline btn-primary min-h-10 rounded-lg px-3 text-xs" :aria-label="activeDownload.label.en">
              <Download class="size-4" aria-hidden="true" />
              {{ activeDownload.label.fa }}
            </a>
          </div>
        </div>

        <TechnicalTable>
          <thead class="bg-base-200 text-xs text-base-content/65">
            <tr>
              <th scope="col" class="px-5 py-4 text-center font-bold">{{ resourcesCopy.pipeDimensions.scheduleColumn.fa }}</th>
              <th scope="col" class="px-5 py-4 text-center font-bold">{{ resourcesCopy.pipeDimensions.wallThickness.fa }}</th>
              <th scope="col" class="px-5 py-4 text-center font-bold">{{ resourcesCopy.pipeDimensions.insideDiameter.fa }}</th>
              <th scope="col" class="px-5 py-4 text-center font-bold">{{ resourcesCopy.pipeDimensions.mass.fa }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in availableSchedules" :key="item.schedule" class="border-t border-base-300/80 transition-colors hover:bg-base-200/60" :class="item.schedule === selectedSchedule ? 'bg-primary/[0.045]' : ''">
              <th scope="row" class="px-5 py-3 text-center font-bold" lang="en" dir="ltr">
                <button type="button" class="rounded px-2 py-1 text-primary underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-primary" :aria-pressed="item.schedule === selectedSchedule" @click="selectedSchedule = item.schedule">{{ item.schedule }}</button>
              </th>
              <td class="px-5 py-3 text-center" lang="en" dir="ltr">{{ formatDimension(item.wallThicknessMm, item.wallThicknessIn) }} {{ dimensionUnit }}</td>
              <td class="px-5 py-3 text-center" lang="en" dir="ltr">{{ formatDimension(calculatePipeValues(selectedNpsRow, item).insideDiameterMm) }} {{ dimensionUnit }}</td>
              <td class="px-5 py-3 text-center" lang="en" dir="ltr">{{ formatMass(item.massKgPerM, item.massLbPerFt) }} {{ massUnit }}</td>
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
import { Calculator, Download } from 'lucide-vue-next'
import ResourcePage from '~/components/resources/ResourcePage.vue'
import ToolReferencePanel from '~/components/resources/ToolReferencePanel.vue'
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
const activeDownload = computed(() => unitSystem.value === 'metric'
  ? { ...pipeDimensionsSource.downloads.metric, label: resourcesCopy.pipeDimensions.downloadMetric }
  : { ...pipeDimensionsSource.downloads.imperial, label: resourcesCopy.pipeDimensions.downloadImperial })

watch(selectedStandardId, () => {
  selectedNps.value = availableNps.value[0]?.nps || ''
})

watch([selectedStandardId, selectedNps], () => {
  selectedSchedule.value = availableSchedules.value[0]?.schedule || ''
})

function formatNumber(value: number | undefined, fractionDigits: number) {
  if (value === undefined || !Number.isFinite(value)) return '—'
  return new Intl.NumberFormat('en-US', { maximumFractionDigits: fractionDigits, minimumFractionDigits: fractionDigits }).format(value)
}

function formatDimension(valueMm: number | undefined, valueIn?: number) {
  return formatNumber(unitSystem.value === 'metric' ? valueMm : (valueIn ?? (valueMm === undefined ? undefined : millimetresToInches(valueMm))), unitSystem.value === 'metric' ? 2 : 3)
}

function formatMass(valueKgPerM: number | undefined, valueLbPerFt?: number) {
  return formatNumber(unitSystem.value === 'metric' ? valueKgPerM : (valueLbPerFt ?? (valueKgPerM === undefined ? undefined : kilogramsPerMetreToPoundsPerFoot(valueKgPerM))), unitSystem.value === 'metric' ? 2 : 2)
}

function formatArea(value: number) {
  return formatNumber(unitSystem.value === 'metric' ? value : squareMillimetresToSquareInches(value), unitSystem.value === 'metric' ? 0 : 3)
}

function formatVolume(value: number) {
  return formatNumber(unitSystem.value === 'metric' ? value : litresPerMetreToCubicFeetPerFoot(value), unitSystem.value === 'metric' ? 2 : 4)
}

const dimensionUnit = computed(() => unitSystem.value === 'metric' ? 'mm' : 'in')
const massUnit = computed(() => unitSystem.value === 'metric' ? 'kg/m' : 'lb/ft')
const shippingVolumeUnit = computed(() => unitSystem.value === 'metric' ? 'm³/m' : 'ft³/ft')
const areaUnit = computed(() => unitSystem.value === 'metric' ? 'mm²' : 'in²')
const volumeUnit = computed(() => unitSystem.value === 'metric' ? 'L/m' : 'ft³/ft')

function formatShippingVolume(metricValue?: string, imperialValue?: string) {
  const value = unitSystem.value === 'metric' ? metricValue : imperialValue
  return value || '—'
}

useSeoMeta({
  title: resourcesCopy.pipeDimensions.seoTitle.fa,
  description: resourcesCopy.pipeDimensions.description.fa,
  ogTitle: resourcesCopy.pipeDimensions.seoTitle.en,
  ogDescription: resourcesCopy.pipeDimensions.description.en,
  ogType: 'website',
})
</script>
