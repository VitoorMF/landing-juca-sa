import { getTranslations } from 'next-intl/server'
import styles from './Fotos.module.css'
import { supabaseServer } from '@/lib/supabase-server'
import { Foto } from '@/types'

export default async function Fotos() {
  const t = await getTranslations('fotos')
  const { data } = await supabaseServer.from('fotos').select('*')
  const fotos: Foto[] = data ?? []

  return (
    <section id="fotos" className="section">
      <div className="container">
        <div className="section-header reveal">
          <div className="section-tag">{t('tag')}</div>
          <h2 className="section-title">{t('title')}</h2>
          <p className="section-lead">{t('lead')}</p>
        </div>

        <div className={styles.galleryGrid}>
          {fotos.map((foto, idx) => {
            const delay = idx % 3
            return (
              <div
                key={foto.id}
                className={`${styles.galleryItem} ${foto.span ? styles.galleryItemSpan : ''} reveal${delay > 0 ? ` reveal-delay-${delay}` : ''}`}
              >
                <div className={styles.galleryThumb}>
                  <img src={foto.src} alt={foto.label} className={styles.galleryImg} />
                </div>
                <div className={styles.galleryOverlay}>
                  <span className={styles.galleryCaption}>{foto.caption}</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
