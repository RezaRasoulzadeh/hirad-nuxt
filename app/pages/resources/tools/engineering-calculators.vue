<template>
  <ResourcePage
    section="tools" compact
    :breadcrumb-parent="{ title: resourcesCopy.tools.title.fa, to: '/resources/tools' }"
    :breadcrumb-title="copy.title.fa"
  >
    <div class="space-y-8">
      <header data-resource-reveal>
        <p class="text-xs font-bold tracking-[0.2em] text-primary uppercase" lang="en" dir="ltr">{{ copy.eyebrow.en }}</p>
        <h1 class="mt-2 text-2xl font-black leading-relaxed md:text-3xl">{{ copy.title.fa }}</h1>
        <p class="mt-3 max-w-3xl text-sm leading-8 text-base-content/65">{{ copy.description.fa }}</p>
      </header>

      <section aria-labelledby="calculator-picker-heading">
        <h2 id="calculator-picker-heading" class="mb-4 text-xl font-bold">{{ copy.choose.fa }}</h2>
        <div ref="tabScroller" class="calculator-tabs-scroll overflow-x-auto rounded-xl border border-base-300 bg-base-100">
          <div role="tablist" :aria-label="copy.choose.fa" class="flex w-max min-w-full border-b border-base-300/70 px-2 sm:px-3">
            <button
              v-for="(item, index) in calculators" :id="`calculator-tab-${item.id}`" :key="item.id"
              type="button" role="tab" :aria-selected="activeId === item.id" aria-controls="calculator-panel"
              :tabindex="activeId === item.id ? 0 : -1"
              class="-mb-px flex min-h-16 min-w-28 flex-1 flex-col items-center justify-center border-b-2 px-2 py-2.5 text-center transition-colors duration-200 focus-visible:relative focus-visible:outline-2 focus-visible:outline-primary sm:px-4"
              :class="activeId === item.id ? 'border-primary bg-primary/[0.035] text-primary' : 'border-transparent text-base-content/65 hover:bg-base-200/60 hover:text-base-content'"
              @click="activateCalculator(item.id, $event)"
              @keydown="onTabKeydown($event, index)"
            >
              <span class="text-[11px] font-medium leading-5">{{ copy.calculators[item.id].group.fa }}</span>
              <span class="text-sm font-bold leading-6">{{ copy.calculators[item.id].title.fa }}</span>
            </button>
          </div>
        </div>
      </section>

      <section id="calculator-panel" role="tabpanel" :aria-labelledby="`calculator-tab-${activeId}`" tabindex="0" class="rounded focus-visible:outline-2 focus-visible:outline-primary">
        <div class="mb-5">
          <h2 id="calculator-workspace-heading" class="text-xl font-bold leading-8">{{ activeCopy.title.fa }}</h2>
          <p class="mt-1 text-sm leading-7 text-base-content/65">{{ activeCopy.description.fa }}</p>
        </div>
        <div class="grid items-start gap-5 xl:grid-cols-[minmax(0,1.1fr)_minmax(19rem,.9fr)]">
          <form class="min-w-0 rounded-xl border border-base-300 bg-base-100 p-5 md:p-6" @submit.prevent>
            <h3 class="mb-5 text-base font-bold">{{ copy.input.fa }}</h3>
            <template v-if="activeId !== 'cvkv'">
              <fieldset class="mb-5">
                <legend class="mb-2 text-sm font-bold">{{ copy.dimensionSource.fa }}</legend>
                <div class="flex flex-wrap gap-2">
                  <button v-for="mode in modes" :key="mode.id" type="button" class="min-h-10 rounded-lg border px-4 text-sm font-bold focus-visible:outline-2 focus-visible:outline-primary" :class="dimensionMode === mode.id ? 'border-primary bg-primary text-primary-content' : 'border-base-300 hover:border-primary/50'" :aria-pressed="dimensionMode === mode.id" @click="dimensionMode = mode.id">{{ mode.title.fa }}</button>
                </div>
              </fieldset>
              <div v-if="dimensionMode === 'catalogue'" class="grid gap-4 sm:grid-cols-3">
                <label class="form-control min-w-0">
                  <span class="mb-2 text-sm font-bold">{{ copy.standard.fa }}</span>
                  <select v-model="standardId" class="select select-bordered h-12 w-full rounded-lg bg-base-100 text-sm focus:border-primary focus:outline-primary" dir="rtl">
                    <option v-for="standard in pipeStandards" :key="standard.id" :value="standard.id">{{ standard.code }}</option>
                  </select>
                </label>
                <label class="form-control min-w-0">
                  <span class="mb-2 text-sm font-bold">{{ copy.nps.fa }}</span>
                  <select v-model="nps" class="select select-bordered h-12 w-full rounded-lg bg-base-100 text-sm focus:border-primary focus:outline-primary" dir="rtl">
                    <option v-for="row in availableNps" :key="row.nps" :value="row.nps">NPS {{ row.nps }}</option>
                  </select>
                </label>
                <label class="form-control min-w-0">
                  <span class="mb-2 text-sm font-bold">{{ copy.schedule.fa }}</span>
                  <select v-model="schedule" class="select select-bordered h-12 w-full rounded-lg bg-base-100 text-sm focus:border-primary focus:outline-primary" dir="rtl">
                    <option v-for="row in availableSchedules" :key="row.schedule" :value="row.schedule">{{ row.schedule }}</option>
                  </select>
                </label>
              </div>
              <div v-else class="grid gap-4 sm:grid-cols-2">
                <div v-for="field in manualDimensionFields" :key="field.id" class="min-w-0">
                  <label :for="`calc-${field.id}`" class="mb-2 block text-sm font-bold">{{ field.label.fa }}</label>
                  <div class="flex min-w-0 gap-2">
                    <input :id="`calc-${field.id}`" v-model="values[field.id]" type="number" inputmode="decimal" step="any" dir="ltr" class="input input-bordered h-12 min-w-0 flex-1 rounded-lg text-start focus:border-primary focus:outline-primary" :aria-label="field.label.en" />
                    <select v-model="units[field.unitKey]" class="select select-bordered h-12 w-24 shrink-0 rounded-lg bg-base-100 text-sm focus:border-primary focus:outline-primary" dir="rtl" :aria-label="`${field.label.fa} — ${copy.unit.fa}`">
                      <option value="mm">mm</option><option value="in">in</option>
                    </select>
                  </div>
                </div>
              </div>
              <p class="mt-3 text-xs leading-6 text-base-content/60">{{ dimensionMode === 'catalogue' ? copy.fromCatalogue.fa : copy.fromManual.fa }}</p>
              <p v-if="dimensionMode === 'catalogue' && pipeRow && scheduleRow" class="mt-1 text-xs text-base-content/65" lang="en" dir="ltr">OD {{ pipeRow.outsideDiameterMm }} mm · t {{ scheduleRow.wallThicknessMm }} mm · ID {{ format(pipeRow.outsideDiameterMm - 2 * scheduleRow.wallThicknessMm) }} mm</p>
            </template>

            <div v-if="extraFields.length" class="mt-5 grid gap-4 sm:grid-cols-2">
              <div v-for="field in extraFields" :key="field.id" class="min-w-0">
                <label :for="`calc-${field.id}`" class="mb-2 block text-sm font-bold">{{ field.label.fa }}</label>
                <div class="flex min-w-0 gap-2">
                  <input :id="`calc-${field.id}`" v-model="values[field.id]" type="number" inputmode="decimal" step="any" dir="ltr" class="input input-bordered h-12 min-w-0 flex-1 rounded-lg text-start focus:border-primary focus:outline-primary" :aria-label="field.label.en" />
                  <select v-model="units[field.unitKey]" class="select select-bordered h-12 w-28 shrink-0 rounded-lg bg-base-100 text-sm focus:border-primary focus:outline-primary" dir="rtl" :aria-label="`${field.label.fa} — ${copy.unit.fa}`">
                    <option v-for="option in field.units" :key="option.value" :value="option.value">{{ option.label }}</option>
                  </select>
                </div>
              </div>
            </div>
          </form>

          <div class="min-w-0 space-y-5">
            <section class="rounded-xl border border-primary/20 bg-primary/[0.025] p-5 md:p-6" aria-labelledby="calculator-result-heading" aria-live="polite">
              <h3 id="calculator-result-heading" class="mb-3 text-base font-bold">{{ copy.output.fa }}</h3>
              <p v-if="calculation.status === 'pending'" class="text-sm leading-7 text-base-content/60">{{ copy.pending.fa }}</p>
              <p v-else-if="calculation.status === 'error'" class="text-sm leading-7 text-error" role="alert">{{ copy.errors[calculation.code].fa }}</p>
              <dl v-else>
                <EngineeringValueRow v-for="row in calculation.rows" :key="`${row.label}-${row.unit || row.value}`" :label="row.label" :value="row.value" :unit="row.unit" :value-lang="row.valueLang" />
              </dl>
            </section>
            <section class="rounded-xl border border-base-300 bg-base-200/60 p-5 md:p-6" aria-labelledby="calculator-basis-heading">
              <h3 id="calculator-basis-heading" class="text-base font-bold">{{ copy.basis.fa }}</h3>
              <p class="mt-3 overflow-x-auto text-sm font-semibold text-primary" lang="en" dir="ltr">{{ activeCopy.formula }}</p>
              <p class="mt-3 text-justify text-sm leading-8 text-base-content/65">{{ activeCopy.note.fa }}</p>
            </section>
          </div>
        </div>
      </section>

      <ToolReferencePanel id="engineering-calculator-reference" :title-fa="copy.references.fa" basis-fa="NIST · NASA · USGS · Fisher · ASME B36.10 / B36.19" :description-fa="copy.referenceNote.fa" />
    </div>
  </ResourcePage>
