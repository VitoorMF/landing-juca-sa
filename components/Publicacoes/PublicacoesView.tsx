'use client'

import { useId, useRef, useState } from 'react'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { ArrowRight, ArrowUpRight, Close, Search } from '@/components/ui/Icons'
import { Publicacao, TipoPublicacao } from '@/types'
import { SCHOLAR_URL } from '@/lib/links'
import styles from './Publicacoes.module.css'

interface Props {
  publicacoes: Publicacao[]
  limit?: number
  showAllLink?: boolean
  searchable?: boolean
}

const TIPOS: TipoPublicacao[] = ['article', 'book', 'misc']

function matchesTipo(p: Publicacao, tipo: TipoPublicacao) {
  return tipo === 'misc' ? p.tipo !== 'article' && p.tipo !== 'book' : p.tipo === tipo
}

export default function PublicacoesView({ publicacoes, limit, showAllLink, searchable }: Props) {
  const t = useTranslations('publicacoes')
  const [activeFilter, setActiveFilter] = useState<TipoPublicacao>('article')
  const [query, setQuery] = useState('')
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])
  const uid = useId()

  const labels: Record<TipoPublicacao, string> = {
    article: t('filterArticle'),
    book: t('filterBook'),
    misc: t('filterMisc'),
  }

  const q = query.trim().toLowerCase()
  const filtered = publicacoes.filter((p) => {
    if (!matchesTipo(p, activeFilter)) return false
    if (!q) return true
    return (
      p.titulo?.toLowerCase().includes(q) ||
      p.autores?.toLowerCase().includes(q) ||
      p.revista?.toLowerCase().includes(q) ||
      p.ano?.toString().includes(q)
    )
  })
  const visible = limit ? filtered.slice(0, limit) : filtered

  function onTabKey(e: React.KeyboardEvent, idx: number) {
    let next = -1
    if (e.key === 'ArrowRight') next = (idx + 1) % TIPOS.length
    if (e.key === 'ArrowLeft') next = (idx - 1 + TIPOS.length) % TIPOS.length
    if (e.key === 'Home') next = 0
    if (e.key === 'End') next = TIPOS.length - 1
    if (next < 0) return
    e.preventDefault()
    setActiveFilter(TIPOS[next])
    tabRefs.current[next]?.focus()
  }

  const panelId = `${uid}-panel`

  return (
    <div className={styles.view}>
      {searchable && (
        <div className={`${styles.search} reveal`}>
          <Search className={styles.searchIcon} />
          <input
            type="search"
            className={styles.searchInput}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t('searchPlaceholder')}
            aria-label={t('searchLabel')}
          />
          {query && (
            <button type="button" className={styles.searchClear} onClick={() => setQuery('')} aria-label={t('clear')}>
              <Close />
            </button>
          )}
        </div>
      )}

      <div className={`${styles.tabs} reveal`} role="tablist" aria-label={t('tablistLabel')}>
        {TIPOS.map((tipo, idx) => {
          const selected = activeFilter === tipo
          const count = publicacoes.filter((p) => matchesTipo(p, tipo)).length
          return (
            <button
              key={tipo}
              ref={(el) => { tabRefs.current[idx] = el }}
              type="button"
              role="tab"
              id={`${uid}-tab-${tipo}`}
              aria-selected={selected}
              aria-controls={panelId}
              tabIndex={selected ? 0 : -1}
              className={styles.tab}
              onClick={() => setActiveFilter(tipo)}
              onKeyDown={(e) => onTabKey(e, idx)}
            >
              {labels[tipo]}
              {count > 0 && <span className={styles.tabCount}>{count}</span>}
            </button>
          )
        })}
      </div>

      <div id={panelId} role="tabpanel" aria-labelledby={`${uid}-tab-${activeFilter}`} className={styles.panel}>
        {visible.length === 0 ? (
          <p className={styles.empty}>{t('empty')}</p>
        ) : (
          <ul className={styles.list}>
            {visible.map((pub) => {
              const content = (
                <>
                  <span className={styles.year}>{pub.ano}</span>
                  <span className={styles.body}>
                    <span className={styles.pubTitle}>{pub.titulo}</span>
                    {pub.autores && <span className={styles.authors}>{pub.autores}</span>}
                    {pub.revista && <span className={styles.journal}>{pub.revista}</span>}
                  </span>
                  {pub.url && <ArrowUpRight className={styles.arrow} />}
                </>
              )
              return (
                <li key={pub.id}>
                  {pub.url ? (
                    <a className={styles.item} href={pub.url} target="_blank" rel="noopener noreferrer">{content}</a>
                  ) : (
                    <div className={styles.item}>{content}</div>
                  )}
                </li>
              )
            })}
          </ul>
        )}
      </div>

      <div className={styles.footer}>
        {showAllLink ? (
          <Link href="/publicacoes" className="btn-line">
            {t('seeAll')} <ArrowRight />
          </Link>
        ) : (
          <a className="btn-line" href={SCHOLAR_URL} target="_blank" rel="noopener noreferrer">
            {t('cta')} <ArrowUpRight />
          </a>
        )}
      </div>
    </div>
  )
}
