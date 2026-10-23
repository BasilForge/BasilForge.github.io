// @vitest-environment happy-dom
import { beforeEach, describe, expect, it } from 'vitest';
import { applyStats } from '../src/scripts/live-stats';
import { LATEST_SETUP_URL } from '../src/lib/github';

const fresh = {
  version: '1.1.0',
  publishedAt: '2026-10-25T10:00:00Z',
  setupBytes: 118_000_000,
  setupUrl: 'https://x/v1.1.0/Kairos-Setup.exe',
  downloads: 900,
  stars: 30,
};

let root: HTMLElement;
const stat = (name: string) => root.querySelector(`[data-stat="${name}"]`)!.textContent;
const link = () => root.querySelector('[data-setup-link]')!.getAttribute('href');

beforeEach(() => {
  root = document.createElement('div');
  root.innerHTML = `
    <span data-stat="version">v1.0.1</span><span data-stat="size">112 MB</span><span data-stat="date">Oct 18, 2026</span>
    <span class="num" dir="ltr" data-stat="downloads">769</span><span data-stat="stars">24</span>
    <a data-setup-link href="${LATEST_SETUP_URL}">Download</a>`;
});

describe('applyStats', () => {
  it('writes every number and points the button at the installer', () => {
    applyStats(root, fresh, 'en');
    expect(stat('version')).toBe('v1.1.0');
    expect(stat('size')).toBe('113 MB');
    expect(stat('date')).toBe('Oct 25, 2026');
    expect(stat('downloads')).toBe('900');
    expect(stat('stars')).toBe('30');
    expect(link()).toBe('https://x/v1.1.0/Kairos-Setup.exe');
  });

  it('writes Arabic units on Arabic pages', () => {
    applyStats(root, fresh, 'ar');
    expect(stat('size')).toBe('113 ميقابايت');
    expect(stat('date')).toBe('25 أكتوبر 2026');
  });

  it('puts a changed number in a new element with the same attributes, so the browser paints it afresh', () => {
    const before = root.querySelector('[data-stat="downloads"]');
    applyStats(root, fresh, 'en');
    const after = root.querySelector('[data-stat="downloads"]')!;
    expect(after).not.toBe(before);
    expect(after.textContent).toBe('900');
    expect(after.className).toBe('num');
    expect(after.getAttribute('dir')).toBe('ltr');
  });

  it('keeps the element when the number has not changed', () => {
    const before = root.querySelector('[data-stat="stars"]');
    applyStats(root, { ...fresh, stars: 24 }, 'en');
    expect(root.querySelector('[data-stat="stars"]')).toBe(before);
  });

  it('leaves the page as built when there are no numbers', () => {
    applyStats(root, null, 'en');
    expect(stat('version')).toBe('v1.0.1');
    expect(stat('downloads')).toBe('769');
    expect(link()).toBe(LATEST_SETUP_URL);
  });
});
