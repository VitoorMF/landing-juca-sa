export interface Video {
  id: string
  titulo: string
  meta: string
  label: string
  emoji: string
  gradientFrom: string
  gradientTo: string
  url: string
}

export const videos: Video[] = [
  {
    id: '1',
    titulo: 'Manejo de Carbono com Juca Sá',
    meta: '🎓 IBRA Megalab · 5 módulos',
    label: 'Curso Online',
    emoji: '🌱',
    gradientFrom: '#1E3A1F',
    gradientTo: '#2C5F2D',
    url: 'https://www.youtube.com/watch?v=sKLv4FFkWvY',
  },
  {
    id: '2',
    titulo: 'Proteção do Solo — 16/19 tons de Palha por Hectare',
    meta: '📺 Notícias Agrícolas · 17º Congresso SPD',
    label: 'Entrevista',
    emoji: '🎙️',
    gradientFrom: '#0d2e0e',
    gradientTo: '#1E3A1F',
    url: 'https://www.noticiasagricolas.com.br/videos/agronegocio/275057',
  },
  {
    id: '3',
    titulo: 'Siembra Directa — Congresso Internacional (Espanhol)',
    meta: '📡 Productiva TV · Janeiro 2020',
    label: 'Internacional',
    emoji: '🌍',
    gradientFrom: '#1a3d1a',
    gradientTo: '#2C5F2D',
    url: 'https://www.facebook.com/productivatv/videos/152710779505008/',
  },
  {
    id: '4',
    titulo: 'Plantio Direto como Solução para a Crise Climática',
    meta: '🌾 Agrobalsas 2025 · FEBRAPDP',
    label: 'Congresso 2025',
    emoji: '🌡️',
    gradientFrom: '#003d2a',
    gradientTo: '#00695c',
    url: 'https://plantiodireto.org.br/agrobalsas-2025-o-plantio-direto-como-solucao-para-a-crise-climatica',
  },
]
