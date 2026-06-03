import { getTranslations, getLocale } from 'next-intl/server'
import styles from './Fotos.module.css'
import { supabaseServer } from '@/lib/supabase-server'
import { Foto } from '@/types'
import FotosClient from './FotosClient'

export default async function Fotos() {
  const [t, locale, { data }] = await Promise.all([
    getTranslations('fotos'),
    getLocale(),
    supabaseServer.from('fotos').select('*').limit(8),
  ])
  const fotos: Foto[] = data ?? []

  return (
    <section id="fotos" className="section">
      <div className="container">
        <div className="section-header reveal">
          <div className="section-tag">{t('tag')}</div>
          <h2 className="section-title">{t('title')}</h2>
          <p className="section-lead">{t('lead')}</p>
        </div>
        <FotosClient fotos={fotos} locale={locale} />
      </div>
    </section>
  )
}
