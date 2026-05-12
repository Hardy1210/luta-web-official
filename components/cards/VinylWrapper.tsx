'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

const VinylScroll = dynamic(() => import('./vinyl-descktop/VinylScroll'), {
  ssr: false,
});
const VinylScrollMobile = dynamic(
  () => import('./vinyl-mobil/VinylScrollMobil'),
  { ssr: false },
);

export default function VinylScrollWrapper() {
  const [isMobile, setIsMobile] = useState<boolean | null>(null);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 1024px)');
    setIsMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  if (isMobile === null)
    return <div style={{ minHeight: '100vh', background: '#f4f4ed' }} />;

  return isMobile ? <VinylScrollMobile /> : <VinylScroll />;
}
