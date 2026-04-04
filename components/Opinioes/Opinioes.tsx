import { principios, citacoes } from '@/data/opinioes'
import styles from './Opinioes.module.css'

export default function Opinioes() {
  return (
    <section id="opinioes" className="section section-dark">
      <div className="container">
        <div className="section-header reveal">
          <div className="section-tag">Princípios &amp; Visão</div>
          <h2 className="section-title">Os 3 Pilares do Sistema Plantio Direto</h2>
          <p className="section-lead">
            Segundo o Prof. Juca Sá, 85–90% das áreas de &ldquo;plantio direto&rdquo; no Brasil não aplicam corretamente
            os três princípios fundamentais — e isso compromete todos os benefícios do sistema.
          </p>
        </div>

        <div className={styles.principlesGrid}>
          {principios.map((p, idx) => (
            <div key={p.id} className={`${styles.principleCard} reveal${idx > 0 ? ` reveal-delay-${idx}` : ''}`}>
              <div className={styles.principleNum}>{p.numero}</div>
              <div className={styles.principleTitle}>{p.titulo}</div>
              <div className={styles.principleDesc}>{p.descricao}</div>
            </div>
          ))}
        </div>

        <div className={styles.quotesGrid}>
          {citacoes.map((c, idx) => (
            <div key={c.id} className={`${styles.quoteCard} reveal${idx > 0 ? ` reveal-delay-${idx}` : ''}`}>
              <div className={styles.quoteText}>&ldquo;{c.texto}&rdquo;</div>
              <div className={styles.quoteSource}>{c.fonte}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
