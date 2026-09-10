import { put, list, del } from '@vercel/blob'
import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/archive'

export async function GET() {
  if (!(await requireAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const blobs = await list()
  return NextResponse.json({ success: true, blobs: blobs.blobs })
}

export async function POST(req: NextRequest) {
  if (!(await requireAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const formData = await req.formData()
  const file = formData.get('file')
  if (!(file instanceof File)) return NextResponse.json({ error: 'No file provided' }, { status: 400 })
  if (file.size > 50 * 1024 * 1024) return NextResponse.json({ error: 'File must be smaller than 50 MB' }, { status: 413 })
  const allowed = file.type.startsWith('audio/') || file.type.startsWith('image/') || file.type === 'application/pdf'
  if (!allowed) return NextResponse.json({ error: 'Only audio, image, and PDF files are supported' }, { status: 415 })
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '-').toLowerCase()
  const blob = await put(`ambedkar-archive/${crypto.randomUUID()}-${safeName}`, file, { access: 'public' })
  return NextResponse.json({ success: true, url: blob.url, fileName: blob.pathname })
}

export async function DELETE(req: NextRequest) {
  if (!(await requireAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { url } = await req.json()
  if (!url) return NextResponse.json({ error: 'No URL provided' }, { status: 400 })
  await del(url)
  return NextResponse.json({ success: true })
}
