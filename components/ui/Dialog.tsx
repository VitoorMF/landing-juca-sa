'use client'

import { useEffect, useRef } from 'react'
import { useTranslations } from 'next-intl'
import { Close } from './Icons'
import styles from './Dialog.module.css'

interface Props {
  open: boolean
  onClose: () => void
  labelledBy?: string
  label?: string
  variant?: 'panel' | 'media'
  children: React.ReactNode
}

/** Modal acessível sobre o <dialog> nativo: foco, Esc e camada superior vêm do navegador. */
export default function Dialog({ open, onClose, labelledBy, label, variant = 'panel', children }: Props) {
  const ref = useRef<HTMLDialogElement>(null)
  const t = useTranslations('common')

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (open && !el.open) el.showModal()
    if (!open && el.open) el.close()
  }, [open])

  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prev }
  }, [open])

  function handleClick(e: React.MouseEvent<HTMLDialogElement>) {
    // clique no backdrop (fora da caixa) fecha
    if (e.target === ref.current) onClose()
  }

  return (
    <dialog
      ref={ref}
      className={`tone-light ${styles.dialog} ${variant === 'media' ? styles.media : styles.panel}`}
      aria-labelledby={labelledBy}
      aria-label={label}
      onClose={onClose}
      onCancel={(e) => { e.preventDefault(); onClose() }}
      onClick={handleClick}
    >
      {open && (
        <div className={styles.inner}>
          <button type="button" className={styles.close} onClick={onClose}>
            {t('close')} <Close />
          </button>
          {children}
        </div>
      )}
    </dialog>
  )
}
