//orquestacion intro
'use client';

import { useAnimation } from '@/context/AnimationContext';
import { useIsomorphicLayoutEffect } from '@/hooks/useIsomorphicLayoutEffect';
import gsap from '@/lib/gsap';
import { useEffect, useRef } from 'react';

interface UseIntroOrchestrationParams {
  containerRef: React.RefObject<HTMLDivElement | null>;
  imageRefs: React.RefObject<(HTMLDivElement | null)[]>;
}

export function useIntroOrchestration({
  containerRef,
  imageRefs,
}: UseIntroOrchestrationParams) {
  const { setPhase, triggerNavbar, introComplete } = useAnimation();
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  // ─── Estado inicial — corre ANTES del paint para evitar el flash ──
  useIsomorphicLayoutEffect(() => {
    const container = containerRef.current;
    const images = imageRefs.current;
    if (!container || !images?.length) return;

    gsap.set(container.parentElement, { opacity: 1 }); // ← aqu
    gsap.set(images[0], { scale: 1, opacity: 1 });
    gsap.set(images.slice(1), { scale: 0 });
    gsap.set(container, { y: '100svh', scale: 0.5 });
  }, []);

  // ─── Timeline — corre después del paint ──────────────────────────
  useEffect(() => {
    const container = containerRef.current;
    const images = imageRefs.current;
    if (!container || !images?.length) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      tlRef.current = tl;

      // ─── FASE 1: Imagen sube desde abajo al centro del viewport ───
      setPhase('imageRising');

      tl.to(container, {
        y: 0,
        duration: 1.2,
        delay: 0.5, //retrasa la entrada de la imagen
        ease: 'power4.out',
        onComplete: () => setPhase('imagesRevealing'),
      });

      // ─── FASE 2: Imágenes aparecen dentro del contenedor ──────────
      images.forEach((img, i) => {
        if (!img || i === 0) return;
        const isLast = i === images.length - 1;

        tl.to(
          img,
          {
            scale: 1,
            opacity: 1,
            duration: 0.65,
            ease: 'power2.inOut',
          },
          i === 0 ? '+=0.15' : '-=0.25',
        );

        if (isLast) {
          tl.to(
            container,
            {
              scale: 1.08,
              duration: 1.2,
              ease: 'power3.inOut',
            },
            '+=0.1', // controla el tiempo de espera antes de que la imagen se agrande
          );
        }
      });

      // ─── FASE 3: HeroText ─────────────────────────────────────────
      tl.add(() => setPhase('heroText'), '-=0.3');

      // ─── FASE 4: SubText ──────────────────────────────────────────
      tl.add(() => setPhase('subText'), '+=0.7');

      // ─── FASE 5: Navbar ───────────────────────────────────────────
      tl.add(() => {
        setPhase('navbar');
        triggerNavbar();
      }, '-=0.3');

      // ─── FASE 6: Completo ─────────────────────────────────────────
      tl.add(() => setPhase('overlayOut'), '-=1.5'); // ← cortina sale
      tl.add(() => setPhase('complete'), '+=1'); // ← scroll libre
    });

    return () => {
      tlRef.current = null;
      ctx.revert();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // La timeline continúa su flujo aunque el usuario cambie de tab.
  // Al volver se calcula el tiempo real transcurrido y se hace seek
  // al punto exacto donde estaría si hubiera corrido sin interrupción.
  useEffect(() => {
    let hiddenAt = 0;

    const handleVisibility = () => {
      if (introComplete) return;

      if (document.hidden) {
        hiddenAt = performance.now();
      } else if (hiddenAt > 0) {
        const tl = tlRef.current;
        if (tl) {
          const elapsed = (performance.now() - hiddenAt) / 1000;
          const target = Math.min(tl.time() + elapsed, tl.duration());
          tl.seek(target);
        }
        hiddenAt = 0;
      }
    };

    document.addEventListener('visibilitychange', handleVisibility);
    return () =>
      document.removeEventListener('visibilitychange', handleVisibility);
  }, [introComplete]);
}
