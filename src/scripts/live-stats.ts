import type { Lang } from '../i18n/ui';
import { formatStats } from '../lib/format';
import { fetchKairosStats, type KairosStats } from '../lib/github';

const KEY = 'kairos-stats';
const MAX_AGE_MS = 60 * 60 * 1000;

/**
 * Writes the numbers into every [data-stat] and points every [data-setup-link] at the installer; null changes nothing.
 * A changed number goes into a fresh copy of its element: browsers (Brave, iPhone Safari) can leave gradient text
 * (background-clip: text) unpainted when its words change in place after the page is drawn.
 */
export function applyStats(root: ParentNode, stats: KairosStats | null, lang: Lang): void {
  if (!stats) return;
  const text: Record<string, string> = formatStats(stats, lang);
  root.querySelectorAll<HTMLElement>('[data-stat]').forEach((el) => {
    const value = text[el.dataset.stat ?? ''];
    if (!value || value === el.textContent) return;
    const fresh = el.cloneNode(false) as HTMLElement;
    fresh.textContent = value;
    el.replaceWith(fresh);
  });
  root.querySelectorAll('[data-setup-link]').forEach((a) => a.setAttribute('href', stats.setupUrl));
}

function isStats(value: unknown): value is KairosStats {
  const s = value as KairosStats | null;
  return (
    !!s &&
    typeof s.version === 'string' &&
    typeof s.publishedAt === 'string' &&
    typeof s.setupUrl === 'string' &&
    [s.setupBytes, s.downloads, s.stars].every((n) => typeof n === 'number')
  );
}

function saved(): KairosStats | null {
  try {
    const { at, stats } = JSON.parse(sessionStorage.getItem(KEY) ?? 'null') ?? {};
    return typeof at === 'number' && Date.now() - at < MAX_AGE_MS && isStats(stats) ? stats : null;
  } catch {
    return null;
  }
}

function save(stats: KairosStats): void {
  try {
    sessionStorage.setItem(KEY, JSON.stringify({ at: Date.now(), stats }));
  } catch {
    // Storage blocked (private window): the next page asks GitHub again.
  }
}

/** Fresh numbers from GitHub (once an hour per tab); on any failure the page keeps the numbers it was built with. */
export async function startLiveStats(lang: Lang): Promise<void> {
  let stats = saved();
  if (!stats) {
    try {
      stats = await fetchKairosStats(fetch);
    } catch {
      return;
    }
    if (stats) save(stats);
  }
  applyStats(document, stats, lang);
}
