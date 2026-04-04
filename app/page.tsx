import Navbar from '@/components/Navbar/Navbar'
import Hero from '@/components/Hero/Hero'
import Perfil from '@/components/Perfil/Perfil'
import Impacto from '@/components/Impacto/Impacto'
import Opinioes from '@/components/Opinioes/Opinioes'
import Publicacoes from '@/components/Publicacoes/Publicacoes'
import Videos from '@/components/Videos/Videos'
import Fotos from '@/components/Fotos/Fotos'
import Apresentacoes from '@/components/Apresentacoes/Apresentacoes'
import Noticias from '@/components/Noticias/Noticias'
import Links from '@/components/Links/Links'
import Footer from '@/components/Footer/Footer'
import ScrollRevealProvider from '@/components/ScrollRevealProvider/ScrollRevealProvider'
import ScrollFab from '@/components/ScrollFab/ScrollFab'

export default function Home() {
  return (
    <ScrollRevealProvider>
      <Navbar />
      <main>
        <Hero />
        <Perfil />
        <Impacto />
        <Opinioes />
        <Publicacoes />
        <Videos />
        <Fotos />
        <Apresentacoes />
        <Noticias />
        <Links />
        <Footer />
      </main>
      <ScrollFab />
    </ScrollRevealProvider>
  )
}
