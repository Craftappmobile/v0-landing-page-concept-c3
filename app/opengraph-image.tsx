import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { ImageResponse } from 'next/og'

export const alt = 'Розрахуй і В\'яжи — красиве прев’ю сайту'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'
export const runtime = 'nodejs'

async function toDataUrl(filePath: string, mimeType: string) {
  const file = await readFile(path.join(process.cwd(), filePath))
  return `data:${mimeType};base64,${file.toString('base64')}`
}

export default async function OpenGraphImage() {
  const [logoSrc, screenSrc] = await Promise.all([
    toDataUrl('public/images/logo.jpg', 'image/jpeg'),
    toDataUrl('public/images/app-screenshot.jpg', 'image/jpeg'),
  ])

  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          width: '100%',
          height: '100%',
          position: 'relative',
          overflow: 'hidden',
          background: 'linear-gradient(135deg, #fcf7f1 0%, #f4ece2 100%)',
          color: '#1f2937',
        }}
      >
        <div style={{ position: 'absolute', inset: 0, display: 'flex' }}>
          <div style={{ position: 'absolute', top: -120, left: -40, width: 420, height: 420, borderRadius: 9999, background: '#d9efe0' }} />
          <div style={{ position: 'absolute', right: -80, bottom: -140, width: 460, height: 460, borderRadius: 9999, background: '#f6d2c6' }} />
        </div>

        <div style={{ display: 'flex', width: '100%', height: '100%', padding: '56px 60px', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', flexDirection: 'column', width: 650, justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
              <img src={logoSrc} alt="Логотип" width="92" height="92" style={{ borderRadius: 24, border: '4px solid rgba(255,255,255,0.9)' }} />
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ fontSize: 20, fontWeight: 700, color: '#4b5563' }}>Мобільний додаток для в'язання</div>
                <div style={{ fontSize: 40, fontWeight: 800, color: '#1f2937' }}>Розрахуй і В'яжи</div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div style={{ display: 'flex', flexDirection: 'column', fontSize: 64, lineHeight: 1.05, fontWeight: 800 }}>
                <div>Мінімум математики,</div>
                <div>максимум в'язання</div>
              </div>
              <div style={{ fontSize: 28, lineHeight: 1.35, color: '#4b5563', maxWidth: 600 }}>
                30 калькуляторів, облік пряжі, трекер проєктів та спільнота майстринь — все в одному місці.
              </div>
            </div>

            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              {['30 калькуляторів', 'Облік пряжі', 'Спільнота', 'Premium-доступ'].map((item) => (
                <div
                  key={item}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '14px 20px',
                    borderRadius: 9999,
                    background: 'rgba(255,255,255,0.82)',
                    border: '1px solid rgba(255,255,255,0.95)',
                    fontSize: 22,
                    fontWeight: 700,
                    color: '#355f49',
                  }}
                >
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 340 }}>
            <div
              style={{
                display: 'flex',
                padding: 18,
                borderRadius: 42,
                background: 'rgba(255,255,255,0.88)',
                boxShadow: '0 24px 70px rgba(87, 63, 46, 0.16)',
                border: '1px solid rgba(255,255,255,0.95)',
              }}
            >
              <img src={screenSrc} alt="Екран додатка" width="280" height="500" style={{ borderRadius: 28, objectFit: 'cover' }} />
            </div>
          </div>
        </div>
      </div>
    ),
    size,
  )
}