"use client"

import { useEffect } from "react"

export function YouTubeEmbedLoader() {
  useEffect(() => {
    const facades = document.querySelectorAll<HTMLElement>(".youtube-facade")
    if (!facades || facades.length === 0) return

    facades.forEach((facade) => {
      if (facade.dataset.initialized === "true") return
      facade.dataset.initialized = "true"

      const startVideo = () => {
        const videoId = facade.getAttribute("data-video-id")
        const videoTitle = facade.getAttribute("data-video-title") || "YouTube video player"
        if (!videoId) return

        const iframeWrapper = document.createElement("div")
        iframeWrapper.className = "relative aspect-video w-full bg-black overflow-hidden"

        const iframe = document.createElement("iframe")
        iframe.className = "absolute inset-0 h-full w-full border-0"
        iframe.src = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&playsinline=1`
        iframe.title = videoTitle
        iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        iframe.allowFullscreen = true

        iframeWrapper.appendChild(iframe)

        const targetContainer = facade.querySelector(".youtube-video-container") || facade
        targetContainer.innerHTML = ""
        targetContainer.appendChild(iframeWrapper)
      }

      facade.addEventListener("click", startVideo)
      facade.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault()
          startVideo()
        }
      })
    })
  }, [])

  return null
}
