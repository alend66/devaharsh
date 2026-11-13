// Shared mutable per-frame state read inside Three.js & overlay loops
export const store = {
  target: 0,
  off: 0,
  mouse: { x: 0, y: 0 },
  smouse: { x: 0, y: 0 },
  hasPointer: false,
  mobile: false,
  reduced: false,
  ready: false,
  introT: 0,
  introDone: false,
  onIntroDone: null,
  skillGroup: null,
  hover3d: false,
  tl: null,
  labels: { skills: [], towers: [] },
};

export const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
export const lerp = (a, b, t) => a + (b - a) * t;
export const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
export const easeOut = (t) => 1 - Math.pow(1 - t, 3);
export const smooth = (t) => t * t * t * (t * (t * 6 - 15) + 10);

