'use client';

/**
 * IntroImageCursorReveal
 *
 * Port fiel del shader GLSL de landonorris.com al canvas 2D.
 * Técnica: framebuffer feedback loop
 *   - Cada frame lee el output anterior (rVal)
 *   - Decae lentamente: rVal -= dt / pointerDuration
 *   - Acumula un smoothstep circular en la posición del cursor: rVal += f * 0.1
 *   - El resultado enmascara la imagen overlay (destination-in)
 *
 * No requiere Three.js — el 3D del sitio original es para el modelo del casco.
 * El efecto blob es puro 2D.
 */

import { useAnimation } from '@/context/AnimationContext';
import { useEffect, useRef } from 'react';
import styles from './IntroImageCursorReveal.module.scss';

interface IntroImageCursorRevealProps {
  hoverSrc: string;
  containerRef: React.RefObject<HTMLDivElement | null>;
  /**
   * Radio del blob en coordenadas UV normalizadas (-1..1).
   * Equivale a pointerRadius del shader. Default 0.375
   */
  pointerRadius?: number;
  /**
   * Segundos hasta que el blob desaparece completamente.
   * Equivale a pointerDuration del shader. Default 2.5
   */
  pointerDuration?: number;
  /**
   * Cuánto se acumula por frame (0-1). Equivale a `f * 0.1` del shader.
   * Default 0.10
   */
  accumRate?: number;
}

export function IntroImageCursorReveal({
  hoverSrc,
  containerRef,
  pointerRadius = 0.375,
  pointerDuration = 2.5,
  accumRate = 0.1,
}: IntroImageCursorRevealProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { phase } = useAnimation();
  const isActive = phase === 'complete';

  useEffect(() => {
    if (!isActive) return;
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // ── Offscreen A/B: simula el feedback loop del framebuffer ──────────
    // "current" = frame que se está construyendo
    // "prev"    = output del frame anterior (se lee para el decay)
    const fbA = document.createElement('canvas');
    const fbB = document.createElement('canvas');
    const ctxA = fbA.getContext('2d')!;
    const ctxB = fbB.getContext('2d')!;
    let current = fbA,
      ctxCurrent = ctxA;
    let prev = fbB,
      ctxPrev = ctxB;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0,
      h = 0;

    // Posición del cursor en UV normalizado (-1..1), igual que el shader
    let uvX = 10,
      uvY = 10; // 10 = fuera de pantalla (como el shader inicial)
    let inside = false;
    let lastTime = 0;
    let rafId = 0;

    const img = new window.Image();
    img.crossOrigin = 'anonymous';
    img.src = hoverSrc;
    let imgLoaded = false;
    img.onload = () => {
      imgLoaded = true;
    };

    const resize = () => {
      const rect = container.getBoundingClientRect();
      w = rect.width;
      h = rect.height;

      for (const [c, cx] of [
        [fbA, ctxA],
        [fbB, ctxB],
      ] as const) {
        (c as HTMLCanvasElement).width = w * dpr;
        (c as HTMLCanvasElement).height = h * dpr;
        (cx as CanvasRenderingContext2D).setTransform(dpr, 0, 0, dpr, 0, 0);
      }
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const onMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      // Convertir a UV -1..1 como el shader
      uvX = ((e.clientX - rect.left) / w) * 2 - 1;
      uvY = -(((e.clientY - rect.top) / h) * 2 - 1); // Y invertido como en GLSL
    };
    const onEnter = () => {
      inside = true;
    };
    const onLeave = () => {
      inside = false;
      uvX = 10;
      uvY = 10; // Fuera de pantalla → sin stamp
    };

    /**
     * Replica: f = 1. - smoothstep(r*0.1, r, distance(uv, mouse))
     * → Gradiente radial con inner duro y outer suave.
     * El aspect ratio del contenedor escala X igual que el shader.
     */
    const stampBlob = (time: number) => {
      const aspect = w / h;
      // Posición en píxeles: UV → coords de contenedor
      const px = (uvX / aspect + 1) * 0.5 * w;
      const py = (-uvY + 1) * 0.5 * h;

      // Radio en píxeles: pointerRadius está en UV-aspect space (-1..1)
      const outerR = pointerRadius * h * 0.5; // radio exterior
      const innerR = outerR * 0.1; // radio interior duro

      // Stamp sobre current con accumRate de opacidad
      ctxCurrent.globalCompositeOperation = 'source-over';
      ctxCurrent.globalAlpha = accumRate;

      const grad = ctxCurrent.createRadialGradient(
        px,
        py,
        innerR,
        px,
        py,
        outerR,
      );
      grad.addColorStop(0, 'rgba(255,255,255,1)');
      grad.addColorStop(1, 'rgba(255,255,255,0)');
      ctxCurrent.fillStyle = grad;
      ctxCurrent.fillRect(0, 0, w, h);
      ctxCurrent.globalAlpha = 1;
    };

    const render = (now: number) => {
      const dt = lastTime ? Math.min((now - lastTime) / 1000, 0.1) : 0;
      lastTime = now;

      // ── PASO 1: copiar prev → current (feedback) ──────────────────
      ctxCurrent.globalCompositeOperation = 'source-over';
      ctxCurrent.clearRect(0, 0, w, h);
      ctxCurrent.drawImage(prev, 0, 0, w, h);

      // ── PASO 2: decay — rVal -= dt / pointerDuration ──────────────
      // En canvas: destination-out con alpha proporcional al decay
      const decayAlpha = Math.min(dt / pointerDuration, 0.1);
      ctxCurrent.globalCompositeOperation = 'destination-out';
      ctxCurrent.fillStyle = `rgba(255,255,255,${decayAlpha})`;
      ctxCurrent.fillRect(0, 0, w, h);

      // ── PASO 3: acumular blob en posición del cursor ───────────────
      if (inside) stampBlob(now);

      // ── PASO 4: swap buffers ─────────────────────────────────────
      [current, ctxCurrent, prev, ctxPrev] = [
        prev,
        ctxPrev,
        current,
        ctxCurrent,
      ];

      // ── PASO 5: componer canvas visible con la máscara ────────────
      ctx.clearRect(0, 0, w, h);
      if (imgLoaded) {
        ctx.globalCompositeOperation = 'source-over';
        ctx.drawImage(img, 0, 0, w, h);
        ctx.globalCompositeOperation = 'destination-in';
        ctx.drawImage(prev, 0, 0, w, h); // prev = último frame completado
        ctx.globalCompositeOperation = 'source-over';
      }

      rafId = requestAnimationFrame(render);
    };

    resize();
    rafId = requestAnimationFrame(render);

    container.addEventListener('mousemove', onMove);
    container.addEventListener('mouseenter', onEnter);
    container.addEventListener('mouseleave', onLeave);
    window.addEventListener('resize', resize);

    return () => {
      cancelAnimationFrame(rafId);
      container.removeEventListener('mousemove', onMove);
      container.removeEventListener('mouseenter', onEnter);
      container.removeEventListener('mouseleave', onLeave);
      window.removeEventListener('resize', resize);
    };
  }, [
    isActive,
    hoverSrc,
    containerRef,
    pointerRadius,
    pointerDuration,
    accumRate,
  ]);

  return <canvas ref={canvasRef} className={styles.canvas} aria-hidden />;
}
