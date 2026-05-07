'use client';

import gsap from '@/lib/gsap';
import { useEffect, useRef } from 'react';

export type TextPart = {
  text: string;
  className?: string;
};

export type TextLine = {
  parts: TextPart[];
};

export interface TextScrollAnimationProps {
  eyebrow?: string;
  lines: TextLine[];
  className?: string;
  once?: boolean;
  triggerStart?: string;
  barClassName?: string;
}

export default function TextScrollAnimation({
  eyebrow = '(BIO)',
  lines,
  className = '',
  once = true,
  triggerStart = 'top 90%',
  barClassName = 'bg-[var(--c-neon)]',
}: TextScrollAnimationProps) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const eyebrowRef = useRef<HTMLHeadingElement | null>(null);
  const underlineRef = useRef<HTMLSpanElement | null>(null);
  const eyebrowBarRef = useRef<HTMLSpanElement | null>(null);

  const textRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const barRefs = useRef<(HTMLSpanElement | null)[]>([]);

  const setTextRef =
    (index: number) =>
    (el: HTMLSpanElement | null): void => {
      textRefs.current[index] = el;
    };

  const setBarRef =
    (index: number) =>
    (el: HTMLSpanElement | null): void => {
      barRefs.current[index] = el;
    };

  useEffect(() => {
    if (
      !rootRef.current ||
      !eyebrowRef.current ||
      !underlineRef.current ||
      !eyebrowBarRef.current
    ) {
      return;
    }

    const textEls = textRefs.current
      .slice(0, lines.length)
      .filter(Boolean) as HTMLSpanElement[];

    const barEls = barRefs.current
      .slice(0, lines.length)
      .filter(Boolean) as HTMLSpanElement[];

    if (!textEls.length || !barEls.length) return;

    const ctx = gsap.context(() => {
      // ─────────────────────────────────────────────
      // VARIABLES DE CONTROL DE LA ANIMACIÓN
      // Cambia solo estos valores para afinar todo.
      // ─────────────────────────────────────────────

      // SCROLLTRIGGERS SEPARADOS
      const titleTriggerStart = 'top 90%'; // titulito
      const textTriggerStart = triggerStart; // texto grande

      // TITULITO "(BIO)"
      const eyebrowDuration = 0.39;
      const eyebrowEase = 'power4.out';

      // BARRA DEL TITULITO "(BIO)"
      const eyebrowBarEnterDuration = 0.39;
      const eyebrowBarExitDuration = 0.39;
      const eyebrowBarEnterEase = 'power4.out';
      const eyebrowBarExitEase = 'power4.out';

      // LÍNEA PEQUEÑA
      const underlineDuration = 0.4;
      const underlineEase = 'power3.out';
      const underlineStartOffset = '-=0.2';

      // STAGGER ENTRE CADA LÍNEA
      const lineStagger = 0.2;

      // BARRA: entrada
      const barEnterDuration = 0.39;
      const barEnterEase = 'power4.out';

      // TEXTO: reveal
      // Mantener sincronizado con barEnterDuration si quieres que texto y barra avancen juntos.
      const textRevealDuration = 0.39;
      const textRevealEase = 'power4.out';

      // BARRA: salida
      const barExitDuration = 0.39;
      const barExitEase = 'power4.out';

      // Momento en que la barra cambia su origen de izquierda a derecha.
      // Ojo: normalmente debe ser igual a barEnterDuration.
      const barDirectionChangeDelay = barEnterDuration;

      // Momento en que empieza la salida de la barra.
      // Ojo: normalmente debe ser igual a barEnterDuration.
      const barExitStartDelay = barEnterDuration;

      // ─────────────────────────────────────────────
      // CONFIGURACIÓN INICIAL DEL TITULITO "(BIO)"
      // El texto empieza oculto con clipPath.
      // ─────────────────────────────────────────────
      gsap.set(eyebrowRef.current, {
        autoAlpha: 1,
        y: 0,
        clipPath: 'inset(0 100% 0 0)',
        WebkitClipPath: 'inset(0 100% 0 0)',
      });

      // ─────────────────────────────────────────────
      // BARRA DEL TITULITO "(BIO)": estado inicial
      // La barra nace desde la izquierda.
      // ─────────────────────────────────────────────
      gsap.set(eyebrowBarRef.current, {
        scaleX: 0,
        transformOrigin: 'left center',
      });

      // ─────────────────────────────────────────────
      // CONFIGURACIÓN INICIAL DE LA LÍNEA PEQUEÑA
      // ─────────────────────────────────────────────
      gsap.set(underlineRef.current, {
        scaleX: 0,
        transformOrigin: 'center center',
      });

      // ─────────────────────────────────────────────
      // TEXTO: estado inicial
      // El texto empieza oculto desde la derecha.
      // No se mueve ni se escala, solo se revela.
      // ─────────────────────────────────────────────
      gsap.set(textEls, {
        clipPath: 'inset(0 100% 0 0)',
        WebkitClipPath: 'inset(0 100% 0 0)',
      });

      // ─────────────────────────────────────────────
      // BARRAS: estado inicial
      // Las barras empiezan invisibles, comprimidas a 0.
      // Nacen desde la izquierda.
      // ─────────────────────────────────────────────
      gsap.set(barEls, {
        scaleX: 0,
        transformOrigin: 'left center',
      });

      // ─────────────────────────────────────────────
      // SCROLLTRIGGER 1: TITULITO + BARRA PEQUEÑA + UNDERLINE
      // Marker violeta.
      // ─────────────────────────────────────────────
      const titleTl = gsap.timeline({
        scrollTrigger: {
          trigger: eyebrowRef.current,
          start: titleTriggerStart,
          once,
          // markers: {
          //   startColor: 'violet',
          //   endColor: 'violet',
          //   fontSize: '12px',
          //   indent: 20,
          // },
        },
      });

      // ─────────────────────────────────────────────
      // ANIMACIÓN DEL TITULITO "(BIO)"
      // Tiene su propio ScrollTrigger.
      // ─────────────────────────────────────────────
      titleTl
        .to(eyebrowBarRef.current, {
          scaleX: 1,
          duration: eyebrowBarEnterDuration,
          ease: eyebrowBarEnterEase,
        })
        .to(
          eyebrowRef.current,
          {
            clipPath: 'inset(0 0% 0 0)',
            WebkitClipPath: 'inset(0 0% 0 0)',
            duration: eyebrowDuration,
            ease: eyebrowEase,
          },
          '<',
        )
        .set(eyebrowBarRef.current, {
          transformOrigin: 'right center',
        })
        .to(eyebrowBarRef.current, {
          scaleX: 0,
          duration: eyebrowBarExitDuration,
          ease: eyebrowBarExitEase,
        })
        .to(
          underlineRef.current,
          {
            scaleX: 1,
            duration: underlineDuration,
            ease: underlineEase,
          },
          underlineStartOffset,
        );

      // ─────────────────────────────────────────────
      // SCROLLTRIGGER 2: TEXTO GRANDE + BARRAS GRANDES
      // Marker verde.
      // ─────────────────────────────────────────────
      const textTl = gsap.timeline({
        scrollTrigger: {
          trigger: textEls[0],
          start: textTriggerStart,
          once,
          //markers: {
          //  startColor: 'green',
          //  endColor: 'green',
          //  fontSize: '12px',
          //  indent: 80,
          //},
        },
      });

      const baseStart = 0;

      lines.forEach((_, index) => {
        const textEl = textEls[index];
        const barEl = barEls[index];

        // ───────────────────────────────────────────
        // STAGGER ENTRE CADA LÍNEA
        // Más alto = más espera entre líneas.
        // Ejemplo: 0.12 rápido / 0.2 más elegante.
        // ───────────────────────────────────────────
        const startAt = baseStart + index * lineStagger;

        textTl
          // ─────────────────────────────────────────
          // BARRA: entrada
          // La barra nace desde la izquierda
          // y se expande hacia la derecha.
          //
          // Cambia aquí:
          // duration = velocidad de entrada
          // ease = suavidad de entrada
          // ─────────────────────────────────────────
          .to(
            barEl,
            {
              scaleX: 1,
              duration: barEnterDuration,
              ease: barEnterEase,
            },
            startAt,
          )

          // ─────────────────────────────────────────
          // TEXTO: reveal
          // El texto aparece detrás de la barra.
          // Se revela de izquierda a derecha
          // y luego se queda visible.
          //
          // Cambia aquí:
          // duration = velocidad de aparición del texto
          // ease = suavidad del reveal
          // ─────────────────────────────────────────
          .to(
            textEl,
            {
              clipPath: 'inset(0 0% 0 0)',
              WebkitClipPath: 'inset(0 0% 0 0)',
              duration: textRevealDuration,
              ease: textRevealEase,
            },
            startAt,
          )

          // ─────────────────────────────────────────
          // BARRA: cambio de dirección
          // Cambiamos el origen al lado derecho.
          // Esto permite que la barra desaparezca
          // hacia la derecha.
          // ─────────────────────────────────────────
          .set(
            barEl,
            {
              transformOrigin: 'right center',
            },
            startAt + barDirectionChangeDelay,
          )

          // ─────────────────────────────────────────
          // BARRA: salida
          // La barra se retrae hacia la derecha.
          //
          // Cambia aquí:
          // duration = velocidad de salida
          // ease = suavidad de salida
          // ─────────────────────────────────────────
          .to(
            barEl,
            {
              scaleX: 0,
              duration: barExitDuration,
              ease: barExitEase,
            },
            startAt + barExitStartDelay,
          );
      });
    }, rootRef);

    return () => ctx.revert();
  }, [lines, once, triggerStart]);

  return (
    <div
      ref={rootRef}
      className={`relative flex min-h-[50vh] md:min-h-screen w-full items-center px-(--container-pad) text-(--color-text) justify-center  py-20 ${className}`}
    >
      <div className="mx-auto flex w-full flex-col items-center text-center">
        <div className="mb-4 inline-block">
          <div className="relative inline-block overflow-hidden align-top">
            <h2
              ref={eyebrowRef}
              className="relative z-10 text-[10px] uppercase tracking-[0.2em] md:text-xs"
            >
              {eyebrow}
            </h2>

            <span
              ref={eyebrowBarRef}
              aria-hidden="true"
              className={`absolute left-0 top-1/2 z-20 block h-[0.9em] w-full -translate-y-1/2 ${barClassName}`}
            />
          </div>
        </div>

        <span
          ref={underlineRef}
          aria-hidden="true"
          className="mb-8 block h-px w-4 bg-current opacity-70"
        />

        <p className="text-center text-(length:--text-section-p) font-black uppercase leading-[0.9] tracking-[-0.06em]">
          {lines.map((line, lineIndex) => (
            <span key={lineIndex} className="block leading-none">
              <span className="relative inline-block overflow-hidden align-top">
                <span
                  ref={setTextRef(lineIndex)}
                  className="relative z-10 block"
                >
                  {line.parts.map((part, partIndex) => (
                    <span
                      key={`${lineIndex}-${partIndex}`}
                      className={part.className ?? ''}
                    >
                      {part.text}
                    </span>
                  ))}
                </span>

                <span
                  ref={setBarRef(lineIndex)}
                  aria-hidden="true"
                  className={`absolute left-0 top-1/2 z-20 block h-[1.3em] w-full -translate-y-1/2 ${barClassName}`}
                />
              </span>
            </span>
          ))}
        </p>
      </div>
    </div>
  );
}
