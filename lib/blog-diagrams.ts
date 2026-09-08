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
    svg: `<svg viewBox="0 0 680 420" role="img" aria-labelledby="diagram-raglan-lines-title" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">
  <title id="diagram-raglan-lines-title">Схема реглану зверху: розподіл деталей та 4 регланні лінії</title>
  <!-- Тіло виробу -->
  <circle cx="340" cy="200" r="155" fill="#F1EFE8" stroke="#5F5E5A" stroke-width="1"/>
  <!-- Горловина -->
  <circle cx="340" cy="200" r="46" fill="#E1F5EE" stroke="#0F6E56" stroke-width="1"/>

  <!-- 4 регланні лінії (від горловини до краю, по діагоналях) -->
  <line x1="372.5" y1="167.5" x2="449.6" y2="90.4" stroke="#D85A30" stroke-width="2"/>
  <line x1="307.5" y1="167.5" x2="230.4" y2="90.4" stroke="#D85A30" stroke-width="2"/>
  <line x1="307.5" y1="232.5" x2="230.4" y2="309.6" stroke="#D85A30" stroke-width="2"/>
  <line x1="372.5" y1="232.5" x2="449.6" y2="309.6" stroke="#D85A30" stroke-width="2"/>

  <!-- Підписи деталей -->
  <g fill="#2F3430" font-size="14" font-weight="600" text-anchor="middle" dominant-baseline="central">
    <text x="340" y="200">горловина</text>
    <text x="340" y="95">спинка</text>
    <text x="340" y="305">перед</text>
    <text x="245" y="200">рукав</text>
    <text x="435" y="200">рукав</text>
  </g>

  <!-- Прибавки: по одній з кожного боку кожної лінії -->
  <g fill="#993C1D" font-size="13" font-weight="700" text-anchor="middle" dominant-baseline="central">
    <text x="425" y="118">+</text><text x="400" y="143">+</text>
    <text x="255" y="118">+</text><text x="280" y="143">+</text>
    <text x="255" y="282">+</text><text x="280" y="257">+</text>
    <text x="425" y="282">+</text><text x="400" y="257">+</text>
  </g>

  <!-- Легенда -->
  <line x1="60" y1="390" x2="90" y2="390" stroke="#D85A30" stroke-width="2"/>
  <text x="98" y="390" dominant-baseline="central" font-size="13" fill="#5F5E5A">регланна лінія (4 шт.)</text>
  <text x="330" y="390" dominant-baseline="central" font-size="13" fill="#993C1D" font-weight="700">+</text>
  <text x="342" y="390" dominant-baseline="central" font-size="13" fill="#5F5E5A">прибавка з обох боків лінії, 8 п. за ряд</text>
</svg>`,
  },
  "raglan-unwrapped": {
    title: "Розгортка реглану зверху по ряду",
    caption: "Схема розподілу петель горловини по круговому ряду: спинка, рукави, перед та регланні лінії з прибавками.",
    svg: `<svg viewBox="0 0 680 320" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif" role="img" aria-labelledby="diagram-raglan-unwrapped-title diagram-raglan-unwrapped-desc">
  <title id="diagram-raglan-unwrapped-title">Розгортка реглану зверху по ряду (76 п.)</title>
  <desc id="diagram-raglan-unwrapped-desc">Круговий ряд на 76 петель: ½ спинки (11 п.), РЛ 1 (2 п.), рукав (11 п.), РЛ 2 (2 п.), перед (23 п.), РЛ 3 (2 п.), рукав (11 п.), РЛ 4 (2 п.), ½ спинки (12 п.). Прибавки з обох боків кожної лінії.</desc>
  <defs>
    <marker id="rgl-unwrapped-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto">
      <path d="M2 1L8 5L2 9" fill="none" stroke="#5F5E5A" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    </marker>
  </defs>
  <text x="340" y="30" text-anchor="middle" font-size="12" fill="#5F5E5A">Напрямок в'язання ряду</text>
  <line x1="36" y1="48" x2="644" y2="48" stroke="#5F5E5A" stroke-width="1" marker-end="url(#rgl-unwrapped-arrow)"/>
  <rect x="36" y="90" width="88" height="100" fill="#F1EFE8" stroke="#5F5E5A" stroke-width="1"/>
  <text x="80" y="132" text-anchor="middle" font-size="12" font-weight="600" fill="#2C2C2A">½ спинки</text>
  <text x="80" y="152" text-anchor="middle" font-size="12" fill="#5F5E5A">11 п.</text>
  <rect x="124" y="90" width="16" height="100" fill="#D85A30"/>
  <text x="132" y="78" text-anchor="middle" font-size="12" fill="#993C1D">РЛ 1</text>
  <text x="117" y="210" text-anchor="middle" font-size="14" font-weight="700" fill="#993C1D">+</text>
  <text x="147" y="210" text-anchor="middle" font-size="14" font-weight="700" fill="#993C1D">+</text>
  <rect x="140" y="90" width="88" height="100" fill="#F1EFE8" stroke="#5F5E5A" stroke-width="1"/>
  <text x="184" y="132" text-anchor="middle" font-size="12" font-weight="600" fill="#2C2C2A">рукав</text>
  <text x="184" y="152" text-anchor="middle" font-size="12" fill="#5F5E5A">11 п.</text>
  <rect x="228" y="90" width="16" height="100" fill="#D85A30"/>
  <text x="236" y="78" text-anchor="middle" font-size="12" fill="#993C1D">РЛ 2</text>
  <text x="221" y="210" text-anchor="middle" font-size="14" font-weight="700" fill="#993C1D">+</text>
  <text x="251" y="210" text-anchor="middle" font-size="14" font-weight="700" fill="#993C1D">+</text>
  <rect x="244" y="90" width="184" height="100" fill="#F1EFE8" stroke="#5F5E5A" stroke-width="1"/>
  <text x="336" y="132" text-anchor="middle" font-size="12" font-weight="600" fill="#2C2C2A">перед</text>
  <text x="336" y="152" text-anchor="middle" font-size="12" fill="#5F5E5A">23 п.</text>
  <rect x="428" y="90" width="16" height="100" fill="#D85A30"/>
  <text x="436" y="78" text-anchor="middle" font-size="12" fill="#993C1D">РЛ 3</text>
  <text x="421" y="210" text-anchor="middle" font-size="14" font-weight="700" fill="#993C1D">+</text>
  <text x="451" y="210" text-anchor="middle" font-size="14" font-weight="700" fill="#993C1D">+</text>
  <rect x="444" y="90" width="88" height="100" fill="#F1EFE8" stroke="#5F5E5A" stroke-width="1"/>
  <text x="488" y="132" text-anchor="middle" font-size="12" font-weight="600" fill="#2C2C2A">рукав</text>
  <text x="488" y="152" text-anchor="middle" font-size="12" fill="#5F5E5A">11 п.</text>
  <rect x="532" y="90" width="16" height="100" fill="#D85A30"/>
  <text x="540" y="78" text-anchor="middle" font-size="12" fill="#993C1D">РЛ 4</text>
  <text x="525" y="210" text-anchor="middle" font-size="14" font-weight="700" fill="#993C1D">+</text>
  <text x="555" y="210" text-anchor="middle" font-size="14" font-weight="700" fill="#993C1D">+</text>
  <rect x="548" y="90" width="96" height="100" fill="#F1EFE8" stroke="#5F5E5A" stroke-width="1"/>
  <text x="596" y="132" text-anchor="middle" font-size="12" font-weight="600" fill="#2C2C2A">½ спинки</text>
  <text x="596" y="152" text-anchor="middle" font-size="12" fill="#5F5E5A">12 п.</text>
  <circle cx="36" cy="90" r="5" fill="#0F6E56"/>
  <line x1="36" y1="95" x2="36" y2="232" stroke="#0F6E56" stroke-width="1" stroke-dasharray="3 3"/>
  <text x="44" y="240" font-size="12" fill="#0F6E56">Початок кругового ряду (маркер)</text>
  <rect x="36" y="268" width="16" height="12" fill="#D85A30"/>
  <text x="60" y="278" font-size="12" fill="#5F5E5A">РЛ — регланна лінія (по 2 п.)</text>
  <text x="36" y="302" font-size="14" font-weight="700" fill="#993C1D">+</text>
  <text x="50" y="302" font-size="12" fill="#5F5E5A">прибавка з обох боків лінії (8 п. за ряд) · разом 76 п.</text>
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

export type RaglanUnwrappedParams = {
  backLeft?: number
  sleeveRight?: number
  front?: number
  sleeveLeft?: number
  backRight?: number
  line?: number
}

export function renderRaglanUnwrappedSvg(params?: RaglanUnwrappedParams): string {
  const backLeft = params?.backLeft ?? 11
  const sleeveRight = params?.sleeveRight ?? 11
  const front = params?.front ?? 23
  const sleeveLeft = params?.sleeveLeft ?? 11
  const backRight = params?.backRight ?? 12
  const line = params?.line ?? 2

  const blocks: Array<{ label?: string; n?: number; rl?: number }> = [
    { label: "½ спинки", n: backLeft },
    { rl: 1 },
    { label: "рукав", n: sleeveRight },
    { rl: 2 },
    { label: "перед", n: front },
    { rl: 3 },
    { label: "рукав", n: sleeveLeft },
    { rl: 4 },
    { label: "½ спинки", n: backRight },
  ]

  let total = 0
  blocks.forEach((b) => {
    total += b.rl ? line : (b.n ?? 0)
  })

  const W = 680
  const X0 = 36
  const X1 = 644
  const scale = (X1 - X0) / total
  const y = 90
  const h = 100
  let x = X0

  const COLOR_LINE = "#D85A30"
  const COLOR_PLUS = "#993C1D"
  const COLOR_TEXT = "#2C2C2A"
  const COLOR_MUTED = "#5F5E5A"
  const COLOR_FILL = "#F1EFE8"
  const COLOR_MARK = "#0F6E56"

  const out: string[] = []
  out.push(`<svg viewBox="0 0 ${W} 320" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif" role="img" aria-labelledby="diagram-raglan-unwrapped-title diagram-raglan-unwrapped-desc">`)
  out.push(`  <title id="diagram-raglan-unwrapped-title">Розгортка реглану зверху по ряду (${total} п.)</title>`)
  out.push(`  <desc id="diagram-raglan-unwrapped-desc">Круговий ряд на ${total} петель: ½ спинки (${backLeft} п.), РЛ 1 (${line} п.), рукав (${sleeveRight} п.), РЛ 2 (${line} п.), перед (${front} п.), РЛ 3 (${line} п.), рукав (${sleeveLeft} п.), РЛ 4 (${line} п.), ½ спинки (${backRight} п.). Прибавки з обох боків кожної лінії.</desc>`)
  out.push(`  <defs>`)
  out.push(`    <marker id="rgl-unwrapped-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto">`)
  out.push(`      <path d="M2 1L8 5L2 9" fill="none" stroke="${COLOR_MUTED}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>`)
  out.push(`    </marker>`)
  out.push(`  </defs>`)
  out.push(`  <text x="340" y="30" text-anchor="middle" font-size="12" fill="${COLOR_MUTED}">Напрямок в'язання ряду</text>`)
  out.push(`  <line x1="${X0}" y1="48" x2="${X1}" y2="48" stroke="${COLOR_MUTED}" stroke-width="1" marker-end="url(#rgl-unwrapped-arrow)"/>`)

  blocks.forEach((b) => {
    const w = (b.rl ? line : (b.n ?? 0)) * scale
    const cx = x + w / 2
    if (b.rl) {
      out.push(`  <rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${COLOR_LINE}"/>`)
      out.push(`  <text x="${cx}" y="78" text-anchor="middle" font-size="12" fill="${COLOR_PLUS}">РЛ ${b.rl}</text>`)
      out.push(`  <text x="${x - 7}" y="210" text-anchor="middle" font-size="14" font-weight="700" fill="${COLOR_PLUS}">+</text>`)
      out.push(`  <text x="${x + w + 7}" y="210" text-anchor="middle" font-size="14" font-weight="700" fill="${COLOR_PLUS}">+</text>`)
    } else {
      out.push(`  <rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${COLOR_FILL}" stroke="${COLOR_MUTED}" stroke-width="1"/>`)
      out.push(`  <text x="${cx}" y="132" text-anchor="middle" font-size="12" font-weight="600" fill="${COLOR_TEXT}">${b.label}</text>`)
      out.push(`  <text x="${cx}" y="152" text-anchor="middle" font-size="12" fill="${COLOR_MUTED}">${b.n} п.</text>`)
    }
    x += w
  })

  out.push(`  <circle cx="${X0}" cy="${y}" r="5" fill="${COLOR_MARK}"/>`)
  out.push(`  <line x1="${X0}" y1="95" x2="${X0}" y2="232" stroke="${COLOR_MARK}" stroke-width="1" stroke-dasharray="3 3"/>`)
  out.push(`  <text x="44" y="240" font-size="12" fill="${COLOR_MARK}">Початок кругового ряду (маркер)</text>`)
  out.push(`  <rect x="36" y="268" width="16" height="12" fill="${COLOR_LINE}"/>`)
  out.push(`  <text x="60" y="278" font-size="12" fill="${COLOR_MUTED}">РЛ — регланна лінія (по ${line} п.)</text>`)
  out.push(`  <text x="36" y="302" font-size="14" font-weight="700" fill="${COLOR_PLUS}">+</text>`)
  out.push(`  <text x="50" y="302" font-size="12" fill="${COLOR_MUTED}">прибавка з обох боків лінії (8 п. за ряд) · разом ${total} п.</text>`)
  out.push(`</svg>`)

  return out.join("\n")
}

