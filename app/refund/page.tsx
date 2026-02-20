import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft } from "lucide-react"

export const metadata: Metadata = {
  title: "Умови повернення коштів — Розрахуй і В'яжи",
  description:
    "Умови повернення коштів за підписку на мобільний додаток Розрахуй і В'яжи відповідно до законодавства України.",
}

export default function RefundPage() {
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
          {"Умови повернення коштів"}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {"Дата останнього оновлення: 20 лютого 2026 року"}
        </p>

        {/* Important notice */}
        <div className="mt-8 rounded-xl border-2 border-primary/30 bg-primary/5 p-5">
          <p className="text-sm font-semibold leading-relaxed text-foreground">
            {"Ця політика повернення коштів розроблена відповідно до Закону України «Про захист прав споживачів» № 3153-IX від 10.06.2023 р. та Закону України «Про цифровий контент та цифрові послуги» № 3321-IX від 10.08.2023 р."}
          </p>
        </div>

        <div className="prose-section mt-10 flex flex-col gap-10">
          {/* 1. Загальні положення */}
          <section>
            <h2 className="font-serif text-xl font-semibold text-foreground sm:text-2xl">
              {"1. Загальні положення"}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              {"Ці Умови повернення коштів регулюють порядок та умови повернення коштів за підписку на мобільний додаток «Розрахуй і В'яжи» (далі — «Додаток»). Придбання підписки через вебсайт або мобільний додаток є дистанційним договором у розумінні законодавства України."}
            </p>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {"Оплачуючи підписку, ви підтверджуєте, що ознайомились з цими Умовами повернення коштів та приймаєте їх у повному обсязі."}
            </p>
          </section>

          {/* 2. Право на відмову від договору */}
          <section>
            <h2 className="font-serif text-xl font-semibold text-foreground sm:text-2xl">
              {"2. Право на відмову від договору протягом 14 днів"}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              {"Відповідно до Закону України «Про захист прав споживачів» № 3153-IX, при укладенні дистанційного договору споживач має право відмовитися від договору протягом 14 (чотирнадцяти) календарних днів з моменту його укладення без пояснення причин та без сплати будь-яких додаткових витрат."}
            </p>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {"Для реалізації цього права вам достатньо надіслати нам повідомлення про відмову від договору у будь-якій формі (електронною поштою, поштовим відправленням тощо) до закінчення 14-денного строку."}
            </p>
            <div className="mt-4 rounded-lg bg-muted/50 p-4">
              <p className="text-sm font-medium text-foreground">{"Зверніть увагу:"}</p>
              <ul className="mt-2 flex flex-col gap-1.5">
                <li className="text-sm leading-relaxed text-muted-foreground">
                  {"• 14-денний строк обчислюється з дня укладення договору (оплати підписки)."}
                </li>
                <li className="text-sm leading-relaxed text-muted-foreground">
                  {"• Повернення коштів здійснюється тим самим способом, яким було здійснено оплату."}
                </li>
                <li className="text-sm leading-relaxed text-muted-foreground">
                  {"• Кошти повертаються протягом 14 днів з дня отримання вашої заяви про відмову."}
                </li>
              </ul>
            </div>
          </section>

          {/* 3. Виключення */}
          <section>
            <h2 className="font-serif text-xl font-semibold text-foreground sm:text-2xl">
              {"3. Виключення з права на відмову"}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              {"Відповідно до законодавства України, право на відмову від дистанційного договору НЕ застосовується у випадку, якщо:"}
            </p>
            <ul className="mt-3 flex flex-col gap-2">
              <li className="text-sm leading-relaxed text-muted-foreground">
                {"• Споживач надав попередню явну згоду на початок надання цифрового контенту або цифрової послуги до закінчення 14-денного строку для відмови від договору;"}
              </li>
              <li className="text-sm leading-relaxed text-muted-foreground">
                {"• Споживач був належним чином поінформований про втрату права на відмову від договору у разі надання такої згоди;"}
              </li>
              <li className="text-sm leading-relaxed text-muted-foreground">
                {"• Споживач отримав підтвердження укладення договору із зазначенням інформації про надану згоду та втрату права на відмову."}
              </li>
            </ul>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              {"Якщо всі три умови виконані одночасно, повернення коштів на підставі 14-денного права відмови не здійснюється."}
            </p>
          </section>

          {/* 4. Повернення при невідповідності якості */}
          <section>
            <h2 className="font-serif text-xl font-semibold text-foreground sm:text-2xl">
              {"4. Повернення коштів при невідповідності якості цифрового контенту"}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              {"Відповідно до Закону України «Про цифровий контент та цифрові послуги» № 3321-IX, якщо наданий цифровий контент або цифрова послуга не відповідає встановленим критеріям якості (функціональність, сумісність, доступність, безперервність), споживач має право вимагати:"}
            </p>
            <ul className="mt-3 flex flex-col gap-2">
              <li className="text-sm leading-relaxed text-muted-foreground">
                {"• Приведення цифрового контенту / цифрової послуги у відповідність з договором;"}
              </li>
              <li className="text-sm leading-relaxed text-muted-foreground">
                {"• Пропорційного зменшення ціни;"}
              </li>
              <li className="text-sm leading-relaxed text-muted-foreground">
                {"• Розірвання договору та повного повернення сплачених коштів."}
              </li>
            </ul>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              {"Право на розірвання договору та повернення коштів виникає, якщо: невідповідність є істотною; виконавець не привів цифровий контент/послугу у відповідність у розумний строк; невідповідність виникає повторно, незважаючи на спроби виконавця привести контент у відповідність."}
            </p>
          </section>

          {/* 5. Процедура повернення */}
          <section>
            <h2 className="font-serif text-xl font-semibold text-foreground sm:text-2xl">
              {"5. Процедура подання заяви на повернення коштів"}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              {"Для повернення коштів вам необхідно:"}
            </p>
            <ol className="mt-3 flex flex-col gap-2">
              <li className="text-sm leading-relaxed text-muted-foreground">
                {"1. Надіслати заяву на електронну адресу: "}
                <a
                  href="mailto:craftappmobile@gmail.com"
                  className="font-medium text-primary underline-offset-2 hover:underline"
                >
                  {"craftappmobile@gmail.com"}
                </a>
              </li>
              <li className="text-sm leading-relaxed text-muted-foreground">
                {"2. У заяві вказати: ваше прізвище та ім'я; електронну адресу, яка використовувалась при оплаті; дату оплати підписки; причину повернення (для повернення за невідповідність якості); бажаний спосіб повернення коштів."}
              </li>
              <li className="text-sm leading-relaxed text-muted-foreground">
                {"3. Додати підтвердження оплати (квитанцію, виписку з банку тощо) — за наявності."}
              </li>
            </ol>
          </section>

          {/* 6. Строки повернення */}
          <section>
            <h2 className="font-serif text-xl font-semibold text-foreground sm:text-2xl">
              {"6. Строки повернення коштів"}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              {"Повернення коштів здійснюється у такі строки:"}
            </p>
            <ul className="mt-3 flex flex-col gap-2">
              <li className="text-sm leading-relaxed text-muted-foreground">
                {"• При відмові від договору протягом 14 днів — кошти повертаються не пізніше 14 календарних днів з дня отримання заяви про відмову."}
              </li>
              <li className="text-sm leading-relaxed text-muted-foreground">
                {"• При невідповідності якості — кошти повертаються не пізніше 14 календарних днів з дня прийняття рішення про повернення."}
              </li>
            </ul>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              {"Повернення здійснюється тим самим способом оплати, яким було здійснено платіж, якщо інше не погоджено зі споживачем. Жодні додаткові збори за повернення коштів не стягуються."}
            </p>
          </section>

          {/* 7. Підписки через App Store / Google Play */}
          <section>
            <h2 className="font-serif text-xl font-semibold text-foreground sm:text-2xl">
              {"7. Підписки, придбані через App Store або Google Play"}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              {"Якщо підписка була придбана через Apple App Store або Google Play Store, повернення коштів регулюється політикою відповідної платформи:"}
            </p>
            <ul className="mt-3 flex flex-col gap-2">
              <li className="text-sm leading-relaxed text-muted-foreground">
                {"• "}
                <span className="font-medium text-foreground">{"Apple App Store"}</span>
                {" — подайте запит на повернення через "}
                <a href="https://reportaproblem.apple.com" target="_blank" rel="noopener noreferrer" className="font-medium text-primary underline-offset-2 hover:underline">
                  {"reportaproblem.apple.com"}
                </a>
              </li>
              <li className="text-sm leading-relaxed text-muted-foreground">
                {"• "}
                <span className="font-medium text-foreground">{"Google Play Store"}</span>
                {" — подайте запит через "}
                <a href="https://support.google.com/googleplay/answer/2479637" target="_blank" rel="noopener noreferrer" className="font-medium text-primary underline-offset-2 hover:underline">
                  {"Центр підтримки Google Play"}
                </a>
              </li>
            </ul>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              {"Для скасування підписки, придбаної через магазин додатків, скасуйте її в налаштуваннях вашого пристрою. Ненадання доступу до Додатку після оплати є підставою для повернення коштів незалежно від платформи."}
            </p>
          </section>

          {/* 8. Контактна інформація */}
          <section>
            <h2 className="font-serif text-xl font-semibold text-foreground sm:text-2xl">
              {"8. Контактна інформація"}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              {"З питань повернення коштів зв'яжіться з нами:"}
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
              {"Ми розглянемо ваш запит протягом 14 календарних днів з моменту його отримання."}
            </p>
          </section>

          {/* 9. Нормативна база */}
          <section>
            <h2 className="font-serif text-xl font-semibold text-foreground sm:text-2xl">
              {"9. Нормативна база"}
            </h2>
            <ul className="mt-3 flex flex-col gap-2">
              <li className="text-sm leading-relaxed text-muted-foreground">
                {"• Закон України «Про захист прав споживачів» № 3153-IX від 10.06.2023 р."}
              </li>
              <li className="text-sm leading-relaxed text-muted-foreground">
                {"• Закон України «Про цифровий контент та цифрові послуги» № 3321-IX від 10.08.2023 р."}
              </li>
              <li className="text-sm leading-relaxed text-muted-foreground">
                {"• Закон України «Про електронну комерцію» № 675-VIII від 03.09.2015 р."}
              </li>
              <li className="text-sm leading-relaxed text-muted-foreground">
                {"• Цивільний кодекс України."}
              </li>
            </ul>
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

