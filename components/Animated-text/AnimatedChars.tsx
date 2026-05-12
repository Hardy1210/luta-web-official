'use client';

/**
 * AnimatedChars — composant réutilisable d'animation char-by-char 3D.
 *
 * Basé sur HeroText : même SplitText, même timeline GSAP,
 * même logique de phase. Styles visuels entièrement externalisés.
 *
 * Usage :
 *   <AnimatedChars
 *     segments={[
 *       { text: 'LARME EN',  className: `${styles.title} font-display` },
 *       { text: 'PLEIN',     className: `${styles.sub}   font-display` },
 *       { text: 'COEUR',     className: `${styles.sub}   font-serif`   },
 *     ]}
 *     layout={[
 *       { type: 'block', indices: [0] },          // ligne 1 seule
 *       { type: 'row',   indices: [1, 2], gap: 3 }, // ligne 2 en flex row
 *     ]}
 *     phase="heroText"
 *   />
 */

import { useIsomorphicLayoutEffect } from '@/hooks/useIsomorphicLayoutEffect';
import gsap, { SplitText } from '@/lib/gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useRef } from 'react';
import styles from './AnimatedChars.module.scss';

export interface AnimatedSegment {
  text: string;
  className?: string;
  style?: React.CSSProperties;
}

export interface LayoutRow {
  type: 'block' | 'row';
  indices: number[];
  gap?: number;
  className?: string;
}

export interface AnimatedCharsProps {
  segments: AnimatedSegment[];
  layout?: LayoutRow[];
  stagger?: number;
  className?: string;
  /** ScrollTrigger start (défaut: 'top 80%') */
  triggerStart?: string;
  /** markers pour déboguer */
  markers?: boolean;
}

export function AnimatedChars({
  segments,
  layout,
  stagger = 0.04,
  className,
  triggerStart = 'top 80%',
  markers = false,
}: AnimatedCharsProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const segmentRefs = useRef<(HTMLSpanElement | null)[]>(
    Array(segments.length).fill(null),
  );
  const splitsRef = useRef<SplitText[]>([]);

  useIsomorphicLayoutEffect(() => {
    if (segmentRefs.current.some((r) => !r)) return;

    const ctx = gsap.context(() => {
      const allChars: Element[] = [];

      segmentRefs.current.forEach((el) => {
        if (!el) return;
        const split = new SplitText(el, {
          type: 'lines,words,chars',
          linesClass: styles.line,
          wordsClass: styles.word,
          charsClass: styles.char,
        });
        splitsRef.current.push(split);
        allChars.push(...(split.chars as Element[]));
      });

      gsap.set(segmentRefs.current.filter(Boolean) as HTMLSpanElement[], {
        opacity: 1,
        perspective: 900,
        transformStyle: 'preserve-3d',
      });

      const isMobile = window.matchMedia('(max-width: 767px)').matches;
      const initialY = isMobile ? 5 : 7;
      const initialRotX = isMobile ? -100 : -80;
      const initialZ = isMobile ? -35 : -80;

      gsap.set(allChars, {
        opacity: 0,
        y: initialY,
        rotateX: initialRotX,
        z: initialZ,
        transformOrigin: '50% 50% -20px',
        transformStyle: 'preserve-3d',
        backfaceVisibility: 'hidden',
        willChange: 'transform, opacity',
      });

      const tl = gsap.timeline({
        paused: true,
        defaults: { ease: 'power4.out' },
        onComplete: () => {
          gsap.set(allChars, {
            clearProps:
              'transform,willChange,backfaceVisibility,transformStyle',
          });
          gsap.set(segmentRefs.current.filter(Boolean) as HTMLSpanElement[], {
            clearProps: 'perspective,transformStyle',
          });
        },
      });

      tl.to(allChars, {
        opacity: 1,
        duration: 0.3,
        stagger: { each: stagger, from: 'start' },
      }).to(
        allChars,
        {
          y: 0,
          z: 0,
          rotateX: 0,
          duration: 1.95,
          stagger: { each: stagger, from: 'start' },
        },
        '<',
      );

      ScrollTrigger.create({
        trigger: wrapperRef.current,
        start: triggerStart,
        once: true,
        markers,
        onEnter: () => tl.restart(),
      });
    });

    return () => {
      splitsRef.current.forEach((s) => s.revert());
      splitsRef.current = [];
      ctx.revert();
    };
  }, [stagger, triggerStart, markers]);

  const effectiveLayout: LayoutRow[] = layout ?? [
    { type: 'block', indices: segments.map((_, i) => i) },
  ];

  return (
    <div ref={wrapperRef} className={className}>
      {effectiveLayout.map((group, gi) => {
        const groupSegments = group.indices.map((idx) => ({
          segment: segments[idx],
          idx,
        }));

        if (group.type === 'block') {
          return groupSegments.map(({ segment, idx }) => (
            <span
              key={idx}
              ref={(el) => {
                segmentRefs.current[idx] = el;
              }}
              className={segment.className}
              style={{ opacity: 0, ...segment.style }}
            >
              {segment.text}
            </span>
          ));
        }

        return (
          <div
            key={gi}
            className={`${styles.row} ${group.className ?? ''}`}
            style={{ gap: `${group.gap ?? 0.75}rem` }}
          >
            {groupSegments.map(({ segment, idx }) => (
              <span
                key={idx}
                ref={(el) => {
                  segmentRefs.current[idx] = el;
                }}
                className={segment.className}
                style={{ opacity: 0, ...segment.style }}
              >
                {segment.text}
              </span>
            ))}
          </div>
        );
      })}
    </div>
  );
}
