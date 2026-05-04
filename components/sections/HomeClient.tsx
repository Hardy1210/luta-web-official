//orquestacion intro
'use client';

import { IntroImage } from '../intro-image/IntroImage';
import { IntroOverlay } from '../intro-overlay/IntroOverlay';
import { HeroText } from '../intro-split-text/HeroText';
import { SubText } from '../intro-split-text/SubText';
import Navbar from '../layout/navbar/Navbar';

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
  return (
    <>
      <div className="relative w-full h-full">
        <IntroOverlay />

        <header>
          <Navbar />
        </header>

        <main className="">
          <section id="hero" className=" h-screen">
            <div className="w-full h-auto flex ">
              <div className="relative w-full h-full flex flex-col items-center justify-center pt-120">
                <h1 className="sr-only">Luta Musique</h1>
                <div className="absolute top-44  flex flex-row justify-center  w-full h-auto gap-10 pl-64">
                  <IntroImage
                    className="pt-4"
                    hoverSrc="/images/reveal-luta.webp"
                  />
                  <SubText className="" />
                </div>
                <HeroText className="text-center " />
              </div>
            </div>
          </section>
        </main>
      </div>
    </>
  );
}
