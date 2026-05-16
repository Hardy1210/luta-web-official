'use client';

import { LutaPathMobil } from '@/components/icons/logo/luta-path/LutaPathMobil';
import gsap from '@/lib/gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Image from 'next/image';
import { useEffect, useRef } from 'react';
import styles from './ImageExpandMobile.module.scss';

const MOBILE_IMAGE_SRC = '/images/section-expand/lu-expandd.webp';

export default function ImageExpandMobile() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const image = imageRef.current;

    if (!section || !image) return;

    const ctx = gsap.context(() => {
      gsap.set(image, {
        yPercent: -3,
        scale: 1.12,
        transformOrigin: 'center center',
        force3D: true,
      });

      gsap.to(image, {
        yPercent: 3,
        scale: 1.06,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: section,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1.8,
          invalidateOnRefresh: true,
          // markers: true,
        },
      });
    }, section);

    return () => {
      ctx.revert();
    };
  }, []);

  // Runs after the GSAP setup effect (effects fire in declaration order).
  // Forces Lenis to sync its scroll limit after this dynamic component mounts.
  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      ScrollTrigger.refresh();
    });
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <>
      <div className={styles.mobileIntro}>
        {/*<p className={styles.introLabel}>↓ scroll</p>
        <h1 className={styles.mobileTitle}>Antes de la magia</h1> */}
      </div>

      <div ref={sectionRef} className={styles.mobileSection}>
        <LutaPathMobil size={140} className={styles.lutaPath} />
        <div className={styles.mobileImageWrapper}>
          <div ref={imageRef} className={styles.mobileImageInner}>
            <Image
              src={MOBILE_IMAGE_SRC}
              alt="Sujet principal"
              width={3000}
              height={1500}
              className={styles.mobileImage}
              priority
            />
          </div>
        </div>
      </div>

      {/*<div className={styles.after}>
        <h2 className={styles.afterTitle}>Y así llenó el mundo.</h2>
      </div> */}
    </>
  );
}
