// Exchanges the GitHub code for a token and hands it back to the Decap CMS window via postMessage.
import type { APIRoute } from 'astro';

export const prerender = false;

const page = (status: 'success' | 'error', content: object, origin: string) => {
  const msg = `authorization:github:${status}:${JSON.stringify(content)}`;
  return new Response(
    `<!doctype html><html><head><meta charset="utf-8"><meta name="robots" content="noindex"><title>Signing in…</title></head><body>
<p>${status === 'success' ? 'Signed in. You can close this window.' : 'Sign-in failed. Close this window and try again.'}</p>
<script>
(function () {
  var origin = ${JSON.stringify(origin)};
  var msg = ${JSON.stringify(msg)};
  function receive(e) {
    if (e.origin !== origin) return;
    window.opener.postMessage(msg, origin);
    window.removeEventListener('message', receive, false);
  }
  window.addEventListener('message', receive, false);
  if (window.opener) window.opener.postMessage('authorizing:github', origin);
})();
</script></body></html>`,
    { status: 200, headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' } },
  );
};

export const GET: APIRoute = async ({ url, cookies }) => {
  const origin = process.env.SITE_URL || url.origin;
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');
  const expected = cookies.get('decap_oauth_state')?.value;
  cookies.delete('decap_oauth_state', { path: '/api/decap' });
  if (!code || !state || state !== expected) return page('error', { message: 'Invalid OAuth state' }, origin);

  try {
    const res = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_id: process.env.GITHUB_OAUTH_CLIENT_ID,
        client_secret: process.env.GITHUB_OAUTH_CLIENT_SECRET,
        code,
        redirect_uri: `${origin}/api/decap/callback`,
      }),
    });
    const data = (await res.json()) as { access_token?: string; error_description?: string };
    if (!data.access_token) return page('error', { message: data.error_description || 'No token' }, origin);
    return page('success', { token: data.access_token, provider: 'github' }, origin);
  } catch (err) {
    return page('error', { message: (err as Error).message }, origin);
  }
};
