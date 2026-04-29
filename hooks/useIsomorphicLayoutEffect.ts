import { useEffect, useLayoutEffect } from 'react'

// Avoids SSR warning: useLayoutEffect does nothing on the server
export const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect