import assert from 'node:assert/strict'
import test from 'node:test'
import {
  BTU_IT_J,
  KV_PER_CV,
  MECHANICAL_HORSEPOWER_W,
  POUND_FORCE_N,
  US_LIQUID_GALLON_M3,
  unitConversionCategories,
  type UnitConversionCategoryId,
} from '../app/data/unitConversions.ts'
import {
  UnitConversionError,
  convertToAllUnits,
  convertUnitValue,
  formatConversionValue,
  parseEngineeringNumber,
  swapUnitConversion,
} from '../app/utils/unitConversions.ts'

function close(actual: number, expected: number, tolerance = 1e-11) {
  assert.ok(
    Math.abs(actual - expected) <= tolerance * Math.max(1, Math.abs(expected)),
    `${actual} ≠ ${expected}`,
  )
}

test('every category has valid canonical and default unit metadata', () => {
  assert.equal(unitConversionCategories.length, 18)
  assert.equal(new Set(unitConversionCategories.map(category => category.id)).size, unitConversionCategories.length)

  for (const category of unitConversionCategories) {
    const ids = category.units.map(unit => unit.id)
    assert.equal(new Set(ids).size, ids.length, `${category.id} has duplicate unit IDs`)
    assert.ok(ids.includes(category.canonicalUnitId), `${category.id} canonical unit is missing`)
    assert.ok(ids.includes(category.defaultFromUnitId), `${category.id} source default is missing`)
    assert.ok(ids.includes(category.defaultToUnitId), `${category.id} target default is missing`)
    for (const unit of category.units) {
      assert.ok(Number.isFinite(unit.factor) && unit.factor > 0, `${category.id}/${unit.id} has an invalid factor`)
      assert.ok(unit.offset === undefined || Number.isFinite(unit.offset), `${category.id}/${unit.id} has an invalid offset`)
    }
  }
})

test('representative engineering reference conversion for every category', () => {
  const cases: Array<[UnitConversionCategoryId, number, string, string, number]> = [
    ['pressure', 1, 'bar', 'psi', 14.503773773020923],
    ['temperature', 0, 'c', 'f', 32],
    ['length', 1, 'in', 'mm', 25.4],
    ['area', 1, 'in2', 'mm2', 645.16],
    ['volume', 1, 'usgal', 'l', 3.785411784],
    ['mass', 1, 'lb', 'kg', 0.45359237],
    ['density', 1, 'gcm3', 'lbft3', 62.42796057614461],
    ['volumetricFlow', 1, 'usgpm', 'lmin', 3.785411784],
    ['massFlow', 1, 'th', 'kgs', 0.2777777777777778],
    ['velocity', 1, 'mph', 'ms', 0.44704],
    ['dynamicViscosity', 1, 'cp', 'pas', 0.001],
    ['kinematicViscosity', 1, 'cst', 'mm2s', 1],
    ['force', 1, 'lbf', 'n', POUND_FORCE_N],
    ['torque', 1, 'lbfft', 'nm', 1.3558179483314004],
    ['energy', 1, 'btuit', 'j', BTU_IT_J],
    ['power', 1, 'hp', 'w', MECHANICAL_HORSEPOWER_W],
    ['stress', 1, 'ksi', 'mpa', 6.894757293168361],
    ['flowCoefficient', 100, 'cv', 'kv', 100 * KV_PER_CV],
  ]

  for (const [category, value, from, to, expected] of cases) {
    close(convertUnitValue(category, value, from, to), expected)
    close(convertUnitValue(category, expected, to, from), value)
  }
})

test('temperature uses affine offsets in both directions', () => {
  close(convertUnitValue('temperature', 32, 'f', 'c'), 0)
  close(convertUnitValue('temperature', 32, 'f', 'k'), 273.15)
  close(convertUnitValue('temperature', 273.15, 'k', 'f'), 32)
  close(convertUnitValue('temperature', -40, 'c', 'f'), -40)
  close(convertUnitValue('temperature', -273.15, 'c', 'k'), 0)
})

test('all units preserve identity and round-trip across their category', () => {
  for (const category of unitConversionCategories) {
    for (const from of category.units) {
      assert.equal(convertUnitValue(category.id, -42.5, from.id, from.id), -42.5)
      for (const to of category.units) {
        const converted = convertUnitValue(category.id, 123.456789, from.id, to.id)
        close(convertUnitValue(category.id, converted, to.id, from.id), 123.456789, 2e-10)
      }
    }
  }
})

test('identity conversions still validate category unit membership', () => {
  assert.throws(
    () => convertUnitValue('pressure', 1, 'not-a-unit', 'not-a-unit'),
    error => error instanceof UnitConversionError && error.code === 'unit',
  )
})

test('very small and very large finite values remain unrounded internally', () => {
  assert.equal(convertUnitValue('pressure', 1e-200, 'pa', 'mpa'), 1e-206)
  close(convertUnitValue('pressure', 1e200, 'mpa', 'pa'), 1e206, 1e-12)
  assert.equal(formatConversionValue(1e-12), '1e-12')
  assert.equal(formatConversionValue(1e15), '1e+15')
  assert.throws(
    () => convertUnitValue('pressure', Number.MAX_VALUE, 'mpa', 'pa'),
    error => error instanceof UnitConversionError && error.code === 'finite',
  )
})

test('US liquid gallon and petroleum barrel definitions are explicit and consistent', () => {
  close(convertUnitValue('volume', 1, 'usgal', 'm3'), US_LIQUID_GALLON_M3)
  close(convertUnitValue('volume', 1, 'bbl', 'usgal'), 42)
  close(convertUnitValue('volumetricFlow', 1, 'bbld', 'usgpm'), 42 / 1440)
})

test('equivalent values are calculated from the original numeric value', () => {
  const equivalents = convertToAllUnits('pressure', 10, 'bar')
  const byId = Object.fromEntries(equivalents.map(item => [item.unit.id, item.value]))
  close(byId.mpa, 1)
  close(byId.kpa, 1000)
  close(byId.psi, 145.03773773020923)
  close(byId.kgfcm2, 10.197162129779283)
  close(byId.atm, 9.869232667160128)
})

test('swap converts the current value and reverses the selected units', () => {
  const swapped = swapUnitConversion('pressure', 10, 'bar', 'psi')
  assert.equal(swapped.fromUnitId, 'psi')
  assert.equal(swapped.toUnitId, 'bar')
  close(swapped.value, 145.03773773020923)
  close(convertUnitValue('pressure', swapped.value, swapped.fromUnitId, swapped.toUnitId), 10)
})

test('engineering numeric input accepts practical formats and rejects malformed text', () => {
  assert.deepEqual(parseEngineeringNumber(''), { status: 'empty' })
  assert.deepEqual(parseEngineeringNumber('-1,200.5e-3'), { status: 'valid', value: -1.2005 })
  assert.deepEqual(parseEngineeringNumber('۱۲٬۳۴۵٫۶'), { status: 'valid', value: 12345.6 })
  assert.deepEqual(parseEngineeringNumber('١٢.٥'), { status: 'valid', value: 12.5 })
  assert.deepEqual(parseEngineeringNumber('.025'), { status: 'valid', value: 0.025 })
  assert.deepEqual(parseEngineeringNumber('1,20'), { status: 'invalid' })
  assert.deepEqual(parseEngineeringNumber('1.2.3'), { status: 'invalid' })
  assert.deepEqual(parseEngineeringNumber('Infinity'), { status: 'invalid' })
  assert.deepEqual(parseEngineeringNumber('12 MPa'), { status: 'invalid' })
})
