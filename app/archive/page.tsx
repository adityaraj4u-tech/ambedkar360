'use client'

import { useState } from 'react'
import Link from 'next/link'
import { manuscripts, getAllTags } from '@/lib/manuscripts'
import { Search, Filter, Play, Headphones, BookOpen } from 'lucide-react'

export default function ArchivePage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedTag, setSelectedTag] = useState<string | null>(null)

  const allTags = getAllTags()

  const filtered = manuscripts.filter((manuscript) => {
    const matchesSearch =
      manuscript.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      manuscript.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      manuscript.author.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesCategory = !selectedCategory || manuscript.category === selectedCategory
    const matchesTag = !selectedTag || manuscript.tags.includes(selectedTag)

    return matchesSearch && matchesCategory && matchesTag
  })

  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-40 border-b border-[#002147]/15 bg-[#F9F8F3]">
        <div className="mx-auto max-w-[1440px] px-5 py-6 lg:px-10">
          <div className="flex items-center gap-3 mb-6">
            <Link
              href="/"
              className="flex items-center gap-3 hover:opacity-70 transition-opacity"
            >
              <span className="flex size-9 items-center justify-center rounded-full bg-[#002147] text-[#F9F8F3]">
                <BookOpen size={17} />
              </span>
              <span className="font-mono text-xs font-bold tracking-[0.16em]">
                AMBEDKAR<span className="text-[#C56A35]">360</span>
              </span>
            </Link>
          </div>

          <div className="space-y-4">
            <div className="flex items-end justify-between gap-4"><div><p className="mb-3 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[#b85c38]">The reading room</p><h1 className="text-4xl font-semibold tracking-[-0.045em] sm:text-5xl">Digital Archive</h1></div><span className="hidden font-mono text-[10px] uppercase tracking-[0.16em] opacity-50 sm:block">{manuscripts.length} records</span></div>
            <p className="text-sm opacity-60">
              Explore the complete collection of Dr. B. R. Ambedkar's writings, speeches, and manuscripts
            </p>
          </div>

          <div className="mt-6 space-y-4">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-3.5 text-[#002147]/40" />
              <input
                type="text"
                placeholder="Search manuscripts, speeches, essays..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded border border-[#002147]/20 bg-white pl-10 pr-4 py-2.5 text-sm transition-colors focus:border-[#002147] focus:outline-none"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              {['essay', 'speech', 'writing', 'letter'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(selectedCategory === cat ? null : cat)}
                  className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all duration-150 capitalize ${
                    selectedCategory === cat
                      ? 'bg-[#002147] text-[#F9F8F3]'
                      : 'border border-[#002147]/20 bg-white text-[#002147] hover:border-[#002147]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-[1440px] px-5 py-10 lg:px-10">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[220px_1fr]">
          <aside className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              <div>
                <div className="mb-3 flex items-center gap-2">
                  <Filter size={14} />
                  <h3 className="font-mono text-xs font-bold uppercase tracking-[0.16em]">
                    Topics
                  </h3>
                </div>
                <div className="space-y-2">
                  {allTags.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                      className={`block w-full text-left text-xs transition-all duration-150 px-3 py-1.5 rounded ${
                        selectedTag === tag
                          ? 'bg-[#C56A35] text-[#F9F8F3] font-semibold'
                          : 'text-[#002147] hover:bg-[#002147]/5'
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              <div className="border-t border-[#002147]/15 pt-4">
                <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-[#002147]/60">
                  {filtered.length} manuscript{filtered.length !== 1 ? 's' : ''} found
                </p>
              </div>
            </div>
          </aside>

          <div className="lg:col-span-3">
<div className="grid gap-4 xl:grid-cols-2">
              {filtered.length === 0 ? (
                <div className="rounded-lg border border-[#002147]/15 bg-[#002147]/5 px-6 py-12 text-center">
                  <p className="text-sm opacity-60">No manuscripts match your search criteria.</p>
                </div>
              ) : (
                filtered.map((manuscript) => (
                  <Link
                    key={manuscript.id}
                    href={`/manuscript/${manuscript.id}`}
                    className="group block border border-[#132b3f]/15 bg-white/70 p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-[#132b3f]/35 hover:bg-white hover:shadow-lg"
                  >
                    <div className="flex gap-5">
                      <div className="h-32 w-24 shrink-0 rounded-lg bg-[#E6DCC8] flex items-center justify-center text-[#002147]/20">
                        <BookOpen size={32} />
                      </div>

                      <div className="flex-1">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1">
                            <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-[#C56A35]">
                              {manuscript.category}
                            </span>
                            <h3 className="mt-1 text-lg font-semibold transition-colors group-hover:text-[#C56A35]">
                              {manuscript.title}
                            </h3>
                            <p className="mt-1 text-xs opacity-60">
                              {manuscript.author} · {manuscript.year} · {manuscript.pages} pages
                            </p>
                            <p className="mt-3 text-sm leading-relaxed opacity-75">
                              {manuscript.description}
                            </p>
                            <div className="mt-3 flex flex-wrap gap-2">
                              {manuscript.tags.map((tag) => (
                                <span
                                  key={tag}
                                  className="rounded-full bg-[#002147]/10 px-2 py-1 text-[10px] font-semibold text-[#002147]"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div className="mt-4 flex gap-3 border-t border-[#002147]/10 pt-4">
                          <div className="flex items-center gap-1.5 text-xs opacity-60">
                            <Headphones size={12} />
                            <span>{manuscript.duration}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-xs opacity-60">
                            <Play size={12} />
                            <span>{manuscript.pages} pages</span>
                          </div>
                          <div className="ml-auto flex items-center gap-1.5 rounded bg-[#C56A35]/10 px-2 py-1 text-xs font-semibold text-[#C56A35]">
                            OCR {manuscript.confidence}%
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
