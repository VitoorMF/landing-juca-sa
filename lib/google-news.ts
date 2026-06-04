import { XMLParser } from 'fast-xml-parser'
import { Noticia } from '@/types'

const QUERY = '"plantio direto" OR "carbono no solo" OR "carbon sequestration" OR "climate change" OR "carbon credits" OR "ecosystem services"'
const RSS_URL = `https://news.google.com/rss/search?q=${encodeURIComponent(QUERY)}&hl=pt-BR&gl=BR&ceid=BR:pt`

const GRADIENTS: [string, string][] = [
  ['#1a4731', '#2d6a4f'],
  ['#1b4332', '#40916c'],
  ['#0d3b2e', '#52b788'],
  ['#1e3a2f', '#2d6a4f'],
  ['#14532d', '#166534'],
]

const EMOJIS = ['🌱', '🌾', '🪱', '🌍', '🌿', '♻️', '🔬', '🌳']

function pickGradient(idx: number): [string, string] {
  return GRADIENTS[idx % GRADIENTS.length]
}

function pickEmoji(title: string, idx: number): string {
  if (/carbon|carbono/i.test(title)) return '🌍'
  if (/solo|soil/i.test(title)) return '🪱'
  if (/palha|cobertura/i.test(title)) return '🌾'
  if (/clima|climate/i.test(title)) return '♻️'
  return EMOJIS[idx % EMOJIS.length]
}

function formatDate(pubDate: string): string {
  try {
    return new Date(pubDate).toLocaleDateString('pt-BR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  } catch {
    return pubDate
  }
}

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, ' ')
    .trim()
}

function cleanTitle(title: string): string {
  return title.replace(/\s*[-–|]\s*[^-–|]+$/, '').trim()
}

interface RssItem {
  title: string
  link: string
  pubDate: string
  description?: string
  source?: { '#text'?: string; _name?: string } | string
}

export async function fetchGoogleNews(limit = 5): Promise<Noticia[]> {
  try {
    const res = await fetch(RSS_URL, {
      next: { revalidate: 3600 },
      headers: { 'User-Agent': 'Mozilla/5.0' },
    })

    if (!res.ok) return []

    const xml = await res.text()
    const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: '_' })
    const result = parser.parse(xml)
    const items: RssItem[] = result?.rss?.channel?.item ?? []

    const seen = new Set<string>()
    const unique = items.filter((item) => {
      if (seen.has(item.link)) return false
      seen.add(item.link)
      return true
    }).slice(0, limit)

    return unique.map((item, idx) => {
      const [from, to] = pickGradient(idx)
      const sourceName =
        typeof item.source === 'string'
          ? item.source
          : item.source?.['#text'] ?? item.source?._name ?? ''

      return {
        id: item.link ?? String(idx),
        titulo: cleanTitle(item.title ?? ''),
        descricao: item.description ? stripHtml(item.description) : '',
        data: formatDate(item.pubDate),
        tag: sourceName,
        emoji: pickEmoji(item.title ?? '', idx),
        gradientFrom: from,
        gradientTo: to,
        url: item.link,
        destaque: idx === 0,
      }
    })
  } catch {
    return []
  }
}
