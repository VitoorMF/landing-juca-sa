'use client'

import SheetTable, { ColDef } from '../components/SheetTable'
import { useSheet } from '../components/useSheet'
import { AdminTopbar, DeleteDialog } from '../components/AdminShared'
import { Link } from '@/types'

type LinkRow = { id: string; nome: string; descricao: string; url: string; emoji: string }

const COLS: ColDef<LinkRow>[] = [
  { key: 'nome',     label: 'Nome',           type: 'text',     minWidth: 200, placeholder: 'Google Scholar' },
  { key: 'url',      label: 'Endereço (URL)', type: 'text',     minWidth: 280, placeholder: 'https://...' },
  { key: 'descricao', label: 'Descrição',     type: 'textarea', minWidth: 260, placeholder: 'Breve descrição do link' },
  { key: 'emoji',    label: 'Ícone',          type: 'text',     width: 80,    placeholder: '🔗' },
]

const BLANK: Omit<LinkRow, 'id'> = { nome: '', url: '', descricao: '', emoji: '🔗' }

function transform(r: Record<string, unknown>): LinkRow {
  return { id: String(r.id), nome: String(r.nome ?? ''), descricao: String(r.descricao ?? ''), url: String(r.url ?? ''), emoji: String(r.emoji ?? '🔗') }
}

export default function LinksAdmin() {
  const sh = useSheet<LinkRow>('links', BLANK, transform)
  if (sh.loading) return <div className="adminRoot"><div className="content">Carregando…</div></div>

  return (
    <div className="adminRoot">
      <AdminTopbar title="Links" hint="Perfis acadêmicos e recursos externos" dirty={sh.dirty} saving={sh.saving} onSave={sh.save} onDiscard={sh.discard} />
      <div className="contentFlush">
        <SheetTable cols={COLS} rows={sh.rows} onChange={sh.onChange} onAdd={sh.onAdd} onDelete={sh.onDelete} onReorder={sh.onReorder} addLabel="Adicionar link" noun="links" />
      </div>
      <DeleteDialog target={sh.deleteTarget} noun="link" onCancel={() => sh.setDeleteTarget(null)} onConfirm={sh.confirmDelete} />
      {sh.toast && <div className="toast">{sh.toast}</div>}
    </div>
  )
}
