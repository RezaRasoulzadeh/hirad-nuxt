export type ValveSeatUnit = 'bar' | 'psi'
export type ValveSeatTemperatureUnit = 'F' | 'C'

export interface ValveSeatCharacteristic {
  id: string
  fa: string
  en: string
}

export interface ValveSeatMaterialRecord {
  id: string
  tradeMark: string
  fullName: string
  pressureText?: string
  pressure?: {
    value: number
    unit: ValveSeatUnit
  }
  temperatureText?: string
  temperature?: {
    min?: number
    max?: number
    unit: ValveSeatTemperatureUnit
  }
  description: string
  descriptionFa: string
  chemicalProperties: {
    carbon: string
    other?: string
  }
  color: string
  characteristics: string[]
  qualifiers?: string[]
  qualifiersFa?: string[]
}

export interface ValveSeatMaterialDataset {
  source: {
    name: string
    referenceTable: string
    printedTableTitle: string
    localReferenceAsset: string
    internalLocation: string
    transcriptionMethod: string
    reviewNotes: string[]
  }
  characteristics: ValveSeatCharacteristic[]
  records: ValveSeatMaterialRecord[]
}

export const valveSeatMaterialDataset: ValveSeatMaterialDataset = {
  source: {
    name: 'Hirad Catalogue',
    referenceTable: 'Usual Materials for Seat in Valves',
    printedTableTitle: 'USUAL MATERIALS FOR SEAT IN VALVES',
    localReferenceAsset: '/flipHTML/files/page/23.jpg',
    internalLocation: 'Catalogue page 23',
    transcriptionMethod: 'Manual structured transcription from the supplied local Hirad Catalogue table. Printed expressions, qualifiers, and blank fields are preserved.',
    reviewNotes: [
      'Pressure and temperature values are reproduced as printed; a blank source value remains unspecified.',
      'Temperature ranges are normalised only for filtering. The original pressure and temperature text remains available on every record.',
      'The catalogue prints “Derlin®” in the trade mark column; that spelling is preserved in the source record.',
    ],
  },
  characteristics: [
    { id: 'chemical-resistance', fa: 'مقاومت شیمیایی', en: 'Chemical resistance' },
    { id: 'chemically-inert', fa: 'خنثی شیمیایی', en: 'Chemically inert' },
    { id: 'low-friction', fa: 'اصطکاک کم', en: 'Low friction' },
    { id: 'filled-grades', fa: 'گریدهای پرشده و بدون پرکننده', en: 'Filled and unfilled grades' },
    { id: 'cryogenic', fa: 'کاربردهای کرایوژنیک', en: 'Cryogenic applications' },
    { id: 'abrasion-resistance', fa: 'مقاومت سایشی', en: 'Abrasion resistance' },
    { id: 'radiation-resistance', fa: 'مقاومت در برابر تابش', en: 'Radiation resistance' },
    { id: 'severe-service', fa: 'سرویس‌های شدید', en: 'Severe service' },
    { id: 'weather-ozone-resistance', fa: 'مقاومت جوی و ازن', en: 'Weather and ozone resistance' },
  ],
  records: [
    {
      id: 'ptfe',
      tradeMark: 'PTFE (Teflon®)',
      fullName: 'Polytetrafluoroethylene',
      pressureText: '150 Bar',
      pressure: { value: 150, unit: 'bar' },
      temperatureText: '-100°F to +450°F',
      temperature: { min: -100, max: 450, unit: 'F' },
      description: 'Chemically inert\nHigh temperature range\nLow friction\nHigh thermal co-efficient of friction\nFilled and unfilled grades are available',
      descriptionFa: 'خنثی شیمیایی\nمحدوده دمایی بالا\nاصطکاک کم\nضریب اصطکاک حرارتی بالا\nگریدهای پرشده و بدون پرکننده موجود است',
      chemicalProperties: { carbon: 'Balance', other: '0.60' },
      color: 'White',
      characteristics: ['chemical-resistance', 'chemically-inert', 'low-friction', 'filled-grades'],
    },
    {
      id: 'rptfe',
      tradeMark: 'RPTFE (Reinforced Teflon®)',
      fullName: 'Reinforced Polytetrafluoroethylene',
      pressureText: '150 Bar',
      pressure: { value: 150, unit: 'bar' },
      temperatureText: '-320°F to +450°F',
      temperature: { min: -320, max: 450, unit: 'F' },
      description: 'Chemically inert\nHigh temperature range\nLow friction\nHigh thermal co-efficient of friction\nFilled and unfilled grades are available',
      descriptionFa: 'خنثی شیمیایی\nمحدوده دمایی بالا\nاصطکاک کم\nضریب اصطکاک حرارتی بالا\nگریدهای پرشده و بدون پرکننده موجود است',
      chemicalProperties: { carbon: 'Balance', other: '0.60' },
      color: 'Milky White',
      characteristics: ['chemical-resistance', 'chemically-inert', 'low-friction', 'filled-grades'],
    },
    {
      id: 'pctfe',
      tradeMark: 'PCTFE',
      fullName: 'Polychlorotrifluoroethylene',
      pressureText: '100 Bar',
      pressure: { value: 100, unit: 'bar' },
      temperatureText: '+45°C to +175°C',
      temperature: { min: 45, max: 175, unit: 'C' },
      description: 'Chemical resistance\nHigh tensile strength\nGood transparency\nLow moisture absorption\nSuitable for cryogenic applications',
      descriptionFa: 'مقاومت شیمیایی\nاستحکام کششی بالا\nشفافیت مناسب\nجذب رطوبت کم\nمناسب برای کاربردهای کرایوژنیک',
      chemicalProperties: { carbon: 'Balance', other: 'F: 0.55\nCl: 0.05' },
      color: 'Black & White',
      characteristics: ['chemical-resistance', 'cryogenic'],
    },
    {
      id: 'devlon',
      tradeMark: 'Devlon®',
      fullName: 'Thermoplastic',
      pressureText: '414 Bar',
      pressure: { value: 414, unit: 'bar' },
      temperatureText: '-50°C (-58°F) to +176°C (+350°F)',
      temperature: { min: -50, max: 176, unit: 'C' },
      description: 'Thermoplastic materials are used in various applications throughout most industries, therefore their resistance to corrosion or chemical attack is well documented.',
      descriptionFa: 'مواد ترموپلاستیک در کاربردهای مختلف صنایع استفاده می‌شوند؛ بنابراین مقاومت آن‌ها در برابر خوردگی یا حمله شیمیایی به‌خوبی مستند شده است.',
      chemicalProperties: { carbon: 'Balance', other: 'H, N, F, O' },
      color: 'Black',
      characteristics: ['chemical-resistance', 'abrasion-resistance'],
    },
    {
      id: 'derlin',
      tradeMark: 'Derlin®',
      fullName: 'Polyoxy-Methylene',
      pressureText: '5000 PSI',
      pressure: { value: 5000, unit: 'psi' },
      temperatureText: '-70°F to +180°F',
      temperature: { min: -70, max: 180, unit: 'F' },
      description: 'Derlin is very rigid, does not undergo cold flow, and has an excellent combination of strength, hardness, stiffness stability, abrasion resistance and low friction. Derlin allows pressures up to 5000 PSI depending on the valve size and seal combination.',
      descriptionFa: 'درلین بسیار صلب است، دچار جریان سرد نمی‌شود و ترکیبی مناسب از استحکام، سختی، پایداری، مقاومت سایشی و اصطکاک کم دارد. درلین بسته به اندازه ولو و ترکیب آب‌بندی، فشار تا ۵۰۰۰ PSI را تحمل می‌کند.',
      chemicalProperties: { carbon: 'Balance', other: 'H, N, F, O' },
      color: 'Glossy White',
      characteristics: ['low-friction', 'abrasion-resistance'],
    },
    {
      id: 'peek',
      tradeMark: 'PEEK®',
      fullName: 'Polyetheretherketone',
      pressureText: '414 Bar',
      pressure: { value: 414, unit: 'bar' },
      temperatureText: '-70°F to +600°F',
      temperature: { min: -70, max: 600, unit: 'F' },
      description: 'Good radiation resistance\nHigh operating temperature\nGood electrical properties\nGood load bearing\nChemical resistance\nFilled and unfilled grades are available',
      descriptionFa: 'مقاومت مناسب در برابر تابش\nدمای کاری بالا\nخواص الکتریکی مناسب\nتحمل بار مناسب\nمقاومت شیمیایی\nگریدهای پرشده و بدون پرکننده موجود است',
      chemicalProperties: { carbon: 'Balance', other: 'H, N, F, O' },
      color: 'Beige Brown',
      characteristics: ['chemical-resistance', 'radiation-resistance', 'filled-grades'],
    },
    {
      id: 'uhmwpe',
      tradeMark: 'UHMWPE',
      fullName: 'Ultra-High Molecular Weight Polyethylene',
      temperatureText: '-70°F to +200°F',
      temperature: { min: -70, max: 200, unit: 'F' },
      description: 'Exceptional toughness\nLow friction\nHigh impact strength\nGood abrasion strength',
      descriptionFa: 'چقرمگی استثنایی\nاصطکاک کم\nاستحکام ضربه‌ای بالا\nمقاومت سایشی مناسب',
      chemicalProperties: { carbon: 'Balance', other: 'H, N, F, O' },
      color: 'White Opaque',
      characteristics: ['low-friction', 'abrasion-resistance'],
    },
    {
      id: 'epdm',
      tradeMark: 'EPDM®',
      fullName: 'Ethyl-Propylene',
      temperatureText: '-65°F to +600°F',
      temperature: { min: -65, max: 600, unit: 'F' },
      description: 'EPDM has good abrasion and tear resistance while offering excellent chemical resistance to a variety of acid and weak alkaline-based media. It also has exceptional weathering and ozone resistance. It also should not be used on compressed air lines.',
      descriptionFa: 'EPDM مقاومت سایشی و پارگی خوبی دارد و در برابر انواع محیط‌های اسیدی و قلیایی ضعیف، مقاومت شیمیایی عالی ارائه می‌کند. همچنین مقاومت بسیار خوبی در برابر شرایط جوی و ازن دارد. نباید در خطوط هوای فشرده استفاده شود.',
      chemicalProperties: { carbon: 'Balance', other: 'H, N, F, O' },
      color: 'Black',
      characteristics: ['chemical-resistance', 'abrasion-resistance', 'weather-ozone-resistance'],
      qualifiers: ['Should not be used on compressed air lines.'],
      qualifiersFa: ['نباید در خطوط هوای فشرده استفاده شود.'],
    },
    {
      id: 'buna-n',
      tradeMark: 'BUNA-N (NBR)',
      fullName: '(Nitrile)',
      temperatureText: '-65°F to +250°F',
      temperature: { min: -65, max: 250, unit: 'F' },
      description: 'BUNA-N performs well with diverse media such as fatty acids, oils, alcohols, compressed air, Di-ester based fluids, inactive gasses or glycerine.',
      descriptionFa: 'BUNA-N با محیط‌های متنوعی مانند اسیدهای چرب، روغن‌ها، الکل‌ها، هوای فشرده، سیالات پایه دی‌استر، گازهای بی‌اثر و گلیسیرین عملکرد مناسبی دارد.',
      chemicalProperties: { carbon: 'Balance', other: 'H, N, F, O' },
      color: 'Black',
      characteristics: [],
    },
    {
      id: 'metal-stellite',
      tradeMark: 'Metal (Stellite)',
      fullName: 'Solid Metal',
      temperatureText: '+600°F',
      description: 'are recommended for severe service applications such as flashing, hydraulic shock, abrasive media or where possible trapped metal may exist',
      descriptionFa: 'برای کاربردهای سرویس شدید مانند فلشینگ، ضربه هیدرولیکی، محیط‌های ساینده یا شرایطی که احتمال گیرکردن ذرات فلزی وجود دارد توصیه می‌شود.',
      chemicalProperties: { carbon: '', other: 'C, Cr, Co, Mo, W, Fe' },
      color: 'Silver',
      characteristics: ['severe-service', 'abrasion-resistance'],
    },
    {
      id: 'flexible-graphite',
      tradeMark: 'Flexible Graphite',
      fullName: 'Graphite',
      temperatureText: '-70°F to 1000°F',
      temperature: { min: -70, max: 1000, unit: 'F' },
      description: 'is chemically resistant to attack from nearly all organic and inorganic fluids with the exception of highly oxidizing chemicals and concentrated, highly oxidizing mineral acids',
      descriptionFa: 'در برابر تقریباً همه سیالات آلی و معدنی مقاومت شیمیایی دارد؛ به‌جز مواد شیمیایی بسیار اکسیدکننده و اسیدهای معدنی غلیظ و بسیار اکسیدکننده.',
      chemicalProperties: { carbon: 'Balance', other: 'O, N, H' },
      color: 'Shiny Black',
      characteristics: ['chemical-resistance'],
      qualifiers: ['Exception: highly oxidizing chemicals and concentrated, highly oxidizing mineral acids.'],
      qualifiersFa: ['استثنا: مواد شیمیایی بسیار اکسیدکننده و اسیدهای معدنی غلیظ و بسیار اکسیدکننده.'],
    },
    {
      id: 'viton',
      tradeMark: 'Viton®',
      fullName: 'DuPont Fluorocarbon (FKM, or FPM)',
      temperatureText: '0°F to 400°F',
      temperature: { min: 0, max: 400, unit: 'F' },
      description: 'With extensive chemical compatibility spanning a wide range of concentration and temperature ranges, fluorocarbon elastomers have gained acceptance in a variety of applications',
      descriptionFa: 'الاستومرهای فلوروکربنی به‌دلیل سازگاری شیمیایی گسترده در دامنه زیادی از غلظت و دما، در کاربردهای مختلف پذیرفته شده‌اند.',
      chemicalProperties: { carbon: 'Balance', other: 'H, N, F, O' },
      color: 'Black or Red',
      characteristics: ['chemical-resistance'],
    },
  ],
}

export function valveSeatCharacteristic(id: string) {
  return valveSeatMaterialDataset.characteristics.find(characteristic => characteristic.id === id)
}
