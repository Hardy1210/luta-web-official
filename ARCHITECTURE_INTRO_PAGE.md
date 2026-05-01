# Arquitectura — Sistema de Animación de Intro

## Visión general

La landing page ejecuta una secuencia de animación de introducción orquestada por una máquina de estados central. Todos los componentes visuales son esclavos de esa máquina; ninguno toma decisiones de temporización por su cuenta.

```
idle → imageRising → imagesRevealing → heroText → subText → navbar → overlayOut → complete
```

---

## Z-Index Stack — fuente única de verdad

Todos los valores viven en `styles/tokens.css` bajo `/* INTRO STACK */`. Ningún componente usa números hardcoded.

```
--z-intro-content:   0   → contenido de página (default)
--z-intro-overlay:  40   → cortina negra (tapa contenido, imagen la supera)
--z-intro-image:    50   → IntroImage (encima del overlay)
--z-navbar:        100   → Navbar (encima de todo)
```

---

## Patrón anti-flash (SSR → hydration)

Problema: Next.js envía HTML visible desde el servidor. React hidrata antes de que los effects corran → flash de contenido.

**Solución en dos capas:**

| Capa | Qué hace | Cuándo corre |
|---|---|---|
| CSS `opacity: 0` en el elemento | Tapa el flash durante SSR | Antes de cualquier JS |
| `gsap.set({ opacity: 1 })` en `useIsomorphicLayoutEffect` | Restaura antes del primer paint del cliente | Síncrono, antes del paint |

**Regla:** todo componente que tenga `opacity: 0` en CSS debe tener su `gsap.set({ opacity: 1 })` correspondiente en `useIsomorphicLayoutEffect`. Sin él, el elemento se queda invisible para siempre.

Componentes que aplican este patrón:
- `IntroImage.module.scss` → `.wrapper { opacity: 0 }` / `gsap.set(container.parentElement, { opacity: 1 })`
- `HeroText.module.scss` → `.text { opacity: 0 }` / `gsap.set(rootRef, { opacity: 1 })`
- `Navbar.tsx` → CSS `opacity: 0` en `.nav` / `gsap.set(navRef, { opacity: 1 })`

---

## Archivos del sistema (`//orquestacion intro`)

### `context/AnimationContext.tsx`
**Responsabilidad:** fuente única de verdad de la fase actual.

- Expone `phase`, `setPhase`, `introComplete`, `navbarReady`, `triggerNavbar`.
- Bloquea `overflow` y `pointerEvents` en `body` mientras `phase !== 'complete'`.
- `AnimationProvider` se monta en `app/layout.tsx` — envuelve toda la app.

Fases declaradas:
```ts
type AnimationPhase =
  | 'idle'
  | 'imageRising'
  | 'imagesRevealing'
  | 'heroText'
  | 'subText'
  | 'navbar'
  | 'overlayOut'
  | 'complete';
```

### `hooks/useIntroOrchestration.tsx`
**Responsabilidad:** disparar la timeline GSAP y avanzar las fases.

Dos effects separados por diseño:

| Effect | Hook | Por qué |
|---|---|---|
| `gsap.set()` estado inicial | `useIsomorphicLayoutEffect` | Corre antes del paint → elimina flash |
| Timeline GSAP + `setPhase` | `useEffect` | Puede correr después del paint |

**Estado inicial (antes del paint):**
```ts
gsap.set(container.parentElement, { opacity: 1 }); // restaura wrapper (CSS lo pone en 0)
gsap.set(images[0], { scale: 1, opacity: 1 });
gsap.set(images.slice(1), { scale: 0 });
gsap.set(container, { y: '100svh', scale: 0.5 }); // fuera del viewport por abajo
```

**Timeline con timings actuales:**
```
delay: 0.5s    → espera antes de que todo arranque (overlay solo, sin animación)
FASE 1: container sube   y: '100svh' → 0   duration: 1.2s   ease: power4.out
FASE 2: imágenes revelan  scale/opacity stagger  duration: 0.65s  ease: power2.inOut
        container crece   scale: 1.08            duration: 1.2s   ease: power3.inOut
+=0.3s → heroText
+=0.7s → subText
+=0.5s → navbar  (+ triggerNavbar)
-=1.5s → overlayOut  (cortina sale mientras navbar entra)
+=1.0s → complete    (scroll libre)
```

Consume `containerRef` e `imageRefs` desde `IntroImage`. No renderiza nada.

### `components/intro-overlay/IntroOverlay.tsx`
**Responsabilidad:** tapar el flash de contenido HTML durante la hydratación de React.

- Siempre renderiza `<div className="intro-overlay">` (sin return null condicional).
- Escucha `phase === 'overlayOut'`: ejecuta `gsap.to(opacity: 0, duration: 0.6)` y al completar pone `display: none`.
- Se monta en `layout.tsx` como **primer hijo** de `AnimationProvider`, antes del Navbar y el contenido.
- **No duplicar** en páginas individuales — solo en `layout.tsx`.

