import { getTranslations, getLocale } from 'next-intl/server'
import Link from 'next/link'
import { fetchGoogleNews } from '@/lib/google-news'
import styles from './noticias.module.css'

function readingTime(text: string): number {
  const words = text.trim().split(/\s+/).length
  return Math.max(1, Math.round(words / 200))
}

export default async function NoticiasPage() {
  const [t, locale, noticias] = await Promise.all([
    getTranslations('noticias'),
    getLocale(),
    fetchGoogleNews(30),
  ])

  return (
    <div className={styles.wrap}>
      <Link href={`/${locale}`} className={styles.back}>← {t('back')}</Link>

      <header className={styles.head}>
        <span className={styles.eyebrow}>{t('tag')}</span>
        <h1 className={styles.title}>{t('title')}</h1>
        <p className={styles.sub}>{t('lead')}</p>
      </header>

      <div className={styles.grid}>
        {noticias.map((n) => (
          <a key={n.id} href={n.url} target="_blank" rel="noopener noreferrer" className={styles.card}>
            <div className={styles.cardMeta}>
              {n.tag && <span className={styles.cardSrc}>{n.tag}</span>}
              <span className={styles.cardDate}>{n.data}</span>
            </div>
            <h3 className={styles.cardTitle}>{n.titulo}</h3>
            {n.descricao && <p className={styles.cardDesc}>{n.descricao}</p>}
            <div className={styles.cardFoot}>
              <span className={styles.cardRead}>{t('readMore')} →</span>
              <span className={styles.cardTime}>{readingTime(n.descricao)} min</span>
            </div>
          </a>
        ))}
      </div>
    </div>
  )
}
