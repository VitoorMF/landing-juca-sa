import { supabase } from '@/lib/supabase'

/**
 * Sobe um arquivo pro Supabase Storage usando URL assinada gerada pelo servidor
 * (service role). O arquivo vai direto do navegador pro Supabase — sem limite de
 * tamanho do servidor e sem depender de política RLS pública de escrita.
 * Retorna a URL pública do arquivo.
 */
export async function adminUpload(bucket: 'fotos' | 'cursos', file: File): Promise<string> {
  const res = await fetch('/api/admin/upload-url', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ bucket, filename: file.name }),
  })
  if (!res.ok) throw new Error('Falha ao gerar URL de upload')
  const { path, token, publicUrl } = await res.json()

  const { error } = await supabase.storage.from(bucket).uploadToSignedUrl(path, token, file)
  if (error) throw new Error(error.message)

  return publicUrl as string
}
