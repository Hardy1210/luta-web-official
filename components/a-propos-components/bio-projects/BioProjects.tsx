import { Camino } from '@/components/icons/dibujos/caminos/Camino';
import { Nota } from '@/components/icons/dibujos/Nota';
import styles from './BioProjects.module.scss';

export default function BioProjects() {
  return (
    <section className={styles.section}>
      <h2 className={styles.title}>
        UNIVERS <em>ARTISTIQUE</em>
      </h2>

      {/* ── BOX BORDEADO ─────────────────────────── */}
      <div className={styles.box}>
        <div className={styles.boxRight}>
          <p>
            Les 3 premiers singles de son EP &quot;COEUR EN VRAC&quot; ont déjà
            vues le jour (PASSAGÈRE À BORD, AUCUN REGRET ET ÂME ÉGARÉE), la
            suite est prévue pour Novembre et début d&apos;année 2026.
          </p>
          <p>
            Niveau Concert, Luta tourne depuis plusieurs années, dans des Bars /
            Restaurants et Évènementiels. Mais depuis Juillet 2025, elle
            s&apos;est entourée de 4 Musiciens pour aller faire de plus grosses
            scènes. Proposant un concert de Reprises et Compositions
            personnelles.
          </p>
          <Nota className={styles.musicIcon} />
        </div>

        <div className={styles.boxLeft}>
          <p>
            Après avoir eu la chance 2 années de suite de faire la première
            partie d&apos;un festival sur Dijon (K6FM) en première partie de
            Charlie Winston, Héritage Goldman (2023) et Emma Daumas, Philippine
            Lavrey, Tom Frager et d&apos;autres. Luta souhaite dans sa liste de
            souhaits réitérer cette expérience.
          </p>
        </div>
      </div>

      {/* ── PROJETS 2026 ─────────────────────────── */}
      <div className={styles.projetsBlock}>
        <h3 className={styles.projetsTitle}>
          EN 2026 LES <em>PROJETS</em> SONT DONC DE :
        </h3>
        <div className={styles.projetsList}>
          <p>
            Trouver un financement pour partager son EP au maximum (labels).
          </p>
          <p>Travailler sur la suite éventuelle d&apos;un album</p>
          <p>Aller faire des premières parties</p>
          <p>Concert pour partager son univers</p>
        </div>
      </div>

      <Camino className={styles.wave} />
    </section>
  );
}
