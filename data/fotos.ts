export interface Foto {
  id: string
  src: string
  label: string
  caption: string
  span?: boolean
}

export const fotos: Foto[] = [
  { id: '1', src: '/imagem.png', label: '7,4 ton/ha de palhada de Aveia preta Faz. Paiqueré-PR', caption: '7,4 ton/ha de palhada de Aveia preta Faz. Paiqueré-PR', span: true },
  { id: '2', src: '/image2.png', label: 'Soja em Plantio Direto', caption: 'Soja em Plantio Direto' },
  { id: '3', src: '/image3.png', label: 'Soja em Plantio Direto', caption: 'Soja em Plantio Direto' },
  { id: '4', src: '/image4.png', label: '🌾 Do solo nasce o futuro: trabalho no campo com práticas sustentáveis que valorizam cada safra.', caption: '🌾 Do solo nasce o futuro: trabalho no campo com práticas sustentáveis que valorizam cada safra.' },
  { id: '5', src: '/image5.png', label: 'Soja em Plantio Direto', caption: 'Soja em Plantio Direto' },
  { id: '6', src: '/image6.png', label: 'Palhada de soja', caption: 'Palhada de soja' },
]
