import { getTranslations, getLocale } from 'next-intl/server'
import Link from 'next/link'
import { supabaseServer } from '@/lib/supabase-server'
import { Apresentacao } from '@/types'
import TimelineView from '@/components/Apresentacoes/TimelineView'
import ScrollRevealProvider from '@/components/ScrollRevealProvider/ScrollRevealProvider'
import styles from './apresentacoes.module.css'

export default async function ApresentacoesPage() {
  const [t, locale, { data }] = await Promise.all([
    getTranslations('apresentacoes'),
    getLocale(),
    supabaseServer.from('apresentacoes').select('*').order('ordem', { nullsFirst: false }),
  ])
  const apresentacoes: Apresentacao[] = data ?? []

  return (
    <ScrollRevealProvider>
      <div className={styles.wrap}>
        <Link href={`/${locale}`} className={styles.back}>← {t('back')}</Link>

        <header className={styles.head}>
          <span className={styles.eyebrow}>{t('tag')}</span>
          <h1 className={styles.title}>{t('title')}</h1>
          <p className={styles.sub}>{t('lead')}</p>
        </header>

        <TimelineView apresentacoes={apresentacoes} />
      </div>
    </ScrollRevealProvider>
  )
}
