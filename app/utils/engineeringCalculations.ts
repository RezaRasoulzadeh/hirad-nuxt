/**
 * Deterministic engineering calculations in SI units. Values from a selected
 * pipe schedule are inputs only; none of these functions assign a design rating.
 *
 * Basis for later engineering review:
 * Geometry: https://www.nist.gov/pml/owm/circumference-area-and-volume
 * Length and unit factors: https://www.nist.gov/pml/owm/si-units-length
 * Flow and mass conversion factors: https://www.nist.gov/pml/special-publication-811/nist-guide-si-appendix-b-conversion-factors/nist-guide-si-appendix-b8
 * Reynolds relationship: https://www.grc.nasa.gov/www/k-12/airplane/reynolds.html
 * Regime boundaries: https://pubs.usgs.gov/of/1988/0707/report.pdf
 * Cv/Kv: https://www.emerson.com/is/content/emerson/en/final-control/flow-controls/documents/cat12_s2.pdf
 */

export type DiameterUnit = 'mm' | 'in'
export type LengthUnit = 'm' | 'ft'
export type FlowUnit = 'm3h' | 'ls' | 'usgpm'
export type VelocityUnit = 'ms' | 'fts'
export type DensityUnit = 'kgm3' | 'gcm3'
export type ViscosityUnit = 'pas' | 'mpas'

export type CalculationErrorCode = 'finite' | 'diameter' | 'wall' | 'length' | 'density' | 'viscosity' | 'flow' | 'velocity' | 'coefficient'

export class CalculationError extends Error {
  readonly code: CalculationErrorCode

  constructor(code: CalculationErrorCode) {
    super(code)
    this.name = 'CalculationError'
    this.code = code
  }
}

const INCH_M = 0.0254
const FOOT_M = 0.3048
const POUND_KG = 0.45359237
const US_GALLON_M3 = 0.003785411784
export const KV_PER_CV = 0.865

function assertFinite(value: number) {
  if (!Number.isFinite(value)) throw new CalculationError('finite')
}

function finiteResult(value: number) {
  assertFinite(value)
  return value
}

function assertPositive(value: number, code: CalculationErrorCode) {
  assertFinite(value)
  if (value <= 0) throw new CalculationError(code)
}

function assertNonNegative(value: number, code: CalculationErrorCode) {
  assertFinite(value)
  if (value < 0) throw new CalculationError(code)
}

export function diameterToMeters(value: number, unit: DiameterUnit) {
  assertFinite(value)
  return finiteResult(value * (unit === 'in' ? INCH_M : 0.001))
}

export function metersToDiameter(value: number, unit: DiameterUnit) {
  assertFinite(value)
  return finiteResult(value / (unit === 'in' ? INCH_M : 0.001))
}

export function lengthToMeters(value: number, unit: LengthUnit) {
  assertFinite(value)
  return finiteResult(value * (unit === 'ft' ? FOOT_M : 1))
}

export function flowToCubicMetersPerSecond(value: number, unit: FlowUnit) {
  assertFinite(value)
  if (unit === 'm3h') return finiteResult(value / 3600)
  if (unit === 'ls') return finiteResult(value / 1000)
  return finiteResult(value * US_GALLON_M3 / 60)
}

export function cubicMetersPerSecondToFlow(value: number, unit: FlowUnit) {
  assertFinite(value)
  if (unit === 'm3h') return finiteResult(value * 3600)
  if (unit === 'ls') return finiteResult(value * 1000)
  return finiteResult(value * 60 / US_GALLON_M3)
}

export function velocityToMetersPerSecond(value: number, unit: VelocityUnit) {
  assertFinite(value)
  return finiteResult(value * (unit === 'fts' ? FOOT_M : 1))
}

export function metersPerSecondToVelocity(value: number, unit: VelocityUnit) {
  assertFinite(value)
  return finiteResult(value / (unit === 'fts' ? FOOT_M : 1))
}

