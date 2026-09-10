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
    <main className="min-h-screen bg-[#F9F8F3] text-[#002147]">
      <header className="mx-auto flex max-w-[1440px] items-center justify-between border-b border-[#002147]/15 px-5 py-5 lg:px-10">
        <a href="#reader" className="flex items-center gap-3" aria-label="Ambedkar360 home"><span className="flex size-9 items-center justify-center rounded-full bg-[#002147] text-[#F9F8F3]"><BookOpen size={17} /></span><span className="font-mono text-xs font-bold tracking-[0.16em]">AMBEDKAR<span className="text-[#C56A35]">360</span></span></a>
        <div className="hidden items-center gap-8 md:flex"><span className="font-mono text-[10px] uppercase tracking-[0.18em] opacity-55">Digital reading room</span><button className="flex items-center gap-2 border border-[#002147] px-4 py-2 text-xs font-semibold transition-colors hover:bg-[#002147] hover:text-[#F9F8F3]" aria-label="Open search"><Search size={14} /> Search archive</button></div>
        <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">{menuOpen ? <X size={21} /> : <Menu size={21} />}</button>
      </header>
      {menuOpen && <div className="border-b border-[#002147]/15 px-5 py-4 text-xs md:hidden"><button className="flex items-center gap-2 font-semibold"><Search size={14} /> Search archive</button></div>}

      <section id="reader" className="mx-auto max-w-[1440px] px-5 py-6 lg:px-10 lg:py-10">
        <div className="mb-7 flex flex-wrap items-end justify-between gap-5"><div><div className="mb-3 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-[#C56A35]"><FileText size={13} /> Manuscript 0042 · folio 18</div><h1 className="text-3xl font-semibold tracking-[-0.045em] sm:text-4xl">Annihilation of Caste</h1><p className="mt-2 text-sm opacity-60">B. R. Ambedkar · 1936 · Original typescript</p></div><div className="flex gap-3"><button onClick={() => setChatOpen(true)} className="flex items-center gap-2 bg-[#C56A35] px-4 py-2.5 text-xs font-bold text-[#F9F8F3] transition-colors hover:bg-[#002147]"><MessageCircle size={14} /> Ask Vichardhara</button><button className="hidden items-center gap-2 border border-[#002147]/25 px-4 py-2.5 text-xs font-semibold transition-colors hover:bg-[#002147] hover:text-[#F9F8F3] sm:flex"><Maximize2 size={14} /> Focus reading mode</button></div></div>

        <div className="grid overflow-hidden border border-[#002147]/20 bg-[#002147] lg:grid-cols-[1.05fr_0.95fr]">
          <section className="min-h-[580px] border-b border-[#F9F8F3]/15 bg-[#172f48] p-4 sm:p-6 lg:border-b-0 lg:border-r lg:p-8" aria-label="Manuscript viewer"><div className="mb-5 flex items-center justify-between text-[#F9F8F3]"><span className="font-mono text-[10px] uppercase tracking-[0.18em] opacity-60">Scan / 01</span><div className="flex items-center gap-1" aria-label="Zoom controls"><button className="flex size-8 items-center justify-center border border-[#F9F8F3]/20 hover:bg-[#F9F8F3]/10 disabled:opacity-40" onClick={() => setZoom(Math.max(70, zoom - 10))} disabled={zoom <= 70} aria-label="Zoom out"><Minus size={14} /></button><span className="w-14 text-center font-mono text-[10px]">{zoom}%</span><button className="flex size-8 items-center justify-center border border-[#F9F8F3]/20 hover:bg-[#F9F8F3]/10 disabled:opacity-40" onClick={() => setZoom(Math.min(160, zoom + 10))} disabled={zoom >= 160} aria-label="Zoom in"><Plus size={14} /></button></div></div><div className="flex min-h-[475px] items-center justify-center overflow-auto bg-[#0f2439] p-5 sm:p-9"><div className="relative shrink-0 overflow-hidden bg-[#e7dcc2] shadow-2xl transition-transform duration-300" style={{ width: `${Math.round(290 * zoom / 100)}px`, minHeight: `${Math.round(410 * zoom / 100)}px` }}><img src="/manuscript-page.png" alt="Digitized manuscript page from Annihilation of Caste" className="h-full w-full object-cover" /><span className="absolute bottom-3 left-3 bg-[#002147]/85 px-2 py-1 font-mono text-[9px] text-[#F9F8F3]">FOLIO 18</span></div></div><div className="mt-5 flex items-center justify-between text-[#F9F8F3]"><button className="flex items-center gap-1 text-xs opacity-70 hover:opacity-100"><ChevronLeft size={15} /> Previous</button><span className="font-mono text-[10px] opacity-50">18 / 42</span><button className="flex items-center gap-1 text-xs opacity-70 hover:opacity-100">Next <ChevronRight size={15} /></button></div></section>
          <section className="flex min-h-[580px] flex-col bg-[#F9F8F3]" aria-label="OCR text and narration"><div className="flex items-center justify-between border-b border-[#002147]/15 px-5 py-4 sm:px-7"><div><p className="font-mono text-[10px] font-bold uppercase tracking-[0.18em]">OCR transcription</p><p className="mt-1 text-xs opacity-50">English · 98.4% confidence</p></div><button onClick={() => setSummarized(!summarized)} className="flex items-center gap-2 bg-[#C56A35] px-3.5 py-2 text-xs font-bold text-[#F9F8F3] transition-colors hover:bg-[#002147]"><Sparkles size={14} /> {summarized ? 'Show full text' : 'Summarize'}</button></div><div className="flex-1 px-5 py-7 sm:px-7">{summarized ? <div className="border-l-2 border-[#C56A35] pl-5"><p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#C56A35]">Archive summary</p><p className="mt-4 text-lg leading-8">Ambedkar argues that social reform requires more than changing customs: it requires changing the mind. Liberty, equality, and fraternity are presented as essential conditions for a democratic society.</p></div> : <div className="space-y-5 text-[15px] leading-7">{ocrParagraphs.map((paragraph, index) => <p key={paragraph}><span className="mr-3 font-mono text-[10px] opacity-35">{String(index + 1).padStart(2, '0')}</span>{paragraph}</p>)}</div>}</div><div className="border-t border-[#002147]/15 bg-[#eeece4] px-5 py-5 sm:px-7"><div className="mb-4 flex items-center justify-between"><div className="flex items-center gap-3"><span className="flex size-8 items-center justify-center rounded-full bg-[#002147] text-[#F9F8F3]"><Headphones size={14} /></span><div><p className="text-xs font-bold">Narrate this page</p><p className="font-mono text-[9px] uppercase tracking-[0.15em] opacity-50">English voice · 04:32</p></div></div><button onClick={cycleSpeed} className="flex items-center gap-1 border border-[#002147]/20 px-2 py-1 font-mono text-[10px]" aria-label="Change playback speed">{speed}<ChevronDown size={12} /></button></div><div className="flex items-center gap-3"><button onClick={() => setIsPlaying(!isPlaying)} className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#002147] text-[#F9F8F3]" aria-label={isPlaying ? 'Pause narration' : 'Play narration'}>{isPlaying ? <Pause size={16} fill="currentColor" /> : <Play size={16} fill="currentColor" />}</button><div className="flex-1"><div className="h-1.5 overflow-hidden rounded-full bg-[#002147]/15"><div className="h-full w-[28%] bg-[#C56A35]" /></div><div className="mt-2 flex justify-between font-mono text-[9px] opacity-50"><span>01:16</span><span>04:32</span></div></div><button onClick={() => setIsMuted(!isMuted)} aria-label={isMuted ? 'Unmute narration' : 'Mute narration'} className="opacity-60 hover:opacity-100"><Volume2 size={17} /></button></div></div></section>
        </div>
      </section>

      <footer className="mx-auto flex max-w-[1440px] items-center justify-between px-5 pb-8 pt-2 text-xs opacity-55 lg:px-10"><span>Access is a right, not a privilege.</span><span className="hidden sm:block">Ambedkar360 Digital Archive</span></footer>

      {chatOpen && <div className="fixed inset-0 z-50 bg-[#002147]/30" onClick={() => setChatOpen(false)}><aside onClick={(event) => event.stopPropagation()} className="absolute right-0 top-0 flex h-full w-full max-w-[480px] flex-col bg-[#F9F8F3] shadow-2xl"><div className="flex items-center justify-between border-b border-[#002147]/15 bg-[#002147] px-5 py-4 text-[#F9F8F3]"><div className="flex items-center gap-3"><span className="flex size-9 items-center justify-center rounded-full bg-[#C56A35]"><Sparkles size={16} /></span><div><h2 className="text-sm font-bold">Vichardhara.ai</h2><p className="font-mono text-[9px] uppercase tracking-[0.16em] opacity-60">Archive intelligence</p></div></div><button onClick={() => setChatOpen(false)} aria-label="Close Vichardhara chat"><X size={19} /></button></div><div className="flex-1 space-y-5 overflow-y-auto px-5 py-6"><div className="border border-[#002147]/15 bg-white/40 p-4"><p className="font-mono text-[9px] uppercase tracking-[0.16em] text-[#C56A35]">Ask about this archive</p><p className="mt-2 text-sm leading-6 opacity-70">I can compare passages, explain ideas, and locate related speeches across the collection.</p></div><div className="flex flex-wrap gap-2">{suggestedQueries.map((suggestion) => <button key={suggestion} onClick={() => submitQuery(suggestion)} className="border border-[#002147]/20 px-3 py-2 text-left text-[11px] font-semibold transition-colors hover:bg-[#002147] hover:text-[#F9F8F3]">{suggestion}</button>)}</div>{messages.map((message, index) => <div key={`${message.role}-${index}`} className={message.role === 'user' ? 'ml-10' : 'mr-5'}><div className={message.role === 'user' ? 'bg-[#002147] px-4 py-3 text-sm leading-6 text-[#F9F8F3]' : 'border border-[#002147]/15 bg-white/60 px-4 py-3 text-sm leading-6'}>{message.text}</div>{message.role === 'assistant' && <div className="mt-2 flex flex-wrap items-center gap-2"><button onClick={() => setSpeaking(speaking === index ? null : index)} className="flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-[0.12em] opacity-60 hover:opacity-100" aria-label="Read response aloud">{speaking === index ? <Pause size={12} /> : <Volume2 size={12} />} {speaking === index ? 'Stop audio' : 'Listen'}</button><span className="bg-[#E6E0D2] px-2 py-1 font-mono text-[9px] text-[#002147]">[Vol. 1, Speech 4]</span><span className="bg-[#E6E0D2] px-2 py-1 font-mono text-[9px] text-[#002147]">[Folio 18]</span></div>}</div>)}</div><form onSubmit={(event) => { event.preventDefault(); if (!event.nativeEvent.isComposing && (event as React.KeyboardEvent).keyCode !== 229) submitQuery() }} className="border-t border-[#002147]/15 bg-[#eeece4] p-4"><div className="flex items-center gap-2 border border-[#002147]/25 bg-[#F9F8F3] px-3 py-2"><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Ask Vichardhara.ai..." aria-label="Ask Vichardhara.ai" className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:opacity-45" /><button type="submit" aria-label="Send question" className="flex size-8 items-center justify-center bg-[#C56A35] text-[#F9F8F3] transition-colors hover:bg-[#002147]"><ArrowUp size={15} /></button></div><p className="mt-2 font-mono text-[9px] uppercase tracking-[0.12em] opacity-45">Grounded in the Ambedkar360 collection</p></form></aside></div>}
    </main>
  )
}
