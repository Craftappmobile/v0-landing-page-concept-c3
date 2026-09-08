export interface PinterestPinData {
  id: string
  url: string
  title: string
  author: string
  authorUrl?: string
  image: string
  fallbackImage?: string
}

export const KNOWN_PINS: Record<string, PinterestPinData> = {
  "73816881390961467": {
    id: "73816881390961467",
    url: "https://www.pinterest.com/pin/73816881390961467/",
    title: "Класичний безшовний светр регланом зверху",
    author: "Louise Kruger",
    authorUrl: "https://www.pinterest.com/louisekruger62/",
    image: "/images/pins/pin-73816881390961467.jpg",
    fallbackImage: "https://i.pinimg.com/736x/70/20/76/702076be067909b2b027c1df2ce0986f.jpg",
  },
  "153966881009339215": {
    id: "153966881009339215",
    url: "https://www.pinterest.com/pin/153966881009339215/",
    title: "Посадка та глибина регланної лінії на фігурі",
    author: "LoveCrafts",
    authorUrl: "https://www.pinterest.com/lovecraftscom/",
    image: "/images/pins/pin-153966881009339215.jpg",
    fallbackImage: "https://i.pinimg.com/736x/6a/90/54/6a90540e69ff594f505f48d728af1424.jpg",
  },
  "418834834114844924": {
    id: "418834834114844924",
    url: "https://www.pinterest.com/pin/418834834114844924/",
    title: "Формування кокетки та ліній реглану на спицях",
    author: "Casey Roberts",
    authorUrl: "https://www.pinterest.com/caseyroberts06/",
    image: "/images/pins/pin-418834834114844924.jpg",
    fallbackImage: "https://i.pinimg.com/736x/7c/49/10/7c4910ca318860617b1d9f2f417ca57b.jpg",
  },
  "24277285505962344": {
    id: "24277285505962344",
    url: "https://www.pinterest.com/pin/24277285505962344/",
    title: "Анатомічний росток: вив'язування горловини без дірочок",
    author: "Susan Fleming",
    authorUrl: "https://www.pinterest.com/pin/24277285505962344/",
    image: "/images/pins/pin-24277285505962344.jpg",
    fallbackImage: "https://i.pinimg.com/736x/a5/3a/d0/a53ad0c85f4df46cdac519b1327f451e.jpg",
  },
  "51721095718644405": {
    id: "51721095718644405",
    url: "https://www.pinterest.com/pin/51721095718644405/",
    title: "Розрахунок глибини реглану за розмірами",
    author: "Grace",
    authorUrl: "https://www.pinterest.com/babayangrace/",
    image: "/images/pins/pin-51721095718644405.jpg",
    fallbackImage: "https://i.pinimg.com/736x/2b/02/5f/2b025f25903c9100f617c321dca6d796.jpg",
  },
  "692147036525527742": {
    id: "692147036525527742",
    url: "https://www.pinterest.com/pin/692147036525527742/",
    title: "Елегантна регланна лінія та правильна посадка светра",
    author: "Olga Zobnina",
    authorUrl: "https://www.pinterest.com/olgaz1536/",
    image: "/images/pins/pin-692147036525527742.jpg",
    fallbackImage: "https://i.pinimg.com/736x/a5/cd/95/a5cd95d38f40fa4bfc1d2e8ab7a8c89e.jpg",
  },
  "1129348044087391672": {
    id: "1129348044087391672",
    url: "https://www.pinterest.com/pin/1129348044087391672/",
    title: "Об'ємний оверсайз кардиган спицями з широкою планкою та ґудзиками",
    author: "crochetfashion",
    authorUrl: "https://www.pinterest.com/gangarai1114/",
    image: "/images/pins/pin-1129348044087391672.jpg",
    fallbackImage: "https://i.pinimg.com/736x/fb/f0/43/fbf04330acc58515fb9125e754c9c08a.jpg",
  },
  "1759287349038160": {
    id: "1759287349038160",
    url: "https://www.pinterest.com/pin/1759287349038160/",
    title: "Французький шик: суцільнов'язана планка кардигана та акуратні петлі для ґудзиків",
    author: "sofie schäfer",
    authorUrl: "https://www.pinterest.com/wuschso/",
    image: "/images/pins/pin-1759287349038160.jpg",
    fallbackImage: "https://i.pinimg.com/736x/78/2a/96/782a9648aa0a90191ccfda01460cf6ce.jpg",
  },
  "623185667232303080": {
    id: "623185667232303080",
    url: "https://www.pinterest.com/pin/623185667232303080/",
    title: "Ніжний V-подібний виріз кардигана з ідеальною симетрією поличок",
    author: "Camille",
    authorUrl: "https://www.pinterest.com/camillegubbinss/",
    image: "/images/pins/pin-623185667232303080.jpg",
    fallbackImage: "https://i.pinimg.com/736x/04/24/8b/04248b40a0f17253bd3e3d3398f699f5.jpg",
  },
  "410883166029988769": {
    id: "410883166029988769",
    url: "https://www.pinterest.com/pin/410883166029988769/",
    title: "Класичний кардиган на ґудзиках: баланс ширини спинки та поличок",
    author: "Ann Brasher",
    authorUrl: "https://www.pinterest.com/abrasher0115/",
    image: "/images/pins/pin-410883166029988769.jpg",
    fallbackImage: "https://i.pinimg.com/736x/0e/24/da/0e24da5c53425a4b4840acb00f9f514e.jpg",
  },
}

