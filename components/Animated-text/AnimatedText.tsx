'use client';

import gsap, { ScrollTrigger, SplitText } from '@/lib/gsap';
import { useEffect, useRef } from 'react';
import styles from './AnimatedText.module.scss';

gsap.registerPlugin(ScrollTrigger, SplitText);

type AnimatedTextTag =
  | 'p'
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'span'
  | 'div'
  | 'blockquote';

interface AnimatedTextProps {
  children: React.ReactNode;
  as?: AnimatedTextTag;
  className?: string;
  'aria-hidden'?: boolean | 'true' | 'false';
  /** Duración por línea en segundos. Default: 0.85 */
  duration?: number;
  /** Delay entre líneas. Default: 0.12 */
  stagger?: number;
  /** Ease de GSAP. Default: 'power3.out' */
  ease?: string;
  /** Delay inicial antes de que empiece la animación. Default: 0 */
  delay?: number;
  /** Muestra los markers de ScrollTrigger. Solo usar en desarrollo. Default: false */
  markers?: boolean;
}

export function AnimatedText({
  children,
  as: Tag = 'p',
  className,
  'aria-hidden': ariaHidden,
  duration = 0.85,
  stagger = 0.12,
  ease = 'power3.out',
  delay = 0,
  markers = false,
}: AnimatedTextProps) {
  const ref = useRef<HTMLElement>(null);
  const clipsRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    if (!ref.current) return;

    const ctx = gsap.context(() => {
      const split = new SplitText(ref.current!, {
        type: 'lines',
        linesClass: styles.line,
      });

      const lines = split.lines as HTMLElement[];

      lines.forEach((line) => {
        const clip = document.createElement('div');
        clip.className = styles.lineClip;
        line.parentNode!.insertBefore(clip, line);
        clip.appendChild(line);
        clipsRef.current.push(clip);
      });

      gsap.set(ref.current, { opacity: 1 });
      gsap.set(lines, { y: '110%' });

      gsap.to(lines, {
        y: '0%',
        duration,
        stagger: { each: stagger },
        ease,
        delay,
        onComplete: () =>
          gsap.set(lines, { clearProps: 'transform,willChange' }),
        scrollTrigger: {
          trigger: ref.current,
          start: 'top 90%', // top del elemento llega al 85% del viewport
          markers,
        },
      });
    }, ref);

    return () => {
      clipsRef.current.forEach((clip) => {
        while (clip.firstChild)
          clip.parentNode?.insertBefore(clip.firstChild, clip);
        clip.remove();
      });
      clipsRef.current = [];
      ctx.revert();
    };
  }, [duration, stagger, ease, delay, markers]);

  return (
    <Tag
      // @ts-expect-error — Tag dinámico con ref genérico
      ref={ref}
      className={`${styles.root} ${className ?? ''}`}
      aria-hidden={ariaHidden}
    >
      {children}
    </Tag>
  );
}
