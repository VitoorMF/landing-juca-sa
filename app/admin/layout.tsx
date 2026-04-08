'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import styles from './layout.module.css'

const navItems = [
  { href: '/admin',               label: 'Início',         icon: '🏠', exact: true },
  { href: '/admin/metricas',      label: 'Métricas',       icon: '📈' },
  { href: '/admin/publicacoes',   label: 'Publicações',    icon: '📚' },
  { href: '/admin/noticias',      label: 'Notícias',       icon: '📰' },
  { href: '/admin/apresentacoes', label: 'Apresentações',  icon: '🎤' },
  { href: '/admin/videos',        label: 'Vídeos',         icon: '🎥' },
  { href: '/admin/fotos',         label: 'Fotos',          icon: '🖼️' },
  { href: '/admin/links',         label: 'Links',          icon: '🔗' },
  { href: '/admin/configuracoes', label: 'Configurações',  icon: '⚙️' },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

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
          {navItems.map(item => {
            const isActive = item.exact
              ? pathname === item.href
              : pathname.startsWith(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`${styles.navItem} ${isActive ? styles.active : ''}`}
              >
                <span className={styles.navIcon}>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>

        <div className={styles.sidebarFooter}>
          <Link href="/" className={styles.viewSite} target="_blank">
            <span>🌐</span>
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
