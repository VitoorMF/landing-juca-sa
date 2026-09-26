import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { ArrowUp, ArrowUpRight } from '@/components/ui/Icons'
import styles from './Footer.module.css'

const SECTION_IDS = ['perfil', 'opinioes', 'publicacoes', 'fotos', 'apresentacoes', 'noticias', 'links']

const academicLinks = [
  { label: 'Google Scholar', href: 'https://scholar.google.com/citations?user=01cxZjoAAAAJ' },
  { label: 'ResearchGate', href: 'https://www.researchgate.net/profile/Joao-Carlos-Sa' },
  { label: 'Ohio State — C-MASC', href: 'https://carbon.osu.edu' },
  { label: 'FEBRAPDP', href: 'https://plantiodireto.org.br' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/jo%C3%A3o-carlos-moraes-s%C3%A1-99595330/' },
]

/** `onHome`: na landing as seções são âncoras locais; nas páginas internas, apontam para a home. */
export default async function Footer({ onHome = true }: { onHome?: boolean }) {
  const t = await getTranslations('footer')
  const navLabels = t.raw('navItems') as string[]
  const [madeBefore, madeAfter] = t('made').split('♥')

  return (
    <footer className={styles.footer}>
      <div className="wrap">
        <div className={styles.top}>
          <div className={styles.brand}>
            <p className={styles.brandName}>Prof. Juca Sá</p>
            <p className={styles.brandSub}>{t('brandSub')}</p>
          </div>

          <nav aria-label={t('sections')}>
            <h2 className={styles.colTitle}>{t('sections')}</h2>
            <ul className={styles.list}>
              {navLabels.map((label, idx) => (
                <li key={SECTION_IDS[idx]}>
                  {onHome ? (
                    <a href={`#${SECTION_IDS[idx]}`}>{label}</a>
                  ) : (
                    <Link href={`/#${SECTION_IDS[idx]}`}>{label}</Link>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label={t('academic')}>
            <h2 className={styles.colTitle}>{t('academic')}</h2>
            <ul className={styles.list}>
              {academicLinks.map((l) => (
                <li key={l.href}>
                  <a href={l.href} target="_blank" rel="noopener noreferrer">
                    {l.label} <ArrowUpRight />
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className={styles.bottom}>
          <span>{t('copyright')}</span>
          <span>
            {madeBefore}<span className={styles.heart}>♥</span>{madeAfter}
          </span>
          {onHome ? (
            <a href="#inicio" className={styles.backTop}>{t('backToTop')} <ArrowUp /></a>
          ) : (
            <Link href="/" className={styles.backTop}>{t('backToTop')} <ArrowUp /></Link>
          )}
        </div>
      </div>
    </footer>
  )
}
