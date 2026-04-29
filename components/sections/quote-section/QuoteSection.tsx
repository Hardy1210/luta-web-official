'use client'
import { useIsomorphicLayoutEffect } from '@/hooks/useIsomorphicLayoutEffect'
import { gsap } from 'gsap'
import { useRef } from 'react'
import styles from './QuoteSection.module.scss'

const QUOTE_LINES = [
  'DES MOTS, DES NOTES, DES ÉMOTIONS.',
  'J\'ÉCRIS ET JE COMPOSE AU FIL DE CE QUE JE RESSENS.',
  'LA MUSIQUE EST MON REFUGE.',
]

export default function QuoteSection() {
  const sectionRef = useRef<HTMLElement>(null)

  useIsomorphicLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia()

      mm.add('(min-width: 768px)', () => {
        // Each line reveals from below with clip-path
        gsap.from(`.${styles.line}`, {
          y: 60,
          opacity: 0,
          duration: 1,
          ease: 'power3.out',
          stagger: 0.2,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
          },
        })

        // Accent line
        gsap.from(`.${styles.accent}`, {
          scaleX: 0,
          duration: 1.2,
          ease: 'power3.inOut',
          transformOrigin: 'left center',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
          },
        })
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className={styles.quote}>
      <div className={styles.accent} aria-hidden="true" />
      <blockquote className={styles.blockquote}>
        {QUOTE_LINES.map((line, i) => (
          <p key={i} className={styles.line}>
            {line}
          </p>
        ))}
      </blockquote>
    </section>
  )
}