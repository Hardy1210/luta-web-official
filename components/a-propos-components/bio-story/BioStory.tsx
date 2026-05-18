import { Star } from '@/components/icons/dibujos/Star';
import Image from 'next/image';
import styles from './BioStory.module.scss';

export default function BioStory() {
  return (
    <section className={styles.section}>
      <div className={styles.content}>
        <h2 className={styles.heading}>SON HISTOIRE AVEC LA MUSIQUE</h2>

        <Star className={styles.cursor} />

        <div className={styles.copy}>
          <p>La musique a toujours accompagné Luta, comme une évidence.</p>
          <p>
            Elle apprend le piano à 6 ans, puis la guitare en autodidacte à ses
            12 ans avant de se lancer dans le chant et l&apos;écriture de ses
            propres chansons à 15 ans.
          </p>
          <p>
            Plusieurs années s&apos;écoulent et la musique n&apos;est qu&apos;un
            simple loisir pour elle. Ce n&apos;est qu&apos;en 2020 qu&apos;elle
            décide de se perfectionner dans plusieurs écoles de chant et
            découvre que la musique ne doit plus rester uniquement dans sa
            chambre. D&apos;un point de vue professionnelle sa vie a toujours
            été orientée Équitation.
          </p>
          <p>
            Seulement milieu 2025 Luta participe à un stage qui sera la
            révélation de sa vie.
          </p>
          <p>
            Elle décide alors de prendre un tournant radical, et stopper son
            activité équestre pour se lancer pleinement dans la musique et vivre
            de sa passion.
          </p>
          <p>
            Son objectif est clair : elle veut faire de la musique son métier,
            et partager avec sincérité ce qui la fait réellement vibrer.
          </p>
        </div>
      </div>

      <div className={styles.photos}>
        <figure className={styles.live}>
          <Image
            src="/images/lu-gui.webp"
            alt="Luta en concert avec sa guitare"
            fill
            className={styles.img}
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 35vw"
          />
        </figure>
        <figure className={styles.portrait}>
          <Image
            src="/images/poesie-section/main-image.webp"
            alt="Portrait de Luta sous lumière violette"
            fill
            className={styles.img}
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 45vw, 30vw"
          />
        </figure>
      </div>
    </section>
  );
}
