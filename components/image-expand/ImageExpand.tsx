//ESTE COMPONENTE EXPORTA LA ANIMACION DE EXPANCION EN DOS VERSIONES PARA
//MOBIL Y DESKTOP
'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import styles from './ImageExpand.module.scss';

const ImageExpandDesktop = dynamic(
  () => import('./image-expand-dektop/ImageExpandDesktop'),
  {
    ssr: false,
    loading: () => <div className={styles.imageExpandFallback} />,
  },
);

const ImageExpandMobile = dynamic(
  () => import('./image-expand-mobile/ImageExpandMobile'),
  {
    ssr: false,
    loading: () => <div className={styles.imageExpandFallbackMobile} />,
  },
);

export default function ImageExpand() {
  const [isDesktop, setIsDesktop] = useState<boolean | null>(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 768px)');

    const update = () => {
      setIsDesktop(mediaQuery.matches);
    };

    update();

    mediaQuery.addEventListener('change', update);

    return () => {
      mediaQuery.removeEventListener('change', update);
    };
  }, []);

  return (
    <section className={styles.imageExpandShell}>
      {isDesktop === null ? (
        <div className={styles.imageExpandFallback} />
      ) : isDesktop ? (
        <ImageExpandDesktop />
      ) : (
        <ImageExpandMobile />
      )}
    </section>
  );
}
