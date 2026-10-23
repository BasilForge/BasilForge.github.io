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
/** iPhones ignore audio.volume (it reads back 1: the level stays with the phone's buttons), so there the level goes
 *  through a Web Audio gain instead, which they obey. */
const volumeIsFixed = audio.volume !== 0;
let context: AudioContext | null = null;
let gain: GainNode | null = null;
let level = 0; // what the visitor hears, from 0 up to VOLUME
let fading = 0;
let on = wantsMusic();
let button: HTMLButtonElement | null = null;

const show = () => {
  if (!button) return;
  button.setAttribute('aria-pressed', String(on));
  button.dataset.playing = String(on && !audio.paused);
};

/** Made on the first play, which follows a tap: browsers start Web Audio only after one. */
const routeThroughGain = () => {
  if (!volumeIsFixed || context || typeof AudioContext === 'undefined') return;
  try {
    context = new AudioContext();
    gain = context.createGain();
    gain.gain.value = level;
    context.createMediaElementSource(audio).connect(gain).connect(context.destination);
  } catch {
    gain = null; // no Web Audio: the music plays at the phone's own level, and muting still stops it
  }
};

const fadeTo = (target: number) => {
  cancelAnimationFrame(fading);
  const step = () => {
    level = target > level ? Math.min(target, level + 0.0015) : Math.max(target, level - 0.01);
    if (gain) gain.gain.value = level;
    else audio.volume = level;
    if (level !== target) fading = requestAnimationFrame(step);
    else {
      if (target === 0) audio.pause();
      show();
    }
  };
  fading = requestAnimationFrame(step);
};

const play = () => {
  routeThroughGain();
  context?.resume().catch(() => {});
  audio.play().then(() => { fadeTo(VOLUME); show(); }).catch(() => show());
};

// iPhones suspend Web Audio while the page is in the background
document.addEventListener('visibilitychange', () => {
  if (!document.hidden && on) context?.resume().catch(() => {});
});

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
