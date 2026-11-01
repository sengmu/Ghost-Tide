// Fully procedural Web Audio: no audio files, no licensing questions.
export class Sfx {
  constructor() { this.ctx = null; this.muted = false; this.master = null; }
  unlock() {
    if (this.ctx) { this.ctx.resume?.(); return; }
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    this.ctx = new AC();
    this.master = this.ctx.createGain();
    this.master.gain.value = this.muted ? 0 : 0.6;
    this.master.connect(this.ctx.destination);
    this.drone();
  }
  setMuted(m) {
    this.muted = m;
    if (this.master) this.master.gain.setTargetAtTime(m ? 0 : 0.6, this.ctx.currentTime, 0.1);
  }
  noiseBuffer(sec = 1) {
    const b = this.ctx.createBuffer(1, this.ctx.sampleRate * sec, this.ctx.sampleRate);
    const d = b.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    return b;
  }
  drone() {
    const c = this.ctx;
    const g = c.createGain(); g.gain.value = 0.08; g.connect(this.master);
    for (const f of [55, 55.7, 82.4]) {
      const o = c.createOscillator(); o.type = 'sawtooth'; o.frequency.value = f;
      const lp = c.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 240;
      o.connect(lp).connect(g); o.start();
    }
    // wind / surf
    const n = c.createBufferSource(); n.buffer = this.noiseBuffer(2); n.loop = true;
    const bp = c.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 400; bp.Q.value = 0.6;
    const wg = c.createGain(); wg.gain.value = 0.05;
    const lfo = c.createOscillator(); lfo.frequency.value = 0.12;
    const lg = c.createGain(); lg.gain.value = 0.04; lfo.connect(lg).connect(wg.gain); lfo.start();
    n.connect(bp).connect(wg).connect(this.master); n.start();
  }
  banish() {
    if (!this.ctx) return;
    const c = this.ctx, t = c.currentTime;
    const o = c.createOscillator(); o.type = 'sine';
    o.frequency.setValueAtTime(880, t); o.frequency.exponentialRampToValueAtTime(140, t + 0.5);
    const g = c.createGain(); g.gain.setValueAtTime(0.18, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.55);
    o.connect(g).connect(this.master); o.start(t); o.stop(t + 0.6);
  }
  hurt() {
    if (!this.ctx) return;
    const c = this.ctx, t = c.currentTime;
    const n = c.createBufferSource(); n.buffer = this.noiseBuffer(0.4);
    const lp = c.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 300;
    const g = c.createGain(); g.gain.setValueAtTime(0.5, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.4);
    n.connect(lp).connect(g).connect(this.master); n.start(t);
  }
  flare() {
    if (!this.ctx) return;
    const c = this.ctx, t = c.currentTime;
    const n = c.createBufferSource(); n.buffer = this.noiseBuffer(1);
    const bp = c.createBiquadFilter(); bp.type = 'bandpass'; bp.Q.value = 2;
    bp.frequency.setValueAtTime(3000, t); bp.frequency.exponentialRampToValueAtTime(200, t + 0.9);
    const g = c.createGain(); g.gain.setValueAtTime(0.4, t); g.gain.exponentialRampToValueAtTime(0.001, t + 1);
    n.connect(bp).connect(g).connect(this.master); n.start(t);
  }
  wail() {
    if (!this.ctx) return;
    const c = this.ctx, t = c.currentTime;
    const o = c.createOscillator(); o.type = 'triangle';
    o.frequency.setValueAtTime(300, t); o.frequency.linearRampToValueAtTime(620, t + 0.8); o.frequency.linearRampToValueAtTime(240, t + 1.8);
    const v = c.createOscillator(); v.frequency.value = 6; const vg = c.createGain(); vg.gain.value = 18; v.connect(vg).connect(o.frequency); v.start(t); v.stop(t + 2);
    const g = c.createGain(); g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.12, t + 0.3); g.gain.exponentialRampToValueAtTime(0.0001, t + 2);
    o.connect(g).connect(this.master); o.start(t); o.stop(t + 2);
  }
}
