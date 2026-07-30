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

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const processGrid = document.querySelector('.process-grid');
  if (processGrid && !reducedMotion) {
    const steps = Array.from(processGrid.children);
    processGrid.classList.add('is-slider');
    processGrid.setAttribute('role', 'region');
    processGrid.setAttribute('aria-roledescription', 'carousel');
    processGrid.setAttribute('aria-label', 'How it works, step by step');
    processGrid.setAttribute('aria-live', 'polite');

    const controls = document.createElement('div');
    controls.className = 'slider-controls';

    const prevBtn = document.createElement('button');
    prevBtn.className = 'slider-arrow';
    prevBtn.type = 'button';
    prevBtn.setAttribute('aria-label', 'Previous step');
    prevBtn.textContent = '←';

    const dotsContainer = document.createElement('div');
    dotsContainer.className = 'slider-dots';

    const nextBtn = document.createElement('button');
    nextBtn.className = 'slider-arrow';
    nextBtn.type = 'button';
    nextBtn.setAttribute('aria-label', 'Next step');
    nextBtn.textContent = '→';

    controls.append(prevBtn, dotsContainer, nextBtn);
    processGrid.insertAdjacentElement('afterend', controls);

    steps.forEach((step, i) => {
      const dot = document.createElement('button');
      dot.className = 'slider-dot';
      dot.type = 'button';
      dot.setAttribute('aria-label', 'Go to step ' + (i + 1));
      dot.addEventListener('click', () => goTo(i));
      dotsContainer.appendChild(dot);
    });
    const dots = Array.from(dotsContainer.children);

    let current = 0;
    let timer;

    function render() {
      steps.forEach((step, i) => step.classList.toggle('active', i === current));
      dots.forEach((dot, i) => dot.classList.toggle('active', i === current));
    }

    function goTo(index) {
      current = (index + steps.length) % steps.length;
      render();
      resetTimer();
    }

    function resetTimer() {
      clearInterval(timer);
      timer = setInterval(() => goTo(current + 1), 7000);
    }

    nextBtn.addEventListener('click', () => goTo(current + 1));
    prevBtn.addEventListener('click', () => goTo(current - 1));
    processGrid.addEventListener('mouseenter', () => clearInterval(timer));
    processGrid.addEventListener('mouseleave', resetTimer);
    processGrid.addEventListener('focusin', () => clearInterval(timer));
    processGrid.addEventListener('focusout', resetTimer);

    render();
    resetTimer();
  }
});
