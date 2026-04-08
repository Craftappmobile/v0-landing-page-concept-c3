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

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim() || 'https://vjazhi.com.ua'
const siteTitle = 'Розрахуй і В\'яжи — Ваш помічник для в\'язання'
const siteDescription =
  'Мобільний додаток для в\'язальниць: 30 калькуляторів, трекер проєктів, облік пряжі та спільнота майстринь. Спробуйте Premium!'
const shareImage = '/opengraph-image'

/**
 * SEO-метадані для лендінгової сторінки.
 * Описують додаток "Розрахуй і В'яжи" для пошукових систем та соцмереж.
 */
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: siteTitle,
  description: siteDescription,
  alternates: {
    canonical: '/',
  },
  icons: {
    icon: '/images/logo.jpg',
    apple: '/images/logo.jpg',
  },
  openGraph: {
    type: 'website',
    locale: 'uk_UA',
    url: '/',
    siteName: 'Розрахуй і В\'яжи',
    title: siteTitle,
    description: siteDescription,
    images: [
      {
        url: shareImage,
        width: 1200,
        height: 630,
        alt: 'Розрахуй і В\'яжи — прев’ю сайту',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteTitle,
    description: siteDescription,
    images: [shareImage],
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
