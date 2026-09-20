import {
  getUnitConversionCategory,
  type EngineeringUnitDefinition,
  type UnitConversionCategory,
  type UnitConversionCategoryId,
} from '../data/unitConversions.ts'

export type UnitConversionErrorCode = 'finite' | 'category' | 'unit'

export class UnitConversionError extends Error {
  readonly code: UnitConversionErrorCode

  constructor(code: UnitConversionErrorCode) {
    super(code)
    this.name = 'UnitConversionError'
    this.code = code
  }
}

export type ParsedEngineeringNumber =
  | { status: 'empty' }
  | { status: 'invalid' }
  | { status: 'valid'; value: number }

export interface ConvertedUnitValue {
  unit: EngineeringUnitDefinition
  value: number
}

function requireCategory(categoryId: UnitConversionCategoryId): UnitConversionCategory {
  const category = getUnitConversionCategory(categoryId)
  if (!category) throw new UnitConversionError('category')
  return category
}

function requireUnit(category: UnitConversionCategory, unitId: string) {
  const definition = category.units.find(unit => unit.id === unitId)
  if (!definition) throw new UnitConversionError('unit')
  return definition
}

function requireFinite(value: number) {
  if (!Number.isFinite(value)) throw new UnitConversionError('finite')
  return value
}

/**
 * Converts through a category's canonical unit. Affine scale/offset metadata
 * handles both linear quantities and absolute temperatures without branching.
 */
export function convertUnitValue(
  categoryId: UnitConversionCategoryId,
  value: number,
  fromUnitId: string,
  toUnitId: string,
) {
  requireFinite(value)
  const category = requireCategory(categoryId)
  const from = requireUnit(category, fromUnitId)
  const to = requireUnit(category, toUnitId)
  if (fromUnitId === toUnitId) return value
  const canonicalValue = requireFinite(value * from.factor + (from.offset ?? 0))
  return requireFinite((canonicalValue - (to.offset ?? 0)) / to.factor)
}

export function convertToAllUnits(
  categoryId: UnitConversionCategoryId,
  value: number,
  fromUnitId: string,
): ConvertedUnitValue[] {
  const category = requireCategory(categoryId)
  return category.units.map(unit => ({
    unit,
    value: convertUnitValue(categoryId, value, fromUnitId, unit.id),
  }))
}

/** Accepts Latin, Persian, or Arabic digits, grouped thousands, and exponents. */
export function parseEngineeringNumber(input: string): ParsedEngineeringNumber {
  const trimmed = input.trim()
  if (!trimmed) return { status: 'empty' }

  const normalized = trimmed
    .replace(/[۰-۹]/g, character => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(character)))
    .replace(/[٠-٩]/g, character => String('٠١٢٣٤٥٦٧٨٩'.indexOf(character)))
    .replace(/٫/g, '.')
    .replace(/٬/g, ',')

  const numericPattern = /^[+-]?(?:(?:\d{1,3}(?:,\d{3})+|\d+)(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?$/
  if (!numericPattern.test(normalized)) return { status: 'invalid' }

  const value = Number(normalized.replaceAll(',', ''))
  return Number.isFinite(value) ? { status: 'valid', value } : { status: 'invalid' }
}

export function formatConversionValue(value: number, maximumSignificantDigits = 10) {
  requireFinite(value)
  const normalized = Object.is(value, -0) ? 0 : value
  const magnitude = Math.abs(normalized)
  if (magnitude !== 0 && (magnitude >= 1e12 || magnitude < 1e-6)) {
    return normalized.toExponential(Math.min(maximumSignificantDigits - 1, 12))
      .replace(/\.0+(?=e)/, '')
      .replace(/(\.\d*?[1-9])0+(?=e)/, '$1')
  }
  return new Intl.NumberFormat('en-US', {
    maximumSignificantDigits,
    useGrouping: true,
  }).format(normalized)
}

export function swapUnitConversion(
  categoryId: UnitConversionCategoryId,
  value: number,
  fromUnitId: string,
  toUnitId: string,
) {
  return {
    value: convertUnitValue(categoryId, value, fromUnitId, toUnitId),
    fromUnitId: toUnitId,
    toUnitId: fromUnitId,
  }
}
