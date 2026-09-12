'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, CheckCircle2, FileUp, Loader2, LogOut, ShieldCheck, XCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

type Status = 'idle' | 'loading' | 'success' | 'error'

export default function AdminPage() {
  const [authorized, setAuthorized] = useState<boolean | null>(null)
  const [title, setTitle] = useState('')
  const [subtitle, setSubtitle] = useState('')
  const [category, setCategory] = useState('Essay')
  const [year, setYear] = useState('')
  const [description, setDescription] = useState('')
  const [status, setStatus] = useState<'draft' | 'published'>('draft')
  const [featured, setFeatured] = useState(false)
  const [cover, setCover] = useState<File | null>(null)
  const [audio, setAudio] = useState<File | null>(null)
  const [formStatus, setFormStatus] = useState<Status>('idle')
  const [message, setMessage] = useState('')

  useEffect(() => {
    fetch('/api/admin').then((response) => setAuthorized(response.ok)).catch(() => setAuthorized(false))
  }, [])

  async function signOut() {
    await createClient().auth.signOut()
    window.location.href = '/auth/login'
  }

  async function upload(file: File) {
    const body = new FormData()
    body.append('file', file)
    const response = await fetch('/api/blob', { method: 'POST', body })
    if (!response.ok) throw new Error('File upload failed')
    return (await response.json()).url as string
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!title.trim()) return
    setFormStatus('loading')
    setMessage('Creating manuscript and uploading files...')
    try {
      const slug = title.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
      const manuscriptResponse = await fetch('/api/manuscripts', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug, title: title.trim(), subtitle: subtitle.trim() || null, category, year: year ? Number(year) : null, description: description.trim() || null, status, featured }),
      })
      if (!manuscriptResponse.ok) throw new Error('Could not create manuscript')
      const manuscript = (await manuscriptResponse.json()).data
      const files = [{ file: cover, kind: 'scan', title: 'Cover image' }, { file: audio, kind: 'audio', title: 'Audio narration' }]
      for (const item of files) {
        if (!item.file) continue
        const url = await upload(item.file)
        const mediaResponse = await fetch('/api/media', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ manuscript_id: manuscript.id, kind: item.kind, title: item.title, url, mime_type: item.file.type, alt_text: `${title} ${item.kind}` }) })
        if (!mediaResponse.ok) throw new Error('Manuscript created, but media attachment failed')
      }
      setFormStatus('success')
      setMessage(status === 'published' ? 'Published to the public archive.' : 'Saved as a draft. You can publish it later from the archive list.')
      setTitle(''); setSubtitle(''); setYear(''); setDescription(''); setCover(null); setAudio(null)
    } catch (error) {
      setFormStatus('error'); setMessage(error instanceof Error ? error.message : 'Something went wrong')
    }
  }

  if (authorized === null) return <main className="flex min-h-screen items-center justify-center bg-background text-sm text-muted-foreground">Checking admin access...</main>
  if (!authorized) return <main className="min-h-screen bg-background px-5 py-20 text-center text-foreground"><h1 className="text-3xl font-semibold">Admin access required</h1><p className="mx-auto mt-3 max-w-md text-sm text-muted-foreground">Sign in with an approved archive administrator account.</p><Link href="/auth/login" className="mt-6 inline-flex bg-accent px-4 py-2 text-xs font-bold text-accent-foreground">Sign in</Link></main>

  return <main className="min-h-screen bg-background text-foreground"><header className="flex items-center justify-between border-b border-foreground/10 px-5 py-5 lg:px-10"><Link href="/archive" className="inline-flex items-center gap-2 text-sm font-semibold transition-colors hover:text-accent"><ArrowLeft size={16} /> Back to archive</Link><button type="button" onClick={signOut} className="inline-flex items-center gap-2 text-sm font-semibold transition-colors hover:text-accent"><LogOut size={16} /> Sign out</button></header><section className="mx-auto max-w-5xl px-5 py-12 lg:px-10"><div className="mb-10"><p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-accent">Archive control room</p><h1 className="mt-3 text-5xl font-semibold tracking-[-0.06em]">Add to the archive.</h1><p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground">Create a manuscript, attach files, and choose whether it is immediately visible to readers.</p></div><form onSubmit={handleSubmit} className="grid gap-8 lg:grid-cols-[1fr_280px]"><div className="border border-foreground/10 bg-card p-6 sm:p-8"><div className="grid gap-5 sm:grid-cols-2"><label className="sm:col-span-2"><span className="mb-2 block text-xs font-bold uppercase tracking-wider">Title</span><input required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Annihilation of Caste" className="w-full border border-foreground/20 bg-background px-3 py-3 text-sm outline-none focus:border-primary" /></label><label><span className="mb-2 block text-xs font-bold uppercase tracking-wider">Subtitle</span><input value={subtitle} onChange={(e) => setSubtitle(e.target.value)} className="w-full border border-foreground/20 bg-background px-3 py-3 text-sm outline-none focus:border-primary" /></label><label><span className="mb-2 block text-xs font-bold uppercase tracking-wider">Year</span><input type="number" value={year} onChange={(e) => setYear(e.target.value)} className="w-full border border-foreground/20 bg-background px-3 py-3 text-sm outline-none focus:border-primary" /></label><label><span className="mb-2 block text-xs font-bold uppercase tracking-wider">Category</span><select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full border border-foreground/20 bg-background px-3 py-3 text-sm outline-none focus:border-primary"><option>Essay</option><option>Speech</option><option>Book</option><option>Letter</option><option>Writing</option></select></label><label className="sm:col-span-2"><span className="mb-2 block text-xs font-bold uppercase tracking-wider">Description</span><textarea rows={5} value={description} onChange={(e) => setDescription(e.target.value)} className="w-full resize-y border border-foreground/20 bg-background px-3 py-3 text-sm outline-none focus:border-primary" /></label></div></div><aside className="flex flex-col gap-5"><div className="border border-foreground/10 bg-card p-6"><div className="flex items-center gap-2 text-sm font-semibold"><ShieldCheck size={16} className="text-accent" /> Publishing</div><div className="mt-5 flex gap-2"><button type="button" onClick={() => setStatus('draft')} className={`flex-1 border px-3 py-2 text-xs font-bold ${status === 'draft' ? 'border-primary bg-primary text-primary-foreground' : 'border-foreground/20'}`}>Draft</button><button type="button" onClick={() => setStatus('published')} className={`flex-1 border px-3 py-2 text-xs font-bold ${status === 'published' ? 'border-primary bg-primary text-primary-foreground' : 'border-foreground/20'}`}>Publish</button></div><label className="mt-4 flex items-center gap-2 text-sm"><input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} /> Feature this work</label></div><div className="border border-foreground/10 bg-card p-6"><FileUp size={20} className="text-accent" /><h2 className="mt-3 text-lg font-semibold">Attach files</h2><p className="mt-1 text-xs leading-5 text-muted-foreground">Files are uploaded and attached automatically when you submit.</p><label className="mt-5 block text-xs font-bold uppercase tracking-wider">Cover or scan<input type="file" accept="image/*,.pdf" onChange={(e) => setCover(e.target.files?.[0] ?? null)} className="mt-2 block w-full text-xs" /></label><label className="mt-5 block text-xs font-bold uppercase tracking-wider">Audio narration<input type="file" accept="audio/*" onChange={(e) => setAudio(e.target.files?.[0] ?? null)} className="mt-2 block w-full text-xs" /></label></div><button disabled={formStatus === 'loading'} className="flex items-center justify-center gap-2 bg-accent px-5 py-3 text-sm font-bold text-accent-foreground transition-transform hover:-translate-y-0.5 disabled:opacity-50">{formStatus === 'loading' && <Loader2 size={16} className="animate-spin" />} Add to archive</button>{formStatus !== 'idle' && <div className={`flex items-start gap-2 text-sm ${formStatus === 'success' ? 'text-green-700' : formStatus === 'error' ? 'text-red-700' : 'text-muted-foreground'}`}>{formStatus === 'success' ? <CheckCircle2 size={17} /> : formStatus === 'error' ? <XCircle size={17} /> : null}<span>{message}</span></div>}</aside></form></section></main>
}
