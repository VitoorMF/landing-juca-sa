'use client'

import { useEffect, useRef, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { adminWrite } from '@/lib/admin-write'
import { adminUpload } from '@/lib/admin-upload'
import { Modulo } from '@/types'
import { AdminTopbar, DeleteDialog } from '../components/AdminShared'

const uid = () => 'x' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6)

export default function CursoAdmin() {
  const [rows, setRows] = useState<Modulo[]>([])
  const [saved, setSaved] = useState('[]')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState('')
  const [deleteTarget, setDeleteTarget] = useState<Modulo | null>(null)
  const [uploadingId, setUploadingId] = useState<string | null>(null)
  const toastTimer = useRef<ReturnType<typeof setTimeout>>()

  const dirty = JSON.stringify(rows) !== saved

  useEffect(() => {
    supabase.from('modulos').select('*').order('ordem').then(({ data }) => {
      const mapped = (data ?? []) as Modulo[]
      setRows(mapped)
      setSaved(JSON.stringify(mapped))
      setLoading(false)
    })
  }, [])

  function showToast(msg: string) {
    clearTimeout(toastTimer.current)
    setToast(msg)
    toastTimer.current = setTimeout(() => setToast(''), 2800)
  }

  function update(id: string, patch: Partial<Modulo>) {
    setRows(prev => prev.map(m => m.id === id ? { ...m, ...patch } : m))
  }

  function addRow() {
    const nextOrdem = rows.length ? Math.max(...rows.map(m => m.ordem)) + 1 : 1
    setRows(prev => [...prev, { id: uid(), ordem: nextOrdem, titulo: '', descricao: '', url: '', liberado: false }])
  }

  async function handlePdf(id: string, file: File) {
    setUploadingId(id)
    try {
      const url = await adminUpload('cursos', file)
      update(id, { url })
      showToast('✓ PDF enviado')
    } catch {
      showToast('❌ Erro ao enviar PDF')
    } finally {
      setUploadingId(null)
    }
  }

  async function confirmDelete() {
    if (!deleteTarget) return
    const id = deleteTarget.id
    if (!id.startsWith('x')) {
      const ok = await adminWrite({ table: 'modulos', deletes: [id] })
      if (!ok) { showToast('❌ Erro ao excluir'); return }
    }
    setRows(prev => prev.filter(m => m.id !== id))
    setSaved(prev => {
      try {
        const arr = JSON.parse(prev) as { id: string }[]
        return JSON.stringify(arr.filter(m => m.id !== id))
      } catch { return prev }
    })
    setDeleteTarget(null)
    showToast('Módulo excluído')
  }

  async function save() {
    setSaving(true)
    try {
      const inserts = rows.filter(m => m.id.startsWith('x'))
        .map(m => ({ ordem: m.ordem, titulo: m.titulo, descricao: m.descricao, url: m.url, liberado: m.liberado }))
      const updates = rows.filter(m => !m.id.startsWith('x'))
        .map(m => ({ id: m.id, ordem: m.ordem, titulo: m.titulo, descricao: m.descricao, url: m.url, liberado: m.liberado }))

      const ok = await adminWrite({ table: 'modulos', inserts, updates })
      if (!ok) { showToast('❌ Erro ao salvar'); return }

      const { data } = await supabase.from('modulos').select('*').order('ordem')
      const mapped = (data ?? []) as Modulo[]
      setRows(mapped)
      setSaved(JSON.stringify(mapped))
      showToast('✓ Curso salvo')
    } finally {
      setSaving(false)
    }
  }

  function discard() { setRows(JSON.parse(saved)) }

  if (loading) return <div className="adminRoot"><div className="content">Carregando…</div></div>

  return (
    <div className="adminRoot">
      <AdminTopbar title="Curso" hint="Módulos do curso gratuito — o senhor controla quando cada um é liberado" dirty={dirty} saving={saving} onSave={save} onDiscard={discard} />
      <div className="content">

        <div className="moduloList">
          {rows.map((m, i) => (
            <div key={m.id} className={`moduloCard ${m.liberado ? 'moduloLiberado' : ''}`}>
              <div className="moduloNum">{i + 1}</div>

              <div className="moduloFields">
                <input className="moduloInput moduloTitulo" value={m.titulo} placeholder="Título do módulo"
                  onChange={e => update(m.id, { titulo: e.target.value })} />
                <textarea className="moduloInput moduloDesc" value={m.descricao} placeholder="Descrição curta" rows={2}
                  onChange={e => update(m.id, { descricao: e.target.value })} />
                <div className="moduloUrlRow">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" style={{ width: 16, height: 16, flexShrink: 0, color: 'var(--muted)' }}>
                    <path d="M10 13a4 4 0 0 0 5.7.3l2.6-2.6a4 4 0 0 0-5.7-5.7l-1.5 1.5" /><path d="M14 11a4 4 0 0 0-5.7-.3L5.7 13.3a4 4 0 0 0 5.7 5.7l1.5-1.5" />
                  </svg>
                  <input className="moduloInput moduloUrl" value={m.url} placeholder="Link dos slides (cole ou envie o PDF →)"
                    onChange={e => update(m.id, { url: e.target.value })} />
                  <label className="moduloPdfBtn">
                    {uploadingId === m.id ? 'Enviando…' : 'Enviar PDF'}
                    <input type="file" accept="application/pdf" style={{ display: 'none' }}
                      disabled={uploadingId === m.id}
                      onChange={e => { const f = e.target.files?.[0]; if (f) handlePdf(m.id, f) }} />
                  </label>
                </div>
                {m.url && (
                  <a className="moduloUrlPreview" href={m.url} target="_blank" rel="noopener noreferrer">
                    Abrir slides atuais ↗
                  </a>
                )}
              </div>

              <div className="moduloActions">
                <button
                  className={m.liberado ? 'btn moduloBtnBloquear' : 'btn moduloBtnLiberar'}
                  onClick={() => update(m.id, { liberado: !m.liberado })}
                >
                  {m.liberado ? '✓ Liberado' : 'Liberar agora'}
                </button>
                <button className="iconBtn" title="Excluir módulo" onClick={() => setDeleteTarget(m)}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14H6L5 6" /><path d="M10 11v6M14 11v6M9 6V4h6v2" />
                  </svg>
                </button>
              </div>
            </div>
          ))}

          <button className="moduloAdd" onClick={addRow}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" style={{ width: 20, height: 20 }}>
              <path d="M12 5v14M5 12h14" />
            </svg>
            Adicionar módulo
          </button>
        </div>
      </div>

      <DeleteDialog target={deleteTarget} noun="módulo" onCancel={() => setDeleteTarget(null)} onConfirm={confirmDelete} />
      {toast && <div className="toast">{toast}</div>}
    </div>
  )
}
