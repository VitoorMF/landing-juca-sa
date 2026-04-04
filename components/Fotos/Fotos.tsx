import styles from './Fotos.module.css'

const fotos = [
  { id: '1', src: '/imagem.png', label: 'Prof. Juca Sá em campo', caption: 'Pesquisa de campo · Paraná, Brasil', span: true },
  { id: '2', src: '/image2.png', label: 'Soja em Plantio Direto', caption: 'Soja em Plantio Direto', span: false },
  { id: '3', src: '/image3.png', label: 'Cobertura do solo · Palhada', caption: 'Cobertura do solo · Palhada', span: false },
  { id: '4', src: '/image4.png', label: 'Análise de carbono no laboratório', caption: 'Análise de carbono no laboratório', span: false },
  { id: '5', src: '/image5.png', label: 'The Ohio State University', caption: 'The Ohio State University', span: false },
  { id: '6', src: '/image6.png', label: 'Congresso Internacional SPD', caption: 'Congresso Internacional SPD', span: false },
]

export default function Fotos() {
  return (
    <section id="fotos" className="section">
      <div className="container">
        <div className="section-header reveal">
          <div className="section-tag">Galeria</div>
          <h2 className="section-title">Fotos</h2>
          <p className="section-lead">
            Pesquisa em campo, congressos internacionais e o Sistema Plantio Direto em ação.
          </p>
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
