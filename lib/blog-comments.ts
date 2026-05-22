import { createAdminClient } from "@/lib/supabase"

export type BlogComment = {
  id: string
  authorName: string
  body: string
  createdAt: string
}

type BlogCommentRow = {
  id: string
  author_name: string
  body: string
  created_at: string
}

function mapComment(row: BlogCommentRow): BlogComment {
  return {
    id: row.id,
    authorName: row.author_name,
    body: row.body,
    createdAt: row.created_at,
  }
}

export async function getApprovedBlogComments(slug: string) {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from("blog_comments")
    .select("id, author_name, body, created_at")
    .eq("slug", slug)
    .eq("status", "approved")
    .order("created_at", { ascending: true })
    .limit(50)

  if (error) {
    console.error("[Blog Comments] Failed to load approved comments:", error)
    return []
  }

  return (data ?? []).map((row) => mapComment(row as BlogCommentRow))
}