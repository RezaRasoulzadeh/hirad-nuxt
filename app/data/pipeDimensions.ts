import sourceTable from './pipeDimensions.source.json'

export type PipeStandardId = 'ASME_B36_10' | 'ASME_B36_19'

export interface PipeScheduleRow {
  schedule: string
  wallThicknessMm: number
  wallThicknessIn?: number
  massKgPerM?: number
  massLbPerFt?: number
}

export interface PipeNpsRow {
  nps: string
  outsideDiameterMm: number
  outsideDiameterIn?: number
  shippingVolumeM3PerM?: string
  shippingVolumeFt3PerFt?: string
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
  shipping_volume?: string
  schedules: Record<string, {
    wall_thickness: string
    weight?: string
  }>
}

interface SourceTable {
  source: {
    document: string
    pages: number[]
    standards_as_printed: string[]
    transcription_method: string
    review_notice: string
    transcription_notes: string[]
  }
  schema: {
    schedule_order: string[]
    metric: { od: string; wall_thickness: string; weight: string; shipping_volume: string }
    imperial: { od: string; wall_thickness: string; weight: string; shipping_volume: string }
  }
  metric_page_32: SourcePipeRow[]
  imperial_page_33: SourcePipeRow[]
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
    const imperialRow = table.imperial_page_33.find(row => row.nps === sourceRow.nps)
    const schedules = table.schema.schedule_order
      .filter(scheduleName => isStainlessSchedule(scheduleName) === (standardId === 'ASME_B36_19'))
      .map((scheduleName) => {
        const metricSchedule = sourceRow.schedules[scheduleName]
        const imperialSchedule = imperialRow?.schedules[scheduleName]
        const wallThicknessMm = parseSourceNumber(metricSchedule?.wall_thickness)
        if (wallThicknessMm === undefined) return undefined

        const massKgPerM = parseSourceNumber(metricSchedule.weight)
        const wallThicknessIn = parseSourceNumber(imperialSchedule?.wall_thickness)
        const massLbPerFt = parseSourceNumber(imperialSchedule?.weight)

        return {
          schedule: scheduleName,
          wallThicknessMm,
          ...(wallThicknessIn === undefined ? {} : { wallThicknessIn }),
          ...(massKgPerM === undefined ? {} : { massKgPerM }),
          ...(massLbPerFt === undefined ? {} : { massLbPerFt }),
        }
      })
      .filter((item): item is PipeScheduleRow => item !== undefined)

    return {
      nps: sourceRow.nps,
      outsideDiameterMm: parseSourceNumber(sourceRow.od) as number,
      outsideDiameterIn: parseSourceNumber(imperialRow?.od),
      shippingVolumeM3PerM: sourceRow.shipping_volume,
      shippingVolumeFt3PerFt: imperialRow?.shipping_volume,
      dn: dnByNps[sourceRow.nps],
      schedules,
    }
  })
}

/**
 * The raw catalogue data is kept internally as JSON. Metric and imperial values
 * are transcribed independently from the corresponding Hirad catalogue tables.
 */
export const pipeDimensionsSource = {
  reference: 'Hirad Catalogue',
  downloads: {
    metric: {
      href: '/resources/pipe-dimensions/hirad-catalogue-metric.pdf',
      fileName: 'Hirad-Catalogue-Metric.pdf',
    },
    imperial: {
      href: '/resources/pipe-dimensions/hirad-catalogue-imperial.pdf',
      fileName: 'Hirad-Catalogue-Imperial.pdf',
    },
  },
} as const

export const pipeStandards: PipeStandardDefinition[] = [
  {
    id: 'ASME_B36_10',
    code: 'ASME B36.10 / B36.10M',
    title: { fa: 'لوله فولادی کربنی و آلیاژی', en: 'Carbon and alloy steel pipe' },
    description: {
      fa: 'ابعاد و وزن لوله‌های فولادی از جدول کاتالوگ هیراد بر پایه استاندارد ASME B36.10.',
      en: 'Steel pipe dimensions and weight from Hirad catalogue tables based on ASME B36.10.',
    },
    rows: createRows('ASME_B36_10'),
  },
  {
    id: 'ASME_B36_19',
    code: 'ASME B36.19 / B36.19M',
    title: { fa: 'لوله استنلس استیل', en: 'Stainless steel pipe' },
    description: {
      fa: 'ابعاد و وزن لوله‌های آستنیتی استنلس استیل از جدول کاتالوگ هیراد بر پایه استاندارد ASME B36.19.',
      en: 'Austenitic stainless steel pipe dimensions and weight from Hirad catalogue tables based on ASME B36.19.',
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
