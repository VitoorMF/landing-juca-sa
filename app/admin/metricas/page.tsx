'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import styles from './page.module.css'

const MapaMundi = dynamic(() => import('./MapaMundi'), { ssr: false })

interface Item { nome: string; visitas: number }

interface DadosMetricas {
  stats: {
    visitors: number
    visits: number
    pageviews: number
    taxaRejeicao: number
    duracao: string
    crescimento: string | null
    visitorsP: number
  }
  paginas: { urls: Item[]; entradas: Item[]; saidas: Item[] }
  localizacao: { paises: Item[]; regioes: Item[]; cidades: Item[] }
  ambiente: { browsers: Item[]; sistemas: Item[]; dispositivos: Item[] }
  origens: { referrers: Item[] }
}

type TabPaginas = 'urls' | 'entradas' | 'saidas'
type TabSources = 'referrers'
type TabAmbiente = 'browsers' | 'sistemas' | 'dispositivos'
type TabLocal = 'paises' | 'regioes' | 'cidades'

const bandeiras: Record<string, string> = {
  Brazil: '🇧🇷', 'United States': '🇺🇸', Argentina: '🇦🇷',
  Paraguay: '🇵🇾', Uruguay: '🇺🇾', Germany: '🇩🇪',
  Portugal: '🇵🇹', France: '🇫🇷', Spain: '🇪🇸', Italy: '🇮🇹',
  Japan: '🇯🇵', China: '🇨🇳', India: '🇮🇳', Australia: '🇦🇺',
  Canada: '🇨🇦', Mexico: '🇲🇽', Chile: '🇨🇱', Colombia: '🇨🇴',
  Netherlands: '🇳🇱', Sweden: '🇸🇪', Norway: '🇳🇴', Denmark: '🇩🇰',
  Finland: '🇫🇮', Switzerland: '🇨🇭', Belgium: '🇧🇪', Austria: '🇦🇹',
  Poland: '🇵🇱', Russia: '🇷🇺', Ukraine: '🇺🇦', Turkey: '🇹🇷',
  Israel: '🇮🇱', 'South Korea': '🇰🇷', Indonesia: '🇮🇩',
  'New Zealand': '🇳🇿', 'South Africa': '🇿🇦',
}