</template>

<script setup lang="ts">
import ResourcePage from '~/components/resources/ResourcePage.vue'
import ToolReferencePanel from '~/components/resources/ToolReferencePanel.vue'
import EngineeringValueRow from '~/components/resources/EngineeringValueRow.vue'
import { pipeStandards, getPipeNps, getPipeStandard, type PipeStandardId } from '~/data/pipeDimensions'
import { resourcesCopy, type ResourceText } from '~/data/resources'
import {
  CalculationError, calculatePipeGeometry, calculatePipeMass, calculateVelocity,
  calculateFlowRate, calculateReynolds, cvToKv, kvToCv,
  diameterToMeters, lengthToMeters, flowToCubicMetersPerSecond,
  cubicMetersPerSecondToFlow, velocityToMetersPerSecond, metersPerSecondToVelocity,
  densityToKilogramsPerCubicMeter, viscosityToPascalSeconds,
  kilogramsToPounds, kilogramsPerMeterToPoundsPerFoot,
  type CalculationErrorCode, type DiameterUnit, type LengthUnit,
  type FlowUnit, type VelocityUnit, type DensityUnit, type ViscosityUnit,
} from '~/utils/engineeringCalculations'

const copy = resourcesCopy.engineeringCalculators
const calculators = [
  { id: 'geometry' }, { id: 'mass' }, { id: 'velocity' },
  { id: 'flow' }, { id: 'reynolds' }, { id: 'cvkv' },
] as const