export function densityToKilogramsPerCubicMeter(value: number, unit: DensityUnit) {
  assertFinite(value)
  return finiteResult(value * (unit === 'gcm3' ? 1000 : 1))
}

export function viscosityToPascalSeconds(value: number, unit: ViscosityUnit) {
  assertFinite(value)
  return finiteResult(value * (unit === 'mpas' ? 0.001 : 1))
}

export interface PipeGeometry {
  insideDiameterM: number
  internalAreaM2: number
  metalAreaM2: number
  internalVolumePerMeterM3: number
  metalVolumePerMeterM3: number
}

export function calculatePipeGeometry(outsideDiameterM: number, wallThicknessM: number): PipeGeometry {
  assertPositive(outsideDiameterM, 'diameter')
  assertPositive(wallThicknessM, 'wall')
  if (wallThicknessM * 2 >= outsideDiameterM) throw new CalculationError('wall')

  const insideDiameterM = outsideDiameterM - 2 * wallThicknessM
  const internalAreaM2 = finiteResult(Math.PI * insideDiameterM ** 2 / 4)
  // The difference-of-squares form avoids subtracting two nearly equal areas.
  const metalAreaM2 = finiteResult(Math.PI * wallThicknessM * (outsideDiameterM - wallThicknessM))
  return {
    insideDiameterM,
    internalAreaM2,
    metalAreaM2,
    internalVolumePerMeterM3: internalAreaM2,
    metalVolumePerMeterM3: metalAreaM2,
  }
}

export function calculatePipeMass(outsideDiameterM: number, wallThicknessM: number, lengthM: number, densityKgm3: number) {
  const geometry = calculatePipeGeometry(outsideDiameterM, wallThicknessM)
  assertPositive(lengthM, 'length')
  assertPositive(densityKgm3, 'density')
  const massPerMeterKg = finiteResult(geometry.metalAreaM2 * densityKgm3)
  return { massPerMeterKg, totalMassKg: finiteResult(massPerMeterKg * lengthM) }
}

export function calculateVelocity(flowM3s: number, insideDiameterM: number) {
  assertNonNegative(flowM3s, 'flow')
  assertPositive(insideDiameterM, 'diameter')
  return finiteResult(flowM3s / (Math.PI * insideDiameterM ** 2 / 4))
}

export function calculateFlowRate(velocityMs: number, insideDiameterM: number) {
  assertNonNegative(velocityMs, 'velocity')
  assertPositive(insideDiameterM, 'diameter')
  return finiteResult(velocityMs * Math.PI * insideDiameterM ** 2 / 4)
}

export type FlowRegime = 'stagnant' | 'laminar' | 'transition' | 'turbulent'

export function calculateReynolds(velocityMs: number, insideDiameterM: number, densityKgm3: number, viscosityPas: number) {
  assertNonNegative(velocityMs, 'velocity')
  assertPositive(insideDiameterM, 'diameter')
  assertPositive(densityKgm3, 'density')
  assertPositive(viscosityPas, 'viscosity')
  const reynolds = densityKgm3 * velocityMs * insideDiameterM / viscosityPas
  assertFinite(reynolds)
  const regime: FlowRegime = velocityMs === 0 ? 'stagnant' : reynolds < 2100 ? 'laminar' : reynolds > 4000 ? 'turbulent' : 'transition'
  return { reynolds, regime }
}

export function cvToKv(cv: number) {
  assertNonNegative(cv, 'coefficient')
  return finiteResult(cv * KV_PER_CV)
}

export function kvToCv(kv: number) {
  assertNonNegative(kv, 'coefficient')
  return finiteResult(kv / KV_PER_CV)
}

export function kilogramsToPounds(value: number) {
  assertFinite(value)
  return finiteResult(value / POUND_KG)
}

export function kilogramsPerMeterToPoundsPerFoot(value: number) {
  assertFinite(value)
  return finiteResult(value * FOOT_M / POUND_KG)
}
