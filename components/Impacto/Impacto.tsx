'use client'

import { useEffect, useRef, useState } from 'react'
import { useTranslations } from 'next-intl'
import styles from './Impacto.module.css'

function useCounterAnimation(target: number, isFloat: boolean, triggered: boolean) {
  const [value, setValue] = useState(0)

  useEffect(() => {
    if (!triggered) return
    let current = 0
    const step = target / 60
    const timer = setInterval(() => {
      current = Math.min(current + step, target)
      setValue(isFloat ? parseFloat(current.toFixed(1)) : Math.floor(current))
      if (current >= target) clearInterval(timer)
    }, 20)
    return () => clearInterval(timer)
  }, [triggered, target, isFloat])

  return value
}

function ImpactCard({ numero, sufixo, label }: { numero: string; sufixo: string; label: string }) {
  const [triggered, setTriggered] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

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
      { threshold: 0.3 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const displayNum = isFloat ? animatedValue.toFixed(1) : animatedValue

  return (
    <div className={`${styles.impactCard} reveal`} ref={ref}>
      <div className={styles.impactNum}>
        {prefix}{displayNum}{innerSuffix}
        <span className={styles.impactSuffix}>{sufixo}</span>
      </div>
      <div className={styles.impactLabel}>{label}</div>
    </div>
  )
}

export default function Impacto() {
  const t = useTranslations('impacto')
  const items = t.raw('items') as Array<{ numero: string; sufixo: string; label: string }>

  return (
    <section id="impacto" className="section section-alt">
      <div className="container">
        <div className="section-header reveal">
          <div className="section-tag">{t('tag')}</div>
          <h2 className="section-title">{t('title')}</h2>
          <p className="section-lead">{t('lead')}</p>
        </div>
        <div className={styles.impactGrid}>
          {items.map((item, idx) => (
            <ImpactCard key={idx} numero={item.numero} sufixo={item.sufixo} label={item.label} />
          ))}
        </div>
      </div>
    </section>
  )
}
