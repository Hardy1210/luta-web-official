'use client';

import gsap from '@/lib/gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Image from 'next/image';
import { useLayoutEffect, useRef } from 'react';
import styles from './VinylScroll.module.scss';

interface CardData {
  id: number;
  albumTitle: string;
  artist: string;
  year: string;
  genre: string;
  imageSrc: string;
  imageAlt: string;
  spotifyTrackId: string;
  spotifyTrackTitle: string;
}

const CARDS: CardData[] = [
  {
    id: 1,
    albumTitle: 'Kind of Blue',
    artist: 'Miles Davis',
    year: '1959',
    genre: 'Modal Jazz',
    imageSrc: '/images/vinyl/v1.webp',
    imageAlt: 'Portada del álbum Kind of Blue de Miles Davis',
    spotifyTrackId: '6XuDnTULzjbbbGHgxXS4dD',
    spotifyTrackTitle: 'So What – Miles Davis',
  },
  {
    id: 2,
    albumTitle: 'Blue Train',
    artist: 'John Coltrane',
    year: '1958',
    genre: 'Hard Bop',
    imageSrc: '/images/vinyl/v2.webp',
    imageAlt: 'Portada del álbum Blue Train de John Coltrane',
    spotifyTrackId: '2dXlZsGlpvzQpJp12o9gaE',
    spotifyTrackTitle: 'Blue Train – John Coltrane',
  },
  {
    id: 3,
    albumTitle: "Moanin'",
    artist: 'Art Blakey',
    year: '1958',
    genre: 'Hard Bop',
    imageSrc: '/images/vinyl/v3.webp',
    imageAlt: "Portada del álbum Moanin' de Art Blakey",
    spotifyTrackId: '5tDemIejMRJJSoX6yTMhQw',
    spotifyTrackTitle: "Moanin' – Art Blakey",
  },
  {
    id: 4,
    albumTitle: 'Time Out',
    artist: 'Dave Brubeck Quartet',
    year: '1959',
    genre: 'Cool Jazz',
    imageSrc: '/images/vinyl/v4.webp',
    imageAlt: 'Portada del álbum Time Out de Dave Brubeck Quartet',
    spotifyTrackId: '4KQIScQE4h0NliE0l2b2QV',
    spotifyTrackTitle: 'Take Five – Dave Brubeck',
  },
  {
    id: 5,
    albumTitle: 'Mingus Ah Um',
    artist: 'Charles Mingus',
    year: '1959',
    genre: 'Post-Bop',
    imageSrc: '/images/vinyl/v5.webp',
    imageAlt: 'Portada del álbum Mingus Ah Um de Charles Mingus',
    spotifyTrackId: '6tjF22SjD2M73DsKHQevw8',
    spotifyTrackTitle: 'Goodbye Pork Pie Hat – Charles Mingus',
  },
];

// ── Rotations ────────────────────────────────────────────────────
// Valeurs fixes par card (pas de Math.random → stable SSR,
// cohérent si l'utilisateur scroll en arrière).
//
// ENTRY : inclinaison au départ, depuis hors-champ
// REST  : inclinaison finale au repos — chaque vinyle
//         reste posé différemment pour simuler le désordre naturel
//
const ENTRY_ROTATIONS = [-59, 26, -45, 38, -46] as const;
const REST_ROTATIONS = [2, -3, 1, -2, 3] as const;

function spotifyEmbedUrl(trackId: string): string {
  return `https://open.spotify.com/embed/track/${trackId}?utm_source=generator`;
}

