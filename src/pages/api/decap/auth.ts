// GitHub OAuth for Decap CMS (/admin). Decap opens this in a popup; we send the editor to GitHub.
import type { APIRoute } from 'astro';
import { randomBytes } from 'node:crypto';

export const prerender = false;

export const GET: APIRoute = ({ url, cookies }) => {
  const clientId = process.env.GITHUB_OAUTH_CLIENT_ID;
  if (!clientId) return new Response('CMS login is not configured (GITHUB_OAUTH_CLIENT_ID).', { status: 500 });
  const state = randomBytes(16).toString('hex');
  cookies.set('decap_oauth_state', state, { path: '/api/decap', httpOnly: true, secure: url.protocol === 'https:', sameSite: 'lax', maxAge: 600 });
  const origin = process.env.SITE_URL || url.origin;
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: `${origin}/api/decap/callback`,
    scope: url.searchParams.get('scope') || 'repo,user',
    state,
  });
  return Response.redirect(`https://github.com/login/oauth/authorize?${params}`, 302);
};
