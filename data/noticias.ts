export interface Noticia {
  id: string
  data: string
  titulo: string
  descricao: string
  tag: string
  emoji: string
  gradientFrom: string
  gradientTo: string
  url?: string
  destaque?: boolean
}

export const noticias: Noticia[] = [
  {
    id: '1',
    data: 'Novembro 2025',
    titulo: 'Sistema Plantio Direto é Destaque na COP30 com Resultados Inéditos de Sequestro de Carbono',
    descricao: 'Prof. Juca Sá apresentou na abertura da Casa da Agricultura Sustentável dados pioneiros mostrando que 25,4% das fazendas estudadas já superam os estoques de carbono da vegetação nativa — resultado de estudo publicado com o Nobel da Paz Prof. Rattan Lal.',
    tag: 'COP30 · 2025',
    emoji: '🌡️',
    gradientFrom: '#1E3A1F',
    gradientTo: '#2C5F2D',
    destaque: true,
  },
  {
    id: '2',
    data: 'Agrolink · 2025',
    titulo: 'SPD Restaura Estoque de Carbono e Contribui para Soluções Climáticas',
    descricao: '',
    tag: '',
    emoji: '🌱',
    gradientFrom: '#2C5F2D',
    gradientTo: '#4A7C59',
    url: 'https://www.agrolink.com.br/noticias/sistema-de-plantio-direto-restaura-estoque-de-carbono-do-solo-e-contribui-para-solucoes-climaticas_507282.html',
  },
  {
    id: '3',
    data: 'Revista Cultivar',
    titulo: 'Boas Práticas de Manejo Conservacionista Acumulam Carbono e Impulsionam Produtividade',
    descricao: '',
    tag: '',
    emoji: '📖',
    gradientFrom: '#6B4C2A',
    gradientTo: '#8B6914',
    url: 'https://revistacultivar.com.br/artigos/boas-praticas-de-manejo-conservacionista-ajudam-a-acumular-carbono-no-solo-e-podem-impulsionar-produtividade',
  },
  {
    id: '4',
    data: 'Ohio State University · Verão 2024',
    titulo: 'From the Desk of Prof. João Carlos de Moraes Sá — Rattan Lal Center Newsletter',
    descricao: '',
    tag: '',
    emoji: '🏛️',
    gradientFrom: '#003d2a',
    gradientTo: '#00695c',
    url: 'https://carbon.osu.edu/lal-carbon-center-newsletter-summer-2024/desk-professor-jo%C3%A3o-carlos-de-moraes-s%C3%A1-juca-s%C3%A1',
  },
  {
    id: '5',
    data: 'Revista Cultivar',
    titulo: 'SPD tem Desafios e Metas a Atingir nos Próximos 10 Anos',
    descricao: '',
    tag: '',
    emoji: '🎯',
    gradientFrom: '#1a3d1a',
    gradientTo: '#3d7a3e',
    url: 'https://revistacultivar.com.br/noticias/sistema-plantio-direto-tem-desafios-e-metas-a-serem-atingidas-nos-proximos-10-anos',
  },
]