export default function VinylScroll() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLElement | null)[]>(
    Array(CARDS.length).fill(null),
  );
  const boxRefs = useRef<(HTMLElement | null)[]>(
    Array(CARDS.length).fill(null),
  );

  useLayoutEffect(() => {
    const wrapper = wrapperRef.current;
    const stage = stageRef.current;
    if (!wrapper || !stage) return;

    const cards = cardRefs.current.filter(Boolean) as HTMLElement[];
    const boxes = boxRefs.current.filter(Boolean) as HTMLElement[];
    if (cards.length !== CARDS.length || boxes.length !== CARDS.length) return;

    const dots = Array.from(
      stage.querySelectorAll<HTMLElement>(`.${styles.progressDot}`),
    );

    function syncActiveIndex(index: number) {
      const clamped = Math.max(0, Math.min(CARDS.length - 1, index));
      dots.forEach((dot, i) =>
        dot.setAttribute('data-active', String(i === clamped)),
      );
      cards.forEach((card, i) =>
        card.setAttribute('aria-hidden', String(i !== clamped)),
      );
    }

    // ── État initial ─────────────────────────────────────────────
    // Chaque card démarre hors viewport avec sa propre inclinaison
    const cardHeight = cards[0]?.offsetHeight ?? 0;
    const offscreenY = window.innerHeight + cardHeight + 40;

    cards.forEach((card, i) => {
      gsap.set(card, {
        y: offscreenY,
        rotation: ENTRY_ROTATIONS[i], // inclinaison unique à l'entrée
        transformOrigin: 'center center',
        opacity: 1,
        willChange: 'transform',
      });
    });
    gsap.set(boxes, { opacity: 0, willChange: 'opacity' });
    syncActiveIndex(0);

    // ── Timeline ─────────────────────────────────────────────────
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: wrapper,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1.4,
        pin: stage,
        pinSpacing: false,
        anticipatePin: 1,
        onUpdate(self) {
          syncActiveIndex(Math.floor(self.progress * CARDS.length));
        },
      },
    });

    cards.forEach((card, i) => {
      const box = boxes[i];

      tl
        // 1. Glisse depuis hors-champ → se pose avec sa rotation finale
        //    power4.out = fort frein à l'arrivée
        .to(card, {
          y: 0,
          rotation: REST_ROTATIONS[i], // angle de repos unique par vinyle
          duration: 2.0,
          ease: 'power4.out',
        })

        // 2. BoxMusic apparaît à 70% de l'entrée
        .to(
          box,
          {
            opacity: 1,
            duration: 0.5,
            ease: 'power2.out',
          },
          '<0.7',
        )

        // 3. Pause — vinyle posé, visible
        .to({}, { duration: 2.0 })

        // 4. BoxMusic disparaît — le suivant va arriver
        .to(box, {
          opacity: 0,
          duration: 0.4,
          ease: 'power1.inOut',
        });

      // Pas de sortie — le vinyle reste posé, le suivant se pose dessus
    });

    // ── prefers-reduced-motion ───────────────────────────────────
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      tl.getChildren().forEach((child) => {
        if ('vars' in child) {
          const vars = (child as gsap.core.Tween).vars;
          if (vars.y !== undefined) vars.y = 0;
          if (vars.rotation !== undefined) vars.rotation = 0;
        }
      });
    }

    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
      ScrollTrigger.refresh();
    };
  }, []);

  return (
    <div
      ref={wrapperRef}
      className={styles.wrapper}
      aria-roledescription="carrousel"
      aria-label="Portadas de vinilo"
    >
      <div ref={stageRef} className={styles.stage}>
        <div
          className={styles.cardsCol}
          aria-live="polite"
          aria-atomic="false"
          aria-relevant="additions"
        >
          {CARDS.map((card, i) => (
            <article
              key={card.id}
              ref={(el) => {
                cardRefs.current[i] = el;
              }}
              className={styles.card}
              aria-label={`${i + 1} de ${CARDS.length} : ${card.albumTitle}, ${card.artist}`}
              aria-hidden={i !== 0}
            >
              <div className={styles.cardCover}>
                <Image
                  src={card.imageSrc}
                  alt={card.imageAlt}
                  fill
                  sizes="(max-width: 768px) 80vw, 40vw"
                  priority={i === 0}
                  draggable={false}
                  className={styles.cardImage}
                />
                <span className={styles.cardVinylSheen} aria-hidden="true" />
              </div>
            </article>
          ))}
        </div>

        <aside className={styles.boxesCol} aria-label="Lecteurs Spotify">
          {CARDS.map((card, i) => (
            <div
              key={card.id}
              ref={(el) => {
                boxRefs.current[i] = el;
              }}
              className={styles.boxMusic}
              aria-label={`Écouter : ${card.spotifyTrackTitle}`}
            >
              <p className={styles.boxLabel} aria-hidden="true">
                Écouter maintenant
              </p>
              <iframe
                title={card.spotifyTrackTitle}
                src={spotifyEmbedUrl(card.spotifyTrackId)}
                width="100%"
                height="80"
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
                referrerPolicy="no-referrer"
                className={styles.boxIframe}
              />
              <p className={styles.boxTrack}>{card.spotifyTrackTitle}</p>
            </div>
          ))}
        </aside>

        <nav
          className={styles.progressNav}
          aria-label="Progression du carrousel"
        >
          <ol className={styles.progressList}>
            {CARDS.map((card, i) => (
              <li key={card.id} className={styles.progressItem}>
                <span
                  className={styles.progressDot}
                  aria-label={`${card.albumTitle} – ${card.artist}`}
                  data-index={i}
                />
              </li>
            ))}
          </ol>
        </nav>
      </div>
    </div>
  );
}
