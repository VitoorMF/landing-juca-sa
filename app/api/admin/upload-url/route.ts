import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase-admin'

export const dynamic = 'force-dynamic'

const ALLOWED = new Set(['fotos', 'cursos'])

export async function POST(req: Request) {
  const { bucket, filename }: { bucket: string; filename: string } = await req.json()

  if (!ALLOWED.has(bucket)) {
    return NextResponse.json({ erro: 'Bucket não permitido' }, { status: 400 })
  }

  // nome único pra não sobrescrever
  const safe = filename.replace(/[^\w.\-]/g, '_')
  const path = `${Date.now()}-${safe}`

  const db = getSupabaseAdmin()
  const { data, error } = await db.storage.from(bucket).createSignedUploadUrl(path)
  if (error || !data) {
    return NextResponse.json({ erro: error?.message ?? 'Erro ao gerar URL' }, { status: 500 })
  }

  const { data: pub } = db.storage.from(bucket).getPublicUrl(path)

  return NextResponse.json({ path: data.path, token: data.token, publicUrl: pub.publicUrl })
}
