import fs from "node:fs"

function loadEnv() {
  try {
    const env = fs.readFileSync(".env.local", "utf8")
    for (const line of env.split("\n")) {
      const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/)
      if (match) {
        let value = match[2] || ""
        if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
          value = value.slice(1, -1)
        }
        process.env[match[1]] = value
      }
    }
  } catch {}
}
loadEnv()

const API_KEY = process.env.BING_WEBMASTER_API_KEY || "d8a156adc6ef4c908c6c8a562dcec208"
const SITE_URL = "https://vjazhi.com.ua/"

async function fetchBing(action, params = {}) {
  const query = new URLSearchParams({ ...params, apikey: API_KEY })
  const url = `https://ssl.bing.com/webmaster/api.svc/json/${action}?${query.toString()}`
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Bing API error ${res.status}: ${res.statusText}`)
  const data = await res.json()
  return data.d
}

async function run() {
  console.log("==========================================")
  console.log("   BING WEBMASTER TOOLS ЗВІТ (vjazhi.com.ua)")
  console.log("==========================================\n")

  const sites = await fetchBing("GetUserSites")
  const currentSite = sites.find((s) => s.Url.includes("vjazhi.com.ua"))
  console.log(`🌐 Сайт: ${currentSite?.Url}`)
  console.log(`✅ Підтверджено: ${currentSite?.IsVerified ? "Так" : "Ні"}`)
  console.log(`🔑 Код автентифікації: ${currentSite?.AuthenticationCode}\n`)

  const feeds = await fetchBing("GetFeeds", { siteUrl: SITE_URL })
  console.log("📑 Sitemaps:")
  for (const f of feeds) {
    console.log(`   - ${f.Url} | Статус: ${f.Status} | URL-ів у файлі: ${f.UrlCount}`)
  }
  console.log("")

  const traffic = await fetchBing("GetRankAndTrafficStats", { siteUrl: SITE_URL })
  const last30 = (traffic || []).slice(-30)
  const totalClicks = last30.reduce((sum, item) => sum + (item.Clicks || 0), 0)
  const totalImpressions = last30.reduce((sum, item) => sum + (item.Impressions || 0), 0)

  console.log("📊 Статистика за останні 30 днів у Bing:")
  console.log(`   - Всього показів у пошуку: ${totalImpressions}`)
  console.log(`   - Всього переходів (кліків): ${totalClicks}`)
  if (totalImpressions > 0) {
    console.log(`   - CTR: ${((totalClicks / totalImpressions) * 100).toFixed(2)}%`)
  }
  console.log("")

  const queryStats = await fetchBing("GetQueryStats", { siteUrl: SITE_URL })
  const queriesMap = new Map()

  for (const q of queryStats || []) {
    const existing = queriesMap.get(q.Query) || { clicks: 0, impressions: 0, bestPos: 999 }
    existing.clicks += q.Clicks || 0
    existing.impressions += q.Impressions || 0
    if (q.AvgImpressionPosition && q.AvgImpressionPosition < existing.bestPos) {
      existing.bestPos = q.AvgImpressionPosition
    }
    queriesMap.set(q.Query, existing)
  }

  const sortedQueries = [...queriesMap.entries()]
    .sort((a, b) => b[1].clicks - a[1].clicks || b[1].impressions - a[1].impressions)
    .slice(0, 10)

  console.log("🔍 Топ-10 пошукових запитів у Bing:")
  for (const [query, data] of sortedQueries) {
    const pos = data.bestPos === 999 ? "-" : Math.round(data.bestPos)
    console.log(`   • "${query}" — Показів: ${data.impressions}, Кліків: ${data.clicks}, Позиція: ~${pos}`)
  }
  console.log("")

  const issues = await fetchBing("GetCrawlIssues", { siteUrl: SITE_URL })
  console.log(`🛠️ Помилки сканування Bingbot: ${issues.length === 0 ? "Помилок немає (0)" : issues.length}`)
  console.log("\n==========================================")
}

run().catch((err) => console.error("Помилка:", err))
