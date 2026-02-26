/* ========================================
 * Glassmorphism Portfolio - JavaScript
 * ======================================== */

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Smooth scroll for navigation links
const navLinks = document.querySelectorAll('a[href^="#"]');
navLinks.forEach((anchor) => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: prefersReducedMotion ? 'auto' : 'smooth',
        block: 'start'
      });
    }

    const navMenu = document.querySelector('.nav-menu');
    const navToggle = document.querySelector('.nav-toggle');
    if (navMenu && navToggle && navMenu.classList.contains('open')) {
      navMenu.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    }
  });
});

// Mobile navigation toggle
document.addEventListener('DOMContentLoaded', () => {
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.querySelector('.nav-menu');
  const roleDetails = document.querySelectorAll('.role-details');

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      const expanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', expanded ? 'false' : 'true');
      navMenu.classList.toggle('open');
    });

    document.addEventListener('click', (event) => {
      const clickInsideNav = event.target.closest('.glass-nav');
      if (!clickInsideNav && navMenu.classList.contains('open')) {
        navMenu.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  roleDetails.forEach((detail) => {
    const summary = detail.querySelector('summary');
    if (!summary) return;

    const setLabel = () => {
      summary.textContent = detail.open ? 'Hide details' : 'Show details';
    };

    setLabel();
    detail.addEventListener('toggle', setLabel);
  });
});

// Scroll-driven UI updates
let scrollScheduled = false;
const sections = document.querySelectorAll('.section, .hero-section');
const nav = document.querySelector('.glass-nav');
const blobs = document.querySelectorAll('.gradient-blob');

const handleScroll = () => {
  scrollScheduled = false;
  const y = window.scrollY || window.pageYOffset;

  // Active nav link based on scroll position
  let current = '';
  sections.forEach((section) => {
    if (y >= section.offsetTop - 200) {
      current = section.getAttribute('id');
    }
  });

  document.querySelectorAll('.nav-link').forEach((link) => {
    link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
  });

  // Navbar background on scroll
  if (nav) {
    if (y > 100) {
      nav.style.background = 'rgba(10, 14, 39, 0.95)';
      nav.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.3)';
    } else {
      nav.style.background = 'rgba(10, 14, 39, 0.7)';
      nav.style.boxShadow = 'none';
    }
  }

  // Parallax effect for gradient blobs
  if (!prefersReducedMotion) {
    blobs.forEach((blob, index) => {
      const speed = 0.45 + index * 0.08;
      blob.style.transform = `translateY(${y * speed}px)`;
    });
  }
};

window.addEventListener('scroll', () => {
  if (!scrollScheduled) {
    scrollScheduled = true;
    requestAnimationFrame(handleScroll);
  }
}, { passive: true });
handleScroll();

window.addEventListener('load', () => {
  const loader = document.getElementById('pageLoader');
  if (loader) {
    loader.classList.add('hidden');
  }
});

// Intersection Observer for fade-in animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, observerOptions);

// Apply fade-in animation to cards
document.addEventListener('DOMContentLoaded', () => {
  const animatedElements = document.querySelectorAll('.glass-card, .timeline-item');

  animatedElements.forEach((el) => {
    if (!prefersReducedMotion) {
      el.style.opacity = '0';
      el.style.transform = 'translateY(30px)';
      el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      observer.observe(el);
    } else {
      el.style.opacity = '1';
      el.style.transform = 'none';
    }
  });
});

// Add copy email functionality
const emailLink = document.querySelector('a[href^="mailto:"]');
if (emailLink) {
  emailLink.addEventListener('click', () => {
    const email = emailLink.textContent;
    navigator.clipboard.writeText(email).catch(() => {
      // Clipboard may be unavailable in some contexts.
    });
  });
}

// Stats counter animation
const animateCounters = () => {
  const counters = document.querySelectorAll('.stat-number');

  counters.forEach((counter) => {
    const target = counter.textContent;
    if (target.includes('+') || target.includes('%')) {
      const num = parseInt(target, 10);
      if (!Number.isNaN(num)) {
        let current = 0;
        const increment = num / 50;
        const timer = setInterval(() => {
          current += increment;
          if (current >= num) {
            counter.textContent = target;
            clearInterval(timer);
          } else {
            counter.textContent = Math.floor(current) + target.replace(/[0-9]/g, '');
          }
        }, 30);
      }
    }
  });
};

// Trigger counter animation when hero section is visible
const heroObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      animateCounters();
      heroObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

const heroSection = document.querySelector('.hero-section');
if (heroSection) {
  heroObserver.observe(heroSection);
}

// Skill tag hover effect enhancement
document.querySelectorAll('.skill-tag, .tech-tag').forEach((tag) => {
  tag.addEventListener('mouseenter', function () {
    if (!prefersReducedMotion) {
      this.style.transform = 'translateY(-4px) scale(1.05)';
    }
  });

  tag.addEventListener('mouseleave', function () {
    if (!prefersReducedMotion) {
      this.style.transform = 'translateY(0) scale(1)';
    }
  });
});

console.log('Glassmorphism Portfolio Loaded Successfully.');
