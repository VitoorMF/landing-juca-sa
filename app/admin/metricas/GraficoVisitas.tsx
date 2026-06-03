'use client'

import { useState } from 'react'
import styles from './page.module.css'
import InfoTip from './InfoTip'

export interface PontoSerie {
  data: string
  visitas: number
  visualizacoes: number
}

function formatarData(iso: string, unit: 'day' | 'month'): string {
  const d = new Date(unit === 'month' ? `${iso}-01T00:00:00` : `${iso}T00:00:00`)
  if (isNaN(d.getTime())) return iso
  return unit === 'month'
    ? d.toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' })
    : d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
}

export default function GraficoVisitas({ serie, unit }: { serie: PontoSerie[]; unit: 'day' | 'month' }) {
  const [hover, setHover] = useState<number | null>(null)

  if (!serie.length) {
    return <div className={styles.vazio}>Sem dados no período</div>
  }

  const max = Math.max(...serie.map(p => p.visualizacoes), 1)
  const totalVis = serie.reduce((s, p) => s + p.visitas, 0)
  const totalPv = serie.reduce((s, p) => s + p.visualizacoes, 0)

  return (
    <div className={styles.chartWrap}>
      <div className={styles.chartLegend}>
        <span className={styles.chartLegendItem}>
          <span className={styles.chartDotPv} /> {totalPv.toLocaleString('pt-BR')} visualizações
          <InfoTip texto="Total de páginas abertas. A mesma pessoa que vê 5 páginas gera 5 visualizações." />
        </span>
        <span className={styles.chartLegendItem}>
          <span className={styles.chartDotVis} /> {totalVis.toLocaleString('pt-BR')} visitas
          <InfoTip texto="Quantas sessões começaram — ou seja, quantas vezes alguém entrou no site, independente de quantas páginas viu." />
        </span>
      </div>

      <div className={styles.chartBars}>
        {serie.map((p, i) => (
          <div
            key={p.data}
            className={styles.chartCol}
            onMouseEnter={() => setHover(i)}
            onMouseLeave={() => setHover(null)}
          >
            {hover === i && (
              <div className={styles.chartTooltip}>
                <strong>{formatarData(p.data, unit)}</strong>
                <span>{p.visualizacoes} visualizações</span>
                <span>{p.visitas} visitas</span>
              </div>
            )}
            <div className={styles.chartBarTrack}>
              <div
                className={`${styles.chartBar} ${hover === i ? styles.chartBarHover : ''}`}
                style={{ height: `${(p.visualizacoes / max) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className={styles.chartAxis}>
        {serie.map((p, i) => {
          const step = Math.max(1, Math.ceil(serie.length / 8))
          if (i % step !== 0 && i !== serie.length - 1) return <span key={p.data} />
          return <span key={p.data} className={styles.chartAxisLabel}>{formatarData(p.data, unit)}</span>
        })}
      </div>
    </div>
  )
}
