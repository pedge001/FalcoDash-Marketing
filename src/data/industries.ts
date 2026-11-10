import type { FAQ } from './services';

export type Industry = {
  slug: string;
  name: string;
  seoTitle: string;
  description: string;
  h1: string;
  shortAnswer: string;
  /** Heading for the short-answer box; defaults to "Short answer". */
  question?: string;
  /** Three quick wins shown on the home page list. */
  highlights: string[];
  useCases: { title: string; body: string }[];
  services: string[];
  work: string[];
  blogCategory?: string;
  faqs: FAQ[];
  /** "What a first project looks like": the timeline, what we need from you, what you get. */
  firstProject?: {
    intro: string;
    steps: { when: string; title: string; body: string }[];
    needs: string[];
    gets: string[];
  };
};

// Shared first-project timeline. Durations are only the ones the site already commits to
// (one-session audit, fixed quote before building, first automation often live in a few weeks).
// TODO(confirm): add typical week ranges per industry if you want to commit to them.
const firstSteps = (build: string) => [
  { when: 'Week 1 · Free', title: 'Automation audit', body: 'One working session on how reporting runs today: where the data lives, who builds what, and what takes the longest. You get a written shortlist of what to automate first.' },
  { when: 'Before any build', title: 'Scope and fixed quote', body: 'A written scope for the first project, with the systems involved, a timeline and a fixed price. Nothing is built until you approve it.' },
  { when: 'Build · often a few weeks', title: 'Build and test on your data', body: build },
  { when: 'Launch', title: 'Handover', body: 'A runbook, a training session for your staff and access set up in your name. Keep us on a monthly retainer to run it, or run it yourselves.' },
];

export const INDUSTRIES: Industry[] = [
  {
    slug: 'real-estate',
    name: 'Real estate teams & brokerages',
    seoTitle: 'AI Automation for Real Estate Teams | FalcoDash',
    description:
      'AI offer comparison, lead routing and transaction automation for real estate agents, teams and brokerages, built by a firm founded by a licensed Realtor.',
    h1: 'AI automation for real estate teams and brokerages.',
    question: 'How do real estate teams use AI automation?',
    shortAnswer:
      'Real estate teams use AI automation to compare offers, route and follow up with leads, and keep transactions on schedule. FalcoDash builds these systems for agents, teams and brokerages, including OPZ, our tool that turns a stack of offer PDFs into one side-by-side comparison with net to seller calculated. FalcoDash was founded by Patrick Edgett, a licensed California Realtor.',
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
      // TODO(confirm): add the DRE license number to the founder answer if you want it shown.
      { q: 'Can AI compare real estate offers?', a: 'Yes. AI can read each offer document, pull out price, financing, contingencies, credits and timelines, and lay the offers side by side with net to seller calculated. That is what [OPZ](/work/opz) does. The agent reviews the comparison instead of building it by hand.' },
      { q: 'What is OPZ?', a: 'OPZ is the FalcoDash tool that automates offer analysis and comparison for Realtors. Every figure links back to the page of the offer it came from, so the agent can check it before sharing it with the seller. See the [OPZ case study](/work/opz).' },
      { q: 'Does FalcoDash understand real estate?', a: 'Yes. FalcoDash was founded by Patrick Edgett, a licensed California Realtor, and our real estate tools are built around how listings, offers and transactions actually run.' },
      { q: 'Does the agent stay in control?', a: 'Yes. AI drafts and extracts; the agent reviews and approves anything that goes to a client, a seller or another agent.' },
      { q: 'Does this work with my brokerage’s CRM and transaction software?', a: 'In most cases, yes. We connect to the tools you already use and only add software when there is a gap.' },
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
    firstProject: {
      intro: 'Most associations start with one board dashboard and the monthly report that comes from it.',
      steps: firstSteps('We connect your accounting data, check every figure against your last statements, and build the dashboard and monthly board report. Your manager or treasurer reviews it before the board sees it.'),
      needs: [
        'Read-only access to your accounting system, or the monthly exports you already send the board.',
        'Your current budget and most recent reserve study.',
        'A copy of the board packet you send today.',
        'One point person, usually the manager or treasurer, for questions.',
      ],
      gets: [
        'A live dashboard of operating cash, reserves against the reserve study, delinquencies and budget versus actual.',
        'The monthly board report, generated from the same data.',
        'Access set per person for board members, managers and owners.',
        'Documentation and a handover session, with code, data and accounts in the association’s name.',
      ],
    },
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
    firstProject: {
      intro: 'Most non-profits start with the report that takes the most staff time, usually one funder’s grant report.',
      steps: firstSteps('We connect your donor, accounting and program records into one dataset, then build the report in that funder’s format. Staff review every draft before it goes out.'),
      needs: [
        'Access to your donor database, accounting system and wherever program data is kept.',
        'The reporting requirements or template from one or two funders.',
        'Your rules for who may see donor and client information.',
        'One staff point person for questions.',
      ],
      gets: [
        'One clean, connected dataset of donations, restricted funds and program outcomes.',
        'Reports drafted on schedule in each funder’s format, waiting for staff review.',
        'A dashboard of the same numbers for staff and the board.',
        'Documentation and a handover session, with data kept in accounts the organization owns.',
      ],
    },
    faqs: [
      { q: 'Is AI automation affordable for a small non-profit?', a: 'Projects are scoped to the budget. A free audit shows what fits and what pays back first.' },
      { q: 'Is donor and constituent data kept private?', a: 'Data stays in accounts the organization owns, with access limited by role and every automated action logged.' },
      { q: 'Do you work with government agencies?', a: 'Yes. We build public data dashboards, reporting and intake automation for public agencies.' },
    ],
  },
];

export const industryBySlug = (slug: string) => INDUSTRIES.find((i) => i.slug === slug);
