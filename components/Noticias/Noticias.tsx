import { getTranslations, getLocale } from 'next-intl/server'
import Link from 'next/link'
import styles from './Noticias.module.css'
import { fetchGoogleNews } from '@/lib/google-news'

function readingTime(text: string): number {
  const words = text.trim().split(/\s+/).length
  return Math.max(1, Math.round(words / 200))
}

export default async function Noticias() {
  const [t, locale, noticias] = await Promise.all([
    getTranslations('noticias'),
    getLocale(),
    fetchGoogleNews(),
  ])

  const destaque = noticias.find((n) => n.destaque)
  const secundarias = noticias.filter((n) => !n.destaque)

  return (
    <section id="noticias" className="section">
      <div className="container">
        <div className="section-header reveal">
          <div className="section-tag">{t('tag')}</div>
          <h2 className="section-title">{t('title')}</h2>
          <p className="section-lead">{t('lead')}</p>
        </div>

        <div className={styles.newsGrid}>
          {/* ── Card destaque ── */}
          {destaque && (
            <a
              href={destaque.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`${styles.feature} reveal`}
            >
              <div className={styles.featureTop}>
                <span className={styles.featureFlag}>
                  <span className={styles.featureLive} />
                  Em destaque
                </span>
                <div className={styles.featureKicker}>Ciência do solo &amp; agronegócio</div>
              </div>
              <div className={styles.featureBody}>
                <div className={styles.metaRow}>
                  {destaque.tag && <span className={styles.srcBadge}>{destaque.tag}</span>}
                  <span className={styles.metaDot} />
                  <span>{destaque.data}</span>
                </div>
                <h3 className={styles.featureTitle}>{destaque.titulo}</h3>
                {destaque.descricao && (
                  <p className={styles.featureExcerpt}>{destaque.descricao}</p>
                )}
                <div className={styles.featureFoot}>
                  <span className={styles.readMore}>
                    Ler matéria <span className={styles.readArr}>→</span>
                  </span>
                  <span className={styles.readTime}>
                    Leitura de {readingTime(destaque.descricao)} min
                  </span>
                </div>
              </div>
            </a>
          )}

          {/* ── Lista lateral ── */}
          <div className={`${styles.list} reveal reveal-delay-1`}>
            {secundarias.map((noticia) => (
              <a
                key={noticia.id}
                href={noticia.url}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.listItem}
              >
                <div className={styles.itemMeta}>
                  {noticia.tag && <span className={styles.itemSrc}>{noticia.tag}</span>}
                  <span className={styles.itemDate}>{noticia.data}</span>
                </div>
                <p className={styles.itemTitle}>{noticia.titulo}</p>
              </a>
            ))}
            <div className={styles.listFoot}>
              <Link href={`/${locale}/noticias`} className={styles.seeAll}>
                Ver todas as notícias <span>→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
