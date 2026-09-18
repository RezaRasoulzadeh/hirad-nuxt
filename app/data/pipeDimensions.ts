import sourceTable from './pipeDimensions.source.json'

export type PipeStandardId = 'ASME_B36_10' | 'ASME_B36_19'

export interface PipeScheduleRow {
  schedule: string
  wallThicknessMm: number
  massKgPerM?: number
}

export interface PipeNpsRow {
  nps: string
  outsideDiameterMm: number
  dn?: number
  schedules: PipeScheduleRow[]
}

export interface PipeStandardDefinition {
  id: PipeStandardId
  code: string
  title: { fa: string; en: string }
  description: { fa: string; en: string }
  rows: PipeNpsRow[]
}

interface SourcePipeRow {
  nps: string
  od: string
  wall_thickness: Record<string, string>
  weight: Record<string, string>
  shipping_volume?: string
}

interface SourceReviewFlag {
  nps: string
  field: string
  page?: number
  pages?: string
  reason: string
  value?: string
  metric?: string
  imperial?: string
}

interface SourceTable {
  schema_version: number
  source: {
    document: string
    catalogue_pages: number[]
    scope: string
    extraction_policy: string
    review_status: string
  }
  columns: {
    schedules: string[]
    metric: { od: string; wall_thickness: string; weight: string; shipping_volume: string }
    imperial: { od: string; wall_thickness: string; weight: string; shipping_volume: string }
  }
  metric_page_32: SourcePipeRow[]
  imperial_page_33: SourcePipeRow[]
  review_flags: SourceReviewFlag[]
}

const table = sourceTable as SourceTable

/** NPS/DN is a nominal mapping, not a second dimension value from the source table. */
const dnByNps: Record<string, number> = {
  '1/8': 6, '1/4': 8, '3/8': 10, '1/2': 15, '3/4': 20, '1': 25,
  '1 1/4': 32, '1 1/2': 40, '2': 50, '2 1/2': 65, '3': 80, '3 1/2': 90,
  '4': 100, '5': 125, '6': 150, '8': 200, '10': 250, '12': 300,
  '14': 350, '16': 400, '18': 450, '20': 500, '22': 550, '24': 600,
  '26': 650, '28': 700, '30': 750, '32': 800, '34': 850, '36': 900,
  '38': 950, '40': 1000, '42': 1050, '44': 1100, '46': 1150, '48': 1200,
}

const excludedMassCells = new Set(
  table.review_flags
    .filter(flag => flag.field.startsWith('weight.'))
    .map(flag => `${flag.nps}|${flag.field.slice('weight.'.length)}`),
)

function parseSourceNumber(value: string | undefined) {
  if (!value || !/^\d+(?:\.\d+)?$/.test(value)) return undefined
  const number = Number(value)
  return Number.isFinite(number) ? number : undefined
}

const stainlessScheduleNames = new Set(['5S', '10S', '40S', '80S'])

function isStainlessSchedule(scheduleName: string) {
  return stainlessScheduleNames.has(scheduleName)
}

function createRows(standardId: PipeStandardId): PipeNpsRow[] {
  return table.metric_page_32.map((sourceRow) => {
    const schedules = table.columns.schedules
      .filter(scheduleName => isStainlessSchedule(scheduleName) === (standardId === 'ASME_B36_19'))
      .map((scheduleName) => {
        const wallThicknessMm = parseSourceNumber(sourceRow.wall_thickness[scheduleName])
        if (wallThicknessMm === undefined) return undefined

        const sourceMass = parseSourceNumber(sourceRow.weight[scheduleName])
        const massKgPerM = excludedMassCells.has(`${sourceRow.nps}|${scheduleName}`) ? undefined : sourceMass

        return {
          schedule: scheduleName,
          wallThicknessMm,
          ...(massKgPerM === undefined ? {} : { massKgPerM }),
        }
      })
      .filter((item): item is PipeScheduleRow => item !== undefined)

    return {
      nps: sourceRow.nps,
      outsideDiameterMm: parseSourceNumber(sourceRow.od) as number,
      dn: dnByNps[sourceRow.nps],
      schedules,
    }
  })
}

/**
 * The raw catalogue extraction is kept in pipeDimensions.source.json. Metric
 * values are the canonical runtime data; imperial values from page 33 remain
 * available in the source file for review and are not duplicated here.
 */
export const pipeDimensionsSource = {
  ...table.source,
  columns: table.columns,
  reference: `${table.source.document}, pages ${table.source.catalogue_pages.join('–')}`,
  sourceFile: 'app/data/pipeDimensions.source.json',
  reviewFlags: table.review_flags,
} as const

export const pipeStandards: PipeStandardDefinition[] = [
  {
    id: 'ASME_B36_10',
    code: 'ASME B36.10 / B36.10M',
    title: { fa: 'لوله فولادی کربنی و آلیاژی', en: 'Carbon and alloy steel pipe' },
    description: {
      fa: 'ابعاد و وزن لوله‌های فولادی بر اساس جدول کاتالوگ هیراد.',
      en: 'Steel pipe dimensions and weight from the Hirad catalogue table.',
    },
    rows: createRows('ASME_B36_10'),
  },
  {
    id: 'ASME_B36_19',
    code: 'ASME B36.19 / B36.19M',
    title: { fa: 'لوله استنلس استیل', en: 'Stainless steel pipe' },
    description: {
      fa: 'ابعاد و وزن لوله‌های آستنیتی استنلس استیل بر اساس جدول کاتالوگ هیراد.',
      en: 'Austenitic stainless steel pipe dimensions and weight from the Hirad catalogue table.',
    },
    rows: createRows('ASME_B36_19'),
  },
]

export function getPipeStandard(id: PipeStandardId) {
  return pipeStandards.find(standard => standard.id === id)
}

export function getPipeNps(standardId: PipeStandardId, npsValue: string) {
  return getPipeStandard(standardId)?.rows.find(row => row.nps === npsValue)
}
