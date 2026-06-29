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

  // --- ACTIVE NAVBAR HIGHLIGHTING & BACK TO TOP ON SCROLL (THROTTLED & ZERO-REFLOW) ---
  try {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');
    const backToTopBtn = document.getElementById('back-to-top');

    // 1. High-Performance IntersectionObserver for active nav highlights (Zero-Reflow!)
    if ('IntersectionObserver' in window) {
      const activeNavObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const currentSectionId = entry.target.getAttribute('id');
            if (currentSectionId) {
              navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${currentSectionId}`) {
                  link.classList.add('active');
                }
              });
            }
          }
        });
      }, {
        root: null,
        rootMargin: '-30% 0px -55% 0px', // Center-focused focus zone for accurate tracking
        threshold: 0
      });

      sections.forEach(sec => activeNavObserver.observe(sec));
    }

    // 2. High-Performance Throttled scroll listener for Back-to-Top Button
    let lastScrollTime = 0;
    const scrollThrottleInterval = 120; // Check every 120ms (more than enough for toggle)

    window.addEventListener('scroll', () => {
      const now = Date.now();
      if (now - lastScrollTime > scrollThrottleInterval) {
        lastScrollTime = now;
        if (backToTopBtn) {
          if (window.scrollY > 400) {
            backToTopBtn.classList.add('visible');
          } else {
            backToTopBtn.classList.remove('visible');
          }
        }
      }
    }, { passive: true });

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

  // --- TYPEWRITER HEADLINE ANIMATION ---
  try {
    const typewriterElement = document.getElementById('typewriter-headline');
    if (typewriterElement) {
      const phrases = [
        "Grow Your Business.",
        "Unleash Spider-Sense UX.",
        "Sling Web-Speed Loadtimes.",
        "Deploy Resilient Code."
      ];
      let phraseIndex = 0;
      let charIndex = 0;
      let isDeleting = false;
      let typingSpeed = 100;

      const type = () => {
        const currentPhrase = phrases[phraseIndex];
        if (isDeleting) {
          typewriterElement.textContent = currentPhrase.substring(0, charIndex - 1);
          charIndex--;
          typingSpeed = 50;
        } else {
          typewriterElement.textContent = currentPhrase.substring(0, charIndex + 1);
          charIndex++;
          typingSpeed = 120;
        }

        if (!isDeleting && charIndex === currentPhrase.length) {
          typingSpeed = 2000; // Pause at end of phrase
          isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
          isDeleting = false;
          phraseIndex = (phraseIndex + 1) % phrases.length;
          typingSpeed = 500; // Pause before typing next phrase
        }

        setTimeout(type, typingSpeed);
      };

      // Start typewriter
      type();
    }
  } catch (e) {
    console.error('Error in typewriter animation:', e);
  }

  // --- SPIDER-WEB CANVAS INTERACTIVE ANIMATION ---
  try {
    const canvas = document.getElementById('web-animation-canvas');
    if (canvas) {
      const ctx = canvas.getContext('2d');
      let particles = [];
      let mouseX = null;
      let mouseY = null;
      let mouseActive = false;
      let webShots = []; // Spawns when clicking

      // Hardware capabilities and memory detection
      const checkIsLowEndHardware = () => {
        try {
          const cores = navigator.hardwareConcurrency || 4;
          const memory = navigator.deviceMemory || 8;
          const isMobile = /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent) || (navigator.maxTouchPoints > 0);
          return cores < 4 || memory < 4 || (isMobile && cores < 6);
        } catch (e) {
          return false;
        }
      };

      // Set performance mode state
      let performanceSaverActive = checkIsLowEndHardware();
      if (performanceSaverActive) {
        document.documentElement.classList.add('low-perf');
      }

      // Dynamically create a luxury-themed Performance Toggle Badge
      const createPerformanceBadge = () => {
        try {
          if (document.getElementById('performance-mode-badge')) return;
          const badge = document.createElement('div');
          badge.id = 'performance-mode-badge';
          
          const textSpan = document.createElement('span');
          textSpan.id = 'perf-badge-text';
          textSpan.innerHTML = performanceSaverActive ? '⚡ Power Saver: ON' : '✨ High Quality';
          
          const toggleBtn = document.createElement('button');
          toggleBtn.id = 'perf-badge-toggle';
          toggleBtn.textContent = performanceSaverActive ? 'Optimize' : 'Sling Turbo';
          toggleBtn.title = 'Toggle performance/quality modes';
          
          toggleBtn.addEventListener('click', () => {
            performanceSaverActive = !performanceSaverActive;
            if (performanceSaverActive) {
              document.documentElement.classList.add('low-perf');
              textSpan.innerHTML = '⚡ Power Saver: ON';
              toggleBtn.textContent = 'Turbo Mode';
              // Instantly trim particles
              if (particles.length > 12) {
                particles = particles.slice(0, 12);
              }
            } else {
              document.documentElement.classList.remove('low-perf');
              textSpan.innerHTML = '✨ High Quality';
              toggleBtn.textContent = 'Save Power';
              // Re-populate particles
              repopulateParticles();
            }
          });

          badge.appendChild(textSpan);
          badge.appendChild(toggleBtn);
          document.body.appendChild(badge);
        } catch (err) {
          console.error('Error creating performance badge:', err);
        }
      };

      // Resize canvas relative to container
      const resizeCanvas = () => {
        const rect = canvas.parentElement.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;
      };
      resizeCanvas();
      window.addEventListener('resize', resizeCanvas);

      // Create initial particles based on current performance tier
      const repopulateParticles = () => {
        particles = [];
        const maxLimit = performanceSaverActive ? 12 : 42;
        const particleCount = Math.min(maxLimit, Math.floor((canvas.width * canvas.height) / 16000));
        for (let i = 0; i < particleCount; i++) {
          particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 1.2,
            vy: (Math.random() - 0.5) * 1.2,
            radius: Math.random() * 2 + 1,
            color: Math.random() > 0.4 ? 'rgba(226, 27, 27, 0.65)' : 'rgba(59, 130, 246, 0.65)' // Red or Blue!
          });
        }
      };

      repopulateParticles();
      createPerformanceBadge();

      // Track mouse
      const parent = canvas.parentElement;
      parent.addEventListener('mousemove', (e) => {
        const rect = parent.getBoundingClientRect();
        mouseX = e.clientX - rect.left;
        mouseY = e.clientY - rect.top;
        mouseActive = true;
        
        // Move the mouse glow element in hero using GPU-accelerated translate3d
        const mouseGlow = document.getElementById('hero-mouse-glow');
        if (mouseGlow) {
          mouseGlow.style.transform = `translate3d(${mouseX - 150}px, ${mouseY - 150}px, 0)`;
          mouseGlow.style.opacity = '1';
        }
      }, { passive: true });

      parent.addEventListener('mouseleave', () => {
        mouseActive = false;
        mouseX = null;
        mouseY = null;
        const mouseGlow = document.getElementById('hero-mouse-glow');
        if (mouseGlow) {
          mouseGlow.style.opacity = '0';
        }
      });

      // "THWIP" Web shot click effect!
      parent.addEventListener('mousedown', (e) => {
        const rect = parent.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const clickY = e.clientY - rect.top;

        // Sound effect (optional visual thwip text)
        createThwipFloatingText(clickX, clickY);

        // Web shot explosion at click coordinates
        webShots.push({
          x: clickX,
          y: clickY,
          radius: 0,
          maxRadius: Math.min(performanceSaverActive ? 100 : 180, canvas.width / 3.5),
          duration: performanceSaverActive ? 300 : 450, // shorter animation for low-perf
          startTime: Date.now()
        });

        // Pull nearby particles towards click (magnetic web pull) - Optimized distance check
        particles.forEach(p => {
          const dx = p.x - clickX;
          const dy = p.y - clickY;
          const distSq = dx * dx + dy * dy;
          if (distSq < 48400) { // 220 * 220
            const dist = Math.sqrt(distSq);
            const force = (220 - dist) / 220;
            p.vx -= (dx / (dist || 1)) * force * 5.5;
            p.vy -= (dy / (dist || 1)) * force * 5.5;
          }
        });
      });

      // Floating text "THWIP!" animation helper
      function createThwipFloatingText(x, y) {
        const label = document.createElement('div');
        label.className = 'absolute font-sans font-extrabold text-[11px] tracking-widest text-[#ef4444] uppercase bg-black/90 px-2 py-0.5 border border-[#e21b1b]/50 rounded pointer-events-none select-none z-30 shadow-lg shadow-red-500/20';
        label.textContent = 'THWIP!';
        label.style.left = `${x}px`;
        label.style.top = `${y - 12}px`;
        label.style.transform = 'translate3d(-50%, -50%, 0) scale(0.95)';
        label.style.transition = 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
        parent.appendChild(label);

        setTimeout(() => {
          label.style.opacity = '0';
          label.style.transform = `translate3d(-50%, -45px, 0) scale(1.15) rotate(${Math.random() * 24 - 12}deg)`;
        }, 35);

        setTimeout(() => {
          if (label.parentNode === parent) {
            parent.removeChild(label);
          }
        }, 700);
      }

      // Dynamic FPS Tracker Variables
      let lastFrameTime = performance.now();
      let frameCount = 0;
      let fpsCheckStart = performance.now();
      const minAcceptableFps = 42;

      // Drawing routine
      const draw = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const isDark = !document.documentElement.classList.contains('light');

        // Dynamic FPS Check to trigger auto-optimization on lag detection
        const currentTime = performance.now();
        frameCount++;
        
        // Measure FPS every 1.5 seconds (90 frames at 60fps)
        if (currentTime - fpsCheckStart >= 1500) {
          const fps = Math.round((frameCount * 1000) / (currentTime - fpsCheckStart));
          
          if (fps < minAcceptableFps && !performanceSaverActive) {
            console.warn(`Dynamic FPS Drop detected: ${fps} FPS. Switching to Performance-Saver Mode.`);
            performanceSaverActive = true;
            document.documentElement.classList.add('low-perf');
            
            const badgeText = document.getElementById('perf-badge-text');
            const badgeToggle = document.getElementById('perf-badge-toggle');
            if (badgeText && badgeToggle) {
              badgeText.innerHTML = '⚡ Auto-Optimized: ON';
              badgeToggle.textContent = 'Turbo Mode';
            }
            
            // Slice particles instantly to release thread load
            particles = particles.slice(0, 12);
          }
          
          frameCount = 0;
          fpsCheckStart = currentTime;
        }

        // Draw web shots click effects
        const now = Date.now();
        webShots = webShots.filter(shot => {
          const elapsed = now - shot.startTime;
          const progress = elapsed / shot.duration;
          if (progress >= 1) return false;

          shot.radius = shot.maxRadius * Math.sin(progress * Math.PI / 2);
          const opacity = 1 - progress;

          // Draw spiderweb radial web structure at click
          ctx.strokeStyle = isDark ? `rgba(255, 255, 255, ${opacity * 0.45})` : `rgba(30, 64, 175, ${opacity * 0.4})`;
          ctx.lineWidth = 0.8;

          // Spokes (Reduced count in performance saver mode)
          const spokes = performanceSaverActive ? 6 : 10;
          for (let s = 0; s < spokes; s++) {
            const angle = (s / spokes) * Math.PI * 2;
            const sx = shot.x + Math.cos(angle) * shot.radius;
            const sy = shot.y + Math.sin(angle) * shot.radius;
            ctx.beginPath();
            ctx.moveTo(shot.x, shot.y);
            ctx.lineTo(sx, sy);
            ctx.stroke();
          }

          // Concentric web rings (Reduced in performance saver mode)
          const rings = performanceSaverActive ? 2 : 4;
          for (let r = 1; r <= rings; r++) {
            const rRadius = shot.radius * (r / rings);
            ctx.beginPath();
            ctx.arc(shot.x, shot.y, rRadius, 0, Math.PI * 2);
            ctx.stroke();

            // Web webbing connections between spokes (spiral look)
            ctx.strokeStyle = isDark ? `rgba(226, 27, 27, ${opacity * 0.5})` : `rgba(30, 64, 175, ${opacity * 0.35})`;
            ctx.beginPath();
            for (let s = 0; s <= spokes; s++) {
              const angle = (s / spokes) * Math.PI * 2;
              const sx = shot.x + Math.cos(angle) * rRadius;
              const sy = shot.y + Math.sin(angle) * rRadius;
              if (s === 0) ctx.moveTo(sx, sy);
              else ctx.lineTo(sx, sy);
            }
            ctx.stroke();
          }

          return true;
        });

        // Update and draw particles
        particles.forEach(p => {
          p.x += p.vx;
          p.y += p.vy;

          if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
          if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

          // Subtle drag to slow down explosions
          p.vx *= 0.98;
          p.vy *= 0.98;
          
          // Minimum float speed
          const currentSpeed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
          if (currentSpeed < 0.3) {
            p.vx += (Math.random() - 0.5) * 0.15;
            p.vy += (Math.random() - 0.5) * 0.15;
          }

          // Draw node
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.fill();
        });

        // Draw connections (Web threads) between nodes - COMPLETELY BYPASSED IN PERFORMANCE MODE for absolute 60FPS fluid rendering
        if (!performanceSaverActive) {
          const maxDist = 110;
          const maxDistSq = maxDist * maxDist;
          const lineOpacityMultiplier = isDark ? 0.35 : 0.25;
          
          for (let i = 0; i < particles.length; i++) {
            const p1 = particles[i];
            for (let j = i + 1; j < particles.length; j++) {
              const p2 = particles[j];
              const dx = p1.x - p2.x;
              const dy = p1.y - p2.y;
              const distSq = dx * dx + dy * dy;

              if (distSq < maxDistSq) {
                const dist = Math.sqrt(distSq);
                const alpha = (1 - dist / maxDist) * lineOpacityMultiplier;
                ctx.strokeStyle = isDark ? `rgba(255, 255, 255, ${alpha})` : `rgba(30, 64, 175, ${alpha})`;
                ctx.lineWidth = 0.5;
                ctx.beginPath();
                ctx.moveTo(p1.x, p1.y);
                ctx.lineTo(p2.x, p2.y);
                ctx.stroke();
              }
            }
          }
        }

        // Connect nodes to mouse cursor - Throttled in performance saver mode
        if (mouseActive && mouseX !== null && mouseY !== null) {
          const mouseConnectDist = performanceSaverActive ? 120 : 175;
          const mouseConnectDistSq = mouseConnectDist * mouseConnectDist;
          
          particles.forEach(p => {
            const dx = p.x - mouseX;
            const dy = p.y - mouseY;
            const distSq = dx * dx + dy * dy;

            if (distSq < mouseConnectDistSq) {
              const dist = Math.sqrt(distSq);
              const alpha = (1 - dist / mouseConnectDist) * (isDark ? (performanceSaverActive ? 0.3 : 0.55) : 0.4);
              // Mouse shoots beautiful crimson spider silk threads
              ctx.strokeStyle = isDark ? `rgba(226, 27, 27, ${alpha})` : `rgba(30, 64, 175, ${alpha})`;
              ctx.lineWidth = performanceSaverActive ? 0.45 : 0.65;
              ctx.beginPath();
              ctx.moveTo(mouseX, mouseY);
              ctx.lineTo(p.x, p.y);
              ctx.stroke();
            }
          });
        }

        requestAnimationFrame(draw);
      };

      draw();
    }
  } catch (e) {
    console.error('Error in spider web canvas initialization:', e);
  }
};

if (document.readyState !== 'loading') {
  initApp();
} else {
  document.addEventListener('DOMContentLoaded', initApp);
}
