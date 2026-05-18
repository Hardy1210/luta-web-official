'use client';

import BioIntro from '@/components/a-propos-components/bio-intro/BioIntro';
import BioProjects from '@/components/a-propos-components/bio-projects/BioProjects';
import BioStory from '@/components/a-propos-components/bio-story/BioStory';
import BioUnivers from '@/components/a-propos-components/bio-universe/BioUnivers';
import FooterSection from '@/components/layout/footer/FooterSection';
import NavbarStatic from '@/components/layout/navbar-static/NavbarStatic';

export default function AProposPage() {
  return (
    <>
      <header>
        <NavbarStatic />
      </header>
      <main>
        <BioIntro />
        <BioStory />
        <BioUnivers />
        <BioProjects />
      </main>
      <footer>
        <FooterSection />
      </footer>
    </>
  );
}
