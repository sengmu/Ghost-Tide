// Virtual thumb-sticks built on Pointer Events. No keyboard or mouse prompts are ever shown.
export class Stick {
  constructor(el, { deadzone = 0.18 } = {}) {
    this.el = el;
    this.knob = el.querySelector('.knob');
    this.deadzone = deadzone;
    this.x = 0; this.y = 0; this.mag = 0; this.active = false;
    this.pid = null;
    el.addEventListener('pointerdown', (e) => this.down(e));
    el.addEventListener('pointermove', (e) => this.move(e));
    el.addEventListener('pointerup', (e) => this.up(e));
    el.addEventListener('pointercancel', (e) => this.up(e));
    el.addEventListener('lostpointercapture', (e) => this.up(e));
  }
  down(e) {
    if (this.pid !== null) return;
    this.pid = e.pointerId;
    this.el.setPointerCapture?.(e.pointerId);
    this.el.classList.add('held');
    this.move(e);
    e.preventDefault();
  }
  move(e) {
    if (e.pointerId !== this.pid) return;
    const r = this.el.getBoundingClientRect();
    const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
    const max = r.width / 2;
    let dx = (e.clientX - cx) / max, dy = (e.clientY - cy) / max;
    const m = Math.hypot(dx, dy);
    if (m > 1) { dx /= m; dy /= m; }
    this.x = dx; this.y = dy;
    this.mag = Math.min(1, m);
    this.active = this.mag > this.deadzone;
    this.knob.style.transform = `translate(calc(-50% + ${dx * max * 0.6}px), calc(-50% + ${dy * max * 0.6}px))`;
  }
  up(e) {
    if (e.pointerId !== this.pid) return;
    this.pid = null;
    this.x = this.y = this.mag = 0;
    this.active = false;
    this.el.classList.remove('held');
    this.knob.style.transform = 'translate(-50%, -50%)';
  }
  reset() { if (this.pid !== null) this.up({ pointerId: this.pid }); }
  get angle() { return Math.atan2(this.y, this.x); }
}

export function onTap(el, fn) {
  el.addEventListener('pointerdown', (e) => { e.preventDefault(); fn(e); });
}
