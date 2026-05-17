'use client';
//ANIMACION DE LINEA CON BACKGROUND REUTILIZABLE
import gsap from '@/lib/gsap';
import { useEffect, useRef } from 'react';

interface AnimatedBackgroundLineTextOptions {
  triggerStart?: string;
  once?: boolean;
  barClassName?: string;
  stagger?: number;
}

export function AnimatedBackgroundLineText<T extends HTMLElement>(
  options: AnimatedBackgroundLineTextOptions = {},
) {
  const {
    triggerStart = 'top 90%',
    once = true,
    barClassName = 'bg-[var(--c-neon)]',
    stagger = 0,
  } = options;

  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Crear barra
    const bar = document.createElement('span');
    bar.className = barClassName;
    bar.style.cssText =
      'position:absolute;inset:0;pointer-events:none;z-index:1;';
    el.style.position = 'relative';
    el.appendChild(bar);

    const ctx = gsap.context(() => {
      gsap.set(el, { clipPath: 'inset(0 100% 0 0)' });
      gsap.set(bar, { scaleX: 0, transformOrigin: 'left center' });

      const tl = gsap.timeline({
        delay: stagger,
        scrollTrigger: {
          trigger: el,
          start: triggerStart,
          once,
        },
      });

      tl.to(bar, { scaleX: 1, duration: 0.39, ease: 'power4.out' })
        .to(
          el,
          { clipPath: 'inset(0 0% 0 0)', duration: 0.39, ease: 'power4.out' },
          '<',
        )
        .set(bar, { transformOrigin: 'right center' })
        .to(bar, { scaleX: 0, duration: 0.39, ease: 'power4.out' });
    }, el);

    return () => {
      ctx.revert();
      bar.remove();
    };
  }, [triggerStart, once, stagger]);

  return ref;
}
