const menuToggle = document.querySelector('.menu-toggle');
const menu = document.querySelector('#navegacao');
menuToggle?.addEventListener('click', () => {
  const open = menuToggle.getAttribute('aria-expanded') !== 'true';
  menuToggle.setAttribute('aria-expanded', String(open));
  menuToggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
  menu?.classList.toggle('open', open);
});
menu?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  menu?.classList.remove('open');
  menuToggle?.setAttribute('aria-expanded', 'false');
  menuToggle?.setAttribute('aria-label', 'Abrir menu');
}));

const planSelect = document.querySelector('#plano');
document.querySelectorAll('[data-plan]').forEach(link => link.addEventListener('click', () => {
  const selected = Array.from(planSelect.options).find(option => option.value.startsWith(link.dataset.plan));
  if (selected) planSelect.value = selected.value;
}));

const form = document.querySelector('#lead-form');
const submitButton = document.querySelector('#submit-button');
const status = document.querySelector('#form-status');
form?.addEventListener('submit', async event => {
  event.preventDefault();
  status.textContent = '';
  status.classList.remove('error');
  if (!form.reportValidity()) return;
  const phone = document.querySelector('#whatsapp');
  const digits = phone.value.replace(/\D/g, '');
  if (digits.length < 10 || digits.length > 13) {
    phone.setCustomValidity('Informe um WhatsApp com DDD válido.');
    phone.reportValidity();
    phone.addEventListener('input', () => phone.setCustomValidity(''), { once: true });
    return;
  }
  submitButton.disabled = true;
  submitButton.textContent = 'Enviando...';
  status.textContent = 'Enviando seu pedido...';
  try {
    const data = Object.fromEntries(new FormData(form));
    const response = await fetch('https://formsubmit.co/ajax/internetgamadf@gmail.com', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(data)
    });
    const result = await response.json();
    if (!response.ok || !(result.success === true || result.success === 'true')) throw new Error(result.message || 'Falha no envio');
    window.location.assign('/obrigado/');
  } catch (_) {
    status.textContent = 'Não foi possível enviar agora. Tente novamente ou fale conosco pelo WhatsApp.';
    status.classList.add('error');
    submitButton.disabled = false;
    submitButton.textContent = 'Enviar pedido';
  }
});
