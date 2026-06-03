'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import styles from './Fotos.module.css'
import { Foto } from '@/types'

interface Props {
  fotos: Foto[]
  locale: string
}

export default function FotosClient({ fotos, locale }: Props) {
  const [lbIdx, setLbIdx] = useState<number | null>(null)

  const open = (idx: number) => setLbIdx(idx)
  const close = () => setLbIdx(null)
  const prev = useCallback(() => setLbIdx((i) => (i === null ? 0 : (i - 1 + fotos.length) % fotos.length)), [fotos.length])
  const next = useCallback(() => setLbIdx((i) => (i === null ? 0 : (i + 1) % fotos.length)), [fotos.length])

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

  const current = lbIdx !== null ? fotos[lbIdx] : null

  return (
    <>
      <div className={styles.gallery}>
        {fotos.map((foto, idx) => (
          <div
            key={foto.id}
            className={`${styles.tile} ${foto.span ? styles.tileFeature : ''}`}
            onClick={() => open(idx)}
          >
            <img src={foto.src} alt={foto.label} className={styles.tileImg} />
            <div className={styles.tileScrim} />
            <div className={styles.tileZoom}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3M11 8v6M8 11h6" />
              </svg>
            </div>
            <div className={styles.tileCap}>
              {foto.categoria && <span className={styles.tileLoc}>{foto.categoria}</span>}
              <span className={styles.tileT}>{foto.caption}</span>
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className={styles.galleryCta}>
        <Link href={`/${locale}/fotos`}>
          Ver todas as fotos <span className={styles.ctaCount}>acervo completo</span> →
        </Link>
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
    </>
  )
}
