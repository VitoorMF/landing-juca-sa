import styles from './SectionHead.module.css'

interface Props {
  eyebrow: string
  title: string
  titleId?: string
  lead?: React.ReactNode
  aside?: React.ReactNode
  as?: 'h1' | 'h2'
  className?: string
}

/** Cabeçalho de seção: eyebrow com fio, título serifado e, opcionalmente, lead e ação à direita. */
export default function SectionHead({ eyebrow, title, titleId, lead, aside, as: Tag = 'h2', className = '' }: Props) {
  return (
    <header className={`${styles.head} ${aside ? styles.withAside : ''} ${className} reveal`}>
      <div className={styles.main}>
        <div className="eyebrow">{eyebrow}</div>
        <Tag id={titleId} className={styles.title}>{title}</Tag>
        {lead && <p className={styles.lead}>{lead}</p>}
      </div>
      {aside && <div className={styles.aside}>{aside}</div>}
    </header>
  )
}
