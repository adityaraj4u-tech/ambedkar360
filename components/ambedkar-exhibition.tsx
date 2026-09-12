'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import { ArrowRight, BookOpen, ChevronRight, Headphones, Languages, Maximize2, MessageCircle, Search, X } from 'lucide-react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Environment, Float, OrbitControls, Text } from '@react-three/drei'
import * as THREE from 'three'

const documents = [
  { year: '1936', title: 'Annihilation of Caste', type: 'Speech manuscript', source: 'BAWS Vol. 1, Page 142', excerpt: 'Political power is the key to all social progress.', color: '#d97706' },
  { year: '1949', title: 'Draft Constitution', type: 'Constitutional archive', source: 'Constituent Assembly Debates', excerpt: 'Democracy is not merely a form of government.', color: '#f59e0b' },
  { year: '1956', title: 'The Buddha and His Dhamma', type: 'Final manuscript', source: 'BAWS Vol. 11, Page 19', excerpt: 'The object of religion is to teach man how to think.', color: '#d97706' },
]

function Folio({ active, onSelect }: { active: number; onSelect: (index: number) => void }) {
  const group = useMemo(() => new THREE.Group(), [])
  useFrame((state) => {
    group.rotation.y = THREE.MathUtils.lerp(group.rotation.y, state.pointer.x * 0.12, 0.04)
    group.rotation.x = THREE.MathUtils.lerp(group.rotation.x, -state.pointer.y * 0.06, 0.04)
  })

  return <group ref={group} position={[1.2, 0, 0]}>
    <Float speed={1.2} rotationIntensity={0.08} floatIntensity={0.2}>
      <mesh position={[0, 0, 0]} rotation={[0.08, -0.2, 0.1]} onClick={() => onSelect((active + 1) % documents.length)}>
        <boxGeometry args={[2.9, 3.9, 0.16]} />
        <meshStandardMaterial color="#ead7b2" roughness={0.8} />
      </mesh>
      <mesh position={[0, 0, 0.1]} rotation={[0.08, -0.2, 0.1]}>
        <boxGeometry args={[2.56, 3.54, 0.02]} />
        <meshStandardMaterial color={documents[active].color} roughness={0.7} />
      </mesh>
      <mesh position={[0, 0, 0.13]} rotation={[0.08, -0.2, 0.1]}>
        <boxGeometry args={[2.18, 2.84, 0.02]} />
        <meshStandardMaterial color="#f5ead5" roughness={1} />
      </mesh>
      <Text position={[0, 0.9, 0.16]} rotation={[0.08, -0.2, 0.1]} fontSize={0.2} color="#0f172a" anchorX="center" font="/fonts/Inter_Bold.json">{documents[active].year}</Text>
      <Text position={[0, 0.25, 0.16]} rotation={[0.08, -0.2, 0.1]} fontSize={0.17} maxWidth={1.7} color="#0f172a" anchorX="center" textAlign="center" font="/fonts/Inter_Bold.json">{documents[active].title}</Text>
      <mesh position={[0, -0.7, 0.17]} rotation={[0.08, -0.2, 0.1]}>
        <boxGeometry args={[1.4, 0.02, 0.01]} />
        <meshStandardMaterial color="#d97706" />
      </mesh>
    </Float>
  </group>
}

function ExhibitionCanvas({ active, onSelect }: { active: number; onSelect: (index: number) => void }) {
  return <Canvas dpr={[1, 1.5]} camera={{ position: [0, 0, 7], fov: 35 }}>
    <ambientLight intensity={1.4} />
    <directionalLight position={[4, 6, 5]} intensity={3} />
    <Environment preset="studio" />
    <Folio active={active} onSelect={onSelect} />
    <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.25} />
  </Canvas>
}

