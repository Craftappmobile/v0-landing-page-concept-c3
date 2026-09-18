import { NextResponse } from "next/server"

export const dynamic = "force-static"

export async function GET() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/$/, "") || "https://vjazhi.com.ua"

  const catalog = {
    specVersion: "1.0",
    host: {
      displayName: "Розрахуй і В'яжи (Vjazhi)",
      identifier: "did:web:vjazhi.com.ua",
    },
    entries: [
      {
        identifier: "urn:air:vjazhi.com.ua:skill:knitting-calculators",
        displayName: "Vjazhi Knitting Agent Skill",
        type: "text/markdown",
        url: `${siteUrl}/.well-known/agent-skills/knitting-calculators/SKILL.md`,
        representativeQueries: [
          "розрахувати петлі для горловини",
          "як зв'язати кардиган регланом",
          "розрахунок шапки та шкарпеток",
          "how to calculate knitting gauge",
        ],
      },
      {
        identifier: "urn:air:vjazhi.com.ua:catalog:api",
        displayName: "Vjazhi API Catalog",
        type: "application/linkset+json",
        url: `${siteUrl}/.well-known/api-catalog`,
        representativeQueries: [
          "vjazhi api endpoints",
          "knitting calculators api documentation",
        ],
      },
    ],
  }

  return NextResponse.json(catalog, {
    status: 200,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "public, max-age=86400",
    },
  })
}
