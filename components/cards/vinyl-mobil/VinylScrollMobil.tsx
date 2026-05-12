'use client';

/**
 * VinylScrollMobile
 * Version mobile de VinylScroll — Embla Carousel.
 * Même palette, même cards carrées, même BoxMusic Spotify.
 * Swipe horizontal natif, dots de progression synchronisés.
 */

import useEmblaCarousel from 'embla-carousel-react';
import Image from 'next/image';
import { useCallback, useEffect, useState } from 'react';
import styles from './VinylScrollMobil.module.scss';

/* ─── Types & Data (identiques au desktop) ─── */
interface CardData {
  id: number;
  albumTitle: string;
  artist: string;
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
    imageSrc: '/images/vinyl/v1.webp',
    imageAlt: 'Portada del álbum Kind of Blue de Miles Davis',
    spotifyTrackId: '6XuDnTULzjbbbGHgxXS4dD',
    spotifyTrackTitle: 'So What – Miles Davis',
  },
  {
    id: 2,
    albumTitle: 'Blue Train',
    artist: 'John Coltrane',
    imageSrc: '/images/vinyl/v2.webp',
    imageAlt: 'Portada del álbum Blue Train de John Coltrane',
    spotifyTrackId: '2dXlZsGlpvzQpJp12o9gaE',
    spotifyTrackTitle: 'Blue Train – John Coltrane',
  },
  {
    id: 3,
    albumTitle: "Moanin'",
    artist: 'Art Blakey',
    imageSrc: '/images/vinyl/v3.webp',
    imageAlt: "Portada del álbum Moanin' de Art Blakey",
    spotifyTrackId: '5tDemIejMRJJSoX6yTMhQw',
    spotifyTrackTitle: "Moanin' – Art Blakey",
  },
  {
    id: 4,
    albumTitle: 'Time Out',
    artist: 'Dave Brubeck Quartet',
    imageSrc: '/images/vinyl/v4.webp',
    imageAlt: 'Portada del álbum Time Out de Dave Brubeck Quartet',
    spotifyTrackId: '4KQIScQE4h0NliE0l2b2QV',
    spotifyTrackTitle: 'Take Five – Dave Brubeck',
  },
  {
    id: 5,
    albumTitle: 'Mingus Ah Um',
    artist: 'Charles Mingus',
    imageSrc: '/images/vinyl/v5.webp',
    imageAlt: 'Portada del álbum Mingus Ah Um de Charles Mingus',
    spotifyTrackId: '6tjF22SjD2M73DsKHQevw8',
    spotifyTrackTitle: 'Goodbye Pork Pie Hat – Charles Mingus',
  },
];

// Légères rotations au repos — même désordre naturel que le desktop
const REST_ROTATIONS = [0, 0, 0, 0, 0] as const;

function spotifyEmbedUrl(trackId: string): string {
  return `https://open.spotify.com/embed/track/${trackId}?utm_source=generator`;
}

/* ─── Composant ─── */
export default function VinylScrollMobile() {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: false,
    align: 'center',
    dragFree: false,
  });

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  /* Sync état avec Embla */
  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
    setCanPrev(emblaApi.canScrollPrev());
    setCanNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on('select', onSelect);
    onSelect(); // état initial
    return () => {
      emblaApi.off('select', onSelect);
    };
  }, [emblaApi, onSelect]);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);
  const scrollTo = useCallback(
    (i: number) => emblaApi?.scrollTo(i),
    [emblaApi],
  );

  return (
    <div
      className={styles.wrapper}
      aria-roledescription="carrousel"
      aria-label="Portadas de vinilo"
    >
      {/* Viewport Embla */}
      <div className={styles.viewport} ref={emblaRef}>
        <div className={styles.container}>
          {CARDS.map((card, i) => (
            <div
              key={card.id}
              className={styles.slide}
              role="group"
              aria-roledescription="diapositiva"
              aria-label={`${i + 1} de ${CARDS.length} : ${card.albumTitle}, ${card.artist}`}
            >
              {/* Portada carrée */}
              <article
                className={styles.card}
                style={
                  {
                    '--rest-rotation': `${REST_ROTATIONS[i]}deg`,
                  } as React.CSSProperties
                }
                aria-label={`${card.albumTitle} — ${card.artist}`}
              >
                <div className={styles.cardCover}>
                  <Image
                    src={card.imageSrc}
                    alt={card.imageAlt}
                    fill
                    sizes="(max-width: 1024px) 80vw, 40vw"
                    priority={i === 0}
                    draggable={false}
                    className={styles.cardImage}
                  />
                  <span className={styles.cardVinylSheen} aria-hidden="true" />
                </div>

                {/* BoxMusic sous la carte */}
                <div
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
                </div>
              </article>
            </div>
          ))}
        </div>
      </div>

      {/* Contrôles */}
      <div className={styles.controls} aria-label="Contrôles du carrousel">
        {/* Bouton précédent */}
        <button
          className={styles.btnNav}
          onClick={scrollPrev}
          disabled={!canPrev}
          aria-label="Vinyle précédent"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M10 3L5 8L10 13"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        {/* Dots */}
        <nav aria-label="Progression du carrousel">
          <ol className={styles.dots}>
            {CARDS.map((card, i) => (
              <li key={card.id}>
                <button
                  className={styles.dot}
                  data-active={String(i === selectedIndex)}
                  onClick={() => scrollTo(i)}
                  aria-label={`Aller à ${card.albumTitle}`}
                  aria-current={i === selectedIndex ? 'true' : undefined}
                />
              </li>
            ))}
          </ol>
        </nav>

        {/* Bouton suivant */}
        <button
          className={styles.btnNav}
          onClick={scrollNext}
          disabled={!canNext}
          aria-label="Vinyle suivant"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M6 3L11 8L6 13"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