type CalculatorId = typeof calculators[number]['id']
type FieldId = 'od' | 'wall' | 'id' | 'length' | 'density' | 'flow' | 'velocity' | 'viscosity' | 'coefficient'
type UnitKey = 'od' | 'wall' | 'id' | 'length' | 'density' | 'flow' | 'velocity' | 'viscosity' | 'coefficient'
interface Field { id: FieldId; unitKey: UnitKey; label: ResourceText; units: { value: string; label: string }[] }
interface ResultRow { label: string; value: string; unit?: string; valueLang?: 'fa' | 'en' }
type CalculationState = { status: 'pending' } | { status: 'error'; code: CalculationErrorCode } | { status: 'done'; rows: ResultRow[] }

const activeId = ref<CalculatorId>('geometry')
const activeCopy = computed(() => copy.calculators[activeId.value])
const tabScroller = ref<HTMLElement | null>(null)
function revealTab(tab: HTMLElement) {
  const scroller = tabScroller.value
  if (!scroller) return
  const tabRect = tab.getBoundingClientRect()
  const scrollRect = scroller.getBoundingClientRect()
  if (tabRect.left < scrollRect.left) scroller.scrollLeft += tabRect.left - scrollRect.left
  else if (tabRect.right > scrollRect.right) scroller.scrollLeft += tabRect.right - scrollRect.right
}
function activateCalculator(id: CalculatorId, event: MouseEvent) {
  activeId.value = id
  revealTab(event.currentTarget as HTMLElement)
}
function onTabKeydown(event: KeyboardEvent, index: number) {
  let nextIndex: number
  if (event.key === 'ArrowLeft') nextIndex = (index + 1) % calculators.length
  else if (event.key === 'ArrowRight') nextIndex = (index - 1 + calculators.length) % calculators.length
  else if (event.key === 'Home') nextIndex = 0
  else if (event.key === 'End') nextIndex = calculators.length - 1
  else return
  event.preventDefault()
  activeId.value = calculators[nextIndex].id
  const tabs = (event.currentTarget as HTMLElement).parentElement?.querySelectorAll<HTMLElement>('[role="tab"]')
  tabs?.[nextIndex]?.focus()
  if (tabs?.[nextIndex]) revealTab(tabs[nextIndex])
}
const dimensionMode = ref<'catalogue' | 'manual'>('catalogue')
const modes = [{ id: 'catalogue', title: copy.catalogue }, { id: 'manual', title: copy.manual }] as const
const standardId = ref<PipeStandardId>('ASME_B36_10')
const nps = ref('4')
const schedule = ref('40')
const availableNps = computed(() => getPipeStandard(standardId.value)?.rows || [])
const pipeRow = computed(() => getPipeNps(standardId.value, nps.value))
const availableSchedules = computed(() => pipeRow.value?.schedules || [])
const scheduleRow = computed(() => availableSchedules.value.find(item => item.schedule === schedule.value))
watch(standardId, () => {
  if (!availableNps.value.some(row => row.nps === nps.value)) nps.value = availableNps.value[0]?.nps || ''
})
watch([standardId, nps], () => {
  if (!availableSchedules.value.some(row => row.schedule === schedule.value)) schedule.value = availableSchedules.value[0]?.schedule || ''
})

