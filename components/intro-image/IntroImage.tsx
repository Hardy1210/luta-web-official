//orquestacion intro
'use client';

import { useAnimation } from '@/context/AnimationContext';
import { introImages } from '@/data/IntroImages';
import { useIntroOrchestration } from '@/hooks/useIntroOrchestration';
import Image from 'next/image';
import { useRef } from 'react';
import styles from './IntroImage.module.scss';
import { IntroImageCursorReveal } from './IntroImageCursorReveal';

interface IntroImageProps {
  className?: string;
  hoverSrc?: string;
  brushSize?: number;
  trailDecay?: number;
  smoothness?: number;
}

export function IntroImage({ className, hoverSrc }: IntroImageProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Un único ref que contiene el array de elementos DOM
  const imageRefs = useRef<(HTMLDivElement | null)[]>([]);

  const { introComplete } = useAnimation();

  useIntroOrchestration({ containerRef, imageRefs });

  return (
    <div className={`${styles.wrapper} ${className}`}>
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

        {hoverSrc && (
          <IntroImageCursorReveal
            hoverSrc={hoverSrc}
            containerRef={containerRef}
            pointerRadius={0.5}
            pointerDuration={1}
            accumRate={0.95}
          />
        )}
      </div>
    </div>
  );
}
