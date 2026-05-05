'use client';

import { useAnimation } from '@/context/AnimationContext';
import gsap from '@/lib/gsap';
import { useEffect, useRef } from 'react';
import styles from './DibujoLuta.module.scss';

// ─── Props ────────────────────────────────────────────────────────────────────

interface DibujoLutaProps {
  /** Dispara la animación cuando pasa a true (default: true) */
  play?: boolean;
  /** Grosor del trazo (default: 3.2) */
  strokeWidth?: number;
  /** Color del trazo — acepta cualquier valor CSS (default: 'currentColor') */
  stroke?: string;
  /** Duración de cada trazo en segundos (default: 0.7) */
  duration?: number;
  /** Tiempo entre el inicio de cada trazo en segundos (default: 0.15) */
  stagger?: number;
  /** Callback al terminar toda la animación */
  onComplete?: () => void;
  className?: string;
}

// ─── Orden de animación ───────────────────────────────────────────────────────
//
//  Editá este array para controlar el orden exacto en que se dibujan los trazos.
//  Cada string es el id del path en el SVG.
//  Los paths se animan UNO DESPUÉS DEL OTRO según este orden.
//  Si querés que dos paths arranquen en paralelo, poné el mismo stagger offset
//  manualmente en el timeline (ver comentario abajo).
//
const DRAW_ORDER = [
  'p-l', // L  — trazo largo principal
  'p-diag', // diagonal que conecta L con T
  'p-t', // T  — cuerpo vertical
  'p-bar', // T  — barra horizontal
  'p-o', // O  — círculo
];

// ─── Componente ───────────────────────────────────────────────────────────────