export function parseRaglanParams(paramsStr?: string): RaglanUnwrappedParams {
  if (!paramsStr) return {}
  const params: Record<string, number> = {}
  paramsStr.split(",").forEach((pair) => {
    const [rawKey, rawVal] = pair.split("=").map((s) => s.trim())
    if (rawKey && rawVal) {
      const num = parseInt(rawVal, 10)
      if (!isNaN(num)) {
        params[rawKey.toLowerCase()] = num
      }
    }
  })
  return {
    backLeft: params["backleft"] ?? params["back_left"],
    sleeveRight: params["sleeveright"] ?? params["sleeve_right"] ?? params["sleeve"],
    front: params["front"],
    sleeveLeft: params["sleeveleft"] ?? params["sleeve_left"] ?? params["sleeve"],
    backRight: params["backright"] ?? params["back_right"],
    line: params["line"] ?? params["rl"],
  }
}

export function renderBlogDiagram(id: string, paramsStr?: string) {
  const normalizedId = normalizeDiagramId(id)
  if (!normalizedId) return renderMissingDiagram(id)

  if (normalizedId === "raglan-unwrapped" && paramsStr) {
    const params = parseRaglanParams(paramsStr)
    const svg = renderRaglanUnwrappedSvg(params)
    const safeTitle = escapeHtml("Розгортка реглану зверху по ряду")
    const safeCaption = escapeHtml("Схема розподілу петель горловини по круговому ряду: спинка, рукави, перед та регланні лінії з прибавками.")
    return `
<figure class="blog-diagram" aria-label="${safeTitle}">
  <div class="blog-diagram__canvas">
    ${svg}
  </div>
  <figcaption>${safeCaption}</figcaption>
</figure>`
  }

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