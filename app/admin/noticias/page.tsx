'use client'

import { useEffect, useState } from 'react'
import { Noticia } from '@/types'
import { supabase } from '@/lib/supabase'
import styles from './page.module.css'

const vazio: Omit<Noticia, 'id'> = {
  data: '', titulo: '', descricao: '', tag: '', emoji: '📰',
  gradientFrom: '#1E3A1F', gradientTo: '#2C5F2D', url: '', destaque: false,
}

// Banco usa snake_case, interface usa camelCase — convertemos aqui
function dbParaNoticia(n: Record<string, unknown>): Noticia {
  return { ...n, gradientFrom: n.gradient_from, gradientTo: n.gradient_to } as Noticia
}

export default function NoticiasAdmin() {
  const [lista, setLista] = useState<Noticia[]>([])
  const [form, setForm] = useState<Omit<Noticia, 'id'>>(vazio)
  const [editandoId, setEditandoId] = useState<string | null>(null)
  const [mostrarForm, setMostrarForm] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)

  useEffect(() => {
    async function buscar() {
      const { data } = await supabase.from('noticias').select('*')
      if (data) setLista(data.map(dbParaNoticia))
    }
    buscar()
  }, [])

  function abrirNovo() {
    setForm(vazio); setEditandoId(null); setMostrarForm(true)
  }

  function abrirEditar(n: Noticia) {
    setForm({ data: n.data, titulo: n.titulo, descricao: n.descricao, tag: n.tag,
      emoji: n.emoji, gradientFrom: n.gradientFrom, gradientTo: n.gradientTo,
      url: n.url ?? '', destaque: n.destaque ?? false })
    setEditandoId(n.id); setMostrarForm(true)
  }

  function fecharForm() { setMostrarForm(false); setEditandoId(null); setForm(vazio) }

  async function salvar() {
    if (!form.titulo.trim()) return
    const { gradientFrom, gradientTo, ...resto } = form
    const payload = { ...resto, gradient_from: gradientFrom, gradient_to: gradientTo }

    if (editandoId) {
      await supabase.from('noticias').update(payload).eq('id', editandoId)
      setLista(prev => prev.map(n => n.id === editandoId ? { ...form, id: editandoId } : n))
    } else {
      const { data: novo } = await supabase.from('noticias').insert(payload).select().single()
      if (novo) setLista(prev => [dbParaNoticia(novo), ...prev])
    }
    fecharForm()
  }

  async function excluir(id: string) {
    await supabase.from('noticias').delete().eq('id', id)
    setLista(prev => prev.filter(n => n.id !== id))
    setConfirmDelete(null)
  }

  return (
    <div className={styles.page}>
      <div className={styles.cabecalho}>
        <div>
          <h1 className={styles.titulo}>Notícias</h1>
          <p className={styles.sub}>{lista.length} notícias cadastradas</p>
        </div>
        <button className={styles.btnPrimario} onClick={abrirNovo}>+ Nova notícia</button>
      </div>

      <div className={styles.tabelaWrap}>
        <table className={styles.tabela}>
          <thead>
            <tr>
              <th style={{ width: 40 }}>Em.</th>
              <th>Título</th>
              <th style={{ width: 160 }}>Data / Fonte</th>
              <th style={{ width: 90 }}>Destaque</th>
              <th style={{ width: 110 }}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {lista.length === 0 && (
              <tr><td colSpan={5} className={styles.vazio}>Nenhuma notícia cadastrada.</td></tr>
            )}
            {lista.map(n => (
              <tr key={n.id}>
                <td style={{ fontSize: 22, textAlign: 'center' }}>{n.emoji}</td>
                <td>
                  <div className={styles.tituloCell}>{n.titulo}</div>
                  {n.descricao && <div className={styles.subCell}>{n.descricao.slice(0, 80)}…</div>}
                </td>
                <td className={styles.subCell}>{n.data}</td>
                <td>{n.destaque ? <span className={styles.badgeSim}>Sim</span> : <span className={styles.badgeNao}>Não</span>}</td>
                <td>
                  <div className={styles.acoes}>
                    <button className={styles.btnEditar} onClick={() => abrirEditar(n)}>✏️ Editar</button>
                    <button className={styles.btnExcluir} onClick={() => setConfirmDelete(n.id)}>🗑️</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {confirmDelete && (
        <div className={styles.overlay} onClick={() => setConfirmDelete(null)}>
          <div className={styles.modalConfirm} onClick={e => e.stopPropagation()}>
            <div className={styles.modalIcon}>🗑️</div>
            <h3>Excluir notícia?</h3>
            <p>Esta ação não pode ser desfeita.</p>
            <div className={styles.modalAcoes}>
              <button className={styles.btnCancelar} onClick={() => setConfirmDelete(null)}>Cancelar</button>
              <button className={styles.btnExcluirConfirm} onClick={() => excluir(confirmDelete)}>Excluir</button>
            </div>
          </div>
        </div>
      )}

      {mostrarForm && (
        <div className={styles.overlay} onClick={fecharForm}>
          <div className={styles.drawer} onClick={e => e.stopPropagation()}>
            <div className={styles.drawerHeader}>
              <h2 className={styles.drawerTitulo}>{editandoId ? 'Editar notícia' : 'Nova notícia'}</h2>
              <button className={styles.btnFechar} onClick={fecharForm}>✕</button>
            </div>
            <div className={styles.drawerBody}>
              <label className={styles.label}>
                Emoji
                <input className={styles.input} value={form.emoji}
                  onChange={e => setForm(f => ({ ...f, emoji: e.target.value }))} placeholder="📰" />
              </label>
              <label className={styles.label}>
                Título *
                <input className={styles.input} value={form.titulo}
                  onChange={e => setForm(f => ({ ...f, titulo: e.target.value }))} placeholder="Título da notícia" />
              </label>
              <label className={styles.label}>
                Descrição
                <textarea className={`${styles.input} ${styles.textarea}`} value={form.descricao}
                  onChange={e => setForm(f => ({ ...f, descricao: e.target.value }))} placeholder="Descrição breve…" rows={4} />
              </label>
              <div className={styles.linha2col}>
                <label className={styles.label}>
                  Data / Fonte
                  <input className={styles.input} value={form.data}
                    onChange={e => setForm(f => ({ ...f, data: e.target.value }))} placeholder="Ex: Novembro 2025" />
                </label>
                <label className={styles.label}>
                  Tag
                  <input className={styles.input} value={form.tag}
                    onChange={e => setForm(f => ({ ...f, tag: e.target.value }))} placeholder="Ex: COP30 · 2025" />
                </label>
              </div>
              <label className={styles.label}>
                Link (opcional)
                <input className={styles.input} value={form.url}
                  onChange={e => setForm(f => ({ ...f, url: e.target.value }))} placeholder="https://…" type="url" />
              </label>
              <label className={styles.checkLabel}>
                <input type="checkbox" checked={form.destaque}
                  onChange={e => setForm(f => ({ ...f, destaque: e.target.checked }))} />
                Notícia em destaque (card grande)
              </label>
            </div>
            <div className={styles.drawerFooter}>
              <button className={styles.btnCancelar} onClick={fecharForm}>Cancelar</button>
              <button className={styles.btnPrimario} onClick={salvar} disabled={!form.titulo.trim()}>💾 Salvar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
