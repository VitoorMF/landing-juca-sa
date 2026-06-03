'use client'

import { useTranslations, useLocale } from 'next-intl'
import PublicacoesView from './PublicacoesView'

export default function Publicacoes() {
  const t = useTranslations('publicacoes')
  const locale = useLocale()

  return (
    <section id="publicacoes" className="section section-alt">
      <div className="container">
        <div className="section-header reveal">
          <div className="section-tag">{t('tag')}</div>
          <h2 className="section-title">{t('title')}</h2>
          <p className="section-lead">{t('lead')}</p>
        </div>

        <PublicacoesView limit={5} ctaHref={`/${locale}/publicacoes`} />
      </div>
    </section>
  )
}
