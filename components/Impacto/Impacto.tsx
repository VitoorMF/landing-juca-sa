'use client'

import { useEffect, useRef, useState } from 'react'
import { useTranslations } from 'next-intl'
import styles from './Impacto.module.css'

type Item = { numero: string; sufixo: string; label: string }

function useCounterAnimation(target: number, isFloat: boolean, triggered: boolean) {
  const [value, setValue] = useState(target)

  useEffect(() => {
    if (!triggered) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setValue(target)
      return
    }
    let frame = 0
    const start = performance.now()
    const duration = 1200
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - p, 3)
      const current = target * eased
      setValue(isFloat ? parseFloat(current.toFixed(1)) : Math.round(current))
      if (p < 1) frame = requestAnimationFrame(tick)
    }
    setValue(0)
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [triggered, target, isFloat])

  return value
}

function ImpactItem({ numero, sufixo, label, index }: Item & { index: number }) {
  const [triggered, setTriggered] = useState(false)
  const ref = useRef<HTMLLIElement>(null)

  const numericStr = numero.replace(/[^0-9.]/g, '')
  const isFloat = numericStr.includes('.')
  const numericVal = parseFloat(numericStr) || 0
  const prefix = numero.replace(/[0-9.]+.*/, '')
  const innerSuffix = numero.replace(/^[^0-9.]*[0-9.]+/, '')

  const animatedValue = useCounterAnimation(numericVal, isFloat, triggered)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setTriggered(true)
          observer.disconnect()
        }
      },
      // mesmo gatilho do scroll reveal: o zero aparece enquanto o item ainda está transparente
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const displayNum = isFloat ? animatedValue.toFixed(1) : animatedValue

  return (
    <li className={`${styles.item} reveal reveal-delay-${index % 4}`} ref={ref}>
      {/* leitores de tela recebem o número final, sem a animação */}
      <span className="visually-hidden">{numero}{sufixo} {label}</span>
      <span className={styles.num} aria-hidden="true">
        {prefix}{displayNum}{innerSuffix}
        <span className={styles.suffix}>{sufixo}</span>
      </span>
      <span className={styles.label} aria-hidden="true">{label}</span>
    </li>
  )
}

export default function Impacto() {
  const t = useTranslations('impacto')
  const items = t.raw('items') as Item[]

  return (
    <section id="impacto" className="section section-alt" aria-labelledby="impacto-title">
      <div className="wrap">
        <header className={`${styles.head} reveal`}>
          <div>
            <div className="eyebrow">{t('tag')}</div>
            <h2 id="impacto-title" className={styles.title}>{t('title')}</h2>
          </div>
          <p className={styles.lead}>{t('lead')}</p>
        </header>

        <ul className={styles.grid}>
          {items.map((item, idx) => (
            <ImpactItem key={idx} index={idx} {...item} />
          ))}
        </ul>
      </div>
    </section>
  )
}
