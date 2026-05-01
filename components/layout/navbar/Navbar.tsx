//orquestacion intro
'use client';

import { useAnimation } from '@/context/AnimationContext';
import { useIsomorphicLayoutEffect } from '@/hooks/useIsomorphicLayoutEffect';
import gsap from '@/lib/gsap';
import { useEffect, useRef } from 'react';

import { AppleMusic } from '@/components/icons/AppleMusic';
import { Facebook } from '@/components/icons/Facebook';
import { Instagram } from '@/components/icons/Instagram';
import { LutaLogo } from '@/components/icons/logo/LutaLogo';
import { Spotify } from '@/components/icons/Spotify';
import { WeezerIcon } from '@/components/icons/WeezerIcon';
import { Youtube } from '@/components/icons/Youtube';
import Link from 'next/link';
import styles from './Navbar.module.scss';

const navLinks = [
  { href: '#accueil', label: 'ACCUEIL' },
  { href: '/bio', label: 'BIO' },
  { href: '#musique', label: 'MUSIQUE' },
  { href: '#contact', label: 'CONTACT' },
];

const socialLinks = [
  {
    href: 'https://www.instagram.com/luta_musique/',
    label: 'Instagram',
    icon: <Instagram width={24} />,
  },
  {
    href: 'https://www.facebook.com/profile.php?id=61565333910877',
    label: 'Facebook',
    icon: <Facebook width={30} />,
  },
  {
    href: 'https://www.youtube.com/watch?v=wRvZoXmCl-M&list=OLAK5uy_ndYCNRIfm3g23dWv0ydQRqDu1BIshCKlo',
    label: 'YouTube',
    icon: <Youtube width={40} />,
  },
  {
    href: 'https://music.apple.com/fr/artist/luta/1707409753',
    label: 'Apple Music',
    icon: <AppleMusic width={24} />,
  },
  {
    href: 'https://link.deezer.com/s/338cnCzQ2Zne80LHMSqAT',
    label: 'Deezer',
    icon: <WeezerIcon width={24} />,
  },
  {
    href: 'https://open.spotify.com/intl-fr/artist/7lIbxiBTO3ycZCiD0JLjWD?si=qWisvYOvRjOt7l-PKbdoYQ',
    label: 'Spotify',
    icon: <Spotify width={25} />,
  },
];

function LogoMark() {
  return <LutaLogo width={70} />;
}

export default function Navbar() {
  const { navbarReady } = useAnimation();

  // Refs para los tres bloques del navbar
  const logoRef = useRef<HTMLDivElement>(null);
  const linksRef = useRef<HTMLUListElement>(null);
  const socialIconsRef = useRef<(HTMLAnchorElement | null)[]>([]);

  // ─── Ocultar ANTES del paint — evita flash del navbar ────────
  useIsomorphicLayoutEffect(() => {
    gsap.set(
      [
        logoRef.current,
        linksRef.current,
        ...socialIconsRef.current.filter(Boolean),
      ],
      { opacity: 0 },
    );
  }, []);

  useEffect(() => {
    if (!navbarReady) return;

    const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });

    // 1. Logo (izq) y links (der) entran simultáneos
    tl.fromTo(
      logoRef.current,
      { xPercent: -110, opacity: 0 },
      { xPercent: 0, opacity: 1, duration: 1.5, ease: 'power4.out' },
    ).fromTo(
      linksRef.current,
      { xPercent: 110, opacity: 0 },
      { xPercent: 0, opacity: 1, duration: 1.5, ease: 'power4.out' },
      '<', // simultáneo
    );

    // 2. Iconos sociales en stagger — en cascada después
    tl.fromTo(
      socialIconsRef.current.filter(Boolean),
      { y: -14, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.35,
        stagger: 0.07,
        clearProps: 'opacity', // ← elimina el inline style al terminar
      },
      '-=0.55',
    );
  }, [navbarReady]);

  return (
    <nav
      className={styles.nav}
      role="navigation"
      aria-label="Navigation principale"
      style={{ mixBlendMode: 'difference' }}
    >
      {/* Logo — extremo izquierdo */}
      <div ref={logoRef} className={styles.logo}>
        <Link href="/" aria-label="Accueil">
          <LogoMark />
        </Link>
      </div>

      {/* Iconos sociales — centro, ref por elemento para el stagger */}
      <div className={styles.social}>
        {socialLinks.map(({ href, label, icon }, i) => (
          <a
            key={label}
            ref={(el) => {
              socialIconsRef.current[i] = el;
            }}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
          >
            {icon}
          </a>
        ))}
      </div>

      {/* Links — extremo derecho */}
      <ul ref={linksRef} className={styles.links}>
        {navLinks.map(({ href, label }) => (
          <li key={href}>
            <Link href={href} className={styles.link}>
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
