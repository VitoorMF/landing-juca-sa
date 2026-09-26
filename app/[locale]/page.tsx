import { getTranslations } from 'next-intl/server'
import Navbar from '@/components/Navbar/Navbar'
import Hero from '@/components/Hero/Hero'
import Perfil from '@/components/Perfil/Perfil'
import Impacto from '@/components/Impacto/Impacto'
import Opinioes from '@/components/Opinioes/Opinioes'
import Publicacoes from '@/components/Publicacoes/Publicacoes'
import Fotos from '@/components/Fotos/Fotos'
import Circulacao from '@/components/Circulacao/Circulacao'
import Curso from '@/components/Curso/Curso'
import Links from '@/components/Links/Links'
import Footer from '@/components/Footer/Footer'
import ScrollRevealProvider from '@/components/ScrollRevealProvider/ScrollRevealProvider'
import ScrollFab from '@/components/ScrollFab/ScrollFab'
import { supabaseServer } from '@/lib/supabase-server'
import { Modulo } from '@/types'

export default async function Home() {
  const [t, { data }] = await Promise.all([
    getTranslations('nav'),
    supabaseServer.from('modulos').select('*').order('ordem'),
  ])
  const modulos: Modulo[] = data ?? []

  return (
    <ScrollRevealProvider>
      <a className="skip-link" href="#conteudo">{t('skip')}</a>
      <Navbar />
      <main id="conteudo">
        <Hero modulos={modulos} />
        <Perfil />
        <Impacto />
        <Opinioes />
        <Publicacoes />
        <Fotos />
        <Circulacao />
        <Curso modulos={modulos} />
        <Links />
      </main>
      <Footer />
      <ScrollFab />
    </ScrollRevealProvider>
  )
}
