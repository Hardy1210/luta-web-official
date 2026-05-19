//orquestacion intro
'use client';

import { useAnimation } from '@/context/AnimationContext';
import { useIsomorphicLayoutEffect } from '@/hooks/useIsomorphicLayoutEffect';
import gsap from '@/lib/gsap';
import { useEffect, useRef } from 'react';

import { usePathname } from 'next/navigation';

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
  { href: '/', label: 'ACCUEIL' },
  { href: '/a-propos', label: 'BIO' },
  { href: '#music', label: 'MUSIQUE' },
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
  const { navbarReady, introComplete } = useAnimation();
  //CONDICIONAMOS LA ANIMACION DE NAVBAR SOLO PARA LA HOME
  const pathname = usePathname();
  const isHome = pathname === '/';

  // Refs para los tres bloques del navbar
  const logoRef = useRef<HTMLDivElement>(null);
  const linksRef = useRef<(HTMLAnchorElement | null)[]>([]);
  const socialIconsRef = useRef<(HTMLAnchorElement | null)[]>([]);
  // Evita que la timeline corra dos veces si navbarReady cambia varias veces
  // (p. ej. por resetNavbar en un remount) — la intro siempre se ejecuta una
  // sola vez por sesión y este guard protege contra reanimaciones espurias.
  const animatedRef = useRef(false);

  // ─── Ocultar ANTES del paint — evita flash del navbar ────────
  useIsomorphicLayoutEffect(() => {
    //si no estamos en home, no hacemos nada de animacion
    if (!isHome) return;
    // ✅ Si intro ya fue vista, mostrar directamente
    if (introComplete) {
      gsap.set(
        [
          logoRef.current,
          ...linksRef.current.filter(Boolean),
          ...socialIconsRef.current.filter(Boolean),
        ],
        { opacity: 1 },
      );
      return;
    }
    gsap.set(
      [
        logoRef.current,
        ...linksRef.current.filter(Boolean),
        ...socialIconsRef.current.filter(Boolean),
      ],
      { opacity: 0 },
    );
  }, []);

  useEffect(() => {
    if (!isHome) return;
    if (introComplete) return; // ya visible, layout effect dejó opacity:1
    if (!navbarReady) return;
    if (animatedRef.current) return;
    animatedRef.current = true;
    const links = linksRef.current.filter(Boolean);
    const socialIcons = socialIconsRef.current.filter(Boolean);
    const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });

    // 1. Logo (izq) y links (der) entran simultáneos
    tl.fromTo(
      logoRef.current,
      { xPercent: -20, opacity: 0 },
      { xPercent: 0, opacity: 1, duration: 1.5, ease: 'power2.out' },
    ).fromTo(
      links,
      { x: 20, opacity: 0 },
      {
        x: 0,
        opacity: 1,
        duration: 1.5,
        ease: 'power4.out',
        stagger: 0.095,
        clearProps: 'transform,opacity',
      },
      '<', // simultáneo
    );

    // 2. Iconos sociales en stagger — en cascada después
    tl.fromTo(
      socialIcons,
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
  }, [navbarReady, isHome]);

  return (
    <nav
      className={styles.nav}
      role="navigation"
      aria-label="Navigation principale"
      style={{ mixBlendMode: 'difference' }}
    >
      {/* Logo — extremo izquierdo */}
      <div
        ref={logoRef}
        className={styles.logo}
        style={isHome ? { opacity: 0 } : undefined}
      >
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
            style={{ opacity: 0 }}
          >
            {icon}
          </a>
        ))}
      </div>

      {/* Links — extremo derecho */}
      <ul className={styles.links}>
        {navLinks.map(({ href, label }, i) => (
          <li key={href}>
            <Link
              ref={(el) => {
                linksRef.current[i] = el;
              }}
              href={href}
              className={styles.link}
              style={isHome ? { opacity: 0 } : undefined}
            >
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
