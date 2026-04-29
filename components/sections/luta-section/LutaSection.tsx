'use client'
import { useIsomorphicLayoutEffect } from '@/hooks/useIsomorphicLayoutEffect'
import { gsap } from 'gsap'
import Image from 'next/image'
import { useRef } from 'react'
import styles from './LutaSection.module.scss'

export default function LutaSection() {
  const sectionRef = useRef<HTMLElement>(null)

  useIsomorphicLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia()

      mm.add('(min-width: 768px)', () => {
        // Neon logo reveal on scroll
        gsap.from(`.${styles.neonLogo}`, {
          scale: 0.9,
          opacity: 0,
          duration: 1.4,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: `.${styles.neonLogo}`,
            start: 'top 75%',
          },
        })

        // Main artist image — parallax
        gsap.to(`.${styles.artistImage}`, {
          y: -80,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.5,
          },
        })

        // Floating images stagger in
        gsap.from(`.${styles.floatImg}`, {
          y: 80,
          opacity: 0,
          duration: 1,
          ease: 'power3.out',
          stagger: 0.18,
          scrollTrigger: {
            trigger: `.${styles.floatGrid}`,
            start: 'top 80%',
          },
        })

        // Floating images subtle parallax at different speeds
        gsap.utils.toArray<HTMLElement>(`.${styles.floatImg}`).forEach((el, i) => {
          const speed = i % 2 === 0 ? -40 : 40
          gsap.to(el, {
            y: speed,
            ease: 'none',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 1,
            },
          })
        })
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className={styles.luta}>

      {/* Neon "Luta" logo — replace with actual asset */}
      <div className={styles.neonLogo} aria-label="Luta">
        {/*
          Replace this div with:
          <Image src="/images/luta-neon.png" alt="Luta" fill ... />
          OR an SVG asset of the neon/handwritten "Luta" text
        */}
        <span className={styles.neonText}>Luta</span>
      </div>

      {/* Main large artist photo */}
      <div className={styles.artistImage}>
        <Image
          src="/images/luta-neon-photo.jpg"
          alt="Luta — scène"
          fill
          sizes="60vw"
          className={styles.artistImg}
        />
      </div>

      {/* Floating parallax images grid */}
      <div className={styles.floatGrid}>
        <div className={`${styles.floatImg} ${styles.floatImg1}`}>
          <Image src="/images/luta-float-1.jpg" alt="Luta" fill sizes="25vw" className={styles.img} />
        </div>
        <div className={`${styles.floatImg} ${styles.floatImg2}`}>
          <Image src="/images/luta-float-2.jpg" alt="Luta" fill sizes="20vw" className={styles.img} />
        </div>
        <div className={`${styles.floatImg} ${styles.floatImg3}`}>
          <Image src="/images/luta-float-3.jpg" alt="Luta" fill sizes="22vw" className={styles.img} />
        </div>
      </div>

    </section>
  )
}