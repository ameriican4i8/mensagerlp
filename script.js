(function () {
  const form = document.querySelector('#signup-form');
  const status = document.querySelector('#form-status');
  const params = new URLSearchParams(window.location.search);
  const tracking = {};

  ['fbclid', 'utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'].forEach((key) => {
    const value = params.get(key);
    if (value) tracking[key] = value;
  });

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(form).entries());
    status.textContent = 'Conectando con un agente…';

    // Substituir pelo endpoint do WF3 quando o fluxo da LP estiver publicado.
    console.info('Lead pendente de integração com n8n', { ...data, ...tracking });
    window.setTimeout(() => {
      status.textContent = 'Listo. Un agente continuará tu atención.';
    }, 500);
  });
})();