"use client"

import { useEffect } from "react"

export function PinterestEmbedLoader() {
  useEffect(() => {
    // Only load if there are pin embeds on the page
    const pins = document.querySelectorAll('[data-pin-do="embedPin"]')
    if (!pins || pins.length === 0) return

    // If PinUtils already loaded, rebuild embeds
    if (typeof (window as any).PinUtils !== "undefined") {
      try {
        ;(window as any).PinUtils.build()
      } catch {
        // silent
      }
      return
    }

    // Load Pinterest script asynchronously
    const scriptId = "pinterest-pinit-script"
    if (!document.getElementById(scriptId)) {
      const script = document.createElement("script")
      script.id = scriptId
      script.src = "https://assets.pinterest.com/js/pinit.js"
      script.async = true
      script.defer = true
      document.body.appendChild(script)
    }
  }, [])

  return null
}
