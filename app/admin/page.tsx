'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import styles from './page.module.css'

const secoes = [
  { href: '/admin/publicacoes',   label: 'Publicações',   icon: '📚', tabela: 'publicacoes',   cor: '#00A896' },
  { href: '/admin/noticias',      label: 'Notícias',      icon: '📰', tabela: 'noticias',      cor: '#2C5F2D' },
  { href: '/admin/videos',        label: 'Vídeos',        icon: '🎥', tabela: 'videos',        cor: '#C8A84B' },
  { href: '/admin/fotos',         label: 'Fotos',         icon: '🖼️', tabela: 'fotos',         cor: '#6B4C2A' },
  { href: '/admin/apresentacoes', label: 'Apresentações', icon: '🎤', tabela: 'apresentacoes', cor: '#1E3A1F' },
  { href: '/admin/links',         label: 'Links',         icon: '🔗', tabela: 'links',         cor: '#4A7C59' },
]

const atalhos = [
  { href: '/admin/publicacoes', label: 'Nova publicação',   icon: '📚' },
  { href: '/admin/noticias',    label: 'Nova notícia',      icon: '📰' },
  { href: '/admin/fotos',       label: 'Enviar foto',       icon: '🖼️' },
  { href: '/admin/metricas',    label: 'Ver métricas',      icon: '📈' },
]

export default function AdminHome() {
  const [contagens, setContagens] = useState<Record<string, number>>({})

  useEffect(() => {
    async function buscar() {
      const resultados = await Promise.all(
        secoes.map(s => supabase.from(s.tabela).select('id', { count: 'exact', head: true }))
      )
      const nova: Record<string, number> = {}
      secoes.forEach((s, i) => {
        nova[s.tabela] = resultados[i].count ?? 0
      })
      setContagens(nova)
    }
    buscar()
  }, [])

  const hoje = new Date().toLocaleDateString('pt-BR', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  })

  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.header}>
        <div>
          <h1 className={styles.titulo}>Bem-vindo, Prof. Juca Sá 👋</h1>
          <p className={styles.data}>{hoje}</p>
        </div>
        <Link href="/" target="_blank" className={styles.btnVerSite}>
          🌐 Ver site ao vivo
        </Link>
      </div>

      {/* Cards de contagem */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitulo}>Resumo do conteúdo</h2>
        <div className={styles.grid}>
          {secoes.map(s => (
            <Link key={s.href} href={s.href} className={styles.card}>
              <div className={styles.cardIconWrap} style={{ background: s.cor }}>
                <span className={styles.cardIcon}>{s.icon}</span>
              </div>
              <div className={styles.cardInfo}>
                <span className={styles.cardCount}>{contagens[s.tabela] ?? '—'}</span>
                <span className={styles.cardLabel}>{s.label}</span>
              </div>
              <span className={styles.cardArrow}>→</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Ações rápidas */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitulo}>Ações rápidas</h2>
        <div className={styles.atalhos}>
          {atalhos.map(a => (
            <Link key={a.href} href={a.href} className={styles.atalho}>
              <span>{a.icon}</span>
              <span>{a.label}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Dica */}
      <div className={styles.dica}>
        <span className={styles.dicaIcon}>💡</span>
        <p>
          Use o menu à esquerda para navegar entre as seções.
          Clique em <strong>Editar</strong> em qualquer item para alterar o conteúdo do site.
        </p>
      </div>
    </div>
  )
}
