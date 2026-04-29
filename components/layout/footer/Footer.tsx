import Link from 'next/link'
import styles from './Footer.module.scss'

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>

        <div className={styles.navCol}>
          <nav aria-label="Footer navigation">
            <ul className={styles.navList}>
              <li><Link href="#accueil" className={styles.navLink}>ACCUEIL</Link></li>
              <li><Link href="#bio"     className={styles.navLink}>BIO</Link></li>
              <li><Link href="#musique" className={styles.navLink}>MUSIQUE</Link></li>
              <li><Link href="#contact" className={styles.navLink}>CONTACT</Link></li>
            </ul>
          </nav>
        </div>

        <div className={styles.social}>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className={styles.socialLink}>Instagram</a>
          <a href="https://facebook.com"  target="_blank" rel="noopener noreferrer" className={styles.socialLink}>Facebook</a>
          <a href="https://open.spotify.com" target="_blank" rel="noopener noreferrer" className={styles.socialLink}>Spotify</a>
        </div>

      </div>

      <div className={styles.bottom}>
        <p className={styles.copy}>© 2026 Luta — Mentions légales</p>
        <p className={styles.credit}>
          Design &amp; Développement{' '}
          <a href="https://kalevirtualstudio.com" target="_blank" rel="noopener noreferrer" className={styles.creditLink}>
            Kalé Virtual Studio
          </a>
        </p>
      </div>
    </footer>
  )
}