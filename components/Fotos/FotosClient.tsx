'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import Lightbox from '@/components/Lightbox/Lightbox'
import { ArrowRight } from '@/components/ui/Icons'
import { Foto } from '@/types'
import styles from './Fotos.module.css'

export default function FotosClient({ fotos }: { fotos: Foto[] }) {
  const t = useTranslations('fotos')
  const [lbIdx, setLbIdx] = useState<number | null>(null)

  if (fotos.length === 0) {
    return <p className={styles.empty}>{t('empty')}</p>
  }

  return (
    <>
      <ul className={`${styles.gallery} reveal`} data-count={fotos.length}>
        {fotos.map((foto, idx) => (
          <li key={foto.id} className={idx === 0 ? styles.feature : undefined}>
            <button
              type="button"
              className={styles.tile}
              onClick={() => setLbIdx(idx)}
              aria-label={`${t('enlarge')}: ${foto.caption || foto.label}`}
              aria-haspopup="dialog"
            >
              {/* fotos vêm do storage do Supabase, em tamanhos variados */}
              <img src={foto.src} alt={foto.label} loading="lazy" decoding="async" className={styles.img} />
              {(foto.caption || foto.categoria) && (
                <span className={styles.cap}>
                  {foto.categoria && <span className={styles.cat}>{foto.categoria}</span>}
                  {foto.caption}
                </span>
              )}
            </button>
          </li>
        ))}
      </ul>

      <div className={styles.footer}>
        <Link href="/fotos" className="btn-line">
          {t('seeAll')} <ArrowRight />
        </Link>
      </div>

      <Lightbox fotos={fotos} index={lbIdx} onChange={setLbIdx} />
    </>
  )
}
