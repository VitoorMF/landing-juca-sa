import { getTranslations } from 'next-intl/server'
import Apresentacoes from '@/components/Apresentacoes/Apresentacoes'
import Noticias from '@/components/Noticias/Noticias'
import styles from './Circulacao.module.css'

/** Congressos e notícias lado a lado: onde as ideias do pesquisador circulam. */
export default async function Circulacao() {
  const t = await getTranslations('apresentacoes')

  return (
    <section className="section" aria-label={t('groupTag')}>
      <div className="wrap">
        <div className="eyebrow reveal">{t('groupTag')}</div>
        <div className={`${styles.columns} reveal`}>
          <Apresentacoes />
          <Noticias />
        </div>
      </div>
    </section>
  )
}
