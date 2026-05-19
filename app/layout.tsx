import { siteConfig } from '@/config/site';
import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
import '../styles/globals.css';
import SmoothScrollProvider from './provider/SmoothScrollProvider';

const lora = localFont({
  src: '../public/fonts/Lora.woff2',
  variable: '--font-lora',
});

const inter = localFont({
  src: '../public/fonts/Inter-medium.woff2',
  variable: '--font-inter',
});

const interRegular = localFont({
  src: '../public/fonts/Inter-regular.woff2',
  variable: '--font-inter-regular',
});

const interLight = localFont({
  src: '../public/fonts/Inter-light.woff2',
  variable: '--font-inter-light',
});

const interExtraLight = localFont({
  src: '../public/fonts/Inter-ExtraLight.woff2',
  variable: '--font-inter-extralight',
});

const messiri = localFont({
  src: '../public/fonts/ElMessiri-SemiBold.woff2',
  variable: '--font-messiri',
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  openGraph: {
    siteName: siteConfig.name,
    locale: siteConfig.locale,
    type: 'website',
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: '/apple-touch-icon.png',
    shortcut: '/favicon.ico',
  },
  manifest: '/site.webmanifest',
  robots: {
    index: true,
    follow: true,
  },
};

//SCHEMA
const schema = {
  '@context': 'https://schema.org',
  '@type': 'MusicGroup',
  '@id': `${siteConfig.url}/#identity`,
  name: siteConfig.name,
  description: siteConfig.description,
  url: siteConfig.url,
  genre: ['Pop française', 'Soul'],
  image: [`${siteConfig.url}${siteConfig.ogImage}`],
  sameAs: [
    siteConfig.social.instagram,
    siteConfig.social.facebook,
    siteConfig.social.youtube,
    siteConfig.social.spotify,
    siteConfig.social.appleMusic,
    siteConfig.social.deezer,
  ],
  member: [
    {
      '@type': 'OrganizationRole',
      member: {
        '@type': 'Person',
        name: 'Luta',
        jobTitle: ['Chanteuse', 'Compositrice'],
      },
      roleName: ['Lead Vocalist', 'Composer'],
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="fr"
      className={`${lora.variable} ${inter.variable} ${interRegular.variable} ${interLight.variable} ${interExtraLight.variable} ${messiri.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
        <SmoothScrollProvider>{children}</SmoothScrollProvider>
      </body>
    </html>
  );
}
