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

/**
 * Source metadata is kept alongside the static table so future updates can be
 * checked against the catalogue rather than copied into a second unit table.
 * The bundled viewer exposes this sheet as page 16; it is the pipe-dimensions
 * sheet referenced by the catalogue's pipe section.
 */
export const pipeDimensionsSource = {
  title: 'Hirad product catalogue — pipe dimensions table',
  reference: 'Bundled catalogue scan, viewer page 16',
  localAsset: '/flipHTML/files/page/16.jpg',
  columns: 'NPS, OD, wall thickness, weight per metre',
  note: 'Only source cells that are legible in the bundled catalogue sheet are included.',
} as const

const schedule = (name: string, wallThicknessMm: number, massKgPerM?: number): PipeScheduleRow => ({
  schedule: name,
  wallThicknessMm,
  ...(massKgPerM === undefined ? {} : { massKgPerM }),
})

const nps = (name: string, outsideDiameterMm: number, dn: number, schedules: PipeScheduleRow[]): PipeNpsRow => ({
  nps: name,
  outsideDiameterMm,
  dn,
  schedules,
})

export const pipeStandards: PipeStandardDefinition[] = [
  {
    id: 'ASME_B36_10',
    code: 'ASME B36.10 / B36.10M',
    title: { fa: 'لوله فولادی کربنی و آلیاژی', en: 'Carbon and alloy steel pipe' },
    description: {
      fa: 'ابعاد و وزن لوله‌های فولادی بدون درز بر اساس جدول کاتالوگ هیراد.',
      en: 'Dimensions and weight for seamless steel pipe from the Hirad catalogue table.',
    },
    rows: [
      nps('1/2', 21.30, 15, [schedule('STD', 2.77, 1.27), schedule('40', 2.77, 1.27), schedule('XS', 3.73, 1.62), schedule('80', 3.73, 1.62), schedule('160', 4.78, 1.95), schedule('XXS', 7.47, 2.55)]),
      nps('1', 33.40, 25, [schedule('STD', 3.38, 2.50), schedule('40', 3.38, 2.50), schedule('XS', 4.55, 3.24), schedule('80', 4.55, 3.24), schedule('160', 6.35, 4.24), schedule('XXS', 9.09, 5.45)]),
      nps('2', 60.30, 50, [schedule('STD', 3.91, 5.44), schedule('40', 3.91, 5.44), schedule('XS', 5.54, 7.48), schedule('80', 5.54, 7.48), schedule('160', 8.74, 11.11), schedule('XXS', 11.07, 13.44)]),
      nps('4', 114.30, 100, [schedule('STD', 6.02, 16.07), schedule('40', 6.02, 16.07), schedule('XS', 8.56, 22.32), schedule('80', 8.56, 22.32), schedule('120', 11.13, 28.32), schedule('160', 13.49, 33.54), schedule('XXS', 17.12, 41.03)]),
      nps('6', 168.30, 150, [schedule('STD', 7.11, 28.26), schedule('40', 7.11, 28.26), schedule('XS', 10.97, 42.56), schedule('80', 10.97, 42.56), schedule('120', 14.27, 54.20), schedule('160', 18.26, 67.56)]),
      nps('8', 219.10, 200, [schedule('20', 6.35, 33.31), schedule('30', 7.04, 36.81), schedule('STD', 8.18, 42.55), schedule('40', 8.18, 42.55), schedule('60', 10.31, 53.08), schedule('XS', 12.70, 64.64), schedule('80', 12.70, 64.64), schedule('100', 15.09, 75.92), schedule('120', 18.26, 90.44), schedule('140', 20.62, 100.92), schedule('160', 23.01, 111.27), schedule('XXS', 22.23, 107.92)]),
      nps('10', 273.10, 250, [schedule('20', 6.35, 41.77), schedule('30', 7.80, 51.03), schedule('STD', 9.27, 60.31), schedule('40', 9.27, 60.31), schedule('60', 12.70, 81.55), schedule('XS', 15.09, 96.01), schedule('80', 15.09, 96.01), schedule('100', 18.26, 114.75), schedule('120', 21.44, 133.06), schedule('140', 25.40, 155.15), schedule('160', 28.58, 172.33)]),
    ],
  },
  {
    id: 'ASME_B36_19',
    code: 'ASME B36.19 / B36.19M',
    title: { fa: 'لوله فولادی زنگ‌نزن', en: 'Stainless steel pipe' },
    description: {
      fa: 'ابعاد و وزن لوله‌های آستنیتی فولاد زنگ‌نزن بر اساس جدول کاتالوگ هیراد.',
      en: 'Dimensions and weight for austenitic stainless steel pipe from the Hirad catalogue table.',
    },
    rows: [
      nps('1/2', 21.30, 15, [schedule('5S', 1.65, 0.82), schedule('10S', 2.11, 1.01), schedule('40S', 2.77, 1.30), schedule('80S', 3.73, 1.65)]),
      nps('3/4', 26.70, 20, [schedule('5S', 1.65, 1.04), schedule('10S', 2.11, 1.31), schedule('40S', 2.87, 1.71), schedule('80S', 3.91, 2.24)]),
      nps('1', 33.40, 25, [schedule('5S', 1.65, 1.33), schedule('10S', 2.77, 2.13), schedule('40S', 3.38, 2.55), schedule('80S', 4.55, 3.29)]),
      nps('4', 114.30, 100, [schedule('5S', 2.11, 5.96), schedule('10S', 3.05, 8.52), schedule('40S', 6.02, 16.40), schedule('80S', 8.56, 22.27)]),
      nps('6', 168.30, 150, [schedule('5S', 2.77, 11.55), schedule('10S', 3.40, 14.13), schedule('40S', 7.11, 28.83), schedule('80S', 10.97, 43.42)]),
      nps('8', 219.10, 200, [schedule('5S', 2.77, 15.09), schedule('10S', 3.76, 20.37), schedule('40S', 8.18, 43.39), schedule('80S', 12.70, 65.59)]),
      nps('10', 273.10, 250, [schedule('5S', 3.40, 23.08), schedule('10S', 4.19, 28.34), schedule('40S', 9.27, 61.52)]),
      nps('12', 323.90, 300, [schedule('5S', 3.96, 31.89), schedule('40S', 9.52, 75.52), schedule('80S', 12.70, 99.43)]),
    ],
  },
]

export function getPipeStandard(id: PipeStandardId) {
  return pipeStandards.find(standard => standard.id === id)
}

export function getPipeNps(standardId: PipeStandardId, npsValue: string) {
  return getPipeStandard(standardId)?.rows.find(row => row.nps === npsValue)
}
