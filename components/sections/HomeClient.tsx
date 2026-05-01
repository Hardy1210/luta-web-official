//orquestacion intro
'use client';

import { IntroImage } from '../intro-image/IntroImage';
import { IntroOverlay } from '../intro-overlay/IntroOverlay';
import { HeroText } from '../intro-split-text/HeroText';
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
      <IntroOverlay />
      <IntroImage />
      <header>
        <Navbar />
      </header>

      <main className="">
        <section id="hero" className=" h-screen">
          <div className="w-full h-full flex ">
            <div className="w-full h-full flex items-center justify-center pt-120">
              <h1 className="sr-only">Luta Musique</h1>
              <HeroText className="text-center " />
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
