'use client'

import { useEffect, useState } from 'react'
import styles from './page.module.css'

interface DadosMetricas {
  visitantes30d: number
  visitantesAnterior: number
  crescimento: string | null
  paises: { pais: string; visitas: number }[]
  topPaginas: { pagina: string; nome: string; visitas: number }[]
}

const bandeiras: Record<string, string> = {
  Brazil: '🇧🇷', 'United States': '🇺🇸', Argentina: '🇦🇷',
  Paraguay: '🇵🇾', Uruguay: '🇺🇾', Germany: '🇩🇪',
  Portugal: '🇵🇹', France: '🇫🇷', Spain: '🇪🇸', Italy: '🇮🇹',
}

export default function MetricasAdmin() {
  const [dados, setDados] = useState<DadosMetricas | null>(null)
  const [erro, setErro] = useState<string | null>(null)
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    fetch('/api/metricas')
      .then(r => r.json())
      .then(d => {
        if (d.erro) setErro(d.erro)
        else setDados(d)
      })
      .catch(() => setErro('Erro ao carregar métricas.'))
      .finally(() => setCarregando(false))
  }, [])

  const crescimentoNum = dados?.crescimento ? parseFloat(dados.crescimento) : null
  const crescimentoTexto = crescimentoNum !== null
    ? `${crescimentoNum >= 0 ? '+' : ''}${crescimentoNum}% vs. mês anterior`
    : '—'

  return (
    <div className={styles.page}>
      <div className={styles.cabecalho}>
        <div>
          <h1 className={styles.titulo}>Métricas de acesso</h1>
          <p className={styles.sub}>Últimos 30 dias</p>
        </div>
      </div>

      {carregando && (
        <div className={styles.aviso}>⏳ Carregando métricas…</div>
      )}

      {erro && (
        <div className={styles.aviso}>
          ⚠️ {erro}
          {erro.includes('VERCEL_ACCESS_TOKEN') && (
            <span> Configure as variáveis de ambiente <strong>VERCEL_ACCESS_TOKEN</strong> e <strong>VERCEL_PROJECT_ID</strong> no painel do Vercel.</span>
          )}
        </div>
      )}

      {dados && (
        <>
          {/* Cards principais */}
          <div className={styles.cards}>
            <div className={styles.card}>
              <div className={styles.cardIcono}>👤</div>
              <div className={styles.cardNum}>{dados.visitantes30d.toLocaleString('pt-BR')}</div>
              <div className={styles.cardLabel}>Visitantes únicos</div>
              <div className={crescimentoNum !== null && crescimentoNum >= 0 ? styles.cardCrescimento : styles.cardCrescimentoNeg}>
                {crescimentoTexto}
              </div>
            </div>
            <div className={styles.card}>
              <div className={styles.cardIcono}>📅</div>
              <div className={styles.cardNum}>{dados.visitantesAnterior.toLocaleString('pt-BR')}</div>
              <div className={styles.cardLabel}>Visitantes mês anterior</div>
              <div className={styles.cardCrescimento}>período de comparação</div>
            </div>
          </div>

          {/* Localização dos visitantes */}
          {dados.paises.length > 0 && (
            <div className={styles.box} style={{ marginBottom: 20 }}>
              <h2 className={styles.boxTitulo}>🌍 Localização dos visitantes</h2>
              <table className={styles.tabela}>
                <thead>
                  <tr>
                    <th style={{ width: 40 }}></th>
                    <th>País</th>
                    <th style={{ width: 100, textAlign: 'right' }}>Visitantes</th>
                    <th style={{ width: 180 }}>Proporção</th>
                  </tr>
                </thead>
                <tbody>
                  {dados.paises.map(p => {
                    const max = dados.paises[0].visitas
                    const pct = Math.round((p.visitas / max) * 100)
                    return (
                      <tr key={p.pais}>
                        <td style={{ fontSize: 22, textAlign: 'center' }}>{bandeiras[p.pais] ?? '🌐'}</td>
                        <td className={styles.paginaNome}>{p.pais}</td>
                        <td style={{ textAlign: 'right', fontWeight: 600 }}>
                          {p.visitas.toLocaleString('pt-BR')}
                        </td>
                        <td>
                          <div className={styles.barraWrap}>
                            <div className={styles.barra} style={{ width: `${pct}%` }} />
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Páginas mais acessadas */}
          {dados.topPaginas.length > 0 && (
            <div className={styles.box}>
              <h2 className={styles.boxTitulo}>📄 Páginas mais acessadas</h2>
              <table className={styles.tabela}>
                <thead>
                  <tr>
                    <th>Página</th>
                    <th style={{ width: 100, textAlign: 'right' }}>Visitas</th>
                    <th style={{ width: 120 }}>Barra</th>
                  </tr>
                </thead>
                <tbody>
                  {dados.topPaginas.map(p => {
                    const max = dados.topPaginas[0].visitas
                    const pct = Math.round((p.visitas / max) * 100)
                    return (
                      <tr key={p.pagina}>
                        <td>
                          <div className={styles.paginaNome}>{p.nome}</div>
                          <div className={styles.paginaPath}>{p.pagina}</div>
                        </td>
                        <td style={{ textAlign: 'right', fontWeight: 600 }}>
                          {p.visitas.toLocaleString('pt-BR')}
                        </td>
                        <td>
                          <div className={styles.barraWrap}>
                            <div className={styles.barra} style={{ width: `${pct}%` }} />
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  )
}
