/**
 * Módulo para el menú de navegación móvil.
 */
(function(){
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.getElementById('nav');
  if (toggle && nav){
    toggle.addEventListener('click', () => {
      const expanded = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!expanded));
      nav.classList.toggle('show');
    });
  }
})();

/**
 * Módulo para los menús desplegables (dropdowns).
 */
(function(){
  const nav = document.getElementById('nav');
  if(!nav) return;

  const toggles = nav.querySelectorAll('.dropdown-toggle');

  function closeAll(except){
    nav.querySelectorAll('.has-dropdown.open').forEach(li => {
      if(li !== except){
        li.classList.remove('open');
        const btn = li.querySelector('.dropdown-toggle');
        if(btn) btn.setAttribute('aria-expanded','false');
      }
    });
  }

  // Toggle por clic: accesible en móvil y desktop
  toggles.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const li = btn.closest('.has-dropdown');
      const isOpen = li.classList.contains('open');
      closeAll(isOpen ? null : li);
      li.classList.toggle('open');
      btn.setAttribute('aria-expanded', String(!isOpen));
    });
  });

  // Cerrar al hacer clic fuera
  document.addEventListener('click', (e) => {
    if(!nav.contains(e.target)){
      closeAll(null);
    }
  });

  // Cerrar con ESC
  document.addEventListener('keydown', (e) => {
    if(e.key === 'Escape') closeAll(null);
  });
})();

/**
 * Módulo para el carrusel Hero de pantalla completa.
 */
(function() {
  const section = document.getElementById('hero-carousel-section');
  if (!section) return;

  const slides = section.querySelectorAll('.hero-slide');
  const paginationContainer = section.querySelector('.hero-carousel-pagination');
  if (slides.length === 0 || !paginationContainer) return;

  let currentIndex = 0;
  let autoTimer = null;
  const intervalMs = Number(section.getAttribute('data-autoadvance')) || 6000;
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function goToSlide(index) {
    slides.forEach((slide, i) => {
      slide.classList.toggle('active', i === index);
      slide.setAttribute('aria-hidden', i !== index);
    });
    paginationContainer.querySelectorAll('button').forEach((btn, i) => {
      btn.classList.toggle('active', i === index);
    });
    currentIndex = index;
  }

  function nextSlide() {
    goToSlide((currentIndex + 1) % slides.length);
  }

  function startAuto() {
    if (prefersReduced || autoTimer) return;
    autoTimer = setInterval(nextSlide, intervalMs);
  }

  function stopAuto() {
    if (autoTimer) {
      clearInterval(autoTimer);
      autoTimer = null;
    }
  }

  slides.forEach((_, i) => {
    const button = document.createElement('button');
    button.setAttribute('aria-label', `Ir a la diapositiva ${i + 1}`);
    button.addEventListener('click', () => { stopAuto(); goToSlide(i); startAuto(); });
    paginationContainer.appendChild(button);
  });

  goToSlide(0);
  startAuto();
})();

/**
 * Módulo para el carrusel de proyectos con avance automático.
 */
(function(){
  const section = document.getElementById('proyectos');
  if (!section) return;

  const viewport = section.querySelector('.carousel-viewport');
  const prevBtn  = section.querySelector('.carousel-btn.prev');
  const nextBtn  = section.querySelector('.carousel-btn.next');
  if (!viewport || !prevBtn || !nextBtn) return;

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const stepFactor = 0.9;
  const page = () => Math.max(100, Math.round(viewport.clientWidth * stepFactor));

  function scrollByDir(dir){
    viewport.scrollBy({ left: dir * page(), behavior: 'smooth' });
  }

  function updateButtons(){
    const maxScroll = viewport.scrollWidth - viewport.clientWidth - 1;
    prevBtn.disabled = viewport.scrollLeft <= 0;
    nextBtn.disabled = viewport.scrollLeft >= maxScroll;
  }

  prevBtn.addEventListener('click', () => { stopAuto(); scrollByDir(-1); });
  nextBtn.addEventListener('click', () => { stopAuto(); scrollByDir(1); });

  viewport.addEventListener('scroll', updateButtons);
  window.addEventListener('resize', updateButtons);
  updateButtons();

  viewport.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft' || e.key === 'PageUp'){ e.preventDefault(); stopAuto(); scrollByDir(-1); }
    else if (e.key === 'ArrowRight' || e.key === 'PageDown'){ e.preventDefault(); stopAuto(); scrollByDir(1); }
  });

  const intervalMs = Number(section.getAttribute('data-autoadvance')) || 6000;
  let autoTimer = null;

  function atEnd(){ return viewport.scrollLeft >= viewport.scrollWidth - viewport.clientWidth - 2; }
  function tick(){ atEnd() ? viewport.scrollTo({ left: 0, behavior: 'smooth' }) : scrollByDir(1); }
  function startAuto(){ if (!prefersReduced && !autoTimer) autoTimer = setInterval(tick, intervalMs); }
  function stopAuto(){ if (autoTimer){ clearInterval(autoTimer); autoTimer = null; } }

  viewport.addEventListener('pointerdown', stopAuto);
  viewport.addEventListener('mouseenter', stopAuto);
  viewport.addEventListener('focusin', stopAuto);
  viewport.addEventListener('mouseleave', startAuto);
  viewport.addEventListener('focusout', () => { if (!section.contains(document.activeElement)) startAuto(); });
  document.addEventListener('visibilitychange', () => { document.hidden ? stopAuto() : startAuto(); });

  startAuto();
})();

/**
 * Módulo para la validación del formulario de contacto.
 */
(function(){
  const form = document.getElementById('contactForm');
  if (!form) return;

  const status = document.getElementById('formStatus');

  function setError(id, msg){
    const el = document.querySelector(`.error[data-for="${id}"]`);
    if (el) el.textContent = msg || '';
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let ok = true;
    ['nombre', 'email', 'mensaje'].forEach(id => setError(id, ''));

    if (!form.nombre.value.trim()){ setError('nombre','Ingrese su nombre.'); ok=false; }
    if (!form.email.validity.valid){ setError('email','Ingrese un correo válido.'); ok=false; }
    if (!form.mensaje.value.trim()){ setError('mensaje','Cuéntenos su requerimiento.'); ok=false; }

    if(ok) {
      status.textContent = 'Gracias. En local no se envía correo; en producción conectaremos un servicio de formularios.';
      form.reset();
    }
  });
})();

/**
 * Módulo para el carrusel de clientes.
 */
(function() {
  const scrollers = document.querySelectorAll(".clients-scroller");
  if (scrollers.length === 0) return;

  scrollers.forEach((scroller) => {
    const scrollerInner = Array.from(scroller.children);
    scrollerInner.forEach((item) => {
      const duplicatedItem = item.cloneNode(true);
      duplicatedItem.setAttribute("aria-hidden", true);
      scroller.appendChild(duplicatedItem);
    });
  });
})();

/**
 * Módulo para animar la línea de tiempo al hacer scroll.
 */
(function() {
  const timelineItems = document.querySelectorAll('.timeline-item');
  if (timelineItems.length === 0) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1 // El item se considera visible cuando el 10% está en pantalla
  });

  timelineItems.forEach(item => observer.observe(item));
})();

/**
 * Scripts generales que se ejecutan en todas las páginas.
 */
(function(){
  document.getElementById('year').textContent = new Date().getFullYear();
})();
