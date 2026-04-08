import { NextResponse } from 'next/server'

const API_KEY     = process.env.UMAMI_API_KEY
const WEBSITE_ID  = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID
const BASE        = 'https://api.umami.is/v1'

export async function GET() {
  if (!API_KEY || !WEBSITE_ID) {
    return NextResponse.json({ erro: 'Variáveis UMAMI_API_KEY e NEXT_PUBLIC_UMAMI_WEBSITE_ID não configuradas.' }, { status: 500 })
  }

  try {
    const agora     = Date.now()
    const inicio30d = agora - 30 * 24 * 60 * 60 * 1000
    const anterior  = agora - 60 * 24 * 60 * 60 * 1000

    const headers = { Authorization: `Bearer ${API_KEY}` }
    const qs      = `startAt=${inicio30d}&endAt=${agora}`
    const qsAntes = `startAt=${anterior}&endAt=${inicio30d}`

    const [stats, statsPrev, paises, paginas] = await Promise.all([
      fetch(`${BASE}/websites/${WEBSITE_ID}/stats?${qs}`,                          { headers }).then(r => r.json()),
      fetch(`${BASE}/websites/${WEBSITE_ID}/stats?${qsAntes}`,                     { headers }).then(r => r.json()),
      fetch(`${BASE}/websites/${WEBSITE_ID}/metrics?${qs}&type=country&limit=6`,   { headers }).then(r => r.json()),
      fetch(`${BASE}/websites/${WEBSITE_ID}/metrics?${qs}&type=url&limit=5`,       { headers }).then(r => r.json()),
    ])

    const visitantes     = stats?.visitors?.value     ?? 0
    const visitantesPrev = statsPrev?.visitors?.value ?? 0
    const pageviews      = stats?.pageviews?.value    ?? 0
    const crescimento    = visitantesPrev > 0
      ? (((visitantes - visitantesPrev) / visitantesPrev) * 100).toFixed(1)
      : null

    return NextResponse.json({
      visitantes30d:      visitantes,
      visitantesAnterior: visitantesPrev,
      pageviews30d:       pageviews,
      crescimento,
      paises: (Array.isArray(paises) ? paises : []).map((p: { x: string; y: number }) => ({
        pais:    p.x,
        visitas: p.y,
      })),
      topPaginas: (Array.isArray(paginas) ? paginas : []).map((p: { x: string; y: number }) => ({
        pagina:  p.x,
        nome:    p.x === '/' ? 'Página inicial' : p.x,
        visitas: p.y,
      })),
    })
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e)
    return NextResponse.json({ erro: msg }, { status: 500 })
  }
}
