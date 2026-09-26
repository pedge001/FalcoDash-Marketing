const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'gclid'];

function captureUtm() {
  try {
    const params = new URLSearchParams(location.search);
    const found: Record<string, string> = {};
    for (const k of UTM_KEYS) { const v = params.get(k); if (v) found[k] = v.slice(0, 200); }
    if (Object.keys(found).length) sessionStorage.setItem('fd_utm', JSON.stringify(found));
    if (!sessionStorage.getItem('fd_ref') && document.referrer && !document.referrer.startsWith(location.origin)) {
      sessionStorage.setItem('fd_ref', document.referrer.slice(0, 300));
    }
    const utm = JSON.parse(sessionStorage.getItem('fd_utm') || '{}');
    const ref = sessionStorage.getItem('fd_ref');
    return JSON.stringify(ref ? { ...utm, referrer: ref } : utm);
  } catch {
    return '';
  }
}

export function initContactForms() {
  const utm = captureUtm();
  document.querySelectorAll<HTMLFormElement>('form[data-contact-form]').forEach((form) => {
    if (form.dataset.ready) return;
    form.dataset.ready = '1';
    (form.elements.namedItem('t') as HTMLInputElement).value = String(Date.now());
    (form.elements.namedItem('utm') as HTMLInputElement).value = utm;
    const status = form.querySelector<HTMLElement>('.form-status')!;
    const button = form.querySelector<HTMLButtonElement>('button[type=submit]')!;
    const showError = (msg: string) => { status.hidden = false; status.dataset.kind = 'error'; status.textContent = msg; };

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }
      try {
        (form.elements.namedItem('sid') as HTMLInputElement).value = sessionStorage.getItem('fd_sid') || '';
        (form.elements.namedItem('vid') as HTMLInputElement).value = localStorage.getItem('fd_vid') || '';
      } catch {}
      button.disabled = true;
      status.hidden = true;
      try {
        const res = await fetch(form.action, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } });
        const data = await res.json().catch(() => ({}));
        if (!res.ok || !data.ok) throw new Error(data.error || 'Something went wrong. Please email hello@falcodash.com.');
        const wrap = form.closest('[data-form-wrap]')!;
        form.hidden = true;
        const ok = wrap.querySelector<HTMLElement>('.success-box')!;
        ok.hidden = false;
        ok.focus();
        const source = (form.elements.namedItem('source') as HTMLInputElement).value;
        const w = window as any;
        w.gtag?.('event', 'generate_lead', { form_source: source });
        w.clarity?.('event', 'generate_lead');
        w.__fdTrack?.('generate_lead', { form_source: source });
      } catch (err) {
        showError((err as Error).message);
      } finally {
        button.disabled = false;
      }
    });
  });
}
