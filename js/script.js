// ---------- Footer year ----------
document.getElementById('year').textContent = new Date().getFullYear();

// ---------- Mobile menu ----------
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');

menuToggle.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', open);
  menuToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
});

navLinks.querySelectorAll('a').forEach((a) =>
  a.addEventListener('click', () => {
    navLinks.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
  })
);

// ---------- Dark mode (remembers choice when possible) ----------
const root = document.documentElement;
const themeBtn = document.getElementById('themeToggle');

function applyTheme(theme) {
  root.setAttribute('data-theme', theme);
  const label = theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode';
  themeBtn.setAttribute('aria-label', label);
  themeBtn.title = label;
}

let savedTheme = null;
try { savedTheme = localStorage.getItem('theme'); } catch (e) {}
applyTheme(
  savedTheme || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
);

let isSwitching = false;

themeBtn.addEventListener('click', async () => {
  if (isSwitching) return;
  isSwitching = true;
  const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';

  try { localStorage.setItem('theme', next); } catch (e) {}

  try {
    if (!document.startViewTransition || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      applyTheme(next);
      return;
    }

    const rect = themeBtn.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    const radius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    );

    root.classList.add('theme-switching');
    try {
      const transition = document.startViewTransition(() => applyTheme(next));
      await transition.ready;

      root.animate(
        {
          clipPath: [
            `circle(0px at ${x}px ${y}px)`,
            `circle(${radius}px at ${x}px ${y}px)`
          ]
        },
        {
          duration: 550,
          easing: getComputedStyle(root).getPropertyValue('--ease').trim(),
          pseudoElement: '::view-transition-new(root)'
        }
      );

      await transition.finished;
    } finally {
      root.classList.remove('theme-switching');
    }
  } catch (error) {
    console.error('Unable to animate the theme transition.', error);
    applyTheme(next);
    root.classList.remove('theme-switching');
  } finally {
    isSwitching = false;
  }
});

// ---------- Resume download ----------
const resumeDownloadStatus = document.getElementById('resumeDownloadStatus');

document.querySelectorAll('.resume-download').forEach((link) => {
  link.addEventListener('click', async (event) => {
    if (window.location.protocol === 'file:') return;

    event.preventDefault();
    resumeDownloadStatus.hidden = true;
    resumeDownloadStatus.textContent = '';

    try {
      const response = await fetch(link.href);
      if (!response.ok) {
        throw new Error(`Resume request failed with status ${response.status}`);
      }

      const file = URL.createObjectURL(await response.blob());
      const downloadLink = document.createElement('a');
      downloadLink.href = file;
      downloadLink.download = link.download;
      document.body.append(downloadLink);
      downloadLink.click();
      downloadLink.remove();
      window.setTimeout(() => URL.revokeObjectURL(file), 1000);
    } catch (error) {
      console.error('Unable to download the resume automatically.', error);
      resumeDownloadStatus.textContent = 'The resume could not be downloaded automatically. Please try again or contact me for a copy.';
      resumeDownloadStatus.hidden = false;
    }
  });
});

// ---------- Contact form ----------
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  const contactFormStatus = document.getElementById('contactFormStatus');
  const contactSubmit = contactForm.querySelector('button[type="submit"]');

  contactForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    contactSubmit.disabled = true;
    contactFormStatus.dataset.state = 'sending';
    contactFormStatus.textContent = 'Sending...';

    try {
      const response = await fetch(contactForm.action, {
        method: 'POST',
        body: new FormData(contactForm),
        headers: { Accept: 'application/json' }
      });

      if (!response.ok) {
        throw new Error(`Form submission failed with status ${response.status}`);
      }

      contactForm.reset();
      contactFormStatus.dataset.state = 'success';
      contactFormStatus.textContent = 'Thanks! Your message was sent.';
    } catch (error) {
      console.error('Unable to send the contact form.', error);
      contactFormStatus.dataset.state = 'error';
      contactFormStatus.textContent = 'Something went wrong. Please email me directly.';
    } finally {
      contactSubmit.disabled = false;
    }
  });
}

// ---------- Highlight active nav link while scrolling ----------
const sections = document.querySelectorAll('main section[id]');
const links = document.querySelectorAll('.nav-links a');

