import { kairos } from './kairos';
import type { Project } from './types';

export type { Feature, Localized, Project } from './types';

/** Every work on the site, newest first. A new one is a file next to kairos.ts plus a line here. */
export const projects: Project[] = [kairos];

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}
