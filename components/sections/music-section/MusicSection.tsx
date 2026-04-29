'use client'
import { useIsomorphicLayoutEffect } from '@/hooks/useIsomorphicLayoutEffect'
import { gsap } from 'gsap'
import Image from 'next/image'
import { useRef } from 'react'
import styles from './MusicSection.module.scss'

// Placeholder songs — replace with real data
const SONGS = [
  { title: 'Larme en Plein Coeur', duration: '3:42' },
  { title: 'Être Authentique',      duration: '4:05' },
  { title: 'Le Morvan',             duration: '3:28' },
  { title: 'Refuge',                duration: '3:55' },
  { title: 'Douceur',               duration: '4:12' },
  { title: 'Liens Simples',         duration: '3:33' },
  { title: 'Sincérité',             duration: '4:20' },
  { title: 'Lumière',               duration: '3:47' },
]

export default function MusicSection() {
  const sectionRef = useRef<HTMLElement>(null)

  useIsomorphicLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia()

      mm.add('(min-width: 768px)', () => {
        // Photos stagger in from different directions
        const photos = gsap.utils.toArray<HTMLElement>(`.${styles.photo}`)
        photos.forEach((photo, i) => {
          const from = i === 0 ? { x: -60, opacity: 0 }
                     : i === 1 ? { y:  80, opacity: 0 }
                     :           { x:  60, opacity: 0 }

          gsap.from(photo, {
            ...from,
            duration: 1.1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: photo,
              start: 'top 85%',
            },
          })
        })

        // Player card fade in
        gsap.from(`.${styles.playerCard}`, {
          y: 40, opacity: 0, duration: 1, ease: 'power2.out',
          scrollTrigger: {
            trigger: `.${styles.playerCard}`,
            start: 'top 80%',
          },
        })

        // Section heading
        gsap.from(`.${styles.heading}`, {
          y: 40, opacity: 0, duration: 1, ease: 'power3.out',
          scrollTrigger: {
            trigger: `.${styles.heading}`,
            start: 'top 80%',
          },
        })
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} id="musique" className={styles.music}>
      <div className={styles.inner}>

        {/* ── Section header ── */}
        <div className={styles.header}>
          <p className={styles.overline}>— MUSIQUE</p>
          <h2 className={styles.heading}>
            LARME EN<br /><em>PLEIN COEUR</em>
          </h2>
        </div>

        {/* ── Desktop: 3-photo grid ── */}
        <div className={styles.photoGrid}>
          <div className={`${styles.photo} ${styles.photoA}`}>
            <Image src="/images/music-1.jpg" alt="Luta musique" fill sizes="30vw" className={styles.img} />
          </div>
          <div className={`${styles.photo} ${styles.photoB}`}>
            <Image src="/images/music-2.jpg" alt="Luta musique" fill sizes="30vw" className={styles.img} />
          </div>
          <div className={`${styles.photo} ${styles.photoC}`}>
            <Image src="/images/music-3.jpg" alt="Luta musique" fill sizes="30vw" className={styles.img} />
          </div>
        </div>

        {/* ── Spotify-style player ── */}
        <div className={styles.playerCard}>
          <div className={styles.playerHeader}>
            <div className={styles.albumThumb}>
              <Image src="/images/album-cover.jpg" alt="Album cover" fill className={styles.img} />
            </div>
            <div className={styles.albumInfo}>
              <span className={styles.albumTitle}>Larme en Plein Coeur</span>
              <span className={styles.albumArtist}>Luta</span>
              <a
                href="https://open.spotify.com"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.spotifyLink}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.371-.721.49-1.101.24-3.021-1.858-6.832-2.267-11.322-1.241-.418.1-.851-.159-.949-.577-.1-.418.16-.851.578-.949 4.911-1.121 9.122-.641 12.502 1.43.37.241.49.721.24 1.1l.052-.003zm1.44-3.3c-.301.47-.841.619-1.311.32-3.46-2.122-8.73-2.74-12.82-1.5-.48.15-1-.12-1.15-.6-.15-.481.12-1 .6-1.151 4.671-1.42 10.471-.721 14.461 1.71.47.301.62.841.32 1.311l-.1.01zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.23-.181-1.38-.721-.18-.601.18-1.251.72-1.401 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
                </svg>
                Écouter sur Spotify
              </a>
            </div>
          </div>

          <ul className={styles.songList}>
            {SONGS.map((song, i) => (
              <li key={i} className={styles.songRow}>
                <span className={styles.songNum}>{String(i + 1).padStart(2, '0')}</span>
                <span className={styles.songTitle}>{song.title}</span>
                <span className={styles.songDur}>{song.duration}</span>
                <button className={styles.playBtn} aria-label={`Écouter ${song.title}`}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                    <polygon points="5,3 19,12 5,21" />
                  </svg>
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/*
          ── MOBILE: Embla Carousel ──────────────────────────────────────────
          On mobile, the 3 photos above are hidden (md:hidden) and replaced
          by an Embla carousel. Install: npm install embla-carousel-react
          
          Implementation:
          import useEmblaCarousel from 'embla-carousel-react'
          const [emblaRef] = useEmblaCarousel({ loop: false })
          
          <div className={styles.mobileCarousel} ref={emblaRef}>
            <div className={styles.carouselContainer}>
              {SONGS.map((song, i) => (
                <div key={i} className={styles.carouselSlide}>
                  — song card content —
                </div>
              ))}
            </div>
          </div>
          ─────────────────────────────────────────────────────────────────────
        */}

      </div>
    </section>
  )
}