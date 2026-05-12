# Payment access reconciliation

Use this when Hutko shows a successful payment but the customer did not receive login credentials.

## Invariants

A successfully fulfilled paid subscription should have:

- `subscriptions.status = 'active'`
- `subscriptions.user_id IS NOT NULL`
- matching user in `auth.users`
- `subscriptions.email_status = 'sent'`
- `subscriptions.email_error IS NULL`

## Protected support endpoints

Both endpoints require `PAYMENT_SUPPORT_TOKEN` in Vercel Production environment.
Send it as either:

- `Authorization: Bearer <token>`
- or `x-support-token: <token>`

### Find problematic active subscriptions

`GET /api/payment/reconciliation`

Optional query params:

- `limit=50`
- `include_null_email_status=true`

Default only returns definite failures: `user_id IS NULL` or `email_status IN ('exception','failed','no_email_found')`.

### Retry issuing access

`POST /api/payment/retry-access`

Body:

```json
{
  "order_id": "Order_...",
  "payment_id": "102..."
}
```

The endpoint never returns a password. If it creates a new Auth user, the password is sent only by email.

## SQL fallback check

```sql
select id, order_id, hutko_payment_id, email, plan, status, user_id, email_status, email_error, created_at
from public.subscriptions
where status = 'active'
  and email is not null
  and (user_id is null or email_status in ('exception', 'failed', 'no_email_found'))
order by created_at desc;
```

## Auth metadata health check

```sql
select count(*) as total_users,
       count(*) filter (where raw_app_meta_data is null) as null_app_meta,
       count(*) filter (where raw_user_meta_data is null) as null_user_meta
from auth.users;
```

Both null counts must be `0`.
