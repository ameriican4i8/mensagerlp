(function () {
  const form = document.querySelector('#signup-form');
  const status = document.querySelector('#form-status');
  const params = new URLSearchParams(window.location.search);
  const n8nLeadEndpoint = 'https://n8n.omniform.online/webhook/lp/start-lead';

  function getCookie(name) {
    const escapedName = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const match = document.cookie.match(new RegExp(`(?:^|; )${escapedName}=([^;]*)`));
    return match ? decodeURIComponent(match[1]) : null;
  }

  function getTrackingValue(key) {
    return params.get(key) || sessionStorage.getItem(`meta_${key}`) || null;
  }

  const fbclid = getTrackingValue('fbclid');
  const storedFbc = getCookie('_fbc') || sessionStorage.getItem('meta_fbc');
  const fbc = storedFbc || (fbclid ? `fb.1.${Date.now()}.${fbclid}` : null);
  const fbp = getCookie('_fbp') || sessionStorage.getItem('meta_fbp');

  if (fbclid) sessionStorage.setItem('meta_fbclid', fbclid);
  if (fbc) sessionStorage.setItem('meta_fbc', fbc);
  if (fbp) sessionStorage.setItem('meta_fbp', fbp);

  const trackingKeys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'];
  trackingKeys.forEach((key) => {
    const value = params.get(key);
    if (value) sessionStorage.setItem(`meta_${key}`, value);
  });

  form.addEventListener('submit', async function (event) {
    event.preventDefault();
    status.textContent = 'Conectando con un agente…';
    const button = form.querySelector('button[type="submit"]');
    button.disabled = true;

    const payload = {
      nickname: String(new FormData(form).get('nickname') || '').trim(),
      fbp,
      fbc,
      fbclid,
      landing_page_url: window.location.href,
      ...Object.fromEntries(
        trackingKeys.map((key) => [key, getTrackingValue(key)])
      )
    };

    try {
      const response = await fetch(n8nLeadEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=UTF-8' },
        body: JSON.stringify(payload),
        mode: 'cors'
      });

      if (!response.ok) throw new Error(`n8n respondeu ${response.status}`);

      const result = await response.json();
      if (!result.success || !result.messenger_url) {
        throw new Error(result.message || 'O n8n não retornou o link do Messenger.');
      }

      window.location.assign(result.messenger_url);
    } catch (error) {
      console.error('Falha ao iniciar atendimento:', error);
      status.textContent = 'No pudimos conectar. Intentá nuevamente.';
      button.disabled = false;
    }
  });
})();