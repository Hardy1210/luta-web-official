//orquestacion intro
'use client';

import DibujoLuta from '../icons/dibujos/DibujoLuta';
import { IntroImage } from '../intro-image/IntroImage';
import { IntroOverlay } from '../intro-overlay/IntroOverlay';
import { HeroText } from '../intro-split-text/HeroText';
import { SubText } from '../intro-split-text/SubText';
import Navbar from '../layout/navbar/Navbar';

import { getImageProps } from 'next/image';

type HomeClientProps = {
  name: string;
  description: string;
};
{
  /*
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          {name}
        </h1>
         <h2 className="mt-4 text-xl font-medium text-foreground/60">
          {description}
        </h2>
        */
}
export function HomeClient({ name, description }: HomeClientProps) {
  const { props: revealProps } = getImageProps({
    src: '/images/reveal-luta.webp',
    width: 1500,
    height: 2250,
    alt: '',
    // quality: 90,
  });

  return (
    <>
      <div className="relative w-full h-full">
        <IntroOverlay />

        <header>
          <Navbar />
        </header>

        <main className="">
          <section id="hero" className=" h-screen">
            <div className="w-full h-full">
              <div className="relative w-full h-full flex flex-col items-center justify-center ">
                {/* contenedor en full */}
                <div className="h-full w-full flex flex-col  justify-center items-center">
                  <h1 className="sr-only">Luta Musique</h1>
                  {/**primer bloque para col */}
                  <div className="relative w-full flex-1">
                    <div
                      className="absolute inset-0 m-auto translate-y-55 w-[clamp(270px,23.5vw,350px)] pointer-events-none hidden sm:block"
                      style={{ zIndex: 'var(--z-dibujo)' }}
                    >
                      <DibujoLuta
                        className="absolute -left-17 -top-13 "
                        duration={2}
                        stroke="currentColor"
                      />
                    </div>

                    <div className="absolute inset-0 m-auto translate-y-55 w-[clamp(270px,23.5vw,350px)] pointer-events-none hidden sm:block">
                      <SubText className="absolute left-full top-1/2 ml-[35px] -translate-y-48 " />
                    </div>
                    {/* Marco absoluto centrado */}
                    {/* IntroImage queda libre con su clase original */}
                    <IntroImage
                      className="absolute inset-0 m-auto translate-y-15 sm:translate-y-55"
                      hoverSrc={revealProps.src}
                      brushSize={0.65}
                      trailDecay={2.5}
                      smoothness={0.95}
                    />
                  </div>
                  {/**segundo bloque para el col */}
                  <HeroText className="text-center  flex-1 hidden sm:block pt-40" />
                  <HeroText className="text-center   pb-3 sm:hidden" />
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </>
  );
  {
    /**
          
           <section id="hero" className=" h-screen">
            <div className="w-full h-auto flex ">
              <div className="relative w-full h-full flex flex-col items-center justify-center pt-120">
                <h1 className="sr-only">Luta Musique</h1>
                <div className="absolute top-44  flex flex-row justify-center  w-full h-auto gap-10 ">
                  <IntroImage
                    className="pt-4"
                    hoverSrc={revealProps.src}
                    brushSize={0.65}
                    trailDecay={2.5}
                    smoothness={0.95}
                  />
                </div>
                <HeroText className="text-center " />
              </div>
            </div>
          </section>*/
  }
}
