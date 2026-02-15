import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft } from "lucide-react"

export const metadata: Metadata = {
  title: "Політика конфіденційності — Розрахуй і В'яжи",
  description: "Політика конфіденційності мобільного додатку Розрахуй і В'яжи.",
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-4xl items-center gap-4 px-4 py-4 lg:px-8">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            {"На головну"}
          </Link>
          <div className="flex items-center gap-2">
            <Image
              src="/images/logo.jpg"
              alt="Розрахуй і В'яжи логотип"
              width={28}
              height={28}
              className="h-7 w-7 rounded-md object-cover"
            />
            <span className="text-sm font-semibold text-foreground">
              {"Розрахуй і В'яжи"}
            </span>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="mx-auto max-w-4xl px-4 py-12 lg:px-8 lg:py-16">
        <h1 className="font-serif text-3xl tracking-tight text-foreground sm:text-4xl">
          {"Політика конфіденціальності"}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {"Дата останнього оновлення: 9 лютого 2026 року"}
        </p>

        <div className="mt-8 rounded-xl border border-destructive/30 bg-destructive/5 p-4">
          <p className="text-sm font-medium leading-relaxed text-foreground">
            {"ВАЖЛИВО! Використовуючи цей додаток, ви приймаєте всі умови цієї Політики конфіденційності та несете повну відповідальність за надану інформацію та її використання."}
          </p>
        </div>

        <article className="privacy-content mt-10 flex flex-col gap-10">
          {/* Section 1 */}
          <section>
            <h2 className="font-serif text-2xl text-foreground">{"1. Збір інформації"}</h2>

            <div className="mt-4 flex flex-col gap-6">
              <div>
                <h3 className="text-lg font-semibold text-foreground">
                  {"1.1. Інформація, яку ви надаєте"}
                </h3>
                <p className="mt-2 text-muted-foreground leading-relaxed">
                  {"Ми збираємо інформацію, яку ви ДОБРОВІЛЬНО надаєте:"}
                </p>
                <ul className="mt-2 flex flex-col gap-1.5 pl-5">
                  {[
                    "Ім'я та електронна адреса",
                    "Інформація про проєкти в'язання",
                    "Фотографії та медіа-файли",
                    "Коментарі та публікації в спільноті",
                    "Дані про підписку та платежі",
                  ].map((item, i) => (
                    <li key={i} className="list-disc text-sm text-muted-foreground leading-relaxed">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-foreground">
                  {"1.2. Автоматично зібрана інформація"}
                </h3>
                <p className="mt-2 text-muted-foreground leading-relaxed">
                  {"Ми автоматично збираємо:"}
                </p>
                <ul className="mt-2 flex flex-col gap-1.5 pl-5">
                  {[
                    "Інформацію про пристрій (модель, ОС, версія)",
                    "IP-адресу та приблизну геолокацію",
                    "Дані про використання додатку",
                    "Технічні логи та помилки",
                    "Аналітичні дані через Sentry",
                  ].map((item, i) => (
                    <li key={i} className="list-disc text-sm text-muted-foreground leading-relaxed">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-foreground">
                  {"1.3. Ідентифікатори пристрою та рекламні дані"}
                </h3>
                <p className="mt-2 text-muted-foreground leading-relaxed">
                  {"Наш додаток та інтегровані SDK збирають наступні ідентифікатори пристрою:"}
                </p>
                <ul className="mt-2 flex flex-col gap-1.5 pl-5">
                  {[
                    "Рекламний ідентифікатор (Advertising ID / GAID / IDFA) — збирається через Facebook SDK (Meta) для аналітики та рекламних цілей",
                    "Ідентифікатор пристрою (Android ID) — може збиратися для діагностики та запобігання шахрайству",
                    "Push-токен пристрою (Expo Push Token) — збирається для надсилання push-повідомлень",
                    "Ідентифікатор встановлення (Installation ID) — збирається Sentry для моніторингу помилок",
                  ].map((item, i) => (
                    <li key={i} className="list-disc text-sm text-muted-foreground leading-relaxed">
                      {item}
                    </li>
                  ))}
                </ul>
                <p className="mt-3 text-muted-foreground leading-relaxed">
                  {"Ці ідентифікатори використовуються для:"}
                </p>
                <ul className="mt-2 flex flex-col gap-1.5 pl-5">
                  {[
                    "Аналітики та вимірювання ефективності реклами",
                    "Діагностики помилок та моніторингу стабільності",
                    "Надсилання push-повідомлень",
                    "Запобігання шахрайству та забезпечення безпеки",
                  ].map((item, i) => (
                    <li key={i} className="list-disc text-sm text-muted-foreground leading-relaxed">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-foreground">
                  {"1.4. Відповідальність користувача за надану інформацію"}
                </h3>
                <p className="mt-2 text-muted-foreground leading-relaxed">
                  {"Користувач ПОВНІСТЮ НЕСЕ ВІДПОВІДАЛЬНІСТЬ за:"}
                </p>
                <ul className="mt-2 flex flex-col gap-1.5 pl-5">
                  {[
                    "Точність та актуальність наданої інформації",
                    "Законність публікованого контенту",
                    "Дотримання авторських прав на фото та матеріали",
                    "Наслідки публікації особистої інформації",
                    "Будь-які збитки через неправильну інформацію",
                  ].map((item, i) => (
                    <li key={i} className="list-disc text-sm text-muted-foreground leading-relaxed">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* Section 2 */}
          <section>
            <h2 className="font-serif text-2xl text-foreground">{"2. Використання інформації"}</h2>
            <p className="mt-3 text-muted-foreground leading-relaxed">
              {"Ми використовуємо зібрану інформацію для:"}
            </p>
            <ul className="mt-2 flex flex-col gap-1.5 pl-5">
              {[
                "Надання та підтримки послуг додатку",
                "Обробки платежів та підписок",
                "Спілкування з користувачами",
                "Покращення функціональності додатку",
                "Забезпечення безпеки та запобігання шахрайству",
                "Аналізу використання та виправлення помилок",
                "Відправки повідомлень та оновлень",
              ].map((item, i) => (
                <li key={i} className="list-disc text-sm text-muted-foreground leading-relaxed">
                  {item}
                </li>
              ))}
            </ul>

            <div className="mt-4">
              <h3 className="text-lg font-semibold text-foreground">
                {"2.1. Відмова від відповідальності"}
              </h3>
              <p className="mt-2 text-muted-foreground leading-relaxed">
                {"МИ НЕ НЕСЕМО ВІДПОВІДАЛЬНОСТІ за:"}
              </p>
              <ul className="mt-2 flex flex-col gap-1.5 pl-5">
                {[
                  "Використання вашої інформації третіми особами",
                  "Несанкціонований доступ через вразливості пристрою",
                  "Втрату даних через технічні збої",
                  "Наслідки публікації особистої інформації",
                  "Збитки від витоку даних через дії користувача",
                ].map((item, i) => (
                  <li key={i} className="list-disc text-sm text-muted-foreground leading-relaxed">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* Section 3 */}
          <section>
            <h2 className="font-serif text-2xl text-foreground">{"3. Зберігання даних"}</h2>

            <div className="mt-4 flex flex-col gap-6">
              <div>
                <h3 className="text-lg font-semibold text-foreground">
                  {"3.1. Локальне зберігання"}
                </h3>
                <p className="mt-2 text-muted-foreground leading-relaxed">
                  {"Ваші дані зберігаються локально на вашому пристрої за допомогою WatermelonDB. Користувач несе відповідальність за:"}
                </p>
                <ul className="mt-2 flex flex-col gap-1.5 pl-5">
                  {[
                    "Безпеку пристрою та локальних даних",
                    "Створення резервних копій",
                    "Захист від несанкціонованого доступу",
                    "Втрату даних при видаленні додатку",
                  ].map((item, i) => (
                    <li key={i} className="list-disc text-sm text-muted-foreground leading-relaxed">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-foreground">
                  {"3.2. Хмарне зберігання"}
                </h3>
                <p className="mt-2 text-muted-foreground leading-relaxed">
                  {"Дані синхронізуються з серверами Supabase через захищене з'єднання. Ми використовуємо шифрування, але НЕ ГАРАНТУЄМО:"}
                </p>
                <ul className="mt-2 flex flex-col gap-1.5 pl-5">
                  {[
                    "Абсолютну безпеку даних",
                    "Відсутність витоків або зломів",
                    "Збереження даних назавжди",
                    "Відновлення втрачених даних",
                  ].map((item, i) => (
                    <li key={i} className="list-disc text-sm text-muted-foreground leading-relaxed">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-foreground">
                  {"3.3. Термін зберігання"}
                </h3>
                <p className="mt-2 text-muted-foreground leading-relaxed">
                  {"Ми зберігаємо дані доки ви користуєтесь додатком. Після видалення акаунту:"}
                </p>
                <ul className="mt-2 flex flex-col gap-1.5 pl-5">
                  {[
                    "Дані можуть зберігатися до 90 днів",
                    "Деякі дані можуть залишатися в резервних копіях",
                    "Ми не гарантуємо повне видалення всіх даних",
                    "Публічний контент може залишатися доступним",
                  ].map((item, i) => (
                    <li key={i} className="list-disc text-sm text-muted-foreground leading-relaxed">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* Section 4 */}
          <section>
            <h2 className="font-serif text-2xl text-foreground">{"4. Обмін інформацією"}</h2>

            <div className="mt-4 flex flex-col gap-6">
              <div>
                <h3 className="text-lg font-semibold text-foreground">
                  {"4.1. Треті сторони та SDK, які отримують дані"}
                </h3>
                <p className="mt-2 text-muted-foreground leading-relaxed">
                  {"Ми використовуємо наступні сторонні сервіси, які можуть збирати та отримувати ваші дані:"}
                </p>
                <ul className="mt-2 flex flex-col gap-2 pl-5">
                  {[
                    "Meta / Facebook SDK — збирає рекламний ідентифікатор (Advertising ID), події в додатку, дані про пристрій для аналітики та рекламних цілей.",
                    "Sentry — отримує дані про помилки, збої, інформацію про пристрій та Installation ID для моніторингу стабільності.",
                    "Supabase — зберігає дані користувача, проєкти, контент спільноти у хмарі.",
                    "Google Play Services — обробка покупок в додатку (In-App Purchases), авторизація через Google Sign-In.",
                    "Expo Push Notifications — надсилання push-повідомлень через Push-токен пристрою.",
                  ].map((item, i) => (
                    <li key={i} className="list-disc text-sm text-muted-foreground leading-relaxed">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-foreground">
                  {"4.2. Коли ми передаємо інформацію"}
                </h3>
                <p className="mt-2 text-muted-foreground leading-relaxed">
                  {"Ми також можемо передавати вашу інформацію:"}
                </p>
                <ul className="mt-2 flex flex-col gap-1.5 pl-5">
                  {[
                    "Платіжним системам для обробки платежів",
                    "Правоохоронним органам за запитом",
                    "У разі продажу або злиття компанії",
                    "Для захисту наших прав та інтересів",
                    "Третім особам за вашою згодою",
                  ].map((item, i) => (
                    <li key={i} className="list-disc text-sm text-muted-foreground leading-relaxed">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-foreground">
                  {"4.3. Публічна інформація"}
                </h3>
                <p className="mt-2 text-muted-foreground leading-relaxed">
                  {"Інформація, яку ви публікуєте в спільноті:"}
                </p>
                <ul className="mt-2 flex flex-col gap-1.5 pl-5">
                  {[
                    "Стає ПУБЛІЧНОЮ та доступною всім користувачам",
                    "Може бути скопійована та поширена іншими",
                    "Не може бути повністю видалена з інтернету",
                    "Залишається вашою відповідальністю",
                  ].map((item, i) => (
                    <li key={i} className="list-disc text-sm text-muted-foreground leading-relaxed">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-foreground">
                  {"4.4. Відмова від відповідальності"}
                </h3>
                <p className="mt-2 text-muted-foreground leading-relaxed">
                  {"Ми НЕ НЕСЕМО ВІДПОВІДАЛЬНОСТІ за:"}
                </p>
                <ul className="mt-2 flex flex-col gap-1.5 pl-5">
                  {[
                    "Дії третіх осіб з вашою інформацією",
                    "Витік даних через постачальників послуг",
                    "Використання публічної інформації іншими",
                    "Наслідки передачі даних правоохоронним органам",
                  ].map((item, i) => (
                    <li key={i} className="list-disc text-sm text-muted-foreground leading-relaxed">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* Section 5 */}
          <section>
            <h2 className="font-serif text-2xl text-foreground">{"5. Безпека"}</h2>

            <div className="mt-4 flex flex-col gap-6">
              <div>
                <h3 className="text-lg font-semibold text-foreground">
                  {"5.1. Наші заходи безпеки"}
                </h3>
                <p className="mt-2 text-muted-foreground leading-relaxed">
                  {"Ми використовуємо:"}
                </p>
                <ul className="mt-2 flex flex-col gap-1.5 pl-5">
                  {[
                    "Шифрування даних при передачі (SSL/TLS)",
                    "Захищені сервери Supabase",
                    "Автентифікацію з паролем",
                    "Біометричну автентифікацію (опціонально)",
                    "Моніторинг помилок через Sentry",
                  ].map((item, i) => (
                    <li key={i} className="list-disc text-sm text-muted-foreground leading-relaxed">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-foreground">
                  {"5.2. Обмеження гарантій безпеки"}
                </h3>
                <p className="mt-2 text-muted-foreground leading-relaxed">
                  {"МИ НЕ ГАРАНТУЄМО:"}
                </p>
                <ul className="mt-2 flex flex-col gap-1.5 pl-5">
                  {[
                    "Абсолютну безпеку ваших даних",
                    "Захист від всіх видів атак",
                    "Відсутність вразливостей",
                    "Запобігання несанкціонованому доступу",
                    "Захист від дій користувача (слабкий пароль, тощо)",
                  ].map((item, i) => (
                    <li key={i} className="list-disc text-sm text-muted-foreground leading-relaxed">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-foreground">
                  {"5.3. Відповідальність користувача за безпеку"}
                </h3>
                <p className="mt-2 text-muted-foreground leading-relaxed">
                  {"Користувач ЗОБОВ'ЯЗАНИЙ:"}
                </p>
                <ul className="mt-2 flex flex-col gap-1.5 pl-5">
                  {[
                    "Використовувати надійний пароль",
                    "Зберігати пароль в таємниці",
                    "Не передавати доступ третім особам",
                    "Негайно повідомляти про підозрілу активність",
                    "Захищати свій пристрій від зловмисників",
                    "Нести відповідальність за дії під своїм акаунтом",
                  ].map((item, i) => (
                    <li key={i} className="list-disc text-sm text-muted-foreground leading-relaxed">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* Section 6 */}
          <section>
            <h2 className="font-serif text-2xl text-foreground">{"6. Ваші права"}</h2>

            <div className="mt-4 flex flex-col gap-6">
              <div>
                <h3 className="text-lg font-semibold text-foreground">
                  {"6.1. Права користувача"}
                </h3>
                <p className="mt-2 text-muted-foreground leading-relaxed">
                  {"Ви маєте право на:"}
                </p>
                <ul className="mt-2 flex flex-col gap-1.5 pl-5">
                  {[
                    "Доступ до вашої особистої інформації",
                    "Виправлення неточних даних",
                    "Видалення вашого акаунту та даних",
                    "Відмову від певних видів збору даних",
                    "Експорт ваших даних",
                    "Скаргу до регуляторних органів",
                  ].map((item, i) => (
                    <li key={i} className="list-disc text-sm text-muted-foreground leading-relaxed">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-foreground">
                  {"6.2. Обмеження прав"}
                </h3>
                <p className="mt-2 text-muted-foreground leading-relaxed">
                  {"Ми можемо ВІДМОВИТИ у реалізації прав, якщо:"}
                </p>
                <ul className="mt-2 flex flex-col gap-1.5 pl-5">
                  {[
                    "Це порушує права інших користувачів",
                    "Це вимагається законом",
                    "Це необхідно для захисту наших інтересів",
                    "Запит є необґрунтованим або надмірним",
                    "Дані вже були видалені або анонімізовані",
                  ].map((item, i) => (
                    <li key={i} className="list-disc text-sm text-muted-foreground leading-relaxed">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* Section 7 */}
          <section>
            <h2 className="font-serif text-2xl text-foreground">
              {"7. Аналітика, реклама та відстеження"}
            </h2>
            <p className="mt-3 text-muted-foreground leading-relaxed">
              {"Наш мобільний додаток:"}
            </p>
            <ul className="mt-2 flex flex-col gap-1.5 pl-5">
              {[
                "НЕ використовує файли cookie",
                "Використовує локальне сховище для налаштувань",
                "Використовує Sentry для моніторингу помилок та збоїв",
                "Використовує Facebook SDK (Meta) для аналітики подій та рекламних цілей",
                "Збирає рекламний ідентифікатор (Advertising ID / GAID) для вимірювання ефективності реклами",
                "Збирає дані про використання додатку",
              ].map((item, i) => (
                <li key={i} className="list-disc text-sm text-muted-foreground leading-relaxed">
                  {item}
                </li>
              ))}
            </ul>

            <div className="mt-4">
              <h3 className="text-lg font-semibold text-foreground">
                {"7.1. Відмова від відстеження"}
              </h3>
              <p className="mt-2 text-muted-foreground leading-relaxed">
                {"Ви можете обмежити збір рекламних даних:"}
              </p>
              <ul className="mt-2 flex flex-col gap-1.5 pl-5">
                <li className="list-disc text-sm text-muted-foreground leading-relaxed">
                  {"Android: Налаштування \u2192 Google \u2192 Реклама \u2192 Видалити рекламний ідентифікатор"}
                </li>
                <li className="list-disc text-sm text-muted-foreground leading-relaxed">
                  {"iOS: Налаштування \u2192 Конфіденційність \u2192 Відстеження \u2192 Вимкнути дозвіл для додатку"}
                </li>
              </ul>
              <p className="mt-3 text-muted-foreground leading-relaxed">
                {"Відмова від відстеження може:"}
              </p>
              <ul className="mt-2 flex flex-col gap-1.5 pl-5">
                {[
                  "Обмежити персоналізацію досвіду використання",
                  "Ускладнити виправлення помилок",
                  "Не впливає на основну функціональність додатку",
                ].map((item, i) => (
                  <li key={i} className="list-disc text-sm text-muted-foreground leading-relaxed">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* Section 8 */}
          <section>
            <h2 className="font-serif text-2xl text-foreground">{"8. Діти"}</h2>
            <p className="mt-3 text-muted-foreground leading-relaxed">
              {"Додаток НЕ призначений для дітей до 16 років. Ми свідомо не збираємо інформацію від дітей. Якщо ви батько/опікун і виявили, що ваша дитина надала нам інформацію, зв'яжіться з нами для видалення даних. Батьки несуть повну відповідальність за використання додатку дітьми."}
            </p>
          </section>

          {/* Section 9 */}
          <section>
            <h2 className="font-serif text-2xl text-foreground">
              {"9. Міжнародна передача даних"}
            </h2>
            <p className="mt-3 text-muted-foreground leading-relaxed">
              {"Ваші дані можуть зберігатися та оброблятися в різних країнах, включаючи країни за межами ЄС. Використовуючи додаток, ви погоджуєтесь на таку передачу даних. Ми НЕ ГАРАНТУЄМО, що закони про захист даних в інших країнах будуть такими ж суворими, як в Україні або ЄС."}
            </p>
          </section>

          {/* Section 10 */}
          <section>
            <h2 className="font-serif text-2xl text-foreground">{"10. Зміни в політиці"}</h2>
            <p className="mt-3 text-muted-foreground leading-relaxed">
              {"Ми можемо оновлювати цю політику конфіденційності в будь-який час БЕЗ попереднього повідомлення. Продовження використання додатку після змін означає прийняття нової політики. Користувач зобов'язаний регулярно перевіряти оновлення. Дата останнього оновлення вказана на початку документу."}
            </p>
          </section>

          {/* Section 11 */}
          <section>
            <h2 className="font-serif text-2xl text-foreground">{"11. Відмова від гарантій"}</h2>
            <div className="mt-3 rounded-xl border border-border bg-secondary/30 p-4">
              <p className="text-sm font-medium leading-relaxed text-foreground">
                {"ЦЯ ПОЛІТИКА КОНФІДЕНЦІЙНОСТІ НАДАЄТЬСЯ \"ЯК Є\". МИ НЕ ГАРАНТУЄМО:"}
              </p>
              <ul className="mt-2 flex flex-col gap-1.5 pl-5">
                {[
                  "Повну конфіденційність ваших даних",
                  "Відсутність витоків або зломів",
                  "Дотримання всіх положень цієї політики",
                  "Захист від дій третіх осіб",
                  "Збереження даних назавжди",
                ].map((item, i) => (
                  <li key={i} className="list-disc text-sm text-muted-foreground leading-relaxed">
                    {item}
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-sm font-semibold text-foreground">
                {"ВИКОРИСТОВУЮЧИ ДОДАТОК, ВИ ПРИЙМАЄТЕ ВСІ РИЗИКИ, ПОВ'ЯЗАНІ З КОНФІДЕНЦІЙНІСТЮ ТА БЕЗПЕКОЮ ВАШИХ ДАНИХ."}
              </p>
            </div>
          </section>

          {/* Section 12 */}
          <section>
            <h2 className="font-serif text-2xl text-foreground">{"12. Контакти"}</h2>
            <p className="mt-3 text-muted-foreground leading-relaxed">
              {"Якщо у вас є питання щодо цієї політики конфіденційності, зв'яжіться з нами:"}
            </p>
            <p className="mt-2">
              <a
                href="mailto:craftappmobile@gmail.com"
                className="font-medium text-primary underline underline-offset-4 hover:text-primary/80"
              >
                {"craftappmobile@gmail.com"}
              </a>
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              {"Ми розглянемо ваш запит протягом 30 днів, але НЕ ГАРАНТУЄМО відповідь на всі звернення."}
            </p>
          </section>
        </article>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card py-6 text-center">
        <p className="text-sm text-muted-foreground">
          {"© 2026 Розрахуй і В'яжи. В'яжіть петля за петлею!"}
        </p>
      </footer>
    </div>
  )
}
