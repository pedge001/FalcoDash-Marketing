import type { FAQ } from './services';

export type Work = {
  slug: string;
  num: string;
  name: string;
  tags: string;
  url: string;
  host: string;
  /** Screenshot file name in src/assets/shots (without extension). */
  shot: string;
  shotLabel: string;
  shotAlt: string;
  summary: string;
  seoTitle: string;
  description: string;
  shortAnswer: string;
  audience: string;
  /** Case study: the situation before the build. */
  context: string;
  problem: string;
  /** Requirements the build had to meet. Only ones the shipped product demonstrably meets. */
  constraints: string[];
  built: string[];
  /** Tools and platforms. Every entry is TODO(confirm) until you've checked it. */
  stack: string[];
  /**
   * Results. Leave value null until you have a real, measured number. Null results never render on
   * the live site; they show as marked TODO placeholders in `npm run dev` (or with PUBLIC_SHOW_TODOS=1).
   */
  results: Result[];
  /** Optional client or user quote. Only add real, attributable quotes. */
  quote?: { text: string; name: string; role?: string };
  services: string[];
  industries: string[];
  appCategory: string;
  platform: string;
  faqs: FAQ[];
};

export type Result = { label: string; value: string | null; todo: string };

/** The standard result slots every case study starts with. */
const resultSlots = (opts: { hours: string; errors: string; cycle: string }): Result[] => [
  { label: 'Hours saved per week', value: null, todo: opts.hours },
  { label: 'Error rate', value: null, todo: opts.errors },
  { label: 'Cycle time', value: null, todo: opts.cycle },
];

