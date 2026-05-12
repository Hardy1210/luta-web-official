'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import styles from './VinilWrapper.module.scss';

const VinylScroll = dynamic(() => import('./vinyl-descktop/VinylScroll'), {
  ssr: false,
  loading: () => <div className={styles.fallback} />,
});

const VinylScrollMobile = dynamic(
  () => import('./vinyl-mobil/VinylScrollMobil'),
  { ssr: false, loading: () => <div className={styles.fallbackMobile} /> },
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

  return (
    <div className={styles.shell}>
      {isMobile === null ? (
        <div className={styles.fallback} />
      ) : isMobile ? (
        <VinylScrollMobile />
      ) : (
        <VinylScroll />
      )}
    </div>
  );
}
