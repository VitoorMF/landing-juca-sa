'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import Dialog from '@/components/ui/Dialog'
import d from '@/components/ui/Dialog.module.css'

interface Props {
  label: string
  className?: string
}

export default function WelcomeModal({ label, className }: Props) {
  const t = useTranslations('welcomeModal')
  const [open, setOpen] = useState(false)

  const b = (chunks: React.ReactNode) => <strong>{chunks}</strong>

  return (
    <>
      <button type="button" className={className} onClick={() => setOpen(true)} aria-haspopup="dialog">
        {label}
      </button>

      <Dialog open={open} onClose={() => setOpen(false)} labelledBy="welcome-title">
        <div className={d.prose}>
          <h2 id="welcome-title" className={d.title}>{t('title')}</h2>

          <p>{t.rich('p1', { b })}</p>
          <p>{t('p2')}</p>

          <h3 className={d.subtitle}>{t('subtitle1')}</h3>
          <p>{t.rich('p3', { b })}</p>
          <p>{t.rich('p4', { b })}</p>

          <h3 className={d.subtitle}>{t('subtitle2')}</h3>
          <p>{t('p5')}</p>

          <p className={d.signoff}>{t('welcome')}</p>
        </div>
      </Dialog>
    </>
  )
}