function escapeHtml(str: string) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
}

export function renderPinterestVisualCard(url: string, caption?: string): string {
  const cleanUrl = url.trim()
  const pinIdMatch = cleanUrl.match(/pin\/(\d+)/)
  const pinId = pinIdMatch ? pinIdMatch[1] : ""
  
  const known = pinId && KNOWN_PINS[pinId] ? KNOWN_PINS[pinId] : null
  
  const title = known ? known.title : (caption || "Приклад на Pinterest")
  const author = known ? known.author : ""
  const imageSrc = known ? known.image : (pinId ? `https://i.pinimg.com/736x/pin-${pinId}.jpg` : "")
  
  const safeCaption = caption ? escapeHtml(caption.trim()) : ""
  const safeTitle = escapeHtml(title)
  const safeAuthor = escapeHtml(author)
  const safeUrl = escapeHtml(cleanUrl)

  return `
<figure class="blog-pinterest-card not-prose my-10 flex flex-col items-center">
  <div class="pinterest-card-inner group relative w-full max-w-md overflow-hidden rounded-3xl border border-border/80 bg-card shadow-sm hover:shadow-2xl transition-all duration-500">
    <a href="${safeUrl}" target="_blank" rel="noopener noreferrer" class="relative block overflow-hidden aspect-[4/5] bg-muted cursor-pointer" aria-label="Відкрити пін на Pinterest: ${safeTitle}">
      <img
        src="${imageSrc}"
        alt="${safeTitle}"
        loading="lazy"
        decoding="async"
        class="pinterest-card-img h-full w-full object-cover object-center"
      />
      <!-- Soft vignette & hover darkening overlay -->
      <div class="pinterest-card-overlay pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/35 opacity-75 group-hover:opacity-90 transition-opacity duration-300"></div>

      <!-- Top Badges -->
      <div class="absolute top-4 inset-x-4 flex items-center justify-between pointer-events-none z-10">
        <span class="inline-flex items-center gap-1.5 rounded-full bg-[#E60023] px-3.5 py-1.5 text-xs font-semibold text-white shadow-lg backdrop-blur-sm pointer-events-auto transition-transform duration-300 group-hover:scale-105">
          <svg class="h-3.5 w-3.5 fill-white" viewBox="0 0 24 24"><path d="M12.02 0C5.38 0 1.24 4.76 1.24 9.94c0 2.4 1.36 5.4 3.54 6.36.33.15.5.08.58-.23.06-.24.35-1.42.48-1.97.04-.18.02-.34-.13-.51-.72-.84-1.3-2.38-1.3-3.82 0-3.61 2.74-7.1 7.4-7.1 4.03 0 6.85 2.75 6.85 6.68 0 4.44-2.24 7.52-5.15 7.52-1.61 0-2.82-1.33-2.43-2.97.46-1.95 1.36-4.05 1.36-5.46 0-1.26-.68-2.31-2.08-2.31-1.65 0-2.98 1.7-2.98 4 0 1.46.49 2.45.49 2.45s-1.63 6.9-1.93 8.19c-.33 1.38-.2 3.32-.06 4.58.04.38.5.51.68.17.27-.5.36-.78.57-1.3.16-.42 1.01-3.93 1.01-3.93.54 1.02 2.1 1.88 3.77 1.88 4.96 0 8.54-4.56 8.54-10.22C20.43 4.97 16.38 0 12.02 0Z"/></svg>
          Pinterest
        </span>
        <span class="inline-flex items-center gap-1.5 rounded-full bg-white/20 hover:bg-[#E60023] px-3.5 py-1.5 text-xs font-medium text-white shadow-md backdrop-blur-md pointer-events-auto transition-all duration-300 group-hover:scale-105">
          <span>Переглянути пін</span>
          <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
        </span>
      </div>

      <!-- Bottom overlay text inside image -->
      <div class="absolute bottom-0 inset-x-0 p-4 sm:p-5 z-10 text-white pointer-events-none">
        ${safeAuthor ? `
          <div class="flex items-center gap-1.5 text-xs text-white/85 font-medium mb-1 drop-shadow-sm">
            <span class="h-2 w-2 rounded-full bg-[#E60023]"></span>
            <span>Автор: ${safeAuthor}</span>
          </div>
        ` : ''}
        <div class="text-sm sm:text-base font-semibold text-white drop-shadow-sm line-clamp-2 leading-snug">
          ${safeTitle}
        </div>
      </div>
    </a>

    <!-- Context note / figcaption -->
    ${safeCaption ? `
      <figcaption class="p-3.5 sm:p-4 bg-card border-t border-border/70 text-xs sm:text-sm text-muted-foreground flex items-start gap-2.5">
        <svg class="h-4 w-4 shrink-0 text-primary mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
        <span class="leading-relaxed text-foreground/85">${safeCaption}</span>
      </figcaption>
    ` : ''}
  </div>
</figure>`
}
