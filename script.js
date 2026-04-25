/* ============================================
   ALIGN — Script
   ============================================ */

(function () {
  'use strict';

  // --- Nav scroll state ---
  const nav = document.querySelector('.nav');

  function handleNavScroll() {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  }

  window.addEventListener('scroll', handleNavScroll, { passive: true });
  handleNavScroll();

  // --- Mobile nav ---
  const hamburger = document.querySelector('.nav__hamburger');

  const mobileNav = document.createElement('div');
  mobileNav.className = 'mobile-nav';

  const mobileLinks = [
    ['#philosophy', 'Philosophy'],
    ['#team', 'Our Team'],
    ['#classes', 'Wellness Hub'],
    ['#collection', 'Our Collection'],
    ['#studio', 'Photo Gallery'],
    ['#contact', 'Contact'],
  ];

  mobileLinks.forEach(([href, label]) => {
    const a = document.createElement('a');
    a.href = href;
    a.textContent = label;
    a.addEventListener('click', closeMobileNav);
    mobileNav.appendChild(a);
  });

  // Close button
  const closeBtn = document.createElement('button');
  closeBtn.textContent = '×';
  closeBtn.style.cssText =
    'position:absolute;top:2rem;right:2.5rem;background:none;border:none;color:var(--ivory);font-size:2rem;cursor:pointer;opacity:0.5;line-height:1;';
  closeBtn.setAttribute('aria-label', 'Close menu');
  closeBtn.addEventListener('click', closeMobileNav);
  mobileNav.appendChild(closeBtn);

  document.body.appendChild(mobileNav);

  hamburger.addEventListener('click', () => {
    mobileNav.classList.add('open');
    document.body.style.overflow = 'hidden';
  });

  function closeMobileNav() {
    mobileNav.classList.remove('open');
    document.body.style.overflow = '';
  }

  // --- Scroll reveal ---
  const revealElements = document.querySelectorAll(
    '.reveal, .statement__text, .pillar, .class-card, .quote blockquote'
  );

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  revealElements.forEach((el) => {
    el.classList.add('reveal');
    revealObserver.observe(el);
  });

  // Pillars already have their own reveal class handling
  document.querySelectorAll('.pillar').forEach((el) => {
    revealObserver.observe(el);
  });

  // --- Smooth parallax on hero ---
  const heroBg = document.querySelector('.hero__bg');

  function handleParallax() {
    const scrolled = window.scrollY;
    if (scrolled < window.innerHeight) {
      heroBg.style.transform = `translateY(${scrolled * 0.3}px)`;
    }
  }

  window.addEventListener('scroll', handleParallax, { passive: true });

  // --- Modals ---
  function openModal(id) {
    const modal = document.getElementById(id);
    if (!modal) return;
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeModal(modal) {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }

  // Open via card trigger links
  document.querySelectorAll('.modal-trigger').forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      openModal(link.dataset.modal);
    });
  });

  // Close via × button
  document.querySelectorAll('.modal__close').forEach((btn) => {
    btn.addEventListener('click', () => closeModal(btn.closest('.modal')));
  });

  // Close via backdrop click
  document.querySelectorAll('.modal__backdrop').forEach((backdrop) => {
    backdrop.addEventListener('click', () => closeModal(backdrop.closest('.modal')));
  });

  // Close via Book Now inside modal — close modal then open booking URL
  document.querySelectorAll('.modal-book').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const modal = btn.closest('.modal');
      closeModal(modal);
      window.open(btn.href, '_blank', 'noopener');
    });
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal.open').forEach((m) => closeModal(m));
    }
  });

  // --- Wellness Hub tabs ---
  const tabs = document.querySelectorAll('.wellness__tab');
  const panels = document.querySelectorAll('.wellness__panel');

  function activateTab(tabName) {
    tabs.forEach((t) => t.classList.remove('active'));
    panels.forEach((p) => p.classList.remove('active'));
    const matchTab = document.querySelector(`.wellness__tab[data-tab="${tabName}"]`);
    const matchPanel = document.getElementById('tab-' + tabName);
    if (matchTab) matchTab.classList.add('active');
    if (matchPanel) matchPanel.classList.add('active');
  }

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => activateTab(tab.dataset.tab));
  });

  // Nav dropdown tab links
  document.querySelectorAll('[data-tab-target]').forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const target = link.dataset.tabTarget;
      activateTab(target);
      document.getElementById('classes').scrollIntoView({ behavior: 'smooth' });
    });
  });

  // --- Cookie banner ---
  const cookieBanner = document.getElementById('cookieBanner');
  const cookieAccept = document.getElementById('cookieAccept');

  if (cookieBanner && !localStorage.getItem('align_cookies_accepted')) {
    setTimeout(() => cookieBanner.classList.add('visible'), 1200);
  }

  if (cookieAccept) {
    cookieAccept.addEventListener('click', () => {
      cookieBanner.classList.remove('visible');
      localStorage.setItem('align_cookies_accepted', '1');
    });
  }

  // --- Form submit (prevent default, show confirmation) ---
  const form = document.querySelector('.contact__form');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const btn = form.querySelector('button[type="submit"]');
      btn.textContent = 'Request Received';
      btn.style.background = 'var(--mocha)';
      btn.style.color = 'var(--ivory)';
      btn.style.borderColor = 'var(--mocha)';
      btn.disabled = true;

      setTimeout(() => {
        form.reset();
        btn.textContent = 'Request a Session';
        btn.style.cssText = '';
        btn.disabled = false;
      }, 3200);
    });
  }

  // --- Stagger class card reveal ---
  document.querySelectorAll('.class-card').forEach((card, i) => {
    card.style.transitionDelay = `${i * 0.12}s`;
  });

})();
