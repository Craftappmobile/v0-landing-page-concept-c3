import type { MetadataRoute } from "next"

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim() || "https://vjazhi.com.ua"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/checkout", "/cancel"],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  }
}