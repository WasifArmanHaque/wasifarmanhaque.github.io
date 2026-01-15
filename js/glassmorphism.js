/* ========================================
 * Glassmorphism Portfolio - JavaScript
 * ======================================== */

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

// Active navigation link based on scroll position
window.addEventListener('scroll', () => {
  let current = '';
  const sections = document.querySelectorAll('.section, .hero-section');

  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;
    if (pageYOffset >= sectionTop - 200) {
      current = section.getAttribute('id');
    }
  });

  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) {
      link.classList.add('active');
    }
  });
});

// Intersection Observer for fade-in animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, observerOptions);

// Apply fade-in animation to cards
document.addEventListener('DOMContentLoaded', () => {
  const animatedElements = document.querySelectorAll('.glass-card, .timeline-item');

  animatedElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
  });
});

// Parallax effect for gradient blobs
window.addEventListener('scroll', () => {
  const scrolled = window.pageYOffset;
  const blobs = document.querySelectorAll('.gradient-blob');

  blobs.forEach((blob, index) => {
    const speed = 0.5 + (index * 0.1);
    blob.style.transform = `translateY(${scrolled * speed}px)`;
  });
});

// Add typing effect to hero title (optional enhancement)
const heroTitle = document.querySelector('.hero-title .gradient-text');
if (heroTitle) {
  const text = heroTitle.textContent;
  heroTitle.textContent = '';
  let i = 0;

  const typeWriter = () => {
    if (i < text.length) {
      heroTitle.textContent += text.charAt(i);
      i++;
      setTimeout(typeWriter, 100);
    }
  };

  // Uncomment to enable typing effect
  // setTimeout(typeWriter, 500);
}

// Removed 3D tilt effect - cards now have simple hover highlight via CSS

// Navbar background on scroll
window.addEventListener('scroll', () => {
  const nav = document.querySelector('.glass-nav');
  if (window.scrollY > 100) {
    nav.style.background = 'rgba(10, 14, 39, 0.95)';
    nav.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.3)';
  } else {
    nav.style.background = 'rgba(10, 14, 39, 0.7)';
    nav.style.boxShadow = 'none';
  }
});

// Add copy email functionality
const emailLink = document.querySelector('a[href^="mailto:"]');
if (emailLink) {
  emailLink.addEventListener('click', (e) => {
    const email = emailLink.textContent;
    navigator.clipboard.writeText(email).then(() => {
      // Could add a toast notification here
      console.log('Email copied to clipboard!');
    });
  });
}

// Stats counter animation
const animateCounters = () => {
  const counters = document.querySelectorAll('.stat-number');

  counters.forEach(counter => {
    const target = counter.textContent;
    if (target.includes('+') || target.includes('%')) {
      const num = parseInt(target);
      if (!isNaN(num)) {
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
  entries.forEach(entry => {
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
document.querySelectorAll('.skill-tag, .tech-tag').forEach(tag => {
  tag.addEventListener('mouseenter', function() {
    this.style.transform = 'translateY(-4px) scale(1.05)';
  });

  tag.addEventListener('mouseleave', function() {
    this.style.transform = 'translateY(0) scale(1)';
  });
});

console.log('🚀 Glassmorphism Portfolio Loaded Successfully!');
