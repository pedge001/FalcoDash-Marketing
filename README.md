# FalcoDash-Marketing

The marketing site for FalcoDash at **falcodash.com**: an AI implementation and automation firm. The association dashboard that used to live here is now at [app.falcodash.com](https://app.falcodash.com).

Built with [Astro](https://astro.build) and deployed to Railway with Postgres (leads) and Resend (email). Every marketing page is pre-rendered to static HTML; only `/api/*` runs on the server.

## Stack

| Piece | What it does |
| --- | --- |
| Astro 7 + `@astrojs/node` | Static pages plus a small Node server for the API |
| `server.mjs` | Production entry: security headers, cache headers, www → apex, legacy path redirects to app.falcodash.com |
| Postgres (`postgres` driver) | Stores every audit request in `leads` (`db/schema.sql`) |
| Resend | Emails each new lead to the team and sends the submitter a confirmation |
| Decap CMS at `/admin` | Blog editing; commits Markdown to `src/content/blog/` on GitHub |
| satori + resvg | Generates a branded Open Graph image for every page at build time |

## Local development

Requires Node 22.12+ (`.nvmrc`).

```bash
npm install
cp .env.example .env     # optional; the site runs without a database or Resend key
npm run dev              # http://localhost:4321
```

Production build, run the same way Railway does:

```bash
npm run build
npm start                # http://localhost:8080
```

Without `DATABASE_URL` or `RESEND_API_KEY` the form still validates, but a submission that can be neither stored nor emailed returns an error asking the visitor to email you instead. `/api/health` shows what is configured.

## Deploying to Railway

1. Create a project from this GitHub repo. `railway.json` sets the build, start, pre-deploy migration and `/healthz` health check.
2. Add a **Postgres** database to the project.
3. On the web service, set the variables in `.env.example`:
   - `SITE_URL=https://falcodash.com`
   - `DATABASE_URL=${{Postgres.DATABASE_URL}}`
   - `RESEND_API_KEY`, `EMAIL_FROM`, `LEAD_NOTIFY_TO`
   - `IP_HASH_SALT` (any long random string)
   - `GITHUB_OAUTH_CLIENT_ID`, `GITHUB_OAUTH_CLIENT_SECRET` (for the CMS, below)
4. Under **Settings → Networking**, add `falcodash.com` and `www.falcodash.com` as custom domains and create the DNS records Railway shows you. `www` redirects to the apex automatically.
5. In **Resend**, add and verify the `falcodash.com` domain (SPF/DKIM records) so mail can be sent from `hello@falcodash.com`.

Every push to `main` rebuilds and redeploys. `npm run migrate` runs before each deploy and is safe to repeat.

### Reading leads

Leads are also emailed, but the database is the record:

```sql
SELECT created_at, name, email, company, industry, message, source, attribution, notify_error
FROM leads ORDER BY created_at DESC;
```

`notify_error` is filled if the notification email failed, so nothing is lost during a Resend outage.

## Blog (Decap CMS)

Editors go to **falcodash.com/admin** and sign in with GitHub. Posts use the editorial workflow (Draft → In review → Ready). Publishing merges to `main`, and Railway redeploys.

One-time setup:

1. GitHub → Settings → Developer settings → **OAuth Apps → New OAuth App**.
   - Homepage URL: `https://falcodash.com`
   - Authorization callback URL: `https://falcodash.com/api/decap/callback`
2. Put the client ID and a generated client secret in Railway as `GITHUB_OAUTH_CLIENT_ID` / `GITHUB_OAUTH_CLIENT_SECRET`.
3. Each editor needs write access to this repository.

Local editing without GitHub: run `npx decap-server` alongside `npm run dev` and open `localhost:4321/admin`.

Posts are front matter only (see `src/content.config.ts`). Write the **title** as the question people search and the **short answer** as 2–4 sentences that answer it directly: that passage is what answer engines quote.

## Screenshots and images

The Work cards and case-study pages show placeholders until screenshots are added. Drop files into `src/assets/shots/` with these names (PNG, JPG or WebP; about 1600 × 1000, 16:10):

| File name | Shows |
| --- | --- |
| `work-app` | app.falcodash.com dashboard |
| `work-ca` | ca.falcodash.com |
| `work-notes` | FalcoDash Notes iOS app |
| `work-opz` | opz.falcodash.com |
| `work-fieldyates` | fieldyates.com |

Rebuild and they replace the placeholders, resized and converted to AVIF/WebP. Blog cover images are uploaded through the CMS (or placed in `public/images/blog/` and set as `cover` in the post).

## SEO and AEO

Built in from the start:

- Static HTML for every page, with one `h1`, a unique title and meta description, a canonical URL (no trailing slashes) and Open Graph/Twitter tags with a generated 1200 × 630 image.
- JSON-LD on every page, all linked to one `Organization` entity: `WebSite`, `WebPage` (with `speakable`), `BreadcrumbList`, `Service`, `FAQPage`, `BlogPosting`, `SoftwareApplication` (work), `HowTo` (how we work) and `Person` (founder).
- A **Short answer** block at the top of every service, industry, work and blog page that answers the page's main question in a quotable passage.
- Question-shaped headings and FAQ sections throughout, plus a combined `/faq`.
- `/sitemap.xml` with real `lastmod` dates, `/blog/rss.xml`, `/robots.txt` that explicitly welcomes search and AI crawlers, and [`/llms.txt`](https://llmstxt.org) plus `/llms-full.txt` generated from the same content as the pages.
- Company facts live in one place (`src/data/site.ts`) so the entity description is the same everywhere.

When marketing copy changes, bump `PAGES_UPDATED` in `src/data/site.ts` so the sitemap reports it.

## Project layout

```
src/
  data/          Site facts, services, industries, work, FAQs — edit copy here
  content/blog/  Blog posts (managed by Decap CMS)
  pages/         Routes; api/ runs on the server, everything else is static
  components/    Header, footer, cards, FAQ, contact form, image slots
  lib/           JSON-LD builders, blog helpers, OG images, llms.txt, DB, email
  scripts/       Client scripts (hero animation, contact form)
  assets/shots/  Work screenshots
public/admin/    Decap CMS
db/schema.sql    Database schema
server.mjs       Production server
```
