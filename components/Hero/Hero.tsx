import { getTranslations } from 'next-intl/server'
import styles from './Hero.module.css'
import WelcomeModal from './WelcomeModal'
import CourseModal from './CourseModal'
import { supabaseServer } from '@/lib/supabase-server'
import { Modulo } from '@/types'

export default async function Hero() {
  const t = await getTranslations('hero')
  const { data } = await supabaseServer.from('modulos').select('*').order('ordem')
  const modulos: Modulo[] = data ?? []

  return (
    <section id="hero" className={styles.hero}>

      <div className={styles.heroBgPattern}></div>
      <div className={`${styles.heroBlob} ${styles.heroBlob1}`}></div>
      <div className={`${styles.heroBlob} ${styles.heroBlob2}`}></div>
      <div className={styles.heroContent}>
        <div>
          <WelcomeModal label={t('eyebrow')} />
          <h1 className={styles.heroTitle}>Prof. Juca Sá</h1>
          <p className={styles.heroSubtitle}>João Carlos de Moraes Sá</p>
          <p className={styles.heroDesc}>{t('desc')}</p>
          <div className={styles.heroStats}>
            <div>
              <div className={styles.heroStatNum}>70<span className={styles.heroStatSup}>+</span></div>
              <div className={styles.heroStatLabel}>{t('stat1')}</div>
            </div>
            <div>
              <div className={styles.heroStatNum}>+9.4<span className={styles.heroStatSup}>K</span></div>
              <div className={styles.heroStatLabel}>{t('stat2')}</div>
            </div>
            <div>
              <div className={styles.heroStatNum}>40<span className={styles.heroStatSup}>+</span></div>
              <div className={styles.heroStatLabel}>{t('stat3')}</div>
            </div>
          </div>
          <div className={styles.heroActions}>
            <a className="btn-primary" href="#perfil">
              {t('cta2')}
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" style={{ width: 18, height: 18 }}>
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </a>
            <a className="btn-outline" href="http://lattes.cnpq.br/5078594632126000" target="_blank" rel="noopener noreferrer">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" style={{ width: 17, height: 17 }}>
                <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" /><path d="M14 3v5h5" />
              </svg>
              {t('cta1')}
            </a>
            <CourseModal modulos={modulos} />
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
