'use client'
import { useIsomorphicLayoutEffect } from '@/hooks/useIsomorphicLayoutEffect'
import { gsap } from 'gsap'
import Image from 'next/image'
import { useRef } from 'react'
import styles from './SpotifySection.module.scss'

export default function SpotifySection() {
  const sectionRef = useRef<HTMLElement>(null)

  useIsomorphicLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia()

      mm.add('(min-width: 768px)', () => {
        gsap.from(`.${styles.mockup}`, {
          y: 50, opacity: 0, scale: 0.96,
          duration: 1.2, ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 75%',
          },
        })
        gsap.from(`.${styles.textCol}`, {
          x: -40, opacity: 0,
          duration: 1, ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 75%',
          },
        })
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className={styles.spotify}>
      <div className={styles.inner}>

        <div className={styles.textCol}>
          <p className={styles.label}>ÉCOUTER SUR</p>
          <svg className={styles.spotifyLogo} viewBox="0 0 168 50" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Spotify">
            {/* Generic Spotify wordmark placeholder — replace with real SVG */}
            <text x="0" y="40" fontFamily="var(--ff-display)" fontWeight="800" fontSize="40" fill="#1db954">SPOTIFY</text>
          </svg>
          <p className={styles.desc}>
            Toutes les compositions de Luta disponibles en streaming.
          </p>
          <a
            href="https://open.spotify.com"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.cta}
          >
            Écouter maintenant
          </a>
        </div>

        {/* Phone mockup — replace Image src with your mockup asset */}
        <div className={styles.mockup}>
          <div className={styles.phone}>
            <div className={styles.phoneScreen}>
              <Image
                src="/images/spotify-mockup.jpg"
                alt="Spotify player mockup"
                fill
                className={styles.img}
              />
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}