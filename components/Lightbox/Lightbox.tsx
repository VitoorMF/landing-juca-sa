'use client'

import { useEffect } from 'react'
import { useTranslations } from 'next-intl'
import Dialog from '@/components/ui/Dialog'
import { ChevronLeft, ChevronRight } from '@/components/ui/Icons'
import { Foto } from '@/types'
import styles from './Lightbox.module.css'

interface Props {
  fotos: Foto[]
  index: number | null
  onChange: (index: number | null) => void
}

export default function Lightbox({ fotos, index, onChange }: Props) {
  const t = useTranslations('fotos')
  const open = index !== null && fotos.length > 0
  const current = open ? fotos[index] : null
  const total = fotos.length

  useEffect(() => {
    if (!open) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'ArrowLeft') onChange(((index ?? 0) - 1 + total) % total)
      if (e.key === 'ArrowRight') onChange(((index ?? 0) + 1) % total)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, index, total, onChange])

  return (
    <Dialog open={open} onClose={() => onChange(null)} variant="media" label={current?.label || t('enlarge')}>
      {current && (
        <figure className={styles.figure}>
          <div className={styles.stage}>
            <img key={current.id} src={current.src} alt={current.label} className={styles.img} />
            {total > 1 && (
              <>
                <button type="button" className={`${styles.nav} ${styles.prev}`} onClick={() => onChange((index! - 1 + total) % total)} aria-label={t('prev')}>
                  <ChevronLeft />
                </button>
                <button type="button" className={`${styles.nav} ${styles.next}`} onClick={() => onChange((index! + 1) % total)} aria-label={t('next')}>
                  <ChevronRight />
                </button>
              </>
            )}
          </div>
          <figcaption className={styles.caption}>
            <span>
              {current.categoria && <span className={styles.cat}>{current.categoria}</span>}
              {current.caption || current.label}
            </span>
            {total > 1 && <span className={styles.count}>{index! + 1} / {total}</span>}
          </figcaption>
        </figure>
      )}
    </Dialog>
  )
}
