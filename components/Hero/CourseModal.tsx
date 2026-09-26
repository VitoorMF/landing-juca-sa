'use client'

import { useId, useState } from 'react'
import { useTranslations } from 'next-intl'
import Dialog from '@/components/ui/Dialog'
import { ArrowUpRight, Lock } from '@/components/ui/Icons'
import d from '@/components/ui/Dialog.module.css'
import styles from './CourseModal.module.css'
import { Modulo } from '@/types'

interface Props {
  modulos?: Modulo[]
  label: string
  className?: string
}

export default function CourseModal({ modulos = [], label, className }: Props) {
  const t = useTranslations('courseModal')
  const [open, setOpen] = useState(false)
  const titleId = useId()

  const b = (chunks: React.ReactNode) => <strong>{chunks}</strong>
  const i = (chunks: React.ReactNode) => <em>{chunks}</em>

  // Fallback para os textos estáticos caso a tabela esteja vazia
  const fallback = (t.raw('modules') as { title: string; desc: string }[])
    .map((m, idx) => ({ id: String(idx), ordem: idx + 1, titulo: m.title, descricao: m.desc, url: '', liberado: idx === 0 }))
  const modules: Modulo[] = modulos.length ? modulos : fallback

  const liberados = modules.filter((m) => m.liberado).length

  return (
    <>
      <button type="button" className={className} onClick={() => setOpen(true)} aria-haspopup="dialog">
        {label}
      </button>

      <Dialog open={open} onClose={() => setOpen(false)} labelledBy={titleId}>
        <div className={d.prose}>
          <div className={`eyebrow ${d.badge}`}>{t('badge')}</div>
          <h2 id={titleId} className={d.title}>{t('title')}</h2>

          <p>{t('greeting')}</p>
          <p>{t('p1')}</p>
          <p>{t.rich('p2', { b })}</p>

          <h3 className={d.subtitle}>{t('sub1')}</h3>
          <p>{t.rich('p3', { b, i })}</p>
          <p>{t('p4')}</p>

          <h3 className={d.subtitle}>{t('sub2')}</h3>
          <p>{t.rich('p5', { b })}</p>
        </div>

        <div className={styles.modulesHead}>
          <span>{t('modulesLabel')}</span>
          <span className={styles.progress}>{liberados} / {modules.length} {t('unlockedWord')}</span>
        </div>

        <ol className={styles.modules}>
          {modules.map((m, idx) => {
            const clickable = m.liberado && m.url
            const body = (
              <>
                <span className={styles.num}>{String(idx + 1).padStart(2, '0')}</span>
                <span className={styles.body}>
                  <span className={styles.moduleTitle}>{m.titulo}</span>
                  <span className={styles.moduleDesc}>{m.descricao}</span>
                </span>
                <span className={styles.status}>
                  {m.liberado ? (
                    <>{t('available')}{clickable && <ArrowUpRight />}</>
                  ) : (
                    <><Lock /> {t('locked')}</>
                  )}
                </span>
              </>
            )
            return (
              <li key={m.id ?? idx} className={m.liberado ? styles.available : styles.locked}>
                {clickable ? (
                  <a className={styles.row} href={m.url} target="_blank" rel="noopener noreferrer">{body}</a>
                ) : (
                  <div className={styles.row}>{body}</div>
                )}
              </li>
            )
          })}
        </ol>
      </Dialog>
    </>
  )
}
