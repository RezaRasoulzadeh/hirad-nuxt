/**
 * Engineering unit definitions expressed against one canonical unit per category.
 *
 * Conversion factors follow NIST SP 811 and NIST Handbook 44 unless noted. Exact
 * definitions are retained at higher precision when they can be derived from exact
 * SI relationships. Cv/Kv follows the Fisher convention already used by Hirad's
 * Engineering Calculators.
 *
 * Reference basis:
 * https://www.nist.gov/pml/special-publication-811/nist-guide-si-appendix-b-conversion-factors
 * https://www.nist.gov/pml/owm/nist-handbook-44-current-edition
 * https://www.emerson.com/is/content/emerson/en/final-control/flow-controls/documents/cat12_s2.pdf
 */

export interface UnitText {
  fa: string
  en: string
}

export type UnitConversionCategoryId =
  | 'pressure'
  | 'temperature'
  | 'length'
  | 'area'
  | 'volume'
  | 'mass'
  | 'density'
  | 'volumetricFlow'
  | 'massFlow'
  | 'velocity'
  | 'dynamicViscosity'
  | 'kinematicViscosity'
  | 'force'
  | 'torque'
  | 'energy'
  | 'power'
  | 'stress'
  | 'flowCoefficient'

export interface EngineeringUnitDefinition {
  id: string
  symbol: string
  name: UnitText
  /** canonical = value × factor + offset */
  factor: number
  offset?: number
  definition?: string
}

export interface UnitConversionCategory {
  id: UnitConversionCategoryId
  title: UnitText
  description: UnitText
  canonicalUnitId: string
  defaultFromUnitId: string
  defaultToUnitId: string
  units: readonly EngineeringUnitDefinition[]
  note?: UnitText
}

const unit = (
  id: string,
  symbol: string,
  fa: string,
  en: string,
  factor: number,
  definition?: string,
  offset?: number,
): EngineeringUnitDefinition => ({ id, symbol, name: { fa, en }, factor, definition, offset })

export const STANDARD_GRAVITY_MS2 = 9.80665
export const INTERNATIONAL_POUND_KG = 0.45359237
export const INTERNATIONAL_FOOT_M = 0.3048
export const US_LIQUID_GALLON_M3 = 0.003785411784
export const PETROLEUM_BARREL_M3 = 42 * US_LIQUID_GALLON_M3
export const POUND_FORCE_N = INTERNATIONAL_POUND_KG * STANDARD_GRAVITY_MS2
export const PSI_PA = POUND_FORCE_N / 0.0254 ** 2
export const BTU_IT_J = INTERNATIONAL_POUND_KG * 5 / 9 * 4186.8
export const MECHANICAL_HORSEPOWER_W = 550 * POUND_FORCE_N * INTERNATIONAL_FOOT_M
export const KV_PER_CV = 0.865

const pa = unit('pa', 'Pa', 'پاسکال', 'pascal', 1)
const kpa = unit('kpa', 'kPa', 'کیلوپاسکال', 'kilopascal', 1e3)
const mpa = unit('mpa', 'MPa', 'مگاپاسکال', 'megapascal', 1e6)
const gpa = unit('gpa', 'GPa', 'گیگاپاسکال', 'gigapascal', 1e9)
const bar = unit('bar', 'bar', 'بار', 'bar', 1e5)
const mbar = unit('mbar', 'mbar', 'میلی‌بار', 'millibar', 1e2)
const psi = unit('psi', 'psi', 'پوند بر اینچ مربع', 'pound-force per square inch', PSI_PA, 'International pound-force per square inch')
const ksi = unit('ksi', 'ksi', 'کیپ بر اینچ مربع', 'kip per square inch', PSI_PA * 1e3)
const kgfcm2 = unit('kgfcm2', 'kgf/cm²', 'کیلوگرم‌نیرو بر سانتی‌متر مربع', 'kilogram-force per square centimetre', STANDARD_GRAVITY_MS2 / 1e-4, 'Uses standard gravity')
const atm = unit('atm', 'atm', 'اتمسفر استاندارد', 'standard atmosphere', 101325, 'Standard atmosphere, exactly 101325 Pa')

