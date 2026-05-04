'use client';

import { useAnimation } from '@/context/AnimationContext';
import { useIsomorphicLayoutEffect } from '@/hooks/useIsomorphicLayoutEffect';
import gsap, { SplitText } from '@/lib/gsap';
import { useEffect, useRef } from 'react';
import styles from './HeroText.module.scss';

interface HeroTextProps {
  className?: string;
}

export function HeroText({ className }: HeroTextProps) {
  const line1Ref = useRef<HTMLSpanElement>(null);
  const line2ARef = useRef<HTMLSpanElement>(null);
  const line2BRef = useRef<HTMLSpanElement>(null);

  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const splitsRef = useRef<SplitText[]>([]);

  const { phase } = useAnimation();

  useIsomorphicLayoutEffect(() => {
    const refs = [line1Ref, line2ARef, line2BRef];
    if (refs.some((r) => !r.current)) return;

    const ctx = gsap.context(() => {
      const allChars: Element[] = [];

      refs.forEach((r) => {
        const split = new SplitText(r.current!, {
          type: 'lines,words,chars',
          linesClass: styles.line,
          wordsClass: styles.word,
          charsClass: styles.char,
        });
        splitsRef.current.push(split);
        allChars.push(...(split.chars as Element[]));
      });

      gsap.set(
        refs.map((r) => r.current!),
        {
          opacity: 1,
          perspective: 900,
          transformStyle: 'preserve-3d',
        },
      );

      // AQUÍ DEFINES VALORES DIFERENTES PARA MOBILE Y DESKTOP
      const isMobile = window.matchMedia('(max-width: 767px)').matches;

      const initialY = isMobile ? 5 : 38;
      const initialRotateX = isMobile ? -180 : -80;
      const initialZ = isMobile ? -35 : -80;

      gsap.set(allChars, {
        opacity: 0,
        y: initialY,
        rotateX: initialRotateX,
        z: initialZ,
        transformOrigin: '50% 50% -60px',
        transformStyle: 'preserve-3d',
        backfaceVisibility: 'hidden',
        willChange: 'transform, opacity',
      });

      timelineRef.current = gsap.timeline({
        paused: true,
        defaults: { ease: 'power4.out' },
        onComplete: () => {
          gsap.set(allChars, {
            clearProps:
              'transform,willChange,backfaceVisibility,transformStyle',
          });
          gsap.set(
            refs.map((r) => r.current!),
            { clearProps: 'perspective,transformStyle' },
          );
        },
      });

      timelineRef.current
        .to(allChars, {
          opacity: 1,
          duration: 0.3,
          stagger: { each: 0.04, from: 'start' },
        })
        .to(
          allChars,
          {
            y: 0,
            z: 0,
            rotateX: 0,
            duration: 1.95,
            stagger: { each: 0.04, from: 'start' },
          },
          '<',
        );
    });

    return () => {
      timelineRef.current?.kill();
      splitsRef.current.forEach((s) => s.revert());
      splitsRef.current = [];
      ctx.revert();
    };
  }, []);

  useEffect(() => {
    if (phase === 'complete') {
      timelineRef.current?.progress(1, false);
      return;
    }
    if (phase !== 'heroText') return;
    timelineRef.current?.restart();
  }, [phase]);

  return (
    <div className={className}>
      <span
        ref={line1Ref}
        className={`${styles.text} font-display`}
        style={{ opacity: 0 }}
      >
        LARME EN
      </span>
      <div className="flex flex-row justify-center gap-3">
        <span
          ref={line2ARef}
          className={`${styles.text2} font-display`}
          style={{ opacity: 0 }}
        >
          PLEIN
        </span>
        <span
          ref={line2BRef}
          className={`${styles.text3} font-serif`}
          style={{ opacity: 0 }}
        >
          COEUR
        </span>
      </div>
    </div>
  );
}
