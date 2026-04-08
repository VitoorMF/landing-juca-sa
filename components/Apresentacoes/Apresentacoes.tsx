import styles from './Apresentacoes.module.css'
import { supabaseServer } from '@/lib/supabase-server'
import { Apresentacao } from '@/types'

export default async function Apresentacoes() {
  const { data } = await supabaseServer.from('apresentacoes').select('*')
  const apresentacoes: Apresentacao[] = data ?? []

  return (
    <section id="apresentacoes" className="section section-alt">
      <div className="container">
        <div className="section-header reveal">
          <div className="section-tag">Apresentações</div>
          <h2 className="section-title">Congressos &amp; Palestras</h2>
          <p className="section-lead">
            Palestrante convidado em congressos nacionais e internacionais sobre Plantio Direto,
            carbono no solo e mudanças climáticas.
          </p>
        </div>

        <div className={styles.presGrid}>
          {apresentacoes.map((ap, idx) => {
            const delay = idx % 2
            return (
              <div
                key={ap.id}
                className={`${styles.presCard} reveal${delay > 0 ? ` reveal-delay-${delay}` : ''}`}
              >
                <div className={styles.presIcon}>{ap.emoji}</div>
                <div>
                  <div className={styles.presYear}>{ap.ano} — {ap.local}</div>
                  <div className={styles.presTitle}>{ap.titulo}</div>
                  <div className={styles.presEvent}>{ap.evento}</div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