if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          links.forEach((link) =>
            link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`)
          );
        }
      });
    },
    { rootMargin: '-45% 0px -50% 0px' }
  );
  sections.forEach((section) => observer.observe(section));
}

// ---------- Scroll reveal ----------
if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches && 'IntersectionObserver' in window) {
  const revealItems = document.querySelectorAll('.scroll-reveal, .reveal-card');
  const revealGroups = new Map();

  document.querySelectorAll('.reveal-card').forEach((card) => {
    const group = revealGroups.get(card.parentElement) || [];
    group.push(card);
    revealGroups.set(card.parentElement, group);
  });

  revealGroups.forEach((group) => {
    group.forEach((card, index) => {
      const delay = card.classList.contains('tech-stack-item') ? 40 : 100;
      card.style.setProperty('--reveal-delay', `${index * delay}ms`);
    });
  });

  document.documentElement.classList.add('has-scroll-reveal');

  const revealObserver = new IntersectionObserver(
    (entries, currentObserver) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          currentObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );

  revealItems.forEach((item) => revealObserver.observe(item));
}

// ---------- Shared coverflow showcases ----------
document.querySelectorAll('.showcase').forEach((showcase) => {
  const stage = showcase.querySelector('.showcase-stage');
  const slides = Array.from(stage.querySelectorAll('.showcase-slide'));
  const caption = showcase.querySelector('.showcase-caption');
  const pagination = showcase.querySelector('.showcase-pagination');
  const liveRegion = showcase.querySelector('.showcase-live');
  const dialog = showcase.querySelector('.showcase-lightbox');
  const dialogImage = dialog?.querySelector('img');
  const closeButton = dialog?.querySelector('.showcase-lightbox-close');
  const itemType = showcase.dataset.showcaseItem || 'Project';
  const itemTypeLower = itemType.toLowerCase();
  const sideSlideNavigation = showcase.dataset.sideNavigation !== 'false';
  const dots = [];
  let activeIndex = 0;
  let gesture = null;
  let suppressClick = null;
  let suppressTimer = 0;
  let rafId = null;
  let dragX = 0;

  if (!slides.length) return;

  // Cache stage width to eliminate layout thrashing during drag
  let stageWidth = stage.clientWidth || 600;
  const updateStageWidth = () => {
    stageWidth = stage.clientWidth || 600;
  };
  window.addEventListener('resize', updateStageWidth, { passive: true });

  const titleFor = (index) => slides[index].querySelector('h3').textContent.trim();

  // Pre-create caption elements to switch via classes instead of DOM rebuilding during swipes
  const captionItems = slides.map((slide, index) => {
    const item = document.createElement('div');
    item.className = 'showcase-caption-item';
    item.dataset.index = String(index);
    item.setAttribute('aria-hidden', String(index !== activeIndex));
    if (index === activeIndex) item.classList.add('is-active');
    const info = slide.querySelector('.showcase-info');
    if (info) item.append(info.cloneNode(true));
    caption.append(item);
    return item;
  });

  const measureCaption = () => {
    let maxHeight = 0;
    captionItems.forEach((item) => {
      const info = item.firstElementChild;
      if (info) {
        maxHeight = Math.max(maxHeight, info.offsetHeight);
      }
    });
    if (maxHeight > 0) {
      caption.style.minHeight = `${Math.ceil(maxHeight)}px`;
    }
  };

  const render = (announce = true) => {
    slides.forEach((slide, index) => {
      let distance = (index - activeIndex + slides.length) % slides.length;
      if (distance > slides.length / 2) distance -= slides.length;
      const hidden = Math.abs(distance) > 1;
      slide.dataset.position = String(distance);
      slide.setAttribute('aria-hidden', String(hidden));
    });

    dots.forEach((dot, index) => {
      if (index === activeIndex) dot.setAttribute('aria-current', 'true');
      else dot.removeAttribute('aria-current');
    });

    captionItems.forEach((item, index) => {
      const isActive = index === activeIndex;
      item.classList.toggle('is-active', isActive);
      item.setAttribute('aria-hidden', String(!isActive));
    });

    if (announce) {
      liveRegion.textContent = `${itemType} ${activeIndex + 1} of ${slides.length}: ${titleFor(activeIndex)}`;
    }
  };

  const goTo = (index) => {
    activeIndex = (index + slides.length) % slides.length;
    stage.style.removeProperty('--showcase-drag-x');
    render();
  };

  slides.forEach((slide, index) => {
    slide.setAttribute('role', 'group');
    slide.setAttribute('aria-roledescription', 'slide');
    slide.setAttribute('aria-label', `${index + 1} of ${slides.length}: ${titleFor(index)}`);
    slide.tabIndex = -1;

    // Pre-decode image so incoming neighbors do not stall
    const img = slide.querySelector('img');
    if (img && typeof img.decode === 'function') {
      img.decode().catch(() => {});
    }

    const certificateImage = slide.querySelector('.cert-image');
    if (certificateImage) {
      const frame = certificateImage.closest('.cert-frame');
      certificateImage.addEventListener('error', () => {
        certificateImage.hidden = true;
        frame.classList.add('is-broken');
      });
      if (certificateImage.complete && certificateImage.naturalWidth === 0) {
        certificateImage.hidden = true;
        frame.classList.add('is-broken');
      }
    }
    const projectImage = slide.querySelector('.project-image');
    if (projectImage) {
      const frame = projectImage.closest('.showcase-frame');
      projectImage.addEventListener('error', () => {
        projectImage.hidden = true;
        frame.classList.add('is-broken');
      });
      if (projectImage.complete && projectImage.naturalWidth === 0) {
        projectImage.hidden = true;
        frame.classList.add('is-broken');
      }
    }

    const dot = document.createElement('button');
    dot.className = 'showcase-dot';
    dot.type = 'button';
    dot.setAttribute('aria-label', `Show ${itemTypeLower} ${index + 1}: ${titleFor(index)}`);
    dot.addEventListener('click', () => goTo(index));
    pagination.append(dot);
    dots.push(dot);
  });

  showcase.classList.add('is-enhanced');
  measureCaption();
  render(false);
  document.fonts?.ready.then(measureCaption);
  window.addEventListener('resize', measureCaption, { passive: true });

  caption.addEventListener('click', (event) => {
    const button = event.target.closest('.showcase-read-more');
    if (!button) return;
    const info = button.closest('.showcase-info');
    const expanded = info.classList.toggle('is-expanded');
    button.setAttribute('aria-expanded', String(expanded));
    button.textContent = expanded ? 'Show less' : 'Read more';
    measureCaption();
  });

  stage.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      goTo(activeIndex + (event.key === 'ArrowRight' ? 1 : -1));
    } else if (dialog && (event.key === 'Enter' || event.key === ' ') && event.target === stage) {
      event.preventDefault();
      openLightbox();
    }
  });

  const openLightbox = () => {
    if (!dialog || !dialogImage || !closeButton || typeof dialog.showModal !== 'function') return;
    const image = slides[activeIndex].querySelector('.showcase-frame img');
    dialogImage.src = image.currentSrc || image.src;
    dialogImage.alt = image.alt;
    dialog.showModal();
    closeButton.focus();
  };

  if (dialog && dialogImage && closeButton && typeof dialog.showModal === 'function') {
    closeButton.addEventListener('click', () => dialog.close());
    dialog.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        dialog.close();
      }
    });
    dialog.addEventListener('cancel', (event) => {
      event.preventDefault();
      dialog.close();
    });
    dialog.addEventListener('click', (event) => {
      if (event.target === dialog) dialog.close();
    });
    dialog.addEventListener('close', () => {
      dialogImage.removeAttribute('src');
      slides[activeIndex].focus({ preventScroll: true });
    });
  }

  stage.addEventListener('pointerdown', (event) => {
    const slide = event.target.closest('.showcase-slide');
    if (
      !slide || !event.isPrimary ||
      (event.pointerType === 'mouse' && event.button !== 0)
    ) return;

    gesture = {
      pointerId: event.pointerId,
      slide,
      startX: event.clientX,
      startY: event.clientY,
      startedAt: performance.now(),
      horizontal: false,
      moved: false
    };
  });

  window.addEventListener('pointermove', (event) => {
    if (!gesture || event.pointerId !== gesture.pointerId) return;
    const deltaX = event.clientX - gesture.startX;
    const deltaY = event.clientY - gesture.startY;
    if (!gesture.horizontal) {
      if (Math.hypot(deltaX, deltaY) > 6) gesture.moved = true;
      if (Math.abs(deltaX) > 6 && Math.abs(deltaX) > Math.abs(deltaY) * 1.15) {
        gesture.horizontal = true;
        stage.classList.add('is-dragging');
      }
    }
    if (gesture.horizontal) {
      if (event.cancelable) event.preventDefault();
      dragX = deltaX;
      if (!rafId) {
        rafId = requestAnimationFrame(() => {
          stage.style.setProperty('--showcase-drag-x', `${dragX}px`);
          rafId = null;
        });
      }
    }
  }, { passive: false });

  window.addEventListener('pointerup', (event) => {
    if (!gesture || event.pointerId !== gesture.pointerId) return;
    const finished = gesture;
    gesture = null;
    if (rafId) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }

    if (!finished.moved) return;

    suppressClick = { x: event.clientX, y: event.clientY };
    window.clearTimeout(suppressTimer);
    suppressTimer = window.setTimeout(() => { suppressClick = null; }, 400);

    if (!finished.horizontal) return;
    const deltaX = event.clientX - finished.startX;
    const elapsed = Math.max(performance.now() - finished.startedAt, 1);
    const velocity = Math.abs(deltaX) / elapsed;

    stage.classList.remove('is-dragging');
    if (Math.abs(deltaX) > stageWidth * 0.15 || (Math.abs(deltaX) > 32 && velocity > 0.5)) {
      goTo(activeIndex + (deltaX < 0 ? 1 : -1));
    } else {
      stage.style.removeProperty('--showcase-drag-x');
    }
  });

  window.addEventListener('pointercancel', (event) => {
    if (!gesture || event.pointerId !== gesture.pointerId) return;
    if (rafId) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
    stage.classList.remove('is-dragging');
    stage.style.removeProperty('--showcase-drag-x');
    gesture = null;
  });

  stage.addEventListener('click', (event) => {
    const clickFollowsDrag = suppressClick && event.detail > 0 &&
      Math.abs(event.clientX - suppressClick.x) <= 30 &&
      Math.abs(event.clientY - suppressClick.y) <= 30;
    if (clickFollowsDrag) {
      event.preventDefault();
      event.stopImmediatePropagation();
      suppressClick = null;
      window.clearTimeout(suppressTimer);
      return;
    }

    const slide = event.target.closest('.showcase-slide');
    if (!slide) return;
    const distance = Number(slide.dataset.position);
    if (distance === 0) {
      if (dialog) openLightbox();
    } else if (sideSlideNavigation) {
      goTo(activeIndex + distance);
    }
  }, true);
});

// ---------- Hero tagline typewriter ----------
(() => {
  const tagline = document.querySelector('.hero-copy .hero-tagline');
  if (!tagline) return;

  const fullText = tagline.textContent.trim();
  tagline.setAttribute('aria-label', fullText);

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  Promise.resolve(document.fonts?.ready).then(() => {
    const source = document.createElement('span');
    const typedText = document.createElement('span');
    const typingLayer = document.createElement('span');
    const caret = document.createElement('span');

    source.className = 'hero-tagline-source';
    source.textContent = fullText;
    source.setAttribute('aria-hidden', 'true');
    typedText.className = 'hero-tagline-typed';
    typedText.setAttribute('aria-hidden', 'true');
    typingLayer.className = 'hero-tagline-typing-layer';
    typingLayer.setAttribute('aria-hidden', 'true');
    caret.className = 'hero-tagline-caret';
    caret.setAttribute('aria-hidden', 'true');

    typingLayer.append(typedText, caret);
    tagline.replaceChildren(source, typingLayer);
    const lockedHeight = source.getBoundingClientRect().height;
    tagline.style.height = `${lockedHeight}px`;

    const delay = Math.max(0, 950 - performance.now());
    window.setTimeout(() => {
      tagline.classList.add('is-typing');
      caret.classList.add('is-blinking');
      const startTime = performance.now();
      const characterDelay = 100;

      function type(timestamp) {
        const count = Math.min(fullText.length, Math.floor((timestamp - startTime) / characterDelay));
        typedText.textContent = fullText.slice(0, count);

        if (count < fullText.length) {
          window.requestAnimationFrame(type);
          return;
        }

        window.setTimeout(() => {
          caret.classList.add('is-fading');
          window.setTimeout(() => {
            caret.remove();
          }, 250);
        }, 1500);
      }

      window.requestAnimationFrame(type);
    }, delay);
  });
})();
