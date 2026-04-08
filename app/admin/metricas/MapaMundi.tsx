'use client'

import { ComposableMap, Geographies, Geography, ZoomableGroup } from 'react-simple-maps'
import { useState, useRef, useEffect } from 'react'
import styles from './MapaMundi.module.css'

// ISO alpha-2 → nome legível
const alpha2ToNome: Record<string, string> = {
  AF:'Afeganistão',AL:'Albânia',DZ:'Argélia',AO:'Angola',AR:'Argentina',
  AU:'Austrália',AT:'Áustria',AZ:'Azerbaijão',BD:'Bangladesh',BE:'Bélgica',
  BJ:'Benin',BO:'Bolívia',BA:'Bósnia',BW:'Botsuana',BR:'Brasil',
  BG:'Bulgária',BF:'Burkina Faso',BI:'Burundi',KH:'Camboja',CM:'Camarões',
  CA:'Canadá',CF:'Rep. Centro-Africana',TD:'Chade',CL:'Chile',CN:'China',
  CO:'Colômbia',CG:'Congo',CD:'Congo (RDC)',CR:'Costa Rica',HR:'Croácia',
  CU:'Cuba',CY:'Chipre',CZ:'Tchéquia',DK:'Dinamarca',DO:'Rep. Dominicana',
  EC:'Equador',EG:'Egito',SV:'El Salvador',ER:'Eritreia',ET:'Etiópia',
  FI:'Finlândia',FR:'França',GA:'Gabão',DE:'Alemanha',GH:'Gana',
  GR:'Grécia',GT:'Guatemala',GN:'Guiné',GW:'Guiné-Bissau',HT:'Haiti',
  HN:'Honduras',HU:'Hungria',IN:'Índia',ID:'Indonésia',IR:'Irã',
  IQ:'Iraque',IE:'Irlanda',IL:'Israel',IT:'Itália',CI:'Costa do Marfim',
  JM:'Jamaica',JP:'Japão',JO:'Jordânia',KZ:'Cazaquistão',KE:'Quênia',
  KP:'Coreia do Norte',KR:'Coreia do Sul',XK:'Kosovo',KW:'Kuwait',
  LV:'Letônia',LB:'Líbano',LR:'Libéria',LY:'Líbia',LT:'Lituânia',
  MG:'Madagascar',MW:'Malawi',MY:'Malásia',ML:'Mali',MR:'Mauritânia',
  MX:'México',MD:'Moldávia',MA:'Marrocos',MZ:'Moçambique',MM:'Myanmar',
  NA:'Namíbia',NP:'Nepal',NL:'Países Baixos',NZ:'Nova Zelândia',
  NI:'Nicarágua',NE:'Níger',NG:'Nigéria',MK:'Macedônia do Norte',
  NO:'Noruega',OM:'Omã',PK:'Paquistão',PA:'Panamá',PG:'Papua Nova Guiné',
  PY:'Paraguai',PE:'Peru',PH:'Filipinas',PL:'Polônia',PT:'Portugal',
  PR:'Porto Rico',RO:'Romênia',RU:'Rússia',RW:'Ruanda',SA:'Arábia Saudita',
  SN:'Senegal',SL:'Serra Leoa',SO:'Somália',ZA:'África do Sul',SS:'Sudão do Sul',
  ES:'Espanha',LK:'Sri Lanka',SD:'Sudão',SR:'Suriname',SZ:'Essuatíni',
  SE:'Suécia',CH:'Suíça',SY:'Síria',TW:'Taiwan',TJ:'Tadjiquistão',
  TZ:'Tanzânia',TH:'Tailândia',TL:'Timor-Leste',TG:'Togo',TN:'Tunísia',
  TR:'Turquia',TM:'Turcomenistão',UG:'Uganda',UA:'Ucrânia',AE:'Emirados Árabes',
  GB:'Reino Unido',US:'Estados Unidos',UY:'Uruguai',UZ:'Uzbequistão',
  VE:'Venezuela',VN:'Vietnã',YE:'Iêmen',ZM:'Zâmbia',ZW:'Zimbábue',
}

