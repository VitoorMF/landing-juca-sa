'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import styles from './Hero.module.css'
import { Modulo } from '@/types'

export default function CourseModal({ modulos = [] }: { modulos?: Modulo[] }) {
  const t = useTranslations('courseModal')
  const th = useTranslations('hero')
  const [open, setOpen] = useState(false)

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  const b = (chunks: React.ReactNode) => <strong>{chunks}</strong>
  const i = (chunks: React.ReactNode) => <em>{chunks}</em>

  // Fallback para os textos estáticos caso a tabela esteja vazia
  const fallback = (t.raw('modules') as { title: string; desc: string }[])
    .map((m, idx) => ({ id: String(idx), ordem: idx + 1, titulo: m.title, descricao: m.desc, url: '', liberado: idx === 0 }))
  const modules: Modulo[] = modulos && modulos.length ? modulos : fallback

  const liberados = modules.filter(m => m.liberado).length

  return (
    <>
      <button className="btn-gold" onClick={() => setOpen(true)}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" style={{ width: 18, height: 18 }}>
          <path d="M11 20A7 7 0 0 1 4 13C4 8 9 4 20 4c0 11-4 16-9 16z" /><path d="M11 20c0-5 2-9 7-12" />
        </svg>
        {th('courseBtn')}
      </button>

      {open && (
        <div className={styles.modalOverlay} onClick={() => setOpen(false)}>
          <div className={styles.courseModal} onClick={e => e.stopPropagation()}>

            <button className={styles.modalClose} onClick={() => setOpen(false)} aria-label="Fechar">✕</button>

            {/* Header */}
            <div className={styles.courseModalBadge}>{t('badge')}</div>
            <h2 className={styles.courseModalTitle}>{t('title')}</h2>

            {/* Intro text */}
            <p className={styles.courseModalGreeting}>{t('greeting')}</p>
            <p className={styles.courseModalDesc}>{t('p1')}</p>
            <p className={styles.courseModalDesc}>{t.rich('p2', { b })}</p>

            <h3 className={styles.courseModalSub}>{t('sub1')}</h3>
            <p className={styles.courseModalDesc}>{t.rich('p3', { b, i })}</p>
            <p className={styles.courseModalDesc}>{t('p4')}</p>

            <h3 className={styles.courseModalSub}>{t('sub2')}</h3>
            <p className={styles.courseModalDesc}>{t.rich('p5', { b })}</p>

            {/* Module rows */}
            <div className={styles.courseModalDivider} />
            <div className={styles.courseModalModulesHeader}>
              {t('modulesLabel')}{' '}
              <span className={styles.courseModalModulesHighlight}>{liberados} / {modules.length} {t('unlockedWord')}</span>
            </div>

            <ul className={styles.courseModalList}>
              {modules.map((m, i) => {
                const clickable = m.liberado && m.url
                const Wrapper = clickable ? 'a' : 'li'
                const wrapperProps = clickable
                  ? { href: m.url, target: '_blank', rel: 'noopener noreferrer' }
                  : {}
                return (
                  <Wrapper
                    key={m.id ?? i}
                    className={m.liberado ? styles.courseModuleAvailable : styles.courseModuleLocked}
                    {...(wrapperProps as Record<string, string>)}
                  >
                    <div className={m.liberado ? styles.courseModuleNumActive : styles.courseModuleNumLocked}>
                      {m.liberado ? String(i + 1).padStart(2, '0') : <span className={styles.courseModuleLockIcon}>🔒</span>}
                    </div>
                    <div className={styles.courseModuleBody}>
                      <span className={styles.courseModuleTitle}>{m.titulo}</span>
                      <span className={styles.courseModuleDesc}>{m.descricao}</span>
                    </div>
                    <div className={m.liberado ? styles.courseModuleStatusAvailable : styles.courseModuleStatusLocked}>
                      {m.liberado ? t('available') : t('locked')}
                    </div>
                  </Wrapper>
                )
              })}
            </ul>
          </div>
        </div>
      )}
    </>
  )
}
