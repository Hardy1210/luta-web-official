import { siteConfig } from '@/config/site';
import type { PageSeoProps } from '@/types/seo';
import type { Metadata } from 'next';

export function generateMetadata(page: PageSeoProps): Metadata {
  const canonicalUrl = page.slug
    ? `${siteConfig.url}/${page.slug}`
    : siteConfig.url;

  const ogImage = page.ogImage ?? siteConfig.ogImage;
  const titleFormatted = `${page.title} | ${siteConfig.name}`;

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

    robots: {
      index: true,
      follow: true,
    },
  };
}
