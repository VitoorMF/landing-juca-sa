import { videos } from '@/data/videos'
import styles from './Videos.module.css'

export default function Videos() {
  return (
    <section id="videos" className="section section-alt">
      <div className="container">
        <div className="section-header reveal">
          <div className="section-tag">Conteúdo em Vídeo</div>
          <h2 className="section-title">Palestras &amp; Entrevistas</h2>
          <p className="section-lead">
            Aulas, cursos online, entrevistas e apresentações em congressos nacionais e internacionais.
          </p>
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
