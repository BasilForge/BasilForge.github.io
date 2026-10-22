export type Localized = { en: string; ar: string };

export interface Feature {
  id: string;
  title: Localized;
  body: Localized;
  /** Base name of `/media/<slug>/<lang>/<image>.webp` (1600 px) and its `-800` twin. */
  image: string;
  alt: Localized;
}

/** A work on the site. Its download numbers are Kairos's for now (src/lib/github.ts knows one repository). */
export interface Project {
  slug: string;
  name: string;
  /** A few words, the big line at the top of the project's page. */
  headline: Localized;
  /** One line, for the card and the page's description. */
  tagline: Localized;
  /** A short paragraph under the hero's title. */
  summary: Localized;
  logo: string;
  ogImage: string;
  hero: { image: string; alt: Localized };
  video?: { src: string; poster: string; width: number; height: number };
  features: Feature[];
  whatsNew: { version: string; items: Localized[] };
  requirements: Localized;
  /** `security` only when the repository takes private reports (GitHub private vulnerability reporting on). */
  links: { github: string; issues: string; security?: string; discord: string };
}
