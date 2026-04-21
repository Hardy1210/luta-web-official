import type { Metadata } from 'next'
import { HomeClient } from '@/components/sections/HomeClient'
import { siteConfig } from '@/config/site'

export const metadata: Metadata = {
  title: { absolute: siteConfig.name },
  description: siteConfig.description,
}

export default function HomePage() {
  return (
    <HomeClient
      name={siteConfig.name}
      description={siteConfig.description}
    />
  )
}
