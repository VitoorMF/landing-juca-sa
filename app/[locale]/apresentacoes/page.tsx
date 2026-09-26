import { getTranslations } from 'next-intl/server'
import Subpage from '@/components/Subpage/Subpage'
import TimelineView from '@/components/Apresentacoes/TimelineView'
import { supabaseServer } from '@/lib/supabase-server'
import { Apresentacao } from '@/types'

export default async function ApresentacoesPage() {
  const [t, { data }] = await Promise.all([
    getTranslations('apresentacoes'),
    supabaseServer.from('apresentacoes').select('*').order('ordem', { nullsFirst: false }),
  ])
  const apresentacoes: Apresentacao[] = data ?? []

  return (
    <Subpage eyebrow={t('tag')} title={t('title')} lead={t('lead')} backLabel={t('back')}>
      <TimelineView apresentacoes={apresentacoes} />
    </Subpage>
  )
}
