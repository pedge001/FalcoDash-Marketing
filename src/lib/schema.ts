// JSON-LD builders. Every node references the organization by @id so search and answer engines
// resolve one FalcoDash entity across the whole site.
import { SITE } from '~/data/site';
import type { FAQ } from '~/data/services';

export const ORG_ID = `${SITE.url}/#organization`;
export const WEBSITE_ID = `${SITE.url}/#website`;
export const FOUNDER_ID = `${SITE.url}/about#founder`;

/** Absolute canonical URL. The site uses no trailing slashes, except the root. */
export const abs = (path: string) => (path === '/' || path === '' ? `${SITE.url}/` : `${SITE.url}${path.replace(/\/$/, '')}`);

export function organization() {
  return {
    '@type': ['Organization', 'ProfessionalService'],
    '@id': ORG_ID,
    name: SITE.name,
    url: `${SITE.url}/`,
    logo: { '@type': 'ImageObject', url: `${SITE.url}/icon-512.png`, width: 512, height: 512 },
    image: `${SITE.url}/og/default.png`,
    email: SITE.email,
    telephone: SITE.phone,
    slogan: SITE.tagline,
    description: SITE.description,
    areaServed: { '@type': 'Country', name: SITE.areaServed },
    address: { '@type': 'PostalAddress', addressRegion: SITE.region, addressCountry: SITE.country },
    knowsAbout: SITE.knowsAbout,
    founder: { '@id': FOUNDER_ID },
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'sales',
      email: SITE.email,
      telephone: SITE.phone,
      areaServed: SITE.country,
      availableLanguage: 'English',
    },
    ...(SITE.sameAs.length ? { sameAs: SITE.sameAs } : {}),
  };
}

export function website() {
  return {
    '@type': 'WebSite',
    '@id': WEBSITE_ID,
    url: `${SITE.url}/`,
    name: SITE.name,
    description: SITE.description,
    publisher: { '@id': ORG_ID },
    inLanguage: 'en-US',
  };
}

export function founder() {
  return {
    '@type': 'Person',
    '@id': FOUNDER_ID,
    name: SITE.founder.name,
    jobTitle: SITE.founder.jobTitle,
    worksFor: { '@id': ORG_ID },
    url: SITE.founder.url,
    sameAs: SITE.founder.sameAs,
    knowsAbout: ['AI automation', 'Real estate', 'Marketing', 'Operations', 'Data dashboards'],
  };
}

export function webPage(opts: { path: string; title: string; description: string; type?: string; dateModified?: string }) {
  return {
    '@type': opts.type ?? 'WebPage',
    '@id': `${abs(opts.path)}#webpage`,
    url: abs(opts.path),
    name: opts.title,
    description: opts.description,
    isPartOf: { '@id': WEBSITE_ID },
    about: { '@id': ORG_ID },
    inLanguage: 'en-US',
    ...(opts.dateModified ? { dateModified: opts.dateModified } : {}),
    speakable: { '@type': 'SpeakableSpecification', cssSelector: ['h1', '[data-answer]'] },
  };
}

export function breadcrumbs(items: { name: string; path: string }[]) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      item: abs(it.path),
    })),
  };
}

export function faqPage(faqs: FAQ[], path: string) {
  return {
    '@type': 'FAQPage',
    '@id': `${abs(path)}#faq`,
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };
}

export function service(opts: { name: string; serviceType: string; description: string; path: string; audience?: string[] }) {
  return {
    '@type': 'Service',
    '@id': `${abs(opts.path)}#service`,
    name: opts.name,
    serviceType: opts.serviceType,
    description: opts.description,
    url: abs(opts.path),
    provider: { '@id': ORG_ID },
    areaServed: { '@type': 'Country', name: SITE.areaServed },
    ...(opts.audience?.length
      ? { audience: opts.audience.map((a) => ({ '@type': 'BusinessAudience', audienceType: a })) }
      : {}),
  };
}

export function graph(...nodes: object[]) {
  return { '@context': 'https://schema.org', '@graph': nodes };
}
