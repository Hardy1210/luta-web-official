'use client';

import gsap from '@/lib/gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Image from 'next/image';
import { useEffect, useRef } from 'react';
import styles from './ImageExpandDesktop.module.scss';

// ─── CONFIG ────────────────────────────────────────────────────────────────
const BACKGROUND_SRC = '/images/section-expand/background.webp';
const SHADOW_SRC = '/images/section-expand/shadow.webp';
const SUBJECT_SRC = '/images/section-expand/l3.webp';

const SCROLL_HEIGHT = '350vh';

// Tamaño real de tu imagen original
const IMAGE_WIDTH = 4898;
const IMAGE_HEIGHT = 3265;
const IMAGE_RATIO = IMAGE_WIDTH / IMAGE_HEIGHT;

// Ahora INITIAL_SIZE representa el ancho visual inicial
const INITIAL_SIZE = 400;

const HOVER_CONFIG = {
  enabledAtProgress: 0,

  backgroundX: -4,
  backgroundY: -3,

  shadowX: 3,
  shadowY: 2,

  subjectX: 10,
  subjectY: 7,

  backgroundScale: 1.04,
  shadowScale: 1.01,
  subjectScale: 1.01,
};
// ───────────────────────────────────────────────────────────────────────────

export default function ImageExpandDesktop() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const imgBoxRef = useRef<HTMLDivElement>(null);

  const sceneRef = useRef<HTMLDivElement>(null);
  const backgroundLayerRef = useRef<HTMLDivElement>(null);
  const shadowLayerRef = useRef<HTMLDivElement>(null);
  const subjectLayerRef = useRef<HTMLDivElement>(null);

  const overlayRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLParagraphElement>(null);

  //barra after
  // barra after
  const afterRef = useRef<HTMLDivElement>(null);
  const afterBlocksRef = useRef<HTMLDivElement[]>([]);

  useGSAP(
    () => {
      const section = sectionRef.current;
      const imgBox = imgBoxRef.current;
      const scene = sceneRef.current;
      const backgroundLayer = backgroundLayerRef.current;
      const shadowLayer = shadowLayerRef.current;
      const subjectLayer = subjectLayerRef.current;
      const overlay = overlayRef.current;
      const label = labelRef.current;

      const after = afterRef.current;

      if (
        !section ||
        !imgBox ||
        !scene ||
        !backgroundLayer ||
        !shadowLayer ||
        !subjectLayer ||
        !overlay ||
        !label ||
        !after
      ) {
        return;
      }

      const afterBlocks = afterBlocksRef.current.filter(Boolean);

      if (!afterBlocks.length) return;
      const getCoverSize = () => {
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        const viewportRatio = viewportWidth / viewportHeight;

        if (viewportRatio > IMAGE_RATIO) {
          return {
            width: viewportWidth,
            height: viewportWidth / IMAGE_RATIO,
          };
        }

        return {
          width: viewportHeight * IMAGE_RATIO,
          height: viewportHeight,
        };
      };

      const getInitialScale = () => {
        const { width } = getCoverSize();
        return INITIAL_SIZE / width;
      };

      const setBoxBase = () => {
        const { width, height } = getCoverSize();

        gsap.set(imgBox, {
          width,
          height,
          xPercent: -50,
          yPercent: -50,
          scale: getInitialScale(),
          borderRadius: 12,
          transformOrigin: 'center center',
          force3D: true,
        });
      };

      setBoxBase();

      gsap.set(scene, {
        width: '100%',
        height: '100%',
      });

      gsap.set([backgroundLayer, shadowLayer, subjectLayer], {
        x: 0,
        y: 0,
        rotationX: 0,
        rotationY: 0,
        z: 0,
        transformOrigin: 'center center',
        force3D: true,
        willChange: 'transform',
      });

      gsap.set(backgroundLayer, {
        scale: HOVER_CONFIG.backgroundScale,
      });

      gsap.set(shadowLayer, {
        scale: HOVER_CONFIG.shadowScale,
      });

      gsap.set(subjectLayer, {
        scale: HOVER_CONFIG.subjectScale,
      });

      gsap.set(after, {
        pointerEvents: 'none',
      });

      gsap.set(afterBlocks, {
        autoAlpha: 0,
        y: 12,
        force3D: true,
      });
      const backgroundXTo = gsap.quickTo(backgroundLayer, 'x', {
        duration: 0.8,
        ease: 'power3.out',
      });

      const backgroundYTo = gsap.quickTo(backgroundLayer, 'y', {
        duration: 0.8,
        ease: 'power3.out',
      });

      const shadowXTo = gsap.quickTo(shadowLayer, 'x', {
        duration: 0.75,
        ease: 'power3.out',
      });

      const shadowYTo = gsap.quickTo(shadowLayer, 'y', {
        duration: 0.75,
        ease: 'power3.out',
      });

      const subjectXTo = gsap.quickTo(subjectLayer, 'x', {
        duration: 0.65,
        ease: 'power3.out',
      });

      const subjectYTo = gsap.quickTo(subjectLayer, 'y', {
        duration: 0.65,
        ease: 'power3.out',
      });

      const handlePointerMove = (event: PointerEvent) => {
        const x = (event.clientX / window.innerWidth - 0.5) * 2;
        const y = (event.clientY / window.innerHeight - 0.5) * 2;

        backgroundXTo(x * HOVER_CONFIG.backgroundX);
        backgroundYTo(y * HOVER_CONFIG.backgroundY);

        shadowXTo(x * HOVER_CONFIG.shadowX);
        shadowYTo(y * HOVER_CONFIG.shadowY);

        subjectXTo(x * HOVER_CONFIG.subjectX);
        subjectYTo(y * HOVER_CONFIG.subjectY);
      };

      imgBox.classList.add(styles.isHoverReady);
      window.addEventListener('pointermove', handlePointerMove);

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1.2,
          invalidateOnRefresh: true,
          onRefreshInit: () => {
            setBoxBase();
          },
        },
      });

      gsap.set(imgBox, { transformPerspective: 900 });

      tl.to(label, { opacity: 0, y: -12, duration: 0.15 }, 0);

      tl.fromTo(
        imgBox,
        {
          scale: () => getInitialScale(),
          borderRadius: 12,
        },
        {
          scale: 1,
          borderRadius: 0,
          ease: 'power2.inOut',
          duration: 1,
        },
        0.1,
      );

      tl.fromTo(
        imgBox,
        { rotationX: 0, rotationY: 0 },
        { rotationX: 8, rotationY: -5, ease: 'power1.in', duration: 0.5 },
        0.1,
      );

      tl.to(
        imgBox,
        { rotationX: 0, rotationY: 0, ease: 'power2.out', duration: 0.5 },
        0.6,
      );

      tl.to(overlay, { opacity: 1, duration: 0.3 }, 0.85);
      tl.to(
        afterBlocks,
        {
          autoAlpha: 1,
          y: 0,
          ease: 'power2.out',
          duration: 0.22,
          stagger: 0.04,
        },
        1.1,
      );

      tl.set(
        after,
        {
          pointerEvents: 'auto',
        },
        1.1,
      );

      return () => {
        window.removeEventListener('pointermove', handlePointerMove);
      };
    },
    { scope: sectionRef },
  );

  // useGSAP runs as useLayoutEffect; this useEffect runs after it,
  // guaranteeing the ScrollTrigger is already registered before we refresh.
  // Without this, Lenis has a stale scroll limit and clamps wheel input.
  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      ScrollTrigger.refresh();
    });
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <>
      <div className={styles.intro}>
        <p className={styles.introLabel}>↓ scroll</p>
        <h1 className={styles.introTitle}>Antes de la magia</h1>
      </div>

      <div
        ref={sectionRef}
        className={styles.section}
        style={{ height: SCROLL_HEIGHT }}
      >
        <div ref={wrapperRef} className={styles.sticky}>
          <div ref={imgBoxRef} className={styles.imgBox}>
            <div ref={sceneRef} className={styles.scene}>
              <div
                ref={backgroundLayerRef}
                className={`${styles.layer} ${styles.backgroundLayer}`}
              >
                <Image
                  src={BACKGROUND_SRC}
                  alt=""
                  priority
                  width={3000}
                  height={2000}
                  className={styles.image}
                />
              </div>

              <div
                ref={shadowLayerRef}
                className={`${styles.layer} ${styles.shadowLayer}`}
              >
                <Image
                  src={SHADOW_SRC}
                  alt=""
                  priority
                  width={3000}
                  height={2000}
                  className={styles.image}
                />
              </div>

              <div
                ref={subjectLayerRef}
                className={`${styles.layer} ${styles.subjectLayer}`}
              >
                <Image
                  src={SUBJECT_SRC}
                  alt="Sujet principal"
                  priority
                  width={3000}
                  height={2000}
                  className={styles.image}
                />
              </div>
            </div>
            <div className={styles.overlayInitial} />
            <div ref={overlayRef} className={styles.overlay} />
          </div>

          <p ref={labelRef} className={styles.imgLabel}>
            una imagen
          </p>
          <div ref={afterRef} className={styles.after}>
            <div className={styles.afterInner}>
              <div
                ref={(el) => {
                  if (el) afterBlocksRef.current[0] = el;
                }}
                className={`${styles.afterBlock} ${styles.afterBlockLeft}`}
              >
                <p className={styles.afterText}>
                  SITE WEB CRÉÉ PAR KALÉ VIRTUAL STUDIO.
                  <br />
                  POUR UN MUSICIEN / AUTEUR COMPOSITEUR.
                </p>
              </div>

              <div
                ref={(el) => {
                  if (el) afterBlocksRef.current[1] = el;
                }}
                className={`${styles.afterBlock} ${styles.afterBlockCenter}`}
              >
                <p className={styles.afterText}>
                  WEB DESIGN
                  <br />
                  DIRECTION CRÉATIVE
                </p>
              </div>

              <div
                ref={(el) => {
                  if (el) afterBlocksRef.current[2] = el;
                }}
                className={`${styles.afterBlock} ${styles.afterBlockRight}`}
              >
                <a href="https://www.kalevs.com" className={styles.afterLink}>
                  <span className={styles.afterArrow}>→</span>
                  <span className={styles.afterLinkText}>VOIR LE SITE</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
