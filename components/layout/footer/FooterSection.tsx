import { AnimatedText } from '@/components/Animated-text/AnimatedText';
import gsap, { SplitText } from '@/lib/gsap';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef } from 'react';
import styles from './FooterSection.module.scss';

type FooterSectionProps = {
  imageSrc?: string;
  imageAlt?: string;
  className?: string;
};

const navItems = [
  { label: 'ACCUEIL', href: '/' },
  { label: 'BIO', href: '/a-propos' },
  { label: 'MUSIQUE', href: '#music' },
  { label: 'CONTACT', href: '#contact' },
];

export default function FooterSection({
  imageSrc = '/images/image-footer.webp',
  imageAlt = 'Luta avec une guitare',
  className,
}: FooterSectionProps) {
  const socialInstaRef = useRef<HTMLParagraphElement>(null);
  const socialFaceRef = useRef<HTMLParagraphElement>(null);
  const legalRef = useRef<HTMLParagraphElement>(null);
  const mentionsRef = useRef<HTMLParagraphElement>(null);
  const creditsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const els = [
      socialInstaRef.current,
      socialFaceRef.current,
      legalRef.current,
      mentionsRef.current,
      creditsRef.current,
    ].filter(Boolean) as HTMLElement[];

    const ctx = gsap.context(() => {
      els.forEach((el) => {
        const split = new SplitText(el, {
          type: 'lines',
          linesClass: styles.line,
        });
        const lines = split.lines as HTMLElement[];

        lines.forEach((line) => {
          const clip = document.createElement('div');
          clip.className = styles.lineClip;
          line.parentNode!.insertBefore(clip, line);
          clip.appendChild(line);
        });

        gsap.set(el, { opacity: 1 });
        gsap.set(lines, { y: '110%' });

        gsap.to(lines, {
          y: '0%',
          duration: 0.85,
          stagger: { each: 0.12 },
          ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 100%' },
        });
      });
    });

    return () => ctx.revert();
  }, []);
  return (
    <div className={`${styles.footerSection} ${className ?? ''}`}>
      <div className={styles.top}>
        <div className={styles.heading}>
          <AnimatedText as="h2" className={styles.title}>
            MA DERNIÈRE CHANSON
          </AnimatedText>

          <AnimatedText as="p" className={styles.subtitle}>
            "Larme en plein coeur"
          </AnimatedText>
        </div>
        {/* Dernier chanson */}
        <Link
          href="https://open.spotify.com/intl-fr/track/6tjF22SjD2M73DsKHQevw8?si=cbc9067aeafd4461"
          className={styles.listenLink}
        >
          <AnimatedText as="span" aria-hidden="true">
            → ÉCOUTER
          </AnimatedText>
        </Link>
      </div>

      <div className={styles.bottom}>
        <div className={styles.imageWrapper}>
          <Image
            src={imageSrc}
            alt={imageAlt}
            fill
            sizes="(min-width: 760px) 34vw, 94vw"
            className={styles.image}
          />

          <span className={styles.year}>2026</span>
        </div>

        <nav className={styles.nav} aria-label="Navigation principale">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <AnimatedText as="span" className={styles.navLink}>
                {item.label}
              </AnimatedText>
            </Link>
          ))}
        </nav>
        <div className={styles.social}>
          <Link
            href="https://www.instagram.com/luta_musique/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <p ref={socialInstaRef} className={styles.socialInsta}>
              INSTAGRAM
            </p>
          </Link>
          <Link
            href="https://www.facebook.com/profile.php?id=61565333910877"
            target="_blank"
            rel="noopener noreferrer"
          >
            <p ref={socialFaceRef} className={styles.socialFace}>
              FACEBOOK
            </p>
          </Link>
        </div>

        <div className={styles.legal}>
          <p ref={legalRef}>© 2026 LUTA</p>
          <Link href="/mentions-legales">
            <p ref={mentionsRef} className={styles.mentionsLegales}>
              MENTIONS LÉGALES
            </p>
          </Link>
        </div>

        <div ref={creditsRef} className={styles.credits}>
          <p>DESIGN &amp;</p>
          <a
            href="https://www.kalevs.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            DÉVELOPPEMENT KALÉ STUDIO
          </a>
        </div>
      </div>
    </div>
  );
}