export function AmbedkarExhibition() {
  const [active, setActive] = useState(0)
  const [inspectorOpen, setInspectorOpen] = useState(false)
  const [language, setLanguage] = useState('English')
  const doc = documents[active]

  return <div className="min-h-screen bg-background text-foreground">
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/90 px-5 py-4 backdrop-blur-xl lg:px-10">
      <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-6">
        <Link href="/" className="font-serif text-lg font-bold tracking-tight">Ambedkar<span className="text-accent">360</span></Link>
        <nav className="hidden items-center gap-8 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground md:flex"><Link href="/archive">Archive</Link><Link href="/biography">Life & work</Link><Link href="/timeline">Timeline</Link></nav>
        <Link href="/archive" className="flex min-h-12 items-center gap-2 bg-accent px-4 text-xs font-bold uppercase tracking-[0.12em] text-accent-foreground">Enter exhibition <ArrowRight size={15} /></Link>
      </div>
    </header>

    <main>
      <section className="relative overflow-hidden border-b border-border/70 bg-primary text-primary-foreground">
        <div className="mx-auto grid min-h-[680px] max-w-[1440px] items-center gap-8 px-5 py-16 lg:grid-cols-[0.9fr_1.1fr] lg:px-10 lg:py-20">
          <div className="relative z-10 max-w-2xl"><p className="font-mono text-[10px] uppercase tracking-[0.22em] text-accent">A digital heritage exhibition · open to all</p><h1 className="mt-7 font-serif text-6xl leading-[0.9] tracking-[-0.06em] text-balance sm:text-8xl">The archive is a living room.</h1><p className="mt-8 max-w-lg text-base leading-7 text-primary-foreground/70">Step inside the writings, speeches, and ideas of Dr. B. R. Ambedkar. Turn the page. Follow the argument. Stay with the source.</p><div className="mt-10 flex flex-wrap gap-3"><button type="button" onClick={() => setInspectorOpen(true)} className="flex min-h-12 items-center gap-3 bg-accent px-5 text-sm font-bold text-accent-foreground">Inspect featured folio <Maximize2 size={16} /></button><Link href="/timeline" className="flex min-h-12 items-center gap-2 border border-primary-foreground/30 px-5 text-sm font-semibold">Explore timeline <ArrowRight size={16} /></Link></div></div>
          <div className="relative h-[410px] lg:h-[560px]" aria-label="Interactive 3D archival folio"><ExhibitionCanvas active={active} onSelect={setActive} /><div className="pointer-events-none absolute bottom-4 left-4 font-mono text-[10px] uppercase tracking-[0.18em] text-primary-foreground/50">Click the folio to turn the page</div></div>
        </div>
      </section>

      <section className="border-b border-border bg-card"><div className="mx-auto grid max-w-[1440px] grid-cols-2 divide-x divide-border sm:grid-cols-4"><div className="p-6 lg:p-8"><p className="font-mono text-3xl font-bold">08</p><p className="mt-2 text-xs text-muted-foreground">Featured manuscripts</p></div><div className="p-6 lg:p-8"><p className="font-mono text-3xl font-bold">65+</p><p className="mt-2 text-xs text-muted-foreground">Years of public work</p></div><div className="p-6 lg:p-8"><p className="font-mono text-3xl font-bold">03</p><p className="mt-2 text-xs text-muted-foreground">Languages in progress</p></div><div className="p-6 lg:p-8"><p className="font-mono text-3xl font-bold">01</p><p className="mt-2 text-xs text-muted-foreground">Shared reading room</p></div></div></section>

      <section className="mx-auto max-w-[1440px] px-5 py-20 lg:px-10"><div className="flex flex-col justify-between gap-5 md:flex-row md:items-end"><div><p className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent">Document inspector</p><h2 className="mt-3 font-serif text-5xl tracking-[-0.05em]">Read the source, not just the summary.</h2></div><button type="button" onClick={() => setInspectorOpen(true)} className="flex min-h-12 items-center gap-2 self-start border border-border px-4 text-sm font-semibold">Open full inspector <ChevronRight size={16} /></button></div><div className="mt-10 grid overflow-hidden border border-border bg-card lg:grid-cols-[1.1fr_0.9fr]"><div className="flex min-h-[360px] items-center justify-center bg-muted p-8"><div className="w-full max-w-md rotate-[-2deg] border-8 border-primary bg-[#f5ead5] p-8 text-primary shadow-2xl"><p className="font-mono text-xs text-accent">{doc.year} / {doc.type}</p><h3 className="mt-14 font-serif text-4xl leading-none">{doc.title}</h3><div className="mt-12 h-px bg-accent/60" /><p className="mt-5 font-serif text-lg leading-7">“{doc.excerpt}”</p></div></div><div className="flex flex-col justify-between p-7 lg:p-10"><div><div className="flex items-center justify-between gap-4"><p className="font-mono text-xs uppercase tracking-[0.18em] text-accent">{doc.source}</p><Search size={18} className="text-muted-foreground" /></div><p className="mt-8 text-lg leading-8">The archive pairs a high-resolution facsimile with a searchable transcription, so every idea remains connected to its original material form.</p><div className="mt-8 flex flex-wrap gap-2">{['English', 'Marathi', 'Hindi'].map((item) => <button key={item} type="button" onClick={() => setLanguage(item)} className={`min-h-12 border px-4 text-xs font-bold ${language === item ? 'border-accent bg-accent text-accent-foreground' : 'border-border text-muted-foreground'}`}><Languages className="mr-2 inline" size={14} />{item}</button>)}</div></div><div className="mt-12 flex items-center justify-between border-t border-border pt-5 text-sm"><span className="flex items-center gap-2 text-muted-foreground"><Headphones size={16} /> Audio narration available</span><Link href="/archive" className="font-bold text-accent">Browse records <ArrowRight className="ml-1 inline" size={15} /></Link></div></div></div></section>

      <section className="border-y border-border bg-muted"><div className="mx-auto max-w-[1440px] px-5 py-20 lg:px-10"><div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]"><div><p className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent">Node timeline</p><h2 className="mt-3 font-serif text-5xl tracking-[-0.05em]">A life in motion.</h2><p className="mt-5 max-w-sm leading-7 text-muted-foreground">Trace the movements, arguments, and turning points that shaped a democratic imagination.</p></div><div className="grid gap-px bg-border sm:grid-cols-2">{[['1927','Mahad Satyagraha'],['1932','Poona Pact'],['1947','Drafting Committee'],['1956','Mahaparinirvan']].map(([year, title]) => <Link key={year} href="/timeline" className="group bg-background p-6 transition-colors hover:bg-card"><span className="font-mono text-xs text-accent">{year}</span><h3 className="mt-12 font-serif text-2xl">{title}</h3><span className="mt-5 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground group-hover:text-accent">Open node <ArrowRight size={14} /></span></Link>)}</div></div></div></section>

      <section className="mx-auto max-w-[1440px] px-5 py-16 lg:px-10"><div className="flex flex-col items-start justify-between gap-6 border border-border bg-card p-7 md:flex-row md:items-center lg:p-10"><div><p className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-accent"><MessageCircle size={15} /> Ambedkar AI Scholar</p><h2 className="mt-3 font-serif text-3xl">Ask with a source beside every answer.</h2><p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground">A citation-first research companion for navigating the archive. Every response points back to a volume, page, or primary document.</p></div><Link href="/scholar" className="flex min-h-12 items-center gap-2 bg-primary px-5 text-sm font-bold text-primary-foreground">Open scholar <ArrowRight size={16} /></Link></div></section>
    </main>

    {inspectorOpen && <div className="fixed inset-0 z-50 flex items-center justify-center bg-primary/80 p-5 backdrop-blur-md" role="dialog" aria-modal="true" aria-labelledby="inspector-title"><div className="max-h-[90vh] w-full max-w-5xl overflow-auto border border-border bg-background"><div className="flex items-center justify-between border-b border-border p-5"><div><p className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent">Primary source inspector</p><h2 id="inspector-title" className="mt-2 font-serif text-3xl">{doc.title}</h2></div><button type="button" onClick={() => setInspectorOpen(false)} className="flex size-12 items-center justify-center border border-border" aria-label="Close inspector"><X size={20} /></button></div><div className="grid lg:grid-cols-2"><div className="min-h-[360px] bg-muted p-8"><div className="flex h-full min-h-[320px] items-center justify-center border-8 border-primary bg-[#f5ead5] p-10 text-primary"><div><p className="font-mono text-xs text-accent">{doc.year} / FACSIMILE</p><h3 className="mt-10 font-serif text-5xl leading-none">{doc.title}</h3><p className="mt-8 font-serif text-xl leading-8">{doc.excerpt}</p></div></div></div><div className="p-8"><div className="flex items-center justify-between"><span className="font-mono text-xs text-accent">{doc.source}</span><button type="button" className="flex items-center gap-2 text-xs font-bold"><Headphones size={16} /> Listen</button></div><p className="mt-8 leading-8">{doc.excerpt} This exhibition view keeps the transcription beside the document, inviting close reading across language, material, and historical context.</p><div className="mt-10 border-t border-border pt-6"><p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Related records</p><div className="mt-4 flex flex-col gap-3">{documents.filter((_, index) => index !== active).map((item, index) => <button key={item.title} type="button" onClick={() => setActive(index >= active ? index + 1 : index)} className="flex items-center justify-between border-b border-border pb-3 text-left text-sm font-semibold">{item.title}<ChevronRight size={16} className="text-accent" /></button>)}</div></div></div></div></div></div>}
  </div>
}
