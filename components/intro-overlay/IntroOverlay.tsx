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
    if (phase !== 'overlayOut') return;
    gsap.to(overlayRef.current, {
      opacity: 0,
      duration: 0.6,
      ease: 'power2.inOut',
      onComplete: () => {
        if (overlayRef.current) overlayRef.current.style.display = 'none';
      },
    });
  }, [phase]);

  return <div ref={overlayRef} className="intro-overlay" />;
}
