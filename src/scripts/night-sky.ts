/** Specks of starlight drifting down behind the page, like snow under the moon. Rests while the tab is hidden. */
export function startNightSky(canvas: HTMLCanvasElement): void {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  let W = 0, H = 0;
  const resize = () => {
    const dpr = Math.min(devicePixelRatio || 1, 2);
    W = innerWidth; H = innerHeight;
    canvas.width = W * dpr; canvas.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };
  resize();
  addEventListener('resize', resize);

  const rnd = (a: number, b: number) => a + Math.random() * (b - a);
  const count = () => Math.round(Math.min(28, (W * H) / 60000));
  type Speck = { x: number; y: number; r: number; vy: number; sway: number; sp: number; a: number; tw: number; warm: boolean };
  const make = (top: boolean): Speck => ({
    x: rnd(0, W), y: top ? rnd(-20, -4) : rnd(0, H), r: rnd(0.6, 2), vy: rnd(0.05, 0.16),
    sway: rnd(0, 6.28), sp: rnd(0.002, 0.006), a: rnd(0.35, 0.9), tw: rnd(0, 6.28), warm: Math.random() < 0.12,
  });
  let specks = Array.from({ length: count() }, () => make(false));

  let running = true;
  document.addEventListener('visibilitychange', () => {
    running = !document.hidden;
    last = performance.now();
    if (running) requestAnimationFrame(frame);
  });

  // movement follows the clock, not the screen's refresh rate: as calm on 144 Hz as on 60 Hz
  let last = performance.now();
  function frame(now: number = performance.now()) {
    if (!running) return;
    const k = Math.min(3, (now - last) / 16.67);
    last = now;
    ctx!.clearRect(0, 0, W, H);
    for (let i = 0; i < specks.length; i++) {
      const s = specks[i];
      s.y += s.vy * k; s.sway += s.sp * k; s.x += Math.sin(s.sway) * 0.15 * k; s.tw += 0.015 * k;
      if (s.y > H + 6) specks[i] = make(true);
      const a = s.a * (0.6 + 0.4 * Math.sin(s.tw));
      const g = ctx!.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.r * 4);
      const c = s.warm ? '255,206,140' : '196,214,255';
      g.addColorStop(0, `rgba(${c},${a})`);
      g.addColorStop(0.35, `rgba(${c},${a * 0.35})`);
      g.addColorStop(1, `rgba(${c},0)`);
      ctx!.fillStyle = g;
      ctx!.beginPath(); ctx!.arc(s.x, s.y, s.r * 4, 0, 6.283); ctx!.fill();
    }
    if (specks.length < count()) specks.push(make(true));
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}
