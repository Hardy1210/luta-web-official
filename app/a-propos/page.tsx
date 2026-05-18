import BioIntro from '@/components/a-propos-components/bio-intro/BioIntro';
import BioStory from '@/components/a-propos-components/bio-story/BioStory';
import BioUnivers from '@/components/a-propos-components/bio-universe/BioUnivers';
import Navbar from '@/components/layout/navbar/Navbar';
import { generateMetadata } from '@/lib/metadata';
import type { Metadata } from 'next';

export const metadata: Metadata = generateMetadata({
  title: 'TITRE_A_PROPOS',
  description: 'DESCRIPTION_A_PROPOS',
  slug: 'a-propos',
});

export default function AProposPage() {
  return (
    <>
      <header>
        <Navbar />
      </header>
      <main>
        <BioIntro />
        <BioStory />
        <BioUnivers />
      </main>
    </>
  );
}
