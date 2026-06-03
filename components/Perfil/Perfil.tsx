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
  const timeline   = t.raw('timeline')   as Array<{ emoji: string; year: string; text: string }>
  const cardItems  = t.raw('cardItems')  as Array<{ icon: string; label: string; value: string }>
  const links      = t.raw('links')      as Array<{ icon: string; label: string; url: string }>

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
                {cardItems.map((item) => (
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
                {links.map((link) => (
                  <a key={link.url} className={styles.profileLink} href={link.url} target="_blank" rel="noopener noreferrer">
                    {link.icon} {link.label}
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className={`${styles.profileBio} reveal reveal-delay-1`}>
            <h3>{t('sobreTitle')}</h3>
            <div style={{ whiteSpace: 'pre-line' }}>{t('bio1')}</div>

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