function ListaItens({ items, emoji, colLabel = 'Nome', colValue = 'Visitas' }: {
  items: Item[]
  emoji?: boolean
  colLabel?: string
  colValue?: string
}) {
  const total = items.reduce((s, i) => s + i.visitas, 0)

  if (items.length === 0) {
    return <div className={styles.vazio}>Nenhum dado disponível</div>
  }

  return (
    <div className={styles.listaWrap}>
      <div className={styles.listaCabecalho}>
        <span>{colLabel}</span>
        <span>{colValue}</span>
      </div>
      <div className={styles.listaItens}>
        {items.map((item) => {
          const pct = total > 0 ? Math.round((item.visitas / total) * 100) : 0
          return (
            <div key={item.nome} className={styles.listaItem}>
              <div className={styles.listaItemConteudo}>
                <span className={styles.listaItemNome}>
                  {emoji && <span className={styles.bandeira}>{bandeiras[item.nome] ?? '🌐'}</span>}
                  {item.nome}
                </span>
                <span className={styles.listaItemValores}>
                  <span className={styles.listaItemPct}>{pct}%</span>
                  <span className={styles.listaItemNum}>{item.visitas.toLocaleString('pt-BR')}</span>
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function Painel({ titulo, tabs, ativo, setAtivo, children }: {
  titulo: string
  tabs: { key: string; label: string }[]
  ativo: string
  setAtivo: (k: string) => void
  children: React.ReactNode
}) {
  return (
    <div className={styles.painel}>
      <div className={styles.painelCabecalho}>
        <span className={styles.painelTitulo}>{titulo}</span>
        <div className={styles.tabs}>
          {tabs.map(t => (
            <button
              key={t.key}
              className={`${styles.tab} ${ativo === t.key ? styles.tabAtivo : ''}`}
              onClick={() => setAtivo(t.key)}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>
      <div className={styles.painelCorpo}>{children}</div>
    </div>
  )
}

export default function MetricasAdmin() {
  const [dados, setDados] = useState<DadosMetricas | null>(null)
  const [erro, setErro] = useState<string | null>(null)
  const [carregando, setCarregando] = useState(true)

  const [ativos, setAtivos] = useState<number | null>(null)

  const [tabPag, setTabPag] = useState<TabPaginas>('urls')
  const [tabSrc, setTabSrc] = useState<TabSources>('referrers')
  const [tabAmb, setTabAmb] = useState<TabAmbiente>('browsers')
  const [tabLoc, setTabLoc] = useState<TabLocal>('paises')

  useEffect(() => {
    fetch('/api/metricas')
      .then(r => r.json())
      .then(d => { if (d.erro) setErro(d.erro); else setDados(d) })
      .catch(() => setErro('Erro ao carregar métricas.'))
      .finally(() => setCarregando(false))
  }, [])

  useEffect(() => {
    const buscar = () =>
      fetch('/api/metricas/ativos')
        .then(r => r.json())
        .then(d => setAtivos(d.ativos ?? 0))
        .catch(() => {})

    buscar()
    const intervalo = setInterval(buscar, 30_000)
    return () => clearInterval(intervalo)
  }, [])

  const crescNum = dados?.stats.crescimento ? parseFloat(dados.stats.crescimento) : null
  const crescPositivo = crescNum !== null && crescNum >= 0

  return (
    <div className={styles.page}>
      <div className={styles.cabecalho}>
        <div>
          <h1 className={styles.titulo}>Métricas de acesso</h1>
          <p className={styles.sub}>Últimos 30 dias · via Umami Analytics</p>
        </div>
      </div>

      {ativos !== null && (
        <div className={styles.ativosWrap}>
          <span className={styles.ativosDot} />
          <span className={styles.ativosNum}>{ativos}</span>
          <span className={styles.ativosLabel}>
            {ativos === 1 ? 'pessoa online agora' : 'pessoas online agora'}
          </span>
        </div>
      )}

      {carregando && (
        <div className={styles.loading}>
          <div className={styles.spinner} />
          <span>Carregando métricas…</span>
        </div>
      )}

      {erro && (
        <div className={styles.erro}>
          <span>⚠️</span> {erro}
        </div>
      )}

      {dados && (
        <>
          {/* Stats bar */}
          <div className={styles.statsBar}>
            <div className={styles.statItem}>
              <div className={styles.statLabel}>Visitantes únicos</div>
              <div className={styles.statNum}>{dados.stats.visitors.toLocaleString('pt-BR')}</div>
              {crescNum !== null && (
                <div className={`${styles.statDelta} ${crescPositivo ? styles.deltaPos : styles.deltaNeg}`}>
                  {crescPositivo ? '↑' : '↓'} {Math.abs(crescNum)}% vs. mês anterior
                </div>
              )}
            </div>
            <div className={styles.statDivider} />
            <div className={styles.statItem}>
              <div className={styles.statLabel}>Visitas</div>
              <div className={styles.statNum}>{dados.stats.visits.toLocaleString('pt-BR')}</div>
              <div className={styles.statSub}>sessões iniciadas</div>
            </div>
            <div className={styles.statDivider} />
            <div className={styles.statItem}>
              <div className={styles.statLabel}>Visualizações</div>
              <div className={styles.statNum}>{dados.stats.pageviews.toLocaleString('pt-BR')}</div>
              <div className={styles.statSub}>páginas vistas</div>
            </div>
            <div className={styles.statDivider} />
            <div className={styles.statItem}>
              <div className={styles.statLabel}>Taxa de rejeição</div>
              <div className={styles.statNum}>{dados.stats.taxaRejeicao}%</div>
              <div className={styles.statSub}>saídas sem interação</div>
            </div>
            <div className={styles.statDivider} />
            <div className={styles.statItem}>
              <div className={styles.statLabel}>Tempo médio</div>
              <div className={styles.statNum}>{dados.stats.duracao}</div>
              <div className={styles.statSub}>por visita</div>
            </div>
          </div>

          {/* Painéis */}
          <div className={styles.grade}>
            {/* Páginas */}
            <Painel
              titulo="Páginas"
              tabs={[
                { key: 'urls',     label: 'Todas'   },
                { key: 'entradas', label: 'Entrada'  },
                { key: 'saidas',   label: 'Saída'    },
              ]}
              ativo={tabPag}
              setAtivo={k => setTabPag(k as TabPaginas)}
            >
              {tabPag === 'urls'     && <ListaItens items={dados.paginas.urls}     colLabel="Caminho" />}
              {tabPag === 'entradas' && <ListaItens items={dados.paginas.entradas} colLabel="Página de entrada" />}
              {tabPag === 'saidas'   && <ListaItens items={dados.paginas.saidas}   colLabel="Página de saída" />}
            </Painel>

            {/* Fontes */}
            <Painel
              titulo="Fontes de tráfego"
              tabs={[{ key: 'referrers', label: 'Referrers' }]}
              ativo={tabSrc}
              setAtivo={k => setTabSrc(k as TabSources)}
            >
              <ListaItens items={dados.origens.referrers} colLabel="Referrer" />
            </Painel>

            {/* Localização */}
            <Painel
              titulo="Localização"
              tabs={[
                { key: 'paises',  label: 'Países'  },
                { key: 'regioes', label: 'Regiões' },
                { key: 'cidades', label: 'Cidades' },
              ]}
              ativo={tabLoc}
              setAtivo={k => setTabLoc(k as TabLocal)}
            >
              {tabLoc === 'paises'  && <ListaItens items={dados.localizacao.paises}  colLabel="País"   emoji />}
              {tabLoc === 'regioes' && <ListaItens items={dados.localizacao.regioes} colLabel="Região"       />}
              {tabLoc === 'cidades' && <ListaItens items={dados.localizacao.cidades} colLabel="Cidade"       />}
            </Painel>

            {/* Ambiente */}
            <Painel
              titulo="Ambiente"
              tabs={[
                { key: 'browsers',    label: 'Navegadores' },
                { key: 'sistemas',    label: 'Sistemas'    },
                { key: 'dispositivos',label: 'Dispositivos'},
              ]}
              ativo={tabAmb}
              setAtivo={k => setTabAmb(k as TabAmbiente)}
            >
              {tabAmb === 'browsers'     && <ListaItens items={dados.ambiente.browsers}     colLabel="Navegador"  />}
              {tabAmb === 'sistemas'     && <ListaItens items={dados.ambiente.sistemas}     colLabel="Sistema OS" />}
              {tabAmb === 'dispositivos' && <ListaItens items={dados.ambiente.dispositivos} colLabel="Dispositivo"/>}
            </Painel>
          </div>

          {/* Mapa */}
          <div className={styles.painelMapa}>
            <div className={styles.painelMapaCabecalho}>
              <span className={styles.painelTitulo}>Mapa de visitantes</span>
              <span className={styles.painelMapaSub}>Arraste para navegar · scroll para zoom</span>
            </div>
            <MapaMundi paises={dados.localizacao.paises} />
          </div>
        </>
      )}
    </div>
  )
}
