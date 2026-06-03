import { getLocale } from 'next-intl/server'
import { supabaseServer } from '@/lib/supabase-server'
import { Foto } from '@/types'
import GaleriaClient from './GaleriaClient'

export default async function FotosPage() {
  const [{ data }, locale] = await Promise.all([
    supabaseServer.from('fotos').select('*'),
    getLocale(),
  ])
  const fotos: Foto[] = data ?? []

  return <GaleriaClient fotos={fotos} locale={locale} />
}
