import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Prof. Juca Sá — Sistema Plantio Direto',
  description: 'Prof. João Carlos de Moraes Sá — Cientista sênior, referência mundial em Plantio Direto, carbono no solo e agricultura regenerativa.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Merriweather:ital,wght@0,400;0,700;0,900;1,400&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  )
}
