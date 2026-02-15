import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

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
    question: "Які калькулятори входять у безкоштовну версію?",
    answer:
      "У безкоштовній версії доступні 5 базових калькуляторів: розрахунок петель, витрати пряжі, зміна щільності, розмір спиць та перерахунок розміру. Для доступу до всіх 30 калькуляторів потрібна Premium-підписка.",
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
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}
