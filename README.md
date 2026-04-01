# Розрахуй і В'яжи — landing + Hutko web payments

Лендінг мобільного застосунку **«Розрахуй і В'яжи»** з веб-оплатою підписок через **Hutko**, інтеграцією з **Supabase** та email-сповіщеннями через **Resend**.

> Актуальний flow у цьому репозиторії працює через **Next.js API routes**: checkout-стан одразу створюється в `subscriptions`, а webhook обробляється серверним route handler усередині цього проєкту.

## Стек

| Шар | Технологія |
|-----|------------|
| Framework | Next.js 16 (App Router) |
| Мова | TypeScript |
| UI | Tailwind CSS + shadcn/ui |
| База даних | Supabase (PostgreSQL) |
| Auth | Supabase Auth |
| Платежі | Hutko |
| Email | Resend |
| Deploy | Vercel |
| Package manager | pnpm |

## Ключові файли

| Шлях | Призначення |
|------|-------------|
| `app/checkout/page.tsx` | checkout UI та polling статусу |
| `app/api/payment/create/route.ts` | створення `pending`-підписки і Hutko checkout URL |
| `app/api/payment/redirect/route.ts` | redirect назад у `/checkout?status=processing` |
| `app/api/payment/callback/route.ts` | callback, активація підписки, `after()`-задачі |
| `app/api/payment/status/route.ts` | статус для polling після оплати |
| `app/api/payment/recurring/route.ts` | автосписання через Vercel Cron |
| `app/api/cancel/route.ts` | вимкнення автопродовження |
| `lib/plans.ts` | канонічний список планів і сум у minor units |
| `lib/payment-flow.ts` | нормалізація payment-статусів |
| `lib/email.ts` | welcome / cancellation emails |
| `supabase/migrations/20260331_add_missing_web_payment_fields_to_subscriptions.sql` | sync-міграція web-payment полів |

## Плани та суми

У коді суми зберігаються в **minor units** (`INTEGER`), щоб уникнути проблем із округленням.

| Plan ID | Назва | UI ціна | `amount` | Днів | Автопродовження |
|---------|-------|---------|----------|------|------------------|
| `quarter` | Підписка на 3 місяці | 454.96 грн | `45496` | 90 | так |
| `half` | Підписка на 6 місяців | 599.99 грн | `59999` | 180 | так |
| `year` | Річна підписка | 918 грн | `91800` | 365 | так |
| `forever` | Безлімітна підписка | 4 585 грн | `458500` | 36500 | ні |

Джерело істини: `lib/plans.ts`.

## Поточний платіжний flow

1. Користувач відкриває `/checkout?plan=<planId>` і вводить `name` + `email`.
2. `POST /api/payment/create`:
   - валідує вхідні дані;
   - створює `order_id`;
   - вставляє `pending`-запис у `public.subscriptions`;
   - **зупиняє flow**, якщо insert у БД не вдався;
   - викликає Hutko і повертає `checkout_url`.
3. Hutko:
   - редіректить користувача на `/api/payment/redirect`;
   - надсилає server callback на `/api/payment/callback`.
4. `POST /api/payment/callback`:
   - перевіряє SHA1 signature;
   - активує первинну оплату або оновлює батьківський запис для renewal;
   - зберігає `rectoken`, `hutko_payment_id`, `updated_at`;
   - через `after()` створює/знаходить користувача, лінкує `user_id`, шле email, оновлює `email_status` / `email_error`.
5. `GET /api/payment/status` використовується checkout-сторінкою для polling після redirect.
6. `GET /api/payment/recurring` запускається Vercel Cron і ініціює автосписання для активних recurring-підписок.
7. `POST /api/cancel` вимикає `auto_renewal`, але зберігає доступ до кінця оплаченого періоду.

## Env-змінні

| Змінна | Доступ | Призначення |
|--------|--------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | public | URL Supabase project |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | public | anon key для client-side Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | server-only | службові операції без RLS |
| `HUTKO_MERCHANT_ID` | server-only | merchant id Hutko |
| `HUTKO_MERCHANT_PASSWORD` | server-only | секрет для SHA1 підпису |
| `RESEND_API_KEY` | server-only | відправка листів |
| `NEXT_PUBLIC_SITE_URL` | public/server | base URL для recurring callback |
| `CRON_SECRET` | server-only | захист `/api/payment/recurring` |

Шаблон: `.env.local.example`.

Примітка: посилання на App Store / Google Play зараз **не конфігуруються через env**, а зашиті в `lib/email.ts`.

## База даних

Для web-payment flow головна таблиця — `public.subscriptions`.

- sync-міграція: `supabase/migrations/20260331_add_missing_web_payment_fields_to_subscriptions.sql`
- canonical repo-level reference: `docs/subscriptions-schema-reference.md`

Важливий нюанс: у repo є sync-міграція для web-payment полів, але **повний базовий `CREATE TABLE subscriptions` не представлений у репозиторії як єдине SQL-джерело**. Саме тому schema reference винесено в окремий документ.

## Локальний запуск

1. Встановити залежності: `pnpm install`
2. Створити `.env.local` на основі `.env.local.example`
3. Запустити dev server: `pnpm dev`

## Перевірочні команди

- `pnpm test:payment`
- `pnpm check:plans`
- `pnpm build`

## Vercel Cron

`vercel.json` налаштовує щоденний cron:

- path: `/api/payment/recurring`
- schedule: `0 6 * * *`

Операційні вимоги:

- `NEXT_PUBLIC_SITE_URL` має вказувати на актуальний production-домен;
- deprecated domain `https://rozrahuy-i-vyazhi.vercel.app` спеціально блокується кодом;
- якщо задано `CRON_SECRET`, запит без `Authorization: Bearer <CRON_SECRET>` отримає `401`.

## Troubleshooting

### `POST /api/payment/create` повертає помилку

Перевірте:

- `HUTKO_MERCHANT_ID` / `HUTKO_MERCHANT_PASSWORD`;
- `SUPABASE_SERVICE_ROLE_KEY`;
- чи вставляється `pending`-запис у `subscriptions`.

### Checkout завис у `processing`

Перевірте:

- логи `/api/payment/callback`;
- валідність Hutko signature;
- чи оновився `subscriptions.status`;
- чи присутній `order_id` у redirect URL.

### Оплата підтверджена, але email не прийшов

Перевірте в `subscriptions`:

- `email_status`
- `email_error`
- `user_id`

Ці поля оновлюються в `after()` усередині `app/api/payment/callback/route.ts`.

### Recurring не працює

Перевірте:

- `NEXT_PUBLIC_SITE_URL`;
- `CRON_SECRET`;
- `rectoken` у `subscriptions`;
- `status = active`, `auto_renewal = true`, `expires_at <= tomorrow`.

## Пов'язані документи

- `docs/hutko-integration-guide.md`
- `docs/subscriptions-schema-reference.md`
- [Supabase Dashboard](https://supabase.com/dashboard/project/xaeztaeqyjubmpgjxcgh)
- [Resend Docs](https://resend.com/docs)