const pressureUnits = [pa, kpa, mpa, bar, mbar, psi, ksi, kgfcm2, atm] as const
const stressUnits = [pa, mpa, gpa, psi, ksi] as const

const temperatureUnits = [
  unit('c', '°C', 'درجه سلسیوس', 'degree Celsius', 1, 'Kelvin = Celsius + 273.15', 273.15),
  unit('f', '°F', 'درجه فارنهایت', 'degree Fahrenheit', 5 / 9, 'Kelvin = (Fahrenheit − 32) × 5/9 + 273.15', 273.15 - 32 * 5 / 9),
  unit('k', 'K', 'کلوین', 'kelvin', 1),
] as const

const lengthUnits = [
  unit('mm', 'mm', 'میلی‌متر', 'millimetre', 1e-3),
  unit('cm', 'cm', 'سانتی‌متر', 'centimetre', 1e-2),
  unit('m', 'm', 'متر', 'metre', 1),
  unit('km', 'km', 'کیلومتر', 'kilometre', 1e3),
  unit('in', 'in', 'اینچ', 'inch', 0.0254, 'International inch, exactly 0.0254 m'),
  unit('ft', 'ft', 'فوت', 'foot', INTERNATIONAL_FOOT_M, 'International foot, exactly 0.3048 m'),
  unit('yd', 'yd', 'یارد', 'yard', 0.9144, 'International yard, exactly 0.9144 m'),
] as const

const areaUnits = [
  unit('mm2', 'mm²', 'میلی‌متر مربع', 'square millimetre', 1e-6),
  unit('cm2', 'cm²', 'سانتی‌متر مربع', 'square centimetre', 1e-4),
  unit('m2', 'm²', 'متر مربع', 'square metre', 1),
  unit('in2', 'in²', 'اینچ مربع', 'square inch', 0.0254 ** 2),
  unit('ft2', 'ft²', 'فوت مربع', 'square foot', INTERNATIONAL_FOOT_M ** 2),
] as const

const volumeUnits = [
  unit('mm3', 'mm³', 'میلی‌متر مکعب', 'cubic millimetre', 1e-9),
  unit('cm3', 'cm³', 'سانتی‌متر مکعب', 'cubic centimetre', 1e-6),
  unit('l', 'L', 'لیتر', 'litre', 1e-3),
  unit('m3', 'm³', 'متر مکعب', 'cubic metre', 1),
  unit('in3', 'in³', 'اینچ مکعب', 'cubic inch', 0.0254 ** 3),
  unit('ft3', 'ft³', 'فوت مکعب', 'cubic foot', INTERNATIONAL_FOOT_M ** 3),
  unit('usgal', 'US gal', 'گالن مایع آمریکا', 'US liquid gallon', US_LIQUID_GALLON_M3, 'US liquid gallon, exactly 231 in³'),
  unit('bbl', 'bbl', 'بشکه نفت', 'petroleum barrel', PETROLEUM_BARREL_M3, 'Petroleum barrel, exactly 42 US liquid gallons'),
] as const

const massUnits = [
  unit('g', 'g', 'گرم', 'gram', 1e-3),
  unit('kg', 'kg', 'کیلوگرم', 'kilogram', 1),
  unit('t', 't', 'تن متریک', 'tonne', 1e3),
  unit('oz', 'oz', 'اونس', 'avoirdupois ounce', INTERNATIONAL_POUND_KG / 16, 'International avoirdupois ounce'),
  unit('lb', 'lb', 'پوند', 'avoirdupois pound', INTERNATIONAL_POUND_KG, 'International avoirdupois pound, exactly 0.45359237 kg'),
] as const

