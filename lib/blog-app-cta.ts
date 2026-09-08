export interface AppCtaOptions {
  badge?: string
  title?: string
  description?: string
  primaryButtonText?: string
  primaryButtonHref?: string
  secondaryText?: string
  secondaryHref?: string
  articleSlug?: string
}

function escapeHtml(str: string) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
}

export function renderBlogAppCta(options?: AppCtaOptions): string {
  const badge = options?.badge || "Додаток «Розрахуй і В'яжи»"
  const title = options?.title || "Втомилися рахувати петлі та ряди на папірцях?"
  const description =
    options?.description ||
    "Введіть свої мірки та щільність — мобільний додаток створить персональний попетельний опис светра з усіма лініями, ростком і підрізами. Інтерактивний лічильник на смартфоні сам нагадає, в якому ряду робити прибавки — без страху помилитися та розпускати виріб."
  const slug = options?.articleSlug || "A05-rahlan"
  const primaryText = options?.primaryButtonText || "Обрати тариф підписки"
  const primaryHref =
    options?.primaryButtonHref ||
    `/#pricing?utm_source=blog&utm_medium=article&utm_campaign=${slug}&utm_content=mid_app_cta`
  const secondaryText = options?.secondaryText || "Спробувати пакет «Тест» за 100 грн ➔"
  const secondaryHref =
    options?.secondaryHref ||
    `/checkout?plan=month&utm_source=blog&utm_medium=article&utm_campaign=${slug}&utm_content=mid_test_plan`

  const safeBadge = escapeHtml(badge)
  const safeTitle = escapeHtml(title)
  const safeDescription = escapeHtml(description)
  const safePrimaryText = escapeHtml(primaryText)
  const safePrimaryHref = escapeHtml(primaryHref)
  const safeSecondaryText = escapeHtml(secondaryText)
  const safeSecondaryHref = escapeHtml(secondaryHref)

  return `
<aside class="blog-app-cta not-prose my-12 overflow-hidden rounded-3xl border-2 border-primary/30 bg-gradient-to-br from-primary/15 via-card to-background p-6 sm:p-8 shadow-md hover:shadow-xl transition-all duration-300">
  <div class="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
    <div class="space-y-3.5 max-w-xl">
      <div class="inline-flex flex-wrap items-center gap-2 rounded-full border border-primary/30 bg-primary/15 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
        <span>📱 ${safeBadge}</span>
        <span class="inline-block w-1.5 h-1.5 rounded-full bg-primary"></span>
        <span class="text-foreground font-bold">Від 100 грн / міс</span>
      </div>

      <h3 class="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-foreground leading-snug">
        ${safeTitle}
      </h3>

      <p class="text-sm sm:text-base text-muted-foreground leading-relaxed">
        ${safeDescription}
      </p>

      <div class="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-medium text-foreground/85 pt-1">
        <span class="flex items-center gap-1.5 text-primary font-semibold">
          <svg class="h-4 w-4 shrink-0 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
          Точний розрахунок за 1 хв
        </span>
        <span class="flex items-center gap-1.5 text-primary font-semibold">
          <svg class="h-4 w-4 shrink-0 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
          Розумний лічильник рядів
        </span>
        <span class="flex items-center gap-1.5 text-primary font-semibold">
          <svg class="h-4 w-4 shrink-0 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
          Всі 30 калькуляторів у кишені
        </span>
      </div>
    </div>

    <div class="flex flex-col sm:flex-row lg:flex-col shrink-0 gap-3 w-full lg:w-auto">
      <a
        href="${safePrimaryHref}"
        style="color: #ffffff !important; text-decoration: none !important;"
        class="blog-cta-primary-btn group inline-flex items-center justify-center gap-2.5 rounded-2xl bg-primary px-7 py-4 text-sm font-semibold !text-white text-white no-underline shadow-md hover:bg-primary/90 hover:shadow-lg transition-all text-center"
      >
        <span style="color: #ffffff !important;" class="!text-white text-white font-semibold">${safePrimaryText}</span>
        <svg style="color: #ffffff !important; stroke: #ffffff !important;" class="h-4 w-4 transition-transform group-hover:translate-x-1 !text-white text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
      </a>
      <a
        href="${safeSecondaryHref}"
        style="text-decoration: none !important;"
        class="inline-flex items-center justify-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-primary transition-colors text-center py-1 no-underline hover:underline"
      >
        <span>${safeSecondaryText}</span>
      </a>
    </div>
  </div>
</aside>`
}
