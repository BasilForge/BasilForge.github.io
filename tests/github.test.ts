import { describe, expect, it } from 'vitest';
import releases from './fixtures/releases.json';
import repo from './fixtures/repo.json';
import fallbackJson from '../src/data/github-fallback.json';
import { loadKairosStats, statsFrom, SETUP_ASSET } from '../src/lib/github';

const setupCount = releases
  .flatMap((r) => r.assets)
  .filter((a) => a.name === SETUP_ASSET)
  .reduce((sum, a) => sum + a.download_count, 0);

describe('statsFrom', () => {
  it('takes the newest release that has the installer, skipping a newer one without it', () => {
    const s = statsFrom(releases, repo)!;
    expect(s.version).toBe('1.0.1');
    expect(s.setupUrl).toMatch(/\/v1\.0\.1\/Kairos-Setup\.exe$/);
    expect(s.publishedAt).toBe(releases.find((r) => r.tag_name === 'v1.0.1')!.published_at);
    expect(s.setupBytes).toBeGreaterThan(50_000_000);
  });

  it('counts installer downloads only, over every release', () => {
    expect(statsFrom(releases, repo)!.downloads).toBe(setupCount);
  });

  it('reads the stars', () => {
    expect(statsFrom(releases, repo)!.stars).toBe(repo.stargazers_count);
  });

  it('skips drafts and pre-releases', () => {
    const beta = { ...releases[1], tag_name: 'v9.0.0-beta.1', prerelease: true };
    const draft = { ...releases[1], tag_name: 'v9.0.0', draft: true };
    expect(statsFrom([beta, draft, ...releases], repo)!.version).toBe('1.0.1');
  });

  it('gives null when the answers are not usable', () => {
    expect(statsFrom([], repo)).toBeNull();
    expect(statsFrom(releases, {})).toBeNull();
    expect(statsFrom({ message: 'API rate limit exceeded' }, repo)).toBeNull();
    expect(statsFrom(null, null)).toBeNull();
  });
});

describe('loadKairosStats', () => {
  it('uses the saved numbers when GitHub says no', async () => {
    const stats = await loadKairosStats(async () => new Response('rate limited', { status: 403 }));
    expect(stats).toEqual(fallbackJson);
  });

  it('reads a refused answer to the end, so nothing is left open when the build exits', async () => {
    const refused = new Response('rate limited', { status: 403 });
    await loadKairosStats(async () => refused);
    expect(refused.bodyUsed).toBe(true);
  });

  it('waits for both answers before giving up, so no request is still open when the build exits', async () => {
    const late = new Response(JSON.stringify(repo), { status: 200 });
    const stats = await loadKairosStats(async (input) =>
      String(input).includes('/releases')
        ? new Response('rate limited', { status: 403 })
        : new Promise<Response>((resolve) => setTimeout(() => resolve(late), 30)),
    );
    expect(stats).toEqual(fallbackJson);
    expect(late.bodyUsed).toBe(true);
  });

  it('uses the saved numbers when offline', async () => {
    const stats = await loadKairosStats(async () => {
      throw new Error('offline');
    });
    expect(stats).toEqual(fallbackJson);
  });

  it('uses the live answers when GitHub answers', async () => {
    const stats = await loadKairosStats(async (input) =>
      Response.json(String(input).includes('/releases') ? releases : repo),
    );
    expect(stats).toEqual(statsFrom(releases, repo));
  });
});
