import styles from './Perfil.module.css'

const timelineItems = [
  {
    emoji: '🌱',
    year: '1981 — UFRRJ',
    text: '<strong>Graduação em Engenharia Agronômica</strong> — Universidade Federal Rural do Rio de Janeiro. Início na Cooperativa Central de Laticínios do Paraná.',
    color: 'var(--green-mid)',
  },
  {
    emoji: '🔬',
    year: '1988 — Fundação ABC',
    text: '<strong>Pesquisador em fertilidade do solo</strong> — Fundação ABC, instituição pioneira do Plantio Direto no Brasil. Primeiros contatos profundos com o SPD.',
    color: 'var(--green-mid)',
  },
  {
    emoji: '📜',
    year: '1994 — UFPR / 2001 — ESALQ-USP + OSU',
    text: '<strong>Mestrado (UFPR) e Doutorado</strong> em solos — ESALQ/USP com período sanduíche na The Ohio State University. Primeiras publicações internacionais sobre sequestro de carbono em Oxissolos brasileiros.',
    color: 'var(--green-mid)',
  },
  {
    emoji: '🏫',
    year: '1996–2019 — UEPG',
    text: '<strong>Professor Associado C</strong> — Depto. de Ciência do Solo e Eng. Agrícola, UEPG. Construiu um dos principais grupos de pesquisa em matéria orgânica do solo do Brasil.',
    color: 'var(--green-mid)',
  },
  {
    emoji: '🌎',
    year: '2008–presente — The Ohio State University',
    text: '<strong>Pós-doutorados (2008, 2012) e Professor Visitante Sênior (2015)</strong> no C-MASC (Carbon Management and Sequestration Center), ao lado do Prof. Rattan Lal.',
    color: 'var(--teal)',
  },
  {
    emoji: '🏆',
    year: '2025 — COP30, Belém',
    text: '<strong>Palestrante de abertura</strong> na Casa da Agricultura Sustentável — apresentou resultados inéditos do SPD para sequestro de carbono na ONU COP30.',
    color: 'var(--teal)',
  },
]

