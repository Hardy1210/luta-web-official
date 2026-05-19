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
  // Inicialización lazy: leemos sessionStorage de forma síncrona en el primer
  // render del cliente para que `introComplete` sea correcto desde el primer
  // commit. Si esperáramos a un layout effect, los hijos verían `phase==='idle'`
  // y dispararían sus animaciones antes de que se corrija el estado.
  const [phase, setPhase] = useState<AnimationPhase>(() => {
    if (typeof window === 'undefined') return 'idle';

    const stored = sessionStorage.getItem('introPlayed');
    const EXPIRY_MS = 30 * 1000; // 30 segundos

    const seen = stored && Date.now() - parseInt(stored) < EXPIRY_MS;
    return seen ? 'complete' : 'idle';
    // ❌ eliminado: sessionStorage.setItem aquí — causaba el bug
  });
  const [navbarReady, setNavbarReady] = useState(false);

  const triggerNavbar = useCallback(() => setNavbarReady(true), []);
  const resetNavbar = useCallback(() => setNavbarReady(false), []);

  useEffect(() => {
    if (phase === 'complete') return;
    sessionStorage.setItem('introPlayed', Date.now().toString());

    const stopScroll = (e: Event) => e.preventDefault();
    const stopKeyScroll = (e: KeyboardEvent) => {
      if (
        [
          'ArrowUp',
          'ArrowDown',
          'PageUp',
          'PageDown',
          'Home',
          'End',
          ' ',
        ].includes(e.key)
      )
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
