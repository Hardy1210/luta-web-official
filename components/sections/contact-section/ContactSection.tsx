'use client'
import { useIsomorphicLayoutEffect } from '@/hooks/useIsomorphicLayoutEffect'
import { gsap } from 'gsap'
import { useRef } from 'react'
import styles from './ContactSection.module.scss'

export default function ContactSection() {
  const sectionRef = useRef<HTMLElement>(null)

  useIsomorphicLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia()

      mm.add('(min-width: 768px)', () => {
        gsap.from(`.${styles.titleLine}`, {
          y: 70, opacity: 0, duration: 1, ease: 'power3.out', stagger: 0.15,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
          },
        })
        gsap.from(`.${styles.desc}`, {
          y: 30, opacity: 0, duration: 0.9, ease: 'power2.out',
          scrollTrigger: {
            trigger: `.${styles.desc}`,
            start: 'top 85%',
          },
        })
        gsap.from(`.${styles.cta}`, {
          y: 20, opacity: 0, scale: 0.97, duration: 0.8, ease: 'power2.out',
          scrollTrigger: {
            trigger: `.${styles.cta}`,
            start: 'top 90%',
          },
        })
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} id="contact" className={styles.contact}>
      <div className={styles.inner}>

        <h2 className={styles.title}>
          <span className={styles.titleLine}>SE DIRE.</span>
          <span className={styles.titleLine}>SE LIER.</span>
          <span className={`${styles.titleLine} ${styles.titleItalic}`}>
            SE RENCONTRER.
          </span>
        </h2>

        <p className={styles.desc}>
          Chaque message est une rencontre possible. N&apos;hésitez pas à
          me contacter pour toute collaboration ou projet. Je prends le
          temps de lire et de répondre à chaque échange.
        </p>

        <a href="mailto:contact@luta-music.com" className={styles.cta}>
          ME CONTACTER
        </a>

      </div>
    </section>
  )
}