import { getTranslations } from 'next-intl/server'
import styles from './Apresentacoes.module.css'
import { Apresentacao } from '@/types'

function isIntl(local: string): boolean {
  const nacionais = ['brasil', 'brazil', ', br', ', mg', ', sp', ', pr', ', go', ', mt', ', ms', ', ba', ', ma', ', pa']
  return !nacionais.some((n) => local.toLowerCase().includes(n))
}

export default async function TimelineView({ apresentacoes, compact = false }: { apresentacoes: Apresentacao[]; compact?: boolean }) {
  const t = await getTranslations('apresentacoes')

  if (apresentacoes.length === 0) {
    return <p className={styles.empty}>{t('empty')}</p>
  }

  return (
    <ol className={`${styles.list} ${compact ? styles.compact : ''}`}>
      {apresentacoes.map((ap) => {
        const intl = isIntl(ap.local)
        const tag = ap.titulo.toLowerCase().includes('cop') ? 'COP30' : intl ? t('tagIntl') : t('tagNational')
        return (
          <li key={ap.id} className={styles.item}>
            <span className={styles.year}>{ap.ano}</span>
            <div className={styles.body}>
              <p className={styles.meta}>
                <span>{ap.local}</span>
                <span className={`${styles.tag} ${intl ? styles.tagIntl : ''}`}>{tag}</span>
              </p>
              <h3 className={styles.title}>{ap.titulo}</h3>
              {ap.evento && <p className={styles.event}>{ap.evento}</p>}
            </div>
          </li>
        )
      })}
    </ol>
  )
}
