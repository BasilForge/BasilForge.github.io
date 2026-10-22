// @vitest-environment happy-dom
import { beforeEach, describe, expect, it } from 'vitest';
import { startReveal, watchHeader } from '../src/scripts/reveal';

type Callback = (entries: { target: Element; isIntersecting: boolean }[], observer: FakeObserver) => void;
let observers: FakeObserver[] = [];

class FakeObserver {
  watched = new Set<Element>();
  constructor(public callback: Callback) {
    observers.push(this);
  }
  observe(el: Element) {
    this.watched.add(el);
  }
  unobserve(el: Element) {
    this.watched.delete(el);
  }
  disconnect() {}
  show(el: Element) {
    this.callback([{ target: el, isIntersecting: true }], this);
  }
}

beforeEach(() => {
  observers = [];
  document.body.innerHTML = '<p data-reveal id="a"></p><p data-reveal id="b"></p>';
});

const el = (id: string) => document.getElementById(id)!;

describe('startReveal', () => {
  it('shows a section once it comes into view, then stops watching it', () => {
    startReveal(document, FakeObserver as unknown as typeof IntersectionObserver, false);
    expect(el('a').classList.contains('is-visible')).toBe(false);
    observers[0].show(el('a'));
    expect(el('a').classList.contains('is-visible')).toBe(true);
    expect(el('b').classList.contains('is-visible')).toBe(false);
    expect(observers[0].watched.has(el('a'))).toBe(false);
  });

  it('shows everything at once when motion is reduced', () => {
    startReveal(document, FakeObserver as unknown as typeof IntersectionObserver, true);
    expect(el('a').classList.contains('is-visible')).toBe(true);
    expect(el('b').classList.contains('is-visible')).toBe(true);
    expect(observers).toHaveLength(0);
  });

  it('shows everything at once without IntersectionObserver', () => {
    startReveal(document, undefined, false);
    expect(el('b').classList.contains('is-visible')).toBe(true);
  });
});

describe('watchHeader', () => {
  it('marks the header once the page scrolls', () => {
    const header = document.createElement('header');
    const win = { scrollY: 0, addEventListener: (_: string, fn: () => void) => (scroll = fn) } as unknown as Window;
    let scroll = () => {};
    watchHeader(header, win);
    expect(header.hasAttribute('data-scrolled')).toBe(false);
    (win as { scrollY: number }).scrollY = 40;
    scroll();
    expect(header.hasAttribute('data-scrolled')).toBe(true);
  });
});
