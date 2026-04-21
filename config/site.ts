import type { SiteConfig } from '@/types/seo'

export const siteConfig = {
  name: 'NOM_DU_CLIENT',
  tagline: 'TAGLINE_CLIENT',
  description: 'DESCRIPTION_CLIENT',
  url: 'https://www.NOM_DU_CLIENT.fr',
  locale: 'fr_FR',
  social: {
    twitter: '@NOM_DU_CLIENT',
    instagram: '@NOM_DU_CLIENT',
    linkedin: 'NOM_DU_CLIENT',
  },
  ogImage: '/og-image.jpg',
  navItems: [
    { label: 'Accueil', href: '/' },
    { label: 'Services', href: '/services' },
    { label: 'À propos', href: '/a-propos' },
    { label: 'Contact', href: '/contact' },
  ],
} satisfies SiteConfig
