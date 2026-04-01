# `subscriptions` schema reference

Це **canonical repo-level reference** для таблиці `public.subscriptions` у поточному web-payment flow.

## Навіщо окремий документ

У repo є sync-міграція для web-payment полів:

- `supabase/migrations/20260331_add_missing_web_payment_fields_to_subscriptions.sql`

Але повний базовий `CREATE TABLE public.subscriptions` не збережений у репозиторії як єдине SQL-джерело. Тому цей документ фіксує поля, які **підтверджені міграцією або активним кодом**.

## Поля, на які покладається поточний код

| Поле | Evidence | Поточне використання |
|------|----------|----------------------|
| `id` | code | row identifier у `app/api/cancel/route.ts` |
| `order_id` | migration + code | ключовий зовнішній identifier для create / callback / status |
| `email` | migration + code | email покупця, lookup для cancel і follow-up |
| `customer_name` | migration + code | ім'я з checkout-форми |
| `plan` | migration + code | plan id (`quarter`, `half`, `year`, `forever`) |
| `plan_type` | code | зараз дублює `plan` у create flow |
| `amount` | migration + code | сума в minor units |
| `currency` | migration + code | зараз `UAH` |
| `status` | code | `pending` / `active` / `failed`; код також толерує `cancelled` |
| `payment_provider` | code | зараз `hutko` |
| `platform` | code | зараз `web` |
| `auto_renewal` | code | вмикання recurring billing |
| `started_at` | code | дата активації поточного періоду |
| `expires_at` | code | дата завершення доступу, використовується в status і recurring |
| `rectoken` | migration + code | токен для наступних recurring charges |
| `hutko_payment_id` | migration + code | payment identifier з callback |
| `user_id` | code | зв'язок із Supabase Auth user |
| `email_status` | migration + code | стан післяплатіжного email workflow |
| `email_error` | migration + code | остання помилка email workflow |
| `cancelled_at` | migration + code | момент вимкнення автопродовження |
| `updated_at` | code | технічна мітка останнього оновлення |

## Що явно підтверджено міграцією

Міграція `20260331_add_missing_web_payment_fields_to_subscriptions.sql` явно додає:

- `order_id`
- `email`
- `customer_name`
- `plan`
- `amount`
- `currency`
- `rectoken`
- `hutko_payment_id`
- `email_status`
- `email_error`
- `cancelled_at`

Також міграція додає індекси для:

- `order_id`
- `email`
- `rectoken`
- recurring lookup: `(status, auto_renewal, expires_at)` з `WHERE rectoken IS NOT NULL`

## Що підтверджено кодом, але не цією sync-міграцією як нові колонки

- `id`
- `plan_type`
- `status`
- `payment_provider`
- `platform`
- `auto_renewal`
- `started_at`
- `expires_at`
- `user_id`
- `updated_at`

Це не schema bug, а **repo/documentation observation**: частина базової схеми існувала раніше, але її повний SQL-опис зараз не представлений у repo одним канонічним файлом.

## Практичні інваріанти поточного flow

1. `order_id` має бути унікальним для checkout flow.
2. `status = pending` створюється до звернення в Hutko.
3. Лише callback переводить subscription у фінальний стан після платежу.
4. Для recurring flow потрібні одночасно:
   - `status = active`
   - `auto_renewal = true`
   - `rectoken IS NOT NULL`
   - `expires_at <= tomorrow`
5. Вимкнення автопродовження не повинно обривати вже оплачений доступ; орієнтиром лишається `expires_at`.

## Пов'язані файли

- `app/api/payment/create/route.ts`
- `app/api/payment/callback/route.ts`
- `app/api/payment/status/route.ts`
- `app/api/payment/recurring/route.ts`
- `app/api/cancel/route.ts`
- `lib/payment-flow.ts`
- `lib/plans.ts`
- `supabase/migrations/20260331_add_missing_web_payment_fields_to_subscriptions.sql`