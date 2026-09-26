import Image from 'next/image'
import { getTranslations } from 'next-intl/server'
import SectionHead from '@/components/ui/SectionHead'
import { ArrowUpRight } from '@/components/ui/Icons'
import styles from './Perfil.module.css'
import portrait from '@/public/profile-photo.png'

type TimelineItem = { year: string; text: string }
type CardItem = { label: string; value: string }
type ProfileLink = { label: string; url: string }

export default async function Perfil() {
  const t = await getTranslations('perfil')
  const timeline = t.raw('timeline') as TimelineItem[]
  const cardItems = t.raw('cardItems') as CardItem[]
  const links = t.raw('links') as ProfileLink[]
  const bio = t('bio1').split(/\n\s*\n/).filter(Boolean)

  return (
    <section id="perfil" className="section" aria-labelledby="perfil-title">
      <div className={`wrap ${styles.grid}`}>
        <figure className={`${styles.portrait} reveal`}>
          <div className={styles.portraitFrame}>
            <Image
              src={portrait}
              alt={t('portraitAlt')}
              fill
              placeholder="blur"
              sizes="(max-width: 860px) 100vw, 40vw"
              className={styles.portraitImg}
            />
          </div>
          <figcaption className={styles.portraitCaption}>
            Ph.D. · {t('cardTitle')}
          </figcaption>
        </figure>

        <div className={styles.text}>
          <SectionHead eyebrow={t('tag')} title={t('title')} titleId="perfil-title" lead={t('lead')} className={styles.head} />

          <div className={`${styles.bio} reveal`}>
            {bio.map((p, idx) => <p key={idx}>{p}</p>)}
          </div>

          <dl className={`${styles.facts} reveal`}>
            {cardItems.map((item) => (
              <div key={item.label} className={styles.fact}>
                <dt>{item.label}</dt>
                <dd>{item.value}</dd>
              </div>
            ))}
          </dl>

          <div className={`${styles.profiles} reveal`}>
            <h3 className={styles.profilesTitle}>{t('linksTitle')}</h3>
            <ul>
              {links.map((link) => (
                <li key={link.url}>
                  <a className="text-link" href={link.url} target="_blank" rel="noopener noreferrer">
                    {link.label} <ArrowUpRight />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className={`wrap ${styles.timelineWrap}`}>
        <h3 className={`${styles.timelineTitle} reveal`}>{t('timelineTitle')}</h3>
        <ol className={styles.timeline}>
          {timeline.map((item, idx) => (
            <li key={idx} className={`${styles.step} reveal reveal-delay-${idx % 3}`}>
              <span className={styles.year}>{item.year}</span>
              <p>{item.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
