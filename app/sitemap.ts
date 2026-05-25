import type { MetadataRoute } from "next"

import { getAllPosts } from "@/lib/blog"
import { getAllBlogCategories } from "@/lib/blog-categories"
import { getAllCalculators } from "@/lib/calculators"

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/$/, "") || "https://vjazhi.com.ua"

const staticRoutes = [
  { path: "", priority: 1 },
  { path: "/about", priority: 0.7 },
  { path: "/blog", priority: 0.9 },
  { path: "/kalkuliatory", priority: 0.95 },
  { path: "/privacy", priority: 0.2 },
  { path: "/terms", priority: 0.2 },
  { path: "/refund", priority: 0.2 },
]

function toSafeLastModified(date: string) {
  const parsed = new Date(date)
  const now = new Date()

  if (Number.isNaN(parsed.getTime()) || parsed > now) return now

  return parsed
}

export default function sitemap(): MetadataRoute.Sitemap {
  const staticEntries: MetadataRoute.Sitemap = staticRoutes.map((route) => ({
    url: `${siteUrl}${route.path}`,
    lastModified: new Date(),
    changeFrequency: route.path === "/blog" || route.path === "/kalkuliatory" ? "daily" : "monthly",
    priority: route.priority,
  }))

  const blogEntries: MetadataRoute.Sitemap = getAllPosts().map((post) => ({
    url: `${siteUrl}/blog/${post.slug}`,
    lastModified: toSafeLastModified(post.date),
    changeFrequency: "weekly",
    priority: 0.7,
  }))

  const blogCategoryEntries: MetadataRoute.Sitemap = getAllBlogCategories().map((category) => ({
    url: `${siteUrl}/blog/${category.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.75,
  }))

  const calculatorEntries: MetadataRoute.Sitemap = getAllCalculators().map((calculator) => ({
    url: `${siteUrl}/kalkuliatory/${calculator.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }))

  return [...staticEntries, ...calculatorEntries, ...blogCategoryEntries, ...blogEntries]
}