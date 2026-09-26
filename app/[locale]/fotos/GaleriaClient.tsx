'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import Lightbox from '@/components/Lightbox/Lightbox'
import { Foto } from '@/types'
import styles from './galeria.module.css'

const ALL = '__all__'

export default function GaleriaClient({ fotos }: { fotos: Foto[] }) {
  const t = useTranslations('fotos')
  const cats = Array.from(new Set(fotos.map((f) => f.categoria).filter(Boolean) as string[]))

  const [ativa, setAtiva] = useState(ALL)
  const [lbIdx, setLbIdx] = useState<number | null>(null)

  const filtradas = ativa === ALL ? fotos : fotos.filter((f) => f.categoria === ativa)

  if (fotos.length === 0) {
    return <p className={styles.empty}>{t('empty')}</p>
  }

  return (
    <>
      {cats.length > 0 && (
        <div className={`${styles.filters} reveal`} role="group" aria-label={t('filtersLabel')}>
          {[ALL, ...cats].map((cat) => {
            const count = cat === ALL ? fotos.length : fotos.filter((f) => f.categoria === cat).length
            return (
              <button
                key={cat}
                type="button"
                className={styles.filter}
                aria-pressed={ativa === cat}
                onClick={() => { setAtiva(cat); setLbIdx(null) }}
              >
                {cat === ALL ? t('all') : cat}
                <span className={styles.count}>{count}</span>
              </button>
            )
          })}
        </div>
      )}

      <ul className={styles.masonry}>
        {filtradas.map((foto, idx) => (
          <li key={foto.id} className={styles.item}>
            <button
              type="button"
              className={styles.tile}
              onClick={() => setLbIdx(idx)}
              aria-label={`${t('enlarge')}: ${foto.caption || foto.label}`}
              aria-haspopup="dialog"
            >
              <img src={foto.src} alt={foto.label} loading="lazy" decoding="async" className={styles.img} />
            </button>
            {(foto.caption || foto.categoria) && (
              <p className={styles.cap}>
                {foto.categoria && <span className={styles.cat}>{foto.categoria}</span>}
                {foto.caption}
              </p>
            )}
          </li>
        ))}
      </ul>

      <Lightbox fotos={filtradas} index={lbIdx} onChange={setLbIdx} />
    </>
  )
}
