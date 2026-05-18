import { Clip } from '@/components/icons/dibujos/Clip';
import { Hearths } from '@/components/icons/dibujos/Hearths';
import Image from 'next/image';
import styles from './BioIntro.module.scss';

export default function BioIntro() {
  return (
    <section className={styles.section}>
      {/* ── POLAROID ──────────────────────────────── */}
      <figure className={styles.polaroid}>
        {/*svg */}
        <Clip className={styles.paperclip} />
        <div className={styles.polaroidFrame}>
          <div className={styles.photoWrapper}>
            <Image
              src="/images/bio-section/luta.webp"
              alt="Luta assise sur les rails"
              fill
              className={styles.photo}
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 40vw"
            />
          </div>
          <div className={styles.overlay} aria-hidden="true" />
        </div>
      </figure>

      {/* ── CONTENIDO DERECHO ─────────────────────── */}
      <div className={styles.content}>
        <h1 className={styles.title}>LUTA</h1>

        <p className={styles.subtitle}>
          Autrice, compositrice, interprète <br />
          Pianiste, guitariste
        </p>

        {/*svg */}
        <Hearths className={styles.hearts} />
        <div className={styles.copy}>
          <p>
            Derrière le nom d&apos;artiste Luta se cache Lucie Taboureau, une
            âme authentique qui a grandi au cœur du Morvan, entourée par la
            nature et ses animaux qui ont façonné sa sensibilité.
          </p>
          <p>
            Simplicité, humilité et bonne humeur sont les maîtres mots qui la
            définissent.
          </p>
          <p>
            Luta cultive un profond désir d&apos;aider les autres et de partager
            ce qu&apos;elle a de plus précieux : sa bienveillance et son regard
            sincère sur le monde.
          </p>
          <p>
            Portée par ses racines et son amour du vivant, elle avance avec
            douceur et conviction, cherchant avant tout à semer un peu de
            lumière autour d&apos;elle.
          </p>
        </div>
      </div>
    </section>
  );
}
