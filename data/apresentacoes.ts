export interface Apresentacao {
  id: string
  ano: string
  local: string
  titulo: string
  evento: string
  emoji: string
}

export const apresentacoes: Apresentacao[] = [
  { id: '1', ano: '2025', local: 'Belém, Brasil', titulo: 'A contribuição do Sistema Plantio Direto na Adaptação e Mitigação na Agropecuária', evento: 'COP30 — Casa da Agricultura Sustentável (Abertura)', emoji: '🇺🇳' },
  { id: '2', ano: '2025', local: 'Balsas, MA', titulo: 'Plantio Direto como Solução para a Crise Climática', evento: 'Agrobalsas 2025 — FEBRAPDP', emoji: '🌾' },
  { id: '3', ano: '2022', local: 'Paraguai', titulo: 'Carbono no Solo, Plantas de Cobertura e Rotação de Culturas em Semeadura Direta', evento: 'ENSD — Encuentro Nacional de Siembra Directa', emoji: '🇵🇾' },
  { id: '4', ano: '2020', local: 'Internacional', titulo: 'Siembra Directa — Princípios e Resultados (em espanhol)', evento: 'Productiva TV — Congresso Internacional Siembra Directa', emoji: '🎓' },
  { id: '5', ano: 'Recorrente', local: 'Brasil', titulo: 'Congresso Brasileiro de Plantio Direto — Apresentações Científicas', evento: '17º e 18º Congresso Nacional SPD — Coordenador do Programa Científico', emoji: '🏆' },
  { id: '6', ano: '2006–2012', local: 'UEPG, Brasil', titulo: 'Curso Internacional de Matéria Orgânica do Solo', evento: '7 edições — Treinamento de pesquisadores de 11 países da Ásia e África', emoji: '🌍' },
]
