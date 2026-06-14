// @ts-check
/**
 * Скрипт для автоматичного пінгу IndexNow після деплою.
 *
 * 1. Завантажує sitemap.xml з деплоєного сайту.
 * 2. Розпаршує XML і витягує усі URL.
 * 3. Відправляє всі URL у пошуковики через IndexNow API.
 *
 * Запуск: node --no-warnings --experimental-strip-types scripts/indexnow-ping.mts
 */

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/$/, "") || "https://vjazhi.com.ua"
const INDEXNOW_KEY = "a626fb2a8fdf8766a4ea8c5af385cf73"
const INDEXNOW_HOST = "vjazhi.com.ua"

/**
 * Завантажує та розпаршує sitemap.xml, повертає масив URL.
 */
async function fetchSitemapUrls() {
  const res = await fetch(`${SITE_URL}/sitemap.xml`)
  if (!res.ok) {
    throw new Error(`Failed to fetch sitemap: ${res.status} ${res.statusText}`)
  }
  const xml = await res.text()

  // Простий регекс для витягування <loc>URL</loc>
  const matches = xml.matchAll(/<loc>([^<]+)<\/loc>/g)
  const urls = [...matches].map((m) => m[1].trim()).filter(Boolean)

  if (urls.length === 0) {
    throw new Error("No URLs found in sitemap.xml")
  }

  return urls
}

async function pingIndexNow() {
  console.log(`Роблю пінг IndexNow для ${SITE_URL}...`)

  const urlList = await fetchSitemapUrls()
  console.log(`✅ Знайдено ${urlList.length} URL у sitemap.xml`)

  const payload = {
    host: INDEXNOW_HOST,
    key: INDEXNOW_KEY,
    keyLocation: `https://${INDEXNOW_HOST}/${INDEXNOW_KEY}.txt`,
    urlList,
  }

  const res = await fetch("https://api.indexnow.org/indexnow", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  })

  const text = await res.text()
  console.log(`IndexNow status: ${res.status}`)
  console.log(`IndexNow response: ${text}`)

  if (!res.ok) {
    console.error(`❌ IndexNow повернув помилку: ${res.status}`)
    process.exit(1)
  }

  console.log(`✅ Успіх! Пінгнуто ${urlList.length} URL.`)
}

pingIndexNow().catch((err) => {
  console.error("❌ Помилка пінгу:", err.message || err)
  process.exit(1)
})
