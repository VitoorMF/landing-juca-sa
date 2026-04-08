'use client'

import { useState } from 'react'
import styles from './page.module.css'

const dadosIniciais = {
  nome: 'Prof. João Carlos de Moraes Sá',
  titulo: 'Cientista sênior, referência mundial em Plantio Direto, carbono no solo e agricultura regenerativa.',
  instituicao: 'Universidade Estadual de Ponta Grossa (UEPG)',
  laboratorio: 'Laboratório de Matéria Orgânica do Solo',
  financiamento: 'CNPq, CAPES, Embrapa, The Ohio State University',
  bio: `Prof. João Carlos de Moraes Sá — o "Juca Sá" — dedicou mais de 40 anos ao estudo do Sistema Plantio Direto (SPD) no Brasil e no mundo. Sua trajetória começa nos anos 1980, quando o SPD ainda era uma aposta de poucos agricultores visionários do Paraná.`,
  citacoes: '9.400+',
  publicacoes: '70+',
  anosExperiencia: '40+',
  email: 'juca.sa@uepg.br',
  linkedin: 'https://www.linkedin.com/in/jo%C3%A3o-carlos-moraes-s%C3%A1-99595330/',
  scholar: 'https://scholar.google.com/citations?user=01cxZjoAAAAJ',
}

export default function ConfiguracoesAdmin() {
  const [form, setForm] = useState(dadosIniciais)
  const [salvo, setSalvo] = useState(false)

  function salvar() {
    // Na integração com o backend, aqui vai a chamada à API
    setSalvo(true)
    setTimeout(() => setSalvo(false), 3000)
  }

  const campo = (label: string, key: keyof typeof form, placeholder?: string, tipo?: string) => (
    <label className={styles.label}>
      {label}
      <input
        className={styles.input}
        type={tipo ?? 'text'}
        value={form[key]}
        placeholder={placeholder}
        onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
      />
    </label>
  )

  return (
    <div className={styles.page}>
      <div className={styles.cabecalho}>
        <div>
          <h1 className={styles.titulo}>Configurações</h1>
          <p className={styles.sub}>Dados do perfil e informações gerais do site</p>
        </div>
        <button className={styles.btnPrimario} onClick={salvar}>
          {salvo ? '✅ Salvo!' : '💾 Salvar alterações'}
        </button>
      </div>

      <div className={styles.secoes}>
        {/* Identidade */}
        <div className={styles.secao}>
          <h2 className={styles.secaoTitulo}>👤 Identidade</h2>
          <div className={styles.campos}>
            {campo('Nome completo', 'nome')}
            <label className={styles.label}>
              Título / Subtítulo
              <textarea
                className={`${styles.input} ${styles.textarea}`}
                value={form.titulo}
                rows={3}
                onChange={e => setForm(f => ({ ...f, titulo: e.target.value }))}
              />
            </label>
            {campo('Instituição', 'instituicao')}
            {campo('Laboratório', 'laboratorio')}
            {campo('Financiamento', 'financiamento')}
          </div>
        </div>

        {/* Bio */}
        <div className={styles.secao}>
          <h2 className={styles.secaoTitulo}>📝 Biografia</h2>
          <div className={styles.campos}>
            <label className={styles.label}>
              Texto da bio
              <textarea
                className={`${styles.input} ${styles.textarea}`}
                value={form.bio}
                rows={6}
                onChange={e => setForm(f => ({ ...f, bio: e.target.value }))}
              />
            </label>
          </div>
        </div>

        {/* Métricas do herói */}
        <div className={styles.secao}>
          <h2 className={styles.secaoTitulo}>📊 Números do cabeçalho</h2>
          <div className={styles.campos3col}>
            {campo('Citações', 'citacoes', '9.400+')}
            {campo('Publicações', 'publicacoes', '70+')}
            {campo('Anos de experiência', 'anosExperiencia', '40+')}
          </div>
        </div>

        {/* Contato e links */}
        <div className={styles.secao}>
          <h2 className={styles.secaoTitulo}>🔗 Contato e perfis acadêmicos</h2>
          <div className={styles.campos}>
            {campo('E-mail', 'email', 'juca@email.com', 'email')}
            {campo('LinkedIn', 'linkedin', 'https://linkedin.com/in/…', 'url')}
            {campo('Google Scholar', 'scholar', 'https://scholar.google.com/…', 'url')}
          </div>
        </div>
      </div>

      {salvo && (
        <div className={styles.toast}>✅ Alterações salvas com sucesso!</div>
      )}
    </div>
  )
}
