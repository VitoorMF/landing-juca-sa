'use client'

import { useEffect, useState } from 'react'
import { Link } from '@/types'
import { supabase } from '@/lib/supabase'
import styles from './page.module.css'

const vazio: Omit<Link, 'id'> = { nome: '', descricao: '', emoji: '🔗', iconBg: 'teal', url: '' }

function dbParaLink(l: Record<string, unknown>): Link {
  return { ...l, iconBg: l.icon_bg } as Link
}

export default function LinksAdmin() {
  const [lista, setLista] = useState<Link[]>([])
  const [form, setForm] = useState<Omit<Link, 'id'>>(vazio)
  const [editandoId, setEditandoId] = useState<string | null>(null)
  const [mostrarForm, setMostrarForm] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)

  useEffect(() => {
    async function buscar() {
      const { data } = await supabase.from('links').select('*')
      if (data) setLista(data.map(dbParaLink))
    }
    buscar()
  }, [])

  function abrirNovo() { setForm(vazio); setEditandoId(null); setMostrarForm(true) }
  function abrirEditar(l: Link) {
    setForm({ nome: l.nome, descricao: l.descricao, emoji: l.emoji, iconBg: l.iconBg, url: l.url })
    setEditandoId(l.id); setMostrarForm(true)
  }
  function fecharForm() { setMostrarForm(false); setEditandoId(null); setForm(vazio) }

  async function salvar() {
    if (!form.nome.trim() || !form.url.trim()) return
    const { iconBg, ...resto } = form
    const payload = { ...resto, icon_bg: iconBg }

    if (editandoId) {
      await supabase.from('links').update(payload).eq('id', editandoId)
      setLista(prev => prev.map(l => l.id === editandoId ? { ...form, id: editandoId } : l))
    } else {
      const { data: novo } = await supabase.from('links').insert(payload).select().single()
      if (novo) setLista(prev => [...prev, dbParaLink(novo)])
    }
    fecharForm()
  }

  async function excluir(id: string) {
    await supabase.from('links').delete().eq('id', id)
    setLista(prev => prev.filter(l => l.id !== id))
    setConfirmDelete(null)
  }

  const corBg: Record<Link['iconBg'], string> = { green: 'var(--green-mid)', teal: 'var(--teal)', gold: 'var(--gold)' }

  return (
    <div className={styles.page}>
      <div className={styles.cabecalho}>
        <div>
          <h1 className={styles.titulo}>Links externos</h1>
          <p className={styles.sub}>{lista.length} links cadastrados</p>
        </div>
        <button className={styles.btnPrimario} onClick={abrirNovo}>+ Novo link</button>
      </div>

      <div className={styles.tabelaWrap}>
        <table className={styles.tabela}>
          <thead>
            <tr>
              <th style={{ width: 48 }}>Em.</th>
              <th style={{ width: 180 }}>Nome</th>
              <th>Descrição</th>
              <th style={{ width: 110 }}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {lista.length === 0 && (
              <tr><td colSpan={4} className={styles.vazio}>Nenhum link cadastrado.</td></tr>
            )}
            {lista.map(l => (
              <tr key={l.id}>
                <td>
                  <div className={styles.emojiBox} style={{ background: corBg[l.iconBg] }}>
                    {l.emoji}
                  </div>
                </td>
                <td className={styles.nomeCell}>
                  {l.nome}
                  <a href={l.url} target="_blank" rel="noreferrer" className={styles.linkUrl}>
                    {l.url.replace('https://', '').slice(0, 30)}…
                  </a>
                </td>
                <td className={styles.subCell}>{l.descricao}</td>
                <td>
                  <div className={styles.acoes}>
                    <button className={styles.btnEditar} onClick={() => abrirEditar(l)}>✏️ Editar</button>
                    <button className={styles.btnExcluir} onClick={() => setConfirmDelete(l.id)}>🗑️</button>
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
            <h3>Excluir link?</h3>
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
              <h2 className={styles.drawerTitulo}>{editandoId ? 'Editar link' : 'Novo link'}</h2>
              <button className={styles.btnFechar} onClick={fecharForm}>✕</button>
            </div>
            <div className={styles.drawerBody}>
              <label className={styles.label}>
                URL *
                <input className={styles.input} value={form.url} type="url"
                  onChange={e => setForm(f => ({ ...f, url: e.target.value }))} placeholder="https://…" />
              </label>
              <div className={styles.linha2col}>
                <label className={styles.label}>
                  Emoji
                  <input className={styles.input} value={form.emoji}
                    onChange={e => setForm(f => ({ ...f, emoji: e.target.value }))} placeholder="🔗" />
                </label>
                <label className={styles.label}>
                  Cor do ícone
                  <select className={styles.input} value={form.iconBg}
                    onChange={e => setForm(f => ({ ...f, iconBg: e.target.value as Link['iconBg'] }))}>
                    <option value="teal">Verde-água</option>
                    <option value="green">Verde</option>
                    <option value="gold">Dourado</option>
                  </select>
                </label>
              </div>
              <label className={styles.label}>
                Nome *
                <input className={styles.input} value={form.nome}
                  onChange={e => setForm(f => ({ ...f, nome: e.target.value }))} placeholder="Ex: Google Scholar" />
              </label>
              <label className={styles.label}>
                Descrição
                <textarea className={`${styles.input} ${styles.textarea}`} value={form.descricao}
                  onChange={e => setForm(f => ({ ...f, descricao: e.target.value }))} rows={3} placeholder="Breve descrição do link…" />
              </label>
            </div>
            <div className={styles.drawerFooter}>
              <button className={styles.btnCancelar} onClick={fecharForm}>Cancelar</button>
              <button className={styles.btnPrimario} onClick={salvar} disabled={!form.nome.trim() || !form.url.trim()}>💾 Salvar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
