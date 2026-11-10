// 90 Day Cash Flow Fix: offer facts as confirmed by Patrick. The landing page (/cash-flow-fix), the
// AR calculator, the intake handler and the emails all read from here. Do not add claims, client
// names or numbers that aren't confirmed; use a visible [need: ...] placeholder instead.

export const OFFER = {
  name: '90 Day Cash Flow Fix',
  path: '/cash-flow-fix',
  source: 'cash-flow-fix',
  pricePerMonth: 5000,
  months: 3,
  guarantee: 'Reduce your AR or your money back.',
} as const;

/** Annual revenue ranges, shared by the calculator and the intake form. `mid` is the midpoint the
 *  calculator uses to estimate days of revenue sitting unpaid. */
export const REVENUE_RANGES = [
  { label: 'Under $2M', mid: 1_500_000 },
  { label: '$2-5M', mid: 3_500_000 },
  { label: '$5-10M', mid: 7_500_000 },
  { label: '$10M+', mid: 15_000_000 },
] as const;

export const REVENUE_LABELS: readonly string[] = REVENUE_RANGES.map((r) => r.label);

/** Proof, word for word. Firms stay unnamed. */
export const PROOF = [
  {
    year: '2024',
    firm: 'Architecture firm',
    figure: '35%',
    figureLabel: 'more cash in the bank',
    text: "In 2024, an architecture firm's cash in the bank rose 35% in a 90-day engagement, and its AR was cut in half.",
  },
  {
    year: '2018',
    firm: 'CPA firm',
    figure: '50%',
    figureLabel: 'more cash in the bank',
    text: "In 2018, a CPA firm's cash in the bank rose 50% over the year before.",
  },
] as const;

/** Intake question 7 options. */
export const STUCK_OPTIONS = ['Approvals', 'Invoicing', 'Follow-up', 'Reporting', 'Other'] as const;
