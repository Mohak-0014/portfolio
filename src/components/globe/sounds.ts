/**
 * Asset-free sound effects, synthesised with the Web Audio API so there are no
 * binary files to ship. The AudioContext must be unlocked by a user gesture
 * (browsers block autoplay) — call `unlockAudio()` from the first interaction.
 */

let ctx: AudioContext | null = null;
let muted = false;

function ac(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const AC =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
  }
  if (ctx.state === "suspended") ctx.resume();
  return ctx;
}

export function unlockAudio() {
  ac();
}

export function isMuted() {
  return muted;
}

export function toggleMute() {
  muted = !muted;
  if (!muted) ac();
  return muted;
}

/** Filtered-noise swell — the globe spinning up. */
export function whoosh() {
  const c = ac();
  if (!c || muted) return;
  const dur = 0.75;
  const buffer = c.createBuffer(1, Math.floor(c.sampleRate * dur), c.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
  const src = c.createBufferSource();
  src.buffer = buffer;
  const bp = c.createBiquadFilter();
  bp.type = "bandpass";
  bp.Q.value = 0.9;
  const t = c.currentTime;
  bp.frequency.setValueAtTime(280, t);
  bp.frequency.exponentialRampToValueAtTime(2600, t + dur * 0.55);
  bp.frequency.exponentialRampToValueAtTime(360, t + dur);
  const g = c.createGain();
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(0.22, t + 0.1);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  src.connect(bp).connect(g).connect(c.destination);
  src.start(t);
  src.stop(t + dur);
}

/**
 * Sustained engine burn — the rocket thrusting toward a planet. A low brown-
 * noise rumble swept through a lowpass, with a rising spool-up whine over it.
 */
export function thruster(dur = 1.4) {
  const c = ac();
  if (!c || muted) return;
  const t = c.currentTime;

  // brown-noise rumble
  const buffer = c.createBuffer(1, Math.floor(c.sampleRate * dur), c.sampleRate);
  const data = buffer.getChannelData(0);
  let last = 0;
  for (let i = 0; i < data.length; i++) {
    const white = Math.random() * 2 - 1;
    last = (last + 0.02 * white) / 1.02;
    data[i] = last * 3.4;
  }
  const src = c.createBufferSource();
  src.buffer = buffer;
  const lp = c.createBiquadFilter();
  lp.type = "lowpass";
  lp.frequency.setValueAtTime(160, t);
  lp.frequency.exponentialRampToValueAtTime(950, t + dur * 0.6);
  lp.frequency.exponentialRampToValueAtTime(220, t + dur);
  const g = c.createGain();
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(0.3, t + 0.12);
  g.gain.setValueAtTime(0.3, t + dur * 0.65);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  src.connect(lp).connect(g).connect(c.destination);
  src.start(t);
  src.stop(t + dur);

  // engine spool-up whine
  const o = c.createOscillator();
  o.type = "sawtooth";
  o.frequency.setValueAtTime(58, t);
  o.frequency.exponentialRampToValueAtTime(150, t + dur);
  const og = c.createGain();
  og.gain.setValueAtTime(0.0001, t);
  og.gain.exponentialRampToValueAtTime(0.055, t + 0.18);
  og.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(og).connect(c.destination);
  o.start(t);
  o.stop(t + dur);
}

/** Low thunk — the marker locking into place. */
export function land() {
  const c = ac();
  if (!c || muted) return;
  const t = c.currentTime;
  const o = c.createOscillator();
  o.type = "sine";
  o.frequency.setValueAtTime(190, t);
  o.frequency.exponentialRampToValueAtTime(68, t + 0.18);
  const g = c.createGain();
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(0.32, t + 0.02);
  g.gain.exponentialRampToValueAtTime(0.0001, t + 0.24);
  o.connect(g).connect(c.destination);
  o.start(t);
  o.stop(t + 0.26);
}

/** Rising sweep — diving into a section. */
export function zoomSfx() {
  const c = ac();
  if (!c || muted) return;
  const t = c.currentTime;
  const dur = 0.5;
  const o = c.createOscillator();
  o.type = "triangle";
  o.frequency.setValueAtTime(240, t);
  o.frequency.exponentialRampToValueAtTime(900, t + dur);
  const g = c.createGain();
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(0.13, t + 0.05);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(g).connect(c.destination);
  o.start(t);
  o.stop(t + dur);
}

/** Tiny tick — hover / click. */
export function blip(freq = 640) {
  const c = ac();
  if (!c || muted) return;
  const t = c.currentTime;
  const o = c.createOscillator();
  o.type = "square";
  o.frequency.value = freq;
  const g = c.createGain();
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(0.05, t + 0.005);
  g.gain.exponentialRampToValueAtTime(0.0001, t + 0.08);
  o.connect(g).connect(c.destination);
  o.start(t);
  o.stop(t + 0.09);
}

/** The classic airport "bing-bong" before a PA announcement. */
export function chime() {
  const c = ac();
  if (!c || muted) return;
  const t = c.currentTime;
  [
    { f: 784, at: 0 },
    { f: 587, at: 0.26 },
  ].forEach(({ f, at }) => {
    const tt = t + at;
    const o = c.createOscillator();
    o.type = "sine";
    o.frequency.value = f;
    const harm = c.createOscillator();
    harm.type = "sine";
    harm.frequency.value = f * 2.01;
    const hg = c.createGain();
    hg.gain.value = 0.07;
    const g = c.createGain();
    g.gain.setValueAtTime(0.0001, tt);
    g.gain.exponentialRampToValueAtTime(0.24, tt + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, tt + 0.95);
    o.connect(g).connect(c.destination);
    harm.connect(hg).connect(g);
    o.start(tt);
    o.stop(tt + 1);
    harm.start(tt);
    harm.stop(tt + 1);
  });
}

/** Rattle of a split-flap board cycling to a new value. */
export function flutter(dur = 0.7) {
  const c = ac();
  if (!c || muted) return;
  const t = c.currentTime;
  const n = Math.floor(dur / 0.028);
  for (let i = 0; i < n; i++) {
    const tt = t + i * 0.028 + Math.random() * 0.008;
    const buf = c.createBuffer(1, Math.floor(c.sampleRate * 0.02), c.sampleRate);
    const d = buf.getChannelData(0);
    for (let j = 0; j < d.length; j++) d[j] = (Math.random() * 2 - 1) * (1 - j / d.length);
    const s = c.createBufferSource();
    s.buffer = buf;
    const bp = c.createBiquadFilter();
    bp.type = "bandpass";
    bp.frequency.value = 2300;
    bp.Q.value = 1.1;
    const g = c.createGain();
    g.gain.value = 0.05 * (1 - (i / n) * 0.5);
    s.connect(bp).connect(g).connect(c.destination);
    s.start(tt);
    s.stop(tt + 0.02);
  }
}

/** Boarding-pass barcode scan — a rising sweep, then a confirm beep. */
export function scan() {
  const c = ac();
  if (!c || muted) return;
  const t = c.currentTime;
  const o = c.createOscillator();
  o.type = "sawtooth";
  o.frequency.setValueAtTime(380, t);
  o.frequency.exponentialRampToValueAtTime(1500, t + 0.26);
  const g = c.createGain();
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(0.06, t + 0.05);
  g.gain.exponentialRampToValueAtTime(0.0001, t + 0.28);
  o.connect(g).connect(c.destination);
  o.start(t);
  o.stop(t + 0.3);

  const beep = c.createOscillator();
  beep.type = "square";
  beep.frequency.value = 990;
  const bg = c.createGain();
  const tt = t + 0.34;
  bg.gain.setValueAtTime(0.0001, tt);
  bg.gain.exponentialRampToValueAtTime(0.08, tt + 0.01);
  bg.gain.exponentialRampToValueAtTime(0.0001, tt + 0.14);
  beep.connect(bg).connect(c.destination);
  beep.start(tt);
  beep.stop(tt + 0.15);
}
