export type FAQ = { q: string; a: string };

export type Service = {
  slug: string;
  num: string;
  name: string;
  /** <title> — keep under ~60 characters. */
  seoTitle: string;
  /** Meta description — 140–160 characters. */
  description: string;
  h1: string;
  /** Card copy on the home page and services index. */
  summary: string;
  /** Direct 2–4 sentence answer to "What is X?" — the passage answer engines quote. */
  shortAnswer: string;
  /** The question the short answer responds to. */
  question: string;
  examplesHeading: string;
  examples: { title: string; body: string }[];
  stepsHeading: string;
  steps: { title: string; body: string }[];
  fitHeading: string;
  fit: string[];
  work: string[];
  industries: string[];
  faqs: FAQ[];
  serviceType: string;
};

export const SERVICES: Service[] = [
  {
    slug: 'ai-workflows',
    num: '01',
    name: 'AI workflows',
    seoTitle: 'AI Workflow Development | FalcoDash',
    description:
      'FalcoDash builds AI workflows that read documents, triage requests and draft replies on language models, with a person approving the steps that matter.',
    h1: 'AI workflows that do the reading, sorting and drafting.',
    summary:
      'Multi-step processes that run on language models: intake, document review, drafting and triage, with a person approving the steps that matter.',
    shortAnswer:
      'An AI workflow is a multi-step business process where a language model handles the steps that used to need a person to read, decide or write. FalcoDash builds them on top of the tools you already use, logs every step and routes anything sensitive to a person for approval.',
    question: 'What is an AI workflow?',
    examplesHeading: 'What an AI workflow can take off your team',
    examples: [
      { title: 'Document intake', body: 'Read PDFs, contracts, offers and forms as they arrive, pull out the fields that matter and file them in the right system.' },
      { title: 'Inbox and request triage', body: 'Sort incoming email and form requests by type and urgency, answer the routine ones in draft and route the rest to the right person.' },
      { title: 'Drafting', body: 'Produce first drafts of reports, follow-ups, summaries and proposals from your own data and templates.' },
      { title: 'Review and comparison', body: 'Compare documents side by side, flag what changed or what is missing, and link every figure back to its source page.' },
    ],
    stepsHeading: 'How we build an AI workflow',
    steps: [
      { title: 'Map the process', body: 'We sit with the people who do the work today and write down every step, input and decision.' },
      { title: 'Choose where AI helps', body: 'Rules handle the predictable steps. A language model handles the reading and judgment. A person approves what leaves the building.' },
      { title: 'Build and test on real data', body: 'We run the workflow against your past cases and measure accuracy before anyone relies on it.' },
      { title: 'Launch with logging', body: 'Every run is logged so you can see what the AI did, why, and what a person changed.' },
    ],
    fitHeading: 'A good fit when',
    fit: [
      'Someone on your team spends hours a week reading and re-keying documents.',
      'Requests arrive in many formats and have to be sorted before anyone can act.',
      'The same kinds of drafts get written over and over from the same data.',
    ],
    work: ['opz'],
    industries: ['real-estate', 'small-business', 'non-profits'],
    serviceType: 'AI workflow development',
    faqs: [
      { q: 'What is the difference between an AI workflow and an automation?', a: 'A rule-based automation follows fixed instructions: when X happens, do Y. An AI workflow adds a language model for the steps that need reading, judgment or writing. Most systems we build use both.' },
      { q: 'Which AI models do you use?', a: 'We choose the model per task, based on accuracy, cost and where your data is allowed to go. We use leading commercial models from providers such as Anthropic and OpenAI, and we can swap models later without rebuilding the workflow.' },
      { q: 'Will the AI send anything without a person checking it?', a: 'Only if you decide it should. By default, anything that goes to a customer, a client or the public waits for a person to approve it.' },
      { q: 'How accurate is it?', a: 'We measure accuracy on your own past cases before launch and report it to you. Every extracted figure links back to its source so a person can check it quickly.' },
    ],
  },
  {
    slug: 'ai-agents',
    num: '02',
    name: 'AI agents & assistants',
    seoTitle: 'Custom AI Agents & Assistants for Business | FalcoDash',
    description:
      'Custom AI assistants and agents trained on your documents, connected to your tools and limited to the actions you approve. Designed, built and run by FalcoDash.',
    h1: 'Custom AI assistants that know your business.',
    summary:
      'Assistants and agents set up on your own documents, data and tools, so your team gets answers and actions specific to how you work.',
    shortAnswer:
      'A custom AI assistant is a language model connected to your own documents, data and software, with instructions and permissions set for your business. FalcoDash designs, builds and maintains these assistants, from an internal knowledge assistant to an agent that can take approved actions in your systems.',
    question: 'What is a custom AI assistant?',
    examplesHeading: 'What we set up',
    examples: [
      { title: 'Internal knowledge assistant', body: 'Answers staff questions from your policies, contracts, procedures and past work, and cites the document each answer came from.' },
      { title: 'Client-facing assistant', body: 'Answers common questions on your site or in your client portal using only approved information, and hands off to a person when it should.' },
      { title: 'Action-taking agents', body: 'Looks up records, updates your CRM, schedules follow-ups or prepares a file, inside limits you set and with a log of every action.' },
      { title: 'AI tool rollout', body: 'Configures ChatGPT, Claude or Microsoft Copilot for your team: shared instructions, connected data, access rules and training.' },
    ],
    stepsHeading: 'How we customize AI for your team',
    steps: [
      { title: 'Define the job', body: 'We agree on exactly what the assistant should answer or do, and what it must never do.' },
      { title: 'Connect your knowledge', body: 'We gather and clean the documents and data it needs, and set who can see what.' },
      { title: 'Set guardrails', body: 'Permissions, approved sources, hand-off rules and a full activity log.' },
      { title: 'Train your team', body: 'A handover session and a written guide, then monthly tuning based on real questions.' },
    ],
    fitHeading: 'A good fit when',
    fit: [
      'The same questions reach your senior people every week.',
      'Your team already uses AI tools, but with no shared setup, data or rules.',
      'Information lives across drives, inboxes and systems and is hard to find.',
    ],
    work: [],
    industries: ['real-estate', 'small-business', 'associations'],
    serviceType: 'Custom AI assistant development',
    faqs: [
      { q: 'What is the difference between an AI assistant and an AI agent?', a: 'An assistant answers questions and drafts content. An agent can also take actions in your software, such as updating a record or scheduling a task. We start most teams with an assistant and add actions once it has proven reliable.' },
      { q: 'Is our data used to train public AI models?', a: 'We set up assistants on business plans and APIs whose terms exclude your data from model training, and we keep your documents in accounts you own.' },
      { q: 'Can you set up ChatGPT, Claude or Copilot for our team?', a: 'Yes. We configure the tool you prefer with shared instructions, connected data sources and access rules, then train your team to use it well.' },
      { q: 'What stops the assistant from making things up?', a: 'We limit it to your approved sources, require it to cite them, and have it say when it does not know. We test it against real questions before launch.' },
    ],
  },
  {
    slug: 'automation',
    num: '03',
    name: 'Automations',
    seoTitle: 'Business Process Automation Services | FalcoDash',
    description:
      'Lead routing, follow-up, reporting and data entry automated across the tools you already pay for. FalcoDash builds, documents and maintains every automation.',
    h1: 'Automations that move the data so your team does not have to.',
    summary:
      'Lead routing, follow-up, reporting and data entry, connected across the tools you already pay for.',
    shortAnswer:
      'Business process automation connects the software you already use so that routine steps, such as copying data, sending reminders and routing leads, happen on their own. FalcoDash builds these automations, documents them and keeps them running as your tools change.',
    question: 'What is business process automation?',
    examplesHeading: 'Common automations we build',
    examples: [
      { title: 'Lead routing and follow-up', body: 'New leads land in the CRM, go to the right person and get a timely follow-up without anyone copying and pasting.' },
      { title: 'Quotes, invoices and reminders', body: 'Quotes go out on time, unpaid invoices get chased and deadlines trigger reminders before they are missed.' },
      { title: 'Data entry between systems', body: 'Form submissions, spreadsheets and orders sync to the systems that need them, with checks for duplicates and errors.' },
      { title: 'Scheduled reports', body: 'Weekly and monthly reports assemble themselves and arrive in the right inboxes.' },
    ],
    stepsHeading: 'How an automation project runs',
    steps: [
      { title: 'Audit', body: 'We list the repetitive tasks, estimate the hours each one costs and pick the ones that pay back first.' },
      { title: 'Build', body: 'We connect your tools with the simplest reliable method, from no-code platforms to custom code.' },
      { title: 'Test', body: 'We run each automation on real records and add alerts for anything that fails.' },
      { title: 'Hand over', body: 'You get a runbook describing what each automation does and how to change it.' },
    ],
    fitHeading: 'A good fit when',
    fit: [
      'People copy the same data between two or more systems every day.',
      'Follow-ups and reminders depend on someone remembering.',
      'Your existing Zapier or Make automations break and nobody owns them.',
    ],
    work: ['associations'],
    industries: ['small-business', 'real-estate', 'non-profits'],
    serviceType: 'Business process automation',
    faqs: [
      { q: 'Do I need to replace my current software?', a: 'No. Most automations connect the tools you already use. We only recommend new software when your current tools cannot do the job.' },
      { q: 'Do you use Zapier or Make?', a: 'When they are the simplest reliable option, yes. For higher volume, sensitive data or complex logic we write custom code. We can also take over and fix automations you already run.' },
      { q: 'What happens when an automation breaks?', a: 'Every automation we ship has alerts. On a managed retainer we monitor them and fix issues before your team notices.' },
    ],
  },
  {
    slug: 'dashboards',
    num: '04',
    name: 'Dashboards',
    seoTitle: 'Custom Business Dashboards & Reporting | FalcoDash',
    description:
      'One live view of the numbers that matter, built on clean, connected data. FalcoDash builds real-time dashboards and board-ready reports for teams and boards.',
    h1: 'One live view of the numbers that matter.',
    summary:
      'One live view of the numbers that matter, built on clean, connected data and ready for the board.',
    shortAnswer:
      'A business dashboard is a live page that shows the handful of numbers a team or board needs, pulled automatically from the systems where the data already lives. FalcoDash connects and cleans that data, builds the dashboard and generates board-ready reports from it.',
    question: 'What is a business dashboard?',
    examplesHeading: 'Dashboards we build',
    examples: [
      { title: 'Financial dashboards for boards', body: 'Operating cash, reserves, delinquencies and budget versus actual, updated from your accounting system.' },
      { title: 'Weekly KPI dashboards', body: 'Pipeline, revenue, response times and team output in one place, with no spreadsheet exports.' },
      { title: 'Public data trackers', body: 'Large public datasets, such as campaign-finance filings, turned into searchable, readable dashboards.' },
      { title: 'Automated report packets', body: 'The same data produces your monthly board or investor packet on schedule.' },
    ],
    stepsHeading: 'How we build a dashboard',
    steps: [
      { title: 'Pick the numbers', body: 'We agree on the few metrics that drive decisions and who needs to see each one.' },
      { title: 'Connect and clean the data', body: 'We connect each source, fix duplicates and gaps, and document every definition.' },
      { title: 'Design for the reader', body: 'Clear layouts built for a board member or owner, not an analyst.' },
      { title: 'Keep it current', body: 'Data refreshes on its own, with alerts when a source stops updating.' },
    ],
    fitHeading: 'A good fit when',
    fit: [
      'Someone spends days each month building reports in spreadsheets.',
      'Board members or owners ask for numbers nobody can produce quickly.',
      'Different reports show different numbers for the same thing.',
    ],
    work: ['associations', 'ca', 'fieldyates'],
    industries: ['associations', 'non-profits', 'small-business'],
    serviceType: 'Dashboard and reporting development',
    faqs: [
      { q: 'Do we need new accounting or CRM software for a dashboard?', a: 'No. The dashboard reads from the systems you already use.' },
      { q: 'Who can see the dashboard?', a: 'Access is set per person, so board members, managers and owners each see what applies to them.' },
      { q: 'Can the dashboard produce our board reports?', a: 'Yes. The same connected data can generate a monthly board packet automatically.' },
    ],
  },
  {
    slug: 'custom-apps',
    num: '05',
    name: 'Custom apps',
    seoTitle: 'Custom Web & iOS App Development | FalcoDash',
    description:
      'Web and iOS tools built for the jobs off-the-shelf software does not fit, with AI built in where it helps. Designed, built and supported by FalcoDash.',
    h1: 'Custom apps for the jobs off-the-shelf software does not fit.',
    summary: "Web and iOS tools built for the jobs off-the-shelf software doesn't fit.",
    shortAnswer:
      'A custom app is software built for one specific job in your business, when no product on the market fits the way your team works. FalcoDash designs and builds web and iOS apps, adds AI where it saves time, and hands over the code and accounts in your name.',
    question: 'What is a custom app?',
    examplesHeading: 'What we build',
    examples: [
      { title: 'Field apps for iOS', body: 'Capture notes, photos and measurements on site, sync them to the office and turn them into reports.' },
      { title: 'Client and member portals', body: 'Give clients, members or boards a secure place to see their data, documents and status.' },
      { title: 'Internal tools', body: 'Replace the spreadsheet that runs your business with a proper app that has permissions and history.' },
      { title: 'AI-powered products', body: 'Tools with AI at the core, such as document analysis and comparison.' },
    ],
    stepsHeading: 'How we build an app',
    steps: [
      { title: 'Scope', body: 'A written scope with screens, data, integrations and a fixed quote.' },
      { title: 'Prototype', body: 'Clickable screens your team can react to before we write production code.' },
      { title: 'Build in short cycles', body: 'You see working software every week or two.' },
      { title: 'Launch and support', body: 'We deploy, train your team and keep the app updated.' },
    ],
    fitHeading: 'A good fit when',
    fit: [
      'Your team works around your software instead of with it.',
      'A critical process runs on a spreadsheet only one person understands.',
      'You need a tool in the field that works on an iPhone or iPad.',
    ],
    work: ['notes', 'opz'],
    industries: ['real-estate', 'small-business'],
    serviceType: 'Custom software development',
    faqs: [
      { q: 'Do we own the code?', a: 'Yes. Code, data and accounts are in your name, and every app ships with documentation.' },
      { q: 'Do you build iPhone and iPad apps?', a: 'Yes. We build native iOS apps as well as web apps that work on any device.' },
      { q: 'How long does a custom app take?', a: 'It depends on scope. A focused internal tool can launch in weeks; larger products take longer. Your written scope includes a timeline.' },
    ],
  },
  {
    slug: 'managed-automation',
    num: '06',
    name: 'Managed automation',
    seoTitle: 'Managed AI Automation Retainer | FalcoDash',
    description:
      'A monthly retainer in which FalcoDash monitors, maintains and improves your AI workflows and automations, and keeps adding new ones as your business changes.',
    h1: 'We run it, so it keeps working after launch.',
    summary:
      "A retainer. We monitor, maintain and improve what's running, and keep adding to it.",
    shortAnswer:
      'A managed automation retainer is a monthly agreement in which FalcoDash monitors, maintains and improves the AI workflows, automations and dashboards we build, and adds new ones over time. It keeps systems working as your software, AI models and processes change.',
    question: 'What is a managed automation retainer?',
    examplesHeading: 'What the retainer covers',
    examples: [
      { title: 'Monitoring', body: 'Alerts on every workflow and automation, watched by us, not your team.' },
      { title: 'Fixes and updates', body: 'When a connected tool or AI model changes, we update the system before it breaks.' },
      { title: 'Small changes', body: 'New fields, new reports, new steps, handled as part of the month.' },
      { title: 'Monthly review', body: 'A usage and hours-saved report, plus a short list of what to automate next.' },
    ],
    stepsHeading: 'How the retainer works',
    steps: [
      { title: 'Baseline', body: 'We document everything that is running and set up monitoring.' },
      { title: 'Monitor', body: 'We watch alerts and fix issues as they come up.' },
      { title: 'Improve', body: 'Each month we tune what is running based on real usage.' },
      { title: 'Expand', body: 'We add the next automation from your shortlist.' },
    ],
    fitHeading: 'A good fit when',
    fit: [
      'Your team relies on its automations every day.',
      'You would rather not hire someone to maintain them in-house.',
      'You want a steady pace of new automations without a new project each time.',
    ],
    work: ['associations', 'ca'],
    industries: ['small-business', 'associations', 'real-estate'],
    serviceType: 'Managed automation services',
    faqs: [
      { q: 'Can I cancel the retainer?', a: 'Yes. You own everything we build, so you can move it in-house at any time.' },
      { q: 'Do I need a retainer after a build?', a: 'No, but most teams keep one so their systems keep working as their tools change.' },
      { q: 'Can you take over automations someone else built?', a: 'Yes. We start by documenting what exists, then fix and monitor it.' },
    ],
  },
];

export const serviceBySlug = (slug: string) => SERVICES.find((s) => s.slug === slug);
