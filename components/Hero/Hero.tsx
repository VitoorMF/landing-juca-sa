import Image from 'next/image'
import { getTranslations } from 'next-intl/server'
import styles from './Hero.module.css'
import WelcomeModal from './WelcomeModal'
import CourseModal from './CourseModal'
import { ArrowDown, ArrowUpRight } from '@/components/ui/Icons'
import { Modulo } from '@/types'
import { LATTES_URL } from '@/lib/links'
import heroPhoto from '@/public/image2.png'

export default async function Hero({ modulos }: { modulos: Modulo[] }) {
  const t = await getTranslations('hero')

  const stats = [
    { value: t('stat1Value'), label: t('stat1') },
    { value: t('stat2Value'), label: t('stat2') },
    { value: t('stat3Value'), label: t('stat3') },
  ]

  return (
    <>
      <section id="inicio" className={styles.hero} aria-labelledby="hero-title">
        <div className={styles.content}>
          <div className={`eyebrow ${styles.eyebrow}`}>{t('eyebrow')}</div>
          <h1 id="hero-title" className={styles.title}>{t('title')}</h1>

          <div className={styles.identity}>
            <p className={styles.name}>Prof. Juca Sá</p>
            <p className={styles.fullName}>João Carlos de Moraes Sá</p>
          </div>

          <p className={styles.desc}>{t('desc')}</p>

          <div className={styles.actions}>
            <a className="btn-solid" href="#perfil">
              {t('cta2')} <ArrowDown />
            </a>
            <CourseModal modulos={modulos} label={t('courseBtn')} className="btn-line" />
          </div>

          <div className={styles.subActions}>
            <a className="text-link" href={LATTES_URL} target="_blank" rel="noopener noreferrer">
              {t('cta1')} <ArrowUpRight />
            </a>
            <WelcomeModal label={t('welcomeLink')} className="text-link" />
          </div>
        </div>

        <figure className={styles.photo}>
          <Image
            src={heroPhoto}
            alt={t('photoAlt')}
            fill
            priority
            placeholder="blur"
            sizes="(max-width: 860px) 100vw, 50vw"
            className={styles.photoImg}
          />
          <figcaption className={styles.caption}>
            {t('photoTitle')}
            <span>{t('photoCaption')}</span>
          </figcaption>
        </figure>
      </section>

      <section className={`tone-dark ${styles.stats}`} aria-label={t('statsLabel')}>
        <dl className={`wrap ${styles.statsGrid}`}>
          {stats.map((s) => (
            <div key={s.label} className={styles.stat}>
              <dt>{s.label}</dt>
              <dd>{s.value}</dd>
            </div>
          ))}
        </dl>
      </section>
    </>
  )
}
