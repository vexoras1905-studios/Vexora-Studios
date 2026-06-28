const initApp = () => {
  // --- LOADING SCREEN ---
  const loader = document.getElementById('loader');
  if (loader) {
    let hasFaded = false;
    const fadeOutLoader = () => {
      if (hasFaded) return;
      hasFaded = true;
      if (loader) {
        loader.classList.add('js-fade-out');
        setTimeout(() => {
          if (loader && loader.parentNode) {
            loader.remove();
          }
        }, 400);
      }
    };
    
    // Safety backup triggers in case inline script in HTML was bypassed
    window.addEventListener('load', () => setTimeout(fadeOutLoader, 150));
    setTimeout(fadeOutLoader, 1000); // 1.0s maximum show time trigger
    setTimeout(fadeOutLoader, 1200); // 1.2s secondary safety backup
  }

  // --- THEME TOGGLE (DARK / LIGHT) ---
  const themeToggleBtns = document.querySelectorAll('.theme-toggle-btn');
  const sunIcons = document.querySelectorAll('.sun-icon');
  const moonIcons = document.querySelectorAll('.moon-icon');

  // Initialize theme from local storage or system preference
  const savedTheme = localStorage.getItem('theme');
  const systemPrefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;

  function setTheme(theme) {
    if (theme === 'light') {
      document.documentElement.classList.add('light');
      localStorage.setItem('theme', 'light');
      sunIcons.forEach(icon => icon.classList.add('hidden'));
      moonIcons.forEach(icon => icon.classList.remove('hidden'));
    } else {
      document.documentElement.classList.remove('light');
      localStorage.setItem('theme', 'dark');
      sunIcons.forEach(icon => icon.classList.remove('hidden'));
      moonIcons.forEach(icon => icon.classList.add('hidden'));
    }
  }

  if (savedTheme) {
    setTheme(savedTheme);
  } else if (systemPrefersLight) {
    setTheme('light');
  } else {
    setTheme('dark');
  }

  themeToggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const isCurrentlyLight = document.documentElement.classList.contains('light');
      setTheme(isCurrentlyLight ? 'dark' : 'light');
    });
  });

  // --- MOBILE NAVIGATION MENU ---
  const mobileMenuToggleBtn = document.getElementById('mobile-menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileLinks = document.querySelectorAll('.mobile-link');

  if (mobileMenuToggleBtn && mobileMenu) {
    mobileMenuToggleBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
      mobileMenu.classList.toggle('flex');
    });

    // Close menu when clicking on any link
    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
        mobileMenu.classList.remove('flex');
      });
    });
  }

  // --- SCROLL REVEAL (IntersectionObserver) ---
  const reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          observer.unobserve(entry.target); // Reveal only once
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -40px 0px'
    });

    reveals.forEach(element => {
      revealObserver.observe(element);
    });
  } else {
    // Fallback for older browsers
    reveals.forEach(element => {
      element.classList.add('active');
    });
  }

  // --- FAQ ACCORDION ---
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-btn');
    const answerPanel = item.querySelector('.faq-answer');
    const icon = item.querySelector('.faq-icon');

    if (questionBtn && answerPanel && icon) {
      questionBtn.addEventListener('click', () => {
        const isOpen = !answerPanel.classList.contains('hidden');

        // Close all other panels first
        faqItems.forEach(otherItem => {
          const otherPanel = otherItem.querySelector('.faq-answer');
          const otherIcon = otherItem.querySelector('.faq-icon');
          if (otherPanel && otherIcon) {
            otherPanel.classList.add('hidden');
            otherIcon.style.transform = 'rotate(0deg)';
          }
        });

        // Toggle current panel
        if (isOpen) {
          answerPanel.classList.add('hidden');
          icon.style.transform = 'rotate(0deg)';
        } else {
          answerPanel.classList.remove('hidden');
          icon.style.transform = 'rotate(180deg)';
        }
      });
    }
  });

  // --- ACTIVE NAVBAR HIGHLIGHTING & BACK TO TOP ON SCROLL ---
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('.nav-link');
  const backToTopBtn = document.getElementById('back-to-top');

  window.addEventListener('scroll', () => {
    // Active Navbar highlights
    let currentSectionId = '';
    const scrollPosition = window.scrollY + 120; // offset

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;

      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        currentSectionId = section.getAttribute('id') || '';
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      const href = link.getAttribute('href');
      if (href === `#${currentSectionId}`) {
        link.classList.add('active');
      }
    });

    // Back to Top Visibility Toggle
    if (backToTopBtn) {
      if (window.scrollY > 400) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    }
  });

  // Scroll to Top action
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }
};

if (document.readyState !== 'loading') {
  initApp();
} else {
  document.addEventListener('DOMContentLoaded', initApp);
}