const densityUnits = [
  unit('kgm3', 'kg/m³', 'کیلوگرم بر متر مکعب', 'kilogram per cubic metre', 1),
  unit('gcm3', 'g/cm³', 'گرم بر سانتی‌متر مکعب', 'gram per cubic centimetre', 1e3),
  unit('lbft3', 'lb/ft³', 'پوند بر فوت مکعب', 'pound per cubic foot', INTERNATIONAL_POUND_KG / INTERNATIONAL_FOOT_M ** 3),
  unit('lbin3', 'lb/in³', 'پوند بر اینچ مکعب', 'pound per cubic inch', INTERNATIONAL_POUND_KG / 0.0254 ** 3),
] as const

const volumetricFlowUnits = [
  unit('m3s', 'm³/s', 'متر مکعب بر ثانیه', 'cubic metre per second', 1),
  unit('m3h', 'm³/h', 'متر مکعب بر ساعت', 'cubic metre per hour', 1 / 3600),
  unit('ls', 'L/s', 'لیتر بر ثانیه', 'litre per second', 1e-3),
  unit('lmin', 'L/min', 'لیتر بر دقیقه', 'litre per minute', 1e-3 / 60),
  unit('ft3s', 'ft³/s', 'فوت مکعب بر ثانیه', 'cubic foot per second', INTERNATIONAL_FOOT_M ** 3),
  unit('cfm', 'ft³/min (CFM)', 'فوت مکعب بر دقیقه', 'cubic foot per minute', INTERNATIONAL_FOOT_M ** 3 / 60),
  unit('usgpm', 'US gal/min (GPM)', 'گالن مایع آمریکا بر دقیقه', 'US gallon per minute', US_LIQUID_GALLON_M3 / 60, 'Uses the US liquid gallon'),
  unit('bbld', 'bbl/d', 'بشکه نفت بر روز', 'petroleum barrel per day', PETROLEUM_BARREL_M3 / 86400, 'Uses the 42-US-gallon petroleum barrel'),
] as const

const massFlowUnits = [
  unit('kgs', 'kg/s', 'کیلوگرم بر ثانیه', 'kilogram per second', 1),
  unit('kgh', 'kg/h', 'کیلوگرم بر ساعت', 'kilogram per hour', 1 / 3600),
  unit('th', 't/h', 'تن متریک بر ساعت', 'tonne per hour', 1e3 / 3600),
  unit('lbs', 'lb/s', 'پوند بر ثانیه', 'pound per second', INTERNATIONAL_POUND_KG),
  unit('lbh', 'lb/h', 'پوند بر ساعت', 'pound per hour', INTERNATIONAL_POUND_KG / 3600),
] as const

const velocityUnits = [
  unit('ms', 'm/s', 'متر بر ثانیه', 'metre per second', 1),
  unit('fts', 'ft/s', 'فوت بر ثانیه', 'foot per second', INTERNATIONAL_FOOT_M),
  unit('kmh', 'km/h', 'کیلومتر بر ساعت', 'kilometre per hour', 1 / 3.6),
  unit('mph', 'mph', 'مایل بر ساعت', 'mile per hour', 0.44704, 'International mile per hour'),
] as const

const dynamicViscosityUnits = [
  unit('pas', 'Pa·s', 'پاسکال‌ثانیه', 'pascal second', 1),
  unit('mpas', 'mPa·s', 'میلی‌پاسکال‌ثانیه', 'millipascal second', 1e-3),
  unit('cp', 'cP', 'سانتی‌پواز', 'centipoise', 1e-3),
] as const

const kinematicViscosityUnits = [
  unit('m2s', 'm²/s', 'متر مربع بر ثانیه', 'square metre per second', 1),
  unit('mm2s', 'mm²/s', 'میلی‌متر مربع بر ثانیه', 'square millimetre per second', 1e-6),
  unit('st', 'St', 'استوکس', 'stokes', 1e-4),
  unit('cst', 'cSt', 'سانتی‌استوکس', 'centistokes', 1e-6),
] as const

