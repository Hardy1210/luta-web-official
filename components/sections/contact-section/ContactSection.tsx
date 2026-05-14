'use client';

import gsap from '@/lib/gsap';
import { useGSAP } from '@gsap/react';
import { useRef } from 'react';
//import { ContactSignature } from './ContactSignature';
import { SignatureContact } from '@/components/icons/signature-contact/SgnatureContact';
import styles from './ContactSection.module.scss';

interface ContactSectionProps {
  ctaHref?: string;
}

export default function ContactSection({
  ctaHref = 'https://open.spotify.com/intl-es/artist/7lIbxiBTO3ycZCiD0JLjWD?si=oalXqSCsQy-zpp87A7Z0Kg',
}: ContactSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
          once: true,
        },
      });

      tl.from(`.${styles.eyebrow}`, {
        y: 14,
        opacity: 0,
        duration: 0.7,
        ease: 'power3.out',
      })
        .from(
          `.${styles.titleLine}`,
          {
            yPercent: 110,
            opacity: 0,
            duration: 0.9,
            stagger: 0.12,
            ease: 'power4.out',
          },
          '-=0.25',
        )
        .from(
          `.${styles.signatureSvg}`,
          {
            opacity: 0,
            scale: 0.92,
            rotate: -5,
            duration: 1.2,
            ease: 'power3.out',
          },
          '-=0.65',
        )
        .from(
          `.${styles.text}`,
          {
            y: 18,
            opacity: 0,
            duration: 0.75,
            ease: 'power3.out',
          },
          '-=0.45',
        )
        .from(
          `.${styles.cta}`,
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
      {/**descktop*/}
      <div className={styles.signatureLayer2} aria-hidden="true">
        <SignatureContact size={850} />
      </div>

      <p className={styles.eyebrow}>(CONTACT)</p>

      <div className={styles.content}>
        <h2
          className={styles.title}
          aria-label="Se dire. Se lier. Se rencontrer."
        >
          <span className={styles.titleMask}>
            <span className={`${styles.titleLine} ${styles.titleLineSans}`}>
              SE DIRE. SE LIER.
            </span>
          </span>

          <span className={styles.titleMask}>
            <span className={`${styles.titleLine} ${styles.titleLineSerif}`}>
              SE RENCONTRER.
            </span>
          </span>
        </h2>
        <div className={styles.textButtonWrapper}>
          <p className={styles.text}>
            Chaque message est une rencontre possible. N’hésitez pas à me
            contacter pour toute collaboration ou projet. Je prends le temps de
            lire et de répondre à chaque échange.
          </p>
          <a
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
