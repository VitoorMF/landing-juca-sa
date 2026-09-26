import { getTranslations } from 'next-intl/server'
import SectionHead from '@/components/ui/SectionHead'
import { ArrowUpRight } from '@/components/ui/Icons'
import { supabaseServer } from '@/lib/supabase-server'
import { Publicacao } from '@/types'
import { SCHOLAR_URL } from '@/lib/links'
import PublicacoesView from './PublicacoesView'

export async function fetchPublicacoes(): Promise<Publicacao[]> {
  const { data } = await supabaseServer.from('publicacoes').select('*').order('ordem', { nullsFirst: false })
  return (data ?? []) as Publicacao[]
}

export default async function Publicacoes() {
  const [t, publicacoes] = await Promise.all([getTranslations('publicacoes'), fetchPublicacoes()])

  return (
    <section id="publicacoes" className="section" aria-labelledby="publicacoes-title">
      <div className="wrap">
        <SectionHead
          eyebrow={t('tag')}
          title={t('title')}
          titleId="publicacoes-title"
          lead={t('lead')}
          aside={
            <a className="text-link" href={SCHOLAR_URL} target="_blank" rel="noopener noreferrer">
              {t('scholar')} <ArrowUpRight />
            </a>
          }
        />
        <PublicacoesView publicacoes={publicacoes} limit={5} showAllLink />
      </div>
    </section>
  )
}
