import type { FAQ } from './services';

/** The core questions shown on the home page (and first on /faq). */
export const CORE_FAQS: FAQ[] = [
  { q: 'What does an AI automation firm do?', a: 'It finds the repetitive work in a business and builds software that does it: AI workflows, AI assistants, automations between your tools, dashboards and custom apps. FalcoDash also maintains those systems on a monthly retainer.' },
  { q: 'How much does AI automation cost?', a: 'It depends on the number of processes, systems and users involved. Every project starts with a free audit, and you get a fixed scope and quote before any build begins.' },
  { q: 'How long does a project take?', a: 'A single automation is often live within a few weeks. Larger builds with several integrations take longer. Your proposal includes a timeline.' },
  { q: 'Which tools do you work with?', a: 'We build on the systems you already use, including CRMs, spreadsheets, email, accounting software and databases, and add custom code where they fall short.' },
  { q: 'Is my data safe?', a: 'Your data stays in accounts you own. We limit access, log what each automation does and keep a person in the loop for anything sensitive.' },
  { q: 'Do you work outside California?', a: 'Yes. FalcoDash is based in California and works with clients across the United States.' },
];

/** Extra questions that only appear on /faq. */
export const MORE_FAQS: FAQ[] = [
  { q: 'What is included in the free automation audit?', a: 'A working session on how your team runs today, followed by a written shortlist of what to automate first, with a rough estimate of the hours each item would save.' },
  { q: 'What is the difference between the free audit and the paid strategy session?', a: 'The audit finds the opportunities. The strategy session scopes one of them in depth: systems, data, risks and a build plan you can take to any vendor.' },
  { q: 'Who owns what you build?', a: 'You do. Code, data and accounts stay in your name, and every system ships with a runbook and a handover session.' },
  { q: 'Do you replace staff with AI?', a: 'We remove repetitive work so your people can spend their time on the work that needs them. AI drafts; your team approves anything that leaves the building.' },
  { q: 'What happened to the old falcodash.com dashboard?', a: 'The association financial dashboard moved to app.falcodash.com. falcodash.com is now the home of the FalcoDash firm and its products.' },
];
