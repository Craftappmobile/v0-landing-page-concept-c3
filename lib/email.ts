import { Resend } from "resend";

function getResendClient(): Resend {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) throw new Error("RESEND_API_KEY is not set");
  return new Resend(apiKey);
}

const FROM_EMAIL = "Розрахуй і В'яжи <onboarding@resend.dev>";

const PLAN_NAMES: Record<string, string> = {
  quarter: "Підписка на 3 місяці",
  half: "Підписка на 6 місяців",
  year: "Річна підписка",
  forever: "Безлімітна підписка (назавжди)",
};

const PLAN_PRICES: Record<string, string> = {
  quarter: "454,96 грн",
  half: "549,00 грн",
  year: "918,00 грн",
  forever: "1 548,00 грн",
};

export async function sendWelcomeEmail(
  to: string,
  customerName: string,
  planType: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    const resend = getResendClient();
    const planName = PLAN_NAMES[planType] || planType;
    const planPrice = PLAN_PRICES[planType] || "";

    const { error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: [to],
      subject: "🧶 Вашу підписку активовано!",
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 560px; margin: 0 auto; padding: 32px 16px;">
          <h1 style="font-size: 24px; color: #1a1a1a;">Привіт, ${customerName}!</h1>
          <p style="font-size: 16px; color: #333; line-height: 1.6;">
            Дякуємо за покупку! Ваша підписка <strong>«${planName}»</strong> успішно активована.
          </p>
          ${planPrice ? `<p style="font-size: 14px; color: #666;">Сума: <strong>${planPrice}</strong></p>` : ""}
          <p style="font-size: 14px; color: #666; line-height: 1.6;">
            Тепер ви маєте повний доступ до всіх функцій додатку <strong>«Розрахуй і В'яжи»</strong>.
          </p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />
          <p style="font-size: 12px; color: #999;">
            Якщо у вас є питання — пишіть на <a href="mailto:craftappmobile@gmail.com" style="color: #7c3aed;">craftappmobile@gmail.com</a>
          </p>
        </div>
      `,
    });

    if (error) {
      console.error("[Email] Welcome email error:", error);
      return { success: false, error: error.message };
    }

    console.log(`[Email] Welcome email sent to ${to}`);
    return { success: true };
  } catch (err) {
    console.error("[Email] Welcome email exception:", err);
    return { success: false, error: String(err) };
  }
}

export async function sendCancellationEmail(
  to: string,
  customerName: string,
  planType: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    const resend = getResendClient();
    const planName = PLAN_NAMES[planType] || planType;

    const { error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: [to],
      subject: "Підписку скасовано",
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 560px; margin: 0 auto; padding: 32px 16px;">
          <h1 style="font-size: 24px; color: #1a1a1a;">Привіт, ${customerName || ""}!</h1>
          <p style="font-size: 16px; color: #333; line-height: 1.6;">
            Вашу підписку <strong>«${planName}»</strong> скасовано. Автоматичне продовження вимкнено.
          </p>
          <p style="font-size: 14px; color: #666; line-height: 1.6;">
            Ви можете продовжити користуватися додатком до кінця оплаченого періоду.
          </p>
          <p style="font-size: 14px; color: #666; line-height: 1.6;">
            Якщо ви передумаєте — завжди можете оформити нову підписку на нашому сайті.
          </p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />
          <p style="font-size: 12px; color: #999;">
            Питання? Пишіть: <a href="mailto:craftappmobile@gmail.com" style="color: #7c3aed;">craftappmobile@gmail.com</a>
          </p>
        </div>
      `,
    });

    if (error) {
      console.error("[Email] Cancellation email error:", error);
      return { success: false, error: error.message };
    }

    console.log(`[Email] Cancellation email sent to ${to}`);
    return { success: true };
  } catch (err) {
    console.error("[Email] Cancellation email exception:", err);
    return { success: false, error: String(err) };
  }
}

