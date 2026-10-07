const menuToggle = document.querySelector('.menu-toggle');

const carousel = document.querySelector('.hero-carousel');
if (carousel) {
  const slides = Array.from(carousel.querySelectorAll('.hero-slide'));
  const dots = Array.from(carousel.querySelectorAll('[data-carousel-dot]'));
  const controls = carousel.querySelector('.hero-carousel-controls');
  const pauseButton = carousel.querySelector('[data-carousel-pause]');
  const announcement = carousel.querySelector('#carousel-status');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let current = 0;
  let timer;
  let paused = false;

  const show = (index, announce = false) => {
    current = (index + slides.length) % slides.length;
    slides.forEach((slide, i) => {
      const active = i === current;
      slide.classList.toggle('is-active', active);
      slide.setAttribute('aria-hidden', String(!active));
      slide.inert = !active;
    });
    dots.forEach((dot, i) => {
      dot.classList.toggle('is-active', i === current);
      if (i === current) dot.setAttribute('aria-current', 'true');
      else dot.removeAttribute('aria-current');
    });
    if (announce) announcement.textContent = slides[current].getAttribute('aria-label');
  };

  const stop = () => { window.clearInterval(timer); timer = undefined; };
  const start = () => {
    stop();
    if (!paused && !reducedMotion.matches && !document.hidden && !controls.matches(':hover') && !carousel.contains(document.activeElement)) {
      timer = window.setInterval(() => show(current + 1), 5500);
    }
  };
  const select = index => { show(index, true); start(); };

  carousel.querySelector('[data-carousel-prev]').addEventListener('click', () => select(current - 1));
  carousel.querySelector('[data-carousel-next]').addEventListener('click', () => select(current + 1));
  dots.forEach((dot, index) => dot.addEventListener('click', () => select(index)));
  pauseButton.addEventListener('click', () => {
    paused = !paused;
    pauseButton.setAttribute('aria-pressed', String(paused));
    pauseButton.setAttribute('aria-label', paused ? 'Retomar carrossel' : 'Pausar carrossel');
    start();
  });
  controls.addEventListener('mouseenter', stop);
  controls.addEventListener('mouseleave', start);
  carousel.addEventListener('focusin', stop);
  carousel.addEventListener('focusout', () => window.setTimeout(start, 0));
  document.addEventListener('visibilitychange', start);
  reducedMotion.addEventListener('change', start);
  show(0);
  start();
}

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
