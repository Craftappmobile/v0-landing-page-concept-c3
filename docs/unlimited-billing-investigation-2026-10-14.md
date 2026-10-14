# Безлімітний доступ: розслідування зайвих списань і план виправлення

## Висновок

Перевірка production Supabase `xaeztaeqyjubmpgjxcgh` станом на 14.10.2026, близько 15:22 UTC.
Скарга `i62027@ukr.net` підтверджена: після надання безлімітного доступу отримано два успішні платежі старої місячної підписки, разом **200 грн**.
Це не автопродовження самого безлімітного плану. Безлімітні записи мають `auto_renewal = false`, `recurring_mode = none`.
Зупинка старого розкладу Hutko не була забезпечена локальним вимкненням автопродовження; доказу успішного provider stop у БД немає.
Виконані лише read-only запити, аналіз коду й локальні перевірки. Платежі, доступ, production-код та БД не змінювалися.

## Факти щодо покупця

- Auth user: `e8a2acdd-cdfd-4d05-b41a-45660fcbce08`.
- Стара місячна підписка: `809ca629-01ef-4149-b436-af8cf89aa21a`, створена 13.08.2026.
- Батьківське замовлення Hutko: `Order_1702587_mZrcnwhOxe_1786630625`.
- Безлімітний запис: `3012cdfe-5206-44b1-aed5-671368f28430`.
- Безліміт надано **17.08.2026 о 18:14:53 UTC**: `plan_type = lifetime`, `payment_provider = manual`, доступ до 17.08.2126.
- Це адміністративне надання доступу; факту купівлі платного `forever` у цьому акаунті БД не показує.
- Тоді ж старому `month` виставлено `cancelled_at`; зараз він має `status = active`, `auto_renewal = false`, `recurring_mode = none`.
- Але `cancellation_state = none`, `cancellation_completed_at = NULL`; cancellation audit для цих двох записів порожній.

| Дата callback (UTC) | Hutko payment ID | Результат | Сума |
|---|---|---|---|
| 13.09.2026 15:15:20 | `104618147` | `renewal_approved / renewal_applied` | 100 грн |
| 13.10.2026 15:15:49 | `105307901` | `renewal_approved / renewal_applied` | 100 грн |

Обидва callback містять `recurring__…__<parent_order>` і посилаються на старе місячне замовлення.
Звірити ці два платежі в Hutko перед поверненням: callback `approved` не замінює перевірку подальших refund/reversal у провайдера.
Поточний статус розкладу та дата наступного списання в Hutko напряму не перевірялися.

## Масштаб і межі перевірки

- Перевірено **78 користувачів** з активними `forever` / `lifetime`: 18 Hutko `forever`, 60 `lifetime` (57 manual, 3 без зазначеного провайдера).
- Зіставлення: `user_id`, нормалізований subscription email та Auth email; це враховує `lifetime` без email у записі.
- **1 підтверджений потерпілий**: покупець вище, 2 платежі / 200 грн.
- Ще **4 користувачі** мають 10 старих Hutko записів: 8 `pending`, 2 `failed`, усі `recurring_mode = unknown`.
- У цих чотирьох немає підтверджених платежів після безліміту. Це кандидати на звірку, а не доведені зайві списання.
- Загалом у 5 акаунтів є 12 інших Hutko записів; один додатковий `active month` не має `order_id` і не доводить існування розкладу.
- Серед 78 усі безлімітні записи мають вимкнене renewal. Інших approved callback після початку їхнього безліміту не знайдено.
- `payment_logs` після початку безліміту для цих акаунтів також не містить записів інших підписок.
- Збережені callback охоплюють 11.06–13.10.2026; таблиця не є гарантовано повною випискою всіх платежів Hutko.
- Виявлено один старий `google_play / expired / auto_renewal = true`; його billing-стан можна підтвердити лише окремою звіркою Google Play.
- Для повного фінансового висновку потрібна виписка Hutko та перевірка розкладів, включно з оплатами без локального зв'язку з акаунтом.

## Причини та кодові прогалини

1. **Локальне вимкнення не означає зупинку Hutko.** `lib/hutko.ts:67–115` має окремий provider `action: stop`.
   Cron (`app/api/payment/recurring/route.ts:64–95`) не вибирає нинішній запис покупця: потрібні `auto_renewal = true` та `merchant_token`.
   Формат отриманих платежів відповідає legacy provider renewal; поточний локальний стан не блокує розклад у Hutko.
2. **Legacy `none` помилково прирівнюється до завершеного скасування.** `lib/cancel-subscription.ts:34–35` повертає `already_completed` лише через `recurring_mode = none`.
   `app/api/cancel/route.ts:43–50` не вибирає цей запис з вимкненим renewal і без cancellation state.
   Orphan fallback шукає email у callback (`lib/orphan-subscription-cancellation.ts:23–29`), але обидві renewal-події покупця не мають access/payer email.
   Backfill `20260830_backfill_deterministic_recurring_modes.sql:4–10` також класифікує локально вимкнені записи як `none` без перевірки Hutko.
   Точну історичну операцію, яка не зупинила Hutko у серпні, за наявним аудитом встановити неможливо.
