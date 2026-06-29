// ==========================================================================
// --- VEXORA STUDIOS: APEX CORE INTERACTIVE PROTOCOL ---
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
  
  // --- 1. HARDWARE SELECTION STATE (Simplified for standard performance) ---
  let performanceSaverActive = false;

  // --- 2. ENTRANCE TIMELINE ---
  const triggerEntranceTimeline = () => {
    // Initialize Lucide Icons immediately
    lucide.createIcons();

    if (typeof gsap === 'undefined') {
      setupScrollReveals();
      return;
    }

    const tl = gsap.timeline();

    // Header reveal
    tl.from('header', {
      y: -30,
      opacity: 0,
      duration: 0.8,
      ease: 'power3.out'
    });

    // Hero Text items Stagger reveal
    tl.from('.hero-reveal-stagger', {
      y: 40,
      opacity: 0,
      duration: 1.0,
      stagger: 0.12,
      ease: 'power3.out'
    }, '-=0.5');

    // Floating Hero Cards rotation & slide
    tl.from('#hero-card-1', {
      x: -60,
      rotation: -10,
      opacity: 0,
      duration: 1.2,
      ease: 'power3.out'
    }, '-=0.8');

    tl.from('#hero-card-2', {
      x: 60,
      rotation: 10,
      opacity: 0,
      duration: 1.2,
      ease: 'power3.out'
    }, '-=1.0');

    // Trigger scroll reveal observers on other sections
    setupScrollReveals();
  };

  // Run the entrance flow immediately on load
  triggerEntranceTimeline();

  // --- 3. CORE HIGH-PERFORMANCE PARTICLES CANVAS ENGINE ---
  const canvas = document.getElementById('ambient-canvas');
  let ctx = null;
  let particles = [];
  let connectionLinesEnabled = true;

  if (canvas) {
    ctx = canvas.getContext('2d');
    
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    window.repopulateParticles = () => {
      particles = [];
      const particleLimit = 35; // lightweight, normal, high-performance
      for (let i = 0; i < particleLimit; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.6,
          vy: (Math.random() - 0.5) * 0.6,
          radius: Math.random() * 2 + 1,
          color: Math.random() > 0.5 ? 'rgba(139, 92, 246, 0.2)' : 'rgba(217, 70, 239, 0.2)'
        });
      }
    };
    repopulateParticles();

    const drawParticles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw active floating particle clouds
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;

        // Bounce borders
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
      });

      // Interactive Web connections between close particles
      if (connectionLinesEnabled) {
        const threshold = 120;
        for (let i = 0; i < particles.length; i++) {
          const p1 = particles[i];
          for (let j = i + 1; j < particles.length; j++) {
            const p2 = particles[j];
            const dx = p1.x - p2.x;
            const dy = p1.y - p2.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < threshold) {
              const alpha = (1 - dist / threshold) * 0.12;
              ctx.strokeStyle = `rgba(139, 92, 246, ${alpha})`;
              ctx.lineWidth = 0.5;
              ctx.beginPath();
              ctx.moveTo(p1.x, p1.y);
              ctx.lineTo(p2.x, p2.y);
              ctx.stroke();
            }
          }
        }
      }

      requestAnimationFrame(drawParticles);
    };
    requestAnimationFrame(drawParticles);
  }

  // --- 7. INTERACTIVE 3D TILT EFFECT ---
  const applyTiltEffect = (element, strength = 15) => {
    if (!element) return;
    
    element.addEventListener('mousemove', (e) => {
      if (performanceSaverActive) {
        element.style.transform = 'none';
        return;
      }
      const rect = element.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const px = x / rect.width;
      const py = y / rect.height;
      
      const tiltX = (py - 0.5) * strength;
      const tiltY = (0.5 - px) * strength;
      
      element.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale(1.02)`;
    });

    element.addEventListener('mouseleave', () => {
      element.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)';
    });
  };

  const initTilts = () => {
    const cardsToTilt = document.querySelectorAll('#hero-card-1, #hero-card-2, .service-bento-card, .pricing-card');
    cardsToTilt.forEach(card => applyTiltEffect(card, 12));
  };
  initTilts();

  // --- 8. CURRENCY EXCHANGE CONTROLLER ---
  const inrToggleBtn = document.getElementById('currency-toggle-inr');
  const usdtoggleBtn = document.getElementById('currency-toggle-usd');
  const priceValues = document.querySelectorAll('.price-val');

  if (inrToggleBtn && usdtoggleBtn) {
    inrToggleBtn.addEventListener('click', () => {
      if (inrToggleBtn.classList.contains('bg-purple-600')) return;
      
      // Update state classes
      inrToggleBtn.classList.add('bg-purple-600', 'text-white');
      inrToggleBtn.classList.remove('text-zinc-400');
      usdtoggleBtn.classList.remove('bg-purple-600', 'text-white');
      usdtoggleBtn.classList.add('text-zinc-400');

      // Anim values
      priceValues.forEach(price => {
        if (typeof gsap !== 'undefined') {
          gsap.to(price, {
            opacity: 0,
            scale: 0.9,
            duration: 0.25,
            onComplete: () => {
              price.textContent = `₹${price.getAttribute('data-inr')}`;
              gsap.to(price, { opacity: 1, scale: 1, duration: 0.25 });
            }
          });
        } else {
          price.textContent = `₹${price.getAttribute('data-inr')}`;
        }
      });
    });

    usdtoggleBtn.addEventListener('click', () => {
      if (usdtoggleBtn.classList.contains('bg-purple-600')) return;
      
      usdtoggleBtn.classList.add('bg-purple-600', 'text-white');
      usdtoggleBtn.classList.remove('text-zinc-400');
      inrToggleBtn.classList.remove('bg-purple-600', 'text-white');
      inrToggleBtn.classList.add('text-zinc-400');

      priceValues.forEach(price => {
        if (typeof gsap !== 'undefined') {
          gsap.to(price, {
            opacity: 0,
            scale: 0.9,
            duration: 0.25,
            onComplete: () => {
              price.textContent = `$${price.getAttribute('data-usd')}`;
              gsap.to(price, { opacity: 1, scale: 1, duration: 0.25 });
            }
          });
        } else {
          price.textContent = `$${price.getAttribute('data-usd')}`;
        }
      });
    });
  }

  // --- 9. ACCORDION FAQ INTELLIGENT ROUTER ---
  const accordionItems = document.querySelectorAll('.faq-accordion-item');

  accordionItems.forEach(item => {
    const trigger = item.querySelector('button');
    const content = item.querySelector('.faq-content');

    if (trigger && content) {
      trigger.addEventListener('click', () => {
        const isActive = item.classList.contains('active');

        // Close all other items
        accordionItems.forEach(otherItem => {
          if (otherItem !== item) {
            otherItem.classList.remove('active');
            const otherContent = otherItem.querySelector('.faq-content');
            if (otherContent) {
              if (typeof gsap !== 'undefined') {
                gsap.to(otherContent, { height: 0, duration: 0.35, ease: 'power3.inOut' });
              } else {
                otherContent.style.height = '0';
              }
            }
          }
        });

        // Toggle selected item
        if (isActive) {
          item.classList.remove('active');
          if (typeof gsap !== 'undefined') {
            gsap.to(content, { height: 0, duration: 0.35, ease: 'power3.inOut' });
          } else {
            content.style.height = '0';
          }
        } else {
          item.classList.add('active');
          const finalHeight = content.scrollHeight;
          if (typeof gsap !== 'undefined') {
            gsap.to(content, { height: finalHeight, duration: 0.45, ease: 'power3.out' });
          } else {
            content.style.height = `${finalHeight}px`;
          }
        }
      });
    }
  });

  // --- 10. LUXURY MOBILE HAMBURGER MENU INTERACTION ---
  const mobileBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  let mobileMenuOpen = false;

  if (mobileBtn && mobileMenu) {
    mobileBtn.addEventListener('click', () => {
      mobileMenuOpen = !mobileMenuOpen;
      
      if (mobileMenuOpen) {
        mobileMenu.style.transform = 'translateX(0)';
        mobileBtn.innerHTML = '<i data-lucide="x" class="w-4 h-4"></i>';
      } else {
        mobileMenu.style.transform = 'translateX(100%)';
        mobileBtn.innerHTML = '<i data-lucide="menu" class="w-4 h-4"></i>';
      }
      lucide.createIcons(); // recreate Lucide icons for the button flip
    });

    // Close mobile menu on clicking any navigation link
    const mobileLinks = mobileMenu.querySelectorAll('.mobile-nav-link');
    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileMenuOpen = false;
        mobileMenu.style.transform = 'translateX(100%)';
        mobileBtn.innerHTML = '<i data-lucide="menu" class="w-4 h-4"></i>';
        lucide.createIcons();
      });
    });
  }

  // --- 11. LUXURY GLASS BRIEFING FORM VALIDATOR & SUBMISSION ---
  const contactForm = document.getElementById('contact-form');
  const successOverlay = document.getElementById('form-success-overlay');
  const successCloseBtn = document.getElementById('form-success-close');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Luxury animation fade in for confirmation portal
      if (successOverlay) {
        successOverlay.style.transform = 'scale(1)';
        
        // Stagger visual confirmation elements inside overlay
        if (typeof gsap !== 'undefined') {
          gsap.from(successOverlay.children, {
            opacity: 0,
            y: 30,
            duration: 0.7,
            stagger: 0.15,
            ease: 'power3.out'
          });
        }
      }
    });

    if (successCloseBtn && successOverlay) {
      successCloseBtn.addEventListener('click', () => {
        successOverlay.style.transform = 'scale(0)';
        contactForm.reset();
      });
    }
  }

  // --- 12. IMMERSIVE SCROLL-TRIGGERED REVEALS (GSAP INTERSECT OBSERVERS) ---
  const setupScrollReveals = () => {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    // Register ScrollTrigger
    gsap.registerPlugin(ScrollTrigger);

    // Stagger reveal service bento-cards on scroll
    gsap.from('.service-bento-card', {
      scrollTrigger: {
        trigger: '#services',
        start: 'top 75%',
        toggleActions: 'play none none none'
      },
      y: 60,
      opacity: 0,
      duration: 1.0,
      stagger: 0.12,
      ease: 'power3.out'
    });

    // Stagger reveal portfolio assets
    gsap.from('#portfolio .group', {
      scrollTrigger: {
        trigger: '#portfolio',
        start: 'top 75%',
        toggleActions: 'play none none none'
      },
      scale: 0.95,
      y: 80,
      opacity: 0,
      duration: 1.2,
      stagger: 0.18,
      ease: 'power3.out'
    });

    // Stagger reveal pricing cards
    gsap.from('.pricing-card', {
      scrollTrigger: {
        trigger: '#pricing',
        start: 'top 75%',
        toggleActions: 'play none none none'
      },
      y: 50,
      opacity: 0,
      duration: 1.0,
      stagger: 0.12,
      ease: 'power3.out'
    });

    // Active link navbar highlight based on ScrollTrigger
    const sections = document.querySelectorAll('section');
    sections.forEach(sec => {
      const sectionId = sec.getAttribute('id');
      ScrollTrigger.create({
        trigger: sec,
        start: 'top 35%',
        end: 'bottom 35%',
        onEnter: () => activateNavHighlight(sectionId),
        onEnterBack: () => activateNavHighlight(sectionId)
      });
    });

    const activateNavHighlight = (id) => {
      const links = document.querySelectorAll('.nav-link');
      links.forEach(l => {
        l.classList.remove('active', 'text-white');
        l.classList.add('text-zinc-400');
        if (l.getAttribute('href') === `#${id}`) {
          l.classList.add('active', 'text-white');
          l.classList.remove('text-zinc-400');
        }
      });
    };
  };

});
