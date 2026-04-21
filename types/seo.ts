import type { NavItem } from '@/types'

export type PageSeoProps = {
  title: string
  description: string
  slug?: string
  ogImage?: string
}

export type SiteConfig = {
  name: string
  tagline: string
  description: string
  url: string
  locale: string
  social: {
    twitter?: string
    instagram?: string
    linkedin?: string
  }
  ogImage: string
  navItems: NavItem[]
}
