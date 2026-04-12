import { REALISTIC_SOUND_BASE64 } from '../assets/sounds/realisticSound';

export type SoundType = 'paper' | 'soft' | 'crisp' | 'heavy' | 'magazine' | 'realistic' | 'none';

const soundCache = new Map<SoundType, string>();
let audioContext: AudioContext | null = null;
const audioBufferCache = new Map<SoundType, AudioBuffer>();

function createWav(sampleRate: number, samples: Float32Array): string {
  const numSamples = samples.length;
  const buffer = new ArrayBuffer(44 + numSamples * 2);
  const view = new DataView(buffer);

  // RIFF header
  writeStr(view, 0, 'RIFF');
  view.setUint32(4, 36 + numSamples * 2, true);
  writeStr(view, 8, 'WAVE');
  writeStr(view, 12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  writeStr(view, 36, 'data');
  view.setUint32(40, numSamples * 2, true);

  for (let i = 0; i < numSamples; i++) {
    const s = Math.max(-1, Math.min(1, samples[i]!));
    view.setInt16(44 + i * 2, s * 0x7fff, true);
  }

  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]!);
  }
  return 'data:audio/wav;base64,' + btoa(binary);
}

function writeStr(view: DataView, offset: number, str: string) {
  for (let i = 0; i < str.length; i++) {
    view.setUint8(offset + i, str.charCodeAt(i));
  }
}

/**
 * "paper" — classic paper flip. Short noise burst with quick attack/decay.
 */
function generatePaper(): Float32Array {
  const rate = 22050;
  const dur = 0.18;
  const n = Math.floor(rate * dur);
  const out = new Float32Array(n);
  let prev = 0;
  for (let i = 0; i < n; i++) {
    const t = i / n;
    const env = t < 0.08 ? t / 0.08 : Math.exp(-6 * (t - 0.08));
    const noise = (Math.random() * 2 - 1);
    // Simple low-pass filter for paper texture
    prev = prev * 0.6 + noise * 0.4;
    out[i] = prev * env * 0.35;
  }
  return out;
}

/**
 * "soft" — gentle, muted whoosh. Slower envelope, more filtering.
 */
function generateSoft(): Float32Array {
  const rate = 22050;
  const dur = 0.3;
  const n = Math.floor(rate * dur);
  const out = new Float32Array(n);
  let prev1 = 0, prev2 = 0;
  for (let i = 0; i < n; i++) {
    const t = i / n;
    // Smooth bell-curve envelope
    const env = Math.sin(Math.PI * t) * 0.6;
    const noise = (Math.random() * 2 - 1);
    // Two-pole low-pass for softer texture
    prev1 = prev1 * 0.75 + noise * 0.25;
    prev2 = prev2 * 0.75 + prev1 * 0.25;
    out[i] = prev2 * env * 0.3;
  }
  return out;
}

/**
 * "crisp" — sharp, snappy flip. Very short, bright.
 */
function generateCrisp(): Float32Array {
  const rate = 44100;
  const dur = 0.1;
  const n = Math.floor(rate * dur);
  const out = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    const t = i / n;
    // Super fast attack, exponential decay
    const env = t < 0.02 ? t / 0.02 : Math.exp(-12 * (t - 0.02));
    const noise = (Math.random() * 2 - 1);
    // Slight high-pass for crispness
    const hp = noise - (i > 0 ? (out[i - 1]! / (env || 0.001)) * 0.3 : 0);
    out[i] = hp * env * 0.4;
  }
  return out;
}

/**
 * "heavy" — thick book page. Lower frequency, longer tail.
 */
function generateHeavy(): Float32Array {
  const rate = 22050;
  const dur = 0.35;
  const n = Math.floor(rate * dur);
  const out = new Float32Array(n);
  let prev1 = 0, prev2 = 0, prev3 = 0;
  for (let i = 0; i < n; i++) {
    const t = i / n;
    // Two-phase: initial thump + paper rustle tail
    const thump = t < 0.05 ? Math.sin(t * 800) * (1 - t / 0.05) * 0.5 : 0;
    const env = t < 0.1 ? t / 0.1 : Math.exp(-4 * (t - 0.1));
    const noise = (Math.random() * 2 - 1);
    // Heavy low-pass
    prev1 = prev1 * 0.85 + noise * 0.15;
    prev2 = prev2 * 0.85 + prev1 * 0.15;
    prev3 = prev3 * 0.85 + prev2 * 0.15;
    out[i] = (prev3 * env * 0.3) + thump;
  }
  return out;
}

/**
 * "magazine" — glossy page. Mid-range, slight ring.
 */
function generateMagazine(): Float32Array {
  const rate = 44100;
  const dur = 0.15;
  const n = Math.floor(rate * dur);
  const out = new Float32Array(n);
  let prev = 0;
  for (let i = 0; i < n; i++) {
    const t = i / n;
    const env = t < 0.05 ? t / 0.05 : Math.exp(-8 * (t - 0.05));
    const noise = (Math.random() * 2 - 1);
    // Band-pass effect: combine low-pass and a resonance
    prev = prev * 0.5 + noise * 0.5;
    const ring = Math.sin(i * 0.15) * 0.2 * env;
    out[i] = (prev * env * 0.35) + ring;
  }
  return out;
}

const generators: Record<Exclude<SoundType, 'none' | 'realistic'>, () => Float32Array> = {
  paper: generatePaper,
  soft: generateSoft,
  crisp: generateCrisp,
  heavy: generateHeavy,
  magazine: generateMagazine,
};

export function generateFlipSound(type: SoundType = 'paper'): string {
  if (type === 'none') return '';
  if (type === 'realistic') {
    const dataUrl = 'data:audio/mpeg;base64,' + REALISTIC_SOUND_BASE64;
    soundCache.set(type, dataUrl);
    return dataUrl;
  }
  if (soundCache.has(type)) return soundCache.get(type)!;

  const samples = generators[type]();
  const rate = type === 'crisp' || type === 'magazine' ? 44100 : 22050;
  const base64 = createWav(rate, samples);
  soundCache.set(type, base64);
  return base64;
}

export async function playFlipSound(type: SoundType = 'paper'): Promise<void> {
  if (type === 'none') return;

  if (!audioContext) {
    audioContext = new AudioContext();
  }

  if (!audioBufferCache.has(type)) {
    const soundData = generateFlipSound(type);
    const base64 = soundData.split(',')[1]!;
    const binaryStr = atob(base64);
    const bytes = new Uint8Array(binaryStr.length);
    for (let i = 0; i < binaryStr.length; i++) {
      bytes[i] = binaryStr.charCodeAt(i);
    }
    const buf = await audioContext.decodeAudioData(bytes.buffer.slice(0));
    audioBufferCache.set(type, buf);
  }

  const source = audioContext.createBufferSource();
  source.buffer = audioBufferCache.get(type)!;
  const gain = audioContext.createGain();
  gain.gain.value = 0.6;
  source.connect(gain);
  gain.connect(audioContext.destination);
  source.start();
}

/**
 * Preview a sound immediately (for settings panel).
 */
export async function previewSound(type: SoundType): Promise<void> {
  await playFlipSound(type);
}