export default function DibujoLuta({
  play,
  strokeWidth = 3.2,
  stroke = 'currentColor',
  duration = 3,
  onComplete,
  className = '',
}: DibujoLutaProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const { phase } = useAnimation();

  // ── 1. Inicialización — mount only, DrawSVG maneja dasharray/dashoffset ────
  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    DRAW_ORDER.forEach((id) => {
      const path = svg.getElementById(id) as SVGPathElement | null;
      if (path) gsap.set(path, { drawSVG: 0 });
    });
  }, []);

  // ── 2. Animación — reacciona a fase ────────────────────────────────────────
  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    if (phase === 'complete') {
      if (!tlRef.current?.isActive()) {
        gsap.set(svg, { opacity: 1 });
        DRAW_ORDER.forEach((id) => {
          const path = svg.getElementById(id) as SVGPathElement | null;
          if (path) gsap.set(path, { drawSVG: true });
        });
      }
      return;
    }

    const shouldPlay = phase === 'dibujo' || play === true;
    if (!shouldPlay) return;

    tlRef.current?.kill();

    const tl = gsap.timeline({ onComplete });
    tlRef.current = tl;

    tl.set(svg, { opacity: 1 });

    const totalLength = DRAW_ORDER.reduce((sum, id) => {
      const path = svg.getElementById(id) as SVGPathElement | null;
      return sum + (path?.getTotalLength() ?? 0);
    }, 0);

    const speed = totalLength / duration;
    const lastIndex = DRAW_ORDER.length - 1;

    DRAW_ORDER.forEach((id, i) => {
      const path = svg.getElementById(id) as SVGPathElement | null;
      if (!path) return;
      const pathDuration = path.getTotalLength() / speed;
      const ease = i === lastIndex ? 'power2.out' : 'none';
      tl.to(path, { drawSVG: true, duration: pathDuration, ease }, '>');
    });
  }, [phase, play, duration, onComplete]);

  // ── 3. Cleanup — solo en unmount ────────────────────────────────────────────
  useEffect(() => {
    return () => {
      tlRef.current?.kill();
    };
  }, []);

  return (
    <svg
      ref={svgRef}
      viewBox="0 0 220.51639 68.273521"
      xmlns="http://www.w3.org/2000/svg"
      className={`${styles.svg} ${className}`}
      style={{ opacity: 0 }}
      aria-label="Luta"
      role="img"
    >
      {/* L — trazo largo */}
      <path
        id="p-l"
        fill="none"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m 1.6,1.6 c 0,0 0.4769573,3.82143 2.4738949,9.632699 2.0986444,6.107246 4.9201663,13.049247 6.7978331,17.919177 3.439584,8.920927 9.591616,20.407572 12.994036,23.841759 3.479613,3.512101 14.138808,14.112781 17.360333,13.652173 2.93615,-0.419806 8.471683,0.733414 9.998382,-5.732606 C 52.751178,54.447183 46.742655,49.319533 45.237424,47.711746 43.4718,45.825824 38.187982,36.066924 38.561857,36.066924 c 0,0 -1.152264,-1.128457 0.269418,-0.419094 1.182845,0.590193 10.691216,12.984043 11.97411,16.85356 0.642942,1.939268 3.725985,2.078814 3.725985,2.078814 0,0 2.508697,0.778318 7.74737,-1.526699 5.238673,-2.305016 1.867066,-9.38411 1.458684,-10.251144 C 63.332888,41.943494 53.55943,31.037798 53.55943,31.037798 c 0,0 -0.318081,-0.629043 0.359224,-0.538835 1.243339,0.165595 6.067264,5.475074 9.522797,9.896373 2.083898,2.666316 3.365087,5.312159 3.588853,5.721696 0.37816,0.692109 4.31068,1.714455 5.657767,1.504908 0,0 4.658325,-0.491856 7.924061,-3.959143"
      />

      {/* T — cuerpo vertical */}
      <path
        id="p-t"
        fill="none"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        d="m 67.50562,5.0782217 9.253648,12.3390263 c 0,0 8.007632,13.083577 9.531688,14.903976 1.524055,1.8204 4.529831,4.656836 5.926882,4.95318 1.397051,0.296344 2.518994,1.07561 5.546233,0.650431 3.027229,-0.425179 7.767459,-5.307267 7.767459,-5.307267 l 4.25528,-4.614501 c -1.4893,-0.739808 -5.66208,-7.267044 -5.17212,-7.366268 0,0 -1.7708,-4.78384 -0.62776,-7.916621 1.14304,-3.1327799 4.28733,-5.7878169 6.47724,-6.4772347 2.28608,-0.7196929 4.01603,-0.9496122 8.67864,-0.8466975 1.0187,0.022485 2.65068,0.1809182 3.62849,1.2042554 0.953,0.9973667 3.07483,4.2198058 3.55755,5.0561688 0,0 4.87339,3.901787 4.87339,5.358059 0,3.61266 -3.0272,5.917384 -5.9632,8.236572 -0.87384,0.690262 -6.01175,2.76195 -8.53394,3.130743 -3.11991,0.456193 -6.44293,0.0041 -6.91829,-0.378977"
      />

      {/* diagonal conector L → T */}
      <path
        id="p-diag"
        fill="none"
        stroke={stroke}
        strokeWidth={strokeWidth}
        d="m 62.247958,31.14965 c 0.304676,-0.181159 2.741685,-2.684041 5.793711,-6.013963 3.044404,-3.321605 6.601617,-6.419849 8.717599,-7.718439 C 82.277554,14.030645 93.176687,6.5812245 93.897675,5.7347259"
      />

      {/* T — barra horizontal */}
      <path
        id="p-bar"
        fill="none"
        stroke={stroke}
        strokeWidth={strokeWidth}
        d="m 121.39276,4.0661152 c 5.66863,2.8830203 7.17649,8.4880478 11.22573,11.7645628 1.04431,0.845023 3.91891,0.971239 6.57853,0.631864 4.60643,-0.587793 9.72872,-2.546632 11.72984,-4.128379"
      />

      {/* O — círculo */}
      <path
        id="p-o"
        fill="none"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m 200.84912,17.546353 c 0,0 -0.32629,-1.418683 -1.46348,-2.667241 -1.07504,-1.180328 -2.0531,-2.887948 -3.02604,-4.193421 -0.64971,-0.8717665 -1.71864,-1.221544 -2.81324,-1.2676323 0,0 -2.7264,-0.3397299 -3.83132,0.1693395 -2.58872,1.1927018 -5.43723,3.9547048 -6.47723,5.5882028 -1.13886,1.78878 -1.27005,4.95318 0.38101,7.239263 1.65106,2.286083 5.58174,4.994214 8.76533,5.623462 2.07028,0.409198 4.76925,0.164829 4.76925,0.164829 3.14418,0.264873 6.1533,0.376774 9.24159,0.138591 0,0 1.05837,-0.08467 1.8204,0 0.76202,0.08467 2.41108,-0.27217 2.41108,-0.27217 -0.29125,-0.08757 1.44769,-3.544011 3.45855,-7.026911 0.41206,-0.71372 1.48799,-3.503253 2.40495,-5.153737 0.95199,-1.713525 2.20868,-3.411907 2.30913,-4.015447 0.41226,-2.4770125 -0.55257,-5.5470063 -1.35471,-6.8582491 -0.25437,-0.4158195 -1.95129,-1.4515273 -3.79719,-2.087621 -1.96505,-0.6771509 -4.09894,-0.9456052 -4.84113,-1.0380838 -1.4382,-0.1792031 -5.67087,0.152873 -6.89858,1.1689098 -1.22771,1.0160369 -2.25004,3.5413337 -2.45542,4.4968874 -0.20095,0.9349507 -0.7023,3.8159377 0.29634,5.9268817 0.89317,1.888005 1.10071,4.064147 1.10071,4.064147 z"
      />
    </svg>
  );
}
