// AR calculator for /cash-flow-fix.
// Formula (shown on the page): cash tied up = monthly revenue ÷ 30 × average days to get paid.
// The visitor sees the figure in the browser, then submits an email to get the results.
// Calculator inputs are not sent until that email form is submitted (via /api/contact).
import { cashTiedUp } from '~/data/cashflow';

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

  const root = document.querySelector<HTMLElement>('[data-ar-calc]');
  if (!root || root.dataset.ready) return;
  root.dataset.ready = '1';

  const q = <T extends Element>(sel: string) => root.querySelector<T>(sel)!;
  const revenue = q<HTMLInputElement>('[data-calc="monthly"]');
  const days = q<HTMLInputElement>('[data-calc="days"]');
  const out = q<HTMLElement>('[data-out="tied"]');
  const emailStep = q<HTMLElement>('[data-email-step]');
  const monthlyField = q<HTMLInputElement>('[data-sync="monthly_revenue"]');
  const daysField = q<HTMLInputElement>('[data-sync="days_to_paid"]');
  const tiedField = q<HTMLInputElement>('[data-sync="cash_tied_up"]');

  const render = () => {
    const r = parseMoney(revenue.value);
    const d = parseDays(days.value);
    setError(revenue, r.error);
    setError(days, d.error);
    const ready = r.value !== null && !r.error && d.value !== null && !d.error;
    if (!ready) {
      out.textContent = '—';
      emailStep.hidden = true;
      if (monthlyField) monthlyField.value = '';
      if (daysField) daysField.value = '';
      if (tiedField) tiedField.value = '';
      return;
    }
    const tied = cashTiedUp(r.value!, d.value!);
    out.textContent = usd(tied);
    emailStep.hidden = false;
    if (monthlyField) monthlyField.value = String(r.value);
    if (daysField) daysField.value = String(d.value);
    if (tiedField) tiedField.value = String(Math.round(tied));
  };

  [revenue, days].forEach((el) => {
    el.addEventListener('input', render);
    el.addEventListener('change', render);
  });
  render();
}
