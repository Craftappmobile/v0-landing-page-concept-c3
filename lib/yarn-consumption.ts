export type YarnConsumptionUnit = "м" | "г"

export type YarnConsumptionEntry = {
  label: string
  min?: number
  max?: number
  needle: number
  hook?: number
  unit: YarnConsumptionUnit
}

export type YarnConsumptionProduct = {
  slug: string
  label: string
  measurement: "bust" | "hips" | "age" | "size"
  entries: YarnConsumptionEntry[]
}

export type YarnConsumptionGroup = {
  slug: string
  label: string
  products: YarnConsumptionProduct[]
}

const womenBust = [
  { label: "75–80 см", min: 75, max: 80 },
  { label: "81–86 см", min: 81, max: 86 },
  { label: "86–94 см", min: 86, max: 94 },
  { label: "94–102 см", min: 94, max: 102 },
  { label: "102–107 см", min: 102, max: 107 },
  { label: "107–114 см", min: 107, max: 114 },
  { label: "114–122 см", min: 114, max: 122 },
]

function meters(values: number[], hooks: number[], unit: YarnConsumptionUnit = "м") {
  return womenBust.map((range, index) => ({ ...range, needle: values[index], hook: hooks[index], unit }))
}

function hipMeters(ranges: Array<[string, number, number]>, values: number[], hooks: number[]) {
  return ranges.map(([label, min, max], index) => ({ label, min, max, needle: values[index], hook: hooks[index], unit: "м" as const }))
}

const womenHip6: Array<[string, number, number]> = [
  ["85–92 см", 85, 92], ["93–100 см", 93, 100], ["101–105 см", 101, 105],
  ["106–109 см", 106, 109], ["110–115 см", 110, 115], ["116–122 см", 116, 122],
]

const womenHip8: Array<[string, number, number]> = [...womenHip6, ["123–128 см", 123, 128], ["129–135 см", 129, 135]]

