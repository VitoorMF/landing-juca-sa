import { getTranslations } from 'next-intl/server'
import SectionHead from '@/components/ui/SectionHead'
import { supabaseServer } from '@/lib/supabase-server'
import { Foto } from '@/types'
import FotosClient from './FotosClient'

const SHOWN = 5

export default async function Fotos() {
  const [t, { data }] = await Promise.all([
    getTranslations('fotos'),
    supabaseServer.from('fotos').select('*').limit(8),
  ])
  const todas: Foto[] = data ?? []

  // a foto marcada como destaque (span) abre a grade; as demais seguem a ordem do banco
  const destaque = todas.find((f) => f.span) ?? todas[0]
  const fotos = destaque ? [destaque, ...todas.filter((f) => f !== destaque)].slice(0, SHOWN) : []

  return (
    <section id="fotos" className="section section-alt" aria-labelledby="fotos-title">
      <div className="wrap">
        <SectionHead eyebrow={t('tag')} title={t('title')} titleId="fotos-title" lead={t('lead')} />
        <FotosClient fotos={fotos} />
      </div>
    </section>
  )
}
