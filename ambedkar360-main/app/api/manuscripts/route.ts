import { NextRequest, NextResponse } from 'next/server'
import { manuscripts } from '@/lib/manuscripts'

export async function GET() {
  try {
    return NextResponse.json({ success: true, data: manuscripts })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch manuscripts' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { id, title, author, year, description, pages, audioUrl, image, duration, confidence, category, tags } = body

    // Validate required fields
    if (!id || !title || !author) {
      return NextResponse.json(
        { error: 'Missing required fields: id, title, author' },
        { status: 400 }
      )
    }

    // Check if manuscript with this ID already exists
    const exists = manuscripts.find((m) => m.id === id)
    if (exists) {
      return NextResponse.json(
        { error: 'Manuscript with this ID already exists' },
        { status: 409 }
      )
    }

    const newManuscript = {
      id,
      title,
      author,
      year: year || new Date().getFullYear(),
      description: description || '',
      pages: pages || 0,
      image: image || '/manuscripts/default.png',
      audioUrl: audioUrl || '',
      duration: duration || '0:00:00',
      confidence: confidence || 0,
      category: category || 'essay',
      tags: tags || [],
    }

    manuscripts.push(newManuscript)

    return NextResponse.json({ success: true, data: newManuscript }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create manuscript' }, { status: 500 })
  }
}
