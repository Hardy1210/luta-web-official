//orquestacion intro
// components/IntroOverlay/IntroOverlay.tsx
'use client';
import { useAnimation } from '@/context/AnimationContext';
import { useIsomorphicLayoutEffect } from '@/hooks/useIsomorphicLayoutEffect';
import gsap from '@/lib/gsap';
import { useEffect, useRef } from 'react';

export function IntroOverlay() {
  const { phase, introComplete } = useAnimation();
  const overlayRef = useRef<HTMLDivElement>(null);
  useIsomorphicLayoutEffect(() => {
    const el = overlayRef.current;
    if (!el || !introComplete) return;
    el.style.display = 'none';
  }, []);
  useEffect(() => {
    if (introComplete) return;
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
  }, [phase, introComplete]);

  return <div ref={overlayRef} className="intro-overlay" />;
}
