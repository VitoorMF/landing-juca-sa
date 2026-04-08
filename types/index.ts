export type TipoPublicacao = 'article' | 'book' | 'misc'

export interface Publicacao {
  id: string
  ano: string
  titulo: string
  autores: string
  revista: string
  tipo: TipoPublicacao
  subtipo?: string
  url?: string
}

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

export interface Apresentacao {
  id: string
  ano: string
  local: string
  titulo: string
  evento: string
  emoji: string
}

export interface Foto {
  id: string
  src: string
  label: string
  caption: string
  span?: boolean
}

export interface Link {
  id: string
  nome: string
  descricao: string
  emoji: string
  iconBg: 'green' | 'teal' | 'gold'
  url: string
}
