'use client'
import { useIsomorphicLayoutEffect } from '@/hooks/useIsomorphicLayoutEffect'
import { gsap } from 'gsap'
import Image from 'next/image'
import { useRef } from 'react'
import styles from './HeroSection.module.scss'

export default function HeroSection() {
  const sectionRef  = useRef<HTMLElement>(null)
  const imageRef    = useRef<HTMLDivElement>(null)
  const titleRef    = useRef<HTMLHeadingElement>(null)

  useIsomorphicLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia()

      mm.add('(min-width: 768px)', () => {
        // ── 3D Hover on hero image ──────────────────────────────────────────
        const image = imageRef.current
        if (!image) return

        const onMove = (e: MouseEvent) => {
          const r = image.getBoundingClientRect()
          const x = e.clientX - r.left - r.width  / 2
          const y = e.clientY - r.top  - r.height / 2
          gsap.to(image, {
            rotateY:             (x / r.width)  * 18,
            rotateX:             -(y / r.height) * 12,
            transformPerspective: 900,
            ease:                'power2.out',
            duration:             0.5,
          })
        }

        const onLeave = () => {
          gsap.to(image, {
            rotateX:  0,
            rotateY:  0,
            duration: 0.9,
            ease:     'power3.out',
          })
        }

        image.addEventListener('mousemove', onMove)
        image.addEventListener('mouseleave', onLeave)

        return () => {
          image.removeEventListener('mousemove', onMove)
          image.removeEventListener('mouseleave', onLeave)
        }
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  /*
   * ── INTRO ANIMATION (à implémenter) ───────────────────────────────────────
   * Elements à animer depuis page.tsx ou un IntroController client component :
   *   data-intro="overlay"  → fade out l'overlay #intro-overlay
   *   data-intro="title"    → stagger lines from bottom (clipPath or y+opacity)
   *   data-intro="image"    → scale from 0.95 + opacity 0 → 1
   *   data-intro="sub"      → fade in subtitle text
   * Timeline suggérée:
   *   tl.to('#intro-overlay', { opacity: 0, duration: 0.8 })
   *     .from('[data-intro="title"] span', { y: 80, opacity: 0, stagger: 0.1 }, '-=0.4')
   *     .from('[data-intro="image"]',     { scale: 0.96, opacity: 0 }, '-=0.6')
   *     .from('[data-intro="sub"]',       { y: 20, opacity: 0 }, '-=0.4')
   * ──────────────────────────────────────────────────────────────────────────
   */

  return (
    <section ref={sectionRef} id="accueil" className={styles.hero}>
      <div className={styles.inner}>

        {/* ── Left column: title + sub ── */}
        <div className={styles.left}>
          <h1 ref={titleRef} className={styles.title} data-intro="title">
            <span className={styles.line}>LARME EN</span>
            <span className={styles.line}>
              PLEIN<em className={styles.italic}>COEUR</em>
            </span>
          </h1>

          <p className={styles.sub} data-intro="sub">
            Autrice, compositrice et interprète.
            <br />
            Une musique née du vécu, entre sincérité et intensité.
          </p>
        </div>

        {/* ── Right column: 3D hover image ── */}
        <div
          ref={imageRef}
          className={styles.imageWrapper}
          data-intro="image"
          style={{ transformStyle: 'preserve-3d' }}
        >
          <div className={styles.imageInner}>
            {/* Replace src with your actual image path */}
            <Image
              src="/images/hero.jpg"
              alt="Luta — portrait principal"
              fill
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
              className={styles.image}
            />
          </div>
        </div>

      </div>

      {/* Scroll hint */}
      <div className={styles.scrollHint} aria-hidden="true">
        <span>↓</span>
      </div>
    </section>
  )
}