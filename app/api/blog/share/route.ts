import { NextRequest, NextResponse } from "next/server"

import { getPostBySlug } from "@/lib/blog"
import { createAdminClient } from "@/lib/supabase"

const SHARE_PLATFORMS = new Set([
  "telegram",
  "facebook",
  "viber",
  "whatsapp",
  "pinterest",
  "instagram",
  "copy",
])

type ShareCountRow = {
  slug: string
  total_count: number
}

function isValidSlug(slug: string | null) {
  return Boolean(slug && getPostBySlug(slug))
}

function countResponse(row: ShareCountRow | null, slug: string) {
  return NextResponse.json(
    {
      slug,
      totalCount: row?.total_count ?? 0,
    },
    { headers: { "Cache-Control": "no-store" } },
  )
}

export async function GET(request: NextRequest) {
  const slug = request.nextUrl.searchParams.get("slug")?.trim() ?? null

  if (!slug || !isValidSlug(slug)) {
    return NextResponse.json({ error: "Unknown blog post" }, { status: 404 })
  }

  try {
    const supabase = createAdminClient()
    const { data, error } = await supabase
      .from("blog_share_counts")
      .select("slug, total_count")
      .eq("slug", slug)
      .maybeSingle()

    if (error) {
      console.error("[Blog Share] Failed to load count:", error)
      return NextResponse.json({ error: "Failed to load share count" }, { status: 500 })
    }

    return countResponse(data, slug)
  } catch (error) {
    console.error("[Blog Share] Unexpected GET error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  let body: { slug?: string; platform?: string }

  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
  }

  const slug = body.slug?.trim() ?? null
  const platform = body.platform?.trim().toLowerCase() ?? ""

  if (!slug || !isValidSlug(slug)) {
    return NextResponse.json({ error: "Unknown blog post" }, { status: 404 })
  }

  if (!SHARE_PLATFORMS.has(platform)) {
    return NextResponse.json({ error: "Unsupported share platform" }, { status: 400 })
  }

  try {
    const supabase = createAdminClient()
    const { data, error } = await supabase.rpc("increment_blog_share_count", {
      p_slug: slug,
      p_platform: platform,
    })

    if (error) {
      console.error("[Blog Share] Failed to increment count:", error)
      return NextResponse.json({ error: "Failed to update share count" }, { status: 500 })
    }

    return countResponse(data, slug)
  } catch (error) {
    console.error("[Blog Share] Unexpected POST error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}