'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { supabase } from '@/lib/supabase'

const uid = () => 'x' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6)

export function useSheet<T extends { id: string }>(
  table: string,
  blank: Omit<T, 'id'>,
  transform?: (row: Record<string, unknown>) => T,
) {
  const [rows, setRows] = useState<(T & { id: string })[]>([])
  const [saved, setSaved] = useState<string>('[]')
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState('')
  const [deleteTarget, setDeleteTarget] = useState<(T & { id: string }) | null>(null)
  const toastTimer = useRef<ReturnType<typeof setTimeout>>()

  const dirty = JSON.stringify(rows) !== saved

  useEffect(() => {
    supabase.from(table).select('*').then(({ data }) => {
      const mapped = (data ?? []).map(r => transform ? transform(r) : r as T & { id: string })
      setRows(mapped)
      setSaved(JSON.stringify(mapped))
      setLoading(false)
    })
  }, [table])

  function showToast(msg: string) {
    clearTimeout(toastTimer.current)
    setToast(msg)
    toastTimer.current = setTimeout(() => setToast(''), 2800)
  }

  function onChange(id: string, key: keyof T, val: string) {
    setRows(prev => prev.map(r => r.id === id ? ({ ...r, [key]: val } as T & { id: string }) : r))
  }

  function onAdd() {
    const newRow = { id: uid(), ...blank } as T & { id: string }
    setRows(prev => [...prev, newRow])
  }

  function onDelete(row: T & { id: string }) {
    setDeleteTarget(row)
  }

  async function confirmDelete() {
    if (!deleteTarget) return
    const isNew = deleteTarget.id.startsWith('x')
    if (!isNew) await supabase.from(table).delete().eq('id', deleteTarget.id)
    setRows(prev => {
      const next = prev.filter(r => r.id !== deleteTarget.id)
      setSaved(JSON.stringify(next))
      return next
    })
    setDeleteTarget(null)
    showToast('Item excluído')
  }

  async function save() {
    const toInsert = rows.filter(r => r.id.startsWith('x'))
    const toUpdate = rows.filter(r => !r.id.startsWith('x'))

    const inserts = toInsert.map(({ id, ...rest }) => rest)
    const updates = toUpdate.map(r => ({ ...r }))

    const ops: PromiseLike<unknown>[] = []
    if (inserts.length) ops.push(supabase.from(table).insert(inserts))
    updates.forEach(r => ops.push(supabase.from(table).update(r).eq('id', r.id)))
    await Promise.all(ops)

    // Re-fetch to get server-assigned IDs
    const { data } = await supabase.from(table).select('*')
    const mapped = (data ?? []).map(r => transform ? transform(r) : r as T & { id: string })
    setRows(mapped)
    setSaved(JSON.stringify(mapped))
    showToast('✓ Alterações salvas')
  }

  function discard() {
    setRows(JSON.parse(saved))
  }

  return { rows, dirty, loading, toast, deleteTarget, setDeleteTarget,
           onChange, onAdd, onDelete, confirmDelete, save, discard, showToast }
}
