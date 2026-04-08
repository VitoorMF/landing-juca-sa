import { getTranslations } from 'next-intl/server'
import styles from './Hero.module.css'

export default async function Hero() {
  const t = await getTranslations('hero')

  return (
    <section id="hero" className={styles.hero}>
      <div className={styles.heroBgPattern}></div>
      <div className={`${styles.heroBlob} ${styles.heroBlob1}`}></div>
      <div className={`${styles.heroBlob} ${styles.heroBlob2}`}></div>
      <div className={styles.heroContent}>
        <div>
          <div className={styles.heroEyebrow}>{t('eyebrow')}</div>
          <h1 className={styles.heroTitle}>Prof. Juca Sá</h1>
          <p className={styles.heroSubtitle}>João Carlos de Moraes Sá</p>
          <p className={styles.heroDesc}>{t('desc')}</p>
          <div className={styles.heroStats}>
            <div>
              <div className={styles.heroStatNum}>70<span className={styles.heroStatSup}>+</span></div>
              <div className={styles.heroStatLabel}>{t('stat1')}</div>
            </div>
            <div>
              <div className={styles.heroStatNum}>9.4<span className={styles.heroStatSup}>K</span></div>
              <div className={styles.heroStatLabel}>{t('stat2')}</div>
            </div>
            <div>
              <div className={styles.heroStatNum}>40<span className={styles.heroStatSup}>+</span></div>
              <div className={styles.heroStatLabel}>{t('stat3')}</div>
            </div>
          </div>
          <div className={styles.heroActions}>
            <a className="btn-primary" href="#publicacoes">{t('cta1')}</a>
            <a className="btn-outline" href="#perfil">{t('cta2')}</a>
          </div>
        </div>

        <div className={styles.heroPhotoWrap}>
          <div className={styles.heroPhotoCard}>
            <img src="/hero.jpg" alt="Prof. João Carlos de Moraes Sá" className={styles.heroPhoto} />
          </div>
        </div>
      </div>
    </section>
  )
}
