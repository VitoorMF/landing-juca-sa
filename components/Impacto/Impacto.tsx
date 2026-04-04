'use client'

import { useEffect, useRef, useState } from 'react'
import { itensImpacto } from '@/data/impacto'
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

  // Parse the numeric part
  const numericStr = numero.replace(/[^0-9.]/g, '')
  const isFloat = numericStr.includes('.')
  const numericVal = parseFloat(numericStr) || 0
  // Check if it has non-numeric prefix/suffix in the number itself (e.g. "7B")
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
  return (
    <section id="impacto" className="section section-alt">
      <div className="container">
        <div className="section-header reveal">
          <div className="section-tag">Dados de Impacto</div>
          <h2 className="section-title">Números que Transformam</h2>
          <p className="section-lead">
            Resultados mensuráveis do Sistema Plantio Direto segundo as pesquisas do Prof. Juca Sá.
          </p>
        </div>
        <div className={styles.impactGrid}>
          {itensImpacto.map((item) => (
            <ImpactCard key={item.id} numero={item.numero} sufixo={item.sufixo} label={item.label} />
          ))}
        </div>
      </div>
    </section>
  )
}
