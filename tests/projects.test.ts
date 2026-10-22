import { describe, expect, it } from 'vitest';
import { getProject, projects } from '../src/projects';
import { kairos } from '../src/projects/kairos';

/** Every { en, ar } pair anywhere inside a value. */
function localized(value: unknown, path = ''): [string, { en: unknown; ar: unknown }][] {
  if (!value || typeof value !== 'object') return [];
  if ('en' in value && 'ar' in value) return [[path, value as { en: unknown; ar: unknown }]];
  return Object.entries(value).flatMap(([k, v]) => localized(v, `${path}.${k}`));
}

describe('projects', () => {
  it('has text in both languages everywhere', () => {
    const pairs = localized(projects);
    expect(pairs.length).toBeGreaterThan(20);
    for (const [path, pair] of pairs) {
      expect(typeof pair.en === 'string' && pair.en.trim().length > 0, `${path}.en`).toBe(true);
      expect(typeof pair.ar === 'string' && pair.ar.trim().length > 0, `${path}.ar`).toBe(true);
    }
  });

  it('lists the Kairos features in the spec order', () => {
    expect(kairos.features.map((f) => f.id)).toEqual(['smart-save', 'mixer', 'camera', 'quality', 'editor', 'share', 'cloud', 'library']);
    expect(new Set(kairos.features.map((f) => f.id)).size).toBe(kairos.features.length);
  });

  it('says what is new in 1.1 in 6 to 8 points', () => {
    expect(kairos.whatsNew.version).toBe('1.1');
    expect(kairos.whatsNew.items.length).toBeGreaterThanOrEqual(6);
    expect(kairos.whatsNew.items.length).toBeLessThanOrEqual(8);
  });

  it('finds a project by its slug', () => {
    expect(getProject('kairos')).toBe(kairos);
    expect(getProject('nope')).toBeUndefined();
  });
});

describe('what is new in Kairos 1.1', () => {
  it('keeps RAM as a choice for the replay (1.1 moves it to disk by default, RAM stays switchable)', () => {
    const replay = kairos.whatsNew.items.find((i) => /RAM/.test(i.en))!;
    expect(replay.en).toMatch(/disk or in RAM/);
    expect(replay.ar).toMatch(/القرص أو في الذاكرة/);
  });
});
