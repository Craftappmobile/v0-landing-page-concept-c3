export interface YouTubeVideoData {
  id: string
  title: string
  channel?: string
  image?: string
}

export const KNOWN_VIDEOS: Record<string, YouTubeVideoData> = {
  "MhfShXvI5YI": {
    id: "MhfShXvI5YI",
    title: "Реглан для початківців: Покрокове вив'язування анатомічного ростка",
    channel: "PRIGRIZ",
    image: "/images/videos/yt-MhfShXvI5YI.jpg",
  },
  "_Tuu1MsSOVM": {
    id: "_Tuu1MsSOVM",
    title: "Реглан зверху: Розрахунки на будь-який розмір і пряжу",
    channel: "dr.Konovalova. Про в'язання українською",
    image: "/images/videos/yt-_Tuu1MsSOVM.jpg",
  },
  "Y48eZB-7QXc": {
    id: "Y48eZB-7QXc",
    title: "Ідеальна планка для кардигана спицями: не стягує полотно, легкий спосіб",
    channel: "ostrikjulia",
    image: "/images/videos/yt-Y48eZB-7QXc.jpg",
  },
  "l2BSsUbSH8k": {
    id: "l2BSsUbSH8k",
    title: "Майстер-клас: В’яжемо стильний кардиган спицями | Покроковий розрахунок",
    channel: "Svitlana. Knitting with me",
    image: "/images/videos/yt-l2BSsUbSH8k.jpg",
  },
  "n4Vp971M3-A": {
    id: "n4Vp971M3-A",
    title: "З’єднання кругового вʼязання спицями: Вʼязання по колу без перекручування",
    channel: "Royalknits",
    image: "/images/videos/yt-n4Vp971M3-A.jpg",
  },
  "hdtPCfTnE-Q": {
    id: "hdtPCfTnE-Q",
    title: "Кругла кокетка спицями. Як розрахувати, як зв'язати. В'язальна арифметика.",
    channel: "Натка в'яже",
    image: "/images/videos/yt-hdtPCfTnE-Q.jpg",
  },
  "AIRcUlzE-fM": {
    id: "AIRcUlzE-fM",
    title: "МК Кругла кокетка: Розрахунок висоти кокетки, тіло та рукава светра",
    channel: "Ksenia Klimenko",
    image: "/images/videos/yt-AIRcUlzE-fM.jpg",
  },
  "q8zuTIC7XxE": {
    id: "q8zuTIC7XxE",
    title: "Майстер-клас: Светр-павутинка з кід мохеру на шовку спицями",
    channel: "Bonitka",
    image: "/images/videos/yt-q8zuTIC7XxE.jpg",
  },
  "Di3oUr1qOWk": {
    id: "Di3oUr1qOWk",
    title: "Інструкція та розрахунок джемпера-павутинки з мохеру (розмір 42-46)",
    channel: "Оксана Недошитко",
    image: "/images/videos/yt-Di3oUr1qOWk.jpg",
  },
  "cIXfO_of-vM": {
    id: "cIXfO_of-vM",
    title: "Як зв'язати дитячий светр спицями: розрахунок петель, безшовний реглан",
    channel: "Тетяна Чорна",
    image: "/images/videos/yt-cIXfO_of-vM.jpg",
  },
  "mU6K26xXE6Q": {
    id: "mU6K26xXE6Q",
    title: "Светрик для дівчинки регланом зверху: покроковий майстер-клас",
    channel: "Natas knitting & life",
    image: "/images/videos/yt-mU6K26xXE6Q.jpg",
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

export function renderYouTubeEmbed(videoIdOrUrl: string, caption?: string): string {
  let videoId = videoIdOrUrl.trim()
  const match = videoId.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/)
  if (match) {
    videoId = match[1]
  }

  const known = KNOWN_VIDEOS[videoId]
  const title = known?.title || caption || "Відео-урок на YouTube"
  const imageSrc = known?.image || `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`
  const channel = known?.channel || ""

  const safeTitle = escapeHtml(title)
  const safeCaption = caption ? escapeHtml(caption.trim()) : ""
  const safeVideoId = escapeHtml(videoId)
  const safeChannel = escapeHtml(channel)

  return `
<figure class="blog-youtube-embed not-prose my-10 flex flex-col items-center w-full">
  <div 
    class="youtube-facade group relative w-full max-w-2xl overflow-hidden rounded-3xl border border-border/80 bg-black shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 cursor-pointer select-none" 
    data-video-id="${safeVideoId}"
    data-video-title="${safeTitle}"
    role="button"
    tabindex="0"
    aria-label="Відтворити відео: ${safeTitle}"
  >
    <div class="youtube-video-container relative aspect-video w-full overflow-hidden bg-black">
      <img
        src="${imageSrc}"
        alt="${safeTitle}"
        loading="lazy"
        decoding="async"
        class="youtube-thumb h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
      />
      <!-- Soft vignette & play gradient -->
      <div class="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/35"></div>

      <!-- Top Badge -->
      <div class="absolute top-4 inset-x-4 flex items-center justify-between pointer-events-none z-10">
        <span class="inline-flex items-center gap-1.5 rounded-full bg-black/60 px-3.5 py-1.5 text-xs font-semibold text-white shadow-md backdrop-blur-md">
          <svg class="h-3.5 w-3.5 fill-[#FF0000]" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
          <span>YouTube Відео</span>
        </span>
        ${safeChannel ? `<span class="text-xs text-white/80 font-medium px-3 py-1 rounded-full bg-black/40 backdrop-blur-sm">Канал: ${safeChannel}</span>` : ""}
      </div>

      <!-- Centered Authentic YouTube Play Button -->
      <div class="youtube-play-btn" aria-hidden="true">
        <svg class="h-6 w-6 fill-white translate-x-0.5" viewBox="0 0 24 24">
          <path d="M8 5v14l11-7z"/>
        </svg>
      </div>

      <!-- Bottom overlay title -->
      <div class="absolute bottom-0 inset-x-0 p-4 sm:p-5 z-10 text-white pointer-events-none">
        <h4 class="text-sm sm:text-base font-semibold text-white drop-shadow-sm line-clamp-2 leading-snug">
          ${safeTitle}
        </h4>
      </div>
    </div>

    ${safeCaption ? `
      <figcaption class="p-3.5 sm:p-4 bg-card border-t border-border/70 text-xs sm:text-sm text-muted-foreground flex items-start gap-2.5">
        <svg class="h-4 w-4 shrink-0 text-primary mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
        <span class="leading-relaxed text-foreground/85">${safeCaption}</span>
      </figcaption>
    ` : ""}
  </div>
</figure>`
}
