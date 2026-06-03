'use client'

import { useEffect, useRef, useState } from 'react'
import { Foto } from '@/types'
import { supabase } from '@/lib/supabase'
import { AdminTopbar, DeleteDialog } from '../components/AdminShared'

const uid = () => 'x' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6)

type Row = Foto & { id: string }

export default function FotosAdmin() {
  const [rows, setRows] = useState<Row[]>([])
  const [saved, setSaved] = useState('[]')
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState('')
  const [deleteTarget, setDeleteTarget] = useState<Row | null>(null)
  const toastTimer = useRef<ReturnType<typeof setTimeout>>()

  const dirty = JSON.stringify(rows) !== saved

  useEffect(() => {
    supabase.from('fotos').select('*').then(({ data }) => {
      const mapped = (data ?? []) as Row[]
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

  function update(id: string, patch: Partial<Row>) {
    setRows(prev => prev.map(r => r.id === id ? { ...r, ...patch } : r))
  }

  function addRow() {
    setRows(prev => [...prev, { id: uid(), src: '', label: '', caption: '', categoria: '', span: false }])
  }

  async function handleFile(id: string, file: File) {
    update(id, { src: URL.createObjectURL(file) }) // preview imediato
    const nomeUnico = `${Date.now()}-${file.name}`
    const { error } = await supabase.storage.from('fotos').upload(nomeUnico, file)
    if (error) { showToast('Erro no upload: ' + error.message); return }
    const { data: { publicUrl } } = supabase.storage.from('fotos').getPublicUrl(nomeUnico)
    update(id, { src: publicUrl })
  }

  async function confirmDelete() {
    if (!deleteTarget) return
    if (!deleteTarget.id.startsWith('x')) await supabase.from('fotos').delete().eq('id', deleteTarget.id)
    setRows(prev => {
      const next = prev.filter(r => r.id !== deleteTarget.id)
      setSaved(JSON.stringify(next))
      return next
    })
    setDeleteTarget(null)
    showToast('Foto excluída')
  }

  async function save() {
    const ops: Promise<unknown>[] = []
    rows.forEach(r => {
      const payload = { src: r.src, label: r.caption, caption: r.caption, categoria: r.categoria, span: r.span ?? false }
      if (r.id.startsWith('x')) ops.push(supabase.from('fotos').insert(payload))
      else ops.push(supabase.from('fotos').update(payload).eq('id', r.id))
    })
    await Promise.all(ops)
    const { data } = await supabase.from('fotos').select('*')
    const mapped = (data ?? []) as Row[]
    setRows(mapped)
    setSaved(JSON.stringify(mapped))
    showToast('✓ Fotos salvas')
  }

  function discard() { setRows(JSON.parse(saved)) }

  if (loading) return <div className="adminRoot"><div className="content">Carregando…</div></div>

  return (
    <div className="adminRoot">
      <AdminTopbar title="Fotos" hint="Galeria de imagens do site" dirty={dirty} onSave={save} onDiscard={discard} />
      <div className="content">
        <div className="hintBar">
          <b>Arraste uma foto</b> do seu computador para cada quadro — ou clique para escolher. Escreva uma legenda e o local. Não esqueça de <b>Salvar alterações</b>.
        </div>

        <div className="photoGrid">
          {rows.map((f, i) => (
            <PhotoCard key={f.id} foto={f} index={i}
              onFile={file => handleFile(f.id, file)}
              onLegenda={v => update(f.id, { caption: v })}
              onLocal={v => update(f.id, { categoria: v })}
              onDelete={() => setDeleteTarget(f)} />
          ))}
          <button className="pcardAdd" onClick={addRow}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" style={{ width: 40, height: 40 }}>
              <path d="M12 19V5M5 12l7-7 7 7"/>
            </svg>
            <b>Adicionar foto</b>
          </button>
        </div>
      </div>

      <DeleteDialog target={deleteTarget} noun="foto" onCancel={() => setDeleteTarget(null)} onConfirm={confirmDelete} />
      {toast && <div className="toast">{toast}</div>}
    </div>
  )
}

function PhotoCard({ foto, index, onFile, onLegenda, onLocal, onDelete }: {
  foto: Row
  index: number
  onFile: (file: File) => void
  onLegenda: (v: string) => void
  onLocal: (v: string) => void
  onDelete: () => void
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragOver, setDragOver] = useState(false)

  function onDrop(e: React.DragEvent) {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files?.[0]
    if (file?.type.startsWith('image/')) onFile(file)
  }

  return (
    <div className="pcard">
      <div
        className={`pcardMedia ${dragOver ? 'pcardMediaOver' : ''}`}
        onClick={() => inputRef.current?.click()}
        onDragOver={e => { e.preventDefault(); setDragOver(true) }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
      >
        {foto.src ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={foto.src} alt={foto.caption} className="pcardImg" />
        ) : (
          <div className="pcardEmpty">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" style={{ width: 30, height: 30 }}>
              <rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="8.5" cy="9.5" r="1.6"/><path d="M21 16l-5-5L5 20"/>
            </svg>
            <span className="pcardEmptyT">Arraste uma foto aqui</span>
            <span className="pcardEmptyS">ou clique para escolher</span>
          </div>
        )}
        <input ref={inputRef} type="file" accept="image/*" style={{ display: 'none' }}
          onChange={e => { const f = e.target.files?.[0]; if (f) onFile(f) }} />
      </div>

      <div className="pcardBody">
        <input className="pcardInput" value={foto.caption} placeholder="Legenda da foto"
          onChange={e => onLegenda(e.target.value)} />
        <input className="pcardInput" value={foto.categoria ?? ''} placeholder="Local (ex.: Faz. Paiquerê, PR)"
          onChange={e => onLocal(e.target.value)} />
        <div className="pcardFoot">
          <span className="pcardOrder">Foto {index + 1}</span>
          <button className="iconBtn" title="Excluir foto" onClick={onDelete}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6M9 6V4h6v2"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}
