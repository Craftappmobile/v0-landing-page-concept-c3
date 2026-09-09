import { yarnConsumptionGroups } from "./yarn-consumption"

export type CalculatorDefinition = {
  slug: string
  title: string
  shortTitle: string
  description: string
  keywords: string[]
  intro: string
  demo?: {
    heading: string
    formula: string
    example: string
    checklist: string[]
    relatedCalculatorSlug?: string
    relatedCalculatorLabel?: string
  }
  usageSteps?: string[]
  faq: Array<{ question: string; answer: string }>
  relatedPosts: string[]
}

type SeoCalculatorInput = {
  slug: string
  shortTitle: string
  topic: string
  formula: string
  example: string
  checklist: string[]
  keywords: string[]
  relatedCalculatorSlug?: string
  relatedCalculatorLabel?: string
}

function createSeoCalculator(input: SeoCalculatorInput): CalculatorDefinition {
  return {
    slug: input.slug,
    title: `${input.shortTitle} онлайн — розрахунок для в'язання`,
    shortTitle: input.shortTitle,
    description: `${input.shortTitle} онлайн: формула для теми «${input.topic}», приклад розрахунку, чекліст мірок і поради для точного в'язання.`,
    keywords: input.keywords,
    intro: `Ця сторінка допомагає швидко виконати ${input.topic}: показує базову формулу, приклад, що саме виміряти та як перевірити результат перед в'язанням.`,
    demo: {
      heading: input.topic,
      formula: input.formula,
      example: input.example,
      checklist: input.checklist,
      relatedCalculatorSlug: input.relatedCalculatorSlug,
      relatedCalculatorLabel: input.relatedCalculatorLabel,
    },
    usageSteps: [
      "Виміряйте потрібну мірку або візьміть її з готового опису.",
      "Переведіть сантиметри в петлі чи ряди через свою щільність після ВТО.",
      "Звірте результат із посадкою виробу та додайте технічний запас, якщо це потрібно.",
    ],
    faq: [
      {
        question: `Чи достатньо цієї формули для теми «${input.topic}»?`,
        answer:
          "Формула дає базовий розрахунок і швидку перевірку. Для точного виробу додатково враховуйте фасон, свободу облягання, візерунок, пряжу й фактичну щільність після прання зразка.",
      },
      {
        question: "Яка мірка найважливіша для перерахунку?",
        answer:
          "Найчастіше ключовою є щільність: петлі в 10 см для ширини та ряди в 10 см для висоти. Без контрольного зразка навіть правильна формула може дати неточну посадку.",
      },
      {
        question: "Що робити, якщо результат виходить дробовим?",
        answer:
          "Округлюйте з урахуванням рапорту візерунка, симетрії та конструкції. Для гумки, аранів, ажуру або секційного візерунка важливо зберегти кратність петель.",
      },
    ],
    relatedPosts: input.relatedPosts ?? ["yak-rozrahuvaty-shchilnist-vyazannya", "yak-rozrahuvaty-vytratu-pryazhi-na-svetr", "mk-vyazhemo-svetr-vid-a-do-ya"],
  }
}

