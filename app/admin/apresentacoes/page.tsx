'use client'

import { useEffect, useState } from 'react'
import { Apresentacao } from '@/types'
import { supabase } from '@/lib/supabase'
import styles from './page.module.css'

const vazio: Omit<Apresentacao, 'id'> = { ano: '', local: '', titulo: '', evento: '', emoji: '🎤' }

export default function ApresentacoesAdmin() {
  const [lista, setLista] = useState<Apresentacao[]>([])
  const [form, setForm] = useState<Omit<Apresentacao, 'id'>>(vazio)
  const [editandoId, setEditandoId] = useState<string | null>(null)
  const [mostrarForm, setMostrarForm] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)

  useEffect(() => {
    async function buscar() {
      const { data } = await supabase.from('apresentacoes').select('*')
      if (data) setLista(data as Apresentacao[])
    }
    buscar()
  }, [])

  function abrirNovo() { setForm(vazio); setEditandoId(null); setMostrarForm(true) }
  function abrirEditar(a: Apresentacao) {
    setForm({ ano: a.ano, local: a.local, titulo: a.titulo, evento: a.evento, emoji: a.emoji })
    setEditandoId(a.id); setMostrarForm(true)
  }
  function fecharForm() { setMostrarForm(false); setEditandoId(null); setForm(vazio) }

  async function salvar() {
    if (!form.titulo.trim()) return
    if (editandoId) {
      await supabase.from('apresentacoes').update({ ...form }).eq('id', editandoId)
      setLista(prev => prev.map(a => a.id === editandoId ? { ...form, id: editandoId } : a))
    } else {
      const { data: novo } = await supabase.from('apresentacoes').insert({ ...form }).select().single()
      if (novo) setLista(prev => [novo as Apresentacao, ...prev])
    }
    fecharForm()
  }

  async function excluir(id: string) {
    await supabase.from('apresentacoes').delete().eq('id', id)
    setLista(prev => prev.filter(a => a.id !== id))
    setConfirmDelete(null)
  }

  return (
    <div className={styles.page}>
      <div className={styles.cabecalho}>
        <div>
          <h1 className={styles.titulo}>Apresentações</h1>
          <p className={styles.sub}>{lista.length} apresentações cadastradas</p>
        </div>
        <button className={styles.btnPrimario} onClick={abrirNovo}>+ Nova apresentação</button>
      </div>

      <div className={styles.tabelaWrap}>
        <table className={styles.tabela}>
          <thead>
            <tr>
              <th style={{ width: 40 }}>Em.</th>
              <th style={{ width: 100 }}>Ano</th>
              <th>Título / Evento</th>
              <th style={{ width: 140 }}>Local</th>
              <th style={{ width: 110 }}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {lista.length === 0 && (
              <tr><td colSpan={5} className={styles.vazio}>Nenhuma apresentação cadastrada.</td></tr>
            )}
            {lista.map(a => (
              <tr key={a.id}>
                <td style={{ fontSize: 22, textAlign: 'center' }}>{a.emoji}</td>
                <td className={styles.anoCell}>{a.ano}</td>
                <td>
                  <div className={styles.tituloCell}>{a.titulo}</div>
                  <div className={styles.subCell}>{a.evento}</div>
                </td>
                <td className={styles.subCell}>{a.local}</td>
                <td>
                  <div className={styles.acoes}>
                    <button className={styles.btnEditar} onClick={() => abrirEditar(a)}>✏️ Editar</button>
                    <button className={styles.btnExcluir} onClick={() => setConfirmDelete(a.id)}>🗑️</button>
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
            <h3>Excluir apresentação?</h3>
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
              <h2 className={styles.drawerTitulo}>{editandoId ? 'Editar apresentação' : 'Nova apresentação'}</h2>
              <button className={styles.btnFechar} onClick={fecharForm}>✕</button>
            </div>
            <div className={styles.drawerBody}>
              <label className={styles.label}>
                Emoji
                <input className={styles.input} value={form.emoji}
                  onChange={e => setForm(f => ({ ...f, emoji: e.target.value }))} placeholder="🎤" />
              </label>
              <label className={styles.label}>
                Título *
                <input className={styles.input} value={form.titulo}
                  onChange={e => setForm(f => ({ ...f, titulo: e.target.value }))} placeholder="Título da apresentação" />
              </label>
              <label className={styles.label}>
                Evento
                <input className={styles.input} value={form.evento}
                  onChange={e => setForm(f => ({ ...f, evento: e.target.value }))} placeholder="Ex: COP30 — Casa da Agricultura Sustentável" />
              </label>
              <div className={styles.linha2col}>
                <label className={styles.label}>
                  Ano
                  <input className={styles.input} value={form.ano}
                    onChange={e => setForm(f => ({ ...f, ano: e.target.value }))} placeholder="2025" />
                </label>
                <label className={styles.label}>
                  Local
                  <input className={styles.input} value={form.local}
                    onChange={e => setForm(f => ({ ...f, local: e.target.value }))} placeholder="Ex: Belém, Brasil" />
                </label>
              </div>
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
