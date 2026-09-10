import { createClient } from '@/lib/supabase/server'

export type ArchiveManuscript = {
  id: string
  slug: string
  title: string
  subtitle: string | null
  author: string
  year: number | null
  category: string
  description: string | null
  cover_image_url: string | null
  source_url: string | null
  status: 'draft' | 'published' | 'archived'
  featured: boolean
  sort_order: number
  manuscript_sections?: { id: string; heading: string | null; content: string; ocr_text: string | null; section_order: number }[]
  manuscript_media?: { id: string; kind: string; title: string | null; url: string; alt_text: string | null; mime_type: string | null; sort_order: number }[]
}

export async function listPublishedManuscripts(query?: string, category?: string) {
  const supabase = await createClient()
  let request = supabase.from('manuscripts').select('*, manuscript_sections(*), manuscript_media(*)').eq('status', 'published').order('featured', { ascending: false }).order('sort_order').order('created_at', { ascending: false })
  if (query) request = request.or(`title.ilike.%${query}%,subtitle.ilike.%${query}%,description.ilike.%${query}%`)
  if (category && category !== 'all') request = request.eq('category', category)
  const { data, error } = await request
  if (error) throw error
  return (data ?? []) as ArchiveManuscript[]
}

export async function getPublishedManuscript(slug: string) {
  const supabase = await createClient()
  const { data, error } = await supabase.from('manuscripts').select('*, manuscript_sections(*), manuscript_media(*)').eq('slug', slug).eq('status', 'published').maybeSingle()
  if (error) throw error
  return data as ArchiveManuscript | null
}

export function isAdminEmail(email?: string | null) {
  const allowlist = (process.env.ADMIN_EMAIL_ALLOWLIST ?? '').split(',').map((value) => value.trim().toLowerCase()).filter(Boolean)
  return Boolean(email && allowlist.includes(email.toLowerCase()))
}

export async function requireAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || !isAdminEmail(user.email)) return null
  return user
}
