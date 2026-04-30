//orquestacion intro
export interface IntroImageData {
  id: number;
  src: string;
  alt: string;
}

// Cambia los src por tus imágenes reales
export const introImages: IntroImageData[] = [
  { id: 1, src: '/images/intro-1.webp', alt: 'Intro frame 1' },
  { id: 2, src: '/images/intro-2.webp', alt: 'Intro frame 2' },
  { id: 3, src: '/images/intro-3.webp', alt: 'Intro frame 3' },
  { id: 4, src: '/images/intro-4.webp', alt: 'Intro frame 4' },
];
