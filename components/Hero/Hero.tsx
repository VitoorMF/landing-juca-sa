import styles from './Hero.module.css'

export default function Hero() {
  return (
    <section id="hero" className={styles.hero}>
      <div className={styles.heroBgPattern}></div>
      <div className={`${styles.heroBlob} ${styles.heroBlob1}`}></div>
      <div className={`${styles.heroBlob} ${styles.heroBlob2}`}></div>
      <div className={styles.heroContent}>
        <div>
          <div className={styles.heroEyebrow}>
            🌱 Referência Mundial em Plantio Direto
          </div>
          <h1 className={styles.heroTitle}>Prof. Juca Sá</h1>
          <p className={styles.heroSubtitle}>João Carlos de Moraes Sá</p>
          <p className={styles.heroDesc}>
            Cientista sênior, pesquisador associado no Rattan Lal Center for Carbon Management da{' '}
            <em>The Ohio State University</em>, e referência mundial em dinâmica de carbono orgânico no solo,
            Sistema Plantio Direto e agricultura regenerativa nos trópicos.
          </p>
          <div className={styles.heroStats}>
            <div>
              <div className={styles.heroStatNum}>
                70<span className={styles.heroStatSup}>+</span>
              </div>
              <div className={styles.heroStatLabel}>Artigos científicos</div>
            </div>
            <div>
              <div className={styles.heroStatNum}>
                9.4<span className={styles.heroStatSup}>K</span>
              </div>
              <div className={styles.heroStatLabel}>Citações (Google Scholar)</div>
            </div>
            <div>
              <div className={styles.heroStatNum}>
                40<span className={styles.heroStatSup}>+</span>
              </div>
              <div className={styles.heroStatLabel}>Anos de pesquisa</div>
            </div>
          </div>
          <div className={styles.heroActions}>
            <a className="btn-primary" href="#publicacoes">📄 Ver Publicações</a>
            <a className="btn-outline" href="#perfil">Conheça o Pesquisador</a>
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
