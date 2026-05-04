'use client';

import { useAnimation } from '@/context/AnimationContext';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import styles from './IntroImageCursorReveal.module.scss';

interface IntroImageCursorRevealProps {
  hoverSrc: string;
  containerRef: React.RefObject<HTMLDivElement | null>;

  /**
   * Radio del blob en coordenadas UV -1..1
   */
  pointerRadius?: number;

  /**
   * Tiempo aproximado para que el rastro desaparezca
   */
  pointerDuration?: number;

  /**
   * Intensidad de acumulación por frame
   */
  accumRate?: number;

  /**
   * Qué tanto se mueve/vive el borde líquido
   */
  liquidMotion?: number;
}

export function IntroImageCursorReveal({
  hoverSrc,
  containerRef,
  pointerRadius = 0.42,
  pointerDuration = 2.5,
  accumRate = 0.12,
  liquidMotion = 0.18,
}: IntroImageCursorRevealProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { phase } = useAnimation();

  const isActive = phase === 'complete';

  useEffect(() => {
    if (!isActive) return;

    const canvas = canvasRef.current;
    const container = containerRef.current;

    if (!canvas || !container) return;

    const reducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;

    if (reducedMotion) return;

    let rafId = 0;
    let destroyed = false;

    let width = 1;
    let height = 1;
    let lastTime = 0;

    const pointer = {
      x: 10,
      y: 10,
      inside: false,
    };

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      premultipliedAlpha: false,
    });

    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.autoClear = true;

    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    const feedbackScene = new THREE.Scene();
    const outputScene = new THREE.Scene();

    const geometry = new THREE.PlaneGeometry(2, 2);

    const emptyTexture = new THREE.DataTexture(
      new Uint8Array([0, 0, 0, 0]),
      1,
      1,
      THREE.RGBAFormat,
    );
    emptyTexture.needsUpdate = true;

    let imageTexture: THREE.Texture | null = null;

    const feedbackUniforms = {
      uPrev: { value: emptyTexture as THREE.Texture },
      uPointer: { value: new THREE.Vector2(10, 10) },
      uPointerInside: { value: 0 },
      uRadius: { value: pointerRadius },
      uDecay: { value: 0 },
      uAccumRate: { value: accumRate },
      uAspect: { value: 1 },
      uTime: { value: 0 },
      uLiquidMotion: { value: liquidMotion },
    };

    const outputUniforms = {
      uImage: { value: emptyTexture as THREE.Texture },
      uMask: { value: emptyTexture as THREE.Texture },
      uResolution: { value: new THREE.Vector2(1, 1) },
      uImageResolution: { value: new THREE.Vector2(1, 1) },
      uOpacity: { value: 1 },
    };

    const feedbackMaterial = new THREE.ShaderMaterial({
      transparent: false,
      depthWrite: false,
      depthTest: false,
      uniforms: feedbackUniforms,
      vertexShader: `
        varying vec2 vUv;

        void main() {
          vUv = uv;
          gl_Position = vec4(position.xy, 0.0, 1.0);
        }
      `,
      fragmentShader: `
        precision highp float;

        uniform sampler2D uPrev;
        uniform vec2 uPointer;
        uniform float uPointerInside;
        uniform float uRadius;
        uniform float uDecay;
        uniform float uAccumRate;
        uniform float uAspect;
        uniform float uTime;
        uniform float uLiquidMotion;

        varying vec2 vUv;

        float hash(vec2 p) {
          p = fract(p * vec2(234.34, 435.345));
          p += dot(p, p + 34.23);
          return fract(p.x * p.y);
        }

        float noise(vec2 p) {
          vec2 i = floor(p);
          vec2 f = fract(p);

          float a = hash(i);
          float b = hash(i + vec2(1.0, 0.0));
          float c = hash(i + vec2(0.0, 1.0));
          float d = hash(i + vec2(1.0, 1.0));

          vec2 u = f * f * (3.0 - 2.0 * f);

          return mix(a, b, u.x)
            + (c - a) * u.y * (1.0 - u.x)
            + (d - b) * u.x * u.y;
        }

        void main() {
          float rVal = texture2D(uPrev, vUv).r;

          // decay del feedback
          rVal -= clamp(uDecay, 0.0, 0.1);
          rVal = clamp(rVal, 0.0, 1.0);

          float blob = 0.0;

          if (uPointerInside > 0.5) {
            vec2 uv = (vUv - 0.5) * 2.0 * vec2(uAspect, 1.0);
            vec2 mouse = ((uPointer - 0.5) * 2.0) * vec2(uAspect, 1.0);

            vec2 rel = uv - mouse;
            float dist = length(rel);
            float angle = atan(rel.y, rel.x);

            // flujo sutil incluso si el cursor está quieto
            vec2 flow = vec2(
              sin(uTime * 1.7 + uv.y * 4.5),
              cos(uTime * 1.35 + uv.x * 3.5)
            ) * (uRadius * 0.075 * uLiquidMotion);

            vec2 warpedRel = (uv + flow) - mouse;
            float warpedDist = length(warpedRel);

            // borde menos circular y más líquido
            float wobbleA = sin(angle * 4.0 + uTime * 2.6) * 0.16;
            float wobbleB = sin(angle * 7.0 - uTime * 3.4) * 0.08;
            float wobbleC = (noise(vec2(angle * 2.5, uTime * 0.45)) - 0.5) * 0.12;

            float dynamicRadius =
              uRadius *
              (1.0 + (wobbleA + wobbleB + wobbleC) * uLiquidMotion);

            // pequeña respiración interna del blob
            dynamicRadius += sin(uTime * 2.2 + dist * 12.0) * (uRadius * 0.035 * uLiquidMotion);

            // máscara principal
            float mainBlob = 1.0 - smoothstep(
              dynamicRadius * 0.14,
              dynamicRadius,
              warpedDist
            );

            // halo secundario muy leve para que el trazo se sienta más orgánico
            float secondaryBlob = 1.0 - smoothstep(
              dynamicRadius * 0.28,
              dynamicRadius * 1.08,
              warpedDist
            );

            secondaryBlob *= 0.22;

            blob = max(mainBlob, secondaryBlob);
          }

          rVal += blob * uAccumRate;
          rVal = clamp(rVal, 0.0, 1.0);

          gl_FragColor = vec4(rVal, rVal, rVal, 1.0);
        }
      `,
    });

    const outputMaterial = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      depthTest: false,
      toneMapped: false,
      blending: THREE.NormalBlending,
      uniforms: outputUniforms,
      vertexShader: `
        varying vec2 vUv;

        void main() {
          vUv = uv;
          gl_Position = vec4(position.xy, 0.0, 1.0);
        }
      `,
      fragmentShader: `
        precision highp float;

        uniform sampler2D uImage;
        uniform sampler2D uMask;
        uniform vec2 uResolution;
        uniform vec2 uImageResolution;
        uniform float uOpacity;

        varying vec2 vUv;

        vec2 coverUv(vec2 uv, vec2 container, vec2 image) {
          float containerRatio = container.x / container.y;
          float imageRatio = image.x / image.y;

          vec2 scale = vec2(1.0);

          if (containerRatio > imageRatio) {
            scale.y = imageRatio / containerRatio;
          } else {
            scale.x = containerRatio / imageRatio;
          }

          return (uv - 0.5) * scale + 0.5;
        }

        void main() {
          vec2 imageUv = coverUv(vUv, uResolution, uImageResolution);
          vec4 imageColor = texture2D(uImage, imageUv);

          float mask = texture2D(uMask, vUv).r;

          // solo máscara, sin deformar la imagen
          float alpha = smoothstep(0.01, 0.08, mask);

          gl_FragColor = vec4(
            imageColor.rgb,
            imageColor.a * alpha * uOpacity
          );

          #include <colorspace_fragment>
        }
      `,
    });

    const feedbackMesh = new THREE.Mesh(geometry, feedbackMaterial);
    const outputMesh = new THREE.Mesh(geometry, outputMaterial);

    feedbackScene.add(feedbackMesh);
    outputScene.add(outputMesh);

    const targetOptions: THREE.RenderTargetOptions = {
      depthBuffer: false,
      stencilBuffer: false,
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      format: THREE.RGBAFormat,
      type: THREE.UnsignedByteType,
    };

    const targetA = new THREE.WebGLRenderTarget(1, 1, targetOptions);
    const targetB = new THREE.WebGLRenderTarget(1, 1, targetOptions);

    let readTarget = targetA;
    let writeTarget = targetB;

    const loader = new THREE.TextureLoader();

    loader.load(hoverSrc, (texture) => {
      if (destroyed) {
        texture.dispose();
        return;
      }

      imageTexture = texture;

      const img = imageTexture.image as HTMLImageElement;

      //console.log('Texture image size:', img.width, img.height);
      //console.log('Texture src:', hoverSrc);

      imageTexture.colorSpace = THREE.SRGBColorSpace;
      imageTexture.minFilter = THREE.LinearMipmapLinearFilter;
      imageTexture.magFilter = THREE.LinearFilter;
      imageTexture.generateMipmaps = true;
      imageTexture.anisotropy = renderer.capabilities.getMaxAnisotropy();
      imageTexture.wrapS = THREE.ClampToEdgeWrapping;
      imageTexture.wrapT = THREE.ClampToEdgeWrapping;
      imageTexture.needsUpdate = true;

      outputUniforms.uImage.value = imageTexture;
      outputUniforms.uImageResolution.value.set(img.width, img.height);
    });

    const clearTargets = () => {
      renderer.setRenderTarget(targetA);
      renderer.clear();

      renderer.setRenderTarget(targetB);
      renderer.clear();

      renderer.setRenderTarget(null);
    };

    const resize = () => {
      const rect = container.getBoundingClientRect();

      width = Math.max(1, rect.width);
      height = Math.max(1, rect.height);

      const RESOLUTION_SCALE = 3; // ajusta este valor: 2, 3, 4...
      const dpr = Math.min(window.devicePixelRatio || 1, 2) * RESOLUTION_SCALE;
      renderer.setPixelRatio(dpr);
      renderer.setSize(width, height, false);

      targetA.setSize(Math.round(width * dpr), Math.round(height * dpr));
      targetB.setSize(Math.round(width * dpr), Math.round(height * dpr));

      feedbackUniforms.uAspect.value = width / height;
      outputUniforms.uResolution.value.set(width, height);

      {
        /** console.log('CSS size:', width, height);
      console.log('DPR:', dpr);
      console.log('REAL canvas buffer:', canvas.width, canvas.height);
      console.log('Render target:', targetA.width, targetA.height);
 */
      }
      clearTargets();
    };

    const onPointerMove = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();

      const x = (event.clientX - rect.left) / rect.width;
      const y = 1 - (event.clientY - rect.top) / rect.height;

      pointer.x = x;
      pointer.y = y;
      pointer.inside = x >= 0 && x <= 1 && y >= 0 && y <= 1;
    };

    const onPointerEnter = () => {
      pointer.inside = true;
    };

    const onPointerLeave = () => {
      pointer.inside = false;
      pointer.x = 10;
      pointer.y = 10;
    };

    const render = (now: number) => {
      if (destroyed) return;

      const time = now * 0.001;
      const dt = lastTime ? Math.min(time - lastTime, 0.08) : 0;
      lastTime = time;

      feedbackUniforms.uPrev.value = readTarget.texture;
      feedbackUniforms.uPointer.value.set(pointer.x, pointer.y);
      feedbackUniforms.uPointerInside.value = pointer.inside ? 1 : 0;
      feedbackUniforms.uDecay.value = dt / pointerDuration;
      feedbackUniforms.uTime.value = time;
      feedbackUniforms.uLiquidMotion.value = liquidMotion;

      renderer.setRenderTarget(writeTarget);
      renderer.render(feedbackScene, camera);

      [readTarget, writeTarget] = [writeTarget, readTarget];

      outputUniforms.uMask.value = readTarget.texture;

      renderer.setRenderTarget(null);
      renderer.clear();
      renderer.render(outputScene, camera);

      rafId = requestAnimationFrame(render);
    };

    resize();

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);

    canvas.addEventListener('pointermove', onPointerMove);
    canvas.addEventListener('pointerenter', onPointerEnter);
    canvas.addEventListener('pointerleave', onPointerLeave);

    rafId = requestAnimationFrame(render);

    return () => {
      destroyed = true;

      cancelAnimationFrame(rafId);

      resizeObserver.disconnect();

      canvas.removeEventListener('pointermove', onPointerMove);
      canvas.removeEventListener('pointerenter', onPointerEnter);
      canvas.removeEventListener('pointerleave', onPointerLeave);

      geometry.dispose();
      feedbackMaterial.dispose();
      outputMaterial.dispose();
      emptyTexture.dispose();

      targetA.dispose();
      targetB.dispose();

      if (imageTexture) {
        imageTexture.dispose();
      }

      renderer.dispose();
    };
  }, [
    isActive,
    hoverSrc,
    containerRef,
    pointerRadius,
    pointerDuration,
    accumRate,
    liquidMotion,
  ]);

  return <canvas ref={canvasRef} className={styles.canvas} aria-hidden />;
}
