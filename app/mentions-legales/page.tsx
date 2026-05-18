import React from 'react';
import s from './MentionsLegales.module.scss';

const sections = [
  {
    num: '01',
    title: 'Éditeur du site',
    content: [
      { label: 'Nom', value: 'Lucie Taboureau' },
      { label: 'Qualité', value: 'Artiste compositrice' },
      {
        label: 'Adresse',
        value: '[ADRESSE POSTALE], [CODE POSTAL] [VILLE], France',
      },
      { label: 'Téléphone', value: '+33 6 74 02 09 32' },
      { label: 'Contact', value: 'contact@luta-musique.fr' },
      { label: 'Directeur de la publication', value: 'Lucie Taboureau' },
      { label: 'SIRET', value: '[NUMÉRO SIRET DE LA CLIENTE]' },
      { label: 'TVA', value: 'TVA non applicable, art. 293 B du CGI' },
    ],
  },
  {
    num: '02',
    title: 'Hébergement',
    content: [
      { label: 'Société', value: 'Vercel Inc.' },
      {
        label: 'Adresse',
        value: '440 N Barranca Ave #4133, Covina, CA 91723, États-Unis',
      },
      { label: 'Téléphone', value: '+1 (551) 225-8672' },
      { label: 'Site', value: 'vercel.com' },
    ],
  },
  {
    num: '03',
    title: 'Propriété intellectuelle',
    text: "L'ensemble du contenu de ce site — textes, photographies, compositions musicales, enregistrements sonores, vidéos, graphismes et logo — est la propriété exclusive de Lucie Taboureau, sauf mention contraire explicite. Toute reproduction, représentation ou exploitation, totale ou partielle, sans autorisation écrite préalable, est strictement interdite.",
  },
  {
    num: '04',
    title: 'Contact',
    text: "Pour toute demande, contactez l'éditrice par courrier électronique à l'adresse contact@luta-musique.fr. Le lien présent sur ce site utilise le protocole mailto:, qui ouvre votre propre application de messagerie. Aucune donnée personnelle n'est collectée ni traitée par ce site lors de cette interaction.",
  },
  {
    num: '05',
    title: 'Données personnelles & cookies',
    subsections: [
      {
        subtitle: 'Absence de collecte directe',
        text: "Ce site ne dispose d'aucun formulaire de saisie. Aucune information personnelle n'est collectée, stockée ou traitée directement par le site.",
      },
      {
        subtitle: 'Vercel Analytics',
        text: "Ce site utilise Vercel Analytics, un outil de mesure d'audience anonymisée. Il ne dépose pas de cookie de traçage, ne collecte pas d'adresse IP complète et n'établit aucun profil individuel.",
      },
      {
        subtitle: 'Droits des utilisateurs',
        text: "Conformément au RGPD (Règlement UE 2016/679) et à la loi Informatique et Libertés, vous disposez d'un droit d'accès, de rectification et d'opposition pour des motifs légitimes. Pour l'exercer : contact@luta-musique.fr",
      },
    ],
  },
  {
    num: '06',
    title: 'Limitation de responsabilité',
    text: "L'éditrice s'efforce d'assurer l'exactitude des informations publiées et se réserve le droit de les modifier sans préavis. Elle décline toute responsabilité quant aux pannes techniques ou au contenu des sites tiers vers lesquels ce site pourrait pointer.",
  },
  {
    num: '07',
    title: 'Droit applicable',
    text: 'Les présentes mentions légales sont soumises au droit français. En cas de litige et à défaut d’accord amiable, les tribunaux français seront seuls compétents.',
  },
];

export default function MentionsLegales() {
  return (
    <div className={s.page}>
      <header className={s.header}>
        <div>
          <p className={s.headerMeta}>Informations légales</p>
          <h1 className={s.headerTitle}>
            Mentions
            <br />
            <em>légales</em>
          </h1>
        </div>
        <p className={s.headerDate}>Mise à jour — [18/05/2026]</p>
      </header>

      <main className={s.main}>
        {sections.map((section) => (
          <article key={section.num} className={s.section}>
            <span className={s.sectionNum}>{section.num}</span>

            <div>
              <h2 className={s.sectionTitle}>{section.title}</h2>

              {section.content && (
                <dl className={s.dataList}>
                  {section.content.map((row) => (
                    <React.Fragment key={row.label}>
                      <dt className={s.dataLabel}>{row.label}</dt>
                      <dd className={s.dataValue}>{row.value}</dd>
                    </React.Fragment>
                  ))}
                </dl>
              )}

              {section.text && <p className={s.text}>{section.text}</p>}

              {section.subsections && (
                <div className={s.subsections}>
                  {section.subsections.map((sub) => (
                    <div key={sub.subtitle}>
                      <p className={s.subsectionLabel}>{sub.subtitle}</p>
                      <p className={s.text}>{sub.text}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </article>
        ))}
      </main>

      <footer className={s.footer}>
        <span className={s.footerBrand}>Luta</span>
        <span className={s.footerCopy}>
          © {new Date().getFullYear()} — Tous droits réservés
        </span>
      </footer>
    </div>
  );
}
