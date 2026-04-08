'use client'

import { useEffect, useState } from 'react'
import { Video } from '@/types'
import { supabase } from '@/lib/supabase'
import styles from './page.module.css'

const vazio: Omit<Video, 'id'> = { titulo: '', meta: '', label: '', emoji: '🎥', gradientFrom: '#1E3A1F', gradientTo: '#2C5F2D', url: '' }

function dbParaVideo(v: Record<string, unknown>): Video {
  return { ...v, gradientFrom: v.gradient_from, gradientTo: v.gradient_to } as Video
}

export default function VideosAdmin() {
  const [lista, setLista] = useState<Video[]>([])
  const [form, setForm] = useState<Omit<Video, 'id'>>(vazio)
  const [editandoId, setEditandoId] = useState<string | null>(null)
  const [mostrarForm, setMostrarForm] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)

  useEffect(() => {
    async function buscar() {
      const { data } = await supabase.from('videos').select('*')
      if (data) setLista(data.map(dbParaVideo))
    }
    buscar()
  }, [])

  function abrirNovo() { setForm(vazio); setEditandoId(null); setMostrarForm(true) }
  function abrirEditar(v: Video) {
    setForm({ titulo: v.titulo, meta: v.meta, label: v.label, emoji: v.emoji, gradientFrom: v.gradientFrom, gradientTo: v.gradientTo, url: v.url })
    setEditandoId(v.id); setMostrarForm(true)
  }
  function fecharForm() { setMostrarForm(false); setEditandoId(null); setForm(vazio) }

  async function salvar() {
    if (!form.titulo.trim() || !form.url.trim()) return
    const { gradientFrom, gradientTo, ...resto } = form
    const payload = { ...resto, gradient_from: gradientFrom, gradient_to: gradientTo }

    if (editandoId) {
      await supabase.from('videos').update(payload).eq('id', editandoId)
      setLista(prev => prev.map(v => v.id === editandoId ? { ...form, id: editandoId } : v))
    } else {
      const { data: novo } = await supabase.from('videos').insert(payload).select().single()
      if (novo) setLista(prev => [...prev, dbParaVideo(novo)])
    }
    fecharForm()
  }

  async function excluir(id: string) {
    await supabase.from('videos').delete().eq('id', id)
    setLista(prev => prev.filter(v => v.id !== id))
    setConfirmDelete(null)
  }

  return (
    <div className={styles.page}>
      <div className={styles.cabecalho}>
        <div>
          <h1 className={styles.titulo}>Vídeos</h1>
          <p className={styles.sub}>{lista.length} vídeos cadastrados</p>
        </div>
        <button className={styles.btnPrimario} onClick={abrirNovo}>+ Novo vídeo</button>
      </div>

      <div className={styles.cards}>
        {lista.map(v => (
          <div key={v.id} className={styles.card}>
            <div className={styles.cardPreview} style={{ background: `linear-gradient(135deg, ${v.gradientFrom}, ${v.gradientTo})` }}>
              <span className={styles.cardEmoji}>{v.emoji}</span>
              <span className={styles.cardLabel}>{v.label}</span>
            </div>
            <div className={styles.cardBody}>
              <div className={styles.cardTitulo}>{v.titulo}</div>
              <div className={styles.cardMeta}>{v.meta}</div>
              <a href={v.url} target="_blank" rel="noreferrer" className={styles.cardLink}>
                🔗 {v.url.slice(0, 40)}…
              </a>
            </div>
            <div className={styles.cardAcoes}>
              <button className={styles.btnEditar} onClick={() => abrirEditar(v)}>✏️ Editar</button>
              <button className={styles.btnExcluir} onClick={() => setConfirmDelete(v.id)}>🗑️ Excluir</button>
            </div>
          </div>
        ))}
      </div>

      {confirmDelete && (
        <div className={styles.overlay} onClick={() => setConfirmDelete(null)}>
          <div className={styles.modalConfirm} onClick={e => e.stopPropagation()}>
            <div className={styles.modalIcon}>🗑️</div>
            <h3>Excluir vídeo?</h3>
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
              <h2 className={styles.drawerTitulo}>{editandoId ? 'Editar vídeo' : 'Novo vídeo'}</h2>
              <button className={styles.btnFechar} onClick={fecharForm}>✕</button>
            </div>
            <div className={styles.drawerBody}>
              <label className={styles.label}>
                Link do vídeo *
                <input className={styles.input} value={form.url} type="url"
                  onChange={e => setForm(f => ({ ...f, url: e.target.value }))} placeholder="https://youtube.com/…" />
              </label>
              <label className={styles.label}>
                Título *
                <input className={styles.input} value={form.titulo}
                  onChange={e => setForm(f => ({ ...f, titulo: e.target.value }))} placeholder="Título do vídeo" />
              </label>
              <label className={styles.label}>
                Meta (fonte / detalhes)
                <input className={styles.input} value={form.meta}
                  onChange={e => setForm(f => ({ ...f, meta: e.target.value }))} placeholder="Ex: 🎓 IBRA Megalab · 5 módulos" />
              </label>
              <div className={styles.linha2col}>
                <label className={styles.label}>
                  Emoji
                  <input className={styles.input} value={form.emoji}
                    onChange={e => setForm(f => ({ ...f, emoji: e.target.value }))} placeholder="🎥" />
                </label>
                <label className={styles.label}>
                  Categoria
                  <input className={styles.input} value={form.label}
                    onChange={e => setForm(f => ({ ...f, label: e.target.value }))} placeholder="Ex: Curso Online" />
                </label>
              </div>
            </div>
            <div className={styles.drawerFooter}>
              <button className={styles.btnCancelar} onClick={fecharForm}>Cancelar</button>
              <button className={styles.btnPrimario} onClick={salvar} disabled={!form.titulo.trim() || !form.url.trim()}>💾 Salvar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
