# BasilForge

The site at https://basilforge.github.io: free Windows tools for players, in English and Arabic. Built with Astro and published to GitHub Pages on every push to `main` and once a day.

Add a work: `src/projects/<slug>.ts` (like `kairos.ts`), a line in `src/projects/index.ts`, and its pictures in `public/media/<slug>/`. The version, download button and numbers come from Kairos's GitHub releases today (`src/lib/github.ts`): a second work with a download needs its own repository there first, or it shows Kairos's.
