import { getRequestConfig } from 'next-intl/server'
import { unstable_cache } from 'next/cache'
import { routing } from './routing'
import { supabaseServer } from '@/lib/supabase-server'

const fetchOverrides = unstable_cache(
  async () => {
    const { data } = await supabaseServer
      .from('textos_editaveis')
      .select('chave, pt, en')
    return data ?? []
  },
  ['textos-editaveis'],
  { revalidate: 60, tags: ['textos-editaveis'] }
)

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function setDeep(obj: any, path: string, value: unknown) {
  const keys = path.split('.')
  let cur = obj
  for (let i = 0; i < keys.length - 1; i++) {
    if (typeof cur[keys[i]] !== 'object' || cur[keys[i]] === null) cur[keys[i]] = {}
    cur = cur[keys[i]]
  }
  cur[keys[keys.length - 1]] = value
}

function tryParse(v: string): unknown {
  try { return JSON.parse(v) } catch { return v }
}

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale
  if (!locale || !routing.locales.includes(locale as typeof routing.locales[number])) {
    locale = routing.defaultLocale
  }

  const base = (await import(`../messages/${locale}.json`)).default
  const messages = JSON.parse(JSON.stringify(base))

  const overrides = await fetchOverrides()
  for (const row of overrides) {
    const raw = locale === 'pt' ? row.pt : row.en
    setDeep(messages, row.chave, tryParse(raw))
  }

  return { locale, messages }
})
