import type { BlogPostSummary } from "./blog"

export type BlogCategory = {
  slug: string
  title: string
  description: string
  intro: string
  calculatorSlugs: string[]
  matches: (post: BlogPostSummary) => boolean
}

function searchText(post: BlogPostSummary) {
  return [post.slug, post.title, post.description, post.category, ...post.keywords].join(" ").toLowerCase()
}

function includesAny(post: BlogPostSummary, terms: string[]) {
  const text = searchText(post)
  return terms.some((term) => text.includes(term.toLowerCase()))
}

export const blogCategories: BlogCategory[] = [
  {
    slug: "rozrahunky",
    title: "Розрахунки для в'язання",
    description: "Формули, таблиці та калькулятори для петель, рядів, щільності, витрати пряжі й адаптації описів.",
    intro: "Добірка матеріалів для тих, хто хоче рахувати в'язання точно: від контрольного зразка до перерахунку майстер-класів під свою пряжу.",
    calculatorSlugs: ["shchilnist", "petli", "dovzhyna", "vytrata", "adaptatsiya"],
    matches: (post) => post.category === "Розрахунки" || includesAny(post, ["розрах", "калькулятор", "петл", "щільн", "витрат"]),
  },
  {
    slug: "reglan",
    title: "Реглан і кокетка",
    description: "Статті про реглан зверху, реглан-погон, росток, круглу кокетку та розподіл прибавок.",
    intro: "Тут зібрані пояснення, схеми й приклади для конструкцій зверху вниз, де важливо правильно розподілити горловину, погони, кокетку та пройму.",
    calculatorSlugs: ["rahlan", "koketka", "horlovyna", "rukav"],
    matches: (post) => includesAny(post, ["реглан", "rahlan", "кокет", "росток", "погон"]),
  },
  {
    slug: "pryazha",
    title: "Пряжа і витрата",
    description: "Як обирати пряжу, рахувати метраж, поєднувати нитки, працювати з мохером і секційною пряжею.",
    intro: "Категорія допомагає зрозуміти, скільки пряжі потрібно, як не помилитися з метражем і як адаптувати виріб під іншу нитку.",
    calculatorSlugs: ["vytrata", "skladannya", "mokher", "sektsiyna"],
    matches: (post) => includesAny(post, ["пряж", "метраж", "мохер", "секційн", "витрат", "нитк"]),
  },
  {
    slug: "shkarpetky",
    title: "Шкарпетки спицями",
    description: "Розрахунок шкарпеток, п'ятки, миска, розмірів стопи та практичні історії про в'язання шкарпеток.",
    intro: "Усе про посадку шкарпеток: скільки набирати петель, як враховувати обхват стопи й де починати мисок.",
    calculatorSlugs: ["shkarpetky", "shchilnist", "vytrata"],
    matches: (post) => includesAny(post, ["шкарпет"]),
  },
  {
    slug: "svetry",
    title: "Светри, кардигани та посадка",
    description: "Гайди про светри, кардигани, рукави, горловину, жакети, жилети та точну посадку виробу.",
    intro: "Ця категорія допоможе порахувати великий виріб від мірок і свободи облягання до рукава, горловини та витрати пряжі.",
    calculatorSlugs: ["svetr", "kardyhan", "rukav", "horlovyna", "vytrata"],
    matches: (post) => includesAny(post, ["светр", "джемпер", "кардиган", "кард", "жакет", "жилет", "рукав", "горлов", "плеч"]),
  },
  {
    slug: "majster-klasy",
    title: "Майстер-класи з в'язання",
    description: "Покрокові майстер-класи: светр від А до Я, шапка-біні, реглан, кардиган, дитячі речі, плед і топи.",
    intro: "Практичні МК із готовою логікою роботи, схемами та підказками, які можна адаптувати під свою щільність і розмір.",
    calculatorSlugs: ["adaptatsiya", "shchilnist", "vytrata", "rahlan"],
    matches: (post) => post.category === "master-class" || post.slug.startsWith("mk-") || includesAny(post, ["майстер-клас", "мк "]),
  },
  {
    slug: "pomylky",
    title: "Типові помилки і кейси",
    description: "Розбір помилок у розмірах, щільності, витраті пряжі та реальні історії, як виправити результат.",
    intro: "Корисні статті для перевірки себе перед стартом: чому виріб не сідає, де губляться петлі, як не перев'язувати зайве.",
    calculatorSlugs: ["shchilnist", "rozmiry", "adaptatsiya", "vytrata"],
    matches: (post) => includesAny(post, ["помил", "заощад", "новач", "розміри", "істор", "кейс"]),
  },
]

export function getAllBlogCategories() {
  return blogCategories
}

export function getBlogCategoryBySlug(slug: string) {
  return blogCategories.find((category) => category.slug === slug) || null
}

export function getPostsForBlogCategory(category: BlogCategory, posts: BlogPostSummary[]) {
  return posts.filter(category.matches)
}