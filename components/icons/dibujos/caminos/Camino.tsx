'use client';

import gsap from '@/lib/gsap';
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ComponentPropsWithoutRef, useEffect, useRef } from 'react';

gsap.registerPlugin(DrawSVGPlugin, ScrollTrigger);

const PATH_IDS = ['path6', 'path7'];

type CaminoProps = ComponentPropsWithoutRef<'svg'> & {
  size?: number;
  strokeWidth?: number;
  duration?: number;
  triggerStart?: string;
  once?: boolean;

  /**
   * Tiempo entre un path y otro.
   * 0 = uno después del otro
   * 0.3 = espera 0.3s
   * -0.2 = se superponen un poco
   */
  gap?: number;
};

export const Camino = ({
  size,
  strokeWidth = 0.946,
  duration = 2,
  triggerStart = 'top 95%',
  once = true,
  gap = -0.7,
  ...props
}: CaminoProps) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    const paths = PATH_IDS.map((id) =>
      svg.querySelector<SVGPathElement>(`#${id}`),
    ).filter(Boolean) as SVGPathElement[];

    if (!paths.length) return;

    const ctx = gsap.context(() => {
      gsap.set(paths, {
        drawSVG: '0%',
        autoAlpha: 1,
        immediateRender: true,
      });

      const lengths = paths.map((path) => path.getTotalLength());
      const totalLength = lengths.reduce((acc, len) => acc + len, 0);

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: svg,
          start: triggerStart,
          toggleActions: once
            ? 'play none none none'
            : 'play reverse play reverse',
          once,
          // markers: true,
        },
      });

      let cursor = 0;

      paths.forEach((path, index) => {
        const partDuration = (lengths[index] / totalLength) * duration;

        tl.to(
          path,
          {
            drawSVG: '100%',
            duration: partDuration,
            ease: 'power2.inOut',
          },
          cursor,
        );

        cursor += partDuration + gap;
      });
    }, svg);

    return () => ctx.revert();
  }, [duration, triggerStart, once, gap]);

  return (
    <svg
      ref={svgRef}
      width={size}
      height={size}
      viewBox="83 94 39 23"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <title>Camino</title>

      <path
        id="path6"
        d="m 84.520903,117.4989 c 1.967111,-4.31123 8.346324,-6.01898 12.975244,-6.9096 3.897723,-0.74993 9.111293,-1.81438 12.187373,-3.26384 3.07607,-1.44946 3.55923,-2.07756 3.59144,-2.75398 0.0322,-0.67641 -1.61587,-1.54893 -3.51092,-2.12587 -13.009863,-3.960779 1.2184,-7.677469 4.84892,-7.689239 l 2.15922,-0.007"
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        id="path7"
        d="m 108.5619,117.03379 c -6.72613,-2.71231 4.61083,-6.99527 6.91596,-7.78828 3.44697,-1.24084 5.22201,-1.96061 5.62569,-3.02922 0.92849,-2.45786 -2.16555,-3.37474 -5.54184,-4.53244 -2.61227,-0.89572 -6.28091,-1.30979 -7.69086,-3.448879"
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
