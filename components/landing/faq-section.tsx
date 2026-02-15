import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const calculatorList = [
  {
    group: "Адаптація МК",
    items: ["Адаптація МК"],
  },
  {
    group: "Калькулятор пряжі",
    items: [
      "Витрата пряжі",
      "Розрахунок складань",
      "Розрахунок додаткової нитки",
      "Розрахунок щільності на основі зразка",
    ],
  },
  {
    group: "Калькулятор моделі реглан (класичний)",
    items: [
      "Розрахунок горловини",
      "Розподіл петель на реглан",
      "Довжина регланної лінії",
      "Прибавки реглану",
      "Росток",
      "Коригування розподілу петель відповідно ростка",
      "Точки розвороту при в'язанні ростка",
      "Убавки для формування реглану при в'язанні знизу",
    ],
  },
  {
    group: "Калькулятор петель підрізів",
    items: ["Калькулятор петель підрізів"],
  },
  {
    group: "Калькулятор моделі кругла кокетка",
    items: ["Висота круглої кокетки", "Розрахунок прибавок"],
  },
  {
    group: "Калькулятор убавок і прибавок рукава",
    items: ["Калькулятор убавок рукава", "Калькулятор прибавок рукава"],
  },
  {
    group: "Калькулятор моделі реглан-погон",
    items: ["Реглан-погон"],
  },
  {
    group: "Калькулятор моделі спущене плече",
    items: [
      "Скільки набрати петель",
      "Ширина горловини",
      "Ширина плеча та скоси",
      "Поглиблення горловини",
    ],
  },
  {
    group: "Калькулятор V-горловина",
    items: ["Убавки V-горловини", "Прибавки V-горловини"],
  },
  {
    group: "Калькулятор петель для аксесуарів",
    items: ["Шапка", "Шарф", "Шкарпетки", "Рукавички", "Плед"],
  },
]

const faqItems = [
  {
    question: "Чи працює додаток без інтернету?",
    answer:
      "Так! Усі калькулятори, база пряжі та ваші проєкти доступні в офлайн-режимі. Синхронізація відбудеться автоматично, коли з'явиться з'єднання.",
  },
  {
    question: "Чи можу я скасувати підписку?",
    answer:
      "Звісно! Ви можете скасувати підписку в будь-який момент через налаштування додатку. Доступ до Premium-функцій збережеться до кінця оплаченого періоду.",
  },
  {
    question: "Які калькулятори входять у додаток?",
    answer: "CALCULATOR_LIST",
  },
  {
    question: "Як працює хмарна синхронізація?",
    answer:
      "Ваші проєкти, розрахунки та база пряжі автоматично синхронізуються між усіма вашими пристроями. Увійдіть у свій акаунт на будь-якому телефоні або планшеті — і все буде на місці.",
  },
  {
    question: "Чи можу я імпортувати свої старі розрахунки?",
    answer:
      "Так, додаток підтримує імпорт даних із CSV-файлів та Excel-таблиць. Також є ручне введення для швидкого перенесення невеликої кількості проєктів.",
  },
  {
    question: "Для яких видів в'язання підходить додаток?",
    answer:
      "Додаток підходить для в'язання спицями та гачком. Калькулятори охоплюють найпопулярніші техніки: реглан, кокетку, горловину, рукав, а також різні типи виробів від шапок до светрів.",
  },
]

export function FaqSection() {
  return (
    <section id="faq" className="bg-background py-16 lg:py-24">
      <div className="mx-auto max-w-3xl px-4 lg:px-8">
        <div className="mb-12 text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary">
            {"FAQ"}
          </p>
          <h2 className="mt-3 font-serif text-3xl tracking-tight text-foreground sm:text-4xl text-balance">
            {"Часті запитання"}
          </h2>
        </div>

        <Accordion type="single" collapsible className="w-full">
          {faqItems.map((item, i) => (
            <AccordionItem key={i} value={`item-${i}`}>
              <AccordionTrigger className="text-left text-base font-medium">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">
                {item.answer === "CALCULATOR_LIST" ? (
                  <div className="flex flex-col gap-4">
                    <p>
                      {"У Premium-підписці доступні 30 калькуляторів, згрупованих за категоріями:"}
                    </p>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {calculatorList.map((cat, ci) => (
                        <div
                          key={ci}
                          className="rounded-lg border border-border bg-secondary/30 p-3"
                        >
                          <p className="mb-1.5 text-sm font-semibold text-foreground">
                            {cat.group}
                          </p>
                          <ul className="flex flex-col gap-1">
                            {cat.items.map((calc, ki) => (
                              <li
                                key={ki}
                                className="flex items-start gap-2 text-sm text-muted-foreground"
                              >
                                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary/60" />
                                {calc}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  item.answer
                )}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}
