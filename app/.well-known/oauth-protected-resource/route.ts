import { NextResponse } from "next/server"

export const dynamic = "force-static"

export async function GET() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/$/, "") || "https://vjazhi.com.ua"

  const metadata = {
    resource: siteUrl,
    scopes_supported: ["read"],
    bearer_methods_supported: ["header"],
    resource_documentation: `${siteUrl}/about`,
  }

  return NextResponse.json(metadata, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "public, max-age=86400",
    },
  })
}
