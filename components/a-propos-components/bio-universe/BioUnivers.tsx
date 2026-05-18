import { Moon } from '@/components/icons/dibujos/Moon';
import { Sun } from '@/components/icons/dibujos/Sun';
import Image from 'next/image';
import styles from './BioUnivers.module.scss';

export default function BioUnivers() {
  return (
    <section className={styles.section}>
      {/* ── FOTO IZQUIERDA ───────────────────────── */}
      <figure className={styles.photo}>
        <Image
          src="/images/intro-4.webp"
          alt="Luta avec sa guitare acoustique"
          fill
          className={styles.img}
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 40vw"
        />
      </figure>

      {/* ── CONTENIDO DERECHO ────────────────────── */}
      <div className={styles.content}>
        <h2 className={styles.title}>
          UNIVERS <em>ARTISTIQUE</em>
        </h2>

        <Sun className={styles.sun} />

        <div className={styles.copy}>
          <p>
            L&apos;univers de Luta et de la Pop française, aux influences soul
            américaine.
          </p>
          <p>
            Des mélodies entraînantes et entêtantes, aux textes résumant les
            leçons positives à retenir de la vie. Luta vous fait voyager
            émotionnellement dans toutes les émotions que nous vivons au
            quotidien. Un vrai journal intime qui fait du bien au cœur,
            qu&apos;elle partage avec plaisir avec son public.
          </p>
        </div>

        <h3 className={styles.influencesTitle}>INFLUENCES</h3>

        <Moon className={styles.moon} />

        <div className={styles.influencesCopy}>
          <p>
            Luta est très influencée par la musique anglo-saxonne avec des
            artistes tels que : Selah sue, London Grammar, Teddy Swims.
          </p>
          <p>
            Grande Fan de la musique latine : Reggaeton. Et des artistes
            francophones tels que : Jacques Brel, France Gall, Charles Aznavour.
          </p>
        </div>
      </div>
    </section>
  );
}
