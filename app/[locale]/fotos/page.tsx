import { getTranslations } from 'next-intl/server'
import Subpage from '@/components/Subpage/Subpage'
import { supabaseServer } from '@/lib/supabase-server'
import { Foto } from '@/types'
import GaleriaClient from './GaleriaClient'

export default async function FotosPage() {
  const [t, { data }] = await Promise.all([
    getTranslations('fotos'),
    supabaseServer.from('fotos').select('*'),
  ])
  const fotos: Foto[] = data ?? []

  return (
    <Subpage eyebrow={t('pageTag')} title={t('pageTitle')} lead={t('pageLead')} backLabel={t('back')}>
      <GaleriaClient fotos={fotos} />
    </Subpage>
  )
}
