'use client';

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

  useEffect(() => {
    // Prevent browser from restoring scroll position on reload/back-forward.
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const update = (time: number) => {
      lenisRef.current?.lenis?.raf(time * 1000);
    };

    gsap.ticker.add(update);

    const lenis = lenisRef.current?.lenis;
    lenis?.on('scroll', ScrollTrigger.update);

    gsap.ticker.lagSmoothing(500, 33);

    window.addEventListener('load', () => ScrollTrigger.refresh(), {
      once: true,
    });
    document.fonts?.ready.then(() => ScrollTrigger.refresh());

    // bfcache: force full reload so the home intro always replays.
    const handlePageShow = (e: PageTransitionEvent) => {
      if (e.persisted) {
        window.location.reload();
      }
    };
    window.addEventListener('pageshow', handlePageShow);

    return () => {
      gsap.ticker.remove(update);
      lenis?.off('scroll', ScrollTrigger.update);
      window.removeEventListener('pageshow', handlePageShow);
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
