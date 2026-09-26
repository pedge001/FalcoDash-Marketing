// Home hero: the layered 3D mark follows the pointer, and a field of equations, figures and
// small charts drifts left-to-right behind it. Ported from the Claude Design prototype (Home A).
// Decorative only: the canvas is aria-hidden and everything pauses offscreen or with reduced motion.

const ICE = '#b2ffff';
const EQ = ['NOI = revenue − opex', 'Σ reserves ÷ units', 'Δ = offer₁ − offer₂', 'ROI = (G − C) / C', 'σ = √(Σ(x − μ)² / n)', 'y = mx + b', 'r² = 0.93', 'x̄ = 471.8', 'net = price − 3% − 12,500', '$ / sq ft = 412.60', 'p < 0.05', 'CAGR = (V₁ / V₀)^(1/n) − 1', '12 × 42 = 504', '∫ f(t) dt', 'Σ contributions', '+18.4% YoY', 'f(x) = ax² + bx + c', 'n = 1,284', 'COE ≤ 30 days', 'if x > y then flag', 'reserve % = 71.6', '4 × 8 ÷ 2', 'Σ(dues) − Σ(expenses)', 'Δ close = −6 days', 'x = y then y = x', '(12 + 12) ÷ 3', 'μ = 0.418', 'P(accept) = 0.64', 'Σ₁ⁿ xᵢ', 'Δt = 14d', '1 + 3 = 4', 'e^(−λt)', 'lim n→∞', 'var = 0.027', 'Σ / 12 mo', '→ flag if Δ > 2σ'];
const TINY = ['0.72', '×', '471', '+12', '−8', '(12+12)', 'Σ', 'Δ', 'μ', '3x²', '√2', '÷', '125', 'n−1', '∂', 'π', '%', '≈', '0', '1', '+3', '4', 'x', 'y', '→', '10', '34', '2', '8', '.05', '±', '∞', 'Σx', '−', '$'];
const NUMS: [string, number, string][] = [['Reserve balance', 412800, '$'], ['Contributions YTD', 1284500, '$'], ['Net to seller', 612400, '$'], ['Delinquency', 3.2, '%'], ['Offers compared', 7, ''], ['Hours saved / wk', 26, ''], ['Operating fund', 186240, '$'], ['Avg donation', 212.4, '$.'], ['Days on market', 14, ''], ['Variance', 1.8, '%']];
const KINDS = ['eq', 'eq', 'eq', 'eq', 'eq', 'tiny', 'tiny', 'tiny', 'tiny', 'tiny', 'tiny', 'num', 'num', 'num', 'line', 'bars', 'ring', 'scatter'] as const;
const FONT = "'Archivo Variable', Archivo, sans-serif";

type Item = {
  k: (typeof KINDS)[number]; s: number; t0: number; v: number; a: number; glow: boolean; seed: number; d: number[]; wt: number;
  x: number; y: number; w: number; h: number; txt?: string; font?: string; num?: [string, number, string];
};

const rnd = (a: number, b: number) => a + Math.random() * (b - a);
const pick = <T,>(a: readonly T[]) => a[Math.floor(Math.random() * a.length)];
const cl = (v: number) => Math.max(0, Math.min(1, v));
const fmt = (v: number, u: string) => (u === '$' ? '$' + Math.round(v).toLocaleString('en-US') : u === '$.' ? '$' + v.toFixed(2) : u === '%' ? v.toFixed(1) + '%' : String(Math.round(v)));

