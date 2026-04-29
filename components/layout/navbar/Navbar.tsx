'use client';

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
    href: '#',
    label: 'Instagram',
    icon: <Instagram width={32} />,
  },
  {
    href: '#',
    label: 'Facebook',
    icon: <Facebook width={30} />,
  },
  {
    href: '#',
    label: 'YouTube',
    icon: <Youtube width={30} />,
  },
  {
    href: '#',
    label: 'Apple Music',
    icon: <AppleMusic width={30} />,
  },
  {
    href: '#',
    label: 'Weezer',
    icon: <WeezerIcon width={30} />,
  },
  {
    href: '#',
    label: 'Spotify',
    icon: <Spotify width={30} />,
  },
];

function LogoMark() {
  return <LutaLogo width={80} />;
}

export default function Navbar() {
  return (
    <nav
      className={styles.nav}
      role="navigation"
      aria-label="Navigation principale"
      style={{ mixBlendMode: 'difference' }}
    >
      <div className={styles.logo}>
        <Link href="/" aria-label="Accueil">
          <LogoMark />
        </Link>
      </div>

      <div className={styles.social}>
        {socialLinks.map(({ href, label, icon }) => (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
          >
            {icon}
          </a>
        ))}
      </div>

      <ul className={styles.links}>
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
