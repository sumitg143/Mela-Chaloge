/**
 * Web Audio synthesizer for the authentic Dussehra Mela experience.
 * Produces crisp, reliable ambient sounds and interactive SFX with zero external asset dependencies.
 */
class MelaAudioEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private ambientGain: GainNode | null = null;
  private ambientTimer: number | null = null;
  private shehnaiTimer: number | null = null;
  private dholTimer: number | null = null;
  private initialized: boolean = false;

  public init() {
    if (this.initialized && this.ctx) {
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
      return;
    }

    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.initialized = true;

      // Master ambient gain
      this.ambientGain = this.ctx.createGain();
      this.ambientGain.gain.setValueAtTime(this.isMuted ? 0 : 0.28, this.ctx.currentTime);
      this.ambientGain.connect(this.ctx.destination);

      this.startAmbientLoop();
    } catch (e) {
      console.warn('AudioContext initialization prevented:', e);
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (this.ctx && this.ambientGain) {
      const t = this.ctx.currentTime;
      this.ambientGain.gain.cancelScheduledValues(t);
      this.ambientGain.gain.linearRampToValueAtTime(muted ? 0 : 0.28, t + 0.1);
    }
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  private startAmbientLoop() {
    if (!this.ctx || !this.ambientGain) return;

    // Crowd murmur simulation using pink-noise filter
    const bufferSize = this.ctx.sampleRate * 2;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      output[i] = (b0 + b1 + b2) * 0.12;
    }

    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 450;
    filter.Q.value = 1.2;

    const noiseGain = this.ctx.createGain();
    noiseGain.gain.value = 0.18;

    whiteNoise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(this.ambientGain);
    whiteNoise.start();

    // Subtle gentle festival dholak beats in the background
    const playMelaDhol = () => {
      if (this.isMuted || !this.ctx || !this.ambientGain) return;
      this.playGentleDholTap();
    };
    this.dholTimer = window.setInterval(playMelaDhol, 1200);

    // Occasional sweet shehnai melodic notes in distance
    const playShehnaiNote = () => {
      if (this.isMuted || !this.ctx || !this.ambientGain) return;
      if (Math.random() > 0.4) {
        this.playMelodicShehnaiFragment();
      }
    };
    this.shehnaiTimer = window.setInterval(playShehnaiNote, 5000);
  }

  private playGentleDholTap() {
    if (!this.ctx || !this.ambientGain) return;
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(110, t);
    osc.frequency.exponentialRampToValueAtTime(55, t + 0.12);

    gain.gain.setValueAtTime(0.09, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.13);

    osc.connect(gain);
    gain.connect(this.ambientGain);
    osc.start(t);
    osc.stop(t + 0.14);
  }

  private playMelodicShehnaiFragment() {
    if (!this.ctx || !this.ambientGain) return;
    const notes = [440, 493.88, 554.37, 587.33, 659.25, 739.99, 880]; // Kalyan thaat raga notes
    const startNote = notes[Math.floor(Math.random() * (notes.length - 2))];
    const t = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(startNote, t);
    osc.frequency.exponentialRampToValueAtTime(startNote * 1.25, t + 0.4);
    osc.frequency.setValueAtTime(startNote, t + 0.7);

    // Warm reed filter
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 1400;

    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(0.06, t + 0.1);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 1.2);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.ambientGain);

    osc.start(t);
    osc.stop(t + 1.3);
  }

  // --- Interactive Sound Effects ---

  public playPop() {
    if (this.isMuted || !this.ctx) return;
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, t);
    osc.frequency.exponentialRampToValueAtTime(60, t + 0.08);

    gain.gain.setValueAtTime(0.4, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.08);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.09);
  }

  public playGunshot() {
    if (this.isMuted || !this.ctx) return;
    const t = this.ctx.currentTime;

    // Cork gun pop
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(320, t);
    osc.frequency.exponentialRampToValueAtTime(40, t + 0.09);

    gain.gain.setValueAtTime(0.5, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.1);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.11);
  }

  public playRingClink() {
    if (this.isMuted || !this.ctx) return;
    const t = this.ctx.currentTime;
    const freqs = [1800, 2400, 3100];
    freqs.forEach((f) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      osc.type = 'sine';
      osc.frequency.value = f;

      gain.gain.setValueAtTime(0.15, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.35);

      osc.connect(gain);
      gain.connect(this.ctx!.destination);
      osc.start(t);
      osc.stop(t + 0.36);
    });
  }

  public playArrowLaunch() {
    if (this.isMuted || !this.ctx) return;
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(250, t);
    osc.frequency.exponentialRampToValueAtTime(950, t + 0.35);

    gain.gain.setValueAtTime(0.35, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.35);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.36);
  }

  public playFirework() {
    if (this.isMuted || !this.ctx) return;
    const t = this.ctx.currentTime;

    // Boom
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(140, t);
    osc.frequency.exponentialRampToValueAtTime(30, t + 0.6);

    gain.gain.setValueAtTime(0.7, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.7);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.75);

    // Crackle noise burst
    try {
      const bufferSize = Math.floor(this.ctx.sampleRate * 0.4);
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.2));
      }
      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;
      const noiseGain = this.ctx.createGain();
      noiseGain.gain.setValueAtTime(0.4, t + 0.1);
      noiseGain.gain.exponentialRampToValueAtTime(0.01, t + 0.5);

      noise.connect(noiseGain);
      noiseGain.connect(this.ctx.destination);
      noise.start(t + 0.1);
    } catch {
      // Audio buffer creation safe fallback
    }
  }

  public playSizzle() {
    if (this.isMuted || !this.ctx) return;
    const t = this.ctx.currentTime;
    try {
      const dur = 0.5;
      const bufferSize = Math.floor(this.ctx.sampleRate * dur);
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * 0.25;
      }
      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'highpass';
      filter.frequency.value = 2500;

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.3, t);
      gain.gain.exponentialRampToValueAtTime(0.01, t + dur);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);
      noise.start(t);
    } catch {
      // safe fallback
    }
  }

  public playCoin() {
    if (this.isMuted || !this.ctx) return;
    const t = this.ctx.currentTime;
    const notes = [987.77, 1318.51];
    notes.forEach((freq, idx) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      osc.type = 'sine';
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.2, t + idx * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, t + idx * 0.08 + 0.25);
      osc.connect(gain);
      gain.connect(this.ctx!.destination);
      osc.start(t + idx * 0.08);
      osc.stop(t + idx * 0.08 + 0.26);
    });
  }

  public playFanfare() {
    if (this.isMuted || !this.ctx) return;
    const t = this.ctx.currentTime;
    const chord = [523.25, 659.25, 783.99, 1046.50]; // C Major triumph
    chord.forEach((freq, i) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      osc.type = 'triangle';
      osc.frequency.value = freq;

      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(0.18, t + 0.05 + i * 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 1.2);

      osc.connect(gain);
      gain.connect(this.ctx!.destination);
      osc.start(t + i * 0.04);
      osc.stop(t + 1.3);
    });
  }

  public dispose() {
    if (this.ambientTimer) clearInterval(this.ambientTimer);
    if (this.shehnaiTimer) clearInterval(this.shehnaiTimer);
    if (this.dholTimer) clearInterval(this.dholTimer);
    if (this.ctx) {
      try {
        this.ctx.close();
      } catch {
        // safe
      }
    }
    this.initialized = false;
  }
}

export const melaAudio = new MelaAudioEngine();
