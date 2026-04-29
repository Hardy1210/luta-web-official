'use client'
import { useIsomorphicLayoutEffect } from '@/hooks/useIsomorphicLayoutEffect'
import { gsap } from 'gsap'
import Image from 'next/image'
import { useRef } from 'react'
import styles from './LastSongSection.module.scss'

export default function LastSongSection() {
  const sectionRef = useRef<HTMLElement>(null)

  useIsomorphicLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia()

      mm.add('(min-width: 768px)', () => {
        gsap.from(`.${styles.content}`, {
          y: 40, opacity: 0, duration: 1, ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 75%',
          },
        })
        gsap.from(`.${styles.imageGrid} > *`, {
          y: 50, opacity: 0, stagger: 0.15, duration: 1, ease: 'power2.out',
          scrollTrigger: {
            trigger: `.${styles.imageGrid}`,
            start: 'top 80%',
          },
        })
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className={styles.lastSong}>
      <div className={styles.inner}>

        <div className={styles.content}>
          <p className={styles.overline}>— MA DERNIÈRE CHANSON</p>
          <h2 className={styles.heading}>
            ÊTRE AUTHENTIQUE<br />
            <em>AVEC QUI NOUS SOMMES</em>
          </h2>
          <a
            href="https://open.spotify.com"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.listenBtn}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="5,3 19,12 5,21" />
            </svg>
            → ÉCOUTER
          </a>
        </div>

        <div className={styles.imageGrid}>
          <div className={styles.imgA}>
            <Image src="/images/last-song-1.jpg" alt="Dernière chanson" fill sizes="35vw" className={styles.img} />
          </div>
          <div className={styles.imgB}>
            <Image src="/images/last-song-2.jpg" alt="Luta studio" fill sizes="25vw" className={styles.img} />
          </div>
        </div>

      </div>
    </section>
  )
}