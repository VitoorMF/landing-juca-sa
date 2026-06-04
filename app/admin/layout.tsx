'use client'

import './admin.css'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect } from 'react'
import styles from './layout.module.css'

// favicon distinto pro admin: quadrado verde com engrenagem branca
const ADMIN_FAVICON =
  'data:image/svg+xml,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <rect width="100" height="100" rx="22" fill="#16301f"/>
      <g fill="none" stroke="#2bbd86" stroke-width="8" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="50" cy="50" r="13"/>
        <path d="M50 24v-8M50 84v-8M76 50h8M16 50h8M68 68l6 6M26 26l6 6M68 32l6-6M26 74l6-6"/>
      </g>
    </svg>`
  )

function useAdminChrome() {
  useEffect(() => {
    const prevTitle = document.title
    document.title = 'Painel Admin · Prof. Juca Sá'

    let link = document.querySelector<HTMLLinkElement>("link[rel~='icon']")
    const prevHref = link?.href ?? null
    if (!link) {
      link = document.createElement('link')
      link.rel = 'icon'
      document.head.appendChild(link)
    }
    link.href = ADMIN_FAVICON

    return () => {
      document.title = prevTitle
      if (link && prevHref) link.href = prevHref
    }
  }, [])
}

function Svg({ children }: { children: React.ReactNode }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"
      style={{ width: 18, height: 18, flexShrink: 0 }}>
      {children}
    </svg>
  )
}

const icons: Record<string, React.ReactNode> = {
  inicio: <Svg><path d="M3 11l9-8 9 8" /><path d="M5 10v10h5v-6h4v6h5V10" /></Svg>,
  metricas: <Svg><path d="M3 3v18h18" /><path d="M7 16l4-4 4 4 4-4" /></Svg>,
  publicacoes: <Svg><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" /><path d="M14 3v5h5" /><path d="M9 13h6M9 17h6" /></Svg>,
  apresentacoes: <Svg><rect x="9" y="3" width="6" height="11" rx="3" /><path d="M6 11a6 6 0 0 0 12 0" /><path d="M12 17v4M9 21h6" /></Svg>,
  fotos: <Svg><rect x="3" y="4" width="18" height="16" rx="2" /><circle cx="8.5" cy="9.5" r="1.6" /><path d="M21 16l-5-5L5 20" /></Svg>,
  links: <Svg><path d="M10 13a4 4 0 0 0 5.7.3l2.6-2.6a4 4 0 0 0-5.7-5.7l-1.5 1.5" /><path d="M14 11a4 4 0 0 0-5.7-.3L5.7 13.3a4 4 0 0 0 5.7 5.7l1.5-1.5" /></Svg>,
  textos: <Svg><path d="M5 5h14M5 5v3M19 5v3M12 5v14M9 19h6" /></Svg>,
  curso: <Svg><path d="M22 10L12 4 2 10l10 6 10-6z" /><path d="M6 12v5c0 1.5 2.7 3 6 3s6-1.5 6-3v-5" /></Svg>,
}

const navItems = [
  { href: '/admin', label: 'Início', key: 'inicio', exact: true },
  { href: '/admin/metricas', label: 'Métricas', key: 'metricas' },
  { href: '/admin/publicacoes', label: 'Publicações', key: 'publicacoes' },
  { href: '/admin/apresentacoes', label: 'Apresentações', key: 'apresentacoes' },
  { href: '/admin/fotos', label: 'Fotos', key: 'fotos' },
  { href: '/admin/links', label: 'Links', key: 'links' },
  { href: '/admin/curso', label: 'Curso', key: 'curso' },
  { href: '/admin/textos', label: 'Textos', key: 'textos' },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  useAdminChrome()

  return (
    <div className={styles.layout}>
      <aside className={styles.sidebar}>
        <div className={styles.brand}>
          <span className={styles.brandIcon}>🌱</span>
          <div>
            <div className={styles.brandName}>Prof. Juca Sá</div>
            <div className={styles.brandSub}>Painel Admin</div>
          </div>
        </div>

        <nav className={styles.nav}>
          {navItems.map(({ href, label, key, exact }) => {
            const isActive = exact ? pathname === href : pathname.startsWith(href)
            return (
              <Link
                key={href}
                href={href}
                className={`${styles.navItem} ${isActive ? styles.active : ''}`}
              >
                <span className={styles.navIcon}>{icons[key]}</span>
                <span>{label}</span>
              </Link>
            )
          })}
        </nav>

        <div className={styles.sidebarFooter}>
          <Link href="/" className={styles.viewSite} target="_blank">
            <Svg>
              <circle cx="12" cy="12" r="10" />
              <path d="M2 12h20M12 2a15 15 0 0 1 0 20M12 2a15 15 0 0 0 0 20" />
            </Svg>
            <span>Ver site</span>
          </Link>
        </div>
      </aside>

      <main className={styles.main}>
        {children}
      </main>
    </div>
  )
}
