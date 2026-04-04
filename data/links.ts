export interface Link {
  id: string
  nome: string
  descricao: string
  emoji: string
  iconBg: 'green' | 'teal' | 'gold'
  url: string
}

export const links: Link[] = [
  { id: '1', nome: 'Google Scholar', descricao: 'Todas as publicações, citações e métricas de impacto científico (9.400+ citações).', emoji: '📚', iconBg: 'teal', url: 'https://scholar.google.com/citations?user=01cxZjoAAAAJ' },
  { id: '2', nome: 'ResearchGate', descricao: 'Perfil completo com laboratório, publicações e rede de colaboradores internacionais.', emoji: '🔗', iconBg: 'green', url: 'https://www.researchgate.net/profile/Joao-Carlos-Sa' },
  { id: '3', nome: 'Rattan Lal Center — OSU', descricao: 'Centro de Gestão e Sequestro de Carbono da The Ohio State University onde atua como pesquisador sênior.', emoji: '🏛️', iconBg: 'teal', url: 'https://carbon.osu.edu' },
  { id: '4', nome: 'FEBRAPDP', descricao: 'Federação Brasileira do SPD — Presidente da Comissão Técnico-Científica. Todas as notícias e eventos.', emoji: '🌾', iconBg: 'green', url: 'https://plantiodireto.org.br/tag/juca-sa' },
  { id: '5', nome: 'Curso — Manejo de Carbono', descricao: 'Curso online em 5 módulos: Manejo de Carbono com Juca Sá — IBRA Megalab.', emoji: '🎓', iconBg: 'gold', url: 'https://ibramegalab.ag/manejo-de-carbono-com-juca-sa/' },
  { id: '6', nome: 'LinkedIn', descricao: 'Perfil profissional com experiência, conexões e atualizações sobre pesquisas em andamento.', emoji: '💼', iconBg: 'teal', url: 'https://www.linkedin.com/in/jo%C3%A3o-carlos-moraes-s%C3%A1-99595330/' },
  { id: '7', nome: 'Artigo 2025 — ScienceDirect', descricao: 'Publicação histórica com Rattan Lal: "No-till systems restore soil organic carbon stock in Brazilian biomes."', emoji: '📄', iconBg: 'gold', url: 'https://www.sciencedirect.com/science/article/abs/pii/S004896972501006X' },
  { id: '8', nome: 'Academia.edu', descricao: 'Artigos e trabalhos disponíveis para download na plataforma acadêmica internacional.', emoji: '🎓', iconBg: 'green', url: 'https://independent.academia.edu/S%C3%A1Jo%C3%A3oCarlosDeMoraes' },
  { id: '9', nome: 'PubMed — Artigo 2025', descricao: 'Indexação na base PubMed do artigo landmark de 2025 sobre restauração de carbono no SPD.', emoji: '🧬', iconBg: 'teal', url: 'https://pubmed.ncbi.nlm.nih.gov/40239495/' },
]
