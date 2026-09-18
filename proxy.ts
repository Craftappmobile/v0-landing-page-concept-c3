import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const homepageMarkdown = `# Розрахуй і В'яжи — Онлайн-помічник та калькулятори для в'язання

> Онлайн-сервіс та мобільний додаток для в'язальниць: 30 калькуляторів, трекер проєктів, облік пряжі та спільнота майстринь.
> Офіційний сайт: https://vjazhi.com.ua

## Основні можливості
- **30 спеціалізованих калькуляторів**: щільність в'язання, реглан зверху, витрата пряжі, шапки, шкарпетки, рукави, горловина, оверсайз тощо.
- **Трекер проєктів**: збереження замірів, прогресу рядів та витрати пряжі.
- **База знань і блог**: покрокові інструкції побудови викрійок та технік в'язання.

## Ключові розділи сайту
- **Усі онлайн-калькулятори**: https://vjazhi.com.ua/kalkuliatory
  - Калькулятор щільності: https://vjazhi.com.ua/kalkuliatory/shchilnist
  - Калькулятор реглану зверху: https://vjazhi.com.ua/kalkuliatory/rahlan
  - Калькулятор витрати пряжі: https://vjazhi.com.ua/kalkuliatory/vytrata
  - Калькулятор шапки: https://vjazhi.com.ua/kalkuliatory/shapka
  - Калькулятор шкарпеток: https://vjazhi.com.ua/kalkuliatory/shkarpetky
  - Калькулятор рукава: https://vjazhi.com.ua/kalkuliatory/rukav
  - Калькулятор кругового в'язання: https://vjazhi.com.ua/kalkuliatory/kruhove
  - Калькулятор кардигана: https://vjazhi.com.ua/kalkuliatory/kardyhan
- **Блог майстрині**: https://vjazhi.com.ua/blog
- **Про проєкт**: https://vjazhi.com.ua/about

## Машинні ресурси для AI-агентів
- **ARD Маніфест (ai-catalog)**: https://vjazhi.com.ua/.well-known/ai-catalog.json
- **Agent Skills Discovery (RFC v0.2.0)**: https://vjazhi.com.ua/.well-known/agent-skills/index.json
- **MCP Server Card (SEP-1649)**: https://vjazhi.com.ua/.well-known/mcp/server-card.json
- **API Catalog (RFC 9727)**: https://vjazhi.com.ua/.well-known/api-catalog
- **Auth.md реєстрація**: https://vjazhi.com.ua/auth.md
`

export function proxy(request: NextRequest) {
  // Only negotiate Markdown for real page navigations (GET/HEAD).
  if (request.method !== "GET" && request.method !== "HEAD") {
    return NextResponse.next()
  }

  const acceptHeader = request.headers.get("accept") || ""

  // Support Accept: text/markdown content negotiation for AI agents
  if (acceptHeader.includes("text/markdown")) {
    const tokens = Math.ceil(homepageMarkdown.length / 4)

    return new NextResponse(homepageMarkdown, {
      status: 200,
      headers: {
        "Content-Type": "text/markdown; charset=utf-8",
        "x-markdown-tokens": tokens.toString(),
        "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
        "Vary": "Accept",
      },
    })
  }

  return NextResponse.next()
}

export const config = {
  // Only the homepage advertises a Markdown alternative. Subpages keep their HTML,
  // and machine-readable resources (/.well-known/*, /api/*, /openapi.json, /auth.md)
  // are never rewritten.
  matcher: ["/"],
}