const seoCalculatorPages: CalculatorDefinition[] = [
  createSeoCalculator({ slug: "horlovyna", shortTitle: "Калькулятор горловини", topic: "розрахунок горловини", formula: "Петлі горловини = обхват горловини × петлі в 1 см", example: "Якщо обхват горловини 42 см, а щільність 2,2 п/см, потрібно близько 92 петель. Далі петлі розподіляють на перед, спинку й плечові ділянки.", checklist: ["Виміряйте бажаний обхват горловини.", "Переведіть мірку в петлі через щільність.", "Перевірте кратність гумки або планки."], keywords: ["калькулятор горловини", "розрахунок горловини", "петлі горловини"], relatedCalculatorSlug: "shchilnist", relatedCalculatorLabel: "Калькулятор щільності" }),
  createSeoCalculator({ slug: "rukav", shortTitle: "Калькулятор рукава", topic: "розрахунок рукава", formula: "Прибавки = (петлі біля пройми − петлі манжети) / 2", example: "Манжета 44 п, верх рукава 76 п: потрібно додати 32 п, тобто 16 прибавок з кожного боку по довжині рукава.", checklist: ["Виміряйте зап'ястя, передпліччя й верх руки.", "Переведіть ширини в петлі.", "Розподіліть прибавки рівномірно по рядах."], keywords: ["калькулятор рукава", "розрахунок рукава", "прибавки рукава"], relatedCalculatorSlug: "shchilnist", relatedCalculatorLabel: "Калькулятор щільності" }),
  createSeoCalculator({ slug: "shapka", shortTitle: "Калькулятор шапки", topic: "розрахунок шапки", formula: "Петлі набору = обхват голови × петлі в 1 см − 5–12% на розтяг", example: "Для обхвату 56 см і щільності 2 п/см базово 112 п. Для еластичної шапки можна взяти 100–106 п залежно від гумки.", checklist: ["Виміряйте обхват голови.", "Врахуйте еластичність гумки.", "Перевірте кратність маківки."], keywords: ["калькулятор шапки", "розрахунок шапки", "петлі для шапки"], relatedCalculatorSlug: "shchilnist", relatedCalculatorLabel: "Калькулятор щільності" }),
  createSeoCalculator({ slug: "shkarpetky", shortTitle: "Калькулятор шкарпеток", topic: "розрахунок шкарпеток", formula: "Петлі стопи = обхват стопи × петлі в 1 см", example: "Якщо обхват стопи 22 см, а щільність 3 п/см, стартова кількість — 66 п. Для 4 спиць зручно округлити до 64 або 68 п.", checklist: ["Виміряйте обхват стопи в найширшому місці.", "Перевірте кратність для розподілу на спиці.", "Окремо розрахуйте п'ятку й мисок."], keywords: ["калькулятор шкарпеток", "розрахунок шкарпеток", "петлі для шкарпеток"], relatedCalculatorSlug: "shchilnist", relatedCalculatorLabel: "Калькулятор щільності" }),
  createSeoCalculator({ slug: "kardyhan", shortTitle: "Калькулятор кардигана", topic: "розрахунок кардигана", formula: "Петлі ширини = потрібна ширина деталі × петлі в 1 см", example: "Для полички 24 см при щільності 2,1 п/см потрібно приблизно 50 петель плюс петлі планки.", checklist: ["Окремо порахуйте спинку, полички й планки.", "Додайте свободу облягання.", "Врахуйте застібку та ширину борта."], keywords: ["калькулятор кардигана", "калькулятор кардигану", "розрахунок кардигана", "кардиган розрахунок", "кардиган спицями"], relatedCalculatorSlug: "vytrata", relatedCalculatorLabel: "Калькулятор витрати пряжі" }),
  createSeoCalculator({ slug: "dytyachyy", shortTitle: "Калькулятор дитячого виробу", topic: "розрахунок дитячого виробу", formula: "Петлі = мірка дитини × щільність; витрата = базова витрата + 10% запас", example: "Для обхвату грудей 56 см і щільності 2 п/см потрібно близько 112 петель на повний обхват, якщо конструкція в'яжеться по колу.", checklist: ["Орієнтуйтесь на реальні мірки, а не тільки вік.", "Додавайте запас на ріст.", "Обирайте м'яку пряжу й просту посадку."], keywords: ["дитячий калькулятор в'язання", "дитячий светр розрахунок", "розміри дітей"], relatedCalculatorSlug: "vytrata", relatedCalculatorLabel: "Калькулятор витрати пряжі" }),
  createSeoCalculator({ slug: "sharf", shortTitle: "Калькулятор шарфа", topic: "розрахунок шарфа", formula: "Петлі ширини = ширина шарфа × петлі в 1 см", example: "Для шарфа 28 см при щільності 1,8 п/см потрібно 50 петель. Для резинки 2×2 краще округлити до кратності 4.", checklist: ["Оберіть ширину й довжину шарфа.", "Перевірте кратність візерунка.", "Розрахуйте витрату за метражем пряжі."], keywords: ["калькулятор шарфа", "розрахунок шарфа", "скільки петель на шарф"], relatedCalculatorSlug: "skladannya", relatedCalculatorLabel: "Калькулятор складання пряжі" }),
  createSeoCalculator({ slug: "zhilet", shortTitle: "Калькулятор жилета", topic: "розрахунок жилета", formula: "Петлі корпусу = обхват грудей × щільність + свобода", example: "Для ОГ 92 см, свободи 8 см і щільності 2 п/см потрібно близько 200 петель по колу.", checklist: ["Порахуйте корпус без рукавів.", "Окремо розрахуйте пройму й горловину.", "Додайте обв'язку країв."], keywords: ["калькулятор жилета", "розрахунок жилета", "жилет спицями"], relatedCalculatorSlug: "shchilnist", relatedCalculatorLabel: "Калькулятор щільності" }),
  createSeoCalculator({ slug: "azhur", shortTitle: "Калькулятор ажуру", topic: "розрахунок ажурного візерунка", formula: "Петлі набору = рапорт × кількість повторів + петлі симетрії", example: "Рапорт 12 п + 3 п симетрії. Для 8 повторів потрібно 12 × 8 + 3 = 99 петель плюс крайові.", checklist: ["Знайдіть рапорт у схемі.", "Додайте петлі до/після рапорту.", "Перевірте, чи крайові входять в опис."], keywords: ["калькулятор ажуру", "рапорт ажуру", "ажурний візерунок"], relatedCalculatorSlug: "shchilnist", relatedCalculatorLabel: "Калькулятор щільності", relatedPosts: ["yak-rozrahuvaty-azhurnyy-vizerunok", "yak-rozrahuvaty-shchilnist-vyazannya", "yak-rozrahuvaty-vytratu-pryazhi-na-svetr"] }),
  createSeoCalculator({ slug: "petli", shortTitle: "Калькулятор петель", topic: "перерахунок петель", formula: "Петлі = сантиметри × петлі в 1 см", example: "Для ширини 54 см і щільності 2,3 п/см потрібно 124 п. Якщо візерунок кратний 6, округліть до 126 п.", checklist: ["Визначте потрібну ширину.", "Переведіть її через щільність.", "Округліть до кратності візерунка."], keywords: ["калькулятор петель", "перерахунок петель", "скільки набрати петель"], relatedCalculatorSlug: "adaptatsiya", relatedCalculatorLabel: "Калькулятор адаптації МК" }),
  createSeoCalculator({ slug: "dovzhyna", shortTitle: "Калькулятор довжини", topic: "розрахунок довжини у рядах", formula: "Ряди = довжина в см × ряди в 1 см", example: "Для довжини 62 см і щільності 3 р/см потрібно приблизно 186 рядів.", checklist: ["Виміряйте потрібну довжину виробу.", "Переведіть сантиметри в ряди.", "Врахуйте резинку, планку й блокування."], keywords: ["калькулятор довжини", "розрахунок рядів", "довжина виробу"], relatedCalculatorSlug: "shchilnist", relatedCalculatorLabel: "Калькулятор щільності" }),
  createSeoCalculator({ slug: "koketka", shortTitle: "Калькулятор круглої кокетки", topic: "розрахунок кокетки", formula: "Висота кокетки = глибина пройми × рядна щільність", example: "Для кокетки 22 см і щільності 3 р/см потрібно близько 66 рядів до відділення рукавів.", checklist: ["Визначте висоту кокетки.", "Розподіліть прибавки по ярусах.", "Звірте ширину корпусу й рукавів."], keywords: ["калькулятор кокетки", "кругла кокетка", "розрахунок кокетки"], relatedCalculatorSlug: "rahlan", relatedCalculatorLabel: "Калькулятор реглан-погону" }),
  createSeoCalculator({ slug: "svetr", shortTitle: "Калькулятор светра", topic: "розрахунок светра", formula: "Петлі корпусу = (обхват грудей + свобода) × петлі в 1 см", example: "ОГ 96 см, свобода 10 см, щільність 2 п/см: корпус по колу ≈ 212 петель.", checklist: ["Додайте свободу облягання.", "Окремо порахуйте рукави й горловину.", "Перевірте витрату пряжі за розміром."], keywords: ["калькулятор светра", "розрахунок светра", "светр спицями"], relatedCalculatorSlug: "vytrata", relatedCalculatorLabel: "Калькулятор витрати пряжі" }),
  createSeoCalculator({ slug: "zhaket", shortTitle: "Калькулятор жакета", topic: "розрахунок жакета", formula: "Ширина жакета = обхват грудей + свобода + ширина планок", example: "ОГ 94 см, свобода 8 см, планки 6 см: загальна ширина близько 108 см перед перерахунком у петлі.", checklist: ["Порахуйте свободу облягання.", "Додайте планки застібки.", "Окремо перевірте пройму й рукав."], keywords: ["калькулятор жакета", "розрахунок жакета", "жакет спицями"], relatedCalculatorSlug: "vytrata", relatedCalculatorLabel: "Калькулятор витрати пряжі" }),
  createSeoCalculator({ slug: "vizerunky", shortTitle: "Калькулятор візерунків", topic: "розрахунок рапорту візерунка", formula: "Петлі = рапорт × повтори + петлі симетрії", example: "Рапорт 8 п, 11 повторів і 2 п симетрії: 8 × 11 + 2 = 90 петель плюс крайові.", checklist: ["Знайдіть рапорт у схемі.", "Визначте потрібну ширину.", "Округліть кількість повторів без перекосу малюнка."], keywords: ["калькулятор візерунків", "рапорт візерунка", "візерунки спицями"], relatedCalculatorSlug: "petli", relatedCalculatorLabel: "Калькулятор петель" }),
  createSeoCalculator({ slug: "arany", shortTitle: "Калькулятор аранів", topic: "розрахунок аранів і кіс", formula: "Петлі полотна = базова ширина × щільність + запас на стягування", example: "Якщо коси стягують полотно на 15%, для ширини 50 см варто закласти не 100 п, а приблизно 115 п при щільності 2 п/см.", checklist: ["Зв'яжіть зразок саме з аранами.", "Порівняйте ширину до й після ВТО.", "Додайте петлі на стягування кіс."], keywords: ["калькулятор аранів", "розрахунок кіс", "арани спицями"], relatedCalculatorSlug: "shchilnist", relatedCalculatorLabel: "Калькулятор щільності", relatedPosts: ["yak-rozrahuvaty-svetr-z-kosamy", "yak-rozrahuvaty-shchilnist-vyazannya", "yak-rozrahuvaty-vytratu-pryazhi-na-svetr"] }),
  createSeoCalculator({ slug: "humka", shortTitle: "Калькулятор гумки", topic: "розрахунок гумки", formula: "Петлі гумки = потрібна ширина × щільність гумки з урахуванням розтягу", example: "Для манжети 20 см і гумки 2×2 з щільністю 2,4 п/см потрібно 48 петель, що вже кратно 4.", checklist: ["Міряйте щільність саме в гумці.", "Перевіряйте кратність 1×1, 2×2 або 3×3.", "Враховуйте еластичність і посадку."], keywords: ["калькулятор гумки", "гумка 2х2", "розрахунок гумки"], relatedCalculatorSlug: "shchilnist", relatedCalculatorLabel: "Калькулятор щільності" }),
  createSeoCalculator({ slug: "kruhove", shortTitle: "Калькулятор кругового вʼязання", topic: "кругове в'язання без швів", formula: "Петлі = обхват виробу × щільність", example: "Шапка 54 см при 2,1 п/см: 113 п, краще округлити до 112 або 116 залежно від маківки.", checklist: ["Зніміть мірку по колу.", "Врахуйте розтяг полотна.", "Перевірте кратність убавок."], keywords: ["кругове в'язання", "калькулятор кругового в'язання", "петлі по колу", "кругове вязання", "калькулятор по колу", "в'язання без швів"], relatedCalculatorSlug: "shapka", relatedCalculatorLabel: "Калькулятор шапки" }),
  createSeoCalculator({ slug: "letucha-mysha", shortTitle: "Калькулятор рукава летюча миша", topic: "розрахунок летючої миші", formula: "Ширина полотна = півобхват корпусу + довжина рукава", example: "Півобхват 52 см і рукав 38 см дають 90 см ширини деталі перед перерахунком у петлі.", checklist: ["Визначте бажану ширину від центру до манжети.", "Перевірте драпірування полотна.", "Не робіть манжету занадто широкою."], keywords: ["летюча миша спицями", "калькулятор рукава летюча миша", "розрахунок летюча миша"], relatedCalculatorSlug: "rukav", relatedCalculatorLabel: "Калькулятор рукава" }),
  createSeoCalculator({ slug: "mokher", shortTitle: "Калькулятор мохеру", topic: "розрахунок мохеру", formula: "Вага = потрібний метраж / метраж у 100 г × 100", example: "Якщо потрібно 900 м, а мохер має 420 м/50 г, це 840 м/100 г: 900 / 840 × 100 ≈ 107 г.", checklist: ["Переведіть етикетку в м/100 г.", "Додайте запас на пух і зразок.", "Для подвійної нитки перерахуйте метраж складання."], keywords: ["калькулятор мохеру", "мохер витрата", "розрахунок мохеру"], relatedCalculatorSlug: "skladannya", relatedCalculatorLabel: "Калькулятор складання пряжі" }),
  createSeoCalculator({ slug: "oversayz", shortTitle: "Калькулятор оверсайз", topic: "розрахунок оверсайз виробу", formula: "Робочий обхват = обхват тіла + свобода оверсайз", example: "ОГ 92 см і свобода 24 см: робочий обхват 116 см. При 1,8 п/см це близько 209 петель по колу.", checklist: ["Оберіть бажану свободу 15–30 см.", "Перевірте спущене плече або реглан.", "Пам'ятайте, що витрата пряжі зросте."], keywords: ["калькулятор оверсайз", "оверсайз светр", "свобода облягання"], relatedCalculatorSlug: "vytrata", relatedCalculatorLabel: "Калькулятор витрати пряжі", relatedPosts: ["yak-rozrahuvaty-dzhemper-oversayz", "yak-rozrahuvaty-vytratu-pryazhi-na-svetr", "yak-rozrahuvaty-shchilnist-vyazannya"] }),
  createSeoCalculator({ slug: "pleche", shortTitle: "Калькулятор плеча", topic: "розрахунок плеча", formula: "Петлі плеча = ширина плеча × петлі в 1 см", example: "Для плеча 11 см і щільності 2,2 п/см потрібно приблизно 24 петель на одне плече.", checklist: ["Виміряйте ширину плеча.", "Переведіть у петлі.", "Звірте з горловиною та проймою."], keywords: ["калькулятор плеча", "розрахунок плеча", "плече спицями"], relatedCalculatorSlug: "rahlan", relatedCalculatorLabel: "Калькулятор реглан-погону" }),
  createSeoCalculator({ slug: "rozmiry", shortTitle: "Калькулятор розмірів", topic: "перерахунок розмірів", formula: "Петлі розміру = мірка розміру × щільність", example: "Якщо потрібна ширина 50 см, а щільність 2 п/см, деталь має мати близько 100 петель без урахування планок.", checklist: ["Працюйте з реальними мірками.", "Додавайте свободу облягання.", "Звіряйте довжини у рядах."], keywords: ["калькулятор розмірів", "розміри в'язання", "перерахунок розміру"], relatedCalculatorSlug: "adaptatsiya", relatedCalculatorLabel: "Калькулятор адаптації МК" }),
  createSeoCalculator({ slug: "sektsiyna", shortTitle: "Калькулятор секційної пряжі", topic: "розрахунок секційної пряжі", formula: "Повтор секції ≈ довжина кольорової ділянки / витрата метра на ряд", example: "Якщо секція 12 м, а один ряд витрачає 2 м, колір повториться приблизно через 6 рядів.", checklist: ["Виміряйте довжину секції кольору.", "Оцініть витрату на один ряд.", "Зробіть зразок, бо pooling залежить від ширини."], keywords: ["секційна пряжа", "калькулятор секційної пряжі", "pooling пряжа"], relatedCalculatorSlug: "skladannya", relatedCalculatorLabel: "Калькулятор складання пряжі" }),
  createSeoCalculator({ slug: "ubavky", shortTitle: "Калькулятор убавок та добавок", topic: "розрахунок убавок та добавок петель", formula: "Базовий інтервал = N ÷ m (із симетричним розподілом остачі R)", example: "120 петель і треба прибрати 18 п: 120 ÷ 18 = 6 (остача 12). 6 разів крок 6 п. та 12 разів крок 7 п.", checklist: ["Визначте початкову кількість петель N у ряду.", "Визначте кількість потрібних убавок або прибавок m.", "Розрахуйте базовий крок K та залишок R.", "Розподіліть точки симетрично з відступом 2-3 п. від країв."], keywords: ["калькулятор убавок", "розрахунок убавок", "убавки спицями", "добавки петель", "прибавки спицями", "як рівномірно додати петлі"], relatedCalculatorSlug: "petli", relatedCalculatorLabel: "Калькулятор петель", relatedPosts: ["yak-rozrahuvaty-ubavky-ta-dobavky", "yak-rozrahuvaty-petli-dlya-shapky", "yak-rozrahuvaty-rukav-svetra"] }),
  createSeoCalculator({ slug: "vyriz", shortTitle: "Калькулятор V-вирізу", topic: "розрахунок V-подібного вирізу горловини", formula: "Кількість убавок = (Ширина вирізу / 2) × петлі в 1 см", example: "Для вирізу шириною 18 см (половина = 9 см) при щільності 2,2 п/см потрібно зробити 20 убавок по 1 п. з кожного боку.", checklist: ["Визначте бажану глибину V-вирізу від точки сходження до плеча.", "Визначте ширину горловини між внутрішніми краями плечей.", "Зніміть центральну петлю на шпильку перед поділом полотна.", "Розподіліть убавки: у кожному 4-му ряду або чергуванням 2-го і 4-го рядів."], keywords: ["калькулятор вирізу", "v-подібний виріз спицями", "розрахунок вирізу", "v виріз горловини", "убавки v-подібної горловини"], relatedCalculatorSlug: "horlovyna", relatedCalculatorLabel: "Калькулятор горловини", relatedPosts: ["yak-rozrahuvaty-v-podibnyy-vyriz", "yak-rozrahuvaty-horlovynu-svetra", "yak-rozrahuvaty-shchilnist-vyazannya"] }),
  createSeoCalculator({ slug: "dzhemper-kruhlyy", shortTitle: "Калькулятор джемпера по колу", topic: "розрахунок джемпера круговим способом", formula: "Корпус по колу = (обхват грудей + свобода) × щільність", example: "ОГ 90 см, свобода 12 см, щільність 2,1 п/см: потрібно близько 214 петель по колу.", checklist: ["Оберіть свободу облягання.", "Порахуйте корпус по колу.", "Окремо розрахуйте кокетку або реглан."], keywords: ["джемпер круговий", "калькулятор джемпера", "джемпер по колу"], relatedCalculatorSlug: "svetr", relatedCalculatorLabel: "Калькулятор светра" }),
]

