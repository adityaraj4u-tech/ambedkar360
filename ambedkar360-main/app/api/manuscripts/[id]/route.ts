import { NextRequest, NextResponse } from 'next/server'
import { manuscripts } from '@/lib/manuscripts'

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const manuscript = manuscripts.find((m) => m.id === params.id)

    if (!manuscript) {
      return NextResponse.json({ error: 'Manuscript not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true, data: manuscript })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch manuscript' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await req.json()
    const { title, description, audioUrl, image } = body

    // Update manuscript (in production, this would update a database)
    const manuscript = manuscripts.find((m) => m.id === params.id)
    if (!manuscript) {
      return NextResponse.json({ error: 'Manuscript not found' }, { status: 404 })
    }

    // Update fields
    if (title) manuscript.title = title
    if (description) manuscript.description = description
    if (audioUrl) manuscript.audioUrl = audioUrl
    if (image) manuscript.image = image

    return NextResponse.json({ success: true, data: manuscript })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update manuscript' }, { status: 500 })
  }
}