### `styles/globals.css` — `.intro-overlay`
```css
/* Z-INDEX: --z-intro-overlay (40) — ver tokens.css → INTRO STACK */
.intro-overlay {
  position: fixed;
  inset: 0;
  z-index: var(--z-intro-overlay);
  background: var(--c-black);
  pointer-events: none;
}
```

Tapa toda la página desde el primer HTML del servidor hasta que la animación lo retire. El `pointer-events: none` es obligatorio para que GSAP pueda seguir corriendo debajo.

### `components/intro-image/IntroImage.tsx`
**Responsabilidad:** renderizar el stack de imágenes y ser el punto de entrada de la orquestación.

- Crea `containerRef` e `imageRefs` y los pasa a `useIntroOrchestration`.
- `.wrapper` tiene `opacity: 0` en CSS — protección SSR.
- GSAP restaura `opacity: 1` en `.wrapper` vía `container.parentElement` en el setup.
- El container arranca fuera del viewport: `y: '100svh'` (no `yPercent` — necesita valor absoluto de viewport para salir completamente).

### `components/intro-split-text/HeroText.tsx`
**Responsabilidad:** animar el h1 principal cuando `phase === 'heroText'`.

- `useIsomorphicLayoutEffect`: crea SplitText + timeline paused + `gsap.set(chars, { opacity: 0 })`.
- `useEffect([phase])`: arranca el timeline cuando la fase llega.
- `HeroText.module.scss` tiene `opacity: 0` en `.text` — protección SSR.

### `components/layout/navbar/Navbar.tsx`
**Responsabilidad:** entrar al final de la secuencia via `navbarReady`.

- `useIsomorphicLayoutEffect`: `gsap.set([logo, links, icons], { opacity: 0 })` — antes del paint.
- `useEffect([navbarReady])`: ejecuta la animación de entrada cuando `triggerNavbar()` lo activa.
- CSS `opacity: 0` en `.nav` + `gsap.set(navRef, { opacity: 1 })` en setup — patrón anti-flash.

### `components/sections/HomeClient.tsx`
**Responsabilidad:** componer `IntroImage` + `HeroText` en el layout de la página.

- Marcado `'use client'`.
- No gestiona estado propio de la animación.
- No incluir `<IntroOverlay />` aquí — ya está en `layout.tsx`.

---

## Decisiones arquitecturales clave

**Z-index centralizado en tokens.css**
Todos los z-index del intro stack viven en una sola variable CSS. Si un componente usa un número hardcoded, está mal. Buscar `/* INTRO STACK */` en `tokens.css` para ver y modificar el stack completo.

**`y: '100svh'` en lugar de `yPercent: 100`**
`yPercent: 100` mueve el elemento el 100% de su propio alto (ej. 380px) — no sale del viewport. `y: '100svh'` lo empuja fuera del viewport independientemente del tamaño del elemento. Los dos tweens (set y animate) deben usar la misma propiedad (`y`), no mezclar con `yPercent`.

**`delay: 0.5` en el primer tween, no en la timeline**
`gsap.timeline({ delay: 0.5 })` retrasa toda la timeline incluidos los `gsap.set` del `useIsomorphicLayoutEffect`. El `delay` en el primer tween solo retrasa el inicio de la animación visible — el overlay permanece solo durante ese tiempo antes de que todo arranque.

**`overlayOut` es una fase separada de `navbar`**
El overlay no sale cuando el navbar entra — sale `-=1.5s` después (overlap intencional). Esto permite que el navbar ya esté visible antes de que el overlay desaparezca completamente. El timing se controla con el offset en `useIntroOrchestration.tsx`.

**`IntroOverlay` en el layout, no en la página**
Montarlo en `app/layout.tsx` garantiza que cubra el flash en cualquier ruta. Se retira vía GSAP (fade out + `display: none`) y no vía unmount de React para evitar un re-render visible durante la animación.

**Una máquina de estados, no props drilling**
`AnimationContext` centraliza la coordinación. Cada componente escucha solo la fase que le importa. Añadir una nueva fase o componente animado no requiere modificar los existentes.

---

## Checklist para reproducir en otro proyecto

- [ ] `AnimationContext.tsx` — copiar con las 8 fases declaradas
- [ ] `useIsomorphicLayoutEffect.ts` — hook utilitario SSR-safe
- [ ] `useIntroOrchestration.tsx` — ajustar timings según diseño
- [ ] `IntroOverlay.tsx` + regla CSS `.intro-overlay` en `globals.css`
- [ ] `IntroImage.tsx` + `IntroImage.module.scss` (`.wrapper { opacity: 0 }`)
- [ ] `HeroText.tsx` + `HeroText.module.scss` (`.text { opacity: 0 }`)
- [ ] `Navbar.tsx` — agregar `navRef` + CSS `opacity: 0` en `.nav`
- [ ] `tokens.css` — bloque `/* INTRO STACK */` con los 4 z-index
- [ ] `layout.tsx` — `<IntroOverlay />` como primer hijo de `<AnimationProvider>`
- [ ] Datos de imágenes en `data/IntroImages.ts`
