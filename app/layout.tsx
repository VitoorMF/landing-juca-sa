import type { Metadata } from 'next'
import { Inter, Newsreader } from 'next/font/google'
import { getLocale } from 'next-intl/server'
import { Analytics } from '@vercel/analytics/next'
import Script from 'next/script'
import './globals.css'

const serif = Newsreader({
  subsets: ['latin'],
  style: ['normal', 'italic'],
  axes: ['opsz'],
  variable: '--font-serif',
  display: 'swap',
})

const sans = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Prof. Juca Sá — Sistema Plantio Direto',
  description: 'Prof. João Carlos de Moraes Sá — Cientista sênior, referência mundial em Plantio Direto, carbono no solo e agricultura regenerativa.',
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = await getLocale()

  return (
    <html lang={locale === 'en' ? 'en' : 'pt-BR'} className={`${serif.variable} ${sans.variable}`}>
      <body>
        {children}
        <Analytics />
        <Script
          defer
          src="https://cloud.umami.is/script.js"
          data-website-id={process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID}
        />
      </body>
    </html>
  )
}
