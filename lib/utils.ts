import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Утиліта для умовного об'єднання CSS класів Tailwind.
 * Використовує `clsx` для умовної логіки та `tailwind-merge` для
 * розв'язання конфліктів між класами (наприклад, `p-2` і `p-4`).
 *
 * @param inputs - Один або кілька аргументів: рядки, об'єкти, масиви класів
 * @returns Рядок з об'єднаними CSS класами без конфліктів
 *
 * @example
 * cn('px-2 py-1', 'px-4')           // → 'py-1 px-4'
 * cn('text-sm', condition && 'font-bold') // → умовний клас
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
