'use client'

import { useState } from 'react'
import {
  ArrowUp,
  BookOpen,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  FileText,
  Headphones,
  Maximize2,
  Menu,
  MessageCircle,
  Minus,
  Pause,
  Play,
  Plus,
  Search,
  Sparkles,
  Volume2,
  X,
} from 'lucide-react'

const ocrParagraphs = [
  'The problem of social reform is not merely a question of changing customs. It is a question of changing the mind and the relations between men.',
  'A society which is based on inequality cannot be a society in which liberty has any meaning. Liberty must be accompanied by equality, and equality must be secured by fraternity.',
  'These principles are not abstract ideals. They are the living conditions upon which a democratic society must rest.',
]

const suggestedQueries = ['Summarize this folio', 'What is social democracy?', 'Find related speeches']

export default function Page() {
  const [zoom, setZoom] = useState(100)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [speed, setSpeed] = useState('1×')
  const [summarized, setSummarized] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [chatOpen, setChatOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [messages, setMessages] = useState([{ role: 'assistant', text: 'This passage argues that social reform begins with changing how people think and relate to one another. Ambedkar connects liberty to equality, and both to fraternity as the foundation of democracy.' }])
  const [speaking, setSpeaking] = useState<number | null>(null)

  const cycleSpeed = () => setSpeed(speed === '1×' ? '1.25×' : speed === '1.25×' ? '1.5×' : '1×')
  const submitQuery = (value = query) => {
    if (!value.trim()) return
    setMessages((current) => [...current, { role: 'user', text: value }, { role: 'assistant', text: `Vichardhara.ai is tracing that question through the current folio and related Ambedkar writings. The key idea is the relationship between ${value.toLowerCase()} and democratic social life.` }])
    setQuery('')
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="mx-auto flex max-w-[1440px] items-center justify-between border-b border-[#002147]/15 px-5 py-5 lg:px-10">
        <a href="#reader" className="flex items-center gap-3" aria-label="Ambedkar360 home"><span className="flex size-9 items-center justify-center rounded-full bg-[#002147] text-[#F9F8F3]"><BookOpen size={17} /></span><span className="font-mono text-xs font-bold tracking-[0.16em]">AMBEDKAR<span className="text-[#C56A35]">360</span></span></a>
        <div className="hidden items-center gap-8 md:flex"><span className="font-mono text-[10px] uppercase tracking-[0.18em] opacity-55">Digital reading room</span><button className="flex items-center gap-2 border border-[#002147] px-4 py-2 text-xs font-semibold transition-all duration-200 hover:bg-[#002147] hover:text-[#F9F8F3] active:scale-95" aria-label="Open search"><Search size={14} /> Search archive</button></div>
        <button className="md:hidden transition-colors hover:opacity-70" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">{menuOpen ? <X size={21} /> : <Menu size={21} />}</button>
      </header>
      {menuOpen && <div className="border-b border-[#002147]/15 px-5 py-4 text-xs md:hidden"><button className="flex items-center gap-2 font-semibold transition-colors hover:text-[#C56A35]"><Search size={14} /> Search archive</button></div>}

      <section id="reader" className="mx-auto max-w-[1440px] px-5 py-6 lg:px-10 lg:py-10">
        <div className="mb-7 flex flex-wrap items-end justify-between gap-5"><div><div className="mb-3 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-[#C56A35]"><FileText size={13} /> Manuscript 0042 · folio 18</div><h1 className="max-w-xl text-3xl font-semibold tracking-[-0.045em] text-balance sm:text-5xl">Annihilation of Caste</h1><p className="mt-2 text-sm opacity-60">B. R. Ambedkar · 1936 · Original typescript</p></div><div className="flex gap-3"><button onClick={() => setChatOpen(true)} className="flex items-center gap-2 bg-[#C56A35] px-4 py-2.5 text-xs font-bold text-[#F9F8F3] transition-all duration-200 hover:bg-[#A0501F] active:scale-95 shadow-sm"><MessageCircle size={14} /> Ask Vichardhara</button></div></div>

        <div className="grid overflow-hidden border border-[#002147]/20 bg-[#002147] lg:grid-cols-[1.05fr_0.95fr]">
          <section className="min-h-[580px] border-b border-[#F9F8F3]/15 bg-[#172f48] p-4 sm:p-6 lg:border-b-0 lg:border-r lg:p-8" aria-label="Manuscript viewer"><div className="mb-5 flex items-center justify-between text-[#F9F8F3]"><span className="font-mono text-[10px] uppercase tracking-[0.18em] opacity-60">Scan / 01</span><div className="flex items-center gap-1" aria-label="Zoom controls"><button className="flex size-8 items-center justify-center border border-[#F9F8F3]/20 transition-all duration-150 hover:bg-[#F9F8F3]/10 disabled:opacity-40 disabled:cursor-not-allowed active:scale-95" onClick={() => setZoom(Math.max(70, zoom - 10))} disabled={zoom <= 70} aria-label="Zoom out"><Minus size={14} /></button><span className="w-14 text-center font-mono text-[10px]">{zoom}%</span><button className="flex size-8 items-center justify-center border border-[#F9F8F3]/20 transition-all duration-150 hover:bg-[#F9F8F3]/10 disabled:opacity-40 disabled:cursor-not-allowed active:scale-95" onClick={() => setZoom(Math.min(200, zoom + 10))} disabled={zoom >= 200} aria-label="Zoom in"><Plus size={14} /></button></div></div><div className="relative aspect-video overflow-hidden bg-[#0f1f30] shadow-inner"><img src="/manuscript-page.png" alt="Scanned manuscript folio" className="size-full object-cover opacity-90" /><div className="absolute inset-0 flex items-center justify-center bg-[#132b3f]/20 text-[#F9F8F3]/70"><Maximize2 size={28} /></div></div></section>

          <section className="flex min-h-[580px] flex-col bg-[#F9F8F3]" aria-label="OCR text and narration"><div className="flex items-center justify-between border-b border-[#002147]/15 px-5 py-4 sm:px-7"><div><p className="font-mono text-[10px] font-bold uppercase tracking-[0.18em]">OCR transcription</p><p className="mt-1 text-xs opacity-50">English · 98.4% confidence</p></div><button onClick={() => setSummarized(!summarized)} className="flex items-center gap-2 bg-[#C56A35] px-3.5 py-2 text-xs font-bold text-[#F9F8F3] transition-all duration-200 hover:bg-[#A0501F] active:scale-95 shadow-sm"><Sparkles size={14} /> {summarized ? 'Show full text' : 'Summarize'}</button></div><div className="flex-1 overflow-y-auto px-5 py-7 sm:px-7"><div className="space-y-4 text-sm leading-relaxed">{ocrParagraphs.map((para, idx) => <p key={idx} className="text-[#002147]">{para}</p>)}</div></div><div className="border-t border-[#002147]/15 space-y-2 px-5 py-4 sm:px-7"><p className="font-mono text-[9px] uppercase tracking-[0.16em] text-[#002147]/60 font-semibold">Suggested queries</p><div className="flex flex-wrap gap-2">{suggestedQueries.map((q) => <button key={q} onClick={() => submitQuery(q)} className="rounded-full border border-[#002147]/30 bg-white px-3 py-1.5 text-xs transition-all duration-150 hover:bg-[#002147] hover:text-white hover:border-[#002147] active:scale-95">{q}</button>)}</div></div></section>
        </div>
      </section>

      <footer className="mx-auto flex max-w-[1440px] items-center justify-between px-5 pb-8 pt-2 text-xs opacity-55 lg:px-10"><span>Access is a right, not a privilege.</span><span className="hidden sm:block">Ambedkar360 Digital Archive</span></footer>

      {chatOpen && <div className="fixed inset-0 z-50 bg-[#002147]/30 backdrop-blur-sm" onClick={() => setChatOpen(false)}><aside onClick={(event) => event.stopPropagation()} className="absolute right-0 top-0 flex h-full w-full max-w-[480px] flex-col bg-[#F9F8F3] shadow-2xl"><div className="flex items-center justify-between border-b border-[#002147]/15 bg-[#002147] px-5 py-4 text-[#F9F8F3]"><div className="flex items-center gap-3"><span className="flex size-9 items-center justify-center rounded-full bg-[#C56A35]"><Sparkles size={16} /></span><div><h2 className="text-sm font-bold">Vichardhara.ai</h2><p className="font-mono text-[9px] uppercase tracking-[0.16em] opacity-60">Archive intelligence</p></div></div><button onClick={() => setChatOpen(false)} className="rounded transition-colors hover:bg-[#F9F8F3]/10 p-1" aria-label="Close chat"><X size={18} /></button></div><div className="flex-1 overflow-y-auto space-y-4 px-5 py-6"><div className="text-xs leading-relaxed space-y-3">{messages.map((msg, idx) => <div key={idx} className={msg.role === 'user' ? 'text-right' : 'text-left'}><div className={`inline-block max-w-xs rounded-lg px-3 py-2 ${msg.role === 'user' ? 'bg-[#002147] text-[#F9F8F3]' : 'bg-[#002147]/10 text-[#002147]'}`}>{msg.text}</div></div>)}</div></div><div className="border-t border-[#002147]/15 px-5 py-4"><div className="flex gap-2"><input type="text" value={query} onChange={(e) => setQuery(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && submitQuery()} placeholder="Ask a question..." className="flex-1 rounded border border-[#002147]/20 bg-[#F9F8F3] px-3 py-2 text-xs transition-colors focus:border-[#002147] focus:outline-none" /><button onClick={() => submitQuery()} className="flex items-center justify-center rounded bg-[#C56A35] p-2 text-[#F9F8F3] transition-all duration-200 hover:bg-[#A0501F] active:scale-95 disabled:opacity-50" disabled={!query.trim()} aria-label="Send message"><ArrowUp size={14} /></button></div></div></aside></div>}
    </main>
  )
}