const forceUnits = [
  unit('n', 'N', 'نیوتن', 'newton', 1),
  unit('kn', 'kN', 'کیلونیوتن', 'kilonewton', 1e3),
  unit('mn', 'MN', 'مگانیوتن', 'meganewton', 1e6),
  unit('lbf', 'lbf', 'پوند‌نیرو', 'pound-force', POUND_FORCE_N, 'International pound under standard gravity'),
  unit('kgf', 'kgf', 'کیلوگرم‌نیرو', 'kilogram-force', STANDARD_GRAVITY_MS2, 'Uses standard gravity'),
] as const

const torqueUnits = [
  unit('nm', 'N·m', 'نیوتن‌متر', 'newton metre', 1),
  unit('knm', 'kN·m', 'کیلونیوتن‌متر', 'kilonewton metre', 1e3),
  unit('lbfft', 'lbf·ft', 'پوند‌نیرو فوت', 'pound-force foot', POUND_FORCE_N * INTERNATIONAL_FOOT_M),
  unit('lbfin', 'lbf·in', 'پوند‌نیرو اینچ', 'pound-force inch', POUND_FORCE_N * 0.0254),
  unit('kgfm', 'kgf·m', 'کیلوگرم‌نیرو متر', 'kilogram-force metre', STANDARD_GRAVITY_MS2),
] as const

const energyUnits = [
  unit('j', 'J', 'ژول', 'joule', 1),
  unit('kj', 'kJ', 'کیلوژول', 'kilojoule', 1e3),
  unit('mj', 'MJ', 'مگاژول', 'megajoule', 1e6),
  unit('wh', 'Wh', 'وات‌ساعت', 'watt hour', 3600),
  unit('kwh', 'kWh', 'کیلووات‌ساعت', 'kilowatt hour', 3.6e6),
  unit('btuit', 'BTU (IT)', 'بی‌تی‌یو بین‌المللی', 'international-table British thermal unit', BTU_IT_J, 'International-table BTU'),
] as const

const powerUnits = [
  unit('w', 'W', 'وات', 'watt', 1),
  unit('kw', 'kW', 'کیلووات', 'kilowatt', 1e3),
  unit('mw', 'MW', 'مگاوات', 'megawatt', 1e6),
  unit('hp', 'hp (mechanical)', 'اسب بخار مکانیکی', 'mechanical horsepower', MECHANICAL_HORSEPOWER_W, 'Mechanical horsepower, exactly 550 ft·lbf/s'),
] as const

const flowCoefficientUnits = [
  unit('cv', 'Cv', 'ضریب جریان Cv', 'Cv flow coefficient', 1),
  unit('kv', 'Kv', 'ضریب جریان Kv', 'Kv flow coefficient', 1 / KV_PER_CV, 'Kv = 0.865 × Cv'),
] as const

