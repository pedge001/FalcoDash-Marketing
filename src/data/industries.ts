import type { FAQ } from './services';

export type Industry = {
  slug: string;
  name: string;
  seoTitle: string;
  description: string;
  h1: string;
  shortAnswer: string;
  /** Three quick wins shown on the home page list. */
  highlights: string[];
  useCases: { title: string; body: string }[];
  services: string[];
  work: string[];
  blogCategory?: string;
  faqs: FAQ[];
};

export const INDUSTRIES: Industry[] = [
  {
    slug: 'real-estate',
    name: 'Real estate teams & brokerages',
    seoTitle: 'AI Automation for Real Estate Teams | FalcoDash',
    description:
      'AI offer comparison, lead routing and transaction automation for real estate agents, teams and brokerages, built by a firm founded by a licensed Realtor.',
    h1: 'AI automation for real estate teams and brokerages.',
    shortAnswer:
      'Real estate teams use AI automation to compare offers, route and follow up with leads, and keep transactions on schedule. FalcoDash builds these systems for agents, teams and brokerages, including OPZ, our tool that turns a stack of offer PDFs into one side-by-side comparison with net to seller calculated.',
    highlights: [
      'Offer analysis and side-by-side comparison',
      'Lead routing and follow-up',
      'Transaction checklists and deadline reminders',
    ],
    useCases: [
      { title: 'Offer comparison', body: 'AI reads each offer, extracts price, financing, contingencies, credits and timelines, and calculates net to seller. Every figure links back to its page.' },
      { title: 'Lead routing and follow-up', body: 'Portal, website and sign-call leads land in your CRM, go to the right agent and get a timely response.' },
      { title: 'Transaction management', body: 'Checklists, deadlines and reminders generated from the contract, so nothing slips between acceptance and close.' },
      { title: 'Listing and marketing drafts', body: 'First drafts of listing descriptions, emails and social posts, written from the property data and reviewed by the agent.' },
    ],
    services: ['ai-workflows', 'automation', 'custom-apps', 'ai-agents'],
    work: ['opz'],
    blogCategory: 'Real estate',
    faqs: [
      { q: 'Can AI compare real estate offers?', a: 'Yes. AI can read each offer document, pull out the key terms and lay them side by side with net to seller calculated. The agent reviews the result instead of building it by hand.' },
      { q: 'Does this work with my brokerage’s CRM and transaction software?', a: 'In most cases, yes. We connect to the tools you already use and only add software when there is a gap.' },
      { q: 'Does FalcoDash understand real estate?', a: 'Yes. FalcoDash’s founder is a licensed California Realtor, and our tools are built around how transactions actually run.' },
    ],
  },
  {
    slug: 'small-business',
    name: 'Small & mid-size businesses',
    seoTitle: 'AI Automation for Small Businesses | FalcoDash',
    description:
      'AI automation for small and mid-size businesses: quote and invoice follow-up, inbox triage, KPI dashboards and custom AI assistants, scoped from a free audit.',
    h1: 'AI automation for small and mid-size businesses.',
    shortAnswer:
      'Small and mid-size businesses use AI automation to follow up on quotes and invoices, triage inboxes and support requests, and see their key numbers in one dashboard. FalcoDash starts with a free audit, builds the automations that pay back first and maintains them on a monthly retainer.',
    highlights: ['Quote and invoice follow-up', 'Inbox and support triage', 'Weekly KPI dashboards'],
    useCases: [
      { title: 'Quote and invoice follow-up', body: 'Quotes go out fast, follow-ups happen on schedule and overdue invoices get chased automatically.' },
      { title: 'Inbox and support triage', body: 'AI sorts incoming email and tickets, drafts replies to routine questions and routes the rest.' },
      { title: 'Weekly KPI dashboards', body: 'Revenue, pipeline and operations numbers in one live view, with no spreadsheet exports.' },
      { title: 'Team AI assistant', body: 'A shared assistant that answers questions from your own procedures, pricing and past work.' },
    ],
    services: ['automation', 'ai-workflows', 'dashboards', 'ai-agents', 'managed-automation'],
    work: [],
    blogCategory: 'Guides',
    faqs: [
      { q: 'Is AI automation worth it for a small business?', a: 'Usually, when a process repeats every week and follows clear rules. Start with one process and measure the hours saved.' },
      { q: 'How much does AI automation cost for a small business?', a: 'It depends on the number of processes, systems and people involved. A free audit gives you a written scope and a fixed quote before any build starts.' },
      { q: 'Do we need technical staff to run it?', a: 'No. We document everything, and on a managed retainer we monitor and maintain it for you.' },
    ],
  },
  {
    slug: 'associations',
    name: 'Community associations',
    seoTitle: 'HOA & Association Financial Dashboards | FalcoDash',
    description:
      'Real-time financial dashboards and board-ready reports for HOAs and community associations, connected to the accounting system you already use.',
    h1: 'Financial dashboards and reporting for community associations.',
    shortAnswer:
      'Community associations use FalcoDash to give boards a live view of operating cash, reserves, delinquencies and budget versus actual, updated automatically from their accounting system. The same data produces board-ready reports on schedule, so managers stop building them by hand.',
    highlights: ['Live financial dashboards', 'Board-ready monthly reports', 'Reserve and delinquency tracking'],
    useCases: [
      { title: 'Board financial dashboard', body: 'Operating cash, reserve balance and percent funded, delinquency rate and budget versus actual, always current.' },
      { title: 'Automated board packets', body: 'Monthly reports generated from the same data, in the format your board expects.' },
      { title: 'Role-based access', body: 'Board members, managers and owners each see what applies to them.' },
      { title: 'Owner questions', body: 'An assistant that answers common owner questions from your governing documents and policies.' },
    ],
    services: ['dashboards', 'automation', 'ai-agents', 'managed-automation'],
    work: ['associations'],
    blogCategory: 'Dashboards',
    faqs: [
      { q: 'What should an association board see on its financial dashboard?', a: 'Operating cash, reserve balance against the reserve study, delinquencies and budget versus actual, updated automatically from the accounting system.' },
      { q: 'Does the association need new accounting software?', a: 'No. The dashboard reads from the system you already use.' },
      { q: 'Where can I see the product?', a: 'FalcoDash for Associations runs at app.falcodash.com.' },
    ],
  },
  {
    slug: 'non-profits',
    name: 'Non-profits & public agencies',
    seoTitle: 'AI Automation for Non-Profits & Public Agencies | FalcoDash',
    description:
      'Donor and grant reporting, public data dashboards and intake routing for non-profits and public agencies. Scoped to your budget from a free audit.',
    h1: 'AI automation for non-profits and public agencies.',
    shortAnswer:
      'Non-profits and public agencies use AI automation to produce donor and grant reports on schedule, publish public data as readable dashboards, and route intake forms and cases to the right staff. FalcoDash scopes each project to the budget and keeps data in accounts the organization owns.',
    highlights: ['Public records and data dashboards', 'Grant and board reporting', 'Intake forms and case routing'],
    useCases: [
      { title: 'Donor and grant reporting', body: 'Donations, restricted funds and program outcomes in one dataset, with reports drafted in each funder’s format.' },
      { title: 'Public data dashboards', body: 'Large public datasets turned into searchable, readable dashboards, like our California campaign-finance tracker.' },
      { title: 'Intake and case routing', body: 'Forms and requests sorted, summarized and sent to the right staff member.' },
      { title: 'Board reporting', body: 'Board packets assembled automatically from program and finance data.' },
    ],
    services: ['dashboards', 'automation', 'ai-workflows'],
    work: ['ca'],
    blogCategory: 'Non-profits',
    faqs: [
      { q: 'Is AI automation affordable for a small non-profit?', a: 'Projects are scoped to the budget. A free audit shows what fits and what pays back first.' },
      { q: 'Is donor and constituent data kept private?', a: 'Data stays in accounts the organization owns, with access limited by role and every automated action logged.' },
      { q: 'Do you work with government agencies?', a: 'Yes. We build public data dashboards, reporting and intake automation for public agencies.' },
    ],
  },
];

export const industryBySlug = (slug: string) => INDUSTRIES.find((i) => i.slug === slug);
