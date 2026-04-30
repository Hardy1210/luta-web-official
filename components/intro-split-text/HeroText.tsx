//orquestacion intro
'use client';

import { useAnimation } from '@/context/AnimationContext';
import gsap, { SplitText } from '@/lib/gsap';
import { useEffect, useRef } from 'react';
import styles from './HeroText.module.scss';

export function HeroText() {
  const rootRef = useRef<HTMLHeadingElement | null>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const splitRef = useRef<SplitText | null>(null);

  const { phase } = useAnimation();

  useEffect(() => {
    if (!rootRef.current) return;

    const ctx = gsap.context(() => {
      splitRef.current = new SplitText(rootRef.current!, {
        type: 'lines,words,chars',
        linesClass: styles.line,
        wordsClass: styles.word,
        charsClass: styles.char,
      });

      const chars = splitRef.current.chars;

      gsap.set(rootRef.current, {
        opacity: 1,
        perspective: 900,
        transformStyle: 'preserve-3d',
      });

      gsap.set(chars, {
        opacity: 0,
        y: 48,
        rotateX: -80,
        z: -80,
        transformOrigin: '50% 50% -40px',
        transformStyle: 'preserve-3d',
        backfaceVisibility: 'hidden',
        willChange: 'transform, opacity',
      });

      timelineRef.current = gsap.timeline({
        paused: true,
        defaults: {
          ease: 'power4.out',
        },
        onComplete: () => {
          gsap.set(chars, {
            clearProps: 'willChange',
          });
        },
      });

      timelineRef.current.to(chars, {
        opacity: 1,
        y: 0,
        z: 0,
        rotateX: 0,
        duration: 1.15,
        stagger: {
          each: 0.025,
          from: 'start',
        },
      });
    }, rootRef);

    return () => {
      timelineRef.current?.kill();
      splitRef.current?.revert();
      ctx.revert();
    };
  }, []);

  useEffect(() => {
    if (phase !== 'heroText') return;

    timelineRef.current?.restart();
  }, [phase]);

  return (
    <h1 ref={rootRef} className={styles.text}>
      Créons tratalala
    </h1>
  );
}
