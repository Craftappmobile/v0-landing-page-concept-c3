import type { Metadata, Viewport } from 'next'
import { DM_Sans, DM_Serif_Display } from 'next/font/google'
import Script from 'next/script'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'

import './globals.css'

/**
 * DM Sans — основний шрифт UI.
 * Підключений для підмножин latin та latin-ext (підтримка кирилиці через CSS).
 * CSS-змінна: `--font-dm-sans`
 */
const dmSans = DM_Sans({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-dm-sans',
})

/**
 * DM Serif Display — декоративний serif-шрифт для заголовків.
 * Використовується через клас `font-serif` (налаштований у tailwind.config).
 * CSS-змінна: `--font-dm-serif`
 */
const dmSerif = DM_Serif_Display({
  weight: '400',
  subsets: ['latin', 'latin-ext'],
  variable: '--font-dm-serif',
})

/**
 * SEO-метадані для лендінгової сторінки.
 * Описують додаток "Розрахуй і В'яжи" для пошукових систем та соцмереж.
 */
export const metadata: Metadata = {
  title: 'Розрахуй і В\'яжи — Ваш помічник для в\'язання',
  description:
    'Мобільний додаток для в\'язальниць: 30 калькуляторів, трекер проєктів, облік пряжі та спільнота майстринь. Спробуйте Premium!',
  icons: {
    icon: '/images/logo.jpg',
    apple: '/images/logo.jpg',
  },
}

/**
 * Налаштування viewport для мобільних браузерів.
 * `themeColor` — колір рядка статусу на Android/Chrome (#2e9e3e — зелений бренду).
 */
export const viewport: Viewport = {
  themeColor: '#2e9e3e',
  width: 'device-width',
  initialScale: 1,
}

/**
 * Кореневий layout усього застосунку.
 * Обгортає всі сторінки: задає мову документа (`uk`), підключає шрифти,
 * базову CSS-нормалізацію (`antialiased`) та глобальні стилі.
 *
 * @param children - Контент поточної сторінки (page.tsx або вкладений layout)
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="uk">
      <head>
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: 'none' }}
            src="https://www.facebook.com/tr?id=1255311116562552&ev=PageView&noscript=1"
            alt=""
          />
        </noscript>
      </head>
      <body
        className={`${dmSans.variable} ${dmSerif.variable} font-sans antialiased`}
      >
        <Script id="meta-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '1255311116562552');
            fbq('track', 'PageView');
          `}
        </Script>
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
