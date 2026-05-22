type BlogDiagramDefinition = {
  title: string
  caption: string
  svg: string
}

const BLOG_DIAGRAMS: Record<string, BlogDiagramDefinition> = {
  "sweater-basic": {
    title: "Базова схема светра",
    caption: "Схема базового светра: корпус, рукави, горловина, ширина та довжина виробу.",
    svg: `<svg viewBox="0 0 640 420" role="img" aria-labelledby="diagram-sweater-basic-title" xmlns="http://www.w3.org/2000/svg">
  <title id="diagram-sweater-basic-title">Базова схема светра</title>
  <rect x="225" y="92" width="190" height="245" rx="20" fill="#f7efe7" stroke="#2e9e3e" stroke-width="5"/>
  <path d="M225 126 L126 190 L158 262 L225 206Z" fill="#f7efe7" stroke="#2e9e3e" stroke-width="5" stroke-linejoin="round"/>
  <path d="M415 126 L514 190 L482 262 L415 206Z" fill="#f7efe7" stroke="#2e9e3e" stroke-width="5" stroke-linejoin="round"/>
  <path d="M282 92 Q320 126 358 92" fill="none" stroke="#d97060" stroke-width="5" stroke-linecap="round"/>
  <line x1="225" y1="360" x2="415" y2="360" stroke="#2f3430" stroke-width="2"/>
  <path d="M225 352 L225 368 M415 352 L415 368" stroke="#2f3430" stroke-width="2"/>
  <text x="320" y="392" text-anchor="middle" font-size="22" fill="#2f3430">ширина виробу</text>
  <line x1="445" y1="92" x2="445" y2="337" stroke="#2f3430" stroke-width="2"/>
  <path d="M437 92 L453 92 M437 337 L453 337" stroke="#2f3430" stroke-width="2"/>
  <text x="474" y="222" font-size="22" fill="#2f3430">довжина</text>
</svg>`,
  },
  "raglan-lines": {
    title: "Схема регланних ліній",
    caption: "Схема реглану зверху: горловина, перед, спинка, рукави та 4 регланні лінії для прибавок.",
    svg: `<svg viewBox="0 0 640 420" role="img" aria-labelledby="diagram-raglan-lines-title" xmlns="http://www.w3.org/2000/svg">
  <title id="diagram-raglan-lines-title">Схема регланних ліній</title>
  <path d="M235 86 H405 L462 338 H178Z" fill="#f7efe7" stroke="#2e9e3e" stroke-width="5" stroke-linejoin="round"/>
  <path d="M252 86 Q320 132 388 86" fill="none" stroke="#d97060" stroke-width="5" stroke-linecap="round"/>
  <line x1="252" y1="103" x2="178" y2="338" stroke="#d97060" stroke-width="4" stroke-linecap="round"/>
  <line x1="294" y1="116" x2="266" y2="338" stroke="#d97060" stroke-width="4" stroke-linecap="round"/>
  <line x1="346" y1="116" x2="374" y2="338" stroke="#d97060" stroke-width="4" stroke-linecap="round"/>
  <line x1="388" y1="103" x2="462" y2="338" stroke="#d97060" stroke-width="4" stroke-linecap="round"/>
  <text x="320" y="202" text-anchor="middle" font-size="24" fill="#2f3430">перед / спинка</text>
  <text x="204" y="190" text-anchor="middle" font-size="20" fill="#2f3430" transform="rotate(-18 204 190)">рукав</text>
  <text x="436" y="190" text-anchor="middle" font-size="20" fill="#2f3430" transform="rotate(18 436 190)">рукав</text>
  <text x="320" y="66" text-anchor="middle" font-size="22" fill="#2f3430">горловина</text>
  <circle cx="252" cy="103" r="7" fill="#2e9e3e"/><circle cx="294" cy="116" r="7" fill="#2e9e3e"/>
  <circle cx="346" cy="116" r="7" fill="#2e9e3e"/><circle cx="388" cy="103" r="7" fill="#2e9e3e"/>
</svg>`,
  },
  "round-yoke": {
    title: "Схема круглої кокетки",
    caption: "Схема круглої кокетки: зона прибавок, висота кокетки, корпус і рукави після розподілу.",
    svg: `<svg viewBox="0 0 640 420" role="img" aria-labelledby="diagram-round-yoke-title" xmlns="http://www.w3.org/2000/svg">
  <title id="diagram-round-yoke-title">Схема круглої кокетки</title>
  <path d="M190 172 Q320 52 450 172 L410 342 H230Z" fill="#f7efe7" stroke="#2e9e3e" stroke-width="5" stroke-linejoin="round"/>
  <path d="M238 150 Q320 92 402 150" fill="none" stroke="#d97060" stroke-width="5" stroke-linecap="round"/>
  <path d="M210 195 Q320 114 430 195" fill="none" stroke="#d97060" stroke-width="4" stroke-linecap="round" stroke-dasharray="10 10"/>
  <path d="M198 238 Q320 160 442 238" fill="none" stroke="#d97060" stroke-width="4" stroke-linecap="round" stroke-dasharray="10 10"/>
  <path d="M190 172 L122 244 L160 306 L218 246" fill="#f7efe7" stroke="#2e9e3e" stroke-width="5" stroke-linejoin="round"/>
  <path d="M450 172 L518 244 L480 306 L422 246" fill="#f7efe7" stroke="#2e9e3e" stroke-width="5" stroke-linejoin="round"/>
  <text x="320" y="132" text-anchor="middle" font-size="22" fill="#2f3430">кокетка</text>
  <text x="320" y="224" text-anchor="middle" font-size="20" fill="#2f3430">лінії прибавок</text>
  <line x1="470" y1="118" x2="470" y2="248" stroke="#2f3430" stroke-width="2"/>
  <path d="M462 118 H478 M462 248 H478" stroke="#2f3430" stroke-width="2"/>
  <text x="492" y="190" font-size="20" fill="#2f3430">висота</text>
</svg>`,
  },
  "sleeve-shaping": {
    title: "Схема формування рукава",
    caption: "Схема рукава: верхня ширина, манжета, довжина та точки убавок або прибавок по бокових лініях.",
    svg: `<svg viewBox="0 0 640 420" role="img" aria-labelledby="diagram-sleeve-shaping-title" xmlns="http://www.w3.org/2000/svg">
  <title id="diagram-sleeve-shaping-title">Схема формування рукава</title>
  <path d="M235 72 H405 L370 342 H270Z" fill="#f7efe7" stroke="#2e9e3e" stroke-width="5" stroke-linejoin="round"/>
  <path d="M270 342 H370 V372 H270Z" fill="#fff8f2" stroke="#2e9e3e" stroke-width="5" stroke-linejoin="round"/>
  <line x1="235" y1="55" x2="405" y2="55" stroke="#2f3430" stroke-width="2"/>
  <path d="M235 47 V63 M405 47 V63" stroke="#2f3430" stroke-width="2"/>
  <text x="320" y="36" text-anchor="middle" font-size="21" fill="#2f3430">верх рукава</text>
  <line x1="430" y1="72" x2="430" y2="372" stroke="#2f3430" stroke-width="2"/>
  <path d="M422 72 H438 M422 372 H438" stroke="#2f3430" stroke-width="2"/>
  <text x="455" y="226" font-size="21" fill="#2f3430">довжина</text>
  <circle cx="250" cy="150" r="6" fill="#d97060"/><circle cx="390" cy="150" r="6" fill="#d97060"/>
  <circle cx="260" cy="225" r="6" fill="#d97060"/><circle cx="380" cy="225" r="6" fill="#d97060"/>
  <circle cx="268" cy="296" r="6" fill="#d97060"/><circle cx="372" cy="296" r="6" fill="#d97060"/>
  <text x="320" y="398" text-anchor="middle" font-size="21" fill="#2f3430">манжета</text>
</svg>`,
  },
  "neckline-basic": {
    title: "Схема базової горловини",
    caption: "Схема горловини: плечі, виріз, центральні петлі та зони убавок для формування округлої форми.",
    svg: `<svg viewBox="0 0 640 420" role="img" aria-labelledby="diagram-neckline-basic-title" xmlns="http://www.w3.org/2000/svg">
  <title id="diagram-neckline-basic-title">Схема базової горловини</title>
  <path d="M170 108 H470 V342 H170Z" fill="#f7efe7" stroke="#2e9e3e" stroke-width="5" stroke-linejoin="round"/>
  <path d="M245 108 Q320 210 395 108" fill="#ffffff" stroke="#d97060" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
  <line x1="245" y1="88" x2="395" y2="88" stroke="#2f3430" stroke-width="2"/>
  <path d="M245 80 V96 M395 80 V96" stroke="#2f3430" stroke-width="2"/>
  <text x="320" y="66" text-anchor="middle" font-size="21" fill="#2f3430">ширина горловини</text>
  <path d="M270 128 Q288 166 306 182" fill="none" stroke="#d97060" stroke-width="3" stroke-dasharray="7 8"/>
  <path d="M370 128 Q352 166 334 182" fill="none" stroke="#d97060" stroke-width="3" stroke-dasharray="7 8"/>
  <text x="206" y="150" font-size="20" fill="#2f3430">плече</text>
  <text x="410" y="150" font-size="20" fill="#2f3430">плече</text>
  <text x="320" y="244" text-anchor="middle" font-size="21" fill="#2f3430">виріз</text>
  <text x="320" y="292" text-anchor="middle" font-size="19" fill="#2f3430">зони убавок</text>
</svg>`,
  },
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
}

function normalizeDiagramId(id: string) {
  const normalized = id.trim().toLowerCase()
  return /^[a-z0-9][a-z0-9-]*$/.test(normalized) ? normalized : null
}

function renderMissingDiagram(id: string) {
  const safeId = escapeHtml(id)

  return `
<aside class="blog-diagram blog-diagram--missing" role="note" aria-label="Схема ще не додана">
  <p>Схему “${safeId}” ще не додано до бібліотеки блогу.</p>
</aside>`
}

export function renderBlogDiagram(id: string) {
  const normalizedId = normalizeDiagramId(id)
  if (!normalizedId) return renderMissingDiagram(id)

  const diagram = BLOG_DIAGRAMS[normalizedId]
  if (!diagram) return renderMissingDiagram(normalizedId)

  const safeTitle = escapeHtml(diagram.title)
  const safeCaption = escapeHtml(diagram.caption)

  return `
<figure class="blog-diagram" aria-label="${safeTitle}">
  <div class="blog-diagram__canvas">
    ${diagram.svg}
  </div>
  <figcaption>${safeCaption}</figcaption>
</figure>`
}

export function getSupportedBlogDiagramIds() {
  return Object.keys(BLOG_DIAGRAMS)
}