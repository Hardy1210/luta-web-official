'use client';

import gsap, { SplitText } from '@/lib/gsap';
import { useGSAP } from '@gsap/react';
import { useRef } from 'react';
import styles from './BarrelSplitTextProps.module.scss';

type BarrelSplitTextPropsProps = {
  children: string;
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span';
  className?: string;
  delay?: number;
  duration?: number;
  stagger?: number;
  once?: boolean;
  drumRadius?: number;
};

export function BarrelSplitTextProps({
  children,
  as: Tag = 'h1',
  className = '',
  delay = 0,
  duration = 1.5,
  stagger = 0.045,
  once = true,
  drumRadius = 60,
}: BarrelSplitTextPropsProps) {
  const rootRef = useRef<HTMLElement | null>(null);

  useGSAP(
    () => {
      if (!rootRef.current) return;

      const split = new SplitText(rootRef.current, {
        type: 'lines,words,chars',
        linesClass: styles.line,
        wordsClass: styles.word,
        charsClass: styles.char,
      });

      gsap.set(rootRef.current, {
        perspective: 1100,
        transformStyle: 'preserve-3d',
      });

      gsap.set(split.lines, {
        //overflow: 'hidden',
        transformStyle: 'preserve-3d',
      });

      gsap.set(split.words, {
        transformStyle: 'preserve-3d',
      });

      // gsap.set — estado inicial (letra en la parte trasera del tambor)
      gsap.set(split.chars, {
        opacity: 0,
        rotateX: -180, // ← venía de -105, ahora gira desde atrás
        scaleY: 0.9, // ligera compresión inicial
        transformOrigin: `50% 50% -${drumRadius}px`, // ← clave: radio del tambor (era -1585px)
        transformStyle: 'preserve-3d',
        backfaceVisibility: 'hidden',
        willChange: 'transform, opacity',
      });

      const tl = gsap.timeline({
        delay,
        scrollTrigger: {
          trigger: rootRef.current,
          start: 'top 85%',
          once,
        },
        onComplete: () => {
          gsap.set(split.chars, {
            clearProps: 'willChange',
          });
        },
      });

      // tl.to — estado final (letra estampada al frente)
      tl.to(split.chars, {
        opacity: 1,
        rotateX: 0,
        scaleY: 1,
        duration,
        ease: 'power4.out',
        stagger: { each: stagger, from: 'start' },
      });

      return () => {
        split.revert();
      };
    },
    {
      scope: rootRef,
      dependencies: [children, delay, duration, stagger, once],
    },
  );

  return (
    <Tag ref={rootRef as any} className={`${styles.text} ${className}`}>
      {children}
    </Tag>
  );
}
