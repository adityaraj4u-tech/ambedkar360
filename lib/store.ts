import { create } from 'zustand'

interface Manuscript {
  id: string
  title: string
  author: string
  year: number
  description: string
  pages: number
  image: string
  audioUrl: string
  duration: string
  confidence: number
  category: 'speech' | 'essay' | 'writing' | 'letter'
  tags: string[]
}

interface ManuscriptStore {
  manuscripts: Manuscript[]
  setManuscripts: (manuscripts: Manuscript[]) => void
  addManuscript: (manuscript: Manuscript) => void
  updateManuscript: (id: string, updates: Partial<Manuscript>) => void
  removeManuscript: (id: string) => void
  getManuscript: (id: string) => Manuscript | undefined
}

export const useManuscriptStore = create<ManuscriptStore>((set, get) => ({
  manuscripts: [],

  setManuscripts: (manuscripts) => set({ manuscripts }),

  addManuscript: (manuscript) =>
    set((state) => ({
      manuscripts: [...state.manuscripts, manuscript],
    })),

  updateManuscript: (id, updates) =>
    set((state) => ({
      manuscripts: state.manuscripts.map((m) =>
        m.id === id ? { ...m, ...updates } : m
      ),
    })),

  removeManuscript: (id) =>
    set((state) => ({
      manuscripts: state.manuscripts.filter((m) => m.id !== id),
    })),

  getManuscript: (id) => get().manuscripts.find((m) => m.id === id),
}))
