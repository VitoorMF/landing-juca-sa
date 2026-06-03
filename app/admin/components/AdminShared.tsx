'use client'

export function AdminTopbar({ title, hint, dirty, saving, onSave, onDiscard }: {
  title: string
  hint: string
  dirty: boolean
  saving?: boolean
  onSave: () => void
  onDiscard: () => void
}) {
  return (
    <div className="topbar">
      <div>
        <h1 className="topbarTitle">{title}</h1>
        <div className="topbarHint">{hint}</div>
      </div>
      <div className="saveCluster">
        <div className={`saveState ${dirty ? 'saveStateDirty' : 'saveStateSaved'}`}>
          <span className="saveDot" />
          {dirty ? 'Alterações não salvas' : 'Tudo salvo'}
        </div>
        <button className="btn btnGhost" onClick={onDiscard} disabled={!dirty || saving}>Desfazer</button>
        <button className="btn btnPrimary" onClick={onSave} disabled={!dirty || saving}>
          {saving ? 'Salvando…' : 'Salvar alterações'}
        </button>
      </div>
    </div>
  )
}

export function DeleteDialog({ target, noun, onCancel, onConfirm }: {
  target: unknown
  noun: string
  onCancel: () => void
  onConfirm: () => void
}) {
  if (!target) return null
  return (
    <div className="overlay" onClick={onCancel}>
      <div className="dialog" onClick={e => e.stopPropagation()}>
        <div className="dialogHead">
          <div className="dialogIcon dialogIconDanger">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" style={{ width: 28, height: 28 }}>
              <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M9 6V4h6v2"/>
            </svg>
          </div>
          <div className="dialogTitle">Excluir {noun}?</div>
        </div>
        <div className="dialogBody">
          A exclusão é <b>imediata</b> e não pode ser desfeita.
        </div>
        <div className="dialogFoot">
          <button className="btn btnGhost" onClick={onCancel}>Cancelar</button>
          <button className="btn btnDanger" onClick={onConfirm}>Excluir</button>
        </div>
      </div>
    </div>
  )
}
