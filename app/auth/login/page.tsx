'use client'

import { FormEvent, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [pending, setPending] = useState(false)

  async function submit(event: FormEvent) {
    event.preventDefault()
    setPending(true)
    setError('')
    const { error: authError } = await createClient().auth.signInWithPassword({ email, password })
    if (authError) {
      const message = authError.message.toLowerCase()
      setError(message.includes('email not confirmed') ? 'Confirm your email before signing in.' : 'Invalid email or password.')
    } else window.location.href = '/admin'
    setPending(false)
  }

  return <main className="flex min-h-screen items-center justify-center bg-background px-5 text-foreground"><form onSubmit={submit} className="w-full max-w-md border border-foreground/15 bg-card p-8 shadow-lg"><Link href="/" className="font-mono text-xs font-bold tracking-[0.16em]">AMBEDKAR<span className="text-accent">360</span></Link><h1 className="mt-10 text-3xl font-semibold">Admin sign in</h1><p className="mt-2 text-sm leading-6 text-muted-foreground">Use an approved archive administrator account.</p><div className="mt-8 flex flex-col gap-4"><label className="flex flex-col gap-2 text-xs font-semibold">Email<input required type="email" value={email} onChange={(event) => setEmail(event.target.value)} className="border border-foreground/20 bg-background px-3 py-2.5 text-sm outline-none focus:border-primary" /></label><label className="flex flex-col gap-2 text-xs font-semibold">Password<input required type="password" value={password} onChange={(event) => setPassword(event.target.value)} className="border border-foreground/20 bg-background px-3 py-2.5 text-sm outline-none focus:border-primary" /></label>{error && <p role="alert" className="text-sm text-accent">{error}</p>}<button disabled={pending} className="bg-primary px-4 py-3 text-xs font-bold text-primary-foreground disabled:opacity-50">{pending ? 'Signing in...' : 'Sign in'}</button></div></form></main>
}
