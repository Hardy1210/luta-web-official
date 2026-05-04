'use client';

import { useAnimation } from '@/context/AnimationContext';
import { useIsomorphicLayoutEffect } from '@/hooks/useIsomorphicLayoutEffect';
import gsap, { SplitText } from '@/lib/gsap';
import { useEffect, useRef } from 'react';
import styles from './SubText.module.scss';

interface SubTextProps {
  className?: string;
}

export function SubText({ className }: SubTextProps) {
  const ref = useRef<HTMLParagraphElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const splitRef = useRef<SplitText | null>(null);
  const clipsRef = useRef<HTMLDivElement[]>([]);

  const { phase } = useAnimation();

  useIsomorphicLayoutEffect(() => {
    if (!ref.current) return;

    const ctx = gsap.context(() => {
      splitRef.current = new SplitText(ref.current!, {
        type: 'lines',
        linesClass: styles.line,
      });

      const lines = splitRef.current.lines as HTMLElement[];

      lines.forEach((line) => {
        const clip = document.createElement('div');
        clip.className = styles.lineClip;
        line.parentNode!.insertBefore(clip, line);
        clip.appendChild(line);
        clipsRef.current.push(clip);
      });

      gsap.set(ref.current, { opacity: 1 });
      gsap.set(lines, { y: '110%' });

      timelineRef.current = gsap.timeline({
        paused: true,
        defaults: { ease: 'power3.out' },
        onComplete: () =>
          gsap.set(lines, { clearProps: 'transform,willChange' }),
      });

      timelineRef.current.to(lines, {
        y: '0%',
        duration: 0.85,
        stagger: { each: 0.12 },
      });
    }, ref);

    return () => {
      timelineRef.current?.kill();
      clipsRef.current.forEach((clip) => {
        while (clip.firstChild) {
          clip.parentNode?.insertBefore(clip.firstChild, clip);
        }
        clip.remove();
      });
      clipsRef.current = [];
      splitRef.current?.revert();
      ctx.revert();
    };
  }, []);

  useEffect(() => {
    if (phase === 'complete') {
      timelineRef.current?.progress(1, false);
      return;
    }
    if (phase !== 'subText') return;
    timelineRef.current?.restart();
  }, [phase]);

  return (
    <p ref={ref} className={`${styles.text} ${className}`}>
      Mon dernier single est disponible je vous invite à l écouter, une chanson
      qui marque le début d un nouveau cycle. Une chanson récente, tout
      simplement.
    </p>
  );
}
