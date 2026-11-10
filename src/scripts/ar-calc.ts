// AR calculator for /cash-flow-fix. Runs entirely in the browser and stores nothing: no network
// calls with the numbers, no localStorage. Only an anonymous "used the calculator" event (with the
// revenue range, never the amounts) goes to analytics.
import { REVENUE_RANGES } from '~/data/cashflow';

const UNDER_2M = REVENUE_RANGES[0].label;

type Parsed = { value: number | null; error?: string };

/** "$1,250,000.50" -> 1250000.5. Empty -> null. Negative or malformed -> error. */
export function parseMoney(raw: string): Parsed {
  const s = raw.replace(/[$,\s]/g, '');
  if (!s) return { value: null };
  if (s.includes('-')) return { value: null, error: 'Enter a positive amount.' };
  if (!/^\d+(\.\d{0,2})?$/.test(s)) return { value: null, error: 'Enter a dollar amount, like 250,000.' };
  return { value: Number(s) };
}

function parseDays(raw: string): Parsed {
  const s = raw.trim();
  if (!s) return { value: null };
  const n = Number(s);
  if (!Number.isFinite(n) || n < 0) return { value: null, error: 'Enter zero or more days.' };
  if (!Number.isInteger(n)) return { value: null, error: 'Enter whole days.' };
  if (n > 3650) return { value: null, error: 'Enter a number of days under 3,650.' };
  return { value: n };
}

const usd = (n: number) => `$${Math.round(n).toLocaleString('en-US')}`;
const groupDigits = (n: number) => n.toLocaleString('en-US', { maximumFractionDigits: 2 });

/** Adds thousands separators when a money field loses focus. */
function attachMoneyFormatting(root: ParentNode) {
  root.querySelectorAll<HTMLInputElement>('input[data-money]').forEach((input) => {
    input.addEventListener('blur', () => {
      const p = parseMoney(input.value);
      if (p.value !== null && !p.error) input.value = groupDigits(p.value);
    });
  });
}

function setError(input: HTMLInputElement | HTMLSelectElement, msg?: string) {
  const id = input.getAttribute('aria-describedby');
  const el = id ? document.getElementById(id) : null;
  if (msg) input.setAttribute('aria-invalid', 'true');
  else input.removeAttribute('aria-invalid');
  if (el) { el.textContent = msg || ''; el.hidden = !msg; }
}

