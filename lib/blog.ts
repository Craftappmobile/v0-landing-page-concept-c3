import fs from "node:fs"
import path from "node:path"
import matter from "gray-matter"
import { unified } from "unified"
import remarkParse from "remark-parse"
import remarkGfm from "remark-gfm"
import remarkRehype from "remark-rehype"
import rehypeSlug from "rehype-slug"
import rehypeAutolinkHeadings from "rehype-autolink-headings"
import rehypeStringify from "rehype-stringify"

import { renderBlogDiagram } from "./blog-diagrams"

const POSTS_DIRECTORY = path.join(process.cwd(), "content", "posts")
const WORDS_PER_MINUTE = 180

export type BlogPostSummary = {
  slug: string
  title: string
  description: string
  date: string
  author: string
  category: string
  keywords: string[]
  image?: string
  imageAlt?: string
  readingTime: number
}

export type BlogPost = BlogPostSummary & {
  content: string
}

type Frontmatter = {
  title?: string
  description?: string
  meta_description?: string
  slug?: string
  date?: string
  datePublished?: string
  author?: string
  category?: string
  keywords?: string[] | string
  image?: string
  imageAlt?: string
  image_alt?: string
}

function parseLooseValue(value: string) {
  const trimmed = value.trim()
  if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
    return trimmed
      .slice(1, -1)
      .split(",")
      .map((item) => item.trim().replace(/^['"]|['"]$/g, ""))
      .filter(Boolean)
  }

  return trimmed.replace(/^['"]|['"]$/g, "")
}

function parseMarkdownFile(raw: string) {
  try {
    return matter(raw)
  } catch {
    if (!raw.startsWith("---")) return { data: {}, content: raw }

    const endIndex = raw.indexOf("\n---", 3)
    if (endIndex === -1) return { data: {}, content: raw }

    const frontmatter = raw.slice(3, endIndex)
    const content = raw.slice(endIndex + 4).trimStart()
    const data: Record<string, unknown> = {}

    for (const line of frontmatter.split("\n")) {
      const match = line.match(/^([A-Za-z_]+):\s*(.*)$/)
      if (!match) continue
      data[match[1]] = parseLooseValue(match[2])
    }

    return { data, content }
  }
}

function getPostFileNames() {
  if (!fs.existsSync(POSTS_DIRECTORY)) return []
  return fs.readdirSync(POSTS_DIRECTORY).filter((fileName) => fileName.endsWith(".md"))
}

function normalizeKeywords(keywords: Frontmatter["keywords"]) {
  if (Array.isArray(keywords)) return keywords.map(String).filter(Boolean)
  if (typeof keywords === "string") return keywords.split(",").map((item) => item.trim()).filter(Boolean)
  return []
}

function stripMarkdown(markdown: string) {
  return markdown
    .replace(/<!--[\s\S]*?-->/g, " ")
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/[#>*_~|\-]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
}

function removeDuplicateTitle(content: string) {
  const lines = content.split("\n")
  const headingIndex = lines.findIndex((line) => /^#\s+/.test(line.trim()))
  if (headingIndex === -1) return content
  lines.splice(headingIndex, 1)
  return lines.join("\n").trim()
}

function renderDiagramShortcode(shortcode: string, diagramId: string) {
  return renderBlogDiagram(diagramId) || shortcode
}

function replaceBlogDiagramShortcodes(html: string) {
  return html.replace(/<p>\s*\{\{diagram:([a-zA-Z0-9-]+)\}\}\s*<\/p>/g, (_match, diagramId: string) => {
    return renderDiagramShortcode(_match, diagramId)
  })
}

function createSummary(fileName: string): BlogPostSummary {
  const fullPath = path.join(POSTS_DIRECTORY, fileName)
  const raw = fs.readFileSync(fullPath, "utf8")
  const { data, content } = parseMarkdownFile(raw)
  const frontmatter = data as Frontmatter
  const fallbackSlug = fileName.replace(/\.md$/, "")
  const plainText = stripMarkdown(content)
  const title = frontmatter.title || plainText.split(".")[0] || fallbackSlug
  const description = frontmatter.description || frontmatter.meta_description || plainText.slice(0, 160)
  const wordCount = plainText ? plainText.split(/\s+/).length : 0

  return {
    slug: frontmatter.slug || fallbackSlug,
    title,
    description,
    date: frontmatter.datePublished || frontmatter.date || "2026-05-09",
    author: frontmatter.author || "Команда Розрахуй і В'яжи",
    category: frontmatter.category || "guide",
    keywords: normalizeKeywords(frontmatter.keywords),
    image: frontmatter.image,
    imageAlt: frontmatter.imageAlt || frontmatter.image_alt,
    readingTime: Math.max(1, Math.ceil(wordCount / WORDS_PER_MINUTE)),
  }
}

export function getAllPosts() {
  return getPostFileNames()
    .map(createSummary)
    .sort((a, b) => b.date.localeCompare(a.date) || a.title.localeCompare(b.title, "uk"))
}

export function getPostBySlug(slug: string): BlogPost | null {
  const fileName = getPostFileNames().find((name) => createSummary(name).slug === slug)
  if (!fileName) return null

  const fullPath = path.join(POSTS_DIRECTORY, fileName)
  const raw = fs.readFileSync(fullPath, "utf8")
  const { content } = parseMarkdownFile(raw)

  return {
    ...createSummary(fileName),
    content: removeDuplicateTitle(content),
  }
}

export function getRelatedPosts(currentSlug: string, limit = 3) {
  const current = getPostBySlug(currentSlug)
  const posts = getAllPosts().filter((post) => post.slug !== currentSlug)
  const sameCategory = posts.filter((post) => post.category === current?.category)
  const fallback = posts.filter((post) => post.category !== current?.category)
  return [...sameCategory, ...fallback].slice(0, limit)
}

export async function markdownToHtml(markdown: string) {
  const processed = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype)
    .use(rehypeSlug)
    .use(rehypeAutolinkHeadings, { behavior: "wrap" })
    .use(rehypeStringify)
    .process(markdown)

  return replaceBlogDiagramShortcodes(processed.toString())
}

export function formatPostDate(date: string) {
  return new Intl.DateTimeFormat("uk-UA", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date))
}