const values = reactive<Record<FieldId, string | number>>({ od: '', wall: '', id: '', length: '', density: '', flow: '', velocity: '', viscosity: '', coefficient: '' })
const units = reactive<Record<UnitKey, string>>({ od: 'mm', wall: 'mm', id: 'mm', length: 'm', density: 'kgm3', flow: 'm3h', velocity: 'ms', viscosity: 'mpas', coefficient: 'cv' })
const unitOptions = {
  length: [{ value: 'm', label: 'm' }, { value: 'ft', label: 'ft' }],
  density: [{ value: 'kgm3', label: 'kg/m³' }, { value: 'gcm3', label: 'g/cm³' }],
  flow: [{ value: 'm3h', label: 'm³/h' }, { value: 'ls', label: 'L/s' }, { value: 'usgpm', label: 'US gpm' }],
  velocity: [{ value: 'ms', label: 'm/s' }, { value: 'fts', label: 'ft/s' }],
  viscosity: [{ value: 'mpas', label: 'mPa·s' }, { value: 'pas', label: 'Pa·s' }],
  coefficient: [{ value: 'cv', label: 'Cv' }, { value: 'kv', label: 'Kv' }],
}
const manualDimensionFields = computed<Field[]>(() => activeId.value === 'geometry' || activeId.value === 'mass'
  ? [
      { id: 'od', unitKey: 'od', label: copy.outsideDiameter, units: [] },
      { id: 'wall', unitKey: 'wall', label: copy.wall, units: [] },
    ]
  : [{ id: 'id', unitKey: 'id', label: copy.insideDiameter, units: [] }])
const extraFields = computed<Field[]>(() => {
  const field = (id: FieldId, label: ResourceText, options: { value: string; label: string }[]): Field => ({ id, unitKey: id, label, units: options })
  switch (activeId.value) {
    case 'mass': return [field('length', copy.length, unitOptions.length), field('density', copy.density, unitOptions.density)]
    case 'velocity': return [field('flow', copy.flow, unitOptions.flow)]
    case 'flow': return [field('velocity', copy.velocity, unitOptions.velocity)]
    case 'reynolds': return [field('velocity', copy.velocity, unitOptions.velocity), field('density', copy.density, unitOptions.density), field('viscosity', copy.viscosity, unitOptions.viscosity)]
    case 'cvkv': return [field('coefficient', copy.coefficient, unitOptions.coefficient)]
    default: return []
  }
})

