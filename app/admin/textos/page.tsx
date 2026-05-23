'use client'

import { useEffect, useState } from 'react'
import styles from './page.module.css'
import ptJson from '../../../messages/pt.json'
import enJson from '../../../messages/en.json'

type Row = { chave: string; pt: string; en: string }

type ImpactoItem  = { numero: string; sufixo: string; labelPt: string; labelEn: string }
type Citacao      = { textoPt: string; fontePt: string; textoEn: string; fonteEn: string }
type CardItem      = { icon: string; labelPt: string; labelEn: string; valuePt: string; valueEn: string }
type ProfileLink   = { icon: string; label: string; url: string }
type TimelineItem  = { emoji: string; year: string; textPt: string; textEn: string }

const DEFAULTS: Record<string, { pt: string; en: string }> = {
  'hero.eyebrow': { pt: ptJson.hero.eyebrow,  en: enJson.hero.eyebrow  },
  'hero.desc':    { pt: ptJson.hero.desc,      en: enJson.hero.desc     },
  'perfil.lead':  { pt: ptJson.perfil.lead,    en: enJson.perfil.lead   },
  'perfil.bio1':  { pt: ptJson.perfil.bio1,    en: enJson.perfil.bio1   },
  'perfil.bio2':  { pt: ptJson.perfil.bio2,    en: enJson.perfil.bio2   },
  'perfil.bio3':  { pt: ptJson.perfil.bio3,    en: enJson.perfil.bio3   },
}

function rowsToImpacto(rows: Row[]): ImpactoItem[] {
  const row = rows.find(r => r.chave === 'impacto.items')
  const ptItems: { numero: string; sufixo: string; label: string }[] =
    row ? JSON.parse(row.pt) : ptJson.impacto.items
  const enItems: { numero: string; sufixo: string; label: string }[] =
    row ? JSON.parse(row.en) : enJson.impacto.items
  return ptItems.map((item, i) => ({
    numero:  item.numero,
    sufixo:  item.sufixo,
    labelPt: item.label,
    labelEn: enItems[i]?.label ?? '',
  }))
}

function rowsToCardItems(rows: Row[]): CardItem[] {
  const row = rows.find(r => r.chave === 'perfil.cardItems')
  const ptItems: { icon: string; label: string; value: string }[] =
    row ? JSON.parse(row.pt) : ptJson.perfil.cardItems
  const enItems: { icon: string; label: string; value: string }[] =
    row ? JSON.parse(row.en) : enJson.perfil.cardItems
  return ptItems.map((item, i) => ({
    icon:    item.icon,
    labelPt: item.label,
    labelEn: enItems[i]?.label ?? '',
    valuePt: item.value,
    valueEn: enItems[i]?.value ?? '',
  }))
}

function rowsToLinks(rows: Row[]): ProfileLink[] {
  const row = rows.find(r => r.chave === 'perfil.links')
  const items: { icon: string; label: string; url: string }[] =
    row ? JSON.parse(row.pt) : ptJson.perfil.links
  return items.map(item => ({ icon: item.icon, label: item.label, url: item.url }))
}

function rowsToTimeline(rows: Row[]): TimelineItem[] {
  const row = rows.find(r => r.chave === 'perfil.timeline')
  const ptItems: { emoji: string; year: string; text: string }[] =
    row ? JSON.parse(row.pt) : ptJson.perfil.timeline
  const enItems: { emoji: string; year: string; text: string }[] =
    row ? JSON.parse(row.en) : enJson.perfil.timeline
  return ptItems.map((item, i) => ({
    emoji:  item.emoji,
    year:   item.year,
    textPt: item.text,
    textEn: enItems[i]?.text ?? '',
  }))
}

function rowsToCitacoes(rows: Row[]): Citacao[] {
  const row = rows.find(r => r.chave === 'opinioes.citacoes')
  const ptItems: { texto: string; fonte: string }[] =
    row ? JSON.parse(row.pt) : ptJson.opinioes.citacoes
  const enItems: { texto: string; fonte: string }[] =
    row ? JSON.parse(row.en) : enJson.opinioes.citacoes
  return ptItems.map((item, i) => ({
    textoPt: item.texto,
    fontePt: item.fonte,
    textoEn: enItems[i]?.texto ?? '',
    fonteEn: enItems[i]?.fonte ?? '',
  }))
}

