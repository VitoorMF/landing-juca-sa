import type { Metadata } from 'next'
import './admin.css'
import AdminShell from './AdminShell'

// favicon distinto pro admin: quadrado verde com engrenagem teal
const ADMIN_FAVICON =
  'data:image/svg+xml,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <rect width="100" height="100" rx="22" fill="#16301f"/>
      <g fill="none" stroke="#2bbd86" stroke-width="8" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="50" cy="50" r="13"/>
        <path d="M50 24v-8M50 84v-8M76 50h8M16 50h8M68 68l6 6M26 26l6 6M68 32l6-6M26 74l6-6"/>
      </g>
    </svg>`
  )

export const metadata: Metadata = {
  title: 'Painel Admin · Prof. Juca Sá',
  icons: { icon: ADMIN_FAVICON },
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminShell>{children}</AdminShell>
}
