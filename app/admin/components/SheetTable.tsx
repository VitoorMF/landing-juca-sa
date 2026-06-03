'use client'

import { useRef, useState, useEffect, useCallback, useLayoutEffect } from 'react'

function AutoTextarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const ref = useRef<HTMLTextAreaElement>(null)

  const resize = useCallback(() => {
    const el = ref.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = el.scrollHeight + 'px'
  }, [])

  useLayoutEffect(resize, [props.value, resize])

  return (
    <textarea
      {...props}
      ref={ref}
      rows={1}
      onInput={resize}
      style={{ overflow: 'hidden', ...props.style }}
    />
  )
}

export interface ColDef<T> {
  key: keyof T
  label: string
  type: 'text' | 'textarea' | 'select'
  width?: number
  minWidth?: number
  placeholder?: string
  options?: string[]
}

interface Props<T extends { id: string }> {
  cols: ColDef<T>[]
  rows: T[]
  onChange: (id: string, key: keyof T, val: string) => void
  onAdd: () => void
  onDelete: (row: T) => void
  addLabel: string
  noun: string
}

export default function SheetTable<T extends { id: string }>({
  cols, rows, onChange, onAdd, onDelete, addLabel, noun,
}: Props<T>) {
  const firstInputRef = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null)
  const tableRef = useRef<HTMLTableElement>(null)

  const GUT = 50
  const ACT = 60

  // larguras concretas (px) para todas as colunas — necessário p/ table-layout: fixed
  const [colWidths, setColWidths] = useState<number[]>(() =>
    cols.map(c => c.width ?? c.minWidth ?? 180)
  )

  const tableWidth = GUT + colWidths.reduce((a, b) => a + b, 0) + ACT

  const resizing = useRef<{ colIdx: number; startX: number; startW: number } | null>(null)

  const onMouseMove = useCallback((e: MouseEvent) => {
    if (!resizing.current) return
    const { colIdx, startX, startW } = resizing.current
    const delta = e.clientX - startX
    const min = cols[colIdx].minWidth ?? 60
    const newW = Math.max(min, startW + delta)
    setColWidths(prev => {
      const next = [...prev]
      next[colIdx] = newW
      return next
    })
  }, [cols])

  const onMouseUp = useCallback(() => {
    resizing.current = null
    document.body.style.cursor = ''
    document.body.style.userSelect = ''
  }, [])

  useEffect(() => {
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)
    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)
    }
  }, [onMouseMove, onMouseUp])

  function startResize(e: React.MouseEvent, colIdx: number) {
    e.preventDefault()
    e.stopPropagation()
    const cell = (e.currentTarget as HTMLElement).parentElement as HTMLTableCellElement
    const startW = cell.getBoundingClientRect().width
    resizing.current = { colIdx, startX: e.clientX, startW }
    document.body.style.cursor = 'col-resize'
    document.body.style.userSelect = 'none'
  }

  const ResizeHandle = ({ colIdx }: { colIdx: number }) => (
    <span
      onMouseDown={e => startResize(e, colIdx)}
      className="colResize"
      aria-hidden
    />
  )

  function handleKeyDown(e: React.KeyboardEvent, rowIdx: number, colIdx: number) {
    if (e.key === 'Tab') {
      e.preventDefault()
      const nextColIdx = e.shiftKey ? colIdx - 1 : colIdx + 1
      let nextRowIdx = rowIdx
      let targetCol = nextColIdx
      if (nextColIdx >= cols.length) { targetCol = 0; nextRowIdx = rowIdx + 1 }
      if (nextColIdx < 0) { targetCol = cols.length - 1; nextRowIdx = rowIdx - 1 }
      document.querySelector<HTMLInputElement | HTMLTextAreaElement>(`[data-cell="${nextRowIdx}-${targetCol}"]`)?.focus()
    }
    if (e.key === 'Enter' && e.target instanceof HTMLInputElement) {
      e.preventDefault()
      document.querySelector<HTMLInputElement | HTMLTextAreaElement>(`[data-cell="${rowIdx + 1}-${colIdx}"]`)?.focus()
    }
  }

  return (
    <div className="sheetWrap">
      <div className="sheetScroll">
        <table className="sheet" ref={tableRef} style={{ tableLayout: 'fixed', width: tableWidth }}>
          <colgroup>
            <col style={{ width: GUT }} />
            {cols.map((c, ci) => <col key={String(c.key)} style={{ width: colWidths[ci] }} />)}
            <col style={{ width: ACT }} />
          </colgroup>
          <thead>
            <tr>
              <th className="colGut">#</th>
              {cols.map((c, ci) => (
                <th key={String(c.key)} style={{ position: 'relative' }}>
                  {c.label}
                  <ResizeHandle colIdx={ci} />
                </th>
              ))}
              <th />
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr>
                <td colSpan={cols.length + 2} style={{ textAlign: 'center', padding: '48px 20px', color: 'var(--muted)', fontWeight: 700 }}>
                  Nenhum(a) {noun} cadastrado(a). Clique em &ldquo;{addLabel}&rdquo; para começar.
                </td>
              </tr>
            )}
            {rows.map((row, ri) => (
              <tr key={row.id}>
                <td className="colGut">{ri + 1}</td>
                {cols.map((col, ci) => {
                  const val = String((row[col.key] ?? '') as string)
                  return (
                    <td key={String(col.key)}
                      className={`cell ${!val ? 'cellEmpty' : ''}`}
                      style={{ position: 'relative' }}>
                      <ResizeHandle colIdx={ci} />
                      {col.type === 'select' ? (
                        <select data-cell={`${ri}-${ci}`} value={val}
                          onChange={e => onChange(row.id, col.key, e.target.value)}>
                          {col.options?.map(o => <option key={o}>{o}</option>)}
                        </select>
                      ) : col.type === 'textarea' ? (
                        <AutoTextarea data-cell={`${ri}-${ci}`} value={val}
                          placeholder={col.placeholder}
                          onChange={e => onChange(row.id, col.key, e.target.value)}
                          onKeyDown={e => handleKeyDown(e, ri, ci)} />
                      ) : (
                        <input data-cell={`${ri}-${ci}`} type="text" value={val}
                          placeholder={col.placeholder}
                          onChange={e => onChange(row.id, col.key, e.target.value)}
                          onKeyDown={e => handleKeyDown(e, ri, ci)}
                          ref={ri === 0 && ci === 0 ? el => { firstInputRef.current = el } : undefined} />
                      )}
                    </td>
                  )
                })}
                <td className="rowAct">
                  <button className="iconBtn" title="Excluir linha" onClick={() => onDelete(row)}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/>
                      <path d="M10 11v6M14 11v6M9 6V4h6v2"/>
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="sheetFoot">
        <button className="btn btnPrimary" onClick={onAdd}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" style={{ width: 18, height: 18 }}>
            <path d="M12 5v14M5 12h14"/>
          </svg>
          {addLabel}
        </button>
        <span className="sheetCount">{rows.length} {noun}</span>
      </div>
    </div>
  )
}