export const WORK: Work[] = [
  {
    slug: 'associations',
    num: '01',
    name: 'FalcoDash for Associations',
    tags: 'Dashboard · Reporting',
    url: 'https://app.falcodash.com',
    host: 'app.falcodash.com',
    shot: 'work-app',
    shotLabel: 'Screenshot: app.falcodash.com dashboard',
    shotAlt: 'FalcoDash for Associations financial dashboard showing reserves, operating cash and delinquencies',
    summary: 'Real-time financial dashboards and board-ready reports for associations.',
    seoTitle: 'FalcoDash for Associations: HOA Financial Dashboard',
    description:
      'FalcoDash for Associations gives HOA and community association boards real-time financial dashboards and board-ready reports. Live at app.falcodash.com.',
    shortAnswer:
      'FalcoDash for Associations is a financial dashboard for HOAs and community associations. It shows boards operating cash, reserves, delinquencies and budget versus actual in one live view and produces board-ready reports from the same data.',
    audience: 'Association boards, community managers and management companies.',
    problem:
      'Board members wait weeks for financial reports that arrive as long PDFs, and managers spend days each month assembling them by hand.',
    context:
      'FalcoDash for Associations was the first FalcoDash product: a single dashboard for community association boards. It ran at falcodash.com until the firm took over that domain, and now lives at app.falcodash.com.',
    constraints: [
      'Board members are volunteers, not accountants, so every number has to read at a glance.',
      'Board members, managers and owners need to see different things, so access is set per person.',
      'The numbers come from the association’s existing accounting data, not a new system to maintain.',
    ],
    stack: [
      // TODO(confirm): taken from the Railway project list ("Falco Dash": web service + MySQL).
      'Web app',
      'MySQL',
      'Hosted on Railway',
    ],
    results: resultSlots({
      hours: 'Manager hours per month spent assembling the board financial report, before vs. after.',
      errors: 'Corrections or restatements in board financials, before vs. after.',
      cycle: 'Days from month-end close to the board seeing financials, before vs. after.',
    }),
    built: [
      'A live financial dashboard built for board members, not accountants.',
      'Board-ready reports generated from the same connected data.',
      'Role-based access for boards, managers and owners.',
    ],
    services: ['dashboards', 'automation', 'managed-automation'],
    industries: ['associations'],
    appCategory: 'FinanceApplication',
    platform: 'Web',
    faqs: [
      { q: 'What is FalcoDash for Associations?', a: 'A financial dashboard and reporting tool for HOAs and community associations, live at app.falcodash.com.' },
      { q: 'Is this the site that used to be falcodash.com?', a: 'Yes. The association dashboard moved to app.falcodash.com, and falcodash.com is now the home of the FalcoDash firm.' },
    ],
  },
  {
    slug: 'ca-campaign-finance',
    num: '02',
    name: 'CA FalcoDash',
    tags: 'Public data · Dashboard',
    url: 'https://ca.falcodash.com',
    host: 'ca.falcodash.com',
    shot: 'work-ca',
    shotLabel: 'Screenshot: ca.falcodash.com',
    shotAlt: 'CA FalcoDash campaign-finance tracker showing California contributions and spending',
    summary: 'California campaign-finance tracker. Follow the money in real time.',
    seoTitle: 'CA FalcoDash: California Campaign Finance Tracker',
    description:
      'CA FalcoDash is a real-time California campaign-finance tracker that turns public filings into a searchable dashboard. Follow the money at ca.falcodash.com.',
    shortAnswer:
      'CA FalcoDash is a California campaign-finance tracker. It turns public contribution and spending filings into a searchable, readable dashboard, so anyone can follow the money in California politics as filings come in.',
    audience: 'Journalists, campaigns, advocacy groups, researchers and engaged voters.',
    problem:
      'California campaign-finance data is public, but it is spread across large filings that are hard to search and harder to read.',
    context:
      'California campaign-finance filings are public, including the late contribution reports (Form 497) that campaigns must file close to an election. CA FalcoDash turns them into a tracker anyone can read.',
    constraints: [
      'Filings keep arriving, especially late reports before an election, so updates have to run on a schedule without manual work.',
      'Readers range from reporters to voters, so committees, candidates and contributors have to be searchable in plain language.',
    ],
    stack: [
      // TODO(confirm): taken from the Railway project list ("CA-FalcoDash": API, frontend, cron, Postgres).
      'Web front end and API service',
      'Scheduled ingestion jobs',
      'PostgreSQL',
      'Hosted on Railway',
    ],
    results: resultSlots({
      hours: 'Hours per week someone would spend pulling and cleaning filings by hand (if you have a baseline).',
      errors: 'Ingestion failures or mismatched filings per month.',
      cycle: 'Time from a filing being published to it appearing on the tracker.',
    }),
    built: [
      'Automated ingestion of public campaign-finance filings.',
      'Search and filters across committees, candidates and contributors.',
      'Readable dashboards that update as new filings arrive.',
    ],
    services: ['dashboards', 'automation'],
    industries: ['non-profits'],
    appCategory: 'ReferenceApplication',
    platform: 'Web',
    faqs: [
      { q: 'Where does CA FalcoDash get its data?', a: 'From public California campaign-finance filings.' },
      { q: 'Can FalcoDash build a public data tracker for our organization?', a: 'Yes. The same approach works for any large public dataset your organization needs to publish or monitor.' },
    ],
  },
  {
    slug: 'notes',
    num: '03',
    name: 'FalcoDash Notes',
    tags: 'iOS app · Field tool',
    url: 'https://notes.falcodash.com',
    host: 'notes.falcodash.com',
    shot: 'work-notes',
    shotLabel: 'Screenshot: Notes iOS app',
    shotAlt: 'FalcoDash Notes iOS app for forensic architects capturing site notes and photos',
    summary: 'Custom iOS app for forensic architects.',
    seoTitle: 'FalcoDash Notes: Custom iOS App for Forensic Architects',
    description:
      'FalcoDash Notes is a custom iOS field app built for forensic architects to capture site observations, photos and notes and turn them into reports.',
    shortAnswer:
      'FalcoDash Notes is a custom iOS app built for forensic architects. It lets them capture observations, photos and notes on site and organize them for reporting back at the office.',
    audience: 'Forensic architects and field investigators.',
    problem:
      'General note-taking apps did not match how forensic architects document a site, leaving observations scattered across photos, paper and memory.',
    context:
      'Forensic architects document building conditions on site and turn their observations into reports. FalcoDash Notes is a custom iOS app built for that work.',
    constraints: [
      'It has to work on site, on an iOS device, while the architect is inspecting.',
      'Observations, photos and notes have to stay organized by project so they can go straight into a report.',
      // TODO(confirm): does it work offline on site? If so, add it as a constraint.
    ],
    stack: [
      // TODO(confirm): language/framework, sync and storage.
      'iOS app',
    ],
    results: resultSlots({
      hours: 'Hours per inspection spent reorganizing notes and photos for the report, before vs. after.',
      errors: 'Observations missed or mismatched to photos in reports, before vs. after.',
      cycle: 'Days from site visit to finished report, before vs. after.',
    }),
    built: [
      'A native iOS app designed around the site inspection workflow.',
      'Structured capture of observations, photos and notes.',
      'Organized output ready for reporting.',
    ],
    services: ['custom-apps'],
    industries: ['small-business'],
    appCategory: 'BusinessApplication',
    platform: 'iOS',
    faqs: [
      { q: 'Does FalcoDash build iOS apps?', a: 'Yes. FalcoDash Notes is a native iOS app, and we build custom iOS and web apps for field teams.' },
    ],
  },
  {
    slug: 'opz',
    num: '04',
    name: 'OPZ',
    tags: 'Real estate · AI workflow',
    url: 'https://opz.falcodash.com',
    host: 'opz.falcodash.com',
    shot: 'work-opz',
    shotLabel: 'Screenshot: opz.falcodash.com',
    shotAlt: 'OPZ side-by-side comparison of real estate offers with net to seller calculated',
    summary: 'Automated offer analysis and comparison for Realtors.',
    seoTitle: 'OPZ: AI Offer Analysis & Comparison for Realtors',
    description:
      'OPZ uses AI to read real estate offers, extract the key terms and build a side-by-side comparison with net to seller calculated. Built by FalcoDash for Realtors.',
    shortAnswer:
      'OPZ is an AI tool for Realtors that reads each purchase offer, extracts price, financing, contingencies, credits and timelines, and lays the offers side by side with net to seller calculated. Every figure links back to the page it came from so the agent can check it.',
    audience: 'Listing agents, real estate teams and brokerages.',
    problem:
      'Every offer arrives as a different document with terms in different places. Building a clean comparison for the seller by hand is slow and easy to get wrong.',
    context:
      'When a listing gets several offers, the listing agent has to explain them to the seller side by side. OPZ was built by FalcoDash, whose founder is a licensed California Realtor, around that exact moment.',
    constraints: [
      'Agents present the comparison to sellers, so every figure links back to the page of the offer it came from.',
      'Offers arrive as different documents with terms in different places, so extraction can’t rely on one fixed layout.',
      'The seller needs a single number to compare, so net to seller is calculated with commission, credits and costs applied.',
    ],
    stack: [
      // TODO(confirm): taken from the Railway project list ("OPZ - FalcoDash": app + Postgres). Add the AI model/provider used for extraction.
      'Web app',
      'AI document extraction',
      'PostgreSQL',
      'Hosted on Railway',
    ],
    results: resultSlots({
      hours: 'Agent hours per listing spent building offer comparisons, before vs. after.',
      errors: 'Extraction corrections needed per offer (share of fields the agent had to fix).',
      cycle: 'Minutes from receiving the offers to a seller-ready comparison, before vs. after.',
    }),
    built: [
      'AI extraction of key terms from each offer document.',
      'A side-by-side comparison with net to seller calculated.',
      'Source links from every figure back to the offer page.',
    ],
    services: ['ai-workflows', 'custom-apps'],
    industries: ['real-estate'],
    appCategory: 'BusinessApplication',
    platform: 'Web',
    faqs: [
      { q: 'What is OPZ?', a: 'OPZ is the FalcoDash tool that automates offer analysis and comparison for Realtors.' },
      { q: 'Does the agent still review the offers?', a: 'Yes. Every figure links to its source so the agent can check it before sharing it with the seller.' },
    ],
  },
  {
    slug: 'field-yates',
    num: '05',
    name: 'Field Yates',
    tags: 'Sports data · League hub',
    url: 'https://www.fieldyates.com',
    host: 'fieldyates.com',
    shot: 'work-fieldyates',
    shotLabel: 'Screenshot: fieldyates.com',
    shotAlt: 'Field Yates fantasy football league hub showing standings, records and all-time title leaders',
    summary: 'Fifteen seasons of fantasy football league data in one live hub.',
    seoTitle: 'Field Yates: Fantasy Football League Data Hub',
    description:
      'Field Yates brings fifteen seasons of a fantasy football league into one hub: live standings, all-time records, member profiles and a rule book with voting.',
    shortAnswer:
      'Field Yates is a custom data hub for a twelve-person fantasy football league. It brings fifteen seasons of league history, across the move from ESPN to Sleeper, into one place with live standings, all-time records, member profiles and a rule book the league votes on.',
    audience: 'A twelve-manager fantasy football league running since 2011.',
    problem:
      'Fifteen seasons of results, records and rules were scattered across two fantasy platforms, old spreadsheets and group chats, and nobody could settle an argument quickly.',
    context:
      'A twelve-manager fantasy football league has run since 2011. Its history spans two platforms: ESPN, then Sleeper from 2025.',
    constraints: [
      'Fifteen seasons of results had to be combined across two platforms into one history.',
      'Standings, records and rules all had to live in one place the whole league could check.',
    ],
    stack: [
      // TODO(confirm): data source/API and hosting.
      'Web app',
      'League data from ESPN and Sleeper',
    ],
    results: resultSlots({
      hours: 'Commissioner hours per season spent updating records and standings by hand, before vs. after.',
      errors: 'Disputed or corrected records, before vs. after.',
      cycle: 'Time for standings and records to update after a week’s games.',
    }),
    built: [
      'One history across ESPN and Sleeper seasons.',
      'Live standings plus all-time leaderboards and member profiles sortable by titles, win percentage and points.',
      'A rule book with voting on rule proposals.',
    ],
    services: ['dashboards', 'custom-apps'],
    industries: [],
    appCategory: 'SportsApplication',
    platform: 'Web',
    faqs: [
      { q: 'What is Field Yates?', a: 'A custom league hub that turns fifteen seasons of fantasy football data into live standings, records and member profiles.' },
      { q: 'Why is a fantasy football site in a business portfolio?', a: 'It is the same problem our clients have at a smaller scale: years of data spread across systems that change, pulled into one view people actually use.' },
    ],
  },
];

export const workBySlug = (slug: string) => WORK.find((w) => w.slug === slug);
/** Service and industry data reference work by a short key. */
export const WORK_KEYS: Record<string, string> = {
  associations: 'associations',
  ca: 'ca-campaign-finance',
  notes: 'notes',
  opz: 'opz',
  fieldyates: 'field-yates',
};
export const workByKey = (key: string) => workBySlug(WORK_KEYS[key] ?? key);
