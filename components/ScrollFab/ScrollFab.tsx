'use client'

import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import { ArrowDown } from '@/components/ui/Icons'
import styles from './ScrollFab.module.css'

// "noticias" fica ao lado de "apresentacoes" no desktop, então a seção de circulação conta uma vez só
const SECTIONS = ['inicio', 'perfil', 'impacto', 'opinioes', 'publicacoes', 'fotos', 'apresentacoes', 'curso', 'links']

function existingSections() {
  return SECTIONS
    .map((id) => document.getElementById(id))
    .filter((el): el is HTMLElement => el !== null)
}

function top(el: HTMLElement) {
  return el.getBoundingClientRect().top + window.scrollY
}

export default function ScrollFab() {
  const t = useTranslations('common')
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    function update() {
      const els = existingSections()
      const last = els[els.length - 1]
      const pastHero = window.scrollY > window.innerHeight * 0.6
      const atEnd = last ? window.scrollY + window.innerHeight / 2 >= top(last) : true
      setVisible(pastHero && !atEnd)
    }
    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update, { passive: true })
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [])

  function handleClick() {
    const header = document.querySelector('header')?.getBoundingClientRect().height ?? 76
    const next = existingSections().find((el) => top(el) > window.scrollY + header + 24)
    if (next) window.scrollTo({ top: top(next) - header })
  }

  return (
    <button
      type="button"
      className={`${styles.fab} ${visible ? '' : styles.hidden}`}
      onClick={handleClick}
      aria-label={t('nextSection')}
      tabIndex={visible ? 0 : -1}
    >
      <ArrowDown />
    </button>
  )
}
