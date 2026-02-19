/**
 * @module lib/email
 *
 * Модуль відправки email через Resend.com.
 * Використовується у webhook після успішної оплати для надсилання
 * привітального листа з логіном і паролем.
 *
 * @requires RESEND_API_KEY — серверна змінна середовища
 */
import { Resend } from 'resend'

/** Ініціалізація Resend-клієнта (тільки серверна сторона) */
function getResendClient(): Resend {
  const apiKey = process.env.RESEND_API_KEY?.trim()
  if (!apiKey) {
    throw new Error('RESEND_API_KEY is not set')
  }
  return new Resend(apiKey)
}

/** Назви планів українською */
const PLAN_NAMES: Record<string, string> = {
  premium_6m: 'Преміум 6-місячна підписка',
  premium_1y: 'Преміум річна підписка',
  unlimited: 'Безлімітна підписка (назавжди)',
}

/**
 * Відправляє привітальний email після оплати.
 *
 * @param to - Email отримувача
 * @param password - Згенерований пароль для входу в додаток
 * @param planType - Тип підписки (premium_6m | premium_1y | unlimited)
 * @param fullName - Ім'я користувача
 */
export async function sendWelcomeEmail(
  to: string,
  password: string,
  planType: string,
  fullName: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    const resend = getResendClient()
    const planName = PLAN_NAMES[planType] || planType
    const appStoreUrl = process.env.NEXT_PUBLIC_APP_STORE_URL || '#'
    const googlePlayUrl = process.env.NEXT_PUBLIC_GOOGLE_PLAY_URL || '#'

    const { error } = await resend.emails.send({
      from: 'Розрахуй і В\'яжи <onboarding@resend.dev>',
      to: [to],
      subject: '🧶 Ваша підписка активована!',
      html: buildWelcomeHtml({
        fullName,
        email: to,
        password,
        planName,
        appStoreUrl,
        googlePlayUrl,
      }),
    })

    if (error) {
      console.error('Resend error:', error)
      return { success: false, error: error.message }
    }

    console.log(`✅ Welcome email sent to ${to}`)
    return { success: true }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    console.error('Email send failed:', message)
    return { success: false, error: message }
  }
}

/** Параметри для HTML-шаблону */
interface WelcomeEmailParams {
  fullName: string
  email: string
  password: string
  planName: string
  appStoreUrl: string
  googlePlayUrl: string
}

/**
 * Генерує HTML привітального листа.
 * Inline-стилі для максимальної сумісності з email-клієнтами.
 */
function buildWelcomeHtml(params: WelcomeEmailParams): string {
  const { fullName, email, password, planName, appStoreUrl, googlePlayUrl } = params

  return `<!DOCTYPE html>
<html lang="uk">
<head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#f4f1ec;font-family:'Helvetica Neue',Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f1ec;padding:40px 0;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;">

<!-- Header -->
<tr><td style="background:#8B6F47;padding:32px;text-align:center;">
  <h1 style="color:#ffffff;margin:0;font-size:28px;">🧶 Розрахуй і В'яжи</h1>
  <p style="color:#e8ddd0;margin:8px 0 0;font-size:14px;">Ваша підписка активована!</p>
</td></tr>

<!-- Body -->
<tr><td style="padding:32px;">
  <p style="font-size:16px;color:#333;">Привіт, <strong>${fullName}</strong>!</p>
  <p style="font-size:16px;color:#333;">Дякуємо за оплату! Ваш план: <strong>${planName}</strong></p>

  <!-- Credentials box -->
  <table width="100%" style="background:#faf7f2;border:1px solid #e8ddd0;border-radius:8px;margin:24px 0;">
  <tr><td style="padding:20px;">
    <p style="margin:0 0 8px;font-size:14px;color:#666;">Ваші дані для входу в додаток:</p>
    <p style="margin:0 0 4px;font-size:16px;"><strong>Логін:</strong> ${email}</p>
    <p style="margin:0;font-size:16px;"><strong>Пароль:</strong> <code style="background:#fff;padding:2px 8px;border:1px solid #ddd;border-radius:4px;font-size:18px;letter-spacing:1px;">${password}</code></p>
  </td></tr>
  </table>

  <p style="font-size:14px;color:#888;">⚠️ Збережіть пароль! Ви можете змінити його в додатку.</p>

  <!-- Download buttons -->
  <table width="100%" cellpadding="0" cellspacing="0" style="margin:24px 0;">
  <tr>
    <td width="50%" style="padding-right:8px;">
      <a href="${appStoreUrl}" style="display:block;background:#333;color:#fff;text-decoration:none;padding:14px;border-radius:8px;text-align:center;font-size:14px;">📱 App Store</a>
    </td>
    <td width="50%" style="padding-left:8px;">
      <a href="${googlePlayUrl}" style="display:block;background:#333;color:#fff;text-decoration:none;padding:14px;border-radius:8px;text-align:center;font-size:14px;">🤖 Google Play</a>
    </td>
  </tr>
  </table>

  <p style="font-size:14px;color:#666;">Завантажте додаток, увійдіть з вказаними даними і починайте в'язати! 🎉</p>
</td></tr>

<!-- Footer -->
<tr><td style="background:#faf7f2;padding:20px 32px;border-top:1px solid #e8ddd0;">
  <p style="margin:0;font-size:12px;color:#999;text-align:center;">© ${new Date().getFullYear()} Розрахуй і В'яжи. Всі права захищені.</p>
</td></tr>

</table>
</td></tr>
</table>
</body>
</html>`
}

