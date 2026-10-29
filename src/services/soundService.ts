/**
 * Synthesizes a crisp, gentle page-turn sound using the browser Web Audio API.
 * 100% offline, zero network assets required, cross-platform on Windows and Linux.
 */
class PageTurnAudioSynthesizer {
  private ctx: AudioContext | null = null;

  private initContext() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtxClass) {
        this.ctx = new AudioCtxClass();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  public playFlip() {
    try {
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;

      // Create white noise buffer for realistic paper friction
      const bufferSize = this.ctx.sampleRate * 0.18; // 180ms
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);

      for (let i = 0; i < bufferSize; i++) {
        // Pink-ish filtered noise for softer paper texture
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.45));
      }

      const noiseSource = this.ctx.createBufferSource();
      noiseSource.buffer = buffer;

      // Bandpass filter to simulate paper frequency (800Hz - 2500Hz)
      const bandpass = this.ctx.createBiquadFilter();
      bandpass.type = 'bandpass';
      bandpass.frequency.setValueAtTime(1400, now);
      bandpass.frequency.exponentialRampToValueAtTime(600, now + 0.16);
      bandpass.Q.setValueAtTime(1.8, now);

      // Lowpass filter to avoid harsh treble
      const lowpass = this.ctx.createBiquadFilter();
      lowpass.type = 'lowpass';
      lowpass.frequency.setValueAtTime(3200, now);
      lowpass.frequency.exponentialRampToValueAtTime(1200, now + 0.16);

      // Gain envelope
      const gainNode = this.ctx.createGain();
      gainNode.gain.setValueAtTime(0.001, now);
      gainNode.gain.linearRampToValueAtTime(0.12, now + 0.03);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.17);

      // Connect graph
      noiseSource.connect(bandpass);
      bandpass.connect(lowpass);
      lowpass.connect(gainNode);
      gainNode.connect(this.ctx.destination);

      noiseSource.start(now);
      noiseSource.stop(now + 0.18);
    } catch {
      // Audio playback fails gracefully if muted/unsupported
    }
  }
}

export const soundService = new PageTurnAudioSynthesizer();
