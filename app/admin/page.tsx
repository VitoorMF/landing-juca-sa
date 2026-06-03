'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

const STATS = [
  { href: '/admin/publicacoes',   label: 'Publicações',   tabela: 'publicacoes',
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5"/><path d="M9 13h6M9 17h6"/></svg> },
  { href: '/admin/apresentacoes', label: 'Apresentações', tabela: 'apresentacoes',
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="3" width="6" height="11" rx="3"/><path d="M6 11a6 6 0 0 0 12 0"/><path d="M12 17v4M9 21h6"/></svg> },
  { href: '/admin/fotos',         label: 'Fotos',         tabela: 'fotos',
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="8.5" cy="9.5" r="1.6"/><path d="M21 16l-5-5L5 20"/></svg> },
  { href: '/admin/links',         label: 'Links',         tabela: 'links',
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a4 4 0 0 0 5.7.3l2.6-2.6a4 4 0 0 0-5.7-5.7l-1.5 1.5"/><path d="M14 11a4 4 0 0 0-5.7-.3L5.7 13.3a4 4 0 0 0 5.7 5.7l1.5-1.5"/></svg> },
]

const TIPS = [
  {
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>,
    title: 'Escolha uma seção no menu',
    text: 'Use o menu verde à esquerda para abrir Publicações, Fotos, Apresentações, Links ou Textos.',
  },
  {
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="4" width="16" height="16" rx="2"/><path d="M4 9h16M9 4v16"/></svg>,
    title: 'Edite como numa planilha',
    text: 'Clique em qualquer célula e digite. Use Tab para ir à próxima coluna e Enter para descer uma linha.',
  },
  {
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14"/></svg>,
    title: 'Adicionar e remover',
    text: 'O botão verde no fim da tabela cria uma nova linha. O ícone de lixeira remove uma existente.',
  },
  {
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><path d="M17 21v-8H7v8M7 3v5h8"/></svg>,
    title: 'Não esqueça de salvar',
    text: 'Ao terminar, clique em "Salvar alterações" no topo. Antes disso, nada vai ao ar no site.',
  },
]

export default function AdminHome() {
  const [counts, setCounts] = useState<Record<string, number>>({})

  useEffect(() => {
    Promise.all(STATS.map(s => supabase.from(s.tabela).select('id', { count: 'exact', head: true })))
      .then(results => {
        const c: Record<string, number> = {}
        STATS.forEach((s, i) => { c[s.tabela] = results[i].count ?? 0 })
        setCounts(c)
      })
  }, [])

  const hora = new Date().getHours()
  const saudacao = hora < 12 ? 'Bom dia' : hora < 18 ? 'Boa tarde' : 'Boa noite'
  const hoje = new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })

  return (
    <div className="adminRoot">
      <div className="topbar">
        <div>
          <h1 className="topbarTitle">{saudacao}, Professor</h1>
          <div className="topbarHint">{hoje}</div>
        </div>
        <div className="saveCluster">
          <Link href="/" target="_blank" className="btn btnPrimary">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" style={{ width: 18, height: 18 }}>
              <circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15 15 0 0 1 0 20M12 2a15 15 0 0 0 0 20"/>
            </svg>
            Ver site ao vivo
          </Link>
        </div>
      </div>

      <div className="content">
        <div className="hintBar">
          Este é o seu painel. Aqui o senhor mantém o site sempre atualizado — sem precisar de programador. Veja abaixo o que já está publicado.
        </div>

        {/* Conteúdo publicado */}
        <h2 className="sectionTitle">Conteúdo publicado</h2>
        <div className="dashGrid">
          {STATS.map(s => (
            <Link key={s.href} href={s.href} className="statCard">
              <div className="statIco">{s.icon}</div>
              <div className="statNum">{counts[s.tabela] ?? '—'}</div>
              <div className="statLbl">{s.label}</div>
              <span className="statGo">Gerenciar →</span>
            </Link>
          ))}
        </div>

        {/* Como usar */}
        <h2 className="sectionTitle" style={{ marginTop: 36 }}>Como usar o painel</h2>
        <div className="tipsGrid">
          {TIPS.map((t, i) => (
            <div key={i} className="tipCard">
              <div className="tipNum">{i + 1}</div>
              <div className="tipIco">{t.icon}</div>
              <div>
                <b className="tipTitle">{t.title}</b>
                <span className="tipText">{t.text}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
