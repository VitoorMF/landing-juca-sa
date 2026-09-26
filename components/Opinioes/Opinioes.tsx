import { getTranslations } from 'next-intl/server'
import styles from './Opinioes.module.css'

type Principio = { numero: number; titulo: string; descricao: string }
type Citacao = { texto: string; fonte: string }

export default async function Opinioes() {
  const t = await getTranslations('opinioes')
  const principios = t.raw('principios') as Principio[]
  const citacoes = t.raw('citacoes') as Citacao[]

  return (
    <>
      <section id="opinioes" className="section tone-dark" aria-labelledby="opinioes-title">
        <div className="wrap">
          <header className={`${styles.head} reveal`}>
            <div className="eyebrow">{t('tag')}</div>
            <h2 id="opinioes-title" className={styles.title}>{t('title')}</h2>
          </header>

          <ol className={styles.pillars}>
            {principios.map((p, idx) => (
              <li key={p.numero} className={`${styles.pillar} reveal reveal-delay-${idx % 3}`}>
                <span className={styles.number}>{String(p.numero).padStart(2, '0')}</span>
                <h3 className={styles.pillarTitle}>{p.titulo}</h3>
                <p>{p.descricao}</p>
              </li>
            ))}
          </ol>

          <p className={`${styles.note} reveal`}>{t('lead')}</p>
        </div>
      </section>

      {citacoes.length > 0 && (
        <section className={`section ${styles.quotesSection}`} aria-labelledby="citacoes-title">
          <div className="wrap">
            <div id="citacoes-title" className="eyebrow reveal">{t('quotesTag')}</div>
            <ul className={styles.quotes}>
              {citacoes.map((c, idx) => (
                <li key={idx} className={`${styles.quote} ${idx === 0 ? styles.quoteLead : ''} reveal reveal-delay-${idx % 2}`}>
                  <figure>
                    <blockquote>
                      <p>{c.texto}</p>
                    </blockquote>
                    <figcaption>{c.fonte}</figcaption>
                  </figure>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
    </>
  )
}
