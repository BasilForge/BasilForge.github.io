import type { Lang } from '../i18n/ui';
import type { KairosStats } from './github';

export type StatKey = 'version' | 'date' | 'size' | 'downloads' | 'stars';

/** Arabic text with Western digits, as Gulf readers expect on a download page. */
const locale = (lang: Lang) => (lang === 'ar' ? 'ar-u-nu-latn' : 'en-US');

export function formatCount(n: number, lang: Lang): string {
  return new Intl.NumberFormat(locale(lang)).format(n);
}

export function formatBytes(bytes: number, lang: Lang): string {
  const mb = formatCount(Math.round(bytes / 1_048_576), lang);
  return lang === 'ar' ? `${mb} ميقابايت` : `${mb} MB`;
}

export function formatDate(iso: string, lang: Lang): string {
  return new Intl.DateTimeFormat(locale(lang), {
    day: 'numeric',
    month: lang === 'ar' ? 'long' : 'short',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(iso));
}

/** Each number as the page writes it, keyed like the page's [data-stat] slots. */
export function formatStats(stats: KairosStats, lang: Lang): Record<StatKey, string> {
  return {
    version: `v${stats.version}`,
    date: formatDate(stats.publishedAt, lang),
    size: formatBytes(stats.setupBytes, lang),
    downloads: formatCount(stats.downloads, lang),
    stars: formatCount(stats.stars, lang),
  };
}