export const calculators: CalculatorDefinition[] = [
  {
    slug: "vytrata",
    title: "Калькулятор витрати пряжі онлайн — метри та грами для виробу",
    shortTitle: "Калькулятор витрати пряжі",
    description:
      "Калькулятор витрати пряжі: оберіть виріб, стать або категорію, введіть обхват чи вік дитини та отримайте орієнтовну витрату в метрах або грамах.",
    keywords: ["витрата пряжі", "калькулятор пряжі", "скільки пряжі потрібно", "метраж пряжі"],
    intro:
      "Оберіть категорію, виріб і мірку. Калькулятор підбере орієнтовну витрату за таблицями для жіночих, чоловічих, дитячих виробів, аксесуарів і пледів.",
    usageSteps: [
      "Оберіть категорію виробу та конкретний тип.",
      "Введіть мірку або оберіть готовий розмір.",
      "Отримайте орієнтовну витрату й додайте запас під ваш візерунок.",
    ],
    faq: [
      {
        question: "Чому результат орієнтовний?",
        answer:
          "Витрата залежить від щільності, візерунка, фасону, довжини виробу, складу пряжі та способу в'язання. Таблиця дає базовий діапазон для планування покупки.",
      },
      {
        question: "Чому для гачка витрата більша?",
        answer:
          "Полотно гачком часто щільніше, тому для того самого розміру зазвичай потрібно більше метрів або грамів пряжі.",
      },
      {
        question: "Що робити, якщо мірка між двома діапазонами?",
        answer:
          "Оберіть більший діапазон, особливо якщо плануєте вільну посадку, складний візерунок або хочете мати запас на зразок і зшивання.",
      },
    ],
    relatedPosts: ["yak-rozrahuvaty-vytratu-pryazhi-na-svetr", "top-5-sposobiv-rozrahuvaty-vytratu-pryazhi", "mk-vyazhemo-svetr-vid-a-do-ya"],
  },
  {
    slug: "skladannya",
    title: "Калькулятор складання пряжі та додаткової нитки онлайн",
    shortTitle: "Калькулятор складання пряжі",
    description:
      "Калькулятор складання пряжі: перерахуйте метраж у кілька ниток, вагу основної та додаткової нитки, а також загальний метраж при поєднанні різних пряж.",
    keywords: ["складання пряжі", "додаткова нитка", "метраж пряжі", "розрахунок грамів пряжі"],
    intro:
      "Введіть метраж пряжі, кількість складань і витрату виробу. Калькулятор покаже ефективний метраж, скільки грамів купити та який орієнтовний інструмент підібрати.",
    usageSteps: [
      "Введіть базовий метраж однієї нитки та кількість складань.",
      "Додайте загальну витрату виробу в метрах, щоб отримати потрібну вагу в грамах.",
      "За потреби внесіть метраж додаткової нитки або кілька різних ниток для спільного розрахунку.",
    ],
    faq: [
      {
        question: "Як рахувати однакові нитки у кілька складань?",
        answer:
          "Поділіть базовий метраж однієї нитки на кількість складань: 1500 м/100 г у 3 складання дорівнює приблизно 500 м/100 г.",
      },
      {
        question: "Як зрозуміти, скільки грамів купити?",
        answer:
          "Поділіть загальну витрату виробу в метрах на метраж вашої пряжі в 100 г і помножте на 100. Наприклад, 1500 м / 500 м × 100 = 300 г.",
      },
      {
        question: "Як рахувати різні нитки разом?",
        answer:
          "Для різних ниток використовуйте суму обернених значень: 1/Lзаг = 1/L1 + 1/L2 + ... + 1/Ln. Так отримуємо умовну товщину об'єднаної нитки.",
      },
    ],
    relatedPosts: ["yak-rozrahuvaty-vytratu-pryazhi-na-svetr", "yak-rozrahuvaty-shchilnist-vyazannya", "mk-vyazhemo-svetr-vid-a-do-ya"],
  },
  {
    slug: "shchilnist",
    title: "Калькулятор щільності в'язання онлайн — петлі та ряди на 1 см",
    shortTitle: "Калькулятор щільності в'язання",
    description:
      "Калькулятор щільності в'язання: введіть кількість петель і рядів у 10 см, щоб отримати петлі та ряди на 1 см для точних розрахунків виробу.",
    keywords: ["щільність в'язання", "калькулятор щільності", "петлі на 1 см", "ряди на 1 см"],
    intro:
      "Введіть кількість петель і рядів у зразку 10×10 см. Калькулятор перерахує щільність на 1 см і покаже текстовий результат для подальших розрахунків.",
    usageSteps: [
      "Зв'яжіть і виперіть контрольний зразок 10×10 см.",
      "Введіть кількість петель у 10 см і кількість рядів у 10 см.",
      "Отримайте щільність на 1 см і використовуйте її в розрахунках виробу.",
    ],
    faq: [
      {
        question: "Чому зразок потрібно прати перед вимірюванням?",
        answer:
          "Після прання пряжа може розкритися, сісти або розтягнутися. Саме випраний і висушений зразок дає реальну щільність майбутнього виробу.",
      },
      {
        question: "Чи рахувати крайові петлі у зразку?",
        answer:
          "Краще вимірювати центральну ділянку полотна без крайових петель, бо краї часто деформуються й можуть спотворити результат.",
      },
      {
        question: "Що робити, якщо щільність не збігається з майстер-класом?",
        answer:
          "Можна змінити номер спиць або адаптувати опис під свою щільність за допомогою калькулятора адаптації майстер-класу.",
      },
    ],
    relatedPosts: ["yak-rozrahuvaty-shchilnist-vyazannya", "adaptuvala-radyanskyy-opys", "mk-vyazhemo-svetr-vid-a-do-ya"],
  },
  {
    slug: "adaptatsiya",
    title: "Калькулятор адаптації майстер-класу під вашу щільність",
    shortTitle: "Калькулятор адаптації майстер-класу",
    description:
      "Калькулятор адаптації опису в'язання: перерахуйте кількість петель під свою щільність і визначте загальну витрату пряжі в метрах за даними майстер-класу.",
    keywords: ["адаптація майстер-класу", "перерахунок петель", "щільність в'язання", "витрата пряжі в метрах"],
    intro:
      "Введіть щільність з майстер-класу, свою щільність, кількість петель з опису та дані про пряжу. Калькулятор покаже, скільки петель набрати саме вам і скільки метрів пряжі закладено в описі.",
    usageSteps: [
      "Введіть щільність майстер-класу та вашу щільність у петлях на 10 см.",
      "Додайте кількість петель, яку потрібно набрати за описом.",
      "Введіть витрату пряжі по МК у грамах і метраж цієї пряжі, щоб отримати загальну витрату в метрах.",
    ],
    faq: [
      {
        question: "Чому перерахунок робиться через коефіцієнт щільності?",
        answer:
          "Коефіцієнт показує, наскільки ваша щільність відрізняється від щільності в описі. Якщо у вас менше петель у 10 см, потрібно набирати менше петель для тієї самої ширини.",
      },
      {
        question: "Чи потрібно враховувати ряди?",
        answer:
          "Для набору петель головна горизонтальна щільність — петлі в 10 см. Ряди важливі для висоти виробу, реглану, пройми та довжини деталей.",
      },
      {
        question: "Як використати результат витрати в метрах?",
        answer:
          "Загальна витрата в метрах допомагає підібрати іншу пряжу. Якщо ваша пряжа має інший метраж, переведіть ці метри в грами через калькулятор складання пряжі.",
      },
    ],
    relatedPosts: [
      "yak-adaptuvaty-opys-pid-svoyu-pryazhu",
      "adaptuvala-radyanskyy-opys",
      "yak-rozrahuvaty-shchilnist-vyazannya",
      "yak-rozrahuvaty-vytratu-pryazhi-na-svetr",
    ],
  },
  {
    slug: "rahlan",
    title: "Калькулятор реглан-погону онлайн — горловина, росток і прибавки",
    shortTitle: "Калькулятор реглан-погону",
    description:
      "Калькулятор реглан-погону: розрахуйте стартову горловину, розподіл на перед, спинку і погони, росток, точки розвороту та етапи прибавок до пройми.",
    keywords: ["реглан погон", "калькулятор реглану", "розрахунок ростка", "розподіл горловини", "прибавки реглан"],
    intro:
      "Введіть обхват горловини, обхват грудей, ширину переду та вашу щільність. Калькулятор покаже стартовий розподіл петель, ряди ростка, точки розвороту й орієнтир для двох етапів прибавок.",
    usageSteps: [
      "Введіть обхват горловини, обхват грудей і ширину переду в сантиметрах.",
      "Додайте свою щільність по петлях і рядах після прання зразка.",
      "Отримайте стартовий розподіл горловини, росток, етап 1 прибавок по погону та етап 2 до потрібної висоти пройми.",
    ],
    faq: [
      {
        question: "Чи це точний розрахунок для будь-якого реглан-погону?",
        answer:
          "Це демо-розрахунок для стартового планування. У реальному виробі потрібно враховувати фасон, свободу облягання, глибину горловини, ширину плеча, тип прибавок і вашу щільність після ВТО.",
      },
      {
        question: "Навіщо окремо рахувати росток?",
        answer:
          "Росток піднімає спинку відносно переду, щоб виріб краще сидів на фігурі й не тягнув назад. У калькуляторі висота ростка переводиться в поворотні ряди за вашою рядною щільністю.",
      },
      {
        question: "Що означає формула V = B / 3 + 4?",
        answer:
          "Це орієнтир висоти пройми: B — обхват грудей у сантиметрах. Формула дає базову висоту, яку потім варто коригувати під розмір, посадку й особливості конкретного виробу.",
      },
    ],
    relatedPosts: ["mk-vyazhemo-svetr-vid-a-do-ya", "yak-rozrahuvaty-shchilnist-vyazannya", "adaptuvala-radyanskyy-opys"],
  },
  ...seoCalculatorPages,
]

