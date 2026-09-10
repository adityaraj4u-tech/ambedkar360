import { createClient } from '@supabase/supabase-js'

let adminClient: ReturnType<typeof createClient> | undefined

export function createAdminClient() {
  if (!adminClient) {
    const url = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_SECRET_KEY
    if (!url || !key) throw new Error('Supabase server credentials are not configured')
    adminClient = createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } })
  }
  return adminClient
}
