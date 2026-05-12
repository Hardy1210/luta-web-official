'use client';

import useEmblaCarousel from 'embla-carousel-react';
import Image from 'next/image';
import { useCallback, useEffect, useRef, useState } from 'react';
import styles from './VinylScrollMobil.module.scss';

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

const REST_ROTATIONS = [2, -3, 1, -2, 3] as const;

function spotifyEmbedUrl(id: string) {
  return `https://open.spotify.com/embed/track/${id}?utm_source=generator`;
}

export default function VinylScrollMobile() {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: false,
    align: 'start',
    dragFree: false,
    watchDrag: true,
  });

  const cardRefs = useRef<(HTMLDivElement | null)[]>(
    Array(CARDS.length).fill(null),
  );
  const boxRefs = useRef<(HTMLDivElement | null)[]>(
    Array(CARDS.length).fill(null),
  );

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  // ── Tween ─────────────────────────────────────────────────────────
  // diff >= 0 → card en la pila, inmóvil
  // diff <  0 → card salida: translateX fuera del viewport, sin opacity
  const applyTween = useCallback(() => {
    if (!emblaApi) return;
    const progress = emblaApi.scrollProgress();
    const snapList = emblaApi.scrollSnapList();

    cardRefs.current.forEach((card, i) => {
      if (!card) return;
      const diff = (snapList[i] ?? i / (CARDS.length - 1)) - progress;

      if (diff >= 0) {
        // Aún en la pila — posición de reposo
        card.style.transform = `translateX(0%) rotate(${REST_ROTATIONS[i]}deg)`;
      } else {
        // Salida hacia la izquierda fuera del viewport
        // diff va de 0 a -1 → translateX de 0 a -160vw
        const tx = diff * 260;
        const rotate = REST_ROTATIONS[i] + diff * 14;
        card.style.transform = `translateX(${tx}vw) rotate(${rotate}deg)`;
      }
    });

    // BoxMusic: visible sólo para la card activa
    boxRefs.current.forEach((box, i) => {
      if (!box) return;
      const diff = (snapList[i] ?? 0) - progress;
      const isClose = Math.abs(diff) < 0.15;
      box.style.opacity = isClose ? '1' : '0';
      box.style.pointerEvents = isClose ? 'auto' : 'none';
    });
  }, [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
    setCanPrev(emblaApi.canScrollPrev());
    setCanNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on('scroll', applyTween);
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', applyTween);
    applyTween();
    onSelect();
    return () => {
      emblaApi.off('scroll', applyTween);
      emblaApi.off('select', onSelect);
      emblaApi.off('reInit', applyTween);
    };
  }, [emblaApi, applyTween, onSelect]);

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
      {/* stackWrapper agrupa la zona visual + Embla invisible
          → Embla solo cubre las cards, nunca los botones */}
      <div className={styles.stackWrapper}>
        {/* Cards visuales apiladas */}
        <div className={styles.stackZone} aria-hidden="true">
          {CARDS.map((card, i) => (
            <div
              key={card.id}
              ref={(el) => {
                cardRefs.current[i] = el;
              }}
              className={styles.cardSlide}
              style={{ zIndex: CARDS.length - i }}
            >
              <div className={styles.cardCover}>
                <Image
                  src={card.imageSrc}
                  alt={card.imageAlt}
                  fill
                  sizes="80vw"
                  priority={i === 0}
                  draggable={false}
                  className={styles.cardImage}
                />
                <span className={styles.cardVinylSheen} aria-hidden="true" />
              </div>
            </div>
          ))}
        </div>

        {/* Embla invisible — SOLO sobre las cards, no cubre botones */}
        <div className={styles.emblaGesture} ref={emblaRef}>
          <div className={styles.emblaTrack}>
            {CARDS.map((card) => (
              <div key={card.id} className={styles.emblaSlide} />
            ))}
          </div>
        </div>
      </div>

      {/* BoxMusic — todas apiladas, JS controla cuál es visible */}
      <div className={styles.boxArea}>
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
          </div>
        ))}
      </div>

      {/* Controles — completamente fuera del área Embla */}
      <div className={styles.controls}>
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

        <nav aria-label="Progression">
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

      <div className={styles.srOnly} aria-live="polite" aria-atomic="true">
        {CARDS[selectedIndex]?.albumTitle} — {CARDS[selectedIndex]?.artist}
      </div>
    </div>
  );
}
