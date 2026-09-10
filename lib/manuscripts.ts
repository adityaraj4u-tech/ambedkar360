export interface Manuscript {
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

export const manuscripts: Manuscript[] = [
  {
    id: 'annihilation-of-caste',
    title: 'Annihilation of Caste',
    author: 'B. R. Ambedkar',
    year: 1936,
    description: 'A seminal work arguing for social reform through changing minds and establishing equality, liberty, and fraternity as foundations of democracy.',
    pages: 42,
    image: '/manuscripts/annihilation-of-caste.png',
    audioUrl: '/audio/annihilation-of-caste.mp3',
    duration: '1:23:45',
    confidence: 98.4,
    category: 'essay',
    tags: ['social reform', 'democracy', 'equality'],
  },
  {
    id: 'dr-ambedkar-contribution-to-indian-constitution',
    title: 'Dr. Ambedkar\'s Contribution to Indian Constitution',
    author: 'B. R. Ambedkar',
    year: 1949,
    description: 'A comprehensive analysis of Dr. Ambedkar\'s role as the principal architect of the Indian Constitution, outlining fundamental rights and social justice principles.',
    pages: 38,
    image: '/manuscripts/constitution.png',
    audioUrl: '/audio/constitution-contribution.mp3',
    duration: '1:45:20',
    confidence: 97.8,
    category: 'essay',
    tags: ['constitution', 'rights', 'justice'],
  },
  {
    id: 'the-buddha-and-his-dhamma',
    title: 'The Buddha and His Dhamma',
    author: 'B. R. Ambedkar',
    year: 1956,
    description: 'Ambedkar\'s reinterpretation of Buddhism as a path to social equality and human dignity, published posthumously.',
    pages: 55,
    image: '/manuscripts/buddha-dhamma.png',
    audioUrl: '/audio/buddha-dhamma.mp3',
    duration: '2:10:15',
    confidence: 96.5,
    category: 'essay',
    tags: ['buddhism', 'philosophy', 'spirituality'],
  },
  {
    id: 'thoughts-on-pakistan',
    title: 'Thoughts on Pakistan',
    author: 'B. R. Ambedkar',
    year: 1941,
    description: 'A critical examination of the partition of India and its implications for the Indian subcontinent.',
    pages: 32,
    image: '/manuscripts/pakistan.png',
    audioUrl: '/audio/thoughts-pakistan.mp3',
    duration: '58:30',
    confidence: 97.2,
    category: 'essay',
    tags: ['partition', 'politics', 'history'],
  },
  {
    id: 'millworkers-of-india-speech',
    title: 'Speech to Millworkers',
    author: 'B. R. Ambedkar',
    year: 1938,
    description: 'An inspiring speech delivered to millworkers addressing labor rights, dignity, and economic justice.',
    pages: 18,
    image: '/manuscripts/millworkers.png',
    audioUrl: '/audio/millworkers-speech.mp3',
    duration: '45:20',
    confidence: 96.8,
    category: 'speech',
    tags: ['labor', 'rights', 'economics'],
  },
  {
    id: 'conversion-to-buddhism-speech',
    title: 'Conversion to Buddhism Speech',
    author: 'B. R. Ambedkar',
    year: 1956,
    description: 'Historic speech at Ambedkar\'s mass conversion to Buddhism ceremony in Nagpur, declaring a new path for social equality.',
    pages: 24,
    image: '/manuscripts/conversion.png',
    audioUrl: '/audio/conversion-speech.mp3',
    duration: '1:02:15',
    confidence: 98.1,
    category: 'speech',
    tags: ['buddhism', 'conversion', 'equality'],
  },
  {
    id: 'untouchability-source-cause-remedy',
    title: 'Untouchability: Source, Cause and Remedy',
    author: 'B. R. Ambedkar',
    year: 1935,
    description: 'A powerful treatise analyzing the origins of untouchability in Indian society and proposing comprehensive solutions.',
    pages: 48,
    image: '/manuscripts/untouchability.png',
    audioUrl: '/audio/untouchability.mp3',
    duration: '1:56:45',
    confidence: 97.9,
    category: 'essay',
    tags: ['untouchability', 'caste', 'discrimination'],
  },
  {
    id: 'women-of-india-speech',
    title: 'Women of India',
    author: 'B. R. Ambedkar',
    year: 1942,
    description: 'A visionary speech on women\'s education, rights, and their role in building a democratic nation.',
    pages: 22,
    image: '/manuscripts/women.png',
    audioUrl: '/audio/women-speech.mp3',
    duration: '52:30',
    confidence: 97.5,
    category: 'speech',
    tags: ['women', 'education', 'rights'],
  },
]

export function getManuscriptById(id: string): Manuscript | undefined {
  return manuscripts.find((m) => m.id === id)
}

export function getManuscriptsByCategory(category: Manuscript['category']): Manuscript[] {
  return manuscripts.filter((m) => m.category === category)
}

export function getManuscriptsByTag(tag: string): Manuscript[] {
  return manuscripts.filter((m) => m.tags.includes(tag))
}

export function getAllTags(): string[] {
  const tagSet = new Set<string>()
  manuscripts.forEach((m) => m.tags.forEach((t) => tagSet.add(t)))
  return Array.from(tagSet).sort()
}
