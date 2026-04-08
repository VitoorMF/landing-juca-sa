import styles from './Noticias.module.css'
import { supabaseServer } from '@/lib/supabase-server'
import { Noticia } from '@/types'

export default async function Noticias() {
  const { data } = await supabaseServer.from('noticias').select('*')
  const noticias: Noticia[] = (data ?? []).map((n: Record<string, unknown>) => ({
    ...n,
    gradientFrom: n.gradient_from,
    gradientTo: n.gradient_to,
  } as Noticia))

  const destaque = noticias.find((n) => n.destaque)
  const secundarias = noticias.filter((n) => !n.destaque)

  return (
    <section id="noticias" className="section">
      <div className="container">
        <div className="section-header reveal">
          <div className="section-tag">Cobertura de Imprensa</div>
          <h2 className="section-title">Notícias Recentes</h2>
          <p className="section-lead">
            Pesquisas e declarações do Prof. Juca Sá repercutindo na mídia especializada em
            agronegócio, ciência do solo e clima.
          </p>
        </div>

        <div className={styles.newsGrid}>
          {destaque && (
            <div className={`${styles.newsCardMain} reveal`}>
              <div
                className={styles.newsCardImg}
                style={{ background: `linear-gradient(135deg, ${destaque.gradientFrom}, ${destaque.gradientTo})` }}
              >
                <div className={styles.newsImgEmoji}>{destaque.emoji}</div>
                <div className={styles.newsImgOverlay} />
                {destaque.tag && (
                  <div className={styles.newsImgTag}>{destaque.tag}</div>
                )}
              </div>
              <div className={styles.newsCardBody}>
                <div className={styles.newsDate}>{destaque.data}</div>
                <div className={styles.newsTitle}>{destaque.titulo}</div>
                <div className={styles.newsDesc}>{destaque.descricao}</div>
              </div>
            </div>
          )}

          <div className={styles.newsSecondary}>
            {secundarias.map((noticia, idx) => {
              const delay = Math.min(idx + 1, 3)
              const Wrapper = noticia.url ? 'a' : 'div'
              const wrapperProps = noticia.url
                ? { href: noticia.url, target: '_blank', rel: 'noopener noreferrer' }
                : {}
              return (
                <Wrapper
                  key={noticia.id}
                  className={`${styles.newsCardSm} reveal reveal-delay-${delay}`}
                  {...(wrapperProps as Record<string, string>)}
                >
                  <div
                    className={styles.newsCardSmImg}
                    style={{ background: `linear-gradient(135deg, ${noticia.gradientFrom}, ${noticia.gradientTo})` }}
                  >
                    <span className={styles.newsCardSmEmoji}>{noticia.emoji}</span>
                  </div>
                  <div className={styles.newsCardSmBody}>
                    <div className={styles.newsCardSmDate}>{noticia.data}</div>
                    <div className={styles.newsCardSmTitle}>{noticia.titulo}</div>
                  </div>
                </Wrapper>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
