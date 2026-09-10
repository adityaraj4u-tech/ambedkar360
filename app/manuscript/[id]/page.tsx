'use client'

import { useState } from 'react'
import Link from 'next/link'
import { getManuscriptById } from '@/lib/manuscripts'
import {
  ArrowLeft,
  ArrowUp,
  BookOpen,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  FileText,
  Headphones,
  Menu,
  MessageCircle,
  Minus,
  Pause,
  Play,
  Plus,
  Search,
  Share2,
  Sparkles,
  Volume2,
  X,
} from 'lucide-react'

const sampleOcrText = [
  'The problem of social reform is not merely a question of changing customs. It is a question of changing the mind and the relations between men.',
  'A society which is based on inequality cannot be a society in which liberty has any meaning. Liberty must be accompanied by equality, and equality must be secured by fraternity.',
  'These principles are not abstract ideals. They are the living conditions upon which a democratic society must rest.',
]

const suggestedQueries = ['Summarize this', 'Key arguments', 'Find related content', 'Historical context']

export default async function ManuscriptPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const manuscript = getManuscriptById(id)

  const [zoom, setZoom] = useState(100)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [speed, setSpeed] = useState('1×')
  const [summarized, setSummarized] = useState(false)
  const [chatOpen, setChatOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; text: string }>>([{
    role: 'assistant',
    text: 'Hello! I can help you explore this manuscript. What would you like to know?',
  }])
  const [currentPage, setCurrentPage] = useState(1)

  if (!manuscript) {
    return (
      <main className="min-h-screen bg-background text-foreground">
        <header className="border-b border-[#002147]/15 px-5 py-5 lg:px-10">
          <Link href="/archive" className="inline-flex items-center gap-2 text-sm font-semibold hover:text-[#C56A35] transition-colors">
            <ArrowLeft size={16} /> Back to archive
          </Link>
        </header>
        <section className="mx-auto max-w-[1440px] px-5 py-20 text-center">
          <h1 className="text-2xl font-semibold">Manuscript not found</h1>
          <Link href="/archive" className="mt-4 inline-block text-[#C56A35] hover:underline">
            Return to archive
          </Link>
        </section>
      </main>
    )
  }

  const cycleSpeed = () => setSpeed(speed === '1×' ? '1.25×' : speed === '1.25×' ? '1.5×' : '1×')
  const submitQuery = (value = query) => {
    if (!value.trim()) return
    setMessages((current) => [
      ...current,
      { role: 'user', text: value },
      {
        role: 'assistant',
        text: `Based on ${manuscript.title}, ${value.toLowerCase()}. This manuscript provides valuable insights into Ambedkar's perspective on this topic.`,
      },
    ])
    setQuery('')
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="mx-auto flex max-w-[1440px] items-center justify-between border-b border-[#002147]/15 px-5 py-5 lg:px-10">
        <Link
          href="/archive"
          className="flex items-center gap-2 text-sm font-semibold hover:text-[#C56A35] transition-colors"
        >
          <ArrowLeft size={16} /> Archive
        </Link>
        <span className="font-mono text-[10px] uppercase tracking-[0.18em] opacity-55">
          Reading manuscript
        </span>
        <button className="rounded transition-colors hover:bg-[#002147]/10 p-2" aria-label="Share">
          <Share2 size={18} />
        </button>
      </header>

      <section className="mx-auto max-w-[1440px] px-5 py-6 lg:px-10 lg:py-10">
        <div className="mb-7">
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#C56A35]">
            <FileText className="inline mr-2" size={13} />
            {manuscript.category}
          </span>
          <h1 className="mt-3 max-w-3xl text-4xl font-semibold tracking-[-0.045em] text-balance sm:text-5xl">{manuscript.title}</h1>
          <p className="mt-2 text-sm opacity-60">
            {manuscript.author} · {manuscript.year} · {manuscript.pages} pages
          </p>
          <p className="mt-4 text-base leading-relaxed opacity-75 max-w-2xl">
            {manuscript.description}
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {manuscript.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-[#002147]/10 px-3 py-1 text-xs font-semibold text-[#002147]"
              >
                {tag}
              </span>
            ))}
          </div>
          <div className="mt-6 flex gap-3">
            <button
              onClick={() => setChatOpen(true)}
              className="flex items-center gap-2 bg-[#C56A35] px-4 py-2.5 text-xs font-bold text-[#F9F8F3] transition-all duration-200 hover:bg-[#A0501F] active:scale-95 shadow-sm"
            >
              <MessageCircle size={14} /> Ask about this
            </button>
          </div>
        </div>

        <div className="grid overflow-hidden border border-[#002147]/20 bg-[#002147] lg:grid-cols-[1.05fr_0.95fr]">
          <section
            className="min-h-[580px] border-b border-[#F9F8F3]/15 bg-[#172f48] p-4 sm:p-6 lg:border-b-0 lg:border-r lg:p-8"
            aria-label="Manuscript viewer"
          >
            <div className="mb-5 flex items-center justify-between text-[#F9F8F3]">
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] opacity-60">
                Page {currentPage} / {manuscript.pages}
              </span>
              <div className="flex items-center gap-1" aria-label="Zoom controls">
                <button
                  className="flex size-8 items-center justify-center border border-[#F9F8F3]/20 transition-all duration-150 hover:bg-[#F9F8F3]/10 disabled:opacity-40 disabled:cursor-not-allowed active:scale-95"
                  onClick={() => setZoom(Math.max(70, zoom - 10))}
                  disabled={zoom <= 70}
                  aria-label="Zoom out"
                >
                  <Minus size={14} />
                </button>
                <span className="w-14 text-center font-mono text-[10px]">{zoom}%</span>
                <button
                  className="flex size-8 items-center justify-center border border-[#F9F8F3]/20 transition-all duration-150 hover:bg-[#F9F8F3]/10 disabled:opacity-40 disabled:cursor-not-allowed active:scale-95"
                  onClick={() => setZoom(Math.min(200, zoom + 10))}
                  disabled={zoom >= 200}
                  aria-label="Zoom in"
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>
            <div className="flex min-h-[475px] items-center justify-center overflow-auto bg-[#0f1f30] p-5 sm:p-9 rounded">
              <div
                className="relative shrink-0 overflow-hidden bg-[#e7dcc2] shadow-2xl transition-transform duration-300"
                style={{
                  width: `${Math.round(290 * zoom / 100)}px`,
                  minHeight: `${Math.round(410 * zoom / 100)}px`,
                }}
              >
                <div className="h-full w-full flex items-center justify-center text-[#002147]/30 bg-gradient-to-br from-[#e7dcc2] to-[#d4c4a8]">
                  <BookOpen size={64} />
                </div>
                <span className="absolute bottom-3 left-3 bg-[#002147]/85 px-2 py-1 font-mono text-[9px] text-[#F9F8F3]">
                  PAGE {currentPage}
                </span>
              </div>
            </div>
            <div className="mt-5 flex items-center justify-between text-[#F9F8F3]">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="flex items-center gap-1 text-xs opacity-70 hover:opacity-100 disabled:opacity-40 transition-opacity"
              >
                <ChevronLeft size={15} /> Previous
              </button>
              <span className="font-mono text-[10px] opacity-50">
                {currentPage} / {manuscript.pages}
              </span>
              <button
                onClick={() => setCurrentPage(Math.min(manuscript.pages, currentPage + 1))}
                disabled={currentPage === manuscript.pages}
                className="flex items-center gap-1 text-xs opacity-70 hover:opacity-100 disabled:opacity-40 transition-opacity"
              >
                Next <ChevronRight size={15} />
              </button>
            </div>
          </section>

          <section
            className="flex min-h-[580px] flex-col bg-[#F9F8F3]"
            aria-label="OCR text and narration"
          >
            <div className="flex items-center justify-between border-b border-[#002147]/15 px-5 py-4 sm:px-7">
              <div>
                <p className="font-mono text-[10px] font-bold uppercase tracking-[0.18em]">
                  OCR Transcription
                </p>
                <p className="mt-1 text-xs opacity-50">English · {manuscript.confidence}% confidence</p>
              </div>
              <button
                onClick={() => setSummarized(!summarized)}
                className="flex items-center gap-2 bg-[#C56A35] px-3.5 py-2 text-xs font-bold text-[#F9F8F3] transition-all duration-200 hover:bg-[#A0501F] active:scale-95 shadow-sm"
              >
                <Sparkles size={14} /> {summarized ? 'Show full' : 'Summarize'}
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-7 sm:px-7">
              <div className="space-y-5 text-sm leading-relaxed">
                {sampleOcrText.map((para, idx) => (
                  <p key={idx} className="text-[#002147]">
                    {para}
                  </p>
                ))}
              </div>
            </div>

            <div className="border-t border-[#002147]/15 bg-[#eeece4] px-5 py-5 sm:px-7">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="flex size-8 items-center justify-center rounded-full bg-[#002147] text-[#F9F8F3]">
                    <Headphones size={14} />
                  </span>
                  <div>
                    <p className="text-xs font-bold">Audio Narration</p>
                    <p className="font-mono text-[9px] uppercase tracking-[0.15em] opacity-50">
                      {manuscript.duration}
                    </p>
                  </div>
                </div>
                <button
                  onClick={cycleSpeed}
                  className="flex items-center gap-1 border border-[#002147]/20 px-2 py-1 font-mono text-[10px] transition-colors hover:bg-[#002147]/10"
                  aria-label="Change playback speed"
                >
                  {speed}
                  <ChevronDown size={12} />
                </button>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#002147] text-[#F9F8F3] transition-all duration-200 hover:bg-[#A0501F] active:scale-95"
                  aria-label={isPlaying ? 'Pause' : 'Play'}
                >
                  {isPlaying ? (
                    <Pause size={16} fill="currentColor" />
                  ) : (
                    <Play size={16} fill="currentColor" />
                  )}
                </button>
                <div className="flex-1">
                  <div className="h-1.5 overflow-hidden rounded-full bg-[#002147]/15">
                    <div className="h-full w-[35%] bg-[#C56A35]" />
                  </div>
                  <div className="mt-2 flex justify-between font-mono text-[9px] opacity-50">
                    <span>02:15</span>
                    <span>{manuscript.duration}</span>
                  </div>
                </div>
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className="transition-opacity opacity-60 hover:opacity-100"
                  aria-label={isMuted ? 'Unmute' : 'Mute'}
                >
                  <Volume2 size={17} />
                </button>
              </div>
            </div>
          </section>
        </div>
      </section>

      {chatOpen && (
        <div
          className="fixed inset-0 z-50 bg-[#002147]/30 backdrop-blur-sm"
          onClick={() => setChatOpen(false)}
        >
          <aside
            onClick={(event) => event.stopPropagation()}
            className="absolute right-0 top-0 flex h-full w-full max-w-[480px] flex-col bg-[#F9F8F3] shadow-2xl animate-in slide-in-from-right"
          >
            <div className="flex items-center justify-between border-b border-[#002147]/15 bg-[#002147] px-5 py-4 text-[#F9F8F3]">
              <div className="flex items-center gap-3">
                <span className="flex size-9 items-center justify-center rounded-full bg-[#C56A35]">
                  <Sparkles size={16} />
                </span>
                <div>
                  <h2 className="text-sm font-bold">Archive Assistant</h2>
                  <p className="font-mono text-[9px] uppercase tracking-[0.16em] opacity-60">
                    Powered by AI
                  </p>
                </div>
              </div>
              <button
                onClick={() => setChatOpen(false)}
                className="rounded transition-colors hover:bg-[#F9F8F3]/10 p-1"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-4 px-5 py-6">
              <div className="text-xs leading-relaxed space-y-3">
                {messages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={msg.role === 'user' ? 'text-right' : 'text-left'}
                  >
                    <div
                      className={`inline-block max-w-xs rounded-lg px-3 py-2 ${
                        msg.role === 'user'
                          ? 'bg-[#002147] text-[#F9F8F3]'
                          : 'bg-[#002147]/10 text-[#002147]'
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-2 pt-4 border-t border-[#002147]/15">
                <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-[#002147]/60">
                  Suggested queries
                </p>
                <div className="flex flex-wrap gap-2">
                  {suggestedQueries.map((sq) => (
                    <button
                      key={sq}
                      onClick={() => submitQuery(sq)}
                      className="rounded-full border border-[#002147]/30 bg-white px-3 py-1.5 text-xs transition-all duration-150 hover:bg-[#002147] hover:text-white hover:border-[#002147] active:scale-95"
                    >
                      {sq}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="border-t border-[#002147]/15 px-5 py-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && submitQuery()}
                  placeholder="Ask about this manuscript..."
                  className="flex-1 rounded border border-[#002147]/20 bg-[#F9F8F3] px-3 py-2 text-xs transition-colors focus:border-[#002147] focus:outline-none"
                />
                <button
                  onClick={() => submitQuery()}
                  className="flex items-center justify-center rounded bg-[#C56A35] p-2 text-[#F9F8F3] transition-all duration-200 hover:bg-[#A0501F] active:scale-95 disabled:opacity-50"
                  disabled={!query.trim()}
                  aria-label="Send"
                >
                  <ArrowUp size={14} />
                </button>
              </div>
            </div>
          </aside>
        </div>
      )}
    </main>
  )
}