3. **Немає загальної процедури переходу на безліміт.** Активація у `app/api/payment/callback/route.ts:430–465, 779–835` змінює лише поточний запис.
   Старі підписки не скасовуються при активації `forever`; адміністративне надання `lifetime` також має використовувати спільну процедуру.
4. **Renewal не обробляє безліміт / legacy stop як аномалію.** RPC у `20260830_add_subscription_cancellation_state.sql:113–150` фіксує оплату й подовжує parent.
   Callback (`app/api/payment/callback/route.ts:633–659`) повторно зупиняє лише класифікований schedule з cancellation request, якого тут немає.
5. **Профіль перезаписується останньою зміненою підпискою.** Live trigger підтверджено; код у `20260513_fix_subscription_trigger_search_path.sql:23–32`.
   У покупця `profiles.subscription_type = month`, термін до 12.03.2027, хоча `subscriptions.lifetime` активний до 2126 року.
   Додатково 9 власників активного безліміту мають тип профілю `free`; фінансової помилки в них не підтверджено, доступ потребує окремої перевірки.

## План виправлення

### P0 — припинити підтверджене зайве списання (лише після погодження)

1. У Hutko знайти точний parent order покупця й перевірити статус розкладу, найближчу дату платежу та два payment ID.
2. Зупинити саме цей розклад через provider stop / кабінет; зберегти підтвердження в cancellation audit.
   Не вважати ще один `auto_renewal = false` або видалення локального токена достатньою дією. Сам безлімітний запис не скасовувати.
3. Після звірки refund/reversal погодити повернення до **200 грн** і повідомлення покупцю. Не повертати вже повернуті платежі повторно.
4. Після виправлення синхронізації відновити профіль покупця з його чинного lifetime; окремо перевірити 9 профілів `free`.
5. Для 4 інших акаунтів провести dry-run звірку 10 pending/failed замовлень з Hutko; не зупиняти всі записи автоматично лише за локальним прапорцем.

### P1 — виправити скасування та перехід на безліміт

1. У `lib/cancel-subscription.ts` відокремити «не recurring» від «provider stop підтверджено».
   Для legacy recurring плану з `none`, але доказом Hutko schedule/пізнього renewal, вимагати reconciliation/stop; справжні `forever/lifetime` залишити non-recurring.
2. У `/api/cancel` шукати також історичні розклади через parent order та user linkage, а не лише `auto_renewal` / email callback.
   Прибрати обходи, які повертають completed без підтвердження необхідного provider stop; зберегти retry/idempotency поточної state machine.
3. Запровадити спільну серверну процедуру для **підтвердженої** активації `forever` та адміністративного `lifetime`.
   Після активації створювати надійно збережене завдання скасування попередніх recurring підписок того самого акаунта, включно з legacy `none` та pending.
   Не скасовувати старе лише через початок неоплаченого checkout; не покладатися тільки на тимчасову background task.
4. Для Hutko schedule спочатку підтверджений stop, потім completed; помилка/timeout → provider_failed/needs_review, retry і сповіщення підтримці.
   Локальні списання блокувати cancellation intent; безлімітний доступ зберігати незалежно від успіху provider stop.
5. Додати перевірку чинного безліміту перед merchant-token charge та захист від дублювання/одночасних cron запусків.
   Checkout має запобігати зайвій повторній купівлі, не розкриваючи стороннім наявність акаунта за введеним email.
6. Пізній approved renewal після безліміту/stop записувати один раз як фінансову аномалію, ініціювати stop/review, а не приховувати реальну оплату.
   Безліміт не має зникати чи скорочуватися. Unknown driver не дозволяти до списання без доказової класифікації.

### P1 — виправити пріоритет доступу

1. Additive міграцією змінити profile trigger: перераховувати доступ з **усіх** чинних підписок користувача, не копіювати лише `NEW`.
2. Активний `forever/lifetime` має пріоритет; скасування/прострочення старої підписки не переводить власника безліміту у `free`.
3. Врахувати старий і новий `user_id` при перелінкуванні та оплачений доступ cancelled підписки до кінця строку.
4. Repair профілів виконати окремо після dry-run/погодження. Не застосовувати неперевірені масові UPDATE.
5. Зберегти service-role межі для billing/audit, приватність cancellation events і чинні RLS; не відкривати privileged RPC клієнтам.

### P2 — перевірки та контроль

