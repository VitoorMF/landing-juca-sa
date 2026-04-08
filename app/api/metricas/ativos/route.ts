import { NextResponse } from 'next/server'

const API_KEY    = process.env.UMAMI_API_KEY
const WEBSITE_ID = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID
const BASE       = 'https://api.umami.is/v1'

export async function GET() {
  if (!API_KEY || !WEBSITE_ID) {
    return NextResponse.json({ ativos: 0 })
  }

  try {
    const res  = await fetch(`${BASE}/websites/${WEBSITE_ID}/active`, {
      headers: { Authorization: `Bearer ${API_KEY}` },
      cache: 'no-store',
    })
    const data = await res.json()
    // Umami retorna { x: number } ou array [{ x: number }]
    const ativos = Array.isArray(data) ? (data[0]?.x ?? 0) : (data?.x ?? data?.visitors ?? 0)
    return NextResponse.json({ ativos })
  } catch {
    return NextResponse.json({ ativos: 0 })
  }
}
