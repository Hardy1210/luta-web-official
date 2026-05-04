//orquestacion intro
// components/IntroOverlay/IntroOverlay.tsx
'use client';
import { useAnimation } from '@/context/AnimationContext';
import gsap from '@/lib/gsap';
import { useEffect, useRef } from 'react';

export function IntroOverlay() {
  const { phase } = useAnimation();
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = overlayRef.current;
    if (!el || el.style.display === 'none') return;
    if (phase !== 'overlayOut' && phase !== 'complete') return;

    gsap.to(el, {
      opacity: 0,
      duration: phase === 'complete' ? 0 : 0.6,
      ease: 'power2.inOut',
      onComplete: () => {
        if (el) el.style.display = 'none';
      },
    });
  }, [phase]);

  return <div ref={overlayRef} className="intro-overlay" />;
}
