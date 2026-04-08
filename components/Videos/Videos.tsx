import { getTranslations } from 'next-intl/server'
import styles from './Videos.module.css'
import { supabaseServer } from '@/lib/supabase-server'
import { Video } from '@/types'

export default async function Videos() {
  const t = await getTranslations('videos')
  const { data } = await supabaseServer.from('videos').select('*')
  const videos: Video[] = (data ?? []).map((v: Record<string, unknown>) => ({
    ...v,
    gradientFrom: v.gradient_from,
    gradientTo: v.gradient_to,
  } as Video))

  return (
    <section id="videos" className="section section-alt">
      <div className="container">
        <div className="section-header reveal">
          <div className="section-tag">{t('tag')}</div>
          <h2 className="section-title">{t('title')}</h2>
          <p className="section-lead">{t('lead')}</p>
        </div>

        <div className={styles.videosGrid}>
          {videos.map((video, idx) => {
            const delay = idx % 3
            const delayClass = delay > 0 ? ` reveal-delay-${delay}` : ''
            const CardWrapper = video.url && video.url !== '#' ? 'a' : 'div'
            const cardProps = video.url && video.url !== '#'
              ? { href: video.url, target: '_blank', rel: 'noopener noreferrer' }
              : {}
            return (
              <CardWrapper
                key={video.id}
                className={`${styles.videoCard} reveal${delayClass}`}
                {...(cardProps as Record<string, string>)}
              >
                <div className={styles.videoThumb}>
                  <div
                    className={styles.videoThumbBg}
                    style={{ background: `linear-gradient(135deg, ${video.gradientFrom}, ${video.gradientTo})` }}
                  >
                    <span className={styles.videoThumbEmoji}>{video.emoji}</span>
                  </div>
                  <div className={styles.videoThumbOverlay}>
                    <div className={styles.videoPlayBtn}>▶</div>
                  </div>
                  <div className={styles.videoThumbLabel}>{video.label}</div>
                </div>
                <div className={styles.videoInfo}>
                  <div className={styles.videoTitle}>{video.titulo}</div>
                  <div className={styles.videoMeta}>{video.meta}</div>
                </div>
              </CardWrapper>
            )
          })}
        </div>
      </div>
    </section>
  )
}
