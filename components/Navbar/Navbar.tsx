'use client'

import { useEffect, useRef, useState } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import LangToggle from '@/components/LangToggle/LangToggle'
import styles from './Navbar.module.css'

const SECTION_IDS = ['perfil', 'opinioes', 'publicacoes', 'fotos', 'apresentacoes', 'noticias', 'links'] as const

export default function Navbar() {
  const t = useTranslations('nav')
  const locale = useLocale()
  const [active, setActive] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const headerRef = useRef<HTMLElement>(null)

  useEffect(() => {
    function update() {
      setScrolled(window.scrollY > 8)
      const limit = (headerRef.current?.offsetHeight ?? 76) + 40
      let current = ''
      for (const id of SECTION_IDS) {
        const el = document.getElementById(id)
        if (el && el.getBoundingClientRect().top <= limit) current = id
      }
      setActive(current)
    }
    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update, { passive: true })
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [])

  useEffect(() => {
    if (!menuOpen) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setMenuOpen(false)
    }
    function onPointer(e: PointerEvent) {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) setMenuOpen(false)
    }
    document.addEventListener('keydown', onKey)
    document.addEventListener('pointerdown', onPointer)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('pointerdown', onPointer)
    }
  }, [menuOpen])

  function goTop(e: React.MouseEvent<HTMLAnchorElement>) {
    e.preventDefault()
    setMenuOpen(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
    history.pushState(null, '', locale === 'en' ? '/en' : '/')
  }

  return (
    <header ref={headerRef} className={`${styles.header} ${scrolled ? styles.scrolled : ''}`}>
      <div className={`wrap ${styles.inner}`}>
        <a className={styles.brand} href={locale === 'en' ? '/en' : '/'} onClick={goTop}>
          <span className={styles.monogram} aria-hidden="true">JS</span>
          <span>Prof. Juca Sá</span>
        </a>

        <nav id="site-nav" className={`${styles.nav} ${menuOpen ? styles.navOpen : ''}`} aria-label={t('main')}>
          <ul className={styles.links}>
            {SECTION_IDS.map((id) => (
              <li key={id}>
                <a
                  href={`#${id}`}
                  className={styles.link}
                  aria-current={active === id ? 'true' : undefined}
                  onClick={() => setMenuOpen(false)}
                >
                  {t(id)}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className={styles.tools}>
          <LangToggle />
          <button
            type="button"
            className={styles.menuBtn}
            aria-expanded={menuOpen}
            aria-controls="site-nav"
            aria-label={menuOpen ? t('closeMenu') : t('openMenu')}
            onClick={() => setMenuOpen((v) => !v)}
          >
            <span className={styles.menuLabel}>{t('menu')}</span>
            <span className={`${styles.burger} ${menuOpen ? styles.burgerOpen : ''}`} aria-hidden="true">
              <span />
              <span />
            </span>
          </button>
        </div>
      </div>
    </header>
  )
}
