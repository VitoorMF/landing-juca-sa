'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import styles from './Hero.module.css'

interface Props {
  label: string
}

export default function WelcomeModal({ label }: Props) {
  const t = useTranslations('welcomeModal')
  const [open, setOpen] = useState(false)

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  const b = (chunks: React.ReactNode) => <strong>{chunks}</strong>

  return (
    <>
      <button className={styles.heroEyebrow} onClick={() => setOpen(true)}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" style={{ width: 15, height: 15 }}>
          <path d="M11 20A7 7 0 0 1 4 13C4 8 9 4 20 4c0 11-4 16-9 16z" /><path d="M11 20c0-5 2-9 7-12" />
        </svg>
        {label}
      </button>

      {open && (
        <div className={styles.modalOverlay} onClick={() => setOpen(false)}>
          <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <button className={styles.modalClose} onClick={() => setOpen(false)} aria-label="Fechar">
              ✕
            </button>

            <h2 className={styles.modalTitle}>{t('title')}</h2>

            <p>{t.rich('p1', { b })}</p>
            <p>{t('p2')}</p>

            <h3 className={styles.modalSubtitle}>{t('subtitle1')}</h3>

            <p>{t.rich('p3', { b })}</p>
            <p>{t.rich('p4', { b })}</p>

            <h3 className={styles.modalSubtitle}>{t('subtitle2')}</h3>

            <p>{t('p5')}</p>

            <p className={styles.modalWelcome}>{t('welcome')}</p>
          </div>
        </div>
      )}
    </>
  )
}
