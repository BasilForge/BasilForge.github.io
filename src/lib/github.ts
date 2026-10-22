import fallback from '../data/github-fallback.json';

export const REPO = 'BasilForge/Kairos';
export const SETUP_ASSET = 'Kairos-Setup.exe';
/** GitHub turns this into the newest release's installer. */
export const LATEST_SETUP_URL = `https://github.com/${REPO}/releases/latest/download/${SETUP_ASSET}`;
export const RELEASES_API = `https://api.github.com/repos/${REPO}/releases?per_page=100`;
export const REPO_API = `https://api.github.com/repos/${REPO}`;

export interface KairosStats {
  version: string;
  publishedAt: string;
  setupBytes: number;
  setupUrl: string;
  downloads: number;
  stars: number;
}

interface Asset {
  name?: unknown;
  size?: unknown;
  download_count?: unknown;
  browser_download_url?: unknown;
}

interface Release {
  tag_name?: unknown;
  draft?: unknown;
  prerelease?: unknown;
  published_at?: unknown;
  assets?: unknown;
}

function setupOf(release: Release | null | undefined): Asset | undefined {
  if (!release || !Array.isArray(release.assets)) return undefined;
  return (release.assets as Asset[]).find((a) => a?.name === SETUP_ASSET);
}

/**
 * The numbers the page shows, from GitHub's answers for the releases list and the repository. The version is the
 * newest published release that has the installer, so another kind of release (the captions runtime) never takes
 * its place even when GitHub calls it "Latest". Null when the answers are not usable.
 */
export function statsFrom(releases: unknown, repo: unknown): KairosStats | null {
  if (!Array.isArray(releases)) return null;
  const stars = (repo as { stargazers_count?: unknown } | null)?.stargazers_count;
  if (typeof stars !== 'number') return null;

  const list = releases as Release[];
  const latest = list.find((r) => r && !r.draft && !r.prerelease && setupOf(r));
  const setup = setupOf(latest);
  if (
    !latest ||
    !setup ||
    typeof latest.tag_name !== 'string' ||
    typeof latest.published_at !== 'string' ||
    typeof setup.size !== 'number' ||
    typeof setup.browser_download_url !== 'string'
  ) {
    return null;
  }

  const downloads = list.reduce((sum, r) => {
    const count = setupOf(r)?.download_count;
    return sum + (typeof count === 'number' ? count : 0);
  }, 0);

  return {
    version: latest.tag_name.replace(/^v/, ''),
    publishedAt: latest.published_at,
    setupBytes: setup.size,
    setupUrl: setup.browser_download_url,
    downloads,
    stars,
  };
}

/**
 * Asks GitHub for the releases and the repository at once; throws when either is refused or unreachable. Both answers
 * are read to the end before giving up, so no request is left open behind the build.
 */
export async function fetchKairosStats(
  fetchImpl: typeof fetch,
  headers: Record<string, string> = { Accept: 'application/vnd.github+json' },
): Promise<KairosStats | null> {
  const answers = await Promise.allSettled(
    [RELEASES_API, REPO_API].map(async (url) => {
      const response = await fetchImpl(url, { headers });
      const body = await response.text();
      if (!response.ok) throw new Error(`${url}: ${response.status}`);
      return JSON.parse(body) as unknown;
    }),
  );
  const [releases, repo] = answers.map((answer) => {
    if (answer.status === 'rejected') throw answer.reason;
    return answer.value;
  });
  return statsFrom(releases, repo);
}

/** GitHub's numbers at build time; the saved ones when GitHub does not answer or answers with something unusable. */
export async function loadKairosStats(fetchImpl: typeof fetch = fetch): Promise<KairosStats> {
  const headers: Record<string, string> = { Accept: 'application/vnd.github+json' };
  const token = typeof process !== 'undefined' ? process.env.GITHUB_TOKEN : undefined;
  if (token) headers.Authorization = `Bearer ${token}`;
  try {
    return (await fetchKairosStats(fetchImpl, headers)) ?? fallback;
  } catch {
    return fallback;
  }
}

let buildStats: Promise<KairosStats> | undefined;

/** The numbers for this build: GitHub is asked once, and every page shows the same answer. */
export function kairosStatsForBuild(): Promise<KairosStats> {
  return (buildStats ??= loadKairosStats());
}
