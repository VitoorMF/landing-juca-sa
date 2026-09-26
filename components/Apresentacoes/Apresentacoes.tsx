import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { ArrowRight } from '@/components/ui/Icons'
import { supabaseServer } from '@/lib/supabase-server'
import { Apresentacao } from '@/types'
import TimelineView from './TimelineView'
import styles from './Apresentacoes.module.css'

const LIMIT = 5

/** Coluna de congressos e palestras da seção "Ideias em circulação". */
export default async function Apresentacoes() {
  const [t, { data }] = await Promise.all([
    getTranslations('apresentacoes'),
    supabaseServer.from('apresentacoes').select('*').order('ordem', { nullsFirst: false }),
  ])
  const todas: Apresentacao[] = data ?? []

  return (
    <div id="apresentacoes" className={styles.column}>
      <h2 className={styles.columnTitle}>{t('title')}</h2>
      <p className={styles.columnLead}>{t('lead')}</p>
      <TimelineView apresentacoes={todas.slice(0, LIMIT)} compact />
      {todas.length > LIMIT && (
        <Link href="/apresentacoes" className={`text-link ${styles.more}`}>
          {t('seeAll')} <ArrowRight />
        </Link>
      )}
    </div>
  )
}
