// A COMPLETE SI IL Y A DES MODIF SUR config/site.ts
// Il faut bien mettre a jours les infos, les liens, les images

import type { NavItem } from '@/types';

export type PageSeoProps = {
  title: string;
  description: string;
  slug?: string;
  ogImage?: string;
};

export type SiteConfig = {
  name: string;
  tagline: string;
  description: string;
  url: string;
  locale: string;
  social: {
    twitter?: string;
    instagram?: string;
    linkedin?: string;
    facebook?: string;
    youtube?: string;
    spotify?: string;
    appleMusic?: string;
    deezer?: string;
  };
  ogImage: string;
  navItems: NavItem[];
};
