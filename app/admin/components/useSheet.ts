'use client'

import { useState, useEffect, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import { adminWrite } from '@/lib/admin-write'

const uid = () => 'x' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6)

export function useSheet<T extends { id: string }>(
  table: string,
  blank: Omit<T, 'id'>,
  transform?: (row: Record<string, unknown>) => T,
) {
  const [rows, setRows] = useState<(T & { id: string })[]>([])
  const [saved, setSaved] = useState<string>('[]')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState('')
  const [deleteTarget, setDeleteTarget] = useState<(T & { id: string }) | null>(null)
  const toastTimer = useRef<ReturnType<typeof setTimeout>>()

  const dirty = JSON.stringify(rows) !== saved

  useEffect(() => {
    supabase.from(table).select('*').order('ordem', { nullsFirst: false }).then(({ data }) => {
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

  function onReorder(from: number, to: number) {
    if (from === to) return
    setRows(prev => {
      const next = [...prev]
      const [moved] = next.splice(from, 1)
      next.splice(to, 0, moved)
      return next
    })
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
    const id = deleteTarget.id
    const isNew = id.startsWith('x')
    if (!isNew) {
      const ok = await adminWrite({ table, deletes: [id] })
      if (!ok) { showToast('❌ Erro ao excluir'); return }
    }
    // remove a linha de rows E do baseline salvo, preservando edições pendentes
    setRows(prev => prev.filter(r => r.id !== id))
    setSaved(prev => {
      try {
        const arr = JSON.parse(prev) as { id: string }[]
        return JSON.stringify(arr.filter(r => r.id !== id))
      } catch { return prev }
    })
    setDeleteTarget(null)
    showToast('Item excluído')
  }

  async function save() {
    setSaving(true)
    try {
      // ordem = posição atual na lista
      const withOrder = rows.map((r, i) => ({ ...r, ordem: i }))
      const inserts = withOrder.filter(r => r.id.startsWith('x')).map(({ id, ...rest }) => rest as Record<string, unknown>)
      const updates = withOrder.filter(r => !r.id.startsWith('x')).map(r => ({ ...r } as { id: string }))

      const ok = await adminWrite({ table, inserts, updates })
      if (!ok) { showToast('❌ Erro ao salvar'); return }

      // Re-fetch para pegar os IDs gerados pelo banco
      const { data } = await supabase.from(table).select('*').order('ordem', { nullsFirst: false })
      const mapped = (data ?? []).map(r => transform ? transform(r) : r as T & { id: string })
      setRows(mapped)
      setSaved(JSON.stringify(mapped))
      showToast('✓ Alterações salvas')
    } finally {
      setSaving(false)
    }
  }

  function discard() {
    setRows(JSON.parse(saved))
  }

  return { rows, dirty, loading, saving, toast, deleteTarget, setDeleteTarget,
           onChange, onAdd, onDelete, onReorder, confirmDelete, save, discard, showToast }
}
