import LegacyFonts from '@/components/LegacyFonts/LegacyFonts'

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <LegacyFonts />
      {children}
    </>
  )
}
