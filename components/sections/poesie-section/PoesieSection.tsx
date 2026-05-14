'use client';

/**
 * ArtistHero
 *
 * Section deux colonnes — typographie + images en parallax.
 *
 * Col gauche  : titre animé (slot), description, CTA Spotify
 * Col droite  : grande image (parallax interne) + 2 petites
 *               images flottantes (vitesses différentes au scroll)
 *
 * Tokens CSS à remplacer par les vôtres :
 *   --c-black, --c-white, --c-neon
 *   --font-display, --font-serif, --font-body
 *   --text-hero, --text-xl, --text-sm
 *   --section-pad-x, --container-2xl
 */

import { AnimatedText } from '@/components/Animated-text/AnimatedText';
import { Heart } from '@/components/icons/dibujos/Heart';
import { useIsomorphicLayoutEffect } from '@/hooks/useIsomorphicLayoutEffect';
import gsap from '@/lib/gsap';
import Image from 'next/image';
import type { ReactNode } from 'react';
import { useRef } from 'react';
import styles from './PoesieSection.module.scss';

/* ─── Types ─────────────────────────────────────────────────── */
interface ArtistHeroProps {
  /**
   * Slot pour le titre — utilisez AnimatedChars ou un élément
   * statique. Rendu tel quel dans la colonne gauche.
   */
  titleSlot?: ReactNode;
  description?: string;
  ctaLabel?: string;
  ctaHref?: string;
  /** Grande image portrait (colonne droite) */
  mainImage: { src: string; alt: string };
  /** Petite image flottante haute droite */
  floatImageTop: { src: string; alt: string };
  /** Petite image flottante basse (style pochette) */
  floatImageBottom: { src: string; alt: string };
}

/* ─── Icône Spotify SVG ─────────────────────────────────────── */
function SpotifyIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
    </svg>
  );
}

/* ─── Composant ──────────────────────────────────────────────── */
export function PoesieSection({
  titleSlot,
  description = "Poétique, moderne et sincère, son univers musical invite à l'écoute et à l'émotion.\nDes chansons qui résonnent longtemps après la dernière note.",
  ctaLabel = 'Écouter sur Spotify',
  ctaHref = 'https://open.spotify.com/intl-es/artist/7lIbxiBTO3ycZCiD0JLjWD?si=oalXqSCsQy-zpp87A7Z0Kg',
  mainImage,
  floatImageTop,
  floatImageBottom,
}: ArtistHeroProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const mainImgRef = useRef<HTMLImageElement>(null);
  const floatTopRef = useRef<HTMLDivElement>(null);
  const floatBottomRef = useRef<HTMLDivElement>(null);

  useIsomorphicLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const trigger = {
        trigger: sectionRef.current,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      };

      // Grande image — parallax interne (image plus grande que son conteneur)
      // Elle monte doucement à l'intérieur du clip
      gsap.to(mainImgRef.current, {
        y: '-19%',
        ease: 'none',
        scrollTrigger: trigger,
      });

      // Petite image haute droite — monte vite (vitesse ×1.8)
      gsap.to(floatTopRef.current, {
        y: '-80px',
        ease: 'none',
        scrollTrigger: { ...trigger, scrub: 0.8 },
      });

      // Petite image basse — monte moins vite (vitesse ×0.9)
      gsap.to(floatBottomRef.current, {
        y: '-190px',
        ease: 'none',
        scrollTrigger: { ...trigger, scrub: 1.6 },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={sectionRef}
      className={styles.section}
      aria-label="Présentation artiste"
    >
      {/* ── Colonne gauche ──────────────────────────────── */}
      <div className={styles.leftCol}>
        <div className={styles.titleBlock}>
          {titleSlot ?? (
            <>
              <p className="sr-only">La poésie en musique</p>
              <AnimatedText aria-hidden="true" className={styles.titleTop}>
                La poésie
              </AnimatedText>
              <AnimatedText aria-hidden="true" className={styles.titleTop}>
                en musique
              </AnimatedText>
              <p className="sr-only">Une génération</p>
              <AnimatedText
                aria-hidden="true"
                as="p"
                className={styles.titleBottom}
              >
                Une génération
              </AnimatedText>
            </>
          )}
        </div>

        <div className={styles.description}>
          <AnimatedText as="p" aria-hidden="true">
            Poétique, moderne et sincère, son univers musical invite à l'écoute
            et à l'émotion. <br /> Des chansons qui résonnent longtemps après la
            dernière note.
          </AnimatedText>
        </div>

        <a
          href={ctaHref}
          className={styles.ctaButton}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${ctaLabel} (ouvre dans un nouvel onglet)`}
        >
          <SpotifyIcon />
          <span>{ctaLabel}</span>
        </a>
      </div>

      {/* ── Colonne droite ──────────────────────────────── */}
      <div className={styles.rightCol} aria-hidden="true">
        {/* Grande image avec parallax interne */}
        <div className={styles.mainImageWrap}>
          <Image
            ref={mainImgRef}
            src={mainImage.src}
            alt={mainImage.alt}
            width={1265}
            height={1898}
            className={styles.mainImage}
            priority
            draggable={false}
          />
        </div>
        {/* Icône cœur positionnée en haut de l'image */}
        <span className={styles.heartIcon}>
          <Heart size={60} />
        </span>
        {/* Petite image haute droite — vitesse rapide */}
        <div ref={floatTopRef} className={styles.floatTop}>
          <Image
            src={floatImageTop.src}
            alt={floatImageTop.alt}
            fill
            sizes="20vw"
            className={styles.floatImage}
            draggable={false}
          />
        </div>

        {/* Petite image basse — vitesse lente */}
        <div ref={floatBottomRef} className={styles.floatBottom}>
          <div className={styles.floatBottomInner}>
            <div className={styles.floatBottomImg}>
              <Image
                src={floatImageBottom.src}
                alt={floatImageBottom.alt}
                fill
                sizes="18vw"
                className={styles.floatImage}
                draggable={false}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
