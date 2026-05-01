'use client';

import { useAnimation } from '@/context/AnimationContext';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { LenisRef } from 'lenis/react';
import { ReactLenis } from 'lenis/react';
import { useEffect, useRef } from 'react';

export default function SmoothScrollProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const lenisRef = useRef<LenisRef>(null);
  const { introComplete } = useAnimation();
  const introCompleteRef = useRef(false);

  useEffect(() => {
    introCompleteRef.current = introComplete;
    const lenis = lenisRef.current?.lenis;
    if (!lenis) return;
    introComplete ? lenis.start() : lenis.stop();
  }, [introComplete]);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const update = (time: number) => {
      if (!introCompleteRef.current) return;
      lenisRef.current?.lenis?.raf(time * 1000);
    };

    gsap.ticker.add(update);

    // 🔥 Cuando Lenis hace scroll → actualizar ScrollTrigger
    lenisRef.current?.lenis?.on('scroll', ScrollTrigger.update);

    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(update);
    };
  }, []);

  return (
    <ReactLenis
      root
      options={{
        autoRaf: false,
        duration: 1.1,
        smoothWheel: true,
      }}
      ref={lenisRef}
    >
      {children}
    </ReactLenis>
  );
}
