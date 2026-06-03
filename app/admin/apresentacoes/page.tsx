'use client'

import SheetTable, { ColDef } from '../components/SheetTable'
import { useSheet } from '../components/useSheet'
import { AdminTopbar, DeleteDialog } from '../components/AdminShared'
import { Apresentacao } from '@/types'

const COLS: ColDef<Apresentacao>[] = [
  { key: 'ano',    label: 'Ano',             type: 'text',     width: 100, placeholder: '2025' },
  { key: 'titulo', label: 'Tema / Palestra', type: 'textarea', minWidth: 320, placeholder: 'Título da apresentação' },
  { key: 'evento', label: 'Evento / Local',  type: 'text',     minWidth: 200, placeholder: 'COP30, Belém' },
  { key: 'local',  label: 'Cidade / País',   type: 'text',     minWidth: 160, placeholder: 'Belém, Brasil' },
  { key: 'emoji',  label: 'Ícone',           type: 'text',     width: 80,  placeholder: '🎤' },
]

const BLANK: Omit<Apresentacao, 'id'> = { ano: '', titulo: '', evento: '', local: '', emoji: '🎤' }

export default function ApresentacoesAdmin() {
  const sh = useSheet<Apresentacao>('apresentacoes', BLANK)
  if (sh.loading) return <div className="adminRoot"><div className="content">Carregando…</div></div>

  return (
    <div className="adminRoot">
      <AdminTopbar title="Apresentações" hint="Palestras e congressos" dirty={sh.dirty} saving={sh.saving} onSave={sh.save} onDiscard={sh.discard} />
      <div className="contentFlush">
        <SheetTable cols={COLS} rows={sh.rows} onChange={sh.onChange} onAdd={sh.onAdd} onDelete={sh.onDelete} onReorder={sh.onReorder} addLabel="Adicionar apresentação" noun="apresentações" />
      </div>
      <DeleteDialog target={sh.deleteTarget} noun="apresentação" onCancel={() => sh.setDeleteTarget(null)} onConfirm={sh.confirmDelete} />
      {sh.toast && <div className="toast">{sh.toast}</div>}
    </div>
  )
}
