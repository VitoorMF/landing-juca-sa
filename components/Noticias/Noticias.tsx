import { getTranslations, getLocale } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { ArrowRight, ArrowUpRight } from '@/components/ui/Icons'
import { fetchGoogleNews } from '@/lib/google-news'
import { Noticia } from '@/types'
import styles from './Noticias.module.css'

/** O RSS do Google News costuma repetir título + veículo na descrição; só vale mostrar se trouxer algo novo. */
export function resumo(n: Noticia): string {
  const d = n.descricao?.trim() ?? ''
  if (!d) return ''
  const head = n.titulo.slice(0, 40).toLowerCase()
  return d.toLowerCase().startsWith(head) ? '' : d
}

/** Coluna de notícias da seção "Ideias em circulação". */
export default async function Noticias() {
  const locale = await getLocale()
  const [t, noticias] = await Promise.all([getTranslations('noticias'), fetchGoogleNews(5, locale)])
  const [destaque, ...demais] = noticias

  return (
    <div id="noticias" className={styles.column}>
      <h2 className={styles.columnTitle}>{t('title')}</h2>
      <p className={styles.columnLead}>{t('lead')}</p>

      {!destaque ? (
        <p className={styles.empty}>{t('empty')}</p>
      ) : (
        <ul className={styles.list}>
          <li>
            <a className={`${styles.item} ${styles.featured}`} href={destaque.url} target="_blank" rel="noopener noreferrer">
              <span className={styles.meta}>
                <span className={styles.flag}>{t('featured')}</span>
                {destaque.tag && <span>{destaque.tag}</span>}
                <span>{destaque.data}</span>
              </span>
              <span className={styles.title}>{destaque.titulo}</span>
              {resumo(destaque) && <span className={styles.excerpt}>{resumo(destaque)}</span>}
              <span className={styles.read}>{t('readMore')} <ArrowUpRight /></span>
            </a>
          </li>
          {demais.map((n) => (
            <li key={n.id}>
              <a className={styles.item} href={n.url} target="_blank" rel="noopener noreferrer">
                <span className={styles.meta}>
                  {n.tag && <span>{n.tag}</span>}
                  <span>{n.data}</span>
                </span>
                <span className={styles.title}>{n.titulo}</span>
              </a>
            </li>
          ))}
        </ul>
      )}

      <Link href="/noticias" className={`text-link ${styles.more}`}>
        {t('seeAll')} <ArrowRight />
      </Link>
    </div>
  )
}
