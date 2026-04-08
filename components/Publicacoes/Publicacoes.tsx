'use client'

import { useState, useEffect, useRef } from 'react'
import { useTranslations } from 'next-intl'
import { supabase } from '@/lib/supabase'
import { Publicacao, TipoPublicacao } from '@/types'
import styles from './Publicacoes.module.css'

type FilterType = TipoPublicacao

export default function Publicacoes() {
  const t = useTranslations('publicacoes')
  const [lista, setLista] = useState<Publicacao[]>([])
  const [activeFilter, setActiveFilter] = useState<FilterType>('article')
  const listRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    async function buscar() {
      const { data } = await supabase.from('publicacoes').select('*')
      if (data) setLista(data as Publicacao[])
    }
    buscar()
  }, [])

  const filtered = lista.filter((p) => {
    if (activeFilter === 'misc') return p.tipo !== 'article' && p.tipo !== 'book'
    return p.tipo === activeFilter
  })

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
  }, [activeFilter, lista])

  return (
    <section id="publicacoes" className="section">
      <div className="container">
        <div className="section-header reveal">
          <div className="section-tag">{t('tag')}</div>
          <h2 className="section-title">{t('title')}</h2>
          <p className="section-lead">{t('lead')}</p>
        </div>

        <div className={`${styles.pubFilters} reveal`}>
          <button className={`${styles.pubFilter} ${activeFilter === 'article' ? styles.active : ''}`} onClick={() => setActiveFilter('article')}>{t('filterArticle')}</button>
          <button className={`${styles.pubFilter} ${activeFilter === 'book' ? styles.active : ''}`} onClick={() => setActiveFilter('book')}>{t('filterBook')}</button>
          <button className={`${styles.pubFilter} ${activeFilter === 'misc' ? styles.active : ''}`} onClick={() => setActiveFilter('misc')}>{t('filterMisc')}</button>
        </div>

        <div ref={listRef} className={styles.pubList}>
          {filtered.map((pub) => (
            <div key={pub.id} className={`${styles.pubCard} reveal`}>
              <div className={styles.pubYearBadge}>{pub.ano}</div>
              <div>
                {pub.url ? (
                  <a href={pub.url} target="_blank" rel="noopener noreferrer" className={styles.pubTitle}>{pub.titulo}</a>
                ) : (
                  <div className={styles.pubTitle}>{pub.titulo}</div>
                )}
                <div className={styles.pubAuthors}>{pub.autores}</div>
                <div className={styles.pubJournal}>{pub.revista}</div>
              </div>
              <span className={`${styles.pubTypeTag} ${pub.tipo === 'article' ? styles.pubTypeArticle : pub.tipo === 'book' ? styles.pubTypeBook : styles.pubTypeMisc}`}>
                {pub.tipo === 'article' ? t('tagArticle') : pub.tipo === 'book' ? t('tagBook') : t('tagMisc')}
              </span>
            </div>
          ))}
        </div>

        <div className={`${styles.pubCta} reveal`}>
          <a className="btn-primary" href="https://scholar.google.com/citations?user=01cxZjoAAAAJ" target="_blank" rel="noopener noreferrer">
            {t('cta')}
          </a>
        </div>
      </div>
    </section>
  )
}
