# Розрахуй і В'яжи — Лендінгова сторінка

Лендінгова сторінка мобільного застосунку **«Розрахуй і В'яжи»** з інтегрованою платіжною системою для продажу підписок безпосередньо з веб-сайту.

## Стек технологій

| Шар | Технологія |
|-----|-----------|
| Фреймворк | Next.js 16 (App Router) |
| Мова | TypeScript |
| Стилі | Tailwind CSS + shadcn/ui |
| Шрифти | DM Sans, DM Serif Display (Google Fonts) |
| База даних | Supabase (PostgreSQL) |
| Авторизація | Supabase Auth |
| Платежі | WayForPay (українська платіжна система) |
| Email | Resend |
| Деплоймент | Vercel |
| Пакетний менеджер | pnpm |

---

## Структура проєкту

```
/
├── app/
│   ├── layout.tsx          # Root layout, шрифти, метадані
│   ├── page.tsx            # Головна сторінка (лендінг)
│   ├── globals.css         # Кольорова схема та CSS змінні
│   ├── privacy/page.tsx    # Політика конфіденційності
│   └── terms/page.tsx      # Умови використання
│
├── components/
│   ├── landing/            # Секції лендінгової сторінки
│   │   ├── header.tsx
│   │   ├── hero-section.tsx
│   │   ├── pain-points-section.tsx
│   │   ├── features-section.tsx
│   │   ├── community-section.tsx
│   │   ├── testimonials-section.tsx
│   │   ├── pricing-section.tsx
│   │   ├── faq-section.tsx
│   │   ├── cta-section.tsx
│   │   └── footer.tsx
│   └── ui/                 # shadcn/ui компоненти
│
├── lib/
│   └── utils.ts            # Утиліти (cn, clsx)
│
├── hooks/
│   ├── use-mobile.tsx
│   └── use-toast.ts
│
└── public/
    └── images/             # Зображення (логотип тощо)
```

---

## Підписки та ціни

| Тариф | Ціна | Період |
|-------|------|--------|
| Преміум 6-місячна | 599.99 грн | 6 місяців (~100 грн/міс) |
| Преміум річна | 918 грн | 1 рік (~76.50 грн/міс) |
| Безлімітна | 4 585 грн | Назавжди (одноразово) |

---

## Платіжний флоу

```
Користувач натискає "Придбати підписку"
        ↓
Модальне вікно: введення email та імені
        ↓
Next.js API /api/payment/create
  → Збереження даних у pending_payment_data
  → Генерація HMAC-MD5 підпису WayForPay
        ↓
WayForPay widget (JavaScript) — оплата карткою
        ↓
WayForPay надсилає Webhook → Supabase Edge Function
  → Перевірка HMAC-MD5 підпису
  → Створення акаунту в Supabase Auth
  → Запис підписки в таблицю subscriptions
  → Запис у payment_logs
        ↓
Resend надсилає email з:
  - логіном (email)
  - згенерованим паролем
  - посиланням на App Store
  - посиланням на Google Play
```

---

## База даних (Supabase)

### Таблиці

| Таблиця | Призначення |
|---------|------------|
| `profiles` | Профілі користувачів (ім'я, email) |
| `subscriptions` | Активні підписки (план, дата, статус) |
| `payment_logs` | Журнал усіх платіжних подій |
| `pending_payment_data` | Тимчасове зберігання даних до підтвердження платежу |

### Структура `pending_payment_data` (додані колонки)
```sql
ALTER TABLE public.pending_payment_data
  ADD COLUMN email      TEXT,
  ADD COLUMN plan_code  TEXT,
  ADD COLUMN amount     NUMERIC;
```

---

## Локальна розробка

### 1. Встановити залежності
```bash
pnpm install
```

### 2. Налаштувати змінні середовища

Скопіювати `.env.local.example` у `.env.local` і заповнити значення:
```bash
cp .env.local.example .env.local
```

### 3. Запустити сервер розробки
```bash
pnpm dev
```

Відкрити [http://localhost:3000](http://localhost:3000)

---

## Змінні середовища

> ⚠️ Ніколи не комітьте реальні значення в Git. Файл `.env.local` є в `.gitignore`.

| Змінна | Доступ | Призначення |
|--------|--------|------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Публічна | URL проєкту Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Публічна | Anon-ключ для клієнтського коду |
| `SUPABASE_SERVICE_ROLE_KEY` | Тільки сервер | Адмін-ключ (створення користувачів) |
| `WAYFORPAY_MERCHANT` | Тільки сервер | Ідентифікатор мерчанта WayForPay |
| `WAYFORPAY_SECRET` | Тільки сервер | Секретний ключ для HMAC-MD5 |
| `RESEND_API_KEY` | Тільки сервер | API ключ для відправки email |
| `NEXT_PUBLIC_APP_STORE_URL` | Публічна | Посилання на App Store |
| `NEXT_PUBLIC_GOOGLE_PLAY_URL` | Публічна | Посилання на Google Play |

---

## Деплоймент (Vercel)

Проєкт автоматично деплоїться на Vercel при пуші в гілку `main`.

### Ручний деплоймент
```bash
vercel --prod
```

### Перевірка змінних середовища
```bash
vercel env ls
```

---

## Supabase Edge Functions

Webhook-функція розгорнута окремо в Supabase:

```
supabase/functions/
└── wayforpay-webhook/
    └── index.ts    # Deno-функція обробки webhook
```

### Деплоймент функції
```bash
supabase functions deploy wayforpay-webhook
```

---

## Безпека

- `SUPABASE_SERVICE_ROLE_KEY` та `WAYFORPAY_SECRET` **ніколи** не передаються в браузер
- Всі платіжні webhook-и перевіряються через HMAC-MD5 підпис
- Row Level Security (RLS) увімкнений на всіх таблицях Supabase
- Змінні з префіксом `NEXT_PUBLIC_` доступні в браузері — не зберігайте там секрети

---

## WayForPay (Тестовий режим)

| Параметр | Значення |
|----------|---------|
| Merchant | `rozrahuy_i_vyazhi_vercel_app` |
| Режим | Тестовий |
| Тестова картка (успіх) | `4111 1111 1111 1111` |
| Тестова картка (відмова) | `4111 1111 1111 1112` |

> Для переведення в production режим: змінити налаштування в особистому кабінеті WayForPay.

---

## Корисні посилання

- [Vercel Dashboard](https://vercel.com/craftappmobiles-projects/v0-landing-page-concept)
- [Supabase Dashboard](https://supabase.com/dashboard/project/xaeztaeqyjubmpgjxcgh)
- [WayForPay Документація](https://wiki.wayforpay.com)
- [Resend Документація](https://resend.com/docs)
- [shadcn/ui Компоненти](https://ui.shadcn.com)

