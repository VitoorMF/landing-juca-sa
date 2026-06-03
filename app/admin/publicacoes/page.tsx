'use client'

import SheetTable, { ColDef } from '../components/SheetTable'
import { useSheet } from '../components/useSheet'
import { AdminTopbar, DeleteDialog } from '../components/AdminShared'
import { Publicacao } from '@/types'

const COLS: ColDef<Publicacao>[] = [
  { key: 'ano',     label: 'Ano',               type: 'text',     width: 90,  placeholder: '2024' },
  { key: 'titulo',  label: 'Título do trabalho', type: 'textarea', minWidth: 340, placeholder: 'Título da publicação' },
  { key: 'autores', label: 'Autores',            type: 'text',     minWidth: 200, placeholder: 'Sá, J.C.M. et al.' },
  { key: 'revista', label: 'Revista / Veículo',  type: 'text',     minWidth: 200, placeholder: 'Nome da revista' },
  { key: 'tipo',    label: 'Tipo',               type: 'select',   width: 150, options: ['article', 'book', 'misc'] },
  { key: 'url',     label: 'Link (DOI/URL)',      type: 'text',     minWidth: 200, placeholder: 'https://doi.org/...' },
]

const BLANK: Omit<Publicacao, 'id'> = { ano: '', titulo: '', autores: '', revista: '', tipo: 'article', url: '' }

export default function PublicacoesAdmin() {
  const sh = useSheet<Publicacao>('publicacoes', BLANK)
  if (sh.loading) return <div className="adminRoot"><div className="content">Carregando…</div></div>

  return (
    <div className="adminRoot">
      <AdminTopbar title="Publicações" hint="Artigos, livros e trabalhos científicos" dirty={sh.dirty} onSave={sh.save} onDiscard={sh.discard} />
      <div className="content">
        <div className="hintBar">
          Clique em qualquer célula e digite — <b>como numa planilha</b>. Use <b>Tab</b> para avançar e <b>Enter</b> para descer.
        </div>
        <SheetTable cols={COLS} rows={sh.rows} onChange={sh.onChange} onAdd={sh.onAdd} onDelete={sh.onDelete} addLabel="Adicionar publicação" noun="publicações" />
      </div>
      <DeleteDialog target={sh.deleteTarget} noun="publicação" onCancel={() => sh.setDeleteTarget(null)} onConfirm={sh.confirmDelete} />
      {sh.toast && <div className="toast">{sh.toast}</div>}
    </div>
  )
}
