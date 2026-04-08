import { getTranslations } from 'next-intl/server'
import styles from './Links.module.css'
import { supabaseServer } from '@/lib/supabase-server'
import { Link } from '@/types'

export default async function Links() {
  const t = await getTranslations('links')
  const { data } = await supabaseServer.from('links').select('*')
  const links: Link[] = (data ?? []).map((l: Record<string, unknown>) => ({
    ...l,
    iconBg: l.icon_bg,
  } as Link))

  return (
    <section id="links" className="section section-dark">
      <div className="container">
        <div className="section-header reveal">
          <div className="section-tag">{t('tag')}</div>
          <h2 className="section-title">{t('title')}</h2>
          <p className="section-lead">{t('lead')}</p>
        </div>

        <div className={styles.linksGrid}>
          {links.map((link, idx) => {
            const delay = idx % 3
            return (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`${styles.linkCard} reveal${delay > 0 ? ` reveal-delay-${delay}` : ''}`}
              >
                <div className={`${styles.linkIcon} ${styles[`linkIcon_${link.iconBg}`]}`}>
                  {link.emoji}
                </div>
                <div className={styles.linkName}>{link.nome}</div>
                <div className={styles.linkDesc}>{link.descricao}</div>
                <div className={styles.linkArrow}>{t('cta')}</div>
              </a>
            )
          })}
        </div>
      </div>
    </section>
  )
}
