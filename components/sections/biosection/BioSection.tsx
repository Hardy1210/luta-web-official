// components/BioSection/BioSection.tsx
//
// ESTRUCTURA DEL GRID (resumen visual):
//
//  DESKTOP (12 cols)
//  ┌─────────────────────────────┬─────────────────────┐
//  │  HEADING       [col 1–7]    │  IMAGE   [col 8–12] │
//  ├──────────┬──────────────────┤  (row span 2)       │
//  │ CAPTION  │  BIO TEXT        │                     │
//  │[col 1–2] │  [col 4–7]       │                     │
//  └──────────┴──────────────────┴─────────────────────┘
//
//  TABLET (8 cols)
//  ┌──────────────────────┬─────────────┐
//  │  HEADING  [col 1–5]  │ IMAGE[6–8]  │
//  ├───────┬──────────────┤ (row span 2)│
//  │CAPTION│  BIO TEXT    │             │
//  │[1–2]  │  [col 3–5]   │             │
//  └───────┴──────────────┴─────────────┘
//
//  MOBILE (4 cols)
//  ┌──────────────────┐
//  │  HEADING [1–4]   │
//  ├──────────────────┤
//  │  IMAGE   [1–4]   │
//  ├──────────────────┤
//  │  CAPTION [1–4]   │
//  ├──────────────────┤
//  │  BIO TEXT[1–4]   │
//  └──────────────────┘

import Image from 'next/image';
import styles from './BioSection.module.scss';

// ── Types ────────────────────────────────────────────────────
interface BioSectionProps {
  /** Ruta de la imagen (portrait — desktop/tablet) */
  imageSrc: string;
  /** Alt text de la imagen */
  imageAlt?: string;
  /** Ruta de la imagen en mobile si el aspect-ratio es diferente */
  imageMobileSrc?: string;
}

// ── Componente ───────────────────────────────────────────────
export default function BioSection({
  imageSrc,
  imageAlt = 'Luta en concert',
  imageMobileSrc,
}: BioSectionProps) {
  return (
    <div className={styles.bio} aria-label="Biographie">
      <div className={styles.grid}>
        {/* ── HEADING ─────────────────────────────────────── */}
        {/*
          · La prop `em` usa Lora italic (--ff-serif)
          · El resto usa Inter Bold (--ff-display)
          · CSS lo diferencia con `em` dentro del h1 en el SCSS
        */}
        <div className={styles.heading}>
          <p>
            Autrice, compositrice et&nbsp;interprète, Luta trace un parcours
            musical guidé par la <em>sincérité.</em> Une musique née
            du&nbsp;vécu, entre simplicité et <em>intensité.</em> Des chansons
            qui parlent du <em>quotidien</em> et du lien aux&nbsp;autres.
          </p>
        </div>

        {/* ── IMAGE ───────────────────────────────────────── */}
        {/*
          En desktop/tablet: position relative + fill → ocupa todo el wrapper.
          En mobile: si hay imageMobileSrc se usa esa imagen (aspect-ratio 4/3).
          El SCSS define el aspect-ratio correcto por breakpoint.
        */}
        <div className={styles.imageWrapper}>
          {/* Imagen mobile (si existe y es diferente) */}
          {imageMobileSrc && (
            <Image
              src={imageMobileSrc}
              alt={imageAlt}
              fill
              sizes="100vw"
              className="object-cover object-top md:hidden"
              priority
            />
          )}

          {/* Imagen principal (desktop / tablet) */}
          <Image
            src={imageSrc}
            alt={imageAlt}
            fill
            sizes="(max-width: 767px) 100vw, (max-width: 1023px) 37.5vw, 41.6vw"
            className={`object-cover object-top ${imageMobileSrc ? 'hidden md:block' : ''}`}
            priority
          />
        </div>

        {/* ── CAPTION ─────────────────────────────────────── */}
        <div className={styles.caption}>
          <p>
            Enfance au cœur du&nbsp;Morvan
            <br />
            entourée par la nature et les animaux.
          </p>
        </div>

        {/* ── BIO TEXT ────────────────────────────────────── */}
        <div className={styles.bioText}>
          <p>
            Luta est autrice, compositrice et interprète. Elle grandit au cœur
            du Morvan, entourée par la nature, qui façonne très tôt sa
            sensibilité. La musique l&apos;accompagne depuis
            l&apos;enfance&nbsp;: piano, guitare, puis l&apos;écriture et le
            chant. Longtemps vécue comme un refuge personnel, la musique prend
            une place centrale à partir de 2020. En 2025, Luta fait le choix de
            se consacrer pleinement à son projet artistique. Ses chansons
            racontent le quotidien, les émotions simples et le besoin de
            partage, portées par une écriture sincère et une voix intime.
          </p>
        </div>
      </div>
    </div>
  );
}
