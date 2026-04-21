import type { Metadata } from 'next'
import type { PageSeoProps } from '@/types/seo'
import { siteConfig } from '@/config/site'

export function generateMetadata(page: PageSeoProps): Metadata {
  const canonicalUrl = page.slug
    ? `${siteConfig.url}/${page.slug}`
    : siteConfig.url

  const ogImage = page.ogImage ?? siteConfig.ogImage
  const titleFormatted = `${page.title} | ${siteConfig.name}`

  return {
    metadataBase: new URL(siteConfig.url),
    title: page.title,
    description: page.description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: titleFormatted,
      description: page.description,
      url: canonicalUrl,
      siteName: siteConfig.name,
      images: [{ url: ogImage, width: 1200, height: 630, alt: titleFormatted }],
      locale: siteConfig.locale,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: titleFormatted,
      description: page.description,
      creator: siteConfig.social.twitter,
      images: [ogImage],
    },
    robots: {
      index: true,
      follow: true,
    },
  }
}
