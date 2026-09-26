import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import LangToggle from '@/components/LangToggle/LangToggle'
import Footer from '@/components/Footer/Footer'
import ScrollRevealProvider from '@/components/ScrollRevealProvider/ScrollRevealProvider'
import SectionHead from '@/components/ui/SectionHead'
import { ArrowLeft } from '@/components/ui/Icons'
import styles from './Subpage.module.css'

interface Props {
  eyebrow: string
  title: string
  lead?: string
  backLabel: string
  children: React.ReactNode
}

/** Moldura das páginas internas (publicações, fotos, apresentações, notícias). */
export default async function Subpage({ eyebrow, title, lead, backLabel, children }: Props) {
  const t = await getTranslations('nav')

  return (
    <ScrollRevealProvider>
      <a className="skip-link" href="#conteudo">{t('skip')}</a>
      <header className={styles.bar}>
        <div className={`wrap ${styles.barInner}`}>
          <Link href="/" className={styles.brand}>
            <span className={styles.monogram} aria-hidden="true">JS</span>
            <span>Prof. Juca Sá</span>
          </Link>
          <LangToggle />
        </div>
      </header>

      <main id="conteudo" className={styles.main}>
        <div className="wrap">
          <Link href="/" className={`text-link ${styles.back}`}>
            <ArrowLeft /> {backLabel}
          </Link>
          <SectionHead as="h1" eyebrow={eyebrow} title={title} lead={lead} className={styles.head} />
          {children}
        </div>
      </main>

      <Footer onHome={false} />
    </ScrollRevealProvider>
  )
}
