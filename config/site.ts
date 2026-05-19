// A COMPLETE SI IL Y A DES MODIF SUR types/seo.ts

import type { SiteConfig } from '@/types/seo';

export const siteConfig = {
  name: 'Luta Musique',
  tagline: 'Pop française aux influences soul — Chanteuse & compositrice',
  description:
    'Luta Musique, chanteuse et compositrice de pop française aux influences soul. Des mélodies entraînantes et des textes positifs qui font voyager émotionnellement.',
  url: 'https://www.lutamusique.fr',
  locale: 'fr_FR',
  social: {
    instagram: 'https://www.instagram.com/luta_musique/',
    facebook: 'https://www.facebook.com/profile.php?id=61565333910877',
    youtube: 'https://www.youtube.com/channel/UCAJF0B2v2rFD4lJx4iH5JKA',
    spotify: 'https://open.spotify.com/artist/7lIbxiBTO3ycZCiD0JLjWD',
    appleMusic: 'https://music.apple.com/fr/artist/luta/1707409753',
    deezer: 'https://www.deezer.com/fr/artist/234652451',
  },
  ogImage: '/luta-og.jpg',
  navItems: [
    { label: 'Accueil', href: '#accueil' },
    { label: 'Musique', href: '#musique' },
    { label: 'À propos', href: '/a-propos' },
    { label: 'Contact', href: '#contact' },
    { label: 'Mentions légales', href: '/mentions-legales' },
  ],
} satisfies SiteConfig;