export const unitConversionCategories: readonly UnitConversionCategory[] = [
  { id: 'pressure', title: { fa: 'فشار', en: 'Pressure' }, description: { fa: 'واحدهای متداول فشار در پایپینگ، ولو و فرایند', en: 'Common piping, valve and process pressure units' }, canonicalUnitId: 'pa', defaultFromUnitId: 'bar', defaultToUnitId: 'psi', units: pressureUnits, note: { fa: 'atm به‌معنای اتمسفر استاندارد و kgf/cm² بر پایه شتاب استاندارد گرانش است.', en: 'atm is the standard atmosphere; kgf/cm² uses standard gravity.' } },
  { id: 'temperature', title: { fa: 'دما', en: 'Temperature' }, description: { fa: 'تبدیل دمای مطلق با لحاظ اختلاف مبدأ مقیاس‌ها', en: 'Absolute temperature conversion with scale offsets' }, canonicalUnitId: 'k', defaultFromUnitId: 'c', defaultToUnitId: 'f', units: temperatureUnits, note: { fa: 'تبدیل دما افست مبدأ °C و °F را لحاظ می‌کند و تبدیل بازه دما نیست.', en: 'Conversions apply absolute-scale offsets, not temperature-interval factors.' } },
  { id: 'length', title: { fa: 'طول', en: 'Length' }, description: { fa: 'ابعاد متریک و امپریال کاربردی', en: 'Practical metric and imperial dimensions' }, canonicalUnitId: 'm', defaultFromUnitId: 'mm', defaultToUnitId: 'in', units: lengthUnits },
  { id: 'area', title: { fa: 'مساحت', en: 'Area' }, description: { fa: 'واحدهای سطح و سطح مقطع', en: 'Surface and cross-sectional area units' }, canonicalUnitId: 'm2', defaultFromUnitId: 'mm2', defaultToUnitId: 'in2', units: areaUnits },
  { id: 'volume', title: { fa: 'حجم', en: 'Volume' }, description: { fa: 'حجم‌های مهندسی و ظرفیت سیال', en: 'Engineering volumes and fluid capacity' }, canonicalUnitId: 'm3', defaultFromUnitId: 'l', defaultToUnitId: 'usgal', units: volumeUnits, note: { fa: 'گالن این ابزار، گالن مایع آمریکا است؛ هر بشکه نفت نیز دقیقاً ۴۲ گالن مایع آمریکا در نظر گرفته می‌شود.', en: 'The gallon is the US liquid gallon; one petroleum barrel is exactly 42 US liquid gallons.' } },
  { id: 'mass', title: { fa: 'جرم', en: 'Mass' }, description: { fa: 'جرم متریک و آوواردوپوآ', en: 'Metric and avoirdupois mass' }, canonicalUnitId: 'kg', defaultFromUnitId: 'kg', defaultToUnitId: 'lb', units: massUnits, note: { fa: 'پوند و اونس بر پایه تعریف بین‌المللی آوواردوپوآ هستند.', en: 'Pound and ounce use the international avoirdupois definitions.' } },
  { id: 'density', title: { fa: 'چگالی', en: 'Density' }, description: { fa: 'چگالی مواد و سیالات در واحدهای رایج', en: 'Common material and fluid density units' }, canonicalUnitId: 'kgm3', defaultFromUnitId: 'kgm3', defaultToUnitId: 'lbft3', units: densityUnits },
  { id: 'volumetricFlow', title: { fa: 'دبی حجمی', en: 'Volumetric Flow Rate' }, description: { fa: 'دبی‌های صنعتی متریک، CFM، GPM و بشکه در روز', en: 'Industrial metric flow, CFM, GPM and barrels per day' }, canonicalUnitId: 'm3s', defaultFromUnitId: 'm3h', defaultToUnitId: 'usgpm', units: volumetricFlowUnits, note: { fa: 'GPM بر پایه گالن مایع آمریکا و bbl/d بر پایه بشکه ۴۲ گالنی نفت است؛ شرایط استاندارد گاز به‌طور ضمنی اعمال نمی‌شود.', en: 'GPM uses US liquid gallons and bbl/d uses the 42-gallon petroleum barrel; no gas standard conditions are implied.' } },
  { id: 'massFlow', title: { fa: 'دبی جرمی', en: 'Mass Flow Rate' }, description: { fa: 'نرخ جریان جرم بر ثانیه و ساعت', en: 'Mass flow per second and hour' }, canonicalUnitId: 'kgs', defaultFromUnitId: 'kgh', defaultToUnitId: 'lbh', units: massFlowUnits },
  { id: 'velocity', title: { fa: 'سرعت', en: 'Velocity' }, description: { fa: 'سرعت خطی در واحدهای مهندسی', en: 'Linear speed in engineering units' }, canonicalUnitId: 'ms', defaultFromUnitId: 'ms', defaultToUnitId: 'fts', units: velocityUnits },
  { id: 'dynamicViscosity', title: { fa: 'گرانروی دینامیکی', en: 'Dynamic Viscosity' }, description: { fa: 'ویسکوزیته دینامیکی SI و سانتی‌پواز', en: 'SI dynamic viscosity and centipoise' }, canonicalUnitId: 'pas', defaultFromUnitId: 'mpas', defaultToUnitId: 'cp', units: dynamicViscosityUnits, note: { fa: 'یک mPa·s دقیقاً برابر یک cP است.', en: 'One mPa·s equals one cP exactly.' } },
  { id: 'kinematicViscosity', title: { fa: 'گرانروی سینماتیکی', en: 'Kinematic Viscosity' }, description: { fa: 'ویسکوزیته سینماتیکی SI، استوکس و سانتی‌استوکس', en: 'SI kinematic viscosity, stokes and centistokes' }, canonicalUnitId: 'm2s', defaultFromUnitId: 'cst', defaultToUnitId: 'mm2s', units: kinematicViscosityUnits, note: { fa: 'یک cSt دقیقاً برابر یک mm²/s است.', en: 'One cSt equals one mm²/s exactly.' } },
  { id: 'force', title: { fa: 'نیرو', en: 'Force' }, description: { fa: 'نیرو در دستگاه SI و واحدهای ثقلی', en: 'SI and gravitational force units' }, canonicalUnitId: 'n', defaultFromUnitId: 'kn', defaultToUnitId: 'lbf', units: forceUnits, note: { fa: 'lbf و kgf با شتاب استاندارد گرانش 9.80665 m/s² محاسبه می‌شوند.', en: 'lbf and kgf use standard gravity of 9.80665 m/s².' } },
  { id: 'torque', title: { fa: 'گشتاور', en: 'Torque' }, description: { fa: 'گشتاور متریک و امپریال', en: 'Metric and imperial torque' }, canonicalUnitId: 'nm', defaultFromUnitId: 'nm', defaultToUnitId: 'lbfft', units: torqueUnits },
  { id: 'energy', title: { fa: 'انرژی و کار', en: 'Energy / Work' }, description: { fa: 'انرژی مکانیکی، الکتریکی و حرارتی', en: 'Mechanical, electrical and thermal energy' }, canonicalUnitId: 'j', defaultFromUnitId: 'kj', defaultToUnitId: 'btuit', units: energyUnits, note: { fa: 'BTU در این ابزار از تعریف International Table یا BTU (IT) با مقدار 1055.05585262 J استفاده می‌کند.', en: 'BTU uses the International Table definition: 1055.05585262 J.' } },
  { id: 'power', title: { fa: 'توان', en: 'Power' }, description: { fa: 'توان SI و اسب بخار مکانیکی', en: 'SI power and mechanical horsepower' }, canonicalUnitId: 'w', defaultFromUnitId: 'kw', defaultToUnitId: 'hp', units: powerUnits, note: { fa: 'hp به‌معنای اسب بخار مکانیکی، برابر 550 ft·lbf/s است.', en: 'hp is mechanical horsepower, equal to 550 ft·lbf/s.' } },
  { id: 'stress', title: { fa: 'تنش و استحکام', en: 'Stress / Strength' }, description: { fa: 'واحدهای متداول خواص مکانیکی مواد', en: 'Common mechanical-property units' }, canonicalUnitId: 'pa', defaultFromUnitId: 'mpa', defaultToUnitId: 'ksi', units: stressUnits, note: { fa: 'این دسته همان کمیت نیرو بر سطح را با واحدهای مناسب خواص مواد نمایش می‌دهد و از ضرایب مشترک فشار استفاده می‌کند.', en: 'This force-per-area category reuses the pressure definitions relevant to material properties.' } },
  { id: 'flowCoefficient', title: { fa: 'ضریب جریان Cv / Kv', en: 'Cv / Kv' }, description: { fa: 'تبدیل مستقیم ضریب جریان ولو', en: 'Direct valve flow-coefficient conversion' }, canonicalUnitId: 'cv', defaultFromUnitId: 'cv', defaultToUnitId: 'kv', units: flowCoefficientUnits, note: { fa: 'ضریب مشترک محاسبه‌گرهای مهندسی هیراد استفاده می‌شود: Kv = 0.865 × Cv.', en: 'Uses the same factor as Hirad Engineering Calculators: Kv = 0.865 × Cv.' } },
]

export function getUnitConversionCategory(id: UnitConversionCategoryId) {
  return unitConversionCategories.find(category => category.id === id)
}
