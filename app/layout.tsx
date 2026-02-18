import type { Metadata, Viewport } from 'next'
import { DM_Sans, DM_Serif_Display } from 'next/font/google'

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
      <body
        className={`${dmSans.variable} ${dmSerif.variable} font-sans antialiased`}
      >
        {children}
      </body>
    </html>
  )
}
