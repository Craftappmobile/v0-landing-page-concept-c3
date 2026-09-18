import { NextResponse } from "next/server"

export const dynamic = "force-static"

export async function GET() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/$/, "") || "https://vjazhi.com.ua"

  const catalog = {
    linkset: [
      {
        anchor: `${siteUrl}/api`,
        "service-desc": [
          {
            href: `${siteUrl}/openapi.json`,
            type: "application/openapi+json",
          },
        ],
        "service-doc": [
          {
            href: `${siteUrl}/kalkuliatory`,
            type: "text/html",
          },
        ],
        status: [
          {
            href: `${siteUrl}/api/health`,
            type: "application/json",
          },
        ],
      },
    ],
  }

  return new NextResponse(JSON.stringify(catalog, null, 2), {
    status: 200,
    headers: {
      "Content-Type": "application/linkset+json; charset=utf-8",
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "public, max-age=86400",
    },
  })
}
