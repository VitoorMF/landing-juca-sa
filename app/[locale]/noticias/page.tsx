import { getTranslations, getLocale } from 'next-intl/server'
import Subpage from '@/components/Subpage/Subpage'
import { resumo } from '@/components/Noticias/Noticias'
import { ArrowUpRight } from '@/components/ui/Icons'
import { fetchGoogleNews } from '@/lib/google-news'
import styles from './noticias.module.css'

export default async function NoticiasPage() {
  const locale = await getLocale()
  const [t, noticias] = await Promise.all([getTranslations('noticias'), fetchGoogleNews(30, locale)])

  return (
    <Subpage eyebrow={t('tag')} title={t('title')} lead={t('lead')} backLabel={t('back')}>
      {noticias.length === 0 ? (
        <p className={styles.empty}>{t('empty')}</p>
      ) : (
        <ul className={styles.grid}>
          {noticias.map((n) => (
            <li key={n.id}>
              <a href={n.url} target="_blank" rel="noopener noreferrer" className={styles.card}>
                <span className={styles.meta}>
                  {n.tag && <span>{n.tag}</span>}
                  <span>{n.data}</span>
                </span>
                <span className={styles.title}>{n.titulo}</span>
                {resumo(n) && <span className={styles.desc}>{resumo(n)}</span>}
                <span className={styles.read}>{t('readMore')} <ArrowUpRight /></span>
              </a>
            </li>
          ))}
        </ul>
      )}
    </Subpage>
  )
}
