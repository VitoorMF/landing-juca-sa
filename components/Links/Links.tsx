import { getTranslations } from 'next-intl/server'
import SectionHead from '@/components/ui/SectionHead'
import { ArrowUpRight } from '@/components/ui/Icons'
import { supabaseServer } from '@/lib/supabase-server'
import { Link } from '@/types'
import styles from './Links.module.css'

export default async function Links() {
  const [t, { data }] = await Promise.all([
    getTranslations('links'),
    supabaseServer.from('links').select('*').order('ordem', { nullsFirst: false }),
  ])
  const links = (data ?? []) as Link[]

  return (
    <section id="links" className="section tone-dark" aria-labelledby="links-title">
      <div className="wrap">
        <SectionHead eyebrow={t('tag')} title={t('title')} titleId="links-title" lead={t('lead')} />

        {links.length > 0 && (
          <ul className={styles.grid}>
            {links.map((link, idx) => (
              <li key={link.id} className={`reveal reveal-delay-${idx % 3}`}>
                <a className={styles.card} href={link.url} target="_blank" rel="noopener noreferrer">
                  <span className={styles.name}>
                    {link.nome}
                    <ArrowUpRight className={styles.arrow} />
                  </span>
                  {link.descricao && <span className={styles.desc}>{link.descricao}</span>}
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}
