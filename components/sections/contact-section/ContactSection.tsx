'use client';

import gsap from '@/lib/gsap';
import { useGSAP } from '@gsap/react';
import { useRef } from 'react';
//import { ContactSignature } from './ContactSignature';
import { AnimatedBackgroundLineText } from '@/components/Animated-text/AnimatedBackgroundLineText';
import { AnimatedText } from '@/components/Animated-text/AnimatedText';
import { SignatureContact } from '@/components/icons/signature-contact/SgnatureContact';
import styles from './ContactSection.module.scss';

interface ContactSectionProps {
  ctaHref?: string;
}

export default function ContactSection({
  ctaHref = 'https://open.spotify.com/intl-es/artist/7lIbxiBTO3ycZCiD0JLjWD?si=oalXqSCsQy-zpp87A7Z0Kg',
}: ContactSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleLine1Ref = useRef<HTMLSpanElement>(null);
  const titleLine2Ref = useRef<HTMLSpanElement>(null);

  const ctaRef = useRef<HTMLAnchorElement>(null);

  const titleRef = AnimatedBackgroundLineText<HTMLDivElement>({
    triggerStart: 'top 90%',
  });

  useGSAP(
    () => {
      if (
        !sectionRef.current ||
        !titleLine1Ref.current ||
        !titleLine2Ref.current ||
        !ctaRef.current
      )
        return;
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
          once: true,
        },
      });

      tl.from([titleLine1Ref.current, titleLine2Ref.current], {
        yPercent: 110,
        opacity: 0,
        duration: 0.9,
        stagger: 0.12,
        ease: 'power4.out',
      })

        .from(
          ctaRef.current,
          {
            y: 22,
            opacity: 0,
            duration: 0.75,
            ease: 'power3.out',
          },
          '-=0.25',
        );
    },
    { scope: sectionRef },
  );

  return (
    <div ref={sectionRef} className={styles.contactSection}>
      {/* SVG real en el DOM, detrás del contenido, sin ocupar espacio  <ContactSignature className={styles.signatureSvg} />*/}
      {/**mobil */}
      <div className={styles.signatureLayer} aria-hidden="true">
        <SignatureContact size={250} />
      </div>
      {/**desktop*/}
      <div className={styles.signatureLayer2} aria-hidden="true">
        <SignatureContact size={850} />
      </div>

      {/* eyebrow gestionado por AnimatedBackgroundLineText — no tocar */}
      <h2 ref={titleRef} className={styles.eyebrow}>
        (CONTACT)
      </h2>

      <div className={styles.content}>
        <div
          className={styles.title}
          aria-label="Se dire. Se lier. Se rencontrer."
        >
          <span className={styles.titleMask}>
            <span
              ref={titleLine1Ref}
              className={`${styles.titleLine} ${styles.titleLineSans}`}
            >
              SE DIRE. SE LIER.
            </span>
          </span>

          <span className={styles.titleMask}>
            <span
              ref={titleLine2Ref}
              className={`${styles.titleLine} ${styles.titleLineSerif}`}
            >
              SE RENCONTRER.
            </span>
          </span>
        </div>
        <div className={styles.textButtonWrapper}>
          <AnimatedText as="p" className={styles.text}>
            Chaque message est une rencontre possible. N&apos;hésitez pas à me
            contacter pour toute collaboration ou projet. Je prends le temps de
            lire et de répondre à chaque échange.
          </AnimatedText>

          <a
            ref={ctaRef}
            href={ctaHref}
            className={styles.ctaButton}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Contact"
          >
            ME CONTACTER
          </a>
        </div>
      </div>
    </div>
  );
}
