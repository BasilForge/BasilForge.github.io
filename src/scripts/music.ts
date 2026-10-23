/** Quiet music for the site: on unless the visitor turned it off. Browsers allow sound only after the visitor's first
 *  tap, key or scroll, so it starts then. The choice is remembered in this browser. */
const KEY = 'bf-music';
/** Quiet enough to read or fall asleep to: the track is mastered loud (about -16 LUFS), this keeps it about 26 dB under. */
const VOLUME = 0.05;

function wantsMusic(): boolean {
  try {
    return localStorage.getItem(KEY) !== 'off';
  } catch {
    return true;
  }
}

function remember(on: boolean): void {
  try {
    localStorage.setItem(KEY, on ? 'on' : 'off');
  } catch {
    // Storage blocked: the choice lasts for this page only.
  }
}

// One player for the whole visit: the site moves between pages without reloading (Astro's ClientRouter), so the
// music keeps going across pages. Each page only binds its own mute button.
const audio = new Audio('/media/theme/music.mp3');
audio.loop = true;
audio.preload = 'none'; // nothing downloads until the music is wanted
audio.volume = 0;
let on = wantsMusic();
let button: HTMLButtonElement | null = null;

const show = () => {
  if (!button) return;
  button.setAttribute('aria-pressed', String(on));
  button.dataset.playing = String(on && !audio.paused);
};

const fadeTo = (target: number) => {
  const step = () => {
    const next = audio.volume + (target > audio.volume ? 0.0015 : -0.01);
    audio.volume = Math.min(1, Math.max(0, next));
    if ((target > audio.volume && next < target) || (target < audio.volume && next > target)) requestAnimationFrame(step);
    else {
      audio.volume = target;
      if (target === 0) audio.pause();
      show();
    }
  };
  requestAnimationFrame(step);
};

const play = () => {
  audio.play().then(() => { fadeTo(VOLUME); show(); }).catch(() => show());
};

// the first gesture anywhere on the site unlocks sound
const unlock = () => {
  if (document.documentElement.classList.contains('gate')) return; // the entrance screen decides
  ['pointerdown', 'keydown', 'touchstart', 'wheel'].forEach((e) => removeEventListener(e, unlock));
  if (on && audio.paused) play();
};
['pointerdown', 'keydown', 'touchstart', 'wheel'].forEach((e) => addEventListener(e, unlock, { passive: true }));
if (on && !document.documentElement.classList.contains('gate')) play(); // works when the browser already allows sound

/** The entrance screen's choice: enter with the music, or enter in silence (remembered like the mute button). */
export function setMusic(wanted: boolean): void {
  on = wanted;
  remember(on);
  if (on) play();
  else fadeTo(0);
  show();
}

export function bindMusicButton(next: HTMLButtonElement): void {
  button = next;
  button.addEventListener('click', () => {
    on = !on;
    remember(on);
    if (on) play();
    else fadeTo(0);
    show();
  });
  show();
}
