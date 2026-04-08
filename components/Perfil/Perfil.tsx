import { getTranslations } from 'next-intl/server'
import styles from './Perfil.module.css'

const timelineColors = [
  'var(--green-mid)',
  'var(--green-mid)',
  'var(--green-mid)',
  'var(--green-mid)',
  'var(--teal)',
  'var(--teal)',
]

export default async function Perfil() {
  const t = await getTranslations('perfil')
  const timeline = t.raw('timeline') as Array<{ emoji: string; year: string; text: string }>

  return (
    <section id="perfil" className="section">
      <div className="container">
        <div className="section-header reveal">
          <div className="section-tag">{t('tag')}</div>
          <h2 className="section-title">{t('title')}</h2>
          <p className="section-lead">{t('lead')}</p>
        </div>

        <div className={styles.profileGrid}>
          <div className="reveal">
            <div className={styles.profileCard}>
              <div className={styles.profileCardHeader}>
                <div className={styles.profileAvatar}>
                  <img src="/profile-photo.png" alt="Prof. João Carlos de Moraes Sá" className={styles.profileAvatarImg} />
                </div>
                <div className={styles.profileCardName}>João Carlos de Moraes Sá</div>
                <div className={styles.profileCardTitle}>Ph.D. · {t('cardTitle')}</div>
              </div>
              <div className={styles.profileCardBody}>
                {[
                  { icon: '🏛️', label: t('instLabel'),     value: t('instValue') },
                  { icon: '🎓', label: t('doutoradoLabel'), value: t('doutoradoValue') },
                  { icon: '🔬', label: t('labLabel'),       value: t('labValue') },
                  { icon: '🌍', label: t('cnpqLabel'),      value: t('cnpqValue') },
                  { icon: '🤝', label: t('febrapdpLabel'),  value: t('febrapdpValue') },
                ].map((item) => (
                  <div key={item.label} className={styles.profileMetaItem}>
                    <div className={styles.profileMetaIcon}>{item.icon}</div>
                    <div>
                      <div className={styles.profileMetaLabel}>{item.label}</div>
                      <div className={styles.profileMetaValue}>{item.value}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div className={styles.profileLinks}>
                <a className={styles.profileLink} href="https://scholar.google.com/citations?user=01cxZjoAAAAJ" target="_blank" rel="noopener noreferrer">📚 Google Scholar</a>
                <a className={styles.profileLink} href="https://www.researchgate.net/profile/Joao-Carlos-Sa" target="_blank" rel="noopener noreferrer">🔗 ResearchGate</a>
                <a className={styles.profileLink} href="https://www.linkedin.com/in/jo%C3%A3o-carlos-moraes-s%C3%A1-99595330/" target="_blank" rel="noopener noreferrer">💼 LinkedIn</a>
                <a className={styles.profileLink} href="http://lattes.cnpq.br/5078594632126000" target="_blank" rel="noopener noreferrer">🎓 Lattes</a>
                <a className={styles.profileLink} href="https://orcid.org/0000-0003-1502-5537" target="_blank" rel="noopener noreferrer">🔬 ORCID</a>
              </div>
            </div>
          </div>

          <div className={`${styles.profileBio} reveal reveal-delay-1`}>
            <h3>{t('sobreTitle')}</h3>
            <p>{t('bio1')}</p>
            <p>{t('bio2')}</p>
            <p>{t('bio3')}</p>

            <div className={styles.timeline}>
              {timeline.map((item, idx) => (
                <div key={idx} className={styles.timelineItem}>
                  <div className={styles.timelineDot} style={{ background: timelineColors[idx] }}>{item.emoji}</div>
                  <div>
                    <div className={styles.timelineYear}>{item.year}</div>
                    <div className={styles.timelineText}>{item.text}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
