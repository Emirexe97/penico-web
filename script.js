/* ================================================================
   PENICÓ URBANOS DESARROLLOS — Main JavaScript
   ================================================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ── 1. NAVBAR scroll behavior ──────────────────────────────────
  const navbar = document.getElementById('navbar');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }, { passive: true });

  // ── 2. Mobile hamburger menu ───────────────────────────────────
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');

  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    const isOpen = navLinks.classList.contains('open');
    // Animate hamburger to X
    const spans = hamburger.querySelectorAll('span');
    if (isOpen) {
      spans[0].style.transform = 'translateY(7px) rotate(45deg)';
      spans[1].style.opacity   = '0';
      spans[2].style.transform = 'translateY(-7px) rotate(-45deg)';
    } else {
      spans[0].style.transform = '';
      spans[1].style.opacity   = '';
      spans[2].style.transform = '';
    }
  });

  // Close menu on nav link click
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      hamburger.querySelectorAll('span').forEach(s => {
        s.style.transform = '';
        s.style.opacity   = '';
      });
    });
  });

  // ── 3. Hero background Ken Burns effect ───────────────────────
  const heroBg = document.querySelector('.hero-bg');
  if (heroBg) {
    setTimeout(() => heroBg.classList.add('loaded'), 100);
  }

  // ── 4. Intersection Observer for scroll reveal ─────────────────
  const revealEls = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Stagger siblings
        const siblings = [...entry.target.parentElement.children]
          .filter(el => el.classList.contains('reveal-up') || 
                        el.classList.contains('reveal-left') || 
                        el.classList.contains('reveal-right'));
        const idx = siblings.indexOf(entry.target);
        setTimeout(() => {
          entry.target.classList.add('revealed');
        }, idx * 120);
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

  revealEls.forEach(el => revealObserver.observe(el));

  // ── 5. Counter animation ───────────────────────────────────────
  const counters = document.querySelectorAll('.stat-num[data-target]');

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(c => counterObserver.observe(c));

  function animateCounter(el) {
    const target   = parseInt(el.dataset.target, 10);
    const duration = 2000;
    const start    = performance.now();

    function update(now) {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out expo
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      el.textContent = Math.round(eased * target);
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  }

  // ── 6. Active nav link on scroll ──────────────────────────────
  const sections = document.querySelectorAll('section[id]');
  const navItems = document.querySelectorAll('.nav-link');

  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navItems.forEach(link => {
          link.style.color = '';
          if (link.getAttribute('href') === '#' + entry.target.id) {
            link.style.color = 'var(--olive-light)';
          }
        });
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(s => navObserver.observe(s));

  // ── 7. Smooth scroll for nav links ────────────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const id = anchor.getAttribute('href');
      if (id === '#') return;
      const target = document.querySelector(id);
      if (target) {
        e.preventDefault();
        const offset = 80;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  // ── 8. Back to top button ──────────────────────────────────────
  const backToTop = document.getElementById('backToTop');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      backToTop.classList.add('visible');
    } else {
      backToTop.classList.remove('visible');
    }
  }, { passive: true });

  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // ── 9. Contact Form validation ─────────────────────────────────
  const form       = document.getElementById('contactForm');
  const submitBtn  = document.getElementById('submitBtn');
  const success    = document.getElementById('formSuccess');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (validateForm()) {
        submitBtn.disabled  = true;
        submitBtn.querySelector('.btn-text').textContent = 'Enviando...';
        // Simulate form submission (replace with actual backend call)
        setTimeout(() => {
          form.reset();
          submitBtn.disabled  = false;
          submitBtn.querySelector('.btn-text').textContent = 'Enviar Consulta';
          success.style.display = 'flex';
          setTimeout(() => { success.style.display = 'none'; }, 6000);
        }, 1800);
      }
    });

    // Real-time validation on blur
    ['nombre', 'email', 'mensaje'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.addEventListener('blur', () => validateField(el));
    });
  }

  function validateField(el) {
    const errorEl = document.getElementById('error-' + el.id);
    let valid = true;
    el.classList.remove('error');
    if (errorEl) errorEl.classList.remove('visible');

    if (el.required && !el.value.trim()) {
      valid = false;
    } else if (el.type === 'email' && el.value.trim() && !isValidEmail(el.value)) {
      valid = false;
    }

    if (!valid) {
      el.classList.add('error');
      if (errorEl) errorEl.classList.add('visible');
    }
    return valid;
  }

  function validateForm() {
    const fields = ['nombre', 'email', 'mensaje'];
    return fields.every(id => validateField(document.getElementById(id)));
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  // ── 10. Parallax on hero ───────────────────────────────────────
  const heroPx = document.querySelector('.hero-bg');
  if (heroPx) {
    window.addEventListener('scroll', () => {
      const scrolled = window.scrollY;
      if (scrolled < window.innerHeight) {
        heroPx.style.transform = `translateY(${scrolled * 0.3}px)`;
      }
    }, { passive: true });
  }

  // ── 11. CTA parallax ──────────────────────────────────────────
  const ctaBg = document.querySelector('.cta-bg');
  if (ctaBg) {
    window.addEventListener('scroll', () => {
      const rect   = ctaBg.parentElement.getBoundingClientRect();
      const offset = rect.top * 0.25;
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        ctaBg.style.transform = `translateY(${offset}px)`;
      }
    }, { passive: true });
  }

  // ── 12. Image lazy load fade-in ───────────────────────────────
  const images = document.querySelectorAll('img');
  images.forEach(img => {
    img.style.opacity = '0';
    img.style.transition = 'opacity 0.5s ease';
    if (img.complete) {
      img.style.opacity = '1';
    } else {
      img.addEventListener('load', () => { img.style.opacity = '1'; });
      img.addEventListener('error', () => { img.style.opacity = '0.3'; });
    }
  });

});