async function salvar(rows: Row[]): Promise<boolean> {
  const res = await fetch('/api/textos', {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify(rows),
  })
  return res.ok
}

export default function TextosAdmin() {
  const [campos, setCampos] = useState<Record<string, { pt: string; en: string }>>(DEFAULTS)
  const [impacto, setImpacto] = useState<ImpactoItem[]>(rowsToImpacto([]))
  const [citacoes, setCitacoes] = useState<Citacao[]>(rowsToCitacoes([]))
  const [cardItems, setCardItems] = useState<CardItem[]>(rowsToCardItems([]))
  const [profileLinks, setProfileLinks] = useState<ProfileLink[]>(rowsToLinks([]))
  const [timeline, setTimeline] = useState<TimelineItem[]>(rowsToTimeline([]))
  const [salvando, setSalvando] = useState<string | null>(null)
  const [toast, setToast] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/textos')
      .then(r => r.json())
      .then((rows: Row[]) => {
        setCampos(prev => {
          const next = { ...prev }
          for (const row of rows) {
            if (row.chave in next) next[row.chave] = { pt: row.pt, en: row.en }
          }
          return next
        })
        setImpacto(rowsToImpacto(rows))
        setCitacoes(rowsToCitacoes(rows))
        setCardItems(rowsToCardItems(rows))
        setProfileLinks(rowsToLinks(rows))
        setTimeline(rowsToTimeline(rows))
      })
      .catch(() => {})
  }, [])

  function showToast(msg: string) {
    setToast(msg)
    setTimeout(() => setToast(null), 3000)
  }

  async function salvarSecao(chaves: string[]) {
    setSalvando(chaves[0])
    const rows = chaves.map(c => ({ chave: c, ...campos[c] }))
    const ok = await salvar(rows)
    setSalvando(null)
    showToast(ok ? '✅ Salvo com sucesso!' : '❌ Erro ao salvar.')
  }

  async function salvarImpacto() {
    setSalvando('impacto')
    const pt = JSON.stringify(impacto.map(i => ({ numero: i.numero, sufixo: i.sufixo, label: i.labelPt })))
    const en = JSON.stringify(impacto.map(i => ({ numero: i.numero, sufixo: i.sufixo, label: i.labelEn })))
    const ok = await salvar([{ chave: 'impacto.items', pt, en }])
    setSalvando(null)
    showToast(ok ? '✅ Salvo com sucesso!' : '❌ Erro ao salvar.')
  }

  async function salvarCardItems() {
    setSalvando('cardItems')
    const pt = JSON.stringify(cardItems.map(i => ({ icon: i.icon, label: i.labelPt, value: i.valuePt })))
    const en = JSON.stringify(cardItems.map(i => ({ icon: i.icon, label: i.labelEn, value: i.valueEn })))
    const ok = await salvar([{ chave: 'perfil.cardItems', pt, en }])
    setSalvando(null)
    showToast(ok ? '✅ Salvo com sucesso!' : '❌ Erro ao salvar.')
  }

  async function salvarLinks() {
    setSalvando('links')
    const json = JSON.stringify(profileLinks.map(l => ({ icon: l.icon, label: l.label, url: l.url })))
    const ok = await salvar([{ chave: 'perfil.links', pt: json, en: json }])
    setSalvando(null)
    showToast(ok ? '✅ Salvo com sucesso!' : '❌ Erro ao salvar.')
  }

  async function salvarTimeline() {
    setSalvando('timeline')
    const pt = JSON.stringify(timeline.map(t => ({ emoji: t.emoji, year: t.year, text: t.textPt })))
    const en = JSON.stringify(timeline.map(t => ({ emoji: t.emoji, year: t.year, text: t.textEn })))
    const ok = await salvar([{ chave: 'perfil.timeline', pt, en }])
    setSalvando(null)
    showToast(ok ? '✅ Salvo com sucesso!' : '❌ Erro ao salvar.')
  }

  async function salvarCitacoes() {
    setSalvando('citacoes')
    const pt = JSON.stringify(citacoes.map(c => ({ texto: c.textoPt, fonte: c.fontePt })))
    const en = JSON.stringify(citacoes.map(c => ({ texto: c.textoEn, fonte: c.fonteEn })))
    const ok = await salvar([{ chave: 'opinioes.citacoes', pt, en }])
    setSalvando(null)
    showToast(ok ? '✅ Salvo com sucesso!' : '❌ Erro ao salvar.')
  }

  function setCampo(chave: string, lang: 'pt' | 'en', val: string) {
    setCampos(prev => ({ ...prev, [chave]: { ...prev[chave], [lang]: val } }))
  }

  function setImpactoItem(idx: number, field: keyof ImpactoItem, val: string) {
    setImpacto(prev => prev.map((item, i) => i === idx ? { ...item, [field]: val } : item))
  }

  function setCitacao(idx: number, field: keyof Citacao, val: string) {
    setCitacoes(prev => prev.map((c, i) => i === idx ? { ...c, [field]: val } : c))
  }

  const isSaving = (key: string) => salvando === key

  return (
    <div className={styles.page}>
      <div className={styles.cabecalho}>
        <div>
          <h1 className={styles.titulo}>Textos do site</h1>
          <p className={styles.sub}>Edite os textos principais — as alterações entram no ar em até 60 segundos</p>
        </div>
      </div>

      <div className={styles.secoes}>

        {/* Hero */}
        <Secao titulo="🌿 Hero" onSalvar={() => salvarSecao(['hero.eyebrow', 'hero.desc'])} salvando={isSaving('hero.eyebrow')}>
          <CampoBilingual
            label="Tag de abertura"
            pt={campos['hero.eyebrow'].pt} en={campos['hero.eyebrow'].en}
            onChange={(lang, val) => setCampo('hero.eyebrow', lang, val)}
          />
          <CampoBilingual
            label="Descrição"
            textarea rows={4}
            pt={campos['hero.desc'].pt} en={campos['hero.desc'].en}
            onChange={(lang, val) => setCampo('hero.desc', lang, val)}
          />
        </Secao>

        {/* Perfil */}
        <Secao titulo="👤 Perfil" onSalvar={() => salvarSecao(['perfil.lead','perfil.bio1','perfil.bio2','perfil.bio3'])} salvando={isSaving('perfil.lead')}>
          <CampoBilingual
            label="Lead"
            textarea rows={3}
            pt={campos['perfil.lead'].pt} en={campos['perfil.lead'].en}
            onChange={(lang, val) => setCampo('perfil.lead', lang, val)}
          />
          <CampoBilingual
            label="Bio — parágrafo 1"
            textarea rows={5}
            pt={campos['perfil.bio1'].pt} en={campos['perfil.bio1'].en}
            onChange={(lang, val) => setCampo('perfil.bio1', lang, val)}
          />
          <CampoBilingual
            label="Bio — parágrafo 2"
            textarea rows={5}
            pt={campos['perfil.bio2'].pt} en={campos['perfil.bio2'].en}
            onChange={(lang, val) => setCampo('perfil.bio2', lang, val)}
          />
          <CampoBilingual
            label="Bio — parágrafo 3"
            textarea rows={4}
            pt={campos['perfil.bio3'].pt} en={campos['perfil.bio3'].en}
            onChange={(lang, val) => setCampo('perfil.bio3', lang, val)}
          />
        </Secao>

        {/* Impacto */}
        {/* Dados de impacto */}
        <Secao titulo="📊 Dados de impacto" onSalvar={salvarImpacto} salvando={isSaving('impacto')}>
          <div className={styles.tabela}>
            <div className={`${styles.tabelaRow} ${styles.tabelaHeader} ${styles.tabelaImpacto}`}>
              <span>Nº</span><span>Sufixo</span><span>Label PT</span><span>Label EN</span>
            </div>
            {impacto.map((item, idx) => (
              <div key={idx} className={`${styles.tabelaRow} ${styles.tabelaImpacto}`}>
                <input className={styles.input} value={item.numero}
                  onChange={e => setImpactoItem(idx, 'numero', e.target.value)} />
                <input className={styles.input} value={item.sufixo}
                  onChange={e => setImpactoItem(idx, 'sufixo', e.target.value)} />
                <input className={styles.input} value={item.labelPt}
                  onChange={e => setImpactoItem(idx, 'labelPt', e.target.value)} />
                <input className={styles.input} value={item.labelEn}
                  onChange={e => setImpactoItem(idx, 'labelEn', e.target.value)} />
              </div>
            ))}
          </div>
        </Secao>

        {/* Card do perfil */}
        <Secao titulo="🪪 Card do perfil" onSalvar={salvarCardItems} salvando={isSaving('cardItems')}>
          <div className={styles.tabela}>
            <div className={`${styles.tabelaRow} ${styles.tabelaHeader} ${styles.tabelaCard}`}>
              <span>Ícone</span><span>Label PT</span><span>Valor PT</span><span>Label EN</span><span>Valor EN</span><span />
            </div>
            {cardItems.map((item, idx) => (
              <div key={idx} className={`${styles.tabelaRow} ${styles.tabelaCard}`}>
                <input className={`${styles.input} ${styles.inputIcon}`} value={item.icon}
                  onChange={e => setCardItems(prev => prev.map((c, i) => i === idx ? { ...c, icon: e.target.value } : c))} />
                <input className={styles.input} placeholder="Label" value={item.labelPt}
                  onChange={e => setCardItems(prev => prev.map((c, i) => i === idx ? { ...c, labelPt: e.target.value } : c))} />
                <input className={styles.input} placeholder="Valor" value={item.valuePt}
                  onChange={e => setCardItems(prev => prev.map((c, i) => i === idx ? { ...c, valuePt: e.target.value } : c))} />
                <input className={styles.input} placeholder="Label" value={item.labelEn}
                  onChange={e => setCardItems(prev => prev.map((c, i) => i === idx ? { ...c, labelEn: e.target.value } : c))} />
                <input className={styles.input} placeholder="Value" value={item.valueEn}
                  onChange={e => setCardItems(prev => prev.map((c, i) => i === idx ? { ...c, valueEn: e.target.value } : c))} />
                <button className={styles.btnX} onClick={() => setCardItems(prev => prev.filter((_, i) => i !== idx))}>×</button>
              </div>
            ))}
          </div>
          <button className={styles.btnAdicionar} onClick={() =>
            setCardItems(prev => [...prev, { icon: '📌', labelPt: '', labelEn: '', valuePt: '', valueEn: '' }])
          }>+ Adicionar item</button>
        </Secao>

        {/* Links do card */}
        <Secao titulo="🔗 Links do card" onSalvar={salvarLinks} salvando={isSaving('links')}>
          <div className={styles.tabela}>
            <div className={`${styles.tabelaRow} ${styles.tabelaHeader} ${styles.tabelaLinks}`}>
              <span>Ícone</span><span>Label</span><span>URL</span><span />
            </div>
            {profileLinks.map((link, idx) => (
              <div key={idx} className={`${styles.tabelaRow} ${styles.tabelaLinks}`}>
                <input className={`${styles.input} ${styles.inputIcon}`} value={link.icon}
                  onChange={e => setProfileLinks(prev => prev.map((l, i) => i === idx ? { ...l, icon: e.target.value } : l))} />
                <input className={styles.input} placeholder="Label" value={link.label}
                  onChange={e => setProfileLinks(prev => prev.map((l, i) => i === idx ? { ...l, label: e.target.value } : l))} />
                <input className={styles.input} placeholder="https://…" value={link.url}
                  onChange={e => setProfileLinks(prev => prev.map((l, i) => i === idx ? { ...l, url: e.target.value } : l))} />
                <button className={styles.btnX} onClick={() => setProfileLinks(prev => prev.filter((_, i) => i !== idx))}>×</button>
              </div>
            ))}
          </div>
          <button className={styles.btnAdicionar} onClick={() =>
            setProfileLinks(prev => [...prev, { icon: '🔗', label: '', url: '' }])
          }>+ Adicionar link</button>
        </Secao>

        {/* Timeline */}
        <Secao titulo="🕒 Timeline" onSalvar={salvarTimeline} salvando={isSaving('timeline')}>
          {timeline.map((item, idx) => (
            <div key={idx} className={styles.timelineItem}>
              <div className={styles.timelineItemHeader}>
                <input className={`${styles.input} ${styles.inputIcon}`} value={item.emoji}
                  onChange={e => setTimeline(prev => prev.map((t, i) => i === idx ? { ...t, emoji: e.target.value } : t))} />
                <input className={`${styles.input} ${styles.timelineYear}`} placeholder="1981 — UFRRJ" value={item.year}
                  onChange={e => setTimeline(prev => prev.map((t, i) => i === idx ? { ...t, year: e.target.value } : t))} />
                <button className={styles.btnX} onClick={() => setTimeline(prev => prev.filter((_, i) => i !== idx))}>×</button>
              </div>
              <div className={styles.campoCols}>
                <label className={styles.label}>
                  <span className={styles.langTag}>PT</span>
                  <textarea className={`${styles.input} ${styles.textarea}`} rows={3} value={item.textPt}
                    onChange={e => setTimeline(prev => prev.map((t, i) => i === idx ? { ...t, textPt: e.target.value } : t))} />
                </label>
                <label className={styles.label}>
                  <span className={styles.langTag}>EN</span>
                  <textarea className={`${styles.input} ${styles.textarea}`} rows={3} value={item.textEn}
                    onChange={e => setTimeline(prev => prev.map((t, i) => i === idx ? { ...t, textEn: e.target.value } : t))} />
                </label>
              </div>
            </div>
          ))}
          <button className={styles.btnAdicionar} onClick={() =>
            setTimeline(prev => [...prev, { emoji: '📌', year: '', textPt: '', textEn: '' }])
          }>+ Adicionar etapa</button>
        </Secao>

        {/* Citações */}
        <Secao titulo="💬 Citações" onSalvar={salvarCitacoes} salvando={isSaving('citacoes')}>
          {citacoes.map((c, idx) => (
            <div key={idx} className={styles.citacaoItem}>
              <div className={styles.citacaoNum}>#{idx + 1}</div>
              <div className={styles.citacaoCols}>
                <div className={styles.citacaoCol}>
                  <span className={styles.langTag}>PT</span>
                  <label className={styles.label}>
                    Texto
                    <textarea className={`${styles.input} ${styles.textarea}`} rows={3}
                      value={c.textoPt} onChange={e => setCitacao(idx, 'textoPt', e.target.value)} />
                  </label>
                  <label className={styles.label}>
                    Fonte
                    <input className={styles.input} value={c.fontePt}
                      onChange={e => setCitacao(idx, 'fontePt', e.target.value)} />
                  </label>
                </div>
                <div className={styles.citacaoCol}>
                  <span className={styles.langTag}>EN</span>
                  <label className={styles.label}>
                    Text
                    <textarea className={`${styles.input} ${styles.textarea}`} rows={3}
                      value={c.textoEn} onChange={e => setCitacao(idx, 'textoEn', e.target.value)} />
                  </label>
                  <label className={styles.label}>
                    Source
                    <input className={styles.input} value={c.fonteEn}
                      onChange={e => setCitacao(idx, 'fonteEn', e.target.value)} />
                  </label>
                </div>
              </div>
            </div>
          ))}
        </Secao>

      </div>

      {toast && <div className={styles.toast}>{toast}</div>}
    </div>
  )
}

