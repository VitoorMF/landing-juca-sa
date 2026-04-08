import { NextResponse } from 'next/server'

const API_KEY    = process.env.UMAMI_API_KEY
const WEBSITE_ID = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID
const BASE       = 'https://api.umami.is/v1'

export async function GET() {
  if (!API_KEY || !WEBSITE_ID) {
    return NextResponse.json({ erro: 'Variáveis UMAMI_API_KEY e NEXT_PUBLIC_UMAMI_WEBSITE_ID não configuradas.' }, { status: 500 })
  }

  try {
    const agora     = Date.now()
    const inicio30d = agora - 30 * 24 * 60 * 60 * 1000
    const anterior  = agora - 60 * 24 * 60 * 60 * 1000

    const h   = { Authorization: `Bearer ${API_KEY}` }
    const qs  = `startAt=${inicio30d}&endAt=${agora}`
    const qsP = `startAt=${anterior}&endAt=${inicio30d}`
    const m   = (type: string, limit = 10) =>
      fetch(`${BASE}/websites/${WEBSITE_ID}/metrics?${qs}&type=${type}&limit=${limit}`, { headers: h }).then(r => r.json())

    const [stats, statsPrev, urls, entradas, saidas, paises, regioes, cidades, browsers, sistemas, dispositivos, referrers] = await Promise.all([
      fetch(`${BASE}/websites/${WEBSITE_ID}/stats?${qs}`,  { headers: h }).then(r => r.json()),
      fetch(`${BASE}/websites/${WEBSITE_ID}/stats?${qsP}`, { headers: h }).then(r => r.json()),
      m('url'),
      m('entry'),
      m('exit'),
      m('country'),
      m('region'),
      m('city'),
      m('browser'),
      m('os'),
      m('device'),
      m('referrer'),
    ])

    const toArr = (d: unknown) => Array.isArray(d) ? d : []
    const fmt   = (d: { x: string; y: number }) => ({ nome: d.x || '(direto)', visitas: d.y })

    // Umami Cloud pode retornar { visitors: 2 } ou { visitors: { value: 2 } }
    const getVal = (v: unknown): number => {
      if (typeof v === 'number') return v
      if (typeof v === 'object' && v !== null && 'value' in v) return (v as { value: number }).value ?? 0
      return 0
    }

    const visitors  = getVal(stats?.visitors)
    const visits    = getVal(stats?.visits)
    const pageviews = getVal(stats?.pageviews)
    const bounces   = getVal(stats?.bounces)
    const totaltime = getVal(stats?.totaltime)
    const visitorsP = getVal(statsPrev?.visitors)

    const crescimento    = visitorsP > 0 ? (((visitors - visitorsP) / visitorsP) * 100).toFixed(1) : null
    const taxaRejeicao   = visits > 0 ? Math.round((bounces / visits) * 100) : 0
    const duracaoSeg     = visits > 0 ? Math.round(totaltime / visits) : 0
    const duracao        = `${Math.floor(duracaoSeg / 60)}m ${duracaoSeg % 60}s`

    return NextResponse.json({
      stats: { visitors, visits, pageviews, taxaRejeicao, duracao, crescimento, visitorsP },
      paginas:      { urls: toArr(urls).map(fmt), entradas: toArr(entradas).map(fmt), saidas: toArr(saidas).map(fmt) },
      localizacao:  { paises: toArr(paises).map(fmt), regioes: toArr(regioes).map(fmt), cidades: toArr(cidades).map(fmt) },
      ambiente:     { browsers: toArr(browsers).map(fmt), sistemas: toArr(sistemas).map(fmt), dispositivos: toArr(dispositivos).map(fmt) },
      origens:      { referrers: toArr(referrers).map(fmt) },
    })
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e)
    return NextResponse.json({ erro: msg }, { status: 500 })
  }
}
