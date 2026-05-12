'use client';

import gsap from '@/lib/gsap';
import { ComponentPropsWithoutRef, useEffect, useRef } from 'react';

type HeartProps = ComponentPropsWithoutRef<'svg'> & {
  size?: number;
  strokeWidth?: number;
  stroke?: string;
  duration?: number;
  triggerStart?: string;
  once?: boolean;
};

export const Heart = ({
  size,
  strokeWidth = 3.2,
  stroke = 'currentColor',
  duration = 1.5,
  triggerStart = 'top 95%',
  once = true,
  ...props
}: HeartProps) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const pathRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    const svg = svgRef.current;
    const path = pathRef.current;
    if (!svg || !path) return;

    const ctx = gsap.context(() => {
      gsap.set(path, { drawSVG: '0%', autoAlpha: 1, immediateRender: true });

      gsap
        .timeline({
          scrollTrigger: {
            trigger: svg,
            start: triggerStart,
            toggleActions: once
              ? 'play none none none'
              : 'play reverse play reverse',
            once,
          },
        })
        .to(path, {
          drawSVG: '100%',
          duration,
          ease: 'power2.inOut',
        });
    }, svg);

    return () => ctx.revert();
  }, [duration, triggerStart, once]);

  return (
    <svg
      ref={svgRef}
      width={size}
      height={size}
      viewBox="179 12 43 7"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Cœur"
      role="img"
      {...props}
    >
      <path
        ref={pathRef}
        fill="none"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m 200.84912,17.546353 c 0,0 -0.32629,-1.418683 -1.46348,-2.667241 -1.07504,-1.180328 -2.0531,-2.887948 -3.02604,-4.193421 -0.64971,-0.8717665 -1.71864,-1.221544 -2.81324,-1.2676323 0,0 -2.7264,-0.3397299 -3.83132,0.1693395 -2.58872,1.1927018 -5.43723,3.9547048 -6.47723,5.5882028 -1.13886,1.78878 -1.27005,4.95318 0.38101,7.239263 1.65106,2.286083 5.58174,4.994214 8.76533,5.623462 2.07028,0.409198 4.76925,0.164829 4.76925,0.164829 3.14418,0.264873 6.1533,0.376774 9.24159,0.138591 0,0 1.05837,-0.08467 1.8204,0 0.76202,0.08467 2.41108,-0.27217 2.41108,-0.27217 -0.29125,-0.08757 1.44769,-3.544011 3.45855,-7.026911 0.41206,-0.71372 1.48799,-3.503253 2.40495,-5.153737 0.95199,-1.713525 2.20868,-3.411907 2.30913,-4.015447 0.41226,-2.4770125 -0.55257,-5.5470063 -1.35471,-6.8582491 -0.25437,-0.4158195 -1.95129,-1.4515273 -3.79719,-2.087621 -1.96505,-0.6771509 -4.09894,-0.9456052 -4.84113,-1.0380838 -1.4382,-0.1792031 -5.67087,0.152873 -6.89858,1.1689098 -1.22771,1.0160369 -2.25004,3.5413337 -2.45542,4.4968874 -0.20095,0.9349507 -0.7023,3.8159377 0.29634,5.9268817 0.89317,1.888005 1.10071,4.064147 1.10071,4.064147 z"
      />
    </svg>
  );
};
