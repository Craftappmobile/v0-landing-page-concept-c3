import type { Metadata, Viewport } from 'next'
import { DM_Sans, DM_Serif_Display } from 'next/font/google'

import './globals.css'

const dmSans = DM_Sans({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-dm-sans',
})

const dmSerif = DM_Serif_Display({
  weight: '400',
  subsets: ['latin', 'latin-ext'],
  variable: '--font-dm-serif',
})

export const metadata: Metadata = {
  title: 'Розрахуй і В\'яжи — Ваш помічник для в\'язання',
  description:
    'Мобільний додаток для в\'язальниць: 30 калькуляторів, трекер проєктів, облік пряжі та спільнота майстринь. Спробуйте Premium!',
}

export const viewport: Viewport = {
  themeColor: '#2e9e3e',
  width: 'device-width',
  initialScale: 1,
}

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
