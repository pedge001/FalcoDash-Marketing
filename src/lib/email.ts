import { Resend } from 'resend';
import { SITE } from '~/data/site';

export type Lead = {
  id?: number | string;
  name: string;
  email: string;
  company?: string;
  industry?: string;
  phone?: string;
  message: string;
  source?: string;
  location?: string;
  attribution?: Record<string, string>;
};

const esc = (s = '') => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);

let client: Resend | null = null;
const resend = () => {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  client ??= new Resend(key);
  return client;
};

const FROM = () => process.env.EMAIL_FROM || `FalcoDash <${SITE.email}>`;
const TO = () => (process.env.LEAD_NOTIFY_TO || SITE.email).split(',').map((s) => s.trim()).filter(Boolean);

const shell = (body: string) => `<!doctype html><html><body style="margin:0;background:#f3f2f2;font-family:Archivo,Helvetica,Arial,sans-serif;color:#000">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f3f2f2;padding:32px 16px"><tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#fff;border-top:6px solid #000">
<tr><td style="background:#000;padding:20px 28px"><span style="color:#b2ffff;font-weight:800;letter-spacing:.02em;font-size:18px;text-transform:uppercase">FalcoDash</span></td></tr>
<tr><td style="padding:28px">${body}</td></tr>
<tr><td style="padding:16px 28px 24px;border-top:2px solid #eee;font-size:12px;color:#666">${esc(SITE.name)} · ${esc(SITE.tagline)} · <a href="${SITE.url}" style="color:#0b6b6b">falcodash.com</a></td></tr>
</table></td></tr></table></body></html>`;

function row(label: string, value?: string) {
  if (!value) return '';
  return `<tr><td style="padding:6px 16px 6px 0;font-size:12px;letter-spacing:.06em;text-transform:uppercase;color:#0b6b6b;vertical-align:top;white-space:nowrap">${esc(label)}</td><td style="padding:6px 0;font-size:15px">${esc(value)}</td></tr>`;
}

/** Internal notification to the FalcoDash inbox. Reply-To is the lead, so hitting reply answers them. */
export async function sendLeadNotification(lead: Lead) {
  const r = resend();
  if (!r) throw new Error('RESEND_API_KEY is not set');
  const attr = lead.attribution && Object.keys(lead.attribution).length
    ? Object.entries(lead.attribution).map(([k, v]) => `${k}=${v}`).join(' · ')
    : '';
  const html = shell(`
    <h1 style="margin:0 0 16px;font-size:24px">New audit request</h1>
    <table role="presentation" cellpadding="0" cellspacing="0">
      ${row('Name', lead.name)}${row('Email', lead.email)}${row('Company', lead.company)}${row('Industry', lead.industry)}${row('Phone', lead.phone)}${row('Page', lead.source)}${row('Location', lead.location)}${row('Attribution', attr)}${row('Lead #', lead.id ? String(lead.id) : '')}
    </table>
    <h2 style="margin:24px 0 8px;font-size:14px;letter-spacing:.06em;text-transform:uppercase;color:#0b6b6b">What they want to automate</h2>
    <p style="margin:0;font-size:16px;line-height:1.6;white-space:pre-wrap">${esc(lead.message)}</p>`);
  const text = `New audit request\n\nName: ${lead.name}\nEmail: ${lead.email}\nCompany: ${lead.company || '-'}\nIndustry: ${lead.industry || '-'}\nPhone: ${lead.phone || '-'}\nPage: ${lead.source || '-'}\n${attr ? `Attribution: ${attr}\n` : ''}\n${lead.message}`;
  const { error } = await r.emails.send({
    from: FROM(),
    to: TO(),
    replyTo: lead.email,
    subject: `Audit request: ${lead.name}${lead.company ? ` (${lead.company})` : ''}`,
    html,
    text,
    tags: [{ name: 'type', value: 'lead_notification' }],
  });
  if (error) throw new Error(`${error.name}: ${error.message}`);
}

/** Confirmation to the person who submitted the form. */
export async function sendLeadConfirmation(lead: Lead) {
  const r = resend();
  if (!r) return;
  const first = lead.name.split(/\s+/)[0] || 'there';
  const html = shell(`
    <h1 style="margin:0 0 16px;font-size:24px">Thanks, ${esc(first)}. We have your request.</h1>
    <p style="margin:0 0 14px;font-size:16px;line-height:1.6">We'll reply within one business day to schedule your free automation audit. In the audit we'll walk through how your team works today and send you a written shortlist of what to automate first.</p>
    <p style="margin:0 0 14px;font-size:16px;line-height:1.6">If anything is urgent, reply to this email or call <a href="tel:${SITE.phone}" style="color:#0b6b6b">${esc(SITE.phoneDisplay)}</a>.</p>
    <p style="margin:24px 0 0;font-size:14px;color:#666">What you sent us:</p>
    <p style="margin:6px 0 0;font-size:15px;line-height:1.6;white-space:pre-wrap;border-left:3px solid #b2ffff;padding-left:12px">${esc(lead.message)}</p>`);
  const text = `Thanks, ${first}. We have your request.\n\nWe'll reply within one business day to schedule your free automation audit.\n\nIf anything is urgent, reply to this email or call ${SITE.phoneDisplay}.\n\n— FalcoDash\n${SITE.url}`;
  const { error } = await r.emails.send({
    from: FROM(),
    to: [lead.email],
    replyTo: TO()[0],
    subject: 'We have your FalcoDash audit request',
    html,
    text,
    tags: [{ name: 'type', value: 'lead_confirmation' }],
  });
  if (error) throw new Error(`${error.name}: ${error.message}`);
}