export const calculatorSlugs = calculators.map((calculator) => calculator.slug)

export function getCalculatorBySlug(slug: string) {
  return calculators.find((calculator) => calculator.slug === slug) || null
}

export function getAllCalculators() {
  return calculators
}

export function getYarnConsumptionGroups() {
  return yarnConsumptionGroups
}

export function getCalculatorForPost(postSlug: string): CalculatorDefinition | null {
  const directMatch = calculators.find((c) => c.relatedPosts && c.relatedPosts.includes(postSlug))
  if (directMatch) return directMatch

  const slugLower = postSlug.toLowerCase()
  if (slugLower.includes("koketka")) return getCalculatorBySlug("koketka")
  if (slugLower.includes("rahlan")) return getCalculatorBySlug("rahlan")
  if (slugLower.includes("shchilnist")) return getCalculatorBySlug("shchilnist")
  if (slugLower.includes("vytrata") || slugLower.includes("skilky")) return getCalculatorBySlug("vytrata")
  if (slugLower.includes("shapka") || slugLower.includes("bini")) return getCalculatorBySlug("shapka")
  if (slugLower.includes("shkarpetky")) return getCalculatorBySlug("shkarpetky")
  if (slugLower.includes("vyriz") || slugLower.includes("v-podibnyy")) return getCalculatorBySlug("vyriz") || getCalculatorBySlug("horlovyna")
  if (slugLower.includes("horlovyna")) return getCalculatorBySlug("horlovyna")
  if (slugLower.includes("rukav")) return getCalculatorBySlug("rukav")
  if (slugLower.includes("kardygan") || slugLower.includes("kardyhan")) return getCalculatorBySlug("kardyhan")
  if (slugLower.includes("adaptatsiya") || slugLower.includes("radyanskyy")) return getCalculatorBySlug("adaptatsiya")
  if (slugLower.includes("mokher")) return getCalculatorBySlug("mokher")
  if (slugLower.includes("arany") || slugLower.includes("kosy")) return getCalculatorBySlug("arany")
  if (slugLower.includes("azhur")) return getCalculatorBySlug("azhur")
  if (slugLower.includes("humka")) return getCalculatorBySlug("humka")
  if (slugLower.includes("letucha-mysha")) return getCalculatorBySlug("letucha-mysha")
  if (slugLower.includes("oversayz")) return getCalculatorBySlug("oversayz")
  if (slugLower.includes("kruhove") || slugLower.includes("krugove")) return getCalculatorBySlug("kruhove") || getCalculatorBySlug("krugove")
  if (slugLower.includes("sektsiyna")) return getCalculatorBySlug("sektsiyna")
  if (slugLower.includes("ubavky") || slugLower.includes("dobavky")) return getCalculatorBySlug("ubavky")
  if (slugLower.includes("dytyachyy") || slugLower.includes("kombinezon")) return getCalculatorBySlug("dytyachyy")
  if (slugLower.includes("svetr") || slugLower.includes("dzhemper")) return getCalculatorBySlug("svetr") || getCalculatorBySlug("rahlan")
  if (slugLower.includes("zhaket")) return getCalculatorBySlug("zhaket")
  if (slugLower.includes("zhilet")) return getCalculatorBySlug("zhilet")
  if (slugLower.includes("sharf") || slugLower.includes("snud")) return getCalculatorBySlug("sharf")
  if (slugLower.includes("skladannya")) return getCalculatorBySlug("skladannya")

  return getCalculatorBySlug("shchilnist")
}