document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.getElementById('navToggle');
  const links = document.getElementById('navLinks');
  if (toggle && links) {
    toggle.addEventListener('click', () => {
      const isOpen = links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(isOpen));
    });
  }

  const calendlyWidget = document.getElementById('calendlyWidget');
  const calendlyFallback = document.getElementById('calendlyFallback');
  if (calendlyWidget && calendlyFallback) {
    window.setTimeout(() => {
      if (calendlyWidget.children.length === 0) {
        calendlyFallback.hidden = false;
      }
    }, 4000);
  }
});
