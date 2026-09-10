import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { requireAdmin } from '@/lib/archive'

export async function POST(request: NextRequest) {
  if (!(await requireAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await request.json()
  if (!body.manuscript_id || !body.url || !body.kind) return NextResponse.json({ error: 'Manuscript, URL, and kind are required' }, { status: 400 })
  const { data, error } = await createAdminClient().from('manuscript_media').insert({ manuscript_id: body.manuscript_id, kind: body.kind, title: body.title ?? null, url: body.url, alt_text: body.alt_text ?? null, mime_type: body.mime_type ?? null }).select().single()
  if (error) return NextResponse.json({ error: 'Failed to attach media' }, { status: 400 })
  return NextResponse.json({ success: true, data }, { status: 201 })
}
