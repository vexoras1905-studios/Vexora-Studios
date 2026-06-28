const initApp = () => {
  // Wrap everything in a global try-catch to ensure one error never breaks the entire site execution
  try {
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
            try {
              if (loader && loader.parentNode) {
                loader.parentNode.removeChild(loader);
              }
            } catch (err) {
              console.error('Error removing loader element:', err);
            }
          }, 400);
        }
      };
      
      // Safety backup triggers in case inline script in HTML was bypassed
      window.addEventListener('load', () => setTimeout(fadeOutLoader, 150));
      setTimeout(fadeOutLoader, 1000); // 1.0s maximum show time trigger
      setTimeout(fadeOutLoader, 1200); // 1.2s secondary safety backup
    }
  } catch (e) {
    console.error('Error in preloader initialization:', e);
  }

  // --- THEME TOGGLE (DARK / LIGHT) ---
  try {
    const themeToggleBtns = document.querySelectorAll('.theme-toggle-btn');
    const sunIcons = document.querySelectorAll('.sun-icon');
    const moonIcons = document.querySelectorAll('.moon-icon');

    // Initialize theme from local storage or system preference with safe fallback
    let savedTheme = null;
    try {
      savedTheme = localStorage.getItem('theme');
    } catch (e) {
      console.warn('localStorage is restricted in this environment:', e);
    }
    
    let systemPrefersLight = false;
    try {
      systemPrefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
    } catch (e) {
      console.warn('matchMedia is not supported in this environment:', e);
    }

    function setTheme(theme) {
      try {
        if (theme === 'light') {
          document.documentElement.classList.add('light');
          try {
            localStorage.setItem('theme', 'light');
          } catch (e) {}
          sunIcons.forEach(icon => icon.classList.add('hidden'));
          moonIcons.forEach(icon => icon.classList.remove('hidden'));
        } else {
          document.documentElement.classList.remove('light');
          try {
            localStorage.setItem('theme', 'dark');
          } catch (e) {}
          sunIcons.forEach(icon => icon.classList.remove('hidden'));
          moonIcons.forEach(icon => icon.classList.add('hidden'));
        }
      } catch (err) {
        console.error('Error in setTheme operation:', err);
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
  } catch (e) {
    console.error('Error in theme toggle initialization:', e);
  }

  // --- MOBILE NAVIGATION MENU ---
  try {
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
  } catch (e) {
    console.error('Error in mobile navigation initialization:', e);
  }

  // --- SCROLL REVEAL (IntersectionObserver with Multi-level Fallbacks) ---
  try {
    const reveals = document.querySelectorAll('.reveal');
    
    // Quick helper to see if element is already in viewport
    const isInViewport = (element) => {
      try {
        const rect = element.getBoundingClientRect();
        return (
          rect.top <= (window.innerHeight || document.documentElement.clientHeight) &&
          rect.bottom >= 0
        );
      } catch (e) {
        return false;
      }
    };

    // Immediate viewport scan to activate already-visible sections immediately on start
    reveals.forEach(element => {
      if (isInViewport(element)) {
        element.classList.add('active');
      }
    });

    if ('IntersectionObserver' in window) {
      const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active');
            observer.unobserve(entry.target); // Reveal only once
          }
        });
      }, {
        threshold: 0.05, // lowered threshold for instant, easier triggers
        rootMargin: '50px 0px 50px 0px' // positive margins so they load slightly before appearing in view
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

    // ULTIMATE ABSOLUTE FALLBACK TIMER (1.4 seconds fail-safe)
    // No matter what, if anything goes wrong, reveal everything so the site does not stay blank
    setTimeout(() => {
      reveals.forEach(element => {
        if (!element.classList.contains('active')) {
          element.classList.add('active');
        }
      });
    }, 1400);

  } catch (e) {
    console.error('Error in scroll reveal observer:', e);
    // Ultimate global fallback trigger in case of complete error
    try {
      document.querySelectorAll('.reveal').forEach(el => el.classList.add('active'));
    } catch (innerErr) {}
  }

  // --- FAQ ACCORDION ---
  try {
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
  } catch (e) {
    console.error('Error in FAQ accordion initialization:', e);
  }

  // --- ACTIVE NAVBAR HIGHLIGHTING & BACK TO TOP ON SCROLL ---
  try {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');
    const backToTopBtn = document.getElementById('back-to-top');

    window.addEventListener('scroll', () => {
      try {
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
      } catch (err) {
        console.error('Error in scroll event listener:', err);
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
  } catch (e) {
    console.error('Error in active navbar / scroll-to-top initialization:', e);
  }

  // --- PORTFOLIO DEMO MODAL TRIGGER ---
  try {
    const demoButtons = document.querySelectorAll('.portfolio-demo-btn');
    const demoModal = document.getElementById('demo-modal');
    const demoModalClose = document.getElementById('demo-modal-close');
    const demoModalOk = document.getElementById('demo-modal-ok');
    const demoModalProjectName = document.getElementById('demo-modal-project-name');

    if (demoButtons && demoModal) {
      demoButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          const url = btn.getAttribute('data-demo-url');
          if (url && url !== '#' && url !== '') {
            window.open(url, '_blank');
          } else {
            // Show premium modal
            const projectName = btn.getAttribute('data-demo-title') || 'Premium Website';
            if (demoModalProjectName) {
              demoModalProjectName.textContent = projectName;
            }
            demoModal.classList.remove('hidden');
            demoModal.classList.add('flex');
            // Prevent body scroll
            document.body.style.overflow = 'hidden';
          }
        });
      });
    }

    const closeModal = () => {
      if (demoModal) {
        demoModal.classList.add('hidden');
        demoModal.classList.remove('flex');
        document.body.style.overflow = '';
      }
    };

    if (demoModalClose) {
      demoModalClose.addEventListener('click', closeModal);
    }
    if (demoModalOk) {
      demoModalOk.addEventListener('click', closeModal);
    }
    if (demoModal) {
      demoModal.addEventListener('click', (e) => {
        if (e.target === demoModal) {
          closeModal();
        }
      });
    }
  } catch (e) {
    console.error('Error in portfolio demo modal:', e);
  }
};

if (document.readyState !== 'loading') {
  initApp();
} else {
  document.addEventListener('DOMContentLoaded', initApp);
}
