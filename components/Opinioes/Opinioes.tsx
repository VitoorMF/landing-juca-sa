import { getTranslations } from 'next-intl/server'
import styles from './Opinioes.module.css'

export default async function Opinioes() {
  const t = await getTranslations('opinioes')
  const principios = t.raw('principios') as Array<{ numero: number; titulo: string; descricao: string }>
  const citacoes = t.raw('citacoes') as Array<{ texto: string; fonte: string }>

  return (
    <section id="opinioes" className="section section-dark">
      <div className="container">
        <div className="section-header reveal">
          <div className="section-tag">{t('tag')}</div>
          <h2 className="section-title">{t('title')}</h2>
          <p className="section-lead">{t('lead')}</p>
        </div>

        <div className={styles.principlesGrid}>
          {principios.map((p, idx) => (
            <div key={p.numero} className={`${styles.principleCard} reveal${idx > 0 ? ` reveal-delay-${idx}` : ''}`}>
              <div className={styles.principleNum}>{p.numero}</div>
              <div className={styles.principleTitle}>{p.titulo}</div>
              <div className={styles.principleDesc}>{p.descricao}</div>
            </div>
          ))}
        </div>

        <div className={styles.quotesGrid}>
          {citacoes.map((c, idx) => (
            <div key={idx} className={`${styles.quoteCard} reveal${idx > 0 ? ` reveal-delay-${idx}` : ''}`}>
              <div className={styles.quoteText}>&ldquo;{c.texto}&rdquo;</div>
              <div className={styles.quoteSource}>{c.fonte}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
