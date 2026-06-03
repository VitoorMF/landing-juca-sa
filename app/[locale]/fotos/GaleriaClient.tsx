'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import styles from './galeria.module.css'
import { Foto } from '@/types'

interface Props { fotos: Foto[], locale: string }

const HEIGHTS = ['h-l', 'h-m', 'h-s', 'h-m', 'h-l', 'h-s', 'h-m', 'h-l', 'h-s', 'h-m', 'h-s', 'h-m', 'h-s', 'h-l']

export default function GaleriaClient({ fotos, locale }: Props) {

  // Categorias únicas
  const cats = Array.from(new Set(fotos.map((f) => f.categoria).filter(Boolean) as string[]))

  const [ativa, setAtiva] = useState('Todas')
  const [lbIdx, setLbIdx] = useState<number | null>(null)

  const filtradas = ativa === 'Todas' ? fotos : fotos.filter((f) => f.categoria === ativa)

  const open = (idx: number) => setLbIdx(idx)
  const close = () => setLbIdx(null)
  const prev = useCallback(() => setLbIdx((i) => (i === null ? 0 : (i - 1 + filtradas.length) % filtradas.length)), [filtradas.length])
  const next = useCallback(() => setLbIdx((i) => (i === null ? 0 : (i + 1) % filtradas.length)), [filtradas.length])

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (lbIdx === null) return
      if (e.key === 'Escape') close()
      if (e.key === 'ArrowLeft') prev()
      if (e.key === 'ArrowRight') next()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [lbIdx, prev, next])

  const current = lbIdx !== null ? filtradas[lbIdx] : null

  return (
    <div className={styles.wrap}>
      {/* Voltar */}
      <Link href={`/${locale}`} className={styles.back}>← Voltar ao site</Link>

      {/* Header */}
      <header className={styles.head}>
        <span className={styles.eyebrow}>Galeria Completa</span>
        <h1 className={styles.title}>Acervo de Fotos</h1>
        <p className={styles.sub}>
          Registros de pesquisa em campo, congressos e o Sistema Plantio Direto ao longo dos anos.
          Filtre por tema e clique para ampliar.
        </p>
      </header>

      {/* Filtros */}
      <div className={styles.filters}>
        {['Todas', ...cats].map((cat) => {
          const count = cat === 'Todas' ? fotos.length : fotos.filter((f) => f.categoria === cat).length
          return (
            <button
              key={cat}
              className={`${styles.filter} ${ativa === cat ? styles.filterActive : ''}`}
              onClick={() => { setAtiva(cat); setLbIdx(null) }}
            >
              {cat}<span className={styles.filterN}>{count}</span>
            </button>
          )
        })}
      </div>

      {/* Masonry — 3 colunas explícitas para evitar reflow do column-count */}
      <div className={styles.masonry}>
        {[0, 1, 2].map((colIdx) => (
          <div key={colIdx} className={styles.masonryCol}>
            {filtradas
              .filter((_, i) => i % 3 === colIdx)
              .map((foto, i) => {
                const globalIdx = filtradas.indexOf(foto)
                return (
                  <div
                    key={foto.id}
                    className={`${styles.tile} ${styles[HEIGHTS[(globalIdx) % HEIGHTS.length]]}`}
                    onClick={() => open(globalIdx)}
                  >
                    <img src={foto.src} alt={foto.label} className={styles.tileImg} />
                    <div className={styles.tileScrim} />
                    <div className={styles.tileZoom}>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3M11 8v6M8 11h6" />
                      </svg>
                    </div>
                    <div className={styles.tileCap}>
                      {foto.categoria && <span className={styles.tileLoc}>{foto.categoria}</span>}
                      <span className={styles.tileT}>{foto.caption}</span>
                    </div>
                  </div>
                )
              })}
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {current && (
        <div className={styles.lb} onClick={close}>
          <button className={styles.lbClose} onClick={close} aria-label="Fechar">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
          <button className={`${styles.lbNav} ${styles.lbPrev}`} onClick={(e) => { e.stopPropagation(); prev() }}>‹</button>
          <button className={`${styles.lbNav} ${styles.lbNext}`} onClick={(e) => { e.stopPropagation(); next() }}>›</button>
          <div className={styles.lbFrame} onClick={(e) => e.stopPropagation()}>
            <img src={current.src} alt={current.label} className={styles.lbImg} />
            {current.caption && <div className={styles.lbCap}>{current.caption}</div>}
          </div>
        </div>
      )}
    </div>
  )
}
