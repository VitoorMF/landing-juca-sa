import { NextResponse } from 'next/server'

const TOKEN = process.env.VERCEL_ACCESS_TOKEN
const PROJECT_ID = process.env.VERCEL_PROJECT_ID

export async function GET() {
  if (!TOKEN || !PROJECT_ID) {
    return NextResponse.json({ erro: 'Variáveis VERCEL_ACCESS_TOKEN e VERCEL_PROJECT_ID não configuradas.' }, { status: 500 })
  }

  try {

  const agora = new Date()
  const inicio30d = new Date(agora)
  inicio30d.setDate(agora.getDate() - 30)
  const inicioAnterior = new Date(agora)
  inicioAnterior.setDate(agora.getDate() - 60)

  const from = inicio30d.toISOString().split('T')[0]
  const to = agora.toISOString().split('T')[0]
  const fromAnterior = inicioAnterior.toISOString().split('T')[0]
  const toAnterior = inicio30d.toISOString().split('T')[0]

  const headers = { Authorization: `Bearer ${TOKEN}` }
  const base = `https://api.vercel.com/v1/web-analytics`
  const qs = `projectId=${PROJECT_ID}`

  const fetchJson = async (url: string) => {
    const r = await fetch(url, { headers })
    const text = await r.text()
    if (!r.ok) throw new Error(`${r.status} ${url} — ${text}`)
    return JSON.parse(text)
  }

  const [resumo, resumoAnterior, paises, paginas] = await Promise.all([
    fetchJson(`${base}/timeseries?${qs}&from=${from}&to=${to}&granularity=day`),
    fetchJson(`${base}/timeseries?${qs}&from=${fromAnterior}&to=${toAnterior}&granularity=day`),
    fetchJson(`${base}/breakdown?${qs}&from=${from}&to=${to}&groupBy=country&limit=6`),
    fetchJson(`${base}/breakdown?${qs}&from=${from}&to=${to}&groupBy=path&limit=5`),
  ])

  const somarVisitantes = (data: { visitors?: number }[]) =>
    (data ?? []).reduce((acc: number, d) => acc + (d.visitors ?? 0), 0)

  const visitantesAtual = somarVisitantes(resumo?.data ?? [])
  const visitantesAnterior = somarVisitantes(resumoAnterior?.data ?? [])
  const crescimento = visitantesAnterior > 0
    ? (((visitantesAtual - visitantesAnterior) / visitantesAnterior) * 100).toFixed(1)
    : null

  return NextResponse.json({
    visitantes30d: visitantesAtual,
    visitantesAnterior,
    crescimento,
    paises: (paises?.data ?? []).map((p: { key: string; total: number }) => ({
      pais: p.key,
      visitas: p.total,
    })),
    topPaginas: (paginas?.data ?? []).map((p: { key: string; total: number }) => ({
      pagina: p.key,
      nome: p.key === '/' ? 'Página inicial' : p.key,
      visitas: p.total,
    })),
  })
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e)
    return NextResponse.json({ erro: msg }, { status: 500 })
  }
}
