'use client'

import { useEffect, useState } from 'react'
import styles from './ScrollFab.module.css'

const SECTIONS = ['hero', 'perfil', 'impacto', 'opinioes', 'publicacoes', 'fotos', 'apresentacoes', 'noticias', 'links']

export default function ScrollFab() {
  const [currentIndex, setCurrentIndex] = useState(0)

  // Só considera seções que existem de fato no DOM
  function existingSections() {
    return SECTIONS
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null)
  }

  useEffect(() => {
    function update() {
      const scrollY = window.scrollY + window.innerHeight / 2
      const els = existingSections()
      let idx = 0
      els.forEach((el, i) => {
        if (el.offsetTop <= scrollY) idx = i
      })
      setCurrentIndex(idx)
    }

    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update, { passive: true })
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [])

  const total = typeof document !== 'undefined' ? existingSections().length : SECTIONS.length
  const isLast = currentIndex >= total - 1

  function handleClick() {
    const els = existingSections()
    const next = els[currentIndex + 1]
    if (!next) return
    const offset = 65
    window.scrollTo({ top: next.offsetTop - offset, behavior: 'smooth' })
  }

  return (
    <button
      className={`${styles.fab} ${isLast ? styles.hidden : ''}`}
      onClick={handleClick}
      aria-label="Próxima seção"
    >
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
        <path d="M10 4v12M4 10l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </button>
  )
}
