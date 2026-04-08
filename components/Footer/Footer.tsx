import { getTranslations } from 'next-intl/server'
import styles from './Footer.module.css'

const navHrefs = ['#perfil', '#opinioes', '#publicacoes', '#videos', '#fotos', '#apresentacoes', '#noticias', '#links']

const academicLinks = [
  { label: 'Google Scholar', href: 'https://scholar.google.com/citations?user=01cxZjoAAAAJ' },
  { label: 'ResearchGate',   href: 'https://www.researchgate.net/profile/Joao-Carlos-Sa' },
  { label: 'Ohio State — C-MASC', href: 'https://carbon.osu.edu' },
  { label: 'FEBRAPDP',       href: 'https://plantiodireto.org.br' },
  { label: 'LinkedIn',       href: 'https://www.linkedin.com/in/jo%C3%A3o-carlos-moraes-s%C3%A1-99595330/' },
]

export default async function Footer() {
  const t = await getTranslations('footer')
  const navLabels = t.raw('navItems') as string[]

  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.footerInner}>
          <div>
            <div className={styles.footerBrandName}>Prof. Juca Sá</div>
            <p className={styles.footerBrandSub}>{t('brandSub')}</p>
          </div>

          <div>
            <div className={styles.footerColTitle}>{t('sections')}</div>
            <div className={styles.footerLinks}>
              {navLabels.map((label, idx) => (
                <a key={navHrefs[idx]} className={styles.footerLink} href={navHrefs[idx]}>
                  {label}
                </a>
              ))}
            </div>
          </div>

          <div>
            <div className={styles.footerColTitle}>{t('academic')}</div>
            <div className={styles.footerLinks}>
              {academicLinks.map((l) => (
                <a key={l.href} className={styles.footerLink} href={l.href} target="_blank" rel="noopener noreferrer">
                  {l.label}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className={styles.footerBottom}>
          <span>{t('copyright')}</span>
          <span>
            {t('made').split('♥')[0]}
            <span className={styles.footerTeal}>♥</span>
            {t('made').split('♥')[1]}
          </span>
        </div>
      </div>
    </footer>
  )
}
