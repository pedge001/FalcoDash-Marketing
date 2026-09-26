// Single source of truth for company facts. Pages, JSON-LD, llms.txt and emails all read from here,
// so the entity description stays identical everywhere search and answer engines look.

export const SITE = {
  name: 'FalcoDash',
  legalName: 'FalcoDash',
  url: 'https://falcodash.com',
  tagline: 'Better data. Better decisions.',
  descriptor: 'AI implementation & automation firm',
  description:
    'FalcoDash is an AI implementation and automation firm. We design, build and run AI workflows, AI agents, automations, dashboards and custom apps for real estate teams, growing businesses, associations and non-profits across the United States.',
  shortDescription: 'AI workflows, automations, dashboards and custom apps.',
  email: 'hello@falcodash.com',
  phone: '+1-909-499-6997',
  phoneDisplay: '(909) 499-6997',
  region: 'CA',
  regionName: 'California',
  country: 'US',
  areaServed: 'United States',
  locationLine: 'Based in California. Serving clients across the United States.',
  locale: 'en_US',
  themeColor: '#000000',
  founder: {
    name: 'Patrick Edgett',
    jobTitle: 'Founder',
    url: 'https://www.pennyempire.com',
    linkedin: 'https://www.linkedin.com/in/patrickedgett',
    sameAs: ['https://www.linkedin.com/in/patrickedgett', 'https://www.pennyempire.com', 'https://www.patrickedgett.com'],
  },
  sameAs: [] as string[],
  knowsAbout: [
    'AI automation',
    'AI workflows',
    'AI agents',
    'Large language models',
    'Business process automation',
    'Workflow automation',
    'Data dashboards',
    'Business intelligence',
    'Custom software development',
    'iOS app development',
    'Real estate technology',
    'Campaign finance data',
  ],
} as const;

/** Bump when the marketing pages' content changes; used as <lastmod> for non-blog pages in the sitemap. */
export const PAGES_UPDATED = '2026-09-25';

export const NAV = [
  { href: '/services', label: 'Services' },
  { href: '/work', label: 'Work' },
  { href: '/industries', label: 'Industries' },
  { href: '/how-we-work', label: 'How we work' },
  { href: '/blog', label: 'Blog' },
  { href: '/about', label: 'About' },
];

export const PRODUCTS = [
  { href: 'https://app.falcodash.com', label: 'app.falcodash.com' },
  { href: 'https://ca.falcodash.com', label: 'ca.falcodash.com' },
  { href: 'https://notes.falcodash.com', label: 'notes.falcodash.com' },
  { href: 'https://opz.falcodash.com', label: 'opz.falcodash.com' },
  { href: 'https://www.fieldyates.com', label: 'fieldyates.com' },
];

export const INDUSTRY_OPTIONS = [
  'Real estate',
  'Small / mid-size business',
  'Community association',
  'Non-profit / public agency',
  'Other',
];
