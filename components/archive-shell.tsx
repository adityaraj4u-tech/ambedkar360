'use client'

import Link from 'next/link'
import { useState } from 'react'
import { BookOpen, Menu, Search, X } from 'lucide-react'

const links = [
  ['Archive', '/archive'], ['Timeline', '/timeline'], ['Biography', '/biography'], ['Resources', '/resources'], ['About', '/about'],
]

export function ArchiveShell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  return <div className="min-h-screen bg-background text-foreground">
    <header className="sticky top-0 z-50 border-b border-foreground/10 bg-background/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
        <Link href="/" className="flex items-center gap-3" onClick={() => setOpen(false)}><span className="flex size-9 items-center justify-center rounded-full bg-primary text-primary-foreground"><BookOpen size={16} /></span><span className="font-mono text-xs font-bold tracking-[0.18em]">AMBEDKAR<span className="text-accent">360</span></span></Link>
        <nav className="hidden items-center gap-6 lg:flex">{links.map(([label, href]) => <Link key={href} href={href} className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground transition-colors hover:text-accent">{label}</Link>)}<Link href="/archive" className="flex items-center gap-2 border border-foreground/20 px-3 py-2 font-mono text-[10px] font-bold uppercase tracking-[0.12em] transition-colors hover:border-primary hover:bg-primary hover:text-primary-foreground"><Search size={13} /> Search</Link></nav>
        <button className="lg:hidden" onClick={() => setOpen(!open)} aria-label={open ? 'Close navigation' : 'Open navigation'}>{open ? <X size={20} /> : <Menu size={20} />}</button>
      </div>
      {open && <nav className="flex flex-col gap-5 border-t border-foreground/10 px-5 py-6 lg:hidden">{links.map(([label, href]) => <Link key={href} href={href} onClick={() => setOpen(false)} className="font-mono text-xs uppercase tracking-[0.16em]">{label}</Link>)}<Link href="/archive" onClick={() => setOpen(false)} className="flex items-center gap-2 text-sm font-semibold text-accent"><Search size={14} /> Search the archive</Link></nav>}
    </header>
    {children}
    <footer className="border-t border-foreground/10 px-5 py-8 lg:px-8"><div className="mx-auto flex max-w-7xl flex-col gap-3 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between"><span>Access is a right, not a privilege.</span><span className="font-mono text-[10px] uppercase tracking-[0.14em]">A living digital archive</span></div></footer>
  </div>
}

export function Eyebrow({ children }: { children: React.ReactNode }) { return <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-accent">{children}</p> }
export function Rule() { return <div className="h-px bg-foreground/10" /> }