export default function Perfil() {
  return (
    <section id="perfil" className="section">
      <div className="container">
        <div className="section-header reveal">
          <div className="section-tag">Perfil Científico</div>
          <h2 className="section-title">Trajetória e Formação</h2>
          <p className="section-lead">
            Mais de 40 anos dedicados à pesquisa em manejo conservacionista do solo,
            formando pesquisadores em 11 países e co-autorizando com o Prêmio Nobel da Paz Prof. Rattan Lal.
          </p>
        </div>

        <div className={styles.profileGrid}>
          {/* Sidebar card */}
          <div className="reveal">
            <div className={styles.profileCard}>
              <div className={styles.profileCardHeader}>
                <div className={styles.profileAvatar}>
                  <img src="/profile-photo.png" alt="Prof. João Carlos de Moraes Sá" className={styles.profileAvatarImg} />
                </div>
                <div className={styles.profileCardName}>João Carlos de Moraes Sá</div>
                <div className={styles.profileCardTitle}>Ph.D. · Cientista Sênior · Prof. Juca Sá</div>
              </div>
              <div className={styles.profileCardBody}>
                <div className={styles.profileMetaItem}>
                  <div className={styles.profileMetaIcon}>🏛️</div>
                  <div>
                    <div className={styles.profileMetaLabel}>Instituição Atual</div>
                    <div className={styles.profileMetaValue}>Rattan Lal Center for Carbon Management — The Ohio State University</div>
                  </div>
                </div>
                <div className={styles.profileMetaItem}>
                  <div className={styles.profileMetaIcon}>🎓</div>
                  <div>
                    <div className={styles.profileMetaLabel}>Doutorado</div>
                    <div className={styles.profileMetaValue}>ESALQ-USP / The Ohio State University (2001)</div>
                  </div>
                </div>
                <div className={styles.profileMetaItem}>
                  <div className={styles.profileMetaIcon}>🔬</div>
                  <div>
                    <div className={styles.profileMetaLabel}>Laboratório</div>
                    <div className={styles.profileMetaValue}>Soil Organic Matter Lab (CNPq)</div>
                  </div>
                </div>
                <div className={styles.profileMetaItem}>
                  <div className={styles.profileMetaIcon}>🌍</div>
                  <div>
                    <div className={styles.profileMetaLabel}>Bolsa CNPq</div>
                    <div className={styles.profileMetaValue}>Pesquisador Nível 1D (mais alto nível)</div>
                  </div>
                </div>
                <div className={styles.profileMetaItem}>
                  <div className={styles.profileMetaIcon}>🤝</div>
                  <div>
                    <div className={styles.profileMetaLabel}>FEBRAPDP</div>
                    <div className={styles.profileMetaValue}>Presidente da Comissão Técnico-Científica</div>
                  </div>
                </div>
              </div>
              <div className={styles.profileLinks}>
                <a className={styles.profileLink} href="https://scholar.google.com/citations?user=01cxZjoAAAAJ" target="_blank" rel="noopener noreferrer">📚 Google Scholar</a>
                <a className={styles.profileLink} href="https://www.researchgate.net/profile/Joao-Carlos-Sa" target="_blank" rel="noopener noreferrer">🔗 ResearchGate</a>
                <a className={styles.profileLink} href="https://www.linkedin.com/in/jo%C3%A3o-carlos-moraes-s%C3%A1-99595330/" target="_blank" rel="noopener noreferrer">💼 LinkedIn</a>
                <a className={styles.profileLink} href="http://lattes.cnpq.br/5078594632126000" target="_blank" rel="noopener noreferrer">🎓 Lattes</a>
                <a className={styles.profileLink} href="https://orcid.org/0000-0003-1502-5537" target="_blank" rel="noopener noreferrer">🔬 ORCID</a>
              </div>
            </div>
          </div>

          {/* Bio + Timeline */}
          <div className={`${styles.profileBio} reveal reveal-delay-1`}>
            <h3>Sobre o Pesquisador</h3>
            <p>
              Prof. Juca Sá é um dos maiores especialistas mundiais em dinâmica de carbono orgânico do solo em sistemas
              de Plantio Direto. Sua jornada científica começou em 1981, logo após se formar em Engenharia Agronômica
              pela UFRRJ, passando por instituições pioneiras no SPD como a <strong>Fundação ABC</strong>, a{' '}
              <strong>UEPG (Universidade Estadual de Ponta Grossa)</strong> — onde atuou de 1996 a 2019 — e hoje
              como pesquisador associado sênior na <strong>The Ohio State University</strong>, ao lado do
              Prêmio Nobel da Paz Prof. Rattan Lal.
            </p>
            <p>
              Suas pesquisas demonstraram que o Plantio Direto, quando implementado corretamente nos seus três pilares,
              é capaz de restaurar os estoques de carbono orgânico do solo a níveis comparáveis aos da vegetação nativa.
              Um estudo publicado em 2025 em parceria com Rattan Lal — abrangendo 63 fazendas nos biomas Cerrado e
              Mata Atlântica — confirmou que <strong>25% das propriedades já superaram os estoques de carbono
              da vegetação nativa</strong>.
            </p>
            <p>
              Formou 32 orientandos de graduação, 12 mestres, 3 doutores e 7 pós-doutores, além de treinar
              pesquisadores de <strong>11 países da Ásia e África</strong> em 7 edições de cursos internacionais
              sobre manejo de matéria orgânica do solo.
            </p>

            <div className={styles.timeline}>
              {timelineItems.map((item, idx) => (
                <div key={idx} className={styles.timelineItem}>
                  <div className={styles.timelineDot} style={{ background: item.color }}>{item.emoji}</div>
                  <div>
                    <div className={styles.timelineYear}>{item.year}</div>
                    <div
                      className={styles.timelineText}
                      dangerouslySetInnerHTML={{ __html: item.text }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
