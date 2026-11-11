/**
 * Circuitron Aura One - Web Audio API Synthetic Sound Engine
 * Provides realistic tactile relay clicks, ambient soundscape, and HUD UI chimes.
 */

class AudioSynthEngine {
  constructor() {
    this.ctx = null;
    this.isMuted = true;
    this.ambientOsc1 = null;
    this.ambientOsc2 = null;
    this.ambientGain = null;
    this.filter = null;
    this.hasInitialized = false;
  }

  init() {
    if (this.hasInitialized) return;
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioContext();
      this.hasInitialized = true;
      this.setupAmbientHum();
    } catch (e) {
      console.warn("Web Audio API not supported or blocked:", e);
    }
  }

  setupAmbientHum() {
    if (!this.ctx) return;
    
    // Master ambient low-pass filter
    this.filter = this.ctx.createBiquadFilter();
    this.filter.type = 'lowpass';
    this.filter.frequency.setValueAtTime(140, this.ctx.currentTime);

    // Master ambient gain
    this.ambientGain = this.ctx.createGain();
    this.ambientGain.gain.setValueAtTime(0.0001, this.ctx.currentTime);

    // Sub-bass drone osc 1 (55Hz A1)
    this.ambientOsc1 = this.ctx.createOscillator();
    this.ambientOsc1.type = 'sine';
    this.ambientOsc1.frequency.setValueAtTime(55, this.ctx.currentTime);

    // Subtle harmonic osc 2 (110Hz A2)
    this.ambientOsc2 = this.ctx.createOscillator();
    this.ambientOsc2.type = 'triangle';
    this.ambientOsc2.frequency.setValueAtTime(110, this.ctx.currentTime);

    const osc2Gain = this.ctx.createGain();
    osc2Gain.gain.setValueAtTime(0.15, this.ctx.currentTime);

    this.ambientOsc1.connect(this.filter);
    this.ambientOsc2.connect(osc2Gain);
    osc2Gain.connect(this.filter);

    this.filter.connect(this.ambientGain);
    this.ambientGain.connect(this.ctx.destination);

    this.ambientOsc1.start();
    this.ambientOsc2.start();
  }

  toggleSound(forceState = null) {
    this.init();
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    this.isMuted = forceState !== null ? !forceState : !this.isMuted;
    
    if (this.ambientGain && this.ctx) {
      const targetGain = this.isMuted ? 0.0001 : 0.035;
      this.ambientGain.gain.setTargetAtTime(targetGain, this.ctx.currentTime, 0.5);
    }

    return !this.isMuted;
  }

  /**
   * Generates a high-end luxury mechanical rocker snap & solid-state relay actuation click
   */
  playSwitchClick(isOn = true) {
    if (this.isMuted) return;
    this.init();
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    if (!this.ctx) return;

    const t = this.ctx.currentTime;

    // 1. Initial tactile mechanical strike (Noise burst)
    const bufferSize = this.ctx.sampleRate * 0.015; // 15ms burst
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.2));
    }

    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;

    const noiseFilter = this.ctx.createBiquadFilter();
    noiseFilter.type = 'bandpass';
    noiseFilter.frequency.setValueAtTime(isOn ? 2400 : 1800, t);
    noiseFilter.Q.setValueAtTime(3.0, t);

    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(0.3, t);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, t + 0.018);

    whiteNoise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(this.ctx.destination);

    whiteNoise.start(t);

    // 2. Heavy acoustic chassis body resonance (Low frequency punch)
    const bodyOsc = this.ctx.createOscillator();
    bodyOsc.type = 'sine';
    const startFreq = isOn ? 160 : 130;
    bodyOsc.frequency.setValueAtTime(startFreq, t);
    bodyOsc.frequency.exponentialRampToValueAtTime(45, t + 0.045);

    const bodyGain = this.ctx.createGain();
    bodyGain.gain.setValueAtTime(0.4, t);
    bodyGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.045);

    bodyOsc.connect(bodyGain);
    bodyGain.connect(this.ctx.destination);

    bodyOsc.start(t);
    bodyOsc.stop(t + 0.05);

    // 3. Electrical contact relay latch click (subtle metallic ping)
    const relayOsc = this.ctx.createOscillator();
    relayOsc.type = 'triangle';
    relayOsc.frequency.setValueAtTime(isOn ? 880 : 720, t + 0.008);
    relayOsc.frequency.exponentialRampToValueAtTime(300, t + 0.03);

    const relayGain = this.ctx.createGain();
    relayGain.gain.setValueAtTime(0.0001, t);
    relayGain.gain.setValueAtTime(0.12, t + 0.008);
    relayGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.035);

    relayOsc.connect(relayGain);
    relayGain.connect(this.ctx.destination);

    relayOsc.start(t + 0.008);
    relayOsc.stop(t + 0.04);
  }

  /**
   * Sleek HUD micro-tick for interactive hotspots
   */
  playHoverChime() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(1450, t);
    osc.frequency.exponentialRampToValueAtTime(2200, t + 0.04);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.04, t);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.04);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.045);
  }

  /**
   * Technical drawer expansion chime
   */
  playSelectChime() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(587.33, t); // D5
    osc.frequency.setValueAtTime(880, t + 0.06); // A5

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.08, t);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.18);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.2);
  }
}

// Export singleton instance
window.audioSynth = new AudioSynthEngine();
