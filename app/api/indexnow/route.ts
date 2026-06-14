import { NextRequest, NextResponse } from "next/server"

const INDEXNOW_KEY = "a626fb2a8fdf8766a4ea8c5af385cf73"
const INDEXNOW_HOST = "vjazhi.com.ua"

/**
 * API-роут для пінгу IndexNow.
 * Приймає POST з тілом { urlList: string[] } і відправляє їх у пошуковики Bing / Yandex.
 * GET повертає інструкцію.
 */
export async function POST(request: NextRequest) {
  try {
    const { urlList } = await request.json()

    if (!Array.isArray(urlList) || urlList.length === 0) {
      return NextResponse.json(
        { error: "urlList must be a non-empty array" },
        { status: 400 },
      )
    }

    const payload = {
      host: INDEXNOW_HOST,
      key: INDEXNOW_KEY,
      keyLocation: `https://${INDEXNOW_HOST}/${INDEXNOW_KEY}.txt`,
      urlList,
    }

    const response = await fetch("https://api.indexnow.org/indexnow", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })

    const text = await response.text()

    return NextResponse.json({
      status: response.status,
      ok: response.ok,
      urlCount: urlList.length,
      response: text,
    })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}

export async function GET() {
  return NextResponse.json({
    message: "IndexNow ping endpoint",
    usage: "POST { urlList: ['https://vjazhi.com.ua/...', ...] }",
    keyLocation: `https://${INDEXNOW_HOST}/${INDEXNOW_KEY}.txt`,
  })
}
