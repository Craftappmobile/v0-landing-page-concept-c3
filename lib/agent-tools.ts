import { calculators } from "./calculators"
import {
  formatConsumption,
  yarnConsumptionGroups,
  type YarnConsumptionEntry,
  type YarnConsumptionProduct,
} from "./yarn-consumption"
import { siteUrl } from "./agent-metadata"

export type AgentToolSchema = {
  type: "object"
  properties: Record<string, unknown>
  required?: string[]
}

export type AgentTool = {
  name: string
  description: string
  inputSchema: AgentToolSchema
  run: (args: Record<string, unknown>) => unknown
}

function asNumber(value: unknown): number | undefined {
  if (typeof value === "number" && Number.isFinite(value)) return value
  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value)
    if (Number.isFinite(parsed)) return parsed
  }
  return undefined
}

function asString(value: unknown): string | undefined {
  if (typeof value === "string" && value.trim() !== "") return value.trim()
  return undefined
}

function round(value: number, digits = 3): number {
  const factor = 10 ** digits
  return Math.round(value * factor) / factor
}

const calculateGauge: AgentTool = {
  name: "calculate_gauge",
  description:
    "Calculate stitch and row density per centimetre from a 10x10 cm swatch, and optionally scale the density to a target width and height.",
  inputSchema: {
    type: "object",
    properties: {
      stitches_in_10cm: { type: "number", description: "Stitches counted across 10 cm of the swatch" },
      rows_in_10cm: { type: "number", description: "Rows counted across 10 cm of the swatch" },
      width_cm: { type: "number", description: "Optional target width in cm, converted into a stitch count" },
      height_cm: { type: "number", description: "Optional target height in cm, converted into a row count" },
    },
    required: ["stitches_in_10cm", "rows_in_10cm"],
  },
  run: (args) => {
    const stitches = asNumber(args.stitches_in_10cm)
    const rows = asNumber(args.rows_in_10cm)
    if (!stitches || !rows || stitches <= 0 || rows <= 0) {
      throw new Error("stitches_in_10cm and rows_in_10cm must be positive numbers")
    }
    const stitchDensity = stitches / 10
    const rowDensity = rows / 10
    const result: Record<string, unknown> = {
      stitch_density_per_cm: round(stitchDensity),
      row_density_per_cm: round(rowDensity),
    }
    const width = asNumber(args.width_cm)
    const height = asNumber(args.height_cm)
    if (width && width > 0) result.stitches_for_width = Math.round(stitchDensity * width)
    if (height && height > 0) result.rows_for_height = Math.round(rowDensity * height)
    return result
  },
}

function findEntry(
  product: YarnConsumptionProduct,
  size?: string,
  measurement?: number,
): YarnConsumptionEntry | undefined {
  if (size) {
    const normalized = size.toLowerCase()
    const byLabel = product.entries.find((entry) => entry.label.toLowerCase().includes(normalized))
    if (byLabel) return byLabel
  }
  if (measurement !== undefined) {
    return product.entries.find(
      (entry) =>
        (entry.min === undefined || measurement >= entry.min) &&
        (entry.max === undefined || measurement <= entry.max),
    )
  }
  return undefined
}

const estimateYarn: AgentTool = {
  name: "estimate_yarn_consumption",
  description:
    "Estimate yarn consumption for a garment type and size using Vjazhi reference tables (meters for garments, grams for accessories and blankets).",
  inputSchema: {
    type: "object",
    properties: {
      category: { type: "string", description: "Category slug: women, men, kids, accessories, blankets" },
      product: { type: "string", description: "Product slug or label fragment, e.g. sweater, cardigan, socks" },
      size: { type: "string", description: "Optional size label fragment, e.g. '94–102 см'" },
      measurement_cm: { type: "number", description: "Optional bust/hip measurement in cm (or age in years for kids)" },
    },
    required: ["category", "product"],
  },
  run: (args) => {
    const category = asString(args.category)?.toLowerCase()
    const productQuery = asString(args.product)?.toLowerCase()
    if (!category || !productQuery) throw new Error("category and product are required")
    const group = yarnConsumptionGroups.find(
      (item) => item.slug === category || item.label.toLowerCase().includes(category),
    )
    if (!group) {
      throw new Error(
        `Unknown category "${category}". Valid categories: ${yarnConsumptionGroups.map((item) => item.slug).join(", ")}`,
      )
    }
    const product = group.products.find(
      (item) => item.slug === productQuery || item.label.toLowerCase().includes(productQuery),
    )
    if (!product) {
      throw new Error(
        `Unknown product "${productQuery}" in "${group.slug}". Valid products: ${group.products.map((item) => item.slug).join(", ")}`,
      )
    }
    const entry = findEntry(product, asString(args.size), asNumber(args.measurement_cm))
    if (!entry) throw new Error("No matching size found. Provide a valid size label or measurement_cm.")
    return {
      category: group.label,
      product: product.label,
      size: entry.label,
      unit: entry.unit,
      knitting: `${entry.needle} ${entry.unit}`,
      crochet: entry.hook ? `${entry.hook} ${entry.unit}` : null,
      formatted: formatConsumption(entry),
    }
  },
}

const searchCalculators: AgentTool = {
  name: "search_calculators",
  description: "Search the Vjazhi online knitting calculators by keyword and return direct links.",
  inputSchema: {
    type: "object",
    properties: {
      query: { type: "string", description: "Keyword such as raglan, gauge, hat, sock or yarn" },
      limit: { type: "number", description: "Maximum number of results (default 5)" },
    },
    required: ["query"],
  },
  run: (args) => {
    const query = asString(args.query)?.toLowerCase()
    if (!query) throw new Error("query is required")
    const limit = Math.min(Math.max(Math.trunc(asNumber(args.limit) ?? 5), 1), 20)
    const terms = query.split(/\s+/).filter(Boolean)
    const results = calculators
      .map((calculator) => {
        const haystack = [
          calculator.slug,
          calculator.shortTitle,
          calculator.title,
          calculator.description,
          ...calculator.keywords,
        ]
          .join(" ")
          .toLowerCase()
        const score = terms.reduce((total, term) => total + (haystack.includes(term) ? 1 : 0), 0)
        return { calculator, score }
      })
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map((item) => ({
        slug: item.calculator.slug,
        title: item.calculator.shortTitle,
        url: `${siteUrl}/kalkuliatory/${item.calculator.slug}`,
      }))
    return { query, count: results.length, results }
  },
}

export const agentTools: AgentTool[] = [calculateGauge, estimateYarn, searchCalculators]

export function getAgentTool(name: string): AgentTool | undefined {
  return agentTools.find((tool) => tool.name === name)
}
