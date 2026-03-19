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
  password: string | null,
): Promise<{ success: boolean; error?: string }> {
  try {
    const resend = getResendClient();
    const planName = PLAN_NAMES[planType] || planType;

    const credentialsBlock = password
      ? `
        <div style="background: #f9f5ff; border: 1px solid #e9d5ff; border-radius: 8px; padding: 16px; margin: 24px 0;">
          <p style="font-size: 14px; color: #333; margin: 0 0 4px;">Нижче додаємо дані для входу, щоб їх було зручніше скопіювати 👇</p>
          <p style="font-size: 15px; color: #1a1a1a; margin: 4px 0;"><strong>Email:</strong> ${to}</p>
          <p style="font-size: 15px; color: #1a1a1a; margin: 4px 0;"><strong>Пароль:</strong> <code style="background:#eee;padding:2px 6px;border-radius:4px;">${password}</code></p>
        </div>`
      : "";

    const { error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: [to],
      subject: "🧶 Вашу підписку активовано!",
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 560px; margin: 0 auto; padding: 32px 16px;">
          <h1 style="font-size: 24px; color: #1a1a1a;">${customerName || ""}, дякуємо за придбання підписки 💛</h1>

          <p style="font-size: 16px; color: #333; line-height: 1.6;">
            Ваша підписка <strong>«${planName}»</strong> успішно активована.
            Надсилаємо вам дані для входу в додаток.
          </p>

          <p style="font-size: 15px; color: #333; line-height: 1.8;">
            <strong>Посилання для завантаження:</strong><br/>
            📱 <a href="https://play.google.com/store/apps/details?id=com.knittingapp.calculator" style="color: #7c3aed;">Google Play</a><br/>
            🍎 <a href="https://apps.apple.com/ua/app/%D1%80%D0%BE%D0%B7%D1%80%D0%B0%D1%85%D1%83%D0%B9-%D1%96-%D0%B2%D1%8F%D0%B6%D0%B8/id6754463468?l=uk" style="color: #7c3aed;">App Store</a>
          </p>

          <p style="font-size: 15px; color: #333; line-height: 1.8;">
            <strong>Посилання на огляд функціоналу додатка:</strong><br/>
            🎬 <a href="https://youtube.com/playlist?list=PLSmx4tJAAQh4RZY2wRqBHFEhaoCyFZkFG&si=texahJ8RvAxPrsca" style="color: #7c3aed;">YouTube — огляд</a>
          </p>

          <p style="font-size: 14px; color: #555; line-height: 1.6;">
            Якщо у вас виникнуть питання, ви завжди можете звернутися до технічної підтримки:<br/>
            • безпосередньо в самому додатку<br/>
            • або написати нам на електронну пошту: <a href="mailto:craftappmobile@gmail.com" style="color: #7c3aed;">craftappmobile@gmail.com</a>
          </p>

          <p style="font-size: 15px; color: #333; line-height: 1.6;">
            Бажаємо легких розрахунків, рівних петель і задоволення від процесу ✨🧶<br/>
            <em>З теплом,<br/>команда розробників «Розрахуй і в'яжи петля в петлю»</em>
          </p>

          ${credentialsBlock}
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

