/**
 * @module supabase
 * Налаштування клієнтів Supabase для проєкту "Розрахуй і В'яжи".
 *
 * Два клієнти:
 * - `supabase` — публічний, безпечний для браузера (anon key, підлягає RLS)
 * - `createAdminClient()` — серверний, обходить RLS (service_role key)
 */
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

/**
 * Публічний Supabase-клієнт для використання в браузері.
 * Використовує `anon` ключ — доступ обмежений Row Level Security (RLS).
 * Безпечно експортувати в клієнтські компоненти.
 *
 * @example
 * import { supabase } from '@/lib/supabase'
 * const { data } = await supabase.from('subscriptions').select('*')
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

/**
 * Створює адміністративний Supabase-клієнт для серверного коду.
 * Використовує `service_role` ключ — обходить RLS повністю.
 *
 * ⚠️ **ТІЛЬКИ для серверного коду** (API routes, Supabase Edge Functions).
 * Ніколи не використовувати в клієнтських компонентах або передавати в браузер!
 *
 * Типові сценарії використання:
 * - Створення нового користувача після підтвердження платежу (`auth.admin.createUser`)
 * - Запис у таблиці `subscriptions`, `profiles`, `payment_logs` минаючи RLS
 *
 * @returns SupabaseClient з повними адміністративними правами
 * @throws {Error} Якщо змінна `SUPABASE_SERVICE_ROLE_KEY` не встановлена
 *
 * @example
 * // app/api/payment/webhook/route.ts
 * import { createAdminClient } from '@/lib/supabase'
 * const adminSupabase = createAdminClient()
 * await adminSupabase.auth.admin.createUser({ email, password })
 */
export function createAdminClient() {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!serviceRoleKey) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY is not set')
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}

