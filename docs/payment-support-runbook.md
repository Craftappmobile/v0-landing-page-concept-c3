# Payment support runbook — оплата є, доступу немає

Цей документ — коротка інструкція для підтримки платежів Hutko, коли клієнт оплатив підписку, але не отримав доступ або лист із паролем.

## Коли використовувати

Використовуй runbook, якщо:

- Hutko показує `approved` / успішну оплату;
- у клієнта немає листа з доступом;
- у `subscriptions` є `active`, але `user_id` порожній;
- `email_status` дорівнює `exception`, `failed` або `no_email_found`;
- потрібно перевірити direct payment link з Hutko.

## Нормальний стан після успішної оплати

Для виконаної оплати має бути:

- `subscriptions.status = 'active'`;
- `subscriptions.user_id IS NOT NULL`;
- користувач існує в `auth.users`;
- `subscriptions.email_status = 'sent'`;
- `subscriptions.email_error IS NULL`.

Якщо всі умови виконані, система відправила welcome email. Це не гарантує, що клієнт відкрив лист: треба попросити перевірити `Спам`, `Промоакції`, `Розсилки`.

## Службовий токен Vercel

Для ручної діагностики потрібна змінна середовища у Vercel Production:

`PAYMENT_SUPPORT_TOKEN`

Токен потрібен тільки для службових endpoint-ів. Він не потрібен звичайним покупцям і не використовується Hutko callback-ом.

Не записуй реальне значення токена в документацію, коментарі, GitHub, чат або логи.

Після додавання або зміни `PAYMENT_SUPPORT_TOKEN` у Vercel треба зробити production redeploy.

## Protected support endpoints

Обидва endpoint-и приймають токен одним із способів:

```http
Authorization: Bearer <PAYMENT_SUPPORT_TOKEN>
```

або:

```http
x-support-token: <PAYMENT_SUPPORT_TOKEN>
```

Якщо токен не налаштований у Vercel, endpoint поверне `503` і `Support endpoint is not configured`.

Якщо токен неправильний або відсутній, endpoint поверне `401` і `Unauthorized`.

## 1. Знайти проблемні активні підписки

Endpoint:

```http
GET https://vjazhi.com.ua/api/payment/reconciliation
```

Опційні query params:

- `limit=50` — скільки записів повернути;
- `include_null_email_status=true` — також показати старі записи, де `email_status IS NULL`.

Endpoint шукає активні підписки з email, де:

- `user_id IS NULL`; або
- `email_status IN ('exception', 'failed', 'no_email_found')`.

## 2. Повторно видати доступ для конкретної оплати

Endpoint:

```http
POST https://vjazhi.com.ua/api/payment/retry-access
```

Body:

```json
{
  "order_id": "Order_...",
  "payment_id": "102..."
}
```

Важливо:

- endpoint працює тільки для `status = 'active'`;
- `order_id` і `payment_id` мають відповідати одному запису `subscriptions`;
- якщо користувач уже існує, новий пароль не генерується;
- endpoint ніколи не повертає пароль у відповіді;
- якщо створено нового Auth user, пароль надсилається тільки email-листом.

Можливі відповіді:

- `{ "status": "sent" }` — лист відправлено;
- `{ "status": "failed" }` — спроба була, але email provider повернув помилку;
- `{ "status": "already_sent" }` — доступ уже виданий і лист уже був відправлений.

## 3. SQL-перевірка проблемних оплат

Якщо API недоступне, можна перевірити напряму в Supabase SQL Editor:

```sql
select id, order_id, hutko_payment_id, email, customer_name, plan,
       status, user_id, email_status, email_error, created_at, updated_at
from public.subscriptions
where status = 'active'
  and email is not null
  and (user_id is null or email_status in ('exception', 'failed', 'no_email_found'))
order by created_at desc;
```

## 4. Supabase Auth metadata health check

Ця перевірка потрібна, бо `NULL` у metadata `auth.users` може ламати Supabase Auth Admin API.

```sql
select count(*) as total_users,
       count(*) filter (where raw_app_meta_data is null) as null_app_meta,
       count(*) filter (where raw_user_meta_data is null) as null_user_meta
from auth.users;
```

`null_app_meta` і `null_user_meta` мають бути `0`.

## 5. Налаштування direct payment links у Hutko

Hutko не надсилає у callback `payment link id` або `button id`, тому тариф треба передавати через приховане поле `plan_code`.

Для кожного direct payment link мають бути поля:

| Призначення | Назва поля callback | Коментар |
|---|---|---|
| Email клієнта | `sender_email` | Без пробілів і без `;` |
| Імʼя клієнта | `sender_name` | Без пробілів і без `;` |
| Код тарифу | `plan_code` | Приховане поле |

Мапінг тарифів:

| Тариф | `plan_code` |
|---|---:|
| 3 місяці | `3` |
| 6 місяців | `6` |
| 1 рік | `12` |
| Безліміт | `9999` |

Правильно: `sender_name`.

Неправильно: `sender_name;`.

Callback URL сервера для всіх payment links:

```text
https://vjazhi.com.ua/api/payment/callback
```

## 6. Що було виправлено технічно

- Direct Hutko callback тепер може створювати `active` subscription без попереднього `pending` запису.
- `merchant_data` підтримує Hutko array-формат з полями `sender_email`, `sender_name`, `plan_code`.
- Провіжнінг доступу більше не залежить від `supabase.auth.admin.listUsers()`.
- Пошук Auth user за email іде через service-role RPC `find_paid_auth_user_by_email`.
- Нові Auth users створюються тільки через Supabase Auth Admin API `createUser`.
- Direct SQL fallback `create_paid_auth_user` прибраний з production flow і задепрекейчений міграцією.
- Якщо `supabase.auth.admin.createUser()` падає, система не створює напіввалідний Auth user напряму в `auth.users`; підписка має потрапити в reconciliation/retry.
- Support endpoints захищені через `PAYMENT_SUPPORT_TOKEN`.
- Додано reconciliation для пошуку оплат, де доступ не виданий або лист не відправився.

## 7. Що сказати клієнту

Якщо `email_status = 'sent'` і `user_id` заповнений:

> Доброго дня! Ми перевірили оплату — підписка активована, а лист із даними для входу був відправлений на вашу пошту. Будь ласка, перевірте папки “Спам”, “Промоакції” або “Розсилки”. Якщо листа немає, напишіть нам — ми повторно допоможемо з доступом.

Якщо `email_status` не `sent`, спочатку виконай reconciliation/retry, а потім повідом клієнта про результат.

## Повʼязані документи

- `docs/payment-reconciliation.md`
- `docs/hutko-integration-guide.md`
- `docs/subscriptions-schema-reference.md`