- Поведінкові тести: month → manual lifetime; month → paid forever; direct payment link; lifetime без email; нормалізація email та user_id.
- Legacy none + provider renewal не повертає неправдиве completed; retry після timeout; callback без email знаходиться через parent.
- Повторні/concurrent callback не дублюють списання, завдання, подовження чи повернення; пізня оплата після cancellation видима в аудиті.
- Успіх/невдача/pending cancellation старого плану не змінює lifetime-профіль; profile trigger працює для кількох підписок та unlink/relink.
- Mock-тести HTTP stop і cron не роблять реальних списань; RPC/trigger інтеграційні тести виконати в ізольованій тестовій БД.
- Після погодженого релізу: щоденний звіт «approved renewal після безліміту», unresolved stop та profile mismatch; звірка Hutko через наступний billing cycle.

## Уже виконана валідація

- `node --no-warnings --experimental-strip-types --test scripts/payment-flow.test.mts scripts/cancel-api.test.mts scripts/create-api.test.mts scripts/recurring-cancellation.test.mts`: **64/64 passed**.
- Read-only локальний fixture старого `month / none / auto_renewal=false / cancellation_state=none` відтворив `already_completed`.
- Live trigger метаданими підтверджено як такий, що присвоює `NEW.plan_type` та `NEW.expires_at`.
- Build, deploy, provider stop, refund, ремонт даних і повна виписка Hutko **не виконувалися**.
- Перед реалізацією звірено Supabase документацію: [Postgres Roles](https://supabase.com/docs/guides/database/postgres/roles).

## Локальні виправлення — 14.10.2026

Реалізовано в робочій копії, **без застосування міграцій до production або викликів Hutko**:

- `lib/cancellation-reconciliation.ts` знаходить старі підписки за email та зв'язком з акаунтом,
  включно з локально вимкненими, cancelled/expired Hutko записами. Класифікує schedule за
  підтвердженим exact-parent renewal, а не за токеном чи `auto_renewal = false`.
- `lib/cancel-subscription.ts`, `lib/subscription-cancellation.ts`, `/api/cancel` більше не
  прирівнюють legacy `none` до підтвердженої зупинки. Невідомий режим → ручна звірка;
  timeout stop → повторна спроба; справжній `forever/lifetime` не змінюється.
- `2026101401_preserve_unlimited_profile_access.sql` перераховує профіль з усіх чинних
  підписок, надає безліміту пріоритет, враховує оплачений строк cancelled/failed та relink/delete.
- `2026101402_queue_unlimited_cancellations.sql` створює приватну чергу скасувань при
  підтвердженій активації безліміту, включно з manual lifetime. Pending forever не запускає
  скасування. Завдання обробляються `/api/payment/recurring` з блокуванням і повторними спробами.
- Та сама міграція додає `subscription_charge_claims`: один merchant-token запит на оплачений
  період, перевірка безліміту й cancellation перед списанням. Відсутній `CRON_SECRET` або помилка
  черги/claim блокує billing. Неоднозначний результат провайдера не дозволяє повторне списання.
- `2026101403_guard_unlimited_renewals.sql` фіксує зайві approved renewal як `needs_review`,
  ставить скасування в чергу й не подовжує старий план. Дублі не повторюють зміни.
  Легітимний затриманий renewal після housekeeping expiry залишається дозволеним.
- Callback не виконує provider stop для renewal-аномалій: це робить окремий обробник черги.
  Повторний initial approved для active запису не відновлює renewal і не скорочує оплачений доступ.

### Перевірки після виправлень

- Усі `scripts/*.test.mts`: **154 passed, 0 failed, 1 skipped** (155 тестів).
- `corepack pnpm exec tsc --noEmit` та `git diff --check` — успішні.
- HTTP-перевірки використовують mocks; SQL-перевірки структури не замінюють виконання SQL.
- PostgreSQL integration fixture для профілю пропущений: локальний PostgreSQL недоступний.
  Build та виконання нових міграцій у реальній БД не перевірені.
- Повторно звірено [RLS](https://supabase.com/docs/guides/database/postgres/row-level-security)
  та [обмеження доступу до API](https://supabase.com/docs/guides/api/securing-your-api).

### Умови майбутнього релізу — потрібне окреме погодження

1. Перевірити всі три міграції в ізольованій PostgreSQL-базі: trigger visibility, ownership,
   повторні callback, claim/concurrency, retry й RLS. Наявний opt-in fixture покриває профіль.
2. Застосовувати міграції у порядку `2026101401` → `2026101402` → `2026101403`, після
   наявних попередніх міграцій, і лише потім випускати код, що використовує нові RPC/таблиці.
3. Перевірити налаштований cron і доступність Hutko stop: після релізу обробник черги
   виконуватиме реальні скасування. `needs_review` потребує підтримки, а не сліпого retry.
4. Міграції **не ремонтують історичні дані й не заповнюють чергу старими акаунтами**.
   Окремо погодити dry-run і ремонт профілів/скасування підтвердженого розкладу покупця.
5. Пункти P0 щодо зупинки поточного розкладу й звірки/повернення коштів залишаються відкритими.
   Локальні виправлення ще не захищають production-покупців від наступного платежу.