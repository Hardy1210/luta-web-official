import Footer from '@/components/layout/footer/Footer';
import Navbar from '@/components/layout/navbar/Navbar';
import { siteConfig } from '@/config/site';
import { AnimationProvider } from '@/context/AnimationContext';
import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
import '../styles/globals.css';
import SmoothScrollProvider from './provider/SmoothScrollProvider';

const lora = localFont({
  src: '../public/fonts/Lora.woff2',
  variable: '--font-lora',
});

const inter = localFont({
  src: '../public/fonts/Inter.woff2',
  variable: '--font-inter',
});

const interRegular = localFont({
  src: '../public/fonts/inter-regular.woff2',
  variable: '--font-inter-regular',
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
  twitter: {
    card: 'summary_large_image',
    creator: siteConfig.social.twitter,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="fr"
      className={`${lora.variable} ${inter.variable} ${interRegular.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <AnimationProvider>
          <Navbar />

          <SmoothScrollProvider>{children}</SmoothScrollProvider>
          <Footer />
        </AnimationProvider>
      </body>
    </html>
  );
}
