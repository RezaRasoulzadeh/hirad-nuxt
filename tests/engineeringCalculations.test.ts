import assert from 'node:assert/strict'
import test from 'node:test'
import {
  CalculationError, KV_PER_CV, calculatePipeGeometry, calculatePipeMass,
  calculateVelocity, calculateFlowRate, calculateReynolds, cvToKv, kvToCv,
  diameterToMeters, lengthToMeters, flowToCubicMetersPerSecond,
  cubicMetersPerSecondToFlow, velocityToMetersPerSecond,
  densityToKilogramsPerCubicMeter, viscosityToPascalSeconds,
  kilogramsToPounds, kilogramsPerMeterToPoundsPerFoot,
} from '../app/utils/engineeringCalculations.ts'

function close(actual: number, expected: number, tolerance = 1e-10) {
  assert.ok(Math.abs(actual - expected) <= tolerance * Math.max(1, Math.abs(expected)), `${actual} ≠ ${expected}`)
}

test('circular pipe geometry preserves area and volume relationships', () => {
  const geometry = calculatePipeGeometry(0.1, 0.005)
  close(geometry.insideDiameterM, 0.09)
  close(geometry.internalAreaM2, Math.PI * 0.09 ** 2 / 4)
  close(geometry.metalAreaM2, Math.PI * (0.1 ** 2 - 0.09 ** 2) / 4)
  close(geometry.internalVolumePerMeterM3, geometry.internalAreaM2)
  close(geometry.metalVolumePerMeterM3, geometry.metalAreaM2)
})

test('theoretical mass uses metal area, entered density and length', () => {
  const mass = calculatePipeMass(0.1, 0.005, 6, 7850)
  close(mass.massPerMeterKg, Math.PI * 0.005 * 0.095 * 7850)
  close(mass.totalMassKg, mass.massPerMeterKg * 6)
})

test('velocity and flow are inverse relationships', () => {
  const q = flowToCubicMetersPerSecond(36, 'm3h')
  const v = calculateVelocity(q, 0.1)
  close(v, 4 / Math.PI)
  close(calculateFlowRate(v, 0.1), q)
  close(cubicMetersPerSecondToFlow(q, 'm3h'), 36)
})

test('engineering unit paths convert to SI and back', () => {
  close(diameterToMeters(1, 'in'), 0.0254)
  close(lengthToMeters(1, 'ft'), 0.3048)
  close(velocityToMetersPerSecond(1, 'fts'), 0.3048)
  close(densityToKilogramsPerCubicMeter(7.85, 'gcm3'), 7850)
  close(viscosityToPascalSeconds(1, 'mpas'), 0.001)
  close(cubicMetersPerSecondToFlow(flowToCubicMetersPerSecond(25, 'usgpm'), 'usgpm'), 25)
  close(kilogramsToPounds(0.45359237), 1)
  close(kilogramsPerMeterToPoundsPerFoot(0.45359237 / 0.3048), 1)
})

test('Reynolds number and transition boundaries', () => {
  close(calculateReynolds(2, 0.05, 1000, 0.001).reynolds, 100000)
  assert.equal(calculateReynolds(2, 0.05, 1000, 0.001).regime, 'turbulent')
  assert.deepEqual(calculateReynolds(0, 0.1, 1000, 0.001), { reynolds: 0, regime: 'stagnant' })
  assert.equal(calculateReynolds(0.02099, 0.1, 1000, 0.001).regime, 'laminar')
  assert.equal(calculateReynolds(0.021, 0.1, 1000, 0.001).regime, 'transition')
  assert.equal(calculateReynolds(0.04, 0.1, 1000, 0.001).regime, 'transition')
  assert.equal(calculateReynolds(0.04001, 0.1, 1000, 0.001).regime, 'turbulent')
})

test('Cv/Kv conversion is reversible and handles zero', () => {
  close(cvToKv(100), 100 * KV_PER_CV)
  close(kvToCv(cvToKv(100)), 100)
  assert.equal(cvToKv(0), 0)
})

test('physically invalid inputs return specific errors', () => {
  const throws = (fn: () => unknown, code: string) => assert.throws(fn, error => error instanceof CalculationError && error.code === code)
  throws(() => calculatePipeGeometry(0, 0.001), 'diameter')
  throws(() => calculatePipeGeometry(0.1, -0.001), 'wall')
  throws(() => calculatePipeGeometry(0.1, 0.05), 'wall')
  throws(() => calculatePipeMass(0.1, 0.005, 0, 7850), 'length')
  throws(() => calculatePipeMass(0.1, 0.005, 1, -1), 'density')
  throws(() => calculateVelocity(-1, 0.1), 'flow')
  throws(() => calculateFlowRate(-1, 0.1), 'velocity')
  throws(() => calculateReynolds(1, 0.1, 1000, 0), 'viscosity')
  throws(() => cvToKv(-1), 'coefficient')
  throws(() => calculateVelocity(Number.NaN, 0.1), 'finite')
  throws(() => calculatePipeGeometry(1e200, 1e198), 'finite')
  throws(() => calculateFlowRate(1e300, 1e50), 'finite')
  throws(() => densityToKilogramsPerCubicMeter(1e308, 'gcm3'), 'finite')
})
