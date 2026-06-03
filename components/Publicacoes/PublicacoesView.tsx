'use client'

import { useState, useEffect, useRef } from 'react'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { Publicacao, TipoPublicacao } from '@/types'
import styles from './Publicacoes.module.css'

interface Props {
  limit?: number
  ctaHref?: string
  searchable?: boolean
}

export default function PublicacoesView({ limit, ctaHref, searchable }: Props) {
  const t = useTranslations('publicacoes')
  const [lista, setLista] = useState<Publicacao[]>([])
  const [activeFilter, setActiveFilter] = useState<TipoPublicacao>('article')
  const [query, setQuery] = useState('')
  const listRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    supabase.from('publicacoes').select('*').order('ordem', { nullsFirst: false }).then(({ data }) => {
      if (data) setLista(data as Publicacao[])
    })
  }, [])

  const q = query.trim().toLowerCase()
  const filtered = lista.filter((p) => {
    const matchTipo = activeFilter === 'misc'
      ? p.tipo !== 'article' && p.tipo !== 'book'
      : p.tipo === activeFilter
    if (!matchTipo) return false
    if (!q) return true
    return (
      p.titulo?.toLowerCase().includes(q) ||
      p.autores?.toLowerCase().includes(q) ||
      p.revista?.toLowerCase().includes(q) ||
      p.ano?.toString().includes(q)
    )
  })

  const visible = limit ? filtered.slice(0, limit) : filtered

  useEffect(() => {
    const container = listRef.current
    if (!container) return
    const cards = container.querySelectorAll(`.${styles.pubCard}`)
    cards.forEach((el) => el.classList.remove('visible'))
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
    )
    cards.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [activeFilter, lista, limit, query])

  return (
    <>
      {searchable && (
        <div className={`${styles.pubSearch} reveal`}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={styles.pubSearchIcon}>
            <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.3-4.3" />
          </svg>
          <input
            className={styles.pubSearchInput}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t('searchPlaceholder')}
          />
          {query && (
            <button className={styles.pubSearchClear} onClick={() => setQuery('')} aria-label="Limpar">✕</button>
          )}
        </div>
      )}

      <div className={`${styles.pubFilters} reveal`}>
        <button className={`${styles.pubFilter} ${activeFilter === 'article' ? styles.active : ''}`} onClick={() => setActiveFilter('article')}>{t('filterArticle')}</button>
        <button className={`${styles.pubFilter} ${activeFilter === 'book' ? styles.active : ''}`} onClick={() => setActiveFilter('book')}>{t('filterBook')}</button>
        <button className={`${styles.pubFilter} ${activeFilter === 'misc' ? styles.active : ''}`} onClick={() => setActiveFilter('misc')}>{t('filterMisc')}</button>
      </div>

      <div ref={listRef} className={styles.pubList}>
        {visible.length === 0 && (
          <div className={styles.pubEmpty}>{t('empty')}</div>
        )}
        {visible.map((pub) => {
          const Wrapper = pub.url ? 'a' : 'div'
          const wrapperProps = pub.url
            ? { href: pub.url, target: '_blank', rel: 'noopener noreferrer' }
            : {}
          return (
            <Wrapper key={pub.id} className={`${styles.pubCard} reveal`} {...(wrapperProps as Record<string, string>)}>
              <div className={styles.pubMeta}>
                <span className={styles.pubYear}>{pub.ano}</span>
                {pub.autores && <span className={styles.pubPlace}>{pub.autores}</span>}
                <span className={`${styles.pubTag} ${pub.tipo === 'article' ? styles.pubTypeArticle : pub.tipo === 'book' ? styles.pubTypeBook : styles.pubTypeMisc}`}>
                  {pub.tipo === 'article' ? t('tagArticle') : pub.tipo === 'book' ? t('tagBook') : t('tagMisc')}
                </span>
              </div>
              <h3 className={styles.pubTitle}>{pub.titulo}</h3>
              {pub.revista && <p className={styles.pubJournal}>{pub.revista}</p>}
            </Wrapper>
          )
        })}
      </div>

      {/* CTA: ver todas (home) ou Google Scholar (página completa) */}
      <div className={`${styles.pubCta} reveal`}>
        {ctaHref ? (
          <Link href={ctaHref} className={styles.pubSeeAll}>
            {t('seeAll')} <span className={styles.pubSeeAllCount}>{t('seeAllCount')}</span> →
          </Link>
        ) : (
          <a className={styles.pubScholar} href="https://scholar.google.com/citations?user=01cxZjoAAAAJ" target="_blank" rel="noopener noreferrer">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 10L12 4 2 10l10 6 10-6z" /><path d="M6 12v5c0 1.5 2.7 3 6 3s6-1.5 6-3v-5" />
            </svg>
            {t('cta')}
            <span className={styles.pubScholarArrow}>→</span>
          </a>
        )}
      </div>
    </>
  )
}
