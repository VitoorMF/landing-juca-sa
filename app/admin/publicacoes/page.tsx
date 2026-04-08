'use client'

import { useEffect, useState } from 'react'
import { Publicacao, TipoPublicacao } from '@/types'
import styles from './page.module.css'
import { supabase } from '@/lib/supabase'

const vazio: Omit<Publicacao, 'id'> = {
  ano: '',
  titulo: '',
  autores: '',
  revista: '',
  tipo: 'article',
  subtipo: '',
  url: '',
}

export default function PublicacoesAdmin() {
  const [lista, setLista] = useState<Publicacao[]>([])
  const [busca, setBusca] = useState('')
  const [filtro, setFiltro] = useState<'todos' | TipoPublicacao>('todos')

  const [form, setForm] = useState<Omit<Publicacao, 'id'>>(vazio)
  const [editandoId, setEditandoId] = useState<string | null>(null)
  const [mostrarForm, setMostrarForm] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)

  useEffect(() => {
    async function buscar() {
      const { data } = await supabase
        .from('publicacoes')
        .select('*')

      if (data) setLista(data)
    }

    buscar()
  }, [])

  const listaBruta = lista
    .filter(p => filtro === 'todos' || p.tipo === filtro)
    .filter(p =>
      p.titulo.toLowerCase().includes(busca.toLowerCase()) ||
      p.autores.toLowerCase().includes(busca.toLowerCase()) ||
      p.ano.includes(busca)
    )

  function abrirNovo() {
    setForm(vazio)
    setEditandoId(null)
    setMostrarForm(true)
  }

  function abrirEditar(p: Publicacao) {
    setForm({ ano: p.ano, titulo: p.titulo, autores: p.autores, revista: p.revista, tipo: p.tipo, subtipo: p.subtipo ?? '', url: p.url ?? '' })
    setEditandoId(p.id)
    setMostrarForm(true)
  }

  function fecharForm() {
    setMostrarForm(false)
    setEditandoId(null)
    setForm(vazio)
  }

  async function salvar() {
    if (!form.titulo.trim() || !form.ano.trim()) return

    if (editandoId) {
      await supabase.from('publicacoes').update({ ...form }).eq('id', editandoId)
      setLista(prev => prev.map(p => p.id === editandoId ? { ...form, id: editandoId } : p))
    } else {
      const { data: novo } = await supabase
        .from('publicacoes')
        .insert({ ...form })
        .select()
        .single()

      if (novo) setLista(prev => [novo, ...prev])
    }
    fecharForm()
  }

  async function excluir(id: string) {
    await supabase.from('publicacoes').delete().eq('id', id)
    setLista(prev => prev.filter(p => p.id !== id))
    setConfirmDelete(null)
  }

  const tipoLabel = (p: Publicacao) =>
    p.tipo === 'article' ? 'Artigo' :
    p.tipo === 'book' ? 'Livro/Capítulo' :
    (p.subtipo?.trim() || 'Miscelânea')
  const tipoCor = (t: TipoPublicacao) => t === 'article' ? styles.badgeArtigo : t === 'book' ? styles.badgeLivro : styles.badgeMisc



  return (
    <div className={styles.page}>
      {/* Cabeçalho */}
      <div className={styles.cabecalho}>
        <div>
          <h1 className={styles.titulo}>Publicações</h1>
          <p className={styles.sub}>{lista.length} publicações cadastradas</p>
        </div>
        <button className={styles.btnPrimario} onClick={abrirNovo}>
          + Nova publicação
        </button>
      </div>

      {/* Filtros */}
      <div className={styles.filtros}>
        <input
          className={styles.busca}
          type="text"
          placeholder="Buscar por título, autor ou ano…"
          value={busca}
          onChange={e => setBusca(e.target.value)}
        />
        <div className={styles.tabs}>
          {(['todos', 'article', 'book', 'misc'] as const).map(f => (
            <button
              key={f}
              className={`${styles.tab} ${filtro === f ? styles.tabAtivo : ''}`}
              onClick={() => setFiltro(f)}
            >
              {f === 'todos' ? 'Todas' : f === 'article' ? 'Artigos' : f === 'book' ? 'Livros' : 'Miscelânea'}
            </button>
          ))}
        </div>
      </div>

      {/* Tabela */}
      <div className={styles.tabelaWrap}>
        <table className={styles.tabela}>
          <thead>
            <tr>
              <th style={{ width: 60 }}>Ano</th>
              <th>Título</th>
              <th style={{ width: 130 }}>Autores</th>
              <th style={{ width: 100 }}>Tipo</th>
              <th style={{ width: 110 }}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {listaBruta.length === 0 && (
              <tr>
                <td colSpan={5} className={styles.vazio}>Nenhuma publicação encontrada.</td>
              </tr>
            )}
            {listaBruta.map(p => (
              <tr key={p.id}>
                <td className={styles.ano}>{p.ano}</td>
                <td>
                  <div className={styles.tituloCell}>{p.titulo}</div>
                  <div className={styles.revistaCell}>{p.revista}</div>
                </td>
                <td className={styles.autoresCell}>{p.autores}</td>
                <td>
                  <span className={`${styles.badge} ${tipoCor(p.tipo)}`}>
                    {tipoLabel(p)}
                  </span>
                </td>
                <td>
                  <div className={styles.acoes}>
                    <button className={styles.btnEditar} onClick={() => abrirEditar(p)}>
                      ✏️ Editar
                    </button>
                    <button className={styles.btnExcluir} onClick={() => setConfirmDelete(p.id)}>
                      🗑️
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal de confirmação de exclusão */}
      {confirmDelete && (
        <div className={styles.overlay} onClick={() => setConfirmDelete(null)}>
          <div className={styles.modalConfirm} onClick={e => e.stopPropagation()}>
            <div className={styles.modalConfirmIcon}>🗑️</div>
            <h3>Excluir publicação?</h3>
            <p>Esta ação não pode ser desfeita.</p>
            <div className={styles.modalConfirmAcoes}>
              <button className={styles.btnCancelar} onClick={() => setConfirmDelete(null)}>Cancelar</button>
              <button className={styles.btnExcluirConfirm} onClick={() => excluir(confirmDelete)}>Excluir</button>
            </div>
          </div>
        </div>
      )}

      {/* Drawer de formulário */}
      {mostrarForm && (
        <div className={styles.overlay} onClick={fecharForm}>
          <div className={styles.drawer} onClick={e => e.stopPropagation()}>
            <div className={styles.drawerHeader}>
              <h2 className={styles.drawerTitulo}>
                {editandoId ? 'Editar publicação' : 'Nova publicação'}
              </h2>
              <button className={styles.btnFechar} onClick={fecharForm}>✕</button>
            </div>

            <div className={styles.drawerBody}>
              <label className={styles.label}>
                Título *
                <input
                  className={styles.input}
                  value={form.titulo}
                  onChange={e => setForm(f => ({ ...f, titulo: e.target.value }))}
                  placeholder="Título da publicação"
                />
              </label>

              <label className={styles.label}>
                Autores *
                <input
                  className={styles.input}
                  value={form.autores}
                  onChange={e => setForm(f => ({ ...f, autores: e.target.value }))}
                  placeholder="Ex: Sá, J.C.M., Lal, R. et al."
                />
              </label>

              <label className={styles.label}>
                Revista / Editora
                <input
                  className={styles.input}
                  value={form.revista}
                  onChange={e => setForm(f => ({ ...f, revista: e.target.value }))}
                  placeholder="Ex: Science of the Total Environment · DOI: …"
                />
              </label>

              <div className={styles.linha2col}>
                <label className={styles.label}>
                  Ano *
                  <input
                    className={styles.input}
                    value={form.ano}
                    onChange={e => setForm(f => ({ ...f, ano: e.target.value }))}
                    placeholder="2024"
                    maxLength={4}
                  />
                </label>

                <label className={styles.label}>
                  Tipo
                  <select
                    className={styles.input}
                    value={form.tipo}
                    onChange={e => setForm(f => ({ ...f, tipo: e.target.value as TipoPublicacao, subtipo: '' }))}
                  >
                    <option value="article">Artigo</option>
                    <option value="book">Livro / Capítulo</option>
                    <option value="misc">Miscelânea</option>
                  </select>
                </label>

                {form.tipo === 'misc' && (
                  <label className={styles.label}>
                    Especificar tipo
                    <input
                      className={styles.input}
                      value={form.subtipo ?? ''}
                      onChange={e => setForm(f => ({ ...f, subtipo: e.target.value }))}
                      placeholder="Ex: Citação, Jornal, Relatório técnico…"
                    />
                  </label>
                )}
              </div>

              <label className={styles.label}>
                Link (opcional)
                <input
                  className={styles.input}
                  value={form.url}
                  onChange={e => setForm(f => ({ ...f, url: e.target.value }))}
                  placeholder="https://…"
                  type="url"
                />
              </label>
            </div>

            <div className={styles.drawerFooter}>
              <button className={styles.btnCancelar} onClick={fecharForm}>Cancelar</button>
              <button
                className={styles.btnPrimario}
                onClick={salvar}
                disabled={!form.titulo.trim() || !form.ano.trim()}
              >
                💾 Salvar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
