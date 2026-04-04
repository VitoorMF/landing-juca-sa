export interface Citacao {
  id: string
  texto: string
  fonte: string
}

export interface Principio {
  id: string
  numero: number
  titulo: string
  descricao: string
}

export const principios: Principio[] = [
  {
    id: '1',
    numero: 1,
    titulo: 'Mínimo Revolvimento do Solo',
    descricao: 'O solo é perturbado apenas na linha de semeadura. Não há aração nem gradagem convencional. A estrutura natural e os agregados do solo são preservados.',
  },
  {
    id: '2',
    numero: 2,
    titulo: 'Cobertura Permanente do Solo',
    descricao: 'Plantas vivas ou palha durante todo o ano. Requer 16–19 t/ha de biomassa/palha para garantir proteção contínua e alimentar a biota do solo o ano inteiro.',
  },
  {
    id: '3',
    numero: 3,
    titulo: 'Rotação Diversificada de Culturas',
    descricao: 'Diversidade de espécies vegetais em rotação para aumentar a qualidade e quantidade de biomassa-C, estimular a biota edáfica e romper ciclos de pragas e doenças.',
  },
]

export const citacoes: Citacao[] = [
  {
    id: '1',
    texto: 'O resíduo das culturas é o alimento do solo, e ao alimentar o solo, alimentamos os seres humanos — e a agricultura pode contribuir para minimizar a crise climática.',
    fonte: 'Prof. Juca Sá — FEBRAPDP / COP30, Belém 2025',
  },
  {
    id: '2',
    texto: 'O Sistema Plantio Direto, fundamentado nos seus princípios, tem a capacidade de recuperar o carbono, alcançando níveis semelhantes aos da mata nativa.',
    fonte: 'Science of the Total Environment, 2025 (Sá & Lal)',
  },
  {
    id: '3',
    texto: 'Expandir um hectare de plantio direto correto pode compensar a preservação de um hectare de floresta em termos de contabilidade de carbono.',
    fonte: 'Entrevista — Notícias Agrícolas / 17º Congresso Nacional SPD',
  },
  {
    id: '4',
    texto: 'A implementação plena do SPD poderia mitigar 211 milhões de toneladas de CO₂-eq por ano no Brasil — mais de 10% de todas as emissões do agronegócio.',
    fonte: 'Prof. Juca Sá — Agrobalsas 2025',
  },
]
