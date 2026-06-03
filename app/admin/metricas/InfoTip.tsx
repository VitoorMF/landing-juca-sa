'use client'

import { useState } from 'react'
import styles from './page.module.css'

export default function InfoTip({ texto }: { texto: string }) {
  const [open, setOpen] = useState(false)

  return (
    <span
      className={styles.infoTip}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onClick={() => setOpen(v => !v)}
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" /><path d="M12 16v-4M12 8h.01" />
      </svg>
      {open && <span className={styles.infoTipBubble}>{texto}</span>}
    </span>
  )
}
