import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase-admin'

export const dynamic = 'force-dynamic'

// Tabelas que o admin pode gravar
const ALLOWED = new Set(['publicacoes', 'apresentacoes', 'links', 'fotos', 'modulos'])

interface Body {
  table: string
  inserts?: Record<string, unknown>[]
  updates?: { id: string; [k: string]: unknown }[]
  deletes?: string[]
}

export async function POST(req: Request) {
  const { table, inserts = [], updates = [], deletes = [] }: Body = await req.json()

  if (!ALLOWED.has(table)) {
    return NextResponse.json({ erro: 'Tabela não permitida' }, { status: 400 })
  }

  const db = getSupabaseAdmin()

  try {
    if (inserts.length) {
      const { error } = await db.from(table).insert(inserts)
      if (error) throw error
    }
    for (const row of updates) {
      const { id, ...rest } = row
      const { error } = await db.from(table).update(rest).eq('id', id)
      if (error) throw error
    }
    if (deletes.length) {
      const { error } = await db.from(table).delete().in('id', deletes)
      if (error) throw error
    }
    return NextResponse.json({ ok: true })
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Erro ao salvar'
    return NextResponse.json({ erro: msg }, { status: 500 })
  }
}
