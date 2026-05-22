import { NextRequest, NextResponse } from "next/server"

import { getPostBySlug } from "@/lib/blog"
import { getApprovedBlogComments } from "@/lib/blog-comments"
import { createAdminClient } from "@/lib/supabase"

const AUTHOR_MIN_LENGTH = 2
const AUTHOR_MAX_LENGTH = 60
const BODY_MIN_LENGTH = 10
const BODY_MAX_LENGTH = 1200

function normalizeText(value: unknown) {
  return typeof value === "string" ? value.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim() : ""
}

function validateSlug(slug: string | null) {
  return Boolean(slug && getPostBySlug(slug))
}

export async function GET(request: NextRequest) {
  const slug = request.nextUrl.searchParams.get("slug")?.trim() ?? null

  if (!slug || !validateSlug(slug)) {
    return NextResponse.json({ error: "Unknown blog post" }, { status: 404 })
  }

  const comments = await getApprovedBlogComments(slug)
  return NextResponse.json({ comments }, { headers: { "Cache-Control": "no-store" } })
}

export async function POST(request: NextRequest) {
  let body: Record<string, unknown>

  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
  }

  const slug = normalizeText(body.slug)
  const authorName = normalizeText(body.authorName)
  const commentBody = normalizeText(body.body)
  const honeypot = normalizeText(body.website)

  if (honeypot) {
    return NextResponse.json({ status: "pending" }, { status: 202 })
  }

  if (!validateSlug(slug)) {
    return NextResponse.json({ error: "Unknown blog post" }, { status: 404 })
  }

  if (authorName.length < AUTHOR_MIN_LENGTH || authorName.length > AUTHOR_MAX_LENGTH) {
    return NextResponse.json({ error: "Ім’я має містити від 2 до 60 символів" }, { status: 400 })
  }

  if (commentBody.length < BODY_MIN_LENGTH || commentBody.length > BODY_MAX_LENGTH) {
    return NextResponse.json({ error: "Коментар має містити від 10 до 1200 символів" }, { status: 400 })
  }

  try {
    const supabase = createAdminClient()
    const { error } = await supabase.from("blog_comments").insert({
      slug,
      author_name: authorName,
      body: commentBody,
      status: "pending",
      source: "user",
    })

    if (error) {
      console.error("[Blog Comments] Failed to create comment:", error)
      return NextResponse.json({ error: "Failed to submit comment" }, { status: 500 })
    }

    return NextResponse.json({ status: "pending" }, { status: 201 })
  } catch (error) {
    console.error("[Blog Comments] Unexpected POST error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}