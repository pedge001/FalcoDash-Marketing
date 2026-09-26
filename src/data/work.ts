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
  problem: string;
  built: string[];
  services: string[];
  industries: string[];
  appCategory: string;
  platform: string;
  faqs: FAQ[];
};

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
