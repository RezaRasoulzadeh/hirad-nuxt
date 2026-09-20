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

import { KV_PER_CV, type UnitConversionCategoryId } from '../data/unitConversions.ts'
import { UnitConversionError, convertUnitValue } from './unitConversions.ts'

export { KV_PER_CV }

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

function assertFinite(value: number) {
  if (!Number.isFinite(value)) throw new CalculationError('finite')
}

function finiteResult(value: number) {
  assertFinite(value)
  return value
}

function convertEngineeringUnit(category: UnitConversionCategoryId, value: number, from: string, to: string) {
  try {
    return convertUnitValue(category, value, from, to)
  } catch (error) {
    if (error instanceof UnitConversionError && error.code === 'finite') throw new CalculationError('finite')
    throw error
  }
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
  return finiteResult(convertEngineeringUnit('length', value, unit, 'm'))
}

export function metersToDiameter(value: number, unit: DiameterUnit) {
  assertFinite(value)
  return finiteResult(convertEngineeringUnit('length', value, 'm', unit))
}

export function lengthToMeters(value: number, unit: LengthUnit) {
  assertFinite(value)
  return finiteResult(convertEngineeringUnit('length', value, unit, 'm'))
}

export function flowToCubicMetersPerSecond(value: number, unit: FlowUnit) {
  assertFinite(value)
  return finiteResult(convertEngineeringUnit('volumetricFlow', value, unit, 'm3s'))
}

export function cubicMetersPerSecondToFlow(value: number, unit: FlowUnit) {
  assertFinite(value)
  return finiteResult(convertEngineeringUnit('volumetricFlow', value, 'm3s', unit))
}

export function velocityToMetersPerSecond(value: number, unit: VelocityUnit) {
  assertFinite(value)
  return finiteResult(convertEngineeringUnit('velocity', value, unit, 'ms'))
}

export function metersPerSecondToVelocity(value: number, unit: VelocityUnit) {
  assertFinite(value)
  return finiteResult(convertEngineeringUnit('velocity', value, 'ms', unit))
}

export function densityToKilogramsPerCubicMeter(value: number, unit: DensityUnit) {
  assertFinite(value)
  return finiteResult(convertEngineeringUnit('density', value, unit, 'kgm3'))
}

export function viscosityToPascalSeconds(value: number, unit: ViscosityUnit) {
  assertFinite(value)
  return finiteResult(convertEngineeringUnit('dynamicViscosity', value, unit, 'pas'))
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
  return finiteResult(convertEngineeringUnit('flowCoefficient', cv, 'cv', 'kv'))
}

export function kvToCv(kv: number) {
  assertNonNegative(kv, 'coefficient')
  return finiteResult(convertEngineeringUnit('flowCoefficient', kv, 'kv', 'cv'))
}

export function kilogramsToPounds(value: number) {
  assertFinite(value)
  return finiteResult(convertEngineeringUnit('mass', value, 'kg', 'lb'))
}

export function kilogramsPerMeterToPoundsPerFoot(value: number) {
  assertFinite(value)
  const pounds = convertEngineeringUnit('mass', value, 'kg', 'lb')
  const feet = convertEngineeringUnit('length', 1, 'm', 'ft')
  return finiteResult(pounds / feet)
}
