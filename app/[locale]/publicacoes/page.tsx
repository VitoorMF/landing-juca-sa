import { getTranslations } from 'next-intl/server'
import Subpage from '@/components/Subpage/Subpage'
import PublicacoesView from '@/components/Publicacoes/PublicacoesView'
import { fetchPublicacoes } from '@/components/Publicacoes/Publicacoes'

export default async function PublicacoesPage() {
  const [t, publicacoes] = await Promise.all([getTranslations('publicacoes'), fetchPublicacoes()])

  return (
    <Subpage eyebrow={t('tag')} title={t('title')} lead={t('lead')} backLabel={t('back')}>
      <PublicacoesView publicacoes={publicacoes} searchable />
    </Subpage>
  )
}
