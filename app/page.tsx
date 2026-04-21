import type { Metadata } from 'next'
import { HomeClient } from '@/components/sections/HomeClient'
import { generateMetadata } from '@/lib/metadata'
import { siteConfig } from '@/config/site'

export const metadata: Metadata = {
  ...generateMetadata({
    title: siteConfig.name,
    description: siteConfig.description,
  }),
  // Página raíz: evitar doble sufijo "NOM_DU_CLIENT | NOM_DU_CLIENT"
  title: { absolute: siteConfig.name },
}

export default function HomePage() {
  return (
    <HomeClient
      name={siteConfig.name}
      description={siteConfig.description}
    />
  )
}