/* ── Sub-componentes ── */

function Secao({ titulo, onSalvar, salvando, children }: {
  titulo: string
  onSalvar: () => void
  salvando: boolean
  children: React.ReactNode
}) {
  return (
    <div className={styles.secao}>
      <div className={styles.secaoHeader}>
        <h2 className={styles.secaoTitulo}>{titulo}</h2>
        <button className={styles.btnSalvar} onClick={onSalvar} disabled={salvando}>
          {salvando ? 'Salvando…' : 'Salvar seção'}
        </button>
      </div>
      <div className={styles.campos}>{children}</div>
    </div>
  )
}

function CampoBilingual({ label, pt, en, onChange, textarea, rows }: {
  label: string
  pt: string
  en: string
  onChange: (lang: 'pt' | 'en', val: string) => void
  textarea?: boolean
  rows?: number
}) {
  return (
    <div className={styles.campoBilingual}>
      <span className={styles.campoLabel}>{label}</span>
      <div className={styles.campoCols}>
        <label className={styles.label}>
          <span className={styles.langTag}>PT</span>
          {textarea
            ? <textarea className={`${styles.input} ${styles.textarea}`} rows={rows ?? 3}
                value={pt} onChange={e => onChange('pt', e.target.value)} />
            : <input className={styles.input} value={pt}
                onChange={e => onChange('pt', e.target.value)} />}
        </label>
        <label className={styles.label}>
          <span className={styles.langTag}>EN</span>
          {textarea
            ? <textarea className={`${styles.input} ${styles.textarea}`} rows={rows ?? 3}
                value={en} onChange={e => onChange('en', e.target.value)} />
            : <input className={styles.input} value={en}
                onChange={e => onChange('en', e.target.value)} />}
        </label>
      </div>
    </div>
  )
}
