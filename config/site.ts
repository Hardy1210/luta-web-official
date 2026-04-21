import type { NavItem } from '@/types'

export const siteConfig = {
  name: 'Agencia Base',
  description: 'Sitio base reutilizable para proyectos de agencia.',
  url: 'https://ejemplo.com',
  navItems: [
    { label: 'Inicio', href: '/' },
    { label: 'Servicios', href: '/servicios' },
    { label: 'Nosotros', href: '/nosotros' },
    { label: 'Contacto', href: '/contacto' },
  ] satisfies NavItem[],
} as const
