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
    href: 'https://www.instagram.com/luta_musique/',
    label: 'Instagram',
    icon: <Instagram width={35} />,
  },
  {
    href: 'https://www.facebook.com/profile.php?id=61565333910877',
    label: 'Facebook',
    icon: <Facebook width={38} />,
  },
  {
    href: 'https://www.youtube.com/watch?v=wRvZoXmCl-M&list=OLAK5uy_ndYCNRIfm3g23dWv0ydQRqDu1BIshCKlo',
    label: 'YouTube',
    icon: <Youtube width={50} />,
  },
  {
    href: 'https://music.apple.com/fr/artist/luta/1707409753',
    label: 'Apple Music',
    icon: <AppleMusic width={35} />,
  },
  {
    href: 'https://link.deezer.com/s/338cnCzQ2Zne80LHMSqAT',
    label: 'Deezer',
    icon: <WeezerIcon width={35} />,
  },
  {
    href: 'https://open.spotify.com/intl-fr/artist/7lIbxiBTO3ycZCiD0JLjWD?si=qWisvYOvRjOt7l-PKbdoYQ',
    label: 'Spotify',
    icon: <Spotify width={30} />,
  },
];

function LogoMark() {
  return <LutaLogo width={90} />;
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
