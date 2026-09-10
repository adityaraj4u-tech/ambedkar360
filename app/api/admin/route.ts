import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/archive'

export async function GET() {
  const user = await requireAdmin()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  return NextResponse.json({ authorized: true, email: user.email })
}
