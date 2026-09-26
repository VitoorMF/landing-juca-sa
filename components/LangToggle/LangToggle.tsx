'use client'

import { useLocale, useTranslations } from 'next-intl'
import { useRouter, usePathname } from '@/i18n/navigation'
import { routing } from '@/i18n/routing'
import styles from './LangToggle.module.css'

export default function LangToggle({ className = '' }: { className?: string }) {
  const t = useTranslations('nav')
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()

  return (
    <div className={`${styles.toggle} ${className}`} role="group" aria-label={t('language')}>
      {routing.locales.map((l) => (
        <button
          key={l}
          type="button"
          className={styles.opt}
          aria-pressed={locale === l}
          lang={l === 'en' ? 'en' : 'pt-BR'}
          onClick={() => { if (l !== locale) router.replace(pathname, { locale: l }) }}
        >
          {l.toUpperCase()}
        </button>
      ))}
    </div>
  )
}
