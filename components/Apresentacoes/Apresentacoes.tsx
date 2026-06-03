import { getTranslations, getLocale } from 'next-intl/server'
import Link from 'next/link'
import styles from './Apresentacoes.module.css'
import { supabaseServer } from '@/lib/supabase-server'
import { Apresentacao } from '@/types'
import TimelineView from './TimelineView'

const LIMIT = 6

export default async function Apresentacoes() {
  const [t, locale, { data }] = await Promise.all([
    getTranslations('apresentacoes'),
    getLocale(),
    supabaseServer.from('apresentacoes').select('*'),
  ])
  const todas: Apresentacao[] = data ?? []
  const apresentacoes = todas.slice(0, LIMIT)
  const hasMore = todas.length > LIMIT

  return (
    <section id="apresentacoes" className="section section-alt">
      <div className="container">
        <div className="section-header reveal">
          <div className="section-tag">{t('tag')}</div>
          <h2 className="section-title">{t('title')}</h2>
          <p className="section-lead">{t('lead')}</p>
        </div>

        <TimelineView apresentacoes={apresentacoes} />

        {hasMore && (
          <div className={styles.talksCta}>
            <Link href={`/${locale}/apresentacoes`} className={styles.talksSeeAll}>
              {t('seeAll')} <span>→</span>
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}
