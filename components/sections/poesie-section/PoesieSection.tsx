'use client'
import { useIsomorphicLayoutEffect } from '@/hooks/useIsomorphicLayoutEffect'
import { gsap } from 'gsap'
import Image from 'next/image'
import { useRef } from 'react'
import styles from './PoesieSection.module.scss'

export default function PoesieSection() {
  const sectionRef = useRef<HTMLElement>(null)

  useIsomorphicLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia()

      mm.add('(min-width: 768px)', () => {
        // Simple fade-in for images (no scroll response needed per annotation)
        gsap.from(`.${styles.imageA}, .${styles.imageB}`, {
          opacity: 0, y: 30, duration: 1.2, ease: 'power2.out', stagger: 0.2,
          scrollTrigger: {
            trigger: `.${styles.imageRow}`,
            start: 'top 80%',
          },
        })

        gsap.from(`.${styles.textBlock}`, {
          opacity: 0, y: 40, duration: 1, ease: 'power3.out',
          scrollTrigger: {
            trigger: `.${styles.textBlock}`,
            start: 'top 80%',
          },
        })

        gsap.from(`.${styles.spotifyBtn}`, {
          opacity: 0, y: 20, duration: 0.8, ease: 'power2.out',
          scrollTrigger: {
            trigger: `.${styles.spotifyBtn}`,
            start: 'top 85%',
          },
        })
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className={styles.poesie}>
      <div className={styles.inner}>

        <div className={styles.imageRow}>
          <div className={styles.imageA}>
            <Image src="/images/poesie-1.jpg" alt="Luta poésie" fill sizes="40vw" className={styles.img} />
          </div>
          <div className={styles.imageB}>
            <Image src="/images/poesie-2.jpg" alt="Luta performance" fill sizes="30vw" className={styles.img} />
          </div>
        </div>

        <div className={styles.textBlock}>
          <h2 className={styles.heading}>
            LA POÉSIE<br />
            <em>EN MUSIQUE,</em><br />
            UNE GÉNÉRATION
          </h2>
          <p className={styles.body}>
            Poétique, moderne et sincère, son univers musical invite à
            l&apos;écoute et à l&apos;émotion. Des chansons qui résonnent
            longtemps après la dernière note.
          </p>
          <a
            href="https://open.spotify.com"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.spotifyBtn}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.371-.721.49-1.101.24-3.021-1.858-6.832-2.267-11.322-1.241-.418.1-.851-.159-.949-.577-.1-.418.16-.851.578-.949 4.911-1.121 9.122-.641 12.502 1.43.37.241.49.721.24 1.1l.052-.003z" />
            </svg>
            Écouter sur Spotify
          </a>
        </div>

      </div>
    </section>
  )
}