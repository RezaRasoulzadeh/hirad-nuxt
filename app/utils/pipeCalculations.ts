import type { PipeNpsRow, PipeScheduleRow } from '~/data/pipeDimensions'

export interface PipeCalculatedValues {
  insideDiameterMm: number
  internalAreaMm2: number
  internalVolumeLPerM: number
}

export function calculatePipeValues(pipe: PipeNpsRow, schedule: PipeScheduleRow): PipeCalculatedValues {
  const insideDiameterMm = pipe.outsideDiameterMm - (2 * schedule.wallThicknessMm)
  const radiusMm = insideDiameterMm / 2
  const internalAreaMm2 = Math.PI * radiusMm * radiusMm

  return {
    insideDiameterMm,
    internalAreaMm2,
    internalVolumeLPerM: internalAreaMm2 / 1000,
  }
}

export function millimetresToInches(value: number) {
  return value / 25.4
}

export function kilogramsPerMetreToPoundsPerFoot(value: number) {
  return value * 0.671968975
}

export function squareMillimetresToSquareInches(value: number) {
  return value / 645.16
}

export function litresPerMetreToCubicFeetPerFoot(value: number) {
  return value * 0.0353146667
}
