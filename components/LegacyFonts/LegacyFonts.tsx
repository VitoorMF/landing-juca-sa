// O painel admin e o login usam 'Inter' e 'Merriweather' pelo nome nos CSS.
// O site público carrega suas fontes via next/font; aqui mantemos as antigas
// só nas rotas que ainda dependem delas.
const HREF =
  'https://fonts.googleapis.com/css2?family=Merriweather:ital,wght@0,400;0,700;0,900;1,400&family=Inter:wght@300;400;500;600;700&display=swap'

export default function LegacyFonts() {
  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link rel="stylesheet" href={HREF} />
    </>
  )
}
