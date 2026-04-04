import styles from './Footer.module.css'

const navSections = [
  { label: 'Perfil', href: '#perfil' },
  { label: 'Opiniões', href: '#opinioes' },
  { label: 'Publicações', href: '#publicacoes' },
  { label: 'Vídeos', href: '#videos' },
  { label: 'Fotos', href: '#fotos' },
  { label: 'Apresentações', href: '#apresentacoes' },
  { label: 'Notícias', href: '#noticias' },
  { label: 'Links', href: '#links' },
]

const academicLinks = [
  { label: 'Google Scholar', href: 'https://scholar.google.com/citations?user=01cxZjoAAAAJ' },
  { label: 'ResearchGate', href: 'https://www.researchgate.net/profile/Joao-Carlos-Sa' },
  { label: 'Ohio State — C-MASC', href: 'https://carbon.osu.edu' },
  { label: 'FEBRAPDP', href: 'https://plantiodireto.org.br' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/jo%C3%A3o-carlos-moraes-s%C3%A1-99595330/' },
]

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.footerInner}>
          <div>
            <div className={styles.footerBrandName}>Prof. Juca Sá</div>
            <p className={styles.footerBrandSub}>
              João Carlos de Moraes Sá — Pesquisador Sênior, Rattan Lal Center for Carbon Management,
              The Ohio State University. Referência mundial em Plantio Direto e carbono no solo.
            </p>
          </div>

          <div>
            <div className={styles.footerColTitle}>Seções</div>
            <div className={styles.footerLinks}>
              {navSections.map((s) => (
                <a key={s.href} className={styles.footerLink} href={s.href}>
                  {s.label}
                </a>
              ))}
            </div>
          </div>

          <div>
            <div className={styles.footerColTitle}>Perfis Acadêmicos</div>
            <div className={styles.footerLinks}>
              {academicLinks.map((l) => (
                <a
                  key={l.href}
                  className={styles.footerLink}
                  href={l.href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {l.label}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className={styles.footerBottom}>
          <span>© 2026 Prof. Juca Sá — Sistema Plantio Direto</span>
          <span>
            Feito com <span className={styles.footerTeal}>♥</span> para a ciência do solo e o clima
          </span>
        </div>
      </div>
    </footer>
  )
}
