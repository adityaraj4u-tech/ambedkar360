'use client'

import { use, useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, BookOpen, FileText, MessageCircle, Share2, Sparkles } from 'lucide-react'
import type { ArchiveManuscript } from '@/lib/archive'
import { ArchiveShell } from '@/components/archive-shell'

export default function ManuscriptPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [manuscript, setManuscript] = useState<ArchiveManuscript | null>(null)
  const [loading, setLoading] = useState(true)
  const [chatOpen, setChatOpen] = useState(false)
  const [summarized, setSummarized] = useState(false)

  useEffect(() => {
    fetch(`/api/manuscripts?slug=${encodeURIComponent(id)}`)
      .then((response) => response.json())
      .then((payload) => setManuscript(payload.data?.[0] ?? null))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <main className="flex min-h-screen items-center justify-center bg-background text-sm text-muted-foreground">Loading manuscript...</main>
  if (!manuscript) return <main className="min-h-screen bg-background p-8 text-center"><h1 className="text-2xl font-semibold">Manuscript not found</h1><Link href="/archive" className="mt-4 inline-block text-accent hover:underline">Return to archive</Link></main>

  const sections = manuscript.manuscript_sections ?? []
  const text = sections.length ? sections.map((section) => section.content).join('\n\n') : manuscript.description ?? 'No transcription has been added to this manuscript yet.'

  return <ArchiveShell><main className="min-h-screen bg-background text-foreground"><header className="mx-auto flex max-w-[1440px] items-center justify-between border-b border-foreground/15 px-5 py-5 lg:px-10"><Link href="/archive" className="flex items-center gap-2 text-sm font-semibold hover:text-accent"><ArrowLeft size={16} /> Archive</Link><span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Reading manuscript</span><button className="p-2 hover:bg-muted" aria-label="Share manuscript"><Share2 size={18} /></button></header><section className="mx-auto max-w-[1440px] px-5 py-8 lg:px-10 lg:py-12"><div className="mb-8"><span className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent"><FileText className="mr-2 inline" size={13} />{manuscript.category}</span><h1 className="mt-3 max-w-3xl text-4xl font-semibold tracking-[-0.045em] text-balance sm:text-5xl">{manuscript.title}</h1><p className="mt-2 text-sm text-muted-foreground">{manuscript.author} · {manuscript.year ?? 'Undated'}</p><p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground">{manuscript.subtitle ?? manuscript.description}</p><button onClick={() => setChatOpen(true)} className="mt-6 flex items-center gap-2 bg-accent px-4 py-2.5 text-xs font-bold text-accent-foreground hover:opacity-90"><MessageCircle size={14} /> Ask about this</button></div><div className="grid overflow-hidden border border-primary/20 bg-primary lg:grid-cols-[1.05fr_0.95fr]"><section className="flex min-h-[580px] items-center justify-center border-b border-primary-foreground/15 bg-[#172f48] p-6 lg:border-b-0 lg:border-r lg:p-10" aria-label="Manuscript viewer"><div className="relative flex aspect-[0.7] w-full max-w-[360px] items-center justify-center overflow-hidden bg-muted shadow-2xl"><img src={manuscript.cover_image_url ?? '/manuscript-page.png'} alt={`${manuscript.title} manuscript scan`} className="size-full object-cover" /><span className="absolute bottom-3 left-3 bg-primary/85 px-2 py-1 font-mono text-[9px] text-primary-foreground">DIGITAL FOLIO</span></div></section><section className="flex min-h-[580px] flex-col bg-background" aria-label="OCR transcription"><div className="flex items-center justify-between border-b border-foreground/15 px-5 py-4 sm:px-7"><div><p className="font-mono text-[10px] font-bold uppercase tracking-[0.18em]">OCR transcription</p><p className="mt-1 text-xs text-muted-foreground">{sections.length ? `${sections.length} sections` : 'Metadata record'}</p></div><button onClick={() => setSummarized(!summarized)} className="flex items-center gap-2 bg-accent px-3.5 py-2 text-xs font-bold text-accent-foreground hover:opacity-90"><Sparkles size={14} /> {summarized ? 'Show full' : 'Summarize'}</button></div><div className="flex-1 overflow-y-auto px-5 py-7 sm:px-7">{summarized ? <p className="text-sm leading-7 text-foreground">This manuscript examines social equality, democratic life, and the conditions required for dignity and justice.</p> : <div className="whitespace-pre-line text-sm leading-7 text-foreground">{text}</div>}</div></section></div></section>{chatOpen && <div className="fixed inset-0 z-50 bg-primary/30 backdrop-blur-sm" onClick={() => setChatOpen(false)}><aside onClick={(event) => event.stopPropagation()} className="absolute right-0 top-0 flex h-full w-full max-w-[460px] flex-col bg-background shadow-2xl"><div className="flex items-center justify-between border-b border-foreground/15 bg-primary px-5 py-4 text-primary-foreground"><div className="flex items-center gap-3"><span className="flex size-9 items-center justify-center rounded-full bg-accent"><Sparkles size={16} /></span><div><h2 className="text-sm font-bold">Archive Assistant</h2><p className="font-mono text-[9px] uppercase tracking-[0.16em] opacity-60">Manuscript context</p></div></div><button onClick={() => setChatOpen(false)} aria-label="Close assistant">×</button></div><div className="flex-1 p-6 text-sm leading-7 text-muted-foreground">Ask questions about <strong>{manuscript.title}</strong> after the archive assistant is connected.</div></aside></div>}  </main></ArchiveShell>
}
