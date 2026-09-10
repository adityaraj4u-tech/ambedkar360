'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { BookOpen, Filter, Search } from 'lucide-react'
import type { ArchiveManuscript } from '@/lib/archive'

const categories = ['all', 'Essay', 'Speech', 'Writing', 'Letter']

export default function ArchivePage() {
  const [manuscripts, setManuscripts] = useState<ArchiveManuscript[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const controller = new AbortController()
    const params = new URLSearchParams()
    if (searchQuery.trim()) params.set('q', searchQuery.trim())
    if (selectedCategory !== 'all') params.set('category', selectedCategory)
    setLoading(true)
    fetch(`/api/manuscripts?${params.toString()}`, { signal: controller.signal })
      .then((response) => response.json())
      .then((payload) => setManuscripts(payload.data ?? []))
      .catch((error) => { if (error.name !== 'AbortError') setManuscripts([]) })
      .finally(() => setLoading(false))
    return () => controller.abort()
  }, [searchQuery, selectedCategory])

  const topicCount = useMemo(() => new Set(manuscripts.map((item) => item.category)).size, [manuscripts])

  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-40 border-b border-foreground/15 bg-background/95 backdrop-blur">
        <div className="mx-auto max-w-[1440px] px-5 py-6 lg:px-10">
          <Link href="/" className="flex items-center gap-3 transition-opacity hover:opacity-70">
            <span className="flex size-9 items-center justify-center rounded-full bg-primary text-primary-foreground"><BookOpen size={17} /></span>
            <span className="font-mono text-xs font-bold tracking-[0.16em]">AMBEDKAR<span className="text-accent">360</span></span>
          </Link>
          <div className="mt-7 flex items-end justify-between gap-4">
            <div><p className="mb-3 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-accent">The reading room</p><h1 className="text-4xl font-semibold tracking-[-0.045em] sm:text-5xl">Digital Archive</h1></div>
            <span className="hidden font-mono text-[10px] uppercase tracking-[0.16em] opacity-50 sm:block">{manuscripts.length} records · {topicCount} categories</span>
          </div>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">Explore the writings, speeches, and manuscripts of Dr. B. R. Ambedkar.</p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <label className="relative flex-1"><span className="sr-only">Search archive</span><Search size={16} className="absolute left-3 top-3.5 text-muted-foreground" /><input value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} placeholder="Search manuscripts, speeches, essays..." className="w-full border border-foreground/20 bg-card py-2.5 pl-10 pr-4 text-sm outline-none transition-colors focus:border-primary" /></label>
            <div className="flex flex-wrap gap-2">{categories.map((category) => <button key={category} onClick={() => setSelectedCategory(category)} className={`border px-3 py-2 text-xs font-semibold transition-colors ${selectedCategory === category ? 'border-primary bg-primary text-primary-foreground' : 'border-foreground/20 bg-card hover:border-primary'}`}>{category}</button>)}</div>
          </div>
        </div>
      </header>
      <section className="mx-auto max-w-[1440px] px-5 py-10 lg:px-10">
        <div className="mb-5 flex items-center gap-2"><Filter size={14} /><span className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground">{loading ? 'Loading records' : `${manuscripts.length} manuscripts found`}</span></div>
        {loading ? <div className="border border-foreground/10 bg-card p-10 text-center text-sm text-muted-foreground">Querying the archive...</div> : manuscripts.length === 0 ? <div className="border border-foreground/10 bg-muted p-10 text-center text-sm text-muted-foreground">No manuscripts match your search.</div> : <div className="grid gap-4 xl:grid-cols-2">{manuscripts.map((manuscript) => <Link key={manuscript.id} href={`/manuscript/${manuscript.slug}`} className="group block border border-foreground/15 bg-card/70 p-5 transition-all hover:-translate-y-0.5 hover:border-foreground/35 hover:bg-card hover:shadow-lg"><div className="flex gap-5"><div className="flex h-32 w-24 shrink-0 items-center justify-center bg-muted text-foreground/20"><BookOpen size={32} /></div><div className="min-w-0 flex-1"><span className="font-mono text-[9px] uppercase tracking-[0.16em] text-accent">{manuscript.category}</span><h2 className="mt-1 text-lg font-semibold transition-colors group-hover:text-accent">{manuscript.title}</h2><p className="mt-1 text-xs text-muted-foreground">{manuscript.author} · {manuscript.year ?? 'Undated'}</p><p className="mt-3 line-clamp-3 text-sm leading-relaxed text-muted-foreground">{manuscript.description}</p><div className="mt-4 border-t border-foreground/10 pt-3 font-mono text-[9px] uppercase tracking-[0.14em] text-muted-foreground">Read manuscript</div></div></div></Link>)}</div>}
      </section>
    </main>
  )
}
