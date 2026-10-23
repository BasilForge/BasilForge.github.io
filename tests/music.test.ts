// @vitest-environment happy-dom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

/** iPhone Safari: audio.volume always reads 1 and ignores writes (the level stays with the phone's buttons). */
function volumeIsFixed() {
  Object.defineProperty(HTMLMediaElement.prototype, 'volume', { configurable: true, get: () => 1, set: () => {} });
}

/** A stand-in for Web Audio that records the gain the music goes through. */
class FakeAudioContext {
  static gains: { value: number }[] = [];
  state = 'running';
  currentTime = 0;
  destination = {};
  createGain() {
    const gain = { value: 1 };
    FakeAudioContext.gains.push(gain);
    return { gain, connect: (next: unknown) => next };
  }
  createMediaElementSource() {
    return { connect: (next: unknown) => next };
  }
  resume() {
    return Promise.resolve();
  }
}

const settle = () => new Promise((resolve) => setTimeout(resolve, 900));

let pause: ReturnType<typeof vi.spyOn>;

beforeEach(() => {
  vi.resetModules();
  localStorage.clear();
  vi.spyOn(HTMLMediaElement.prototype, 'play').mockResolvedValue(undefined);
  pause = vi.spyOn(HTMLMediaElement.prototype, 'pause');
  FakeAudioContext.gains = [];
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  delete (HTMLMediaElement.prototype as { volume?: number }).volume;
});

describe('music on a computer', () => {
  it('sets the player\'s own volume, quietly, and stops when muted', async () => {
    let volume = 1;
    Object.defineProperty(HTMLMediaElement.prototype, 'volume', {
      configurable: true,
      get: () => volume,
      set: (v: number) => (volume = v),
    });
    vi.stubGlobal('AudioContext', FakeAudioContext);
    const { setMusic } = await import('../src/scripts/music');
    setMusic(true);
    await settle();
    expect(volume).toBeCloseTo(0.05);
    expect(FakeAudioContext.gains).toHaveLength(0);
    setMusic(false);
    await settle();
    expect(volume).toBe(0);
    expect(pause).toHaveBeenCalled();
  });
});

describe('music on a phone that ignores audio.volume', () => {
  it('stops when muted', async () => {
    volumeIsFixed();
    const { setMusic } = await import('../src/scripts/music');
    setMusic(true);
    await settle();
    setMusic(false);
    await settle();
    expect(pause).toHaveBeenCalled();
  });

  it('plays quietly through Web Audio', async () => {
    volumeIsFixed();
    vi.stubGlobal('AudioContext', FakeAudioContext);
    const { setMusic } = await import('../src/scripts/music');
    setMusic(true);
    await settle();
    expect(FakeAudioContext.gains).toHaveLength(1);
    expect(FakeAudioContext.gains[0].value).toBeCloseTo(0.05);
  });
});
