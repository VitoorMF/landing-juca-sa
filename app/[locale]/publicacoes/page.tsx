import { getTranslations, getLocale } from 'next-intl/server'
import Link from 'next/link'
import PublicacoesView from '@/components/Publicacoes/PublicacoesView'
import ScrollRevealProvider from '@/components/ScrollRevealProvider/ScrollRevealProvider'
import styles from './publicacoes.module.css'

export default async function PublicacoesPage() {
  const [t, locale] = await Promise.all([
    getTranslations('publicacoes'),
    getLocale(),
  ])

  return (
    <ScrollRevealProvider>
      <div className={styles.wrap}>
        <Link href={`/${locale}`} className={styles.back}>← {t('back')}</Link>

        <header className={styles.head}>
          <span className={styles.eyebrow}>{t('tag')}</span>
          <h1 className={styles.title}>{t('title')}</h1>
          <p className={styles.sub}>{t('lead')}</p>
        </header>

        <PublicacoesView searchable />
      </div>
    </ScrollRevealProvider>
  )
}