export function initHero() {
  const shell = document.querySelector<HTMLElement>('[data-hero]');
  const cv = shell?.querySelector<HTMLCanvasElement>('canvas');
  const col = shell?.querySelector<HTMLElement>('[data-hero-copy]');
  const mark = shell?.querySelector<HTMLElement>('[data-mark]');
  if (!shell || !cv || !col) return;
  const ctx = cv.getContext('2d');
  if (!ctx) return;

  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let W = 0, H = 0, dpr = 1, L = 0, T = 0, frame = 0, lastT = 0, drawnOnce = false, visible = true, raf = 0;
  let items: Item[] = [];
  let filled = false;

  const region = () => {
    const r = cv.getBoundingClientRect(), bx = col.getBoundingClientRect();
    if (bx.right < r.right - 320) { L = bx.right - r.left + 32; T = 0; } else { L = 0; T = bx.bottom - r.top + 24; }
  };
  const size = () => {
    const r = cv.getBoundingClientRect();
    dpr = Math.min(devicePixelRatio || 1, 2); W = r.width; H = r.height;
    cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
    drawnOnce = false; region();
  };
  new ResizeObserver(size).observe(cv);
  size();

  const make = (t: number): Item => {
    const k = pick(KINDS), s = Math.random() < 0.7 ? rnd(0.55, 0.9) : rnd(0.95, 1.3);
    const it: Item = { k, s, t0: t, v: rnd(26, 70), a: rnd(0.3, 0.95), glow: Math.random() < 0.35, seed: rnd(0, 1000), d: Array.from({ length: 14 }, () => Math.random()), wt: pick([300, 400, 500]), x: 0, y: 0, w: 0, h: 0 };
    if (k === 'eq') { it.txt = pick(EQ); it.font = `${it.wt} ${Math.round(22 * s)}px ${FONT}`; ctx.font = it.font; it.w = ctx.measureText(it.txt).width; it.h = 26 * s; }
    else if (k === 'tiny') { it.txt = pick(TINY); const px = Math.round(rnd(14, 34)); it.font = `${pick([300, 400, 600])} ${px}px ${FONT}`; ctx.font = it.font; it.w = ctx.measureText(it.txt).width; it.h = px * 1.1; it.a *= 0.8; }
    else if (k === 'num') { it.num = pick(NUMS); ctx.font = `800 ${Math.round(32 * s)}px ${FONT}`; const w1 = ctx.measureText(fmt(it.num[1] * 1.01, it.num[2])).width; ctx.font = `600 ${Math.round(11 * s)}px ${FONT}`; it.w = Math.max(w1, ctx.measureText(it.num[0].toUpperCase()).width); it.h = 46 * s; }
    else if (k === 'ring') { it.w = it.h = 66 * s; }
    else { it.w = (k === 'bars' ? 150 : 170) * s; it.h = 82 * s; }
    return it;
  };
  const PX = 22, PY = 8;
  const hit = (a: Item, b: Item) => a.x < b.x + b.w + PX && b.x < a.x + a.w + PX && a.y < b.y + b.h + PY && b.y < a.y + a.h + PY;
  const place = (it: Item, x: number) => { it.x = x; it.y = rnd(T + 10, Math.max(T + 11, H - 10 - it.h)); return !items.some((o) => hit(it, o)); };
  const cap = () => Math.min(80, Math.max(16, Math.round(((W - L) * (H - T)) / 6500)));
  const axes = (x: number, y: number, w: number, h: number) => { ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x, y + h); ctx.lineTo(x + w, y + h); ctx.stroke(); };

  const draw = (t: number) => {
    if (!W || (reduce && drawnOnce)) return;
    if (++frame % 30 === 0) region();
    const dt = lastT ? Math.min(50, t - lastT) : 16; lastT = t;
    if (!filled) { for (let i = 0; i < 600 && items.length < cap(); i++) { const it = make(t); it.t0 = t - rnd(0, 5000); if (place(it, rnd(L - it.w, W - it.w))) items.push(it); } filled = true; }
    for (let i = 0; i < 3 && items.length < cap(); i++) { const it = make(t); if (place(it, L - it.w - rnd(0, 40))) items.push(it); }
    for (const it of items) it.x += (it.v * dt) / 1000;
    items.sort((p, q) => q.x - p.x);
    for (let i = 1; i < items.length; i++) { const a = items[i]; for (let j = 0; j < i; j++) { const b = items[j]; if (a.y < b.y + b.h + PY && b.y < a.y + a.h + PY && a.x + a.w + PX > b.x) a.x = b.x - a.w - PX; } }
    items = items.filter((it) => it.x < W + 10);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, W, H);
    ctx.save(); ctx.beginPath(); ctx.rect(L, T, W - L, H - T); ctx.clip();
    for (const it of items) {
      const e = t - it.t0, s = it.s, x = it.x, y = it.y, w = it.w, h = it.h;
      const ef = cl((x + w - L) / 90) * cl((W - x) / 160);
      if (ef <= 0) continue;
      const chart = it.k === 'line' || it.k === 'bars' || it.k === 'ring' || it.k === 'scatter';
      const rv = chart ? cl((x + w - L) / ((W - L) * 0.85)) : 1 - Math.pow(1 - cl(e / 2600), 3);
      ctx.globalAlpha = it.a * ef;
      ctx.fillStyle = ctx.strokeStyle = ICE;
      ctx.shadowColor = ICE; ctx.shadowBlur = it.glow ? 12 : 0;
      ctx.lineWidth = 1.5 * s; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
      if (it.k === 'eq') { ctx.font = it.font!; ctx.fillText(it.txt!.slice(0, Math.ceil(it.txt!.length * rv)), x, y + 21 * s); }
      else if (it.k === 'tiny') { ctx.font = it.font!; ctx.fillText(it.txt!, x, y + h * 0.85); }
      else if (it.k === 'num') {
        const [label, base, unit] = it.num!;
        const v = base * (0.9 + 0.1 * rv) * (1 + 0.005 * Math.sin(e / 55 + it.seed));
        ctx.font = `600 ${Math.round(11 * s)}px ${FONT}`; ctx.fillText(label.toUpperCase(), x, y + 11 * s);
        ctx.font = `800 ${Math.round(32 * s)}px ${FONT}`; ctx.fillText(fmt(v, unit), x, y + 44 * s);
      } else if (it.k === 'line') {
        axes(x, y, w, h);
        const n = 11, pts: [number, number][] = [];
        for (let i = 0; i <= n; i++) pts.push([x + (w * i) / n, y + h - h * cl(0.12 + (0.5 * i) / n + it.d[i] * 0.35)]);
        const reach = rv * n, k = Math.floor(reach);
        ctx.beginPath(); ctx.moveTo(pts[0][0], pts[0][1]);
        for (let i = 1; i <= k; i++) ctx.lineTo(pts[i][0], pts[i][1]);
        if (k < n) { const fr = reach - k; ctx.lineTo(pts[k][0] + (pts[k + 1][0] - pts[k][0]) * fr, pts[k][1] + (pts[k + 1][1] - pts[k][1]) * fr); }
        ctx.stroke();
        for (let i = 0; i <= k; i++) { ctx.beginPath(); ctx.arc(pts[i][0], pts[i][1], 2.2 * s, 0, 7); ctx.fill(); }
        if (k < n) { const fr = reach - k, tx = pts[k][0] + (pts[k + 1][0] - pts[k][0]) * fr, ty = pts[k][1] + (pts[k + 1][1] - pts[k][1]) * fr; ctx.shadowBlur = 14; ctx.beginPath(); ctx.arc(tx, ty, 3.4 * s, 0, 7); ctx.fill(); }
      } else if (it.k === 'bars') {
        const n = 8, bw = (w / n) * 0.62;
        for (let i = 0; i < n; i++) { const g = cl(rv * 1.5 - i * 0.06); const bh = (h - 4 * s) * (0.2 + 0.8 * it.d[i]) * g; ctx.fillRect(x + (i * w) / n, y + h - 4 * s - bh, bw, bh); }
        ctx.fillRect(x, y + h - 1.5 * s, w, 1.5 * s);
      } else if (it.k === 'ring') {
        const r = 29 * s, cx = x + w / 2, cy = y + h / 2, fr = 0.3 + 0.65 * it.d[0];
        ctx.lineWidth = 5 * s;
        ctx.globalAlpha = it.a * ef * 0.3; ctx.beginPath(); ctx.arc(cx, cy, r, 0, 7); ctx.stroke();
        ctx.globalAlpha = it.a * ef; ctx.beginPath(); ctx.arc(cx, cy, r, -Math.PI / 2, -Math.PI / 2 + fr * rv * Math.PI * 2); ctx.stroke();
        ctx.font = `700 ${Math.round(15 * s)}px ${FONT}`; ctx.textAlign = 'center';
        ctx.fillText(Math.round(fr * rv * 100) + '%', cx, cy + 5 * s); ctx.textAlign = 'left';
      } else {
        axes(x, y, w, h);
        const n = 14;
        for (let i = 0; i < n; i++) { if (i / n > rv) break; const px = x + 8 * s + ((w - 12 * s) * i) / (n - 1), py = y + h - h * cl(0.12 + (0.62 * i) / (n - 1) + (it.d[i] - 0.5) * 0.3); ctx.beginPath(); ctx.arc(px, py, 2.4 * s, 0, 7); ctx.fill(); }
        const lf = cl((rv - 0.55) / 0.45);
        if (lf > 0) { ctx.setLineDash([5 * s, 4 * s]); ctx.beginPath(); ctx.moveTo(x, y + h * 0.9); ctx.lineTo(x + w * lf, y + h * 0.9 - h * 0.66 * lf); ctx.stroke(); ctx.setLineDash([]); }
      }
    }
    ctx.restore(); ctx.globalAlpha = 1; ctx.shadowBlur = 0;
    if (reduce) drawnOnce = true;
  };

  let tx = 0, ty = 0, cx = 0, cy = 0;
  if (!reduce) addEventListener('pointermove', (e) => { tx = (e.clientX / innerWidth - 0.5) * 50; ty = (e.clientY / innerHeight - 0.5) * -36; }, { passive: true });

  const loop = (t: number) => {
    if (!visible) { raf = 0; lastT = 0; return; }
    if (mark && !reduce) {
      cx += (tx - cx) * 0.06; cy += (ty - cy) * 0.06;
      mark.style.transform = `rotateY(${cx + Math.sin(t / 1800) * 10 - 16}deg) rotateX(${cy + Math.cos(t / 2300) * 5 + 8}deg)`;
    }
    draw(t);
    raf = reduce && drawnOnce ? 0 : requestAnimationFrame(loop);
  };
  new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    if (visible && ready && !raf) raf = requestAnimationFrame(loop);
  }).observe(shell);
  // Start after fonts load so measured text widths are right.
  let ready = false;
  (document.fonts?.ready ?? Promise.resolve()).then(() => { ready = true; if (visible && !raf) raf = requestAnimationFrame(loop); });
}
