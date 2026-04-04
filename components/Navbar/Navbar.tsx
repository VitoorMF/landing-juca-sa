'use client'

import { useEffect, useState } from 'react'
import styles from './Navbar.module.css'

const navItems = [
  { href: '#perfil', label: 'Perfil' },
  { href: '#opinioes', label: 'Opiniões' },
  { href: '#publicacoes', label: 'Publicações' },
  { href: '#videos', label: 'Vídeos' },
  { href: '#fotos', label: 'Fotos' },
  { href: '#apresentacoes', label: 'Apresentações' },
  { href: '#noticias', label: 'Notícias' },
  { href: '#links', label: 'Links' },
]

export default function Navbar() {
  const [activeSection, setActiveSection] = useState('perfil')
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    function updateNav() {
      const sections = document.querySelectorAll('section[id]')
      let current = ''
      sections.forEach((section) => {
        const top = section.getBoundingClientRect().top
        if (top <= 80) current = section.id
      })
      if (current) setActiveSection(current)
    }

    window.addEventListener('scroll', updateNav, { passive: true })
    return () => window.removeEventListener('scroll', updateNav)
  }, [])

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  function handleNavClick(e: React.MouseEvent<HTMLAnchorElement>, href: string) {
    const target = document.querySelector(href)
    if (target) {
      e.preventDefault()
      setMenuOpen(false)
      const offset = 65
      const top = target.getBoundingClientRect().top + window.scrollY - offset
      window.scrollTo({ top, behavior: 'smooth' })
    }
  }

  return (
    <>
      <nav id="navbar" className={styles.navbar}>
        <div className={styles.navInner}>
          <a
            className={styles.navLogo}
            href="/"
            onClick={(e) => {
              e.preventDefault()
              window.scrollTo({ top: 0, behavior: 'smooth' })
              history.pushState(null, '', '/')
            }}
          >
            Prof. Juca Sá
          </a>

          {/* Desktop links */}
          <div className={styles.navLinks}>
            {navItems.map((item) => (
              <a
                key={item.href}
                className={`${styles.navItem} ${activeSection === item.href.slice(1) ? styles.active : ''}`}
                href={item.href}
                onClick={(e) => handleNavClick(e, item.href)}
              >
                {item.label}
              </a>
            ))}
          </div>

          {/* Hamburger button */}
          <button
            className={`${styles.hamburger} ${menuOpen ? styles.hamburgerOpen : ''}`}
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
            aria-expanded={menuOpen}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      {menuOpen && (
        <div className={styles.overlay} onClick={() => setMenuOpen(false)} />
      )}
      <div className={`${styles.drawer} ${menuOpen ? styles.drawerOpen : ''}`}>
        {navItems.map((item) => (
          <a
            key={item.href}
            className={`${styles.drawerItem} ${activeSection === item.href.slice(1) ? styles.drawerItemActive : ''}`}
            href={item.href}
            onClick={(e) => handleNavClick(e, item.href)}
          >
            {item.label}
          </a>
        ))}
      </div>
    </>
  )
}
