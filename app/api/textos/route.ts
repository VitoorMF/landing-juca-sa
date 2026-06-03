import { NextResponse } from 'next/server'
import { revalidateTag } from 'next/cache'
import { supabaseServer } from '@/lib/supabase-server'
import { getSupabaseAdmin } from '@/lib/supabase-admin'

export const dynamic = 'force-dynamic'

export async function GET() {
  const { data, error } = await supabaseServer
    .from('textos_editaveis')
    .select('chave, pt, en')

  if (error) return NextResponse.json({ erro: error.message }, { status: 500 })
  return NextResponse.json(data ?? [])
}

export async function POST(req: Request) {
  const body: { chave: string; pt: string; en: string }[] = await req.json()

  const { error } = await getSupabaseAdmin()
    .from('textos_editaveis')
    .upsert(
      body.map(r => ({ ...r, atualizado_em: new Date().toISOString() })),
      { onConflict: 'chave' }
    )

  if (error) return NextResponse.json({ erro: error.message }, { status: 500 })

  revalidateTag('textos-editaveis', 'default')
  return NextResponse.json({ ok: true })
}
