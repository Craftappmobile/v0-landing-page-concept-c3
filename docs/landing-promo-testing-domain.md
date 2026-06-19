# Landing promo: тестовий домен для Hutko recurring

## Що змінили

У гілці `landing-promo` прибрали внутрішню перевірку в `app/api/payment/recurring/route.ts`, яка блокувала `NEXT_PUBLIC_SITE_URL=https://rozrahuy-i-vyazhi.vercel.app`.

Після цього recurring-платежі можуть використовувати callback:

- `https://rozrahuy-i-vyazhi.vercel.app/api/payment/callback`

## Навіщо це зробили

Основний сайт працює на `https://vjazhi.com.ua`, а `https://rozrahuy-i-vyazhi.vercel.app` використовується як окремий тестовий landing для перевірки нових цін підписки.

Ми свідомо залишили тестування в окремій гілці GitHub і окремому Vercel-проєкті, щоб:

- не ризикувати продакшн-сайтом `vjazhi.com.ua`;
- перевіряти нові цінові сценарії окремо;
- зберегти той самий Supabase-проєкт і той самий Hutko/Resend flow.

## Що це означає на практиці

- `vjazhi.com.ua` і далі залишається основним сайтом;
- `rozrahuy-i-vyazhi.vercel.app` дозволений як тестовий домен для landing-проєкту;
- welcome email продовжує надсилатися через `noreply@vjazhi.com.ua`;
- recurring callback для тестового landing іде на його власний домен, а не на продакшн.

## Важливе правило

Це рішення зроблене саме для сценарію тестування цін у окремій гілці/окремому Vercel-проєкті.

Якщо зміни з `landing-promo` колись будуть переноситися в `main`, потрібно ще раз перевірити, який домен має стояти в `NEXT_PUBLIC_SITE_URL` для продакшну.