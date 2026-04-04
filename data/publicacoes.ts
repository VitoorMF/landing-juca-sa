export type TipoPublicacao = 'article' | 'book'

export interface Publicacao {
  id: string
  ano: string
  titulo: string
  autores: string
  revista: string
  tipo: TipoPublicacao
  url?: string
}

export const publicacoes: Publicacao[] = [
  {
    id: '1',
    ano: '2025',
    titulo: 'No-till systems restore soil organic carbon stock in Brazilian biomes and contribute to the climate solution',
    autores: 'Sá, J.C.M., Lal, R., Lorenz, K., Bajgai, Y. et al.',
    revista: 'Science of the Total Environment · DOI: 10.1016/j.scitotenv.2025.179370',
    tipo: 'article',
    url: 'https://www.sciencedirect.com/science/article/abs/pii/S004896972501006X',
  },
  {
    id: '2',
    ano: '2024',
    titulo: 'Soil Organic Carbon Restoration as the Key Driver to Promote Soil Health in No-till Systems of the Tropics',
    autores: 'Moraes Sá, J.C. et al.',
    revista: 'Soil Health and Sustainable Agriculture in Brazil — ASA, CSSA, SSSA / Wiley · ISBN: 9780891187431',
    tipo: 'book',
    url: 'https://acsess.onlinelibrary.wiley.com/doi/abs/10.1002/9780891187448.ch3',
  },
  {
    id: '3',
    ano: '2013',
    titulo: 'Soil-specific inventories of landscape carbon and nitrogen stocks under no-till and native vegetation to estimate carbon offset in a subtropical ecosystem',
    autores: 'Sá, J.C.M. et al.',
    revista: 'Soil Science Society of America Journal · Vol. 77: 2094–2110',
    tipo: 'article',
  },
  {
    id: '4',
    ano: '2006',
    titulo: 'Carbon sequestration rates in no-tillage soils under intensive cropping systems in tropical agroecozones',
    autores: 'Sá, J.C.M. et al.',
    revista: 'Edafologia · Vol. 13: 139–150',
    tipo: 'article',
  },
  {
    id: '5',
    ano: '2002',
    titulo: 'Soil organic matter, biota and aggregation in temperate and tropical soils — Effects of no-tillage',
    autores: 'Sá, J.C.M., Six, J., Feller, C. et al.',
    revista: 'Agronomie · Vol. 22(7–8): 755–775 · HAL-00885974',
    tipo: 'article',
    url: 'https://hal.science/hal-00885974/',
  },
  {
    id: '6',
    ano: '2001',
    titulo: 'Organic Matter Dynamics and Carbon Sequestration Rates for a Tillage Chronosequence in a Brazilian Oxisol',
    autores: 'Sá, J.C.M. et al.',
    revista: 'Soil Science Society of America Journal · Vol. 65(5) — Artigo de referência do doutorado',
    tipo: 'article',
  },
  {
    id: '7',
    ano: 'S/D',
    titulo: 'C-CO2 Emissions, Carbon Pools and Crop Productivity Increased upon Slaughterhouse Organic Residue Fertilization in a No-Till System',
    autores: 'Sá, J.C.M., Romaniw, Ferreira, Inagaki',
    revista: 'Organic Fertilizers — IntechOpen',
    tipo: 'book',
    url: 'https://www.intechopen.com/profiles/76249',
  },
]
