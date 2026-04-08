'use client'

import { useEffect, useState } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { useRouter, usePathname } from '@/i18n/navigation'
import styles from './Navbar.module.css'

export default function Navbar() {
  const t = useTranslations('nav')
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()

  const navItems = [
    { href: '#perfil',        label: t('perfil') },
    { href: '#opinioes',      label: t('opinioes') },
    { href: '#publicacoes',   label: t('publicacoes') },
    { href: '#videos',        label: t('videos') },
    { href: '#fotos',         label: t('fotos') },
    { href: '#apresentacoes', label: t('apresentacoes') },
    { href: '#noticias',      label: t('noticias') },
    { href: '#links',         label: t('links') },
  ]

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

  function toggleLocale() {
    const next = locale === 'pt' ? 'en' : 'pt'
    router.replace(pathname, { locale: next })
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
              history.pushState(null, '', locale === 'en' ? '/en' : '/')
            }}
          >
            Prof. Juca Sá
          </a>

          {/* Desktop: links */}
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

          {/* Desktop: botão de idioma isolado à direita */}
          <button className={styles.langBtnDesktop} onClick={toggleLocale}>
            {locale === 'pt' ? 'EN' : 'PT'}
          </button>

          {/* Mobile: botão de idioma + hamburger */}
          <div className={styles.navMobile}>
            <button className={styles.langBtn} onClick={toggleLocale}>
              {locale === 'pt' ? 'EN' : 'PT'}
            </button>
            <button
              className={`${styles.hamburger} ${menuOpen ? styles.hamburgerOpen : ''}`}
              onClick={() => setMenuOpen((v) => !v)}
              aria-label={menuOpen ? t('closeMenu') : t('openMenu')}
              aria-expanded={menuOpen}
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </div>
      </nav>

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
