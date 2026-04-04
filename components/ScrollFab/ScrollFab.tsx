'use client'

import { useEffect, useState } from 'react'
import styles from './ScrollFab.module.css'

const SECTIONS = ['hero', 'perfil', 'impacto', 'opinioes', 'publicacoes', 'videos', 'fotos', 'apresentacoes', 'noticias', 'links']

export default function ScrollFab() {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    function update() {
      const scrollY = window.scrollY + window.innerHeight / 2

      let idx = 0
      for (let i = 0; i < SECTIONS.length; i++) {
        const el = document.getElementById(SECTIONS[i])
        if (el && el.offsetTop <= scrollY) idx = i
      }
      setCurrentIndex(idx)
    }

    update()
    window.addEventListener('scroll', update, { passive: true })
    return () => window.removeEventListener('scroll', update)
  }, [])

  const isLast = currentIndex === SECTIONS.length - 1

  function handleClick() {
    const nextId = SECTIONS[currentIndex + 1]
    const next = document.getElementById(nextId)
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
