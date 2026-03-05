import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft } from "lucide-react"

export const metadata: Metadata = {
  title: "Умови використання — Розрахуй і В'яжи",
  description:
    "Умови використання (Публічна оферта) мобільного додатку Розрахуй і В'яжи.",
}

export default function TermsPage() {
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
          {"Умови використання"}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {"Дата останнього оновлення: 3 березня 2026 року"}
        </p>

        {/* Important notice */}
        <div className="mt-8 rounded-xl border-2 border-destructive/30 bg-destructive/5 p-5">
          <p className="text-sm font-semibold leading-relaxed text-foreground">
            {"ВАЖЛИВО! Використовуючи цей додаток, ви ПОВНІСТЮ ПРИЙМАЄТЕ всі умови та несете ПОВНУ ВІДПОВІДАЛЬНІСТЬ за свої дії. Якщо ви не згодні з будь-якою частиною цих умов, НЕ ВИКОРИСТОВУЙТЕ додаток."}
          </p>
        </div>

        <div className="prose-section mt-10 flex flex-col gap-10">
          {/* 1. Прийняття умов */}
          <section>
            <h2 className="font-serif text-xl font-semibold text-foreground sm:text-2xl">
              {"1. Прийняття умов"}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              {"Використовуючи мобільний додаток \"Розрахуй і В'яжи\" (далі - \"Додаток\"), ви підтверджуєте, що прочитали, зрозуміли та ПОВНІСТЮ ПРИЙМАЄТЕ ці Умови використання. Якщо ви не згодні з будь-якою частиною цих умов, ви НЕ МАЄТЕ ПРАВА використовувати Додаток."}
            </p>
          </section>

          {/* 2. Опис послуги */}
          <section>
            <h2 className="font-serif text-xl font-semibold text-foreground sm:text-2xl">
              {"2. Опис послуги"}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              {"Додаток надає інструменти для розрахунків, пов'язаних з в'язанням, включаючи:"}
            </p>
            <ul className="mt-3 flex flex-col gap-1.5 pl-5">
              {[
                "29 калькуляторів для різних типів розрахунків",
                "Збереження проєктів в'язання",
                "Спільноту для обміну досвідом",
                "Інші функції, описані в Додатку",
              ].map((item, i) => (
                <li key={i} className="list-disc text-sm text-muted-foreground">
                  {item}
                </li>
              ))}
            </ul>
          </section>

          {/* 3. Реєстрація та акаунт */}
          <section>
            <h2 className="font-serif text-xl font-semibold text-foreground sm:text-2xl">
              {"3. Реєстрація та акаунт"}
            </h2>

            <h3 className="mt-4 text-base font-semibold text-foreground">
              {"3.1. Вимоги до реєстрації"}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {"Для використання Додатку ви повинні:"}
            </p>
            <ul className="mt-2 flex flex-col gap-1.5 pl-5">
              {[
                "Бути не молодше 16 років",
                "Надати точну та актуальну інформацію",
                "Підтримувати інформацію в актуальному стані",
                "Зберігати конфіденційність паролю",
                "Негайно повідомляти про несанкціонований доступ",
              ].map((item, i) => (
                <li key={i} className="list-disc text-sm text-muted-foreground">
                  {item}
                </li>
              ))}
            </ul>

            <h3 className="mt-4 text-base font-semibold text-foreground">
              {"3.2. Відповідальність за акаунт"}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {"Ви ПОВНІСТЮ НЕСЕТЕ ВІДПОВІДАЛЬНІСТЬ за:"}
            </p>
            <ul className="mt-2 flex flex-col gap-1.5 pl-5">
              {[
                "Всі дії, виконані під вашим акаунтом",
                "Збереження конфіденційності облікових даних",
                "Будь-які збитки через несанкціонований доступ",
                "Точність наданої інформації",
              ].map((item, i) => (
                <li key={i} className="list-disc text-sm text-muted-foreground">
                  {item}
                </li>
              ))}
            </ul>
          </section>

          {/* 4. Підписка та платежі */}
          <section>
            <h2 className="font-serif text-xl font-semibold text-foreground sm:text-2xl">
              {"4. Підписка та платежі"}
            </h2>

            <h3 className="mt-4 text-base font-semibold text-foreground">
              {"4.1. Склад платної послуги"}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {"Преміум-підписка надає доступ до наступних функцій мобільного додатку «Розрахуй і В'яжи»:"}
            </p>
            <ul className="mt-2 flex flex-col gap-1.5 pl-5">
              {[
                "Всі 30 калькуляторів для розрахунків у в'язанні (горловина, реглан, кокетка, витрата пряжі тощо)",
                "CRM обліку пряжі та бюджету проєктів",
                "Галерея ідей з YouTube і Pinterest",
                "Спільнота майстринь",
                "Генератор візерунків (beta)",
              ].map((item, i) => (
                <li key={i} className="list-disc text-sm text-muted-foreground">
                  {item}
                </li>
              ))}
            </ul>

            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              {"Тарифні плани та умови доступу:"}
            </p>
            <ul className="mt-2 flex flex-col gap-1.5 pl-5">
              <li className="list-disc text-sm text-muted-foreground">
                {"Преміум на 6 місяців — 599.99 грн (доступ активується на 180 днів з моменту оплати)"}
              </li>
              <li className="list-disc text-sm text-muted-foreground">
                {"Преміум на рік — 918 грн (доступ активується на 365 днів з моменту оплати)"}
              </li>
              <li className="list-disc text-sm text-muted-foreground">
                {"Довічний доступ — 4 585 грн (одноразовий платіж, безстроковий доступ без обмежень)"}
              </li>
            </ul>

            <h3 className="mt-4 text-base font-semibold text-foreground">
              {"4.2. Як оплатити підписку на сайті"}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {"Усі платежі здійснюються виключно через офіційний вебсайт. Мобільний додаток не бере участі в обробці платежів і не приймає оплату."}
            </p>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {"Покроковий порядок оплати:"}
            </p>
            <ol className="mt-2 flex flex-col gap-2 pl-5">
              {[
                "Перейдіть до розділу «Підписка» на головній сторінці сайту (розрахуй-вяжи.com/#pricing).",
                "Оберіть тарифний план (6 місяців, Річна або Назавжди).",
                "Натисніть кнопку «Придбати підписку».",
                "На сторінці оплати платіжного сервісу Hutko (hutko.org) введіть email та платіжні дані картки.",
                "Підтримуються: Visa, Mastercard, Apple Pay, Google Pay.",
                "Після успішної оплати підтвердження надходить на вказаний email, а преміум-доступ активується в додатку автоматично протягом 5–10 хвилин.",
              ].map((item, i) => (
                <li key={i} className="list-decimal text-sm text-muted-foreground">
                  {item}
                </li>
              ))}
            </ol>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              {"Підписка НЕ продовжується автоматично. Після закінчення оплаченого терміну жодних списань не відбувається — для продовження доступу необхідно самостійно здійснити нову оплату на сайті."}
            </p>

            <h3 className="mt-4 text-base font-semibold text-foreground">
              {"4.3. Скасування підписки"}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {"Підписка продовжується автоматично після закінчення оплаченого терміну шляхом рекурентного списання з картки. Щоб скасувати автоматичне продовження, зверніться до служби підтримки до дати наступного списання."}
            </p>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {"Якщо ви бажаєте достроково припинити підписку або маєте питання щодо управління своїм акаунтом, зверніться до служби підтримки:"}
            </p>
            <div className="mt-3 rounded-xl border border-border bg-secondary/30 p-4">
              <p className="text-sm text-muted-foreground">
                {"Email: "}
                <a
                  href="mailto:craftappmobile@gmail.com"
                  className="font-medium text-primary underline-offset-2 hover:underline"
                >
                  {"craftappmobile@gmail.com"}
                </a>
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                {"Термін розгляду звернення: до 14 календарних днів."}
              </p>
            </div>

            <h3 className="mt-4 text-base font-semibold text-foreground">
              {"4.4. Повернення коштів"}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {"Умови та порядок повернення коштів описані в окремому документі — "}
              <a href="/refund" className="font-medium text-primary underline-offset-2 hover:underline">
                {"Політика повернення коштів"}
              </a>
              {". Для подання заяви на повернення надішліть звернення на craftappmobile@gmail.com із зазначенням email, дати оплати та причини звернення. Повернення здійснюється тим самим способом, яким було проведено оплату, через платіжний сервіс Hutko."}
            </p>

            <h3 className="mt-4 text-base font-semibold text-foreground">
              {"4.5. Зміна цін"}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {"Ми залишаємо за собою право змінювати ціни з попереднім повідомленням на сайті. Зміни цін не впливають на вже оплачені та активні підписки."}
            </p>
          </section>

          {/* 5. Правила використання */}
          <section>
            <h2 className="font-serif text-xl font-semibold text-foreground sm:text-2xl">
              {"5. Правила використання"}
            </h2>

            <h3 className="mt-4 text-base font-semibold text-foreground">
              {"5.1. Дозволене використання"}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {"Ви можете використовувати Додаток ВИКЛЮЧНО для:"}
            </p>
            <ul className="mt-2 flex flex-col gap-1.5 pl-5">
              {[
                "Особистих некомерційних цілей",
                "Розрахунків для власних проєктів в'язання",
                "Обміну досвідом у спільноті",
              ].map((item, i) => (
                <li key={i} className="list-disc text-sm text-muted-foreground">
                  {item}
                </li>
              ))}
            </ul>

            <h3 className="mt-4 text-base font-semibold text-foreground">
              {"5.2. Заборонене використання"}
            </h3>
            <p className="mt-2 text-sm font-semibold leading-relaxed text-foreground">
              {"ВАМ ЗАБОРОНЕНО:"}
            </p>
            <ul className="mt-2 flex flex-col gap-1.5 pl-5">
              {[
                "Використовувати Додаток для комерційних цілей без дозволу",
                "Копіювати, модифікувати або поширювати Додаток",
                "Зламувати або обходити захист Додатку",
                "Використовувати автоматизовані засоби для доступу",
                "Публікувати незаконний або образливий контент",
                "Порушувати права інших користувачів",
                "Поширювати шкідливе програмне забезпечення",
              ].map((item, i) => (
                <li key={i} className="list-disc text-sm text-muted-foreground">
                  {item}
                </li>
              ))}
            </ul>
          </section>

          {/* 6. Відповідальність та застереження */}
          <section>
            <h2 className="font-serif text-xl font-semibold text-foreground sm:text-2xl">
              {"6. Відповідальність та застереження"}
            </h2>

            <h3 className="mt-4 text-base font-semibold text-foreground">
              {"6.1. Відмова від гарантій"}
            </h3>
            <div className="mt-2 rounded-xl border border-border bg-secondary/30 p-4">
              <p className="text-sm font-semibold leading-relaxed text-foreground">
                {"ДОДАТОК НАДАЄТЬСЯ \"ЯК Є\" БЕЗ БУДЬ-ЯКИХ ГАРАНТІЙ. МИ НЕ ГАРАНТУЄМО:"}
              </p>
              <ul className="mt-2 flex flex-col gap-1.5 pl-5">
                {[
                  "Безперебійну роботу Додатку",
                  "Відсутність помилок або вразливостей",
                  "Точність розрахунків",
                  "Збереження ваших даних",
                  "Сумісність з вашим пристроєм",
                  "Відповідність вашим очікуванням",
                ].map((item, i) => (
                  <li key={i} className="list-disc text-sm text-muted-foreground">
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <h3 className="mt-4 text-base font-semibold text-foreground">
              {"6.2. Обмеження відповідальності"}
            </h3>
            <p className="mt-2 text-sm font-semibold leading-relaxed text-foreground">
              {"МИ НЕ НЕСЕМО ВІДПОВІДАЛЬНОСТІ за:"}
            </p>
            <ul className="mt-2 flex flex-col gap-1.5 pl-5">
              {[
                "Будь-які прямі або непрямі збитки",
                "Втрату даних або прибутку",
                "Помилки в розрахунках",
                "Технічні збої або недоступність",
                "Дії третіх осіб",
                "Порушення авторських прав користувачами",
              ].map((item, i) => (
                <li key={i} className="list-disc text-sm text-muted-foreground">
                  {item}
                </li>
              ))}
            </ul>

            <h3 className="mt-4 text-base font-semibold text-foreground">
              {"6.3. Застереження щодо розрахунків"}
            </h3>
            <div className="mt-2 rounded-xl border-2 border-destructive/30 bg-destructive/5 p-4">
              <p className="text-sm font-semibold leading-relaxed text-foreground">
                {"ВАЖЛИВО: Розрахунки в Додатку є ОРІЄНТОВНИМИ та можуть містити помилки. Ви ПОВНІСТЮ НЕСЕТЕ ВІДПОВІДАЛЬНІСТЬ за перевірку та використання результатів розрахунків. Ми НЕ ГАРАНТУЄМО точність, повноту або придатність розрахунків для ваших цілей."}
              </p>
            </div>
          </section>

          {/* 7. Відповідальність користувача */}
          <section>
            <h2 className="font-serif text-xl font-semibold text-foreground sm:text-2xl">
              {"7. Відповідальність користувача"}
            </h2>

            <h3 className="mt-4 text-base font-semibold text-foreground">
              {"7.1. Загальна відповідальність"}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {"Користувач ПОВНІСТЮ НЕСЕТЕ ВІДПОВІДАЛЬНІСТЬ за:"}
            </p>
            <ul className="mt-2 flex flex-col gap-1.5 pl-5">
              {[
                "Всі дії в Додатку",
                "Контент, який публікує",
                "Дотримання цих Умов",
                "Дотримання законодавства",
                "Наслідки використання Додатку",
              ].map((item, i) => (
                <li key={i} className="list-disc text-sm text-muted-foreground">
                  {item}
                </li>
              ))}
            </ul>

            <h3 className="mt-4 text-base font-semibold text-foreground">
              {"7.2. Відповідальність за дані"}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {"Користувач несе відповідальність за:"}
            </p>
            <ul className="mt-2 flex flex-col gap-1.5 pl-5">
              {[
                "Точність наданої інформації",
                "Законність публікованого контенту",
                "Дотримання авторських прав",
                "Захист особистих даних",
                "Створення резервних копій",
              ].map((item, i) => (
                <li key={i} className="list-disc text-sm text-muted-foreground">
                  {item}
                </li>
              ))}
            </ul>

            <h3 className="mt-4 text-base font-semibold text-foreground">
              {"7.3. Відповідальність за контент"}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {"Публікуючи контент у спільноті, ви:"}
            </p>
            <ul className="mt-2 flex flex-col gap-1.5 pl-5">
              {[
                "Гарантуєте, що маєте всі необхідні права",
                "Надаєте нам ліцензію на використання контенту",
                "Несете відповідальність за порушення прав третіх осіб",
                "Погоджуєтесь, що контент може бути видалений без пояснень",
              ].map((item, i) => (
                <li key={i} className="list-disc text-sm text-muted-foreground">
                  {item}
                </li>
              ))}
            </ul>

            <h3 className="mt-4 text-base font-semibold text-foreground">
              {"7.4. Відповідальність за безпеку"}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {"Користувач зобов'язаний:"}
            </p>
            <ul className="mt-2 flex flex-col gap-1.5 pl-5">
              {[
                "Використовувати надійний пароль",
                "Не передавати доступ третім особам",
                "Захищати свій пристрій",
                "Негайно повідомляти про інциденти безпеки",
              ].map((item, i) => (
                <li key={i} className="list-disc text-sm text-muted-foreground">
                  {item}
                </li>
              ))}
            </ul>

            <h3 className="mt-4 text-base font-semibold text-foreground">
              {"7.5. Відповідальність за порушення"}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {"У разі порушення цих Умов, користувач:"}
            </p>
            <ul className="mt-2 flex flex-col gap-1.5 pl-5">
              {[
                "Несе повну відповідальність за наслідки",
                "Зобов'язаний відшкодувати всі збитки",
                "Може бути заблокований без попередження",
                "Не має права на повернення коштів",
              ].map((item, i) => (
                <li key={i} className="list-disc text-sm text-muted-foreground">
                  {item}
                </li>
              ))}
            </ul>
          </section>

          {/* 8. Обмеження використання */}
          <section>
            <h2 className="font-serif text-xl font-semibold text-foreground sm:text-2xl">
              {"8. Обмеження використання"}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              {"Ми залишаємо за собою право:"}
            </p>
            <ul className="mt-2 flex flex-col gap-1.5 pl-5">
              {[
                "Обмежити або припинити доступ до Додатку",
                "Видалити будь-який контент без пояснень",
                "Змінити або припинити будь-які функції",
                "Відмовити в обслуговуванні будь-кому",
                "Заблокувати акаунт за порушення Умов",
              ].map((item, i) => (
                <li key={i} className="list-disc text-sm text-muted-foreground">
                  {item}
                </li>
              ))}
            </ul>
          </section>

          {/* 9. Припинення доступу */}
          <section>
            <h2 className="font-serif text-xl font-semibold text-foreground sm:text-2xl">
              {"9. Припинення доступу"}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              {"Ми можемо припинити ваш доступ до Додатку:"}
            </p>
            <ul className="mt-2 flex flex-col gap-1.5 pl-5">
              {[
                "БЕЗ попередження",
                "БЕЗ пояснення причин",
                "БЕЗ повернення коштів",
                "У будь-який час на наш розсуд",
              ].map((item, i) => (
                <li key={i} className="list-disc text-sm text-muted-foreground">
                  {item}
                </li>
              ))}
            </ul>
          </section>

          {/* 10. Інтелектуальна власність */}
          <section>
            <h2 className="font-serif text-xl font-semibold text-foreground sm:text-2xl">
              {"10. Інтелектуальна власність"}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              {"Всі права на Додаток, включаючи код, дизайн, логотипи, контент, належать нам або нашим ліцензіарам. Ви НЕ МАЄТЕ ПРАВА:"}
            </p>
            <ul className="mt-2 flex flex-col gap-1.5 pl-5">
              {[
                "Копіювати або модифікувати Додаток",
                "Декомпілювати або зламувати Додаток",
                "Використовувати наші торгові марки",
                "Створювати похідні роботи",
              ].map((item, i) => (
                <li key={i} className="list-disc text-sm text-muted-foreground">
                  {item}
                </li>
              ))}
            </ul>
          </section>

          {/* 11. Застосовне право */}
          <section>
            <h2 className="font-serif text-xl font-semibold text-foreground sm:text-2xl">
              {"11. Застосовне право"}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              {"Ці Умови регулюються законодавством України. Всі спори вирішуються в судовому порядку за місцем знаходження розробника."}
            </p>
          </section>

          {/* 12. Зміни в Умовах */}
          <section>
            <h2 className="font-serif text-xl font-semibold text-foreground sm:text-2xl">
              {"12. Зміни в Умовах"}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              {"Ми можемо змінювати ці Умови в будь-який час БЕЗ попереднього повідомлення. Продовження використання Додатку після змін означає прийняття нових Умов. Дата останнього оновлення вказана на початку документу."}
            </p>
          </section>

          {/* 13. Відмова від гарантій (підсумок) */}
          <section>
            <h2 className="font-serif text-xl font-semibold text-foreground sm:text-2xl">
              {"13. Відмова від гарантій (підсумок)"}
            </h2>
            <div className="mt-3 rounded-xl border-2 border-destructive/30 bg-destructive/5 p-5">
              <p className="text-sm font-semibold leading-relaxed text-foreground">
                {"ВИКОРИСТОВУЮЧИ ДОДАТОК, ВИ ПРИЙМАЄТЕ ВСІ РИЗИКИ. МИ НЕ НЕСЕМО ЖОДНОЇ ВІДПОВІДАЛЬНОСТІ за будь-які збитки, втрати або проблеми, пов'язані з використанням Додатку."}
              </p>
              <p className="mt-3 text-sm font-bold leading-relaxed text-foreground">
                {"ЯКЩО ВИ НЕ ЗГОДНІ З ЦИМИ УМОВАМИ, НЕ ВИКОРИСТОВУЙТЕ ДОДАТОК."}
              </p>
            </div>
          </section>

          {/* 14. Контакти */}
          <section>
            <h2 className="font-serif text-xl font-semibold text-foreground sm:text-2xl">
              {"14. Контакти"}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              {"Послуги надаються: ФОП Дідух Роман Дмитрович"}
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              {"ЄДРПОУ: 3993408236"}
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              {"Юридична адреса: Україна, 29021, Хмельницька обл., Хмельницький р-н, місто Хмельницький, вул. Тичини, будинок 2/2"}
            </p>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              {"Якщо у вас є питання щодо цих Умов використання, зв'яжіться з нами:"}
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              {"Email: "}
              <a
                href="mailto:craftappmobile@gmail.com"
                className="font-medium text-primary underline-offset-2 hover:underline"
              >
                {"craftappmobile@gmail.com"}
              </a>
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              {"Телефон: "}
              <a
                href="tel:+380952728168"
                className="font-medium text-primary underline-offset-2 hover:underline"
              >
                {"+380 95 272 81 68"}
              </a>
            </p>
            <p className="mt-3 text-sm text-muted-foreground">
              {"Ми розглянемо ваш запит протягом 30 днів."}
            </p>
          </section>
        </div>

        {/* Back link */}
        <div className="mt-16 border-t border-border pt-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-primary transition-colors hover:text-primary/80"
          >
            <ArrowLeft className="h-4 w-4" />
            {"Повернутися на головну"}
          </Link>
        </div>
      </main>
    </div>
  )
}
