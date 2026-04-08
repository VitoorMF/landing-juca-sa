'use client'

import { useEffect, useRef, useState } from 'react'
import { Foto } from '@/types'
import { supabase } from '@/lib/supabase'
import styles from './page.module.css'

const vazio: Omit<Foto, 'id'> = { src: '', label: '', caption: '', span: false }

export default function FotosAdmin() {
  const [lista, setLista] = useState<Foto[]>([])
  const [form, setForm] = useState<Omit<Foto, 'id'>>(vazio)
  const [editandoId, setEditandoId] = useState<string | null>(null)
  const [mostrarForm, setMostrarForm] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)
  const [enviando, setEnviando] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)
  const inputFileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    async function buscar() {
      const { data } = await supabase.from('fotos').select('*')
      if (data) setLista(data as Foto[])
    }
    buscar()
  }, [])

  function abrirNovo() {
    setForm(vazio)
    setPreview(null)
    setEditandoId(null)
    setMostrarForm(true)
  }

  function abrirEditar(f: Foto) {
    setForm({ src: f.src, label: f.label, caption: f.caption, span: f.span ?? false })
    setPreview(f.src)
    setEditandoId(f.id)
    setMostrarForm(true)
  }

  function fecharForm() {
    setMostrarForm(false)
    setEditandoId(null)
    setForm(vazio)
    setPreview(null)
  }

  async function handleArquivo(e: React.ChangeEvent<HTMLInputElement>) {
    const arquivo = e.target.files?.[0]
    if (!arquivo) return

    // Preview local imediato
    setPreview(URL.createObjectURL(arquivo))
    setEnviando(true)

    // Nome único pra evitar conflito de arquivos
    const nomeUnico = `${Date.now()}-${arquivo.name}`

    const { error } = await supabase.storage
      .from('fotos')
      .upload(nomeUnico, arquivo)

    if (error) {
      alert('Erro ao fazer upload: ' + error.message)
      setEnviando(false)
      return
    }

    // Pega a URL pública do arquivo enviado
    const { data: { publicUrl } } = supabase.storage
      .from('fotos')
      .getPublicUrl(nomeUnico)

    setForm(f => ({ ...f, src: publicUrl }))
    setEnviando(false)
  }

  async function salvar() {
    if (!form.src.trim()) return
    if (editandoId) {
      await supabase.from('fotos').update({ ...form }).eq('id', editandoId)
      setLista(prev => prev.map(f => f.id === editandoId ? { ...form, id: editandoId } : f))
    } else {
      const { data: novo } = await supabase.from('fotos').insert({ ...form }).select().single()
      if (novo) setLista(prev => [...prev, novo as Foto])
    }
    fecharForm()
  }

  async function excluir(id: string) {
    await supabase.from('fotos').delete().eq('id', id)
    setLista(prev => prev.filter(f => f.id !== id))
    setConfirmDelete(null)
  }

  return (
    <div className={styles.page}>
      <div className={styles.cabecalho}>
        <div>
          <h1 className={styles.titulo}>Fotos</h1>
          <p className={styles.sub}>{lista.length} fotos cadastradas</p>
        </div>
        <button className={styles.btnPrimario} onClick={abrirNovo}>+ Nova foto</button>
      </div>

      <div className={styles.grid}>
        {lista.map(f => (
          <div key={f.id} className={`${styles.card} ${f.span ? styles.cardSpan : ''}`}>
            <div className={styles.cardImgWrap}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={f.src} alt={f.label} className={styles.cardImg}
                onError={e => { (e.target as HTMLImageElement).style.display = 'none' }} />
              <div className={styles.cardPlaceholder}>🖼️</div>
            </div>
            <div className={styles.cardBody}>
              <div className={styles.cardCaption}>{f.caption || f.label}</div>
              {f.span && <span className={styles.badgeDestaque}>Destaque</span>}
            </div>
            <div className={styles.cardAcoes}>
              <button className={styles.btnEditar} onClick={() => abrirEditar(f)}>✏️ Editar</button>
              <button className={styles.btnExcluir} onClick={() => setConfirmDelete(f.id)}>🗑️ Excluir</button>
            </div>
          </div>
        ))}
      </div>

      {confirmDelete && (
        <div className={styles.overlay} onClick={() => setConfirmDelete(null)}>
          <div className={styles.modalConfirm} onClick={e => e.stopPropagation()}>
            <div className={styles.modalIcon}>🗑️</div>
            <h3>Excluir foto?</h3>
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
              <h2 className={styles.drawerTitulo}>{editandoId ? 'Editar foto' : 'Nova foto'}</h2>
              <button className={styles.btnFechar} onClick={fecharForm}>✕</button>
            </div>

            <div className={styles.drawerBody}>

              {/* Área de upload */}
              <div
                className={styles.uploadArea}
                onClick={() => inputFileRef.current?.click()}
              >
                {preview ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={preview} alt="preview" className={styles.uploadPreview} />
                ) : (
                  <div className={styles.uploadPlaceholder}>
                    <span className={styles.uploadIcone}>📁</span>
                    <span className={styles.uploadTexto}>Clique para selecionar uma foto</span>
                    <span className={styles.uploadSub}>JPG, PNG ou WEBP</span>
                  </div>
                )}

                {enviando && (
                  <div className={styles.uploadLoading}>
                    <span>Enviando…</span>
                  </div>
                )}
              </div>

              <input
                ref={inputFileRef}
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handleArquivo}
              />

              {preview && !enviando && (
                <button
                  className={styles.btnTrocar}
                  onClick={() => inputFileRef.current?.click()}
                >
                  🔄 Trocar imagem
                </button>
              )}

              <label className={styles.label}>
                Legenda
                <input className={styles.input} value={form.caption}
                  onChange={e => setForm(f => ({ ...f, caption: e.target.value }))}
                  placeholder="Descrição da foto" />
              </label>

              <label className={styles.checkLabel}>
                <input type="checkbox" checked={form.span}
                  onChange={e => setForm(f => ({ ...f, span: e.target.checked }))} />
                Foto em destaque (ocupa mais espaço na galeria)
              </label>
            </div>

            <div className={styles.drawerFooter}>
              <button className={styles.btnCancelar} onClick={fecharForm}>Cancelar</button>
              <button
                className={styles.btnPrimario}
                onClick={salvar}
                disabled={!form.src.trim() || enviando}
              >
                {enviando ? 'Enviando…' : '💾 Salvar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