export function initArCalculator() {
  attachMoneyFormatting(document);
  initIntakeChecks();

  const root = document.querySelector<HTMLElement>('[data-ar-calc]');
  if (!root || root.dataset.ready) return;
  root.dataset.ready = '1';

  const q = <T extends Element>(sel: string) => root.querySelector<T>(sel)!;
  const revenue = q<HTMLSelectElement>('[data-calc="revenue"]');
  const open = q<HTMLInputElement>('[data-calc="open"]');
  const ar90 = q<HTMLInputElement>('[data-calc="ar90"]');
  const days = q<HTMLInputElement>('[data-calc="days"]');
  const out = {
    ar90: q<HTMLElement>('[data-out="ar90"]'),
    half: q<HTMLElement>('[data-out="half"]'),
    dso: q<HTMLElement>('[data-out="dso"]'),
    dsoNote: q<HTMLElement>('[data-out="dso-note"]'),
  };
  const cta = q<HTMLAnchorElement>('[data-calc-cta]');
  const ctaLabel = q<HTMLElement>('[data-cta-label]');
  const dsoNoteDefault = out.dsoNote.textContent || '';

  let tracked = false;
  let state = { revenue: '', open: null as number | null, ar90: null as number | null, days: null as number | null };

  const render = () => {
    const o = parseMoney(open.value);
    const a = parseMoney(ar90.value);
    const d = parseDays(days.value);
    const range = REVENUE_RANGES.find((r) => r.label === revenue.value);

    setError(open, o.error);
    let aErr = a.error;
    if (!aErr && a.value !== null && o.value !== null && a.value > o.value) aErr = "AR over 90 days can't be more than total open AR.";
    setError(ar90, aErr);
    setError(days, d.error);

    const openOk = o.value !== null && !o.error ? o.value : null;
    const ar90Ok = a.value !== null && !aErr ? a.value : null;
    state = { revenue: range?.label ?? '', open: openOk, ar90: ar90Ok, days: d.error ? null : d.value };

    out.ar90.textContent = ar90Ok !== null ? usd(ar90Ok) : '—';
    out.half.textContent = openOk !== null ? usd(openOk * 0.5) : '—';
    if (openOk !== null && range) {
      const dso = openOk / (range.mid / 365);
      out.dso.textContent = `${Math.round(dso).toLocaleString('en-US')} days`;
      out.dsoNote.textContent = `An estimate based on the ${range.label} range, using ${usd(range.mid)} a year.`;
    } else {
      out.dso.textContent = '—';
      out.dsoNote.textContent = range ? dsoNoteDefault : 'Choose your revenue range to see this estimate.';
    }

    // Under $2M still gets results, with a softer call to action.
    ctaLabel.textContent = range?.label === UNDER_2M ? ctaLabel.dataset.soft! : ctaLabel.dataset.full!;

    if (!tracked && openOk !== null && range) {
      tracked = true;
      const w = window as any;
      w.__fdTrack?.('ar_calculator_used', { revenue: range.label });
      w.gtag?.('event', 'ar_calculator_used', { revenue_range: range.label });
      w.clarity?.('event', 'ar_calculator_used');
    }
  };

  [revenue, open, ar90, days].forEach((el) => {
    el.addEventListener('input', render);
    el.addEventListener('change', render);
  });
  render();

  // Carry the calculator's numbers into the intake form, then let the anchor scroll to it.
  cta.addEventListener('click', () => {
    const form = document.querySelector<HTMLFormElement>('form[data-intake-form]');
    if (!form) return;
    const set = (name: string, value: string) => {
      const el = form.elements.namedItem(name) as HTMLInputElement | HTMLSelectElement | null;
      if (el && value) { el.value = value; el.dispatchEvent(new Event('input', { bubbles: true })); }
    };
    if (state.revenue) set('revenue', state.revenue);
    if (state.open !== null) set('open_ar', groupDigits(state.open));
    if (state.ar90 !== null) set('ar_over_90', groupDigits(state.ar90));
    if (state.days !== null) set('calc_days', String(state.days));

    const w = window as any;
    w.__fdTrack?.('cta_click', { text: (ctaLabel.textContent || '').slice(0, 60), from: 'ar_calculator' });

    // Focus the first required question still empty, after the smooth scroll starts.
    const first = Array.from(form.querySelectorAll<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>('[required]')).find((el) => !el.value);
    if (first) setTimeout(() => first.focus({ preventScroll: true }), 400);
  });

  // Hero and header buttons that jump within the page.
  document.querySelectorAll<HTMLAnchorElement>('a[data-cta], .site-header a[href="#intake"]').forEach((a) => {
    a.addEventListener('click', () => {
      (window as any).__fdTrack?.('cta_click', { text: (a.textContent || '').trim().slice(0, 60), from: a.dataset.cta || 'header' });
    });
  });
}

/** Intake form: AR over 90 days can't exceed total open AR (the server checks this too). */
function initIntakeChecks() {
  const form = document.querySelector<HTMLFormElement>('form[data-intake-form]');
  if (!form) return;
  const open = form.elements.namedItem('open_ar') as HTMLInputElement;
  const ar90 = form.elements.namedItem('ar_over_90') as HTMLInputElement;
  const check = () => {
    const o = parseMoney(open.value).value;
    const a = parseMoney(ar90.value).value;
    ar90.setCustomValidity(o !== null && a !== null && a > o ? "AR over 90 days can't be more than total open AR." : '');
  };
  open.addEventListener('input', check);
  ar90.addEventListener('input', check);
}
