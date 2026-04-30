//orquestacion intro
'use client';

import { useAnimation } from '@/context/AnimationContext';
import gsap from '@/lib/gsap';
import { useEffect } from 'react';

interface UseIntroOrchestrationParams {
  containerRef: React.RefObject<HTMLDivElement | null>;
  imageRefs: React.RefObject<(HTMLDivElement | null)[]>;
}

export function useIntroOrchestration({
  containerRef,
  imageRefs,
}: UseIntroOrchestrationParams) {
  const { setPhase, triggerNavbar } = useAnimation();

  useEffect(() => {
    const container = containerRef.current;
    const images = imageRefs.current;

    if (!container || !images?.length) return;

    // Ocultar imágenes en estado inicial
    // ✅ Después — primera visible, el resto ocultas
    gsap.set(images[0], { scale: 1, opacity: 1 });
    gsap.set(images.slice(1), { scale: 0 });
    gsap.set(container, { yPercent: 100, scale: 0.5 });

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      // ─── FASE 1: Imagen sube desde abajo al centro del viewport ───────
      setPhase('imageRising');

      tl.to(container, {
        yPercent: 0,
        //scale: 1,
        //opacity: 1,
        duration: 1.4,
        ease: 'power4.out',
        onComplete: () => setPhase('imagesRevealing'),
      });

      // ─── FASE 2: Imágenes aparecen dentro del contenedor, una sobre otra ─
      // Cada imagen escala de 0 → 1, superponiéndose
      // ✅ Después — empieza desde i = 1
      images.forEach((img, i) => {
        if (!img || i === 0) return; // ← skip primera
        const isLast = i === images.length - 1;

        tl.to(
          img,
          {
            scale: 1,
            opacity: 1,
            duration: 0.65,
            ease: 'power2.inOut',
          },
          i === 0 ? '+=0.15' : '-=0.25', // overlap entre imágenes
        );

        // La última imagen: el contenedor entero crece un poco más
        if (isLast) {
          tl.to(
            container,
            {
              scale: 1.08,
              duration: 0.5,
              ease: 'power2.inOut',
            },
            '-=0.2',
          );
        }
      });

      // ─── FASE 3: HeroText ─────────────────────────────────────────────
      tl.add(() => setPhase('heroText'), '+=0.3');

      // ─── FASE 4: SubText ──────────────────────────────────────────────
      tl.add(() => setPhase('subText'), '+=0.7');

      // ─── FASE 5: Navbar ───────────────────────────────────────────────
      tl.add(() => {
        setPhase('navbar');
        triggerNavbar();
      }, '+=0.5');

      // ─── FASE 6: Completo ─────────────────────────────────────────────
      tl.add(() => setPhase('complete'), '+=1');
    });

    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