// ISO alpha-2 → ISO numeric (topojson feature id)
const alpha2ToNumeric: Record<string, number> = {
  AF:4,AL:8,DZ:12,AO:24,AR:32,AU:36,AT:40,AZ:31,BD:50,BE:56,BJ:204,
  BO:68,BA:70,BW:72,BR:76,BG:100,BF:854,BI:108,KH:116,CM:120,CA:124,
  CF:140,TD:148,CL:152,CN:156,CO:170,CG:178,CD:180,CR:188,HR:191,
  CU:192,CY:196,CZ:203,DK:208,DO:214,EC:218,EG:818,SV:222,ER:232,
  ET:231,FI:246,FR:250,GA:266,DE:276,GH:288,GR:300,GT:320,GN:324,
  GW:624,HT:332,HN:340,HU:348,IN:356,ID:360,IR:364,IQ:368,IE:372,
  IL:376,IT:380,CI:384,JM:388,JP:392,JO:400,KZ:398,KE:404,KP:408,
  KR:410,XK:383,KW:414,LV:428,LB:422,LR:430,LY:434,LT:440,MG:450,
  MW:454,MY:458,ML:466,MR:478,MX:484,MD:498,MA:504,MZ:508,MM:104,
  NA:516,NP:524,NL:528,NZ:554,NI:558,NE:562,NG:566,MK:807,NO:578,
  OM:512,PK:586,PA:591,PG:598,PY:600,PE:604,PH:608,PL:616,PT:620,
  PR:630,RO:642,RU:643,RW:646,SA:682,SN:686,SL:694,SO:706,ZA:710,
  SS:728,ES:724,LK:144,SD:729,SR:740,SZ:748,SE:752,CH:756,SY:760,
  TW:158,TJ:762,TZ:834,TH:764,TL:626,TG:768,TN:788,TR:792,TM:795,
  UG:800,UA:804,AE:784,GB:826,US:840,UY:858,UZ:860,VE:862,VN:704,
  YE:887,ZM:894,ZW:716,
}

const GEO_URL = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json'

interface Props {
  paises: { nome: string; visitas: number }[]
}

// lookup reverso: numeric → alpha-2
const numericToAlpha2: Record<number, string> = Object.fromEntries(
  Object.entries(alpha2ToNumeric).map(([a2, num]) => [num, a2])
)

export default function MapaMundi({ paises }: Props) {
  const [tooltip, setTooltip] = useState<{ nome: string; visitas: number; x: number; y: number } | null>(null)
  const wrapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = wrapRef.current
    if (!el) return
    const bloquear = (e: WheelEvent) => e.preventDefault()
    el.addEventListener('wheel', bloquear, { passive: false })
    return () => el.removeEventListener('wheel', bloquear)
  }, [])

  // monta lookup: numeric id → { nome, visitas }
  const visitasPorId: Record<number, { nome: string; visitas: number }> = {}
  const maxVisitas = paises[0]?.visitas ?? 1

  for (const p of paises) {
    const id = alpha2ToNumeric[p.nome]
    if (id) visitasPorId[id] = p
  }

  const corPais = (id: number) => {
    const d = visitasPorId[id]
    if (!d) return '#dde3ea'
    const intensity = 0.25 + (d.visitas / maxVisitas) * 0.75
    return `rgba(0, 168, 150, ${intensity})`
  }

  return (
    <div className={styles.wrap} ref={wrapRef}>
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{ scale: 130, center: [10, 20] }}
        style={{ width: '100%', height: '100%' }}
      >
        <ZoomableGroup zoom={1} minZoom={0.8} maxZoom={8}>
          <Geographies geography={GEO_URL}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const id = Number(geo.id)
                const dado = visitasPorId[id]
                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill={corPais(id)}
                    stroke="#b8c4ce"
                    strokeWidth={0.4}
                    style={{
                      default: { outline: 'none' },
                      hover:   { outline: 'none', fill: dado ? 'rgba(0,168,150,1)' : '#c8d2da', cursor: 'pointer' },
                      pressed: { outline: 'none' },
                    }}
                    onMouseEnter={(e) => {
                      const alpha2 = numericToAlpha2[id]
                      const nome = alpha2 ? (alpha2ToNome[alpha2] ?? alpha2) : String(id)
                      setTooltip({ nome, visitas: dado?.visitas ?? 0, x: e.clientX, y: e.clientY })
                    }}
                    onMouseMove={(e) => {
                      setTooltip(t => t ? { ...t, x: e.clientX, y: e.clientY } : null)
                    }}
                    onMouseLeave={() => setTooltip(null)}
                  />
                )
              })
            }
          </Geographies>
        </ZoomableGroup>
      </ComposableMap>

      {tooltip && (
        <div
          className={styles.tooltip}
          style={{ left: tooltip.x + 14, top: tooltip.y - 36 }}
        >
          <strong>{tooltip.nome}</strong> · {tooltip.visitas.toLocaleString('pt-BR')} visita{tooltip.visitas !== 1 ? 's' : ''}
        </div>
      )}
    </div>
  )
}
