//orquestacion intro
'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';

export type AnimationPhase =
  | 'idle'
  | 'imageRising'
  | 'imagesRevealing'
  | 'heroText'
  | 'subText'
  | 'navbar'
  | 'overlayOut'
  //| 'dibujo'
  | 'complete';

interface AnimationContextType {
  phase: AnimationPhase;
  setPhase: (phase: AnimationPhase) => void;
  introComplete: boolean;
  navbarReady: boolean;
  triggerNavbar: () => void;
  resetNavbar: () => void;
}

const AnimationContext = createContext<AnimationContextType | null>(null);

export function AnimationProvider({ children }: { children: ReactNode }) {
  const [phase, setPhase] = useState<AnimationPhase>('idle');
  const [navbarReady, setNavbarReady] = useState(false);

  const triggerNavbar = useCallback(() => setNavbarReady(true), []);
  const resetNavbar = useCallback(() => setNavbarReady(false), []);

  useEffect(() => {
    if (phase === 'complete') return;

    const stopScroll = (e: Event) => e.preventDefault();
    const stopKeyScroll = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' '].includes(e.key))
        e.preventDefault();
    };

    document.addEventListener('wheel', stopScroll, { passive: false });
    document.addEventListener('touchmove', stopScroll, { passive: false });
    document.addEventListener('keydown', stopKeyScroll);
    document.body.style.pointerEvents = 'none';

    return () => {
      document.removeEventListener('wheel', stopScroll);
      document.removeEventListener('touchmove', stopScroll);
      document.removeEventListener('keydown', stopKeyScroll);
      document.body.style.pointerEvents = '';
    };
  }, [phase]);

  return (
    <AnimationContext.Provider
      value={{
        phase,
        setPhase,
        introComplete: phase === 'complete',
        navbarReady,
        triggerNavbar,
        resetNavbar,
      }}
    >
      {children}
    </AnimationContext.Provider>
  );
}

export function useAnimation(): AnimationContextType {
  const ctx = useContext(AnimationContext);
  if (!ctx)
    throw new Error('useAnimation must be used inside <AnimationProvider>');
  return ctx;
}
