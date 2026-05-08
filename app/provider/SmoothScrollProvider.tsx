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
    // Prevent browser from restoring scroll position on reload/back-forward.
    // Without this, the page starts mid-scroll and the intro animation plays off-screen.
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const update = (time: number) => {
      if (!introCompleteRef.current) return;
      lenisRef.current?.lenis?.raf(time * 1000);
    };

    gsap.ticker.add(update);

    const lenis = lenisRef.current?.lenis;
    lenis?.on('scroll', ScrollTrigger.update);

    // Cap time gaps >500ms to 33ms — prevents GSAP dumping accumulated time
    // on tab-return and breaking the intro timeline
    gsap.ticker.lagSmoothing(500, 33);

    return () => {
      gsap.ticker.remove(update);
      lenis?.off('scroll', ScrollTrigger.update);
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
