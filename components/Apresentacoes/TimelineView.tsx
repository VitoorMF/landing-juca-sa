import styles from './Apresentacoes.module.css'
import { Apresentacao } from '@/types'

function isIntl(local: string): boolean {
  const nacionais = ['brasil', ', br', ', mg', ', sp', ', pr', ', go', ', mt', ', ms', ', ba', ', ma', ', pa']
  return !nacionais.some((n) => local.toLowerCase().includes(n))
}

function deriveTag(local: string, titulo: string): string {
  if (titulo.toLowerCase().includes('cop')) return 'COP30'
  if (isIntl(local)) return 'Internacional'
  return 'Nacional'
}

export default function TimelineView({ apresentacoes }: { apresentacoes: Apresentacao[] }) {
  return (
    <div className={styles.timeline}>
      {apresentacoes.map((ap, idx) => {
        const intl = isIntl(ap.local)
        const tag = deriveTag(ap.local, ap.titulo)
        return (
          <article
            key={ap.id}
            className={`${styles.talk} ${intl ? styles.talkIntl : ''} reveal reveal-delay-${Math.min(idx, 3)}`}
          >
            <span className={styles.talkNode} />
            <div className={styles.talkCard}>
              <div className={styles.talkMeta}>
                <span className={styles.talkYear}>{ap.ano}</span>
                <span className={styles.talkPlace}>{ap.local}</span>
                <span className={`${styles.talkTag} ${intl ? styles.talkTagIntl : ''}`}>{tag}</span>
              </div>
              <h3 className={styles.talkTitle}>{ap.titulo}</h3>
              <p className={styles.talkWhere}>{ap.evento}</p>
            </div>
          </article>
        )
      })}
    </div>
  )
}
