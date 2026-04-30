//orquestacion intro
'use client';

import { introImages } from '@/data/IntroImages';
import { useIntroOrchestration } from '@/hooks/useIntroOrchestration';
import Image from 'next/image';
import { useRef } from 'react';
import styles from './IntroImage.module.scss';

export function IntroImage() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Un único ref que contiene el array de elementos DOM
  const imageRefs = useRef<(HTMLDivElement | null)[]>([]);

  useIntroOrchestration({ containerRef, imageRefs });

  return (
    <div className={styles.wrapper}>
      <div ref={containerRef} className={styles.container}>
        {introImages.map((img, i) => (
          <div
            key={img.id}
            ref={(el) => {
              imageRefs.current[i] = el;
            }}
            className={styles.imageLayer}
          >
            <Image
              src={img.src}
              alt={img.alt}
              fill
              priority={i === 0}
              style={{ objectFit: 'cover' }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
