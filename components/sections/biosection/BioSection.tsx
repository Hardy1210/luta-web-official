'use client'
import { useIsomorphicLayoutEffect } from '@/hooks/useIsomorphicLayoutEffect'
import gsap from 'gsap'
import Image from 'next/image'
import { useRef } from 'react'
import styles from './BioSection.module.scss'

export default function BioSection() {
  const sectionRef = useRef<HTMLElement>(null)

  useIsomorphicLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia()

      mm.add('(min-width: 768px)', () => {
        // Heading reveal
        gsap.from(`.${styles.heading}`, {
          y: 50, opacity: 0, duration: 1, ease: 'power3.out',
          scrollTrigger: { trigger: `.${styles.heading}`, start: 'top 80%' },
        })

        // Bio text lines stagger
        gsap.from(`.${styles.bodyText}`, {
          y: 30, opacity: 0, duration: 0.9, ease: 'power2.out',
          stagger: 0.12,
          scrollTrigger: { trigger: `.${styles.textCol}`, start: 'top 75%' },
        })

        // Image slide in from right
        gsap.from(`.${styles.imageWrapper}`, {
          x: 60, opacity: 0, duration: 1.1, ease: 'power3.out',
          scrollTrigger: { trigger: `.${styles.imageWrapper}`, start: 'top 80%' },
        })
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} id="bio" className={styles.bio}>
      <div className={styles.inner}>

        <div className={styles.textCol}>
          <p className={styles.overline}>— BIO</p>
          <h2 className={styles.heading}>
            QUI EST<br />LUTA ?
          </h2>
          <div className={styles.intro}>
            <p className={styles.introBig}>
              Une artiste simple, humble et solaire.
              Elle avance avec douceur et conviction,
              sème un peu de lumière autour d&apos;elle.
            </p>
          </div>
          <p className={styles.bodyText}>
            Autrice, compositrice et interprète, Luta trace un parcours
            musical guidé par la sincérité. Une musique née du vécu, entre
            simplicité et intensité.
          </p>
          <p className={styles.bodyText}>
            Elle grandit au cœur du Morvan, entourée par la nature, qui
            façonne très tôt sa sensibilité. La musique l&apos;accompagne
            depuis l&apos;enfance : piano, guitare, puis l&apos;écriture et le chant.
          </p>
          <p className={styles.bodyText}>
            En 2025, Luta fait le choix de se consacrer pleinement à son
            projet artistique. Ses chansons racontent le quotidien, les
            émotions simples et le besoin de partage.
          </p>
        </div>

        <div className={styles.imageWrapper}>
          <Image
            src="/images/bio.jpg"
            alt="Luta — portrait biographie"
            fill
            sizes="(max-width: 768px) 100vw, 45vw"
            className={styles.image}
          />
        </div>

      </div>
    </section>
  )
}