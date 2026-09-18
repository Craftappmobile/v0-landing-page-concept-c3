import { NextResponse } from "next/server"

export const dynamic = "force-static"

export async function GET() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/$/, "") || "https://vjazhi.com.ua"

  const lines = [
    "User-agent: *",
    "Allow: /",
    "Disallow: /api/",
    "Disallow: /checkout",
    "Disallow: /cancel",
    "Content-Signal: ai-train=no, search=yes, ai-input=yes",
    "",
    `Agentmap: ${siteUrl}/.well-known/ai-catalog.json`,
    `Sitemap: ${siteUrl}/sitemap.xml`,
  ]

  return new NextResponse(lines.join("\n"), {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=86400, stale-while-revalidate=3600",
    },
  })
}
