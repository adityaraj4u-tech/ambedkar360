import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { requireAdmin } from '@/lib/archive'

export async function GET(request: NextRequest) {
  const supabase = await createClient()
  const params = request.nextUrl.searchParams
  const query = params.get('q')
  const category = params.get('category')
  const slug = params.get('slug')
  let requestQuery = supabase.from('manuscripts').select('*, manuscript_sections(*), manuscript_media(*)').eq('status', 'published').order('featured', { ascending: false }).order('sort_order')
  if (slug) requestQuery = requestQuery.eq('slug', slug)
  if (query) requestQuery = requestQuery.or(`title.ilike.%${query}%,subtitle.ilike.%${query}%,description.ilike.%${query}%`)
  if (category && category !== 'all') requestQuery = requestQuery.eq('category', category)
  const { data, error } = await requestQuery
  if (error) return NextResponse.json({ error: 'Failed to fetch manuscripts' }, { status: 500 })
  return NextResponse.json({ success: true, data })
}

export async function POST(request: NextRequest) {
  if (!(await requireAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await request.json()
  const supabase = await createClient()
  const { data, error } = await supabase.from('manuscripts').insert({ slug: body.slug, title: body.title, subtitle: body.subtitle ?? null, author: body.author ?? 'Dr. B. R. Ambedkar', year: body.year ?? null, category: body.category ?? 'Writing', description: body.description ?? null, cover_image_url: body.cover_image_url ?? null, source_url: body.source_url ?? null, status: body.status ?? 'draft', featured: Boolean(body.featured), sort_order: body.sort_order ?? 0 }).select().single()
  if (error) return NextResponse.json({ error: 'Failed to create manuscript' }, { status: 400 })
  return NextResponse.json({ success: true, data }, { status: 201 })
}

export async function PATCH(request: NextRequest) {
  if (!(await requireAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await request.json()
  if (!body.id) return NextResponse.json({ error: 'Manuscript id is required' }, { status: 400 })
  const supabase = await createClient()
  const { data, error } = await supabase.from('manuscripts').update(body).eq('id', body.id).select().single()
  if (error) return NextResponse.json({ error: 'Failed to update manuscript' }, { status: 400 })
  return NextResponse.json({ success: true, data })
}

export async function DELETE(request: NextRequest) {
  if (!(await requireAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const id = request.nextUrl.searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'Manuscript id is required' }, { status: 400 })
  const supabase = await createClient()
  const { error } = await supabase.from('manuscripts').delete().eq('id', id)
  if (error) return NextResponse.json({ error: 'Failed to delete manuscript' }, { status: 400 })
  return NextResponse.json({ success: true })
}
