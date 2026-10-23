/** Fades each [data-reveal] in once 15 % of it is in view; everything at once when motion is reduced or unsupported. */
export function startReveal(
  doc: Document,
  Observer: typeof IntersectionObserver | undefined,
  reduceMotion: boolean,
): void {
  const items = doc.querySelectorAll('[data-reveal]');
  if (reduceMotion || !Observer) {
    items.forEach((el) => el.classList.add('is-visible'));
    return;
  }
  const observer = new Observer(
    (entries, obs) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add('is-visible');
        obs.unobserve(entry.target);
      }
    },
    { threshold: 0.15, rootMargin: '0px 0px -5% 0px' },
  );
  items.forEach((el) => observer.observe(el));
}