function format(value: number) {
  if (!Number.isFinite(value)) throw new CalculationError('finite')
  if (value !== 0 && (Math.abs(value) >= 1e8 || Math.abs(value) < 1e-4)) return value.toExponential(4)
  return new Intl.NumberFormat('en-US', { maximumSignificantDigits: 5 }).format(value)
}
const row = (label: ResourceText, value: number, unit?: string): ResultRow => ({ label: label.fa, value: format(value), unit })
function entered(id: FieldId): number | undefined {
  const raw = values[id]
  if (String(raw).trim() === '') return undefined
  return Number(raw)
}
function pipeDimensions() {
  if (dimensionMode.value === 'catalogue') {
    if (!pipeRow.value || !scheduleRow.value) return undefined
    return {
      od: diameterToMeters(pipeRow.value.outsideDiameterMm, 'mm'),
      wall: diameterToMeters(scheduleRow.value.wallThicknessMm, 'mm'),
      id: diameterToMeters(pipeRow.value.outsideDiameterMm - 2 * scheduleRow.value.wallThicknessMm, 'mm'),
    }
  }
  if (activeId.value === 'geometry' || activeId.value === 'mass') {
    const od = entered('od'); const wall = entered('wall')
    if (od === undefined || wall === undefined) return undefined
    return { od: diameterToMeters(od, units.od as DiameterUnit), wall: diameterToMeters(wall, units.wall as DiameterUnit), id: 0 }
  }
  const id = entered('id')
  if (id === undefined) return undefined
  return { od: 0, wall: 0, id: diameterToMeters(id, units.id as DiameterUnit) }
}
const calculation = computed<CalculationState>(() => {
  try {
    if (activeId.value === 'cvkv') {
      const coefficient = entered('coefficient')
      if (coefficient === undefined) return { status: 'pending' }
      const cv = units.coefficient === 'cv' ? coefficient : kvToCv(coefficient)
      const kv = units.coefficient === 'kv' ? coefficient : cvToKv(coefficient)
      return { status: 'done', rows: [{ label: 'Cv', value: format(cv) }, { label: 'Kv', value: format(kv) }] }
    }
    const dimensions = pipeDimensions()
    if (!dimensions) return { status: 'pending' }
    const { od, wall, id } = dimensions
    if (activeId.value === 'mass') calculatePipeGeometry(od, wall)
    if (activeId.value !== 'geometry' && activeId.value !== 'mass' && id <= 0) throw new CalculationError('diameter')
    if (activeId.value === 'geometry') {
      const result = calculatePipeGeometry(od, wall)
      return { status: 'done', rows: [
        row(copy.insideDiameter, result.insideDiameterM * 1000, 'mm'),
        row(copy.innerArea, result.internalAreaM2 * 1e6, 'mm²'),
        row(copy.metalArea, result.metalAreaM2 * 1e6, 'mm²'),
        row(copy.innerVolume, result.internalVolumePerMeterM3 * 1000, 'L/m'),
        row(copy.metalVolume, result.metalVolumePerMeterM3 * 1000, 'L/m'),
      ] }
    }
    if (activeId.value === 'mass') {
      const length = entered('length'); const density = entered('density')
      if (length === undefined || density === undefined) return { status: 'pending' }
      const result = calculatePipeMass(od, wall, lengthToMeters(length, units.length as LengthUnit), densityToKilogramsPerCubicMeter(density, units.density as DensityUnit))
      return { status: 'done', rows: [row(copy.massPerMeter, result.massPerMeterKg, 'kg/m'), row(copy.massPerMeter, kilogramsPerMeterToPoundsPerFoot(result.massPerMeterKg), 'lb/ft'), row(copy.totalMass, result.totalMassKg, 'kg'), row(copy.totalMass, kilogramsToPounds(result.totalMassKg), 'lb')] }
    }
    if (activeId.value === 'velocity') {
      const flow = entered('flow')
      if (flow === undefined) return { status: 'pending' }
      const result = calculateVelocity(flowToCubicMetersPerSecond(flow, units.flow as FlowUnit), id)
      return { status: 'done', rows: [row(copy.velocity, result, 'm/s'), row(copy.velocity, metersPerSecondToVelocity(result, 'fts'), 'ft/s')] }
    }
    if (activeId.value === 'flow') {
      const velocity = entered('velocity')
      if (velocity === undefined) return { status: 'pending' }
      const result = calculateFlowRate(velocityToMetersPerSecond(velocity, units.velocity as VelocityUnit), id)
      return { status: 'done', rows: [row(copy.flow, cubicMetersPerSecondToFlow(result, 'm3h'), 'm³/h'), row(copy.flow, cubicMetersPerSecondToFlow(result, 'ls'), 'L/s'), row(copy.flow, cubicMetersPerSecondToFlow(result, 'usgpm'), 'US gpm')] }
    }
    const velocity = entered('velocity'); const density = entered('density'); const viscosity = entered('viscosity')
    if (velocity === undefined || density === undefined || viscosity === undefined) return { status: 'pending' }
    const result = calculateReynolds(velocityToMetersPerSecond(velocity, units.velocity as VelocityUnit), id, densityToKilogramsPerCubicMeter(density, units.density as DensityUnit), viscosityToPascalSeconds(viscosity, units.viscosity as ViscosityUnit))
    return { status: 'done', rows: [row(copy.reynolds, result.reynolds), { label: copy.regime.fa, value: copy[result.regime].fa, valueLang: 'fa' }] }
  } catch (error) {
    if (!(error instanceof CalculationError)) throw error
    return { status: 'error', code: error.code }
  }
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
.calculator-tabs-scroll {
  scrollbar-width: none;
}

.calculator-tabs-scroll::-webkit-scrollbar {
  display: none;
}
</style>
