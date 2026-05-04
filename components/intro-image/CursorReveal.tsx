'use client';

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
} from 'react';
import styles from './CursorReveal.module.scss';

type Trail = {
  id: number;
  x: number;
  y: number;
};

type CursorRevealProps = {
  revealSrc: string;
  enabled: boolean;
  size?: number;
  life?: number;
  maxTrails?: number;
  minDistance?: number;
};

export function CursorReveal({
  revealSrc,
  enabled,
  size = 120,
  life = 900,
  maxTrails = 18,
  minDistance = 18,
}: CursorRevealProps) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const idRef = useRef(0);
  const lastPointRef = useRef<{ x: number; y: number } | null>(null);
  const lastTimeRef = useRef(0);

  const [trails, setTrails] = useState<Trail[]>([]);

  const removeTrail = useCallback((id: number) => {
    setTrails((prev) => prev.filter((trail) => trail.id !== id));
  }, []);

  const addTrail = useCallback(
    (x: number, y: number) => {
      const id = idRef.current++;

      setTrails((prev) => {
        const next = [...prev, { id, x, y }];
        return next.slice(-maxTrails);
      });

      window.setTimeout(() => {
        removeTrail(id);
      }, life);
    },
    [life, maxTrails, removeTrail],
  );

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!enabled) return;

    const root = rootRef.current;
    if (!root) return;

    const rect = root.getBoundingClientRect();

    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    if (x < 0 || y < 0 || x > rect.width || y > rect.height) return;

    const now = performance.now();
    const lastPoint = lastPointRef.current;

    const distance = lastPoint
      ? Math.hypot(x - lastPoint.x, y - lastPoint.y)
      : Infinity;

    if (distance < minDistance && now - lastTimeRef.current < 35) return;

    lastPointRef.current = { x, y };
    lastTimeRef.current = now;

    addTrail(x, y);
  };

  const handlePointerLeave = () => {
    lastPointRef.current = null;
  };

  useEffect(() => {
    if (!enabled) {
      setTrails([]);
      lastPointRef.current = null;
    }
  }, [enabled]);

  return (
    <div
      ref={rootRef}
      className={`${styles.root} ${enabled ? styles.enabled : ''}`}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      aria-hidden="true"
    >
      {trails.map((trail) => {
        const style = {
          '--x': `${trail.x}px`,
          '--y': `${trail.y}px`,
          '--size': `${size}px`,
          '--life': `${life}ms`,
          backgroundImage: `url("${revealSrc}")`,
        } as CSSProperties;

        return <span key={trail.id} className={styles.trail} style={style} />;
      })}
    </div>
  );
}
