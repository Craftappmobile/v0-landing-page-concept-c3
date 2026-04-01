# Hutko web payments — актуальна інтеграція

Цей документ описує **поточний** web-payment flow у репозиторії. Він відповідає коду в `app/api/payment/*` і слугує основним технічним описом інтеграції.

## Джерела істини

- `app/api/payment/create/route.ts`
- `app/api/payment/redirect/route.ts`
- `app/api/payment/callback/route.ts`
- `app/api/payment/status/route.ts`
- `app/api/payment/recurring/route.ts`
- `app/api/cancel/route.ts`
- `lib/plans.ts`
- `lib/payment-flow.ts`
- `vercel.json`

## Архітектурні факти

- використовується **Hutko**;
- checkout і callback обробляються через **Next.js API routes**;
- `pending`-стан зберігається **одразу в `subscriptions`**.

## Потрібні env-змінні

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `HUTKO_MERCHANT_ID`
- `HUTKO_MERCHANT_PASSWORD`
- `RESEND_API_KEY`
- `NEXT_PUBLIC_SITE_URL`
- `CRON_SECRET`

Шаблон: `.env.local.example`.

## Route map

| Route | Метод | Призначення |
|------|--------|-------------|
| `/api/payment/create` | `POST` | створює Hutko checkout URL і `pending` subscription |
| `/api/payment/redirect` | `GET` / `POST` | переводить користувача в `/checkout?status=processing&order_id=...` |
| `/api/payment/callback` | `POST` | приймає server callback від Hutko |
| `/api/payment/status` | `GET` | віддає статус для polling |
| `/api/payment/recurring` | `GET` | recurring billing через Vercel Cron |
| `/api/cancel` | `POST` | вимикає автопродовження |

## `POST /api/payment/create`

Route:

1. читає `plan`, `email`, `name`;
2. перевіряє план через `PLAN_CONFIG`;
3. перевіряє Hutko credentials;
4. формує `order_id`;
5. вставляє `pending`-запис у `public.subscriptions`;
6. **не продовжує checkout**, якщо insert у БД не вдався;
7. викликає Hutko API і повертає `checkout_url`.

### Підпис Hutko

У create використовується SHA1:

`sha1(password + "|" + sortedNonEmptyParamValues.join("|"))`

## `POST /api/payment/callback`

Route:

1. читає `order_id`, `order_status`, `signature`, `rectoken`, `payment_id`, `merchant_data`;
2. перевіряє SHA1 signature;
3. парсить `merchant_data`;
4. розрізняє первинну оплату та renewal через `merchant_data.renewal`.

### Первинна оплата

Якщо `order_status === approved` і це не renewal:

- оновлює subscription до `status = active`;
- заповнює `started_at`, `expires_at`, `updated_at`;
- зберігає `rectoken` і `hutko_payment_id`;
- у `after()`:
  - створює або знаходить користувача в Supabase Auth;
  - лінкує `user_id`;
  - відправляє welcome email;
  - оновлює `email_status` / `email_error`.

### Renewal

Для renewal callback код:

- шукає батьківський запис за `parent_order`;
- пересуває `expires_at` вперед від більш пізньої з дат `now` / поточний `expires_at`;
- оновлює `status`, `updated_at`, `hutko_payment_id`, `rectoken`.

Тобто **callback є єдиним source of truth** для фінального оновлення subscription state.

## Redirect і polling

- `app/api/payment/redirect/route.ts` приймає `GET` або `POST` від Hutko;
- дістає `order_id` з query, JSON або form-data;
- робить `303` redirect на `/checkout?status=processing&order_id=...`.

Після цього checkout-сторінка робить polling у `/api/payment/status`.

`lib/payment-flow.ts` нормалізує стани так:

- `active` → success
- `failed` → failure
- `pending` / `not_found` / тимчасова помилка → pending UX
- `cancelled` з майбутнім `expires_at` усе ще вважається `active`

## Recurring billing

`GET /api/payment/recurring` запускається cron-ом з `vercel.json` (`0 6 * * *`).

Endpoint:

- перевіряє `CRON_SECRET`, якщо він заданий;
- вимагає валідний `NEXT_PUBLIC_SITE_URL`;
- блокує deprecated domain `https://rozrahuy-i-vyazhi.vercel.app`;
- знаходить `active` підписки з `auto_renewal = true`, `rectoken IS NOT NULL`, `expires_at <= tomorrow`;
- викликає Hutko recurring API;
- **не оновлює БД напряму після успішної відповіді Hutko**, а чекає callback.

## Cancellation

`POST /api/cancel`:

- знаходить активні recurring subscriptions за email;
- ставить `auto_renewal = false`;
- проставляє `cancelled_at` і `updated_at`;
- відправляє cancellation email.

Поточний оплачений період при цьому зберігається.

## Incident checklist

1. **Create не повертає checkout URL**
   - Hutko credentials
   - insert у `subscriptions`
   - відповідь Hutko API
2. **Checkout довго у `processing`**
   - callback logs
   - валідність signature
   - row з цим `order_id`
   - фактичний `subscriptions.status`
3. **Оплата активна, але листа немає**
   - `email_status`
   - `email_error`
   - `user_id`
4. **Recurring не виконується**
   - `NEXT_PUBLIC_SITE_URL`
   - `CRON_SECRET`
   - `rectoken`
   - cron schedule у `vercel.json`

Деталі по полях таблиці див. у `docs/subscriptions-schema-reference.md`.
