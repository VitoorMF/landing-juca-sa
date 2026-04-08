import { defineRouting } from 'next-intl/routing'

export const routing = defineRouting({
  locales: ['pt', 'en'],
  defaultLocale: 'pt',
  localePrefix: 'as-needed', // / = pt, /en = en
  localeDetection: false,    // sempre inicia em pt, usuário troca manualmente
})
