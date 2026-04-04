export interface ItemImpacto {
  id: string
  numero: string
  sufixo: string
  label: string
}

export const itensImpacto: ItemImpacto[] = [
  { id: '1', numero: '59', sufixo: 'M', label: 'toneladas de CO₂-eq mitigadas pelo SPD brasileiro em 2020' },
  { id: '2', numero: '25', sufixo: '%', label: 'das fazendas estudadas já superam o carbono da mata nativa' },
  { id: '3', numero: '7B', sufixo: 't', label: 'de erosão evitada em 50 anos (US$ 34–101 bi em ativos preservados)' },
  { id: '4', numero: '40', sufixo: '%', label: 'mais rentabilidade para quem adota os 3 pilares do SPD corretamente' },
]
