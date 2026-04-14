// Wait for DOM content to load
document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. Navigation & Hamburger Menu ---
    const navbar = document.getElementById('navbar');
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const links = document.querySelectorAll('.nav-links a');

    if (hamburger && navbar) {
        hamburger.addEventListener('click', () => {
            navbar.classList.toggle('nav-active');
        });
    }

    // Close menu when a link is clicked
    links.forEach(link => {
        link.addEventListener('click', () => {
            if (navbar) navbar.classList.remove('nav-active');
        });
    });

    // --- 2. Custom Cursor Parallax & Hover — desktop only ---
    const cursorDot = document.getElementById('cursor-dot');
    const isTouchDevice = window.matchMedia('(hover: none)').matches;

    if (!isTouchDevice && cursorDot) {
        const interactables = document.querySelectorAll('a, .hamburger, .btn, .social-links a');
        document.addEventListener('mousemove', (e) => {
            cursorDot.style.transform = `translate(${e.clientX - 4}px, ${e.clientY - 4}px)`;
        });
        interactables.forEach(item => {
            item.addEventListener('mouseenter', () => cursorDot.classList.add('cursor-hover'));
            item.addEventListener('mouseleave', () => cursorDot.classList.remove('cursor-hover'));
        });
    }

    // --- 2. Navbar Scroll Effect ---
    window.addEventListener('scroll', () => {
        if (navbar) {
            const scrollY = window.scrollY;
            if (scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }

            // Liquid glass depth — intensify blur and shrink pill as user scrolls
            const progress = Math.min(scrollY / 300, 1);
            const blurVal = 20 + progress * 20;
            const bgAlpha = 0.06 + progress * 0.3;
            navbar.style.backdropFilter = `blur(${blurVal}px) saturate(180%)`;
            navbar.style.webkitBackdropFilter = `blur(${blurVal}px) saturate(180%)`;
            navbar.style.background = `rgba(13, 13, 13, ${bgAlpha})`;
        }
    });

    // --- 3. Typewriter Effect ---
    const roles = ["Frontend Developer", "UI Engineer", "React Specialist"];
    const typeWriterElement = document.getElementById('typewriter');
    
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typeSpeed = 100;

    function typeEffect() {
        if (!typeWriterElement) return;

        const currentRole = roles[roleIndex];
        
        if (isDeleting) {
            typeWriterElement.textContent = currentRole.substring(0, charIndex - 1);
            charIndex--;
            typeSpeed = 50; // Quicker deleting
        } else {
            typeWriterElement.textContent = currentRole.substring(0, charIndex + 1);
            charIndex++;
            typeSpeed = 100; // Normal typing
        }

        if (!isDeleting && charIndex === currentRole.length) {
            typeSpeed = 2000; // Pause at end of word
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
            typeSpeed = 500; // Pause before new word
        }
        
        setTimeout(typeEffect, typeSpeed);
    }

    // --- 4. Initialization — load Spline only on desktop ---
    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    const isTouchDevice = ('ontouchstart' in window) || navigator.maxTouchPoints > 0;
    let animationsStarted = false;

    function initAnimations() {
        if (animationsStarted) return;
        animationsStarted = true;

        setTimeout(typeEffect, 2000);

        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

        if (!isMobile) {
            tl.to('.spline-container', { opacity: 1, scale: 1, duration: 2.0, ease: "power2.out" })
        } else {
            // On mobile skip spline wait, just animate content immediately
            gsap.set('.spline-container', { opacity: 0, display: 'none' });
        }

        tl.fromTo('.availability', { x: -50, opacity: 0 }, { x: 0, opacity: 1, duration: 0.8 }, isMobile ? 0 : "-=0.5")
          .fromTo('.dev-name',     { x: -50, opacity: 0 }, { x: 0, opacity: 1, duration: 0.8 }, "-=0.6")
          .fromTo('.role-container',{ x: -50, opacity: 0 }, { x: 0, opacity: 1, duration: 0.8 }, "-=0.6")
          .fromTo('.bio',          { x: -50, opacity: 0 }, { x: 0, opacity: 1, duration: 0.8 }, "-=0.6")
          .fromTo('.cta-group',    { x: -50, opacity: 0 }, { x: 0, opacity: 1, duration: 0.8 }, "-=0.6")
          .fromTo('.social-links', { x: -50, opacity: 0 }, { x: 0, opacity: 1, duration: 0.8 }, "-=0.6")
          .fromTo('.navbar',       { y: -30, opacity: 0 }, { y: 0, opacity: 1, duration: 1 },   "-=0.4");
    }

    if (!isMobile) {
        // Inject spline viewer dynamically — desktop only
        const splineContainer = document.getElementById('splineContainer');
        if (splineContainer) {
            const script = document.createElement('script');
            script.type = 'module';
            script.src = 'https://unpkg.com/@splinetool/viewer@1.9.72/build/spline-viewer.js';
            document.head.appendChild(script);
            const viewer = document.createElement('spline-viewer');
            viewer.setAttribute('url', 'https://prod.spline.design/iEjnsDRqXnQW59o4/scene.splinecode');
            splineContainer.appendChild(viewer);
            viewer.addEventListener('load', () => {
                // Hide the "Built with Spline" watermark
                if (viewer.shadowRoot) {
                    const style = document.createElement('style');
                    style.textContent = '#logo { display: none !important; } [class*="watermark"] { display: none !important; }';
                    viewer.shadowRoot.appendChild(style);
                }
                initAnimations();
            });
            setTimeout(initAnimations, 5000);
        }

        // Inject projects spline
        const projectsSpline = document.getElementById('projectsSpline');
        if (projectsSpline) {
            const viewer2 = document.createElement('spline-viewer');
            viewer2.setAttribute('url', 'https://prod.spline.design/J5C7khW36Z7nq6Wv/scene.splinecode');
            projectsSpline.appendChild(viewer2);
            viewer2.addEventListener('load', () => {
                if (viewer2.shadowRoot) {
                    const style = document.createElement('style');
                    style.textContent = '#logo { display: none !important; } [class*="watermark"] { display: none !important; }';
                    viewer2.shadowRoot.appendChild(style);
                }
            });
        }
    } else {
        // Mobile: skip spline entirely, animate immediately
        initAnimations();
    }

    // --- 5. Active nav link on scroll ---
    const sections = ['home', 'about', 'projects', 'contact'];
    const navAnchors = document.querySelectorAll('.nav-links a');

    function setActiveNav(id) {
        navAnchors.forEach(a => {
            a.classList.toggle('active', a.getAttribute('href') === `#${id}`);
        });
    }

    sections.forEach(id => {
        const el = document.getElementById(id);
        if (!el) return;
        ScrollTrigger.create({
            trigger: el,
            start: 'top 60%',
            end: 'bottom 40%',
            onEnter: () => setActiveNav(id),
            onEnterBack: () => setActiveNav(id),
        });
    });

    // --- 6. About Section Scroll Transition ---
    gsap.registerPlugin(ScrollTrigger);

    // As user scrolls into about section: spline zooms in and slides left (desktop only)
    ScrollTrigger.matchMedia({
        '(min-width: 769px)': function() {
            gsap.to('.spline-container', {
                scale: 1.06,
                x: '-55%',
                scaleX: -1.06,
                ease: 'none',
                scrollTrigger: {
                    trigger: '.about',
                    start: 'top bottom',
                    end: 'top top',
                    scrub: 1.2,
                }
            });
        },
        '(max-width: 768px)': function() {
            // Reset any transforms on mobile so spline stays put
            gsap.set('.spline-container', { x: 0, scaleX: 1, scale: 1 });
        }
    });

    // Hide hero spline when projects section enters — desktop only
    if (!isTouchDevice) {
        ScrollTrigger.create({
            trigger: '.projects',
            start: 'top bottom',
            onEnter: () => gsap.to('.spline-container', { opacity: 0, duration: 0.4, ease: 'power2.out' }),
            onLeaveBack: () => gsap.to('.spline-container', { opacity: 1, duration: 0.4, ease: 'power2.out' }),
        });
    }

    // Sequence: about fully out → projects spline fades in → then content animates in
    const projectsSection = document.querySelector('.projects');

    // Set all projects content invisible initially
    gsap.set(['.projects-header > *', '.slider-wrapper', '.slider-controls'], { opacity: 0, y: 40 });

    ScrollTrigger.create({
        trigger: '.about',
        start: 'bottom 20%',
        end: 'max',
        onEnter: () => projectsSection.classList.add('spline-visible'),
        onLeaveBack: () => projectsSection.classList.remove('spline-visible'),
    });

    // Animate projects content in once spline is visible
    ScrollTrigger.create({
        trigger: '.projects',
        start: 'top 60%',
        once: true,
        onEnter: () => {
            gsap.timeline({ delay: 0.7 })
                .to('.projects-header > *', {
                    opacity: 1, y: 0, duration: 0.6, stagger: 0.15, ease: 'back.out(1.4)'
                })
                .to('.slider-wrapper', {
                    opacity: 1, y: 0, duration: 0.8, ease: 'power3.out'
                }, '-=0.2')
                .to('.slider-controls', {
                    opacity: 1, y: 0, duration: 0.5, ease: 'power2.out'
                }, '-=0.4');
        }
    });

    // About text staggers in from the right
    gsap.fromTo('.about-right > *',
        { y: 30, opacity: 0, scale: 0.95 },
        {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.7,
            stagger: 0.12,
            ease: 'back.out(1.4)',
            scrollTrigger: {
                trigger: '.about',
                start: 'top 70%',
                toggleActions: 'play none none reverse'
            }
        }
    );

    // --- 6. Projects Slider — continuous infinite scroll ---
    const track = document.getElementById('sliderTrack');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const dotsContainer = document.getElementById('sliderDots');
    const realCards = Array.from(document.querySelectorAll('.project-card'));
    const total = realCards.length;

    // Fill track with enough clones to always cover the viewport (5 full sets)
    for (let i = 0; i < 4; i++) {
        realCards.forEach(c => track.appendChild(c.cloneNode(true)));
    }

    // Build dots
    realCards.forEach((_, i) => {
        const dot = document.createElement('button');
        dot.classList.add('slider-dot');
        dot.setAttribute('aria-label', `Go to project ${i + 1}`);
        dot.addEventListener('click', () => nudgeTo(i));
        dotsContainer.appendChild(dot);
    });
    const dots = Array.from(document.querySelectorAll('.slider-dot'));

    function getCardWidth() {
        const c = track.querySelector('.project-card');
        return c ? c.offsetWidth + 24 : 408;
    }

    // Continuous scroll state
    let xPos = 0;           // current x position (px, negative = moved right)
    let velocity = 0;       // px/frame — positive = moving left (forward)
    let baseSpeed = 0.6;    // auto-scroll speed px/frame
    let raf = null;
    let isDragging = false;
    let dragStartX = 0;
    let dragStartPos = 0;

    const setX = (x) => {
        // Seamless loop: when we've scrolled one full set of real cards, reset
        const loopWidth = getCardWidth() * total;
        if (x < -loopWidth * 3) x += loopWidth;
        if (x > -loopWidth) x -= loopWidth;
        xPos = x;
        gsap.set(track, { x: xPos });
    };

    // Start position: begin at second set so there's room to go backwards
    setX(-(getCardWidth() * total));

    function updateDots() {
        const cw = getCardWidth();
        const viewCenter = track.parentElement.offsetWidth / 2;
        const absX = Math.abs(xPos);
        const loopWidth = cw * total;
        const normalised = ((absX % loopWidth) + loopWidth) % loopWidth;
        const idx = Math.round(normalised / cw) % total;
        dots.forEach((d, i) => d.classList.toggle('active', i === idx));

        // 3D curve per card
        const allC = Array.from(track.querySelectorAll('.project-card'));
        allC.forEach(card => {
            const rect = card.getBoundingClientRect();
            const cardCenter = rect.left + rect.width / 2;
            const offset = (cardCenter - viewCenter) / cw;
            const absOff = Math.abs(offset);
            const rotateY = offset * -18;
            const scale = Math.max(0.78, 1 - absOff * 0.07);
            const opacity = Math.max(0.22, 1 - absOff * 0.2);
            const isActive = absOff < 0.6;
            card.classList.toggle('active', isActive);
            card.style.zIndex = Math.max(0, Math.round(10 - absOff * 2));
            gsap.set(card, { rotateY, scale, opacity, z: isActive ? 60 : -absOff * 30 });
        });
    }

    function tick() {
        velocity += (baseSpeed - velocity) * 0.04; // ease toward base speed
        setX(xPos - velocity);
        updateDots();
        raf = requestAnimationFrame(tick);
    }

    raf = requestAnimationFrame(tick);

    // Pause auto-scroll when not in view
    const observer = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                if (!raf) raf = requestAnimationFrame(tick);
            } else {
                cancelAnimationFrame(raf);
                raf = null;
            }
        });
    }, { threshold: 0.1 });
    observer.observe(document.getElementById('projects'));

    // Arrow buttons — nudge velocity
    prevBtn.addEventListener('click', () => { velocity = -8; baseSpeed = 0.6; });
    nextBtn.addEventListener('click', () => { velocity = 8; baseSpeed = 0.6; });

    function nudgeTo(targetIdx) {
        const cw = getCardWidth();
        const loopWidth = cw * total;
        const absX = Math.abs(xPos);
        const normalised = ((absX % loopWidth) + loopWidth) % loopWidth;
        const currentIdx = Math.round(normalised / cw) % total;
        let delta = targetIdx - currentIdx;
        if (delta > total / 2) delta -= total;
        if (delta < -total / 2) delta += total;
        const target = xPos - delta * cw;
        gsap.to({ val: xPos }, {
            val: target,
            duration: 0.7,
            ease: 'power3.out',
            onUpdate: function() { setX(this.targets()[0].val); updateDots(); }
        });
    }

    // Mouse drag
    track.addEventListener('mousedown', e => {
        isDragging = true;
        dragStartX = e.clientX;
        dragStartPos = xPos;
        velocity = 0;
        track.style.cursor = 'grabbing';
    });
    window.addEventListener('mousemove', e => {
        if (!isDragging) return;
        const dx = e.clientX - dragStartX;
        setX(dragStartPos + dx);
        updateDots();
    });
    window.addEventListener('mouseup', e => {
        if (!isDragging) return;
        isDragging = false;
        track.style.cursor = '';
        const dx = e.clientX - dragStartX;
        velocity = -dx * 0.12;
    });

    // Touch swipe
    let touchStartX = 0, touchLastX = 0;
    track.addEventListener('touchstart', e => {
        touchStartX = touchLastX = e.touches[0].clientX;
        velocity = 0;
    }, { passive: true });
    track.addEventListener('touchmove', e => {
        const dx = e.touches[0].clientX - touchLastX;
        setX(xPos + dx);
        touchLastX = e.touches[0].clientX;
        updateDots();
    }, { passive: true });
    track.addEventListener('touchend', e => {
        const dx = e.changedTouches[0].clientX - touchStartX;
        velocity = -dx * 0.1;
    });

    // Trackpad two-finger scroll
    const sliderWrapper = document.querySelector('.slider-wrapper');
    sliderWrapper.addEventListener('wheel', e => {
        if (Math.abs(e.deltaX) < Math.abs(e.deltaY)) return;
        e.preventDefault();
        velocity = e.deltaX * 0.3;
    }, { passive: false });

    // Keyboard
    document.addEventListener('keydown', e => {
        const rect = document.getElementById('projects').getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
            if (e.key === 'ArrowLeft') velocity = -6;
            if (e.key === 'ArrowRight') velocity = 6;
        }
    });

    // Recenter on resize
    window.addEventListener('resize', () => updateDots());

    // --- Hire Me button ---
    const hireBtn = document.getElementById('hireBtn');
    const toast = document.getElementById('toast');
    const toastClose = document.getElementById('toastClose');
    let toastTimer = null;

    function showToast() {
        toast.classList.add('show');
        clearTimeout(toastTimer);
        toastTimer = setTimeout(() => toast.classList.remove('show'), 4000);
    }

    if (hireBtn) {
        hireBtn.addEventListener('click', (e) => {
            e.preventDefault();
            // Trigger CV download
            const link = document.createElement('a');
            link.href = 'Chinedu_CV.docx';
            link.download = 'Chinedu_CV.docx';
            link.click();
            // Show toast
            showToast();
            // Scroll to contact
            setTimeout(() => {
                document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
            }, 300);
        });
    }

    if (toastClose) {
        toastClose.addEventListener('click', () => {
            toast.classList.remove('show');
            clearTimeout(toastTimer);
        });
    }

    // --- Contact form ---
    const contactForm = document.getElementById('contactForm');
    const formSuccess = document.getElementById('formSuccess');

    if (contactForm) {
        contactForm.addEventListener('submit', e => {
            e.preventDefault();
            const submitBtn = contactForm.querySelector('.contact-submit');
            submitBtn.disabled = true;
            submitBtn.querySelector('.submit-text').textContent = 'Sending...';

            // Simulate send (replace with real endpoint)
            setTimeout(() => {
                contactForm.reset();
                submitBtn.disabled = false;
                submitBtn.querySelector('.submit-text').textContent = 'Send Message';
                formSuccess.classList.add('visible');
                setTimeout(() => formSuccess.classList.remove('visible'), 4000);
            }, 1200);
        });
    }

    // Contact scroll animation
    gsap.fromTo('.contact-left > *',
        { x: -40, opacity: 0 },
        {
            x: 0, opacity: 1, duration: 0.7, stagger: 0.12, ease: 'power3.out',
            scrollTrigger: { trigger: '.contact', start: 'top 70%', toggleActions: 'play none none reverse' }
        }
    );

    gsap.fromTo('.contact-right',
        { x: 40, opacity: 0 },
        {
            x: 0, opacity: 1, duration: 0.8, ease: 'power3.out',
            scrollTrigger: { trigger: '.contact', start: 'top 70%', toggleActions: 'play none none reverse' }
        }
    );

    // Stat cards wave in
    gsap.fromTo('.stat-card',
        { y: 20, opacity: 0 },
        {
            y: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: 'power2.out',
            scrollTrigger: {
                trigger: '.about',
                start: 'top 40%',
                toggleActions: 'play none none reverse'
            }
        }
    );

    // Skill tags wave in
    gsap.fromTo('.skill-tag',
        { y: 20, opacity: 0 },
        {
            y: 0, opacity: 1, duration: 0.5, stagger: 0.07, ease: 'power2.out',
            scrollTrigger: {
                trigger: '.about',
                start: 'top 40%',
                toggleActions: 'play none none reverse'
            }
        }
    );

});
