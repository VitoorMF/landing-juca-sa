import { links } from '@/data/links'
import styles from './Links.module.css'

export default function Links() {
  return (
    <section id="links" className="section section-dark">
      <div className="container">
        <div className="section-header reveal">
          <div className="section-tag">Links Externos</div>
          <h2 className="section-title">Perfis &amp; Recursos</h2>
          <p className="section-lead">
            Acesse os perfis acadêmicos, publicações completas e organizações associadas ao Prof. Juca Sá.
          </p>
        </div>

        <div className={styles.linksGrid}>
          {links.map((link, idx) => {
            const delay = idx % 3
            return (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`${styles.linkCard} reveal${delay > 0 ? ` reveal-delay-${delay}` : ''}`}
              >
                <div className={`${styles.linkIcon} ${styles[`linkIcon_${link.iconBg}`]}`}>
                  {link.emoji}
                </div>
                <div className={styles.linkName}>{link.nome}</div>
                <div className={styles.linkDesc}>{link.descricao}</div>
                <div className={styles.linkArrow}>Acessar →</div>
              </a>
            )
          })}
        </div>
      </div>
    </section>
  )
}
