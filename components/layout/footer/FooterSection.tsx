import Image from 'next/image';
import Link from 'next/link';
import styles from './FooterSection.module.scss';

type FooterSectionProps = {
  imageSrc?: string;
  imageAlt?: string;
  className?: string;
};

const navItems = [
  { label: 'ACCUEIL', href: '/' },
  { label: 'BIO', href: '/bio' },
  { label: 'MUSIQUE', href: '/musique' },
  { label: 'CONTACT', href: '/contact' },
];

export default function FooterSection({
  imageSrc = '/images/image-footer.webp',
  imageAlt = 'Luta avec une guitare',
  className,
}: FooterSectionProps) {
  return (
    <div className={`${styles.footerSection} ${className ?? ''}`}>
      <div className={styles.top}>
        <div className={styles.heading}>
          <h2 className={styles.title}>MA DERNIÈRE CHANSON</h2>

          <p className={styles.subtitle}>
            ÊTRE AUTHENTIQUE AVEC QUI NOUS SOMMES
          </p>
        </div>

        <Link href="/musique" className={styles.listenLink}>
          <span aria-hidden="true">→</span>
          ÉCOUTER
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
            <Link key={item.href} href={item.href} className={styles.navLink}>
              {item.label}
            </Link>
          ))}
        </nav>
        <div className={styles.social}>
          <p className={styles.socialInsta}>INSTAGRAM </p>
          <p className={styles.socialFace}> FACEBOOK</p>
        </div>
        <div className={styles.legal}>
          <p>© 2026 LUTA</p>
          <p>MENTIONS LÉGALES</p>
        </div>

        <div className={styles.credits}>
          <p>DESIGN &amp;</p>
          <p>DÉVELOPPEMENT KALÉ STUDIO</p>
        </div>
      </div>
    </div>
  );
}