export const yarnConsumptionGroups: YarnConsumptionGroup[] = [
  {
    slug: "women",
    label: "Жіночі вироби",
    products: [
      { slug: "sweater", label: "Светр / джемпер / пуловер", measurement: "bust", entries: meters([1100, 1300, 1500, 1700, 1900, 2100, 2300], [1200, 1560, 1800, 2040, 2280, 2520, 2760]) },
      { slug: "vest", label: "Жилет", measurement: "bust", entries: meters([600, 800, 900, 1000, 1100, 1200, 1300], [720, 960, 1080, 1200, 1300, 1440, 1560]) },
      { slug: "cardigan", label: "Кардиган", measurement: "bust", entries: meters([1200, 1400, 1600, 1800, 2000, 2200, 2400], [1440, 1680, 1920, 2160, 2400, 2640, 2880]) },
      { slug: "mohair", label: "Павутинка з мохеру", measurement: "bust", entries: meters([600, 700, 800, 1100, 1300, 1500, 1700], [720, 840, 960, 1300, 1560, 1800, 2040]) },
      { slug: "dress", label: "Сукня", measurement: "bust", entries: meters([1500, 1700, 2000, 2200, 2500, 2750, 3000], [1800, 2040, 2400, 2640, 3000, 3300, 3600]) },
      { slug: "suit", label: "Костюм", measurement: "bust", entries: meters([1700, 1900, 2100, 2300, 2500, 3000, 3150], [2040, 2280, 2520, 2760, 3000, 3600, 3780]) },
      { slug: "tank", label: "Майка", measurement: "bust", entries: meters([500, 650, 800, 950, 1050, 1150, 1250], [600, 780, 960, 1140, 1260, 1380, 1500]) },
      { slug: "tshirt", label: "Футболка", measurement: "bust", entries: meters([700, 800, 900, 1000, 1100, 1200, 1350], [840, 960, 1080, 1200, 1320, 1440, 1620]) },
      { slug: "mini-skirt", label: "Спідниця міні", measurement: "hips", entries: hipMeters(womenHip6, [700, 800, 900, 1000, 1100, 1250], [840, 960, 1080, 1200, 1320, 1500]) },
      { slug: "midi-skirt", label: "Спідниця міді", measurement: "hips", entries: hipMeters(womenHip8, [1000, 1100, 1300, 1400, 1500, 1600, 1750, 1900], [1200, 1320, 1560, 1680, 1800, 1920, 2100, 2280]) },
      { slug: "maxi-skirt", label: "Спідниця максі", measurement: "hips", entries: hipMeters(womenHip8, [1500, 1700, 1900, 2100, 2300, 2500, 2700, 3000], [1800, 2040, 2280, 2520, 2760, 3000, 3250, 3600]) },
      { slug: "shorts", label: "Шорти", measurement: "hips", entries: hipMeters(womenHip6, [450, 500, 550, 650, 800, 1000], [540, 600, 660, 780, 960, 1200]) },
    ],
  },
  {
    slug: "men",
    label: "Чоловічі вироби",
    products: [
      { slug: "sweater", label: "Светр / джемпер / пуловер", measurement: "bust", entries: hipMeters([["94–102 см", 94, 102], ["102–107 см", 102, 107], ["107–114 см", 107, 114], ["114–122 см", 114, 122]], [2000, 2200, 2400, 2600], [2400, 2640, 2880, 3120]) },
      { slug: "vest", label: "Жилет", measurement: "bust", entries: hipMeters([["94–102 см", 94, 102], ["102–107 см", 102, 107], ["107–114 см", 107, 114], ["114–122 см", 114, 122]], [1300, 1500, 1700, 1900], [1650, 1800, 2040, 2280]) },
      { slug: "cardigan", label: "Кардиган", measurement: "bust", entries: hipMeters([["94–102 см", 94, 102], ["102–107 см", 102, 107], ["107–114 см", 107, 114], ["114–122 см", 114, 122]], [2100, 2300, 2500, 2700], [2520, 2760, 3000, 3240]) },
      { slug: "tshirt", label: "Футболка", measurement: "bust", entries: hipMeters([["94–102 см", 94, 102], ["102–107 см", 102, 107], ["107–114 см", 107, 114], ["114–122 см", 114, 122]], [1100, 1200, 1300, 1400], [1320, 1440, 1560, 1680]) },
    ],
  },
  {
    slug: "kids",
    label: "Дитячі вироби",
    products: [
      { slug: "sweater", label: "Светр / джемпер / пуловер", measurement: "age", entries: [{ label: "до 1 року", min: 0, max: 1, needle: 550, hook: 660, unit: "м" }, { label: "1–3 роки", min: 1, max: 3, needle: 800, hook: 960, unit: "м" }, { label: "4–7 років", min: 4, max: 7, needle: 950, hook: 1140, unit: "м" }, { label: "7–11 років", min: 7, max: 11, needle: 1200, hook: 1440, unit: "м" }, { label: "12–16 років", min: 12, max: 16, needle: 1300, hook: 1560, unit: "м" }] },
      { slug: "tank", label: "Майка", measurement: "age", entries: [{ label: "1–3 роки", min: 1, max: 3, needle: 300, hook: 360, unit: "м" }, { label: "4–7 років", min: 4, max: 7, needle: 400, hook: 480, unit: "м" }, { label: "7–11 років", min: 7, max: 11, needle: 500, hook: 600, unit: "м" }, { label: "12–16 років", min: 12, max: 16, needle: 600, hook: 720, unit: "м" }] },
      { slug: "cardigan", label: "Кардиган", measurement: "age", entries: [{ label: "1–3 роки", min: 1, max: 3, needle: 800, hook: 960, unit: "м" }, { label: "4–7 років", min: 4, max: 7, needle: 950, hook: 1140, unit: "м" }, { label: "7–11 років", min: 7, max: 11, needle: 1300, hook: 1560, unit: "м" }, { label: "12–16 років", min: 12, max: 16, needle: 1500, hook: 1800, unit: "м" }] },
      { slug: "suit", label: "Костюм", measurement: "age", entries: [{ label: "1–3 роки", min: 1, max: 3, needle: 1500, hook: 1800, unit: "м" }, { label: "4–7 років", min: 4, max: 7, needle: 1700, hook: 2040, unit: "м" }, { label: "7–11 років", min: 7, max: 11, needle: 2000, hook: 2400, unit: "м" }, { label: "12–16 років", min: 12, max: 16, needle: 2300, hook: 2760, unit: "м" }] },
    ],
  },
  {
    slug: "accessories",
    label: "Аксесуари",
    products: [
      { slug: "scarf", label: "Шарф", measurement: "size", entries: [{ label: "Середній розмір", needle: 200, hook: 300, unit: "г" }, { label: "Широкий та довгий", needle: 300, hook: 500, unit: "г" }] },
      { slug: "socks", label: "Шкарпетки", measurement: "size", entries: [{ label: "Стандартна пара", needle: 100, hook: 120, unit: "г" }] },
      { slug: "gloves", label: "Рукавички", measurement: "size", entries: [{ label: "Стандартна пара", needle: 60, hook: 100, unit: "г" }] },
    ],
  },
  {
    slug: "blankets",
    label: "Пледи",
    products: [
      { slug: "plush", label: "Плюшева пряжа", measurement: "size", entries: [{ label: "80×80 см", needle: 500, unit: "г" }, { label: "100×100 см", needle: 600, hook: 700, unit: "г" }, { label: "90×120 см", needle: 700, hook: 800, unit: "г" }, { label: "110×120 см", needle: 800, hook: 900, unit: "г" }, { label: "120×170 см", needle: 1100, hook: 1200, unit: "г" }, { label: "130×190 см", needle: 1300, hook: 1400, unit: "г" }, { label: "150×150 см", needle: 1500, hook: 1600, unit: "г" }, { label: "150×200 см", needle: 1700, hook: 1800, unit: "г" }, { label: "160×210 см", needle: 2000, hook: 2300, unit: "г" }, { label: "180×220 см", needle: 2400, hook: 2700, unit: "г" }, { label: "200×220 см", needle: 2900, hook: 3000, unit: "г" }] },
      { slug: "wool", label: "Вовняна / трикотажна нитка", measurement: "size", entries: [{ label: "80×120 см", needle: 2000, unit: "г" }, { label: "100×150 см", needle: 3000, unit: "г" }, { label: "130×170 см", needle: 4500, unit: "г" }, { label: "150×200 см", needle: 6000, unit: "г" }] },
    ],
  },
]

export function formatConsumption(entry: YarnConsumptionEntry) {
  if (entry.hook) return `${entry.needle}–${entry.hook} ${entry.unit}`
  return `${entry.needle} ${entry.unit}`
}