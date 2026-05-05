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
  | 'dibujo'
  | 'complete';

interface AnimationContextType {
  phase: AnimationPhase;
  setPhase: (phase: AnimationPhase) => void;
  introComplete: boolean;
  navbarReady: boolean;
  triggerNavbar: () => void;
}

const AnimationContext = createContext<AnimationContextType | null>(null);

export function AnimationProvider({ children }: { children: ReactNode }) {
  const [phase, setPhase] = useState<AnimationPhase>('idle');
  const [navbarReady, setNavbarReady] = useState(false);

  const triggerNavbar = useCallback(() => setNavbarReady(true), []);
  useEffect(() => {
    document.body.style.pointerEvents = phase === 'complete' ? '' : 'none';
    return () => {
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
