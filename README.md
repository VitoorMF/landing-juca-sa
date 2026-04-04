# Landing Page — Prof. Juca Sá

Site institucional de **Prof. João Carlos de Moraes Sá**, cientista sênior e referência mundial em Sistema Plantio Direto, carbono no solo e agricultura regenerativa.

## Stack

- [Next.js 14](https://nextjs.org/) (App Router)
- React 18
- TypeScript
- CSS Modules

## Estrutura

```
app/
  layout.tsx          # Layout global, fontes
  page.tsx            # Página principal
  globals.css         # Reset, variáveis CSS, utilitários
components/
  Navbar/             # Navbar com menu hamburger (mobile ≤ 1100px)
  Hero/               # Seção de abertura com foto e estatísticas
  Perfil/             # Bio, timeline, links acadêmicos
  Impacto/            # Cards de métricas de impacto
  Opinioes/           # Princípios e citações
  Publicacoes/        # Lista filtrada de publicações científicas
  Videos/             # Grid de vídeos
  Fotos/              # Galeria de fotos
  Apresentacoes/      # Apresentações e palestras
  Noticias/           # Notícias e cobertura de mídia
  Links/              # Links externos relevantes
  Footer/             # Rodapé
  ScrollRevealProvider/ # Animação de entrada via IntersectionObserver
  ScrollFab/          # Floating action button de navegação por seção
data/                 # Dados estáticos (publicações, vídeos, notícias, etc.)
public/               # Imagens estáticas (hero.jpg, profile-photo.png, etc.)
```

## Rodando localmente

```bash
npm install
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000).

## Build de produção

```bash
npm run build
npm start
```

## Imagens

As imagens ficam na pasta `public/`. Atualmente:

| Arquivo | Uso |
|---|---|
| `hero.jpg` | Foto principal no Hero |
| `profile-photo.png` | Avatar circular no Perfil |
| `imagem.png` | Galeria — card destaque (span) |
| `image2.png` — `image6.png` | Galeria — demais cards |
