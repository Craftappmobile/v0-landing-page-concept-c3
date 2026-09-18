"use client"

import { useEffect } from "react"

export function WebMcpProvider() {
  useEffect(() => {
    if (typeof window === "undefined") return

    try {
      const nav = window.navigator as any
      if (!nav || !nav.modelContext) return

      const tools = [
        {
          name: "search_knitting_calculators",
          description:
            "Search and discover available knitting calculators on Vjazhi (e.g. gauge/щільність, raglan, yarn consumption, hat, socks).",
          inputSchema: {
            type: "object",
            properties: {
              query: {
                type: "string",
                description:
                  "Name of the calculation or garment type (e.g. raglan, shchilnist, vytrata, shapka).",
              },
            },
            required: ["query"],
          },
          execute: async ({ query }: { query: string }) => {
            const normalized = (query || "").toLowerCase()
            return {
              url: "https://vjazhi.com.ua/kalkuliatory",
              query: normalized,
              message: `Found knitting calculators for ${normalized}`,
            }
          },
        },
        {
          name: "calculate_knitting_gauge",
          description:
            "Calculate stitches and rows per centimeter from a 10x10 cm knitted swatch.",
          inputSchema: {
            type: "object",
            properties: {
              stitches_in_10cm: {
                type: "number",
                description: "Number of stitches across 10 cm",
              },
              rows_in_10cm: {
                type: "number",
                description: "Number of rows across 10 cm",
              },
            },
            required: ["stitches_in_10cm", "rows_in_10cm"],
          },
          execute: async ({
            stitches_in_10cm,
            rows_in_10cm,
          }: {
            stitches_in_10cm: number
            rows_in_10cm: number
          }) => {
            const stitchDensity = stitches_in_10cm / 10
            const rowDensity = rows_in_10cm / 10
            return {
              stitchDensityPerCm: stitchDensity,
              rowDensityPerCm: rowDensity,
              summary: `${stitchDensity} пет/см, ${rowDensity} ряд/см`,
            }
          },
        },
      ]

      if (typeof nav.modelContext.registerTool === "function") {
        for (const tool of tools) {
          try {
            nav.modelContext.registerTool(tool)
          } catch {}
        }
      }

      if (typeof nav.modelContext.provideContext === "function") {
        try {
          nav.modelContext.provideContext({ tools })
        } catch {}
      }
    } catch {}
  }, [])

  return null
}
