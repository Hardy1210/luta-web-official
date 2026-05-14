'use client';

import gsap, { ScrollTrigger, SplitText } from '@/lib/gsap';
import { useEffect, useRef } from 'react';
import styles from './AnimatedTextChars.module.scss';

gsap.registerPlugin(ScrollTrigger, SplitText);

type AnimatedCharsTag =
  | 'p'
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'span'
  | 'div'
  | 'blockquote';

interface AnimatedCharsProps {
  children: React.ReactNode;
  as?: AnimatedCharsTag;
  className?: string;
  /** Duración por carácter en segundos. Default: 0.5 */
  duration?: number;
  /** Delay entre caracteres. Default: 0.03 */
  stagger?: number;
  /** Ease de GSAP. Default: 'power3.out' */
  ease?: string;
  /** Delay inicial antes de que empiece la animación. Default: 0 */
  delay?: number;
  /** Muestra los markers de ScrollTrigger. Solo usar en desarrollo. Default: false */
  markers?: boolean;
}

export function AnimatedTextChars({
  children,
  as: Tag = 'p',
  className,
  duration = 0.5,
  stagger = 0.03,
  ease = 'power3.out',
  delay = 0,
  markers = false,
}: AnimatedCharsProps) {
  const ref = useRef<HTMLElement>(null);
  const clipsRef = useRef<HTMLSpanElement[]>([]);

  useEffect(() => {
    if (!ref.current) return;

    const ctx = gsap.context(() => {
      const split = new SplitText(ref.current!, {
        type: 'chars',
        charsClass: styles.char,
      });

      const chars = split.chars as HTMLElement[];

      // Envuelve cada char en un clip span para el overflow hidden
      chars.forEach((char) => {
        const clip = document.createElement('span');
        clip.className = styles.charClip;
        char.parentNode!.insertBefore(clip, char);
        clip.appendChild(char);
        clipsRef.current.push(clip);
      });

      gsap.set(ref.current, { opacity: 1 });
      gsap.set(chars, { y: '110%' });

      gsap.to(chars, {
        y: '0%',
        duration,
        stagger: { each: stagger },
        ease,
        delay,
        onComplete: () =>
          gsap.set(chars, { clearProps: 'transform,willChange' }),
        scrollTrigger: {
          trigger: ref.current,
          start: 'top 95%',
          markers,
        },
      });
    }, ref);

    return () => {
      // Desenvuelve los clips antes de revertir
      clipsRef.current.forEach((clip) => {
        while (clip.firstChild)
          clip.parentNode?.insertBefore(clip.firstChild, clip);
        clip.remove();
      });
      clipsRef.current = [];
      ctx.revert();
    };
  }, []);

  return (
    // @ts-expect-error — Tag dinámico con ref genérico
    <Tag ref={ref} className={`${styles.root} ${className ?? ''}`}>
      {children}
    </Tag>
  );
}
