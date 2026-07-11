/* =============================================
   AVISHEK AMIN - Portfolio JavaScript
   Premium Interactions & Animations
============================================= */

// =========================================
// Particle Background System
// =========================================
const canvas = document.getElementById('particle-canvas');
const ctx = canvas.getContext('2d');

let particles = [];
let mouseX = 0;
let mouseY = 0;
let documentHeight = 0;
let animationId;

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    documentHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
}

class Particle {
    constructor() {
        this.reset();
    }

    reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * documentHeight;
        this.baseSize = Math.random() * 2.2 + 0.5;
        this.size = this.baseSize;
        this.speedX = (Math.random() - 0.5) * 0.4;
        this.speedY = (Math.random() - 0.5) * 0.4;
        this.opacity = Math.random() * 0.5 + 0.15;

        // Richer color palette
        const colorRoll = Math.random();
        if (colorRoll > 0.7) {
            this.color = '139, 92, 246';      // purple
            this.glowColor = 'rgba(139, 92, 246,';
        } else if (colorRoll > 0.45) {
            this.color = '6, 182, 212';        // cyan
            this.glowColor = 'rgba(6, 182, 212,';
        } else if (colorRoll > 0.25) {
            this.color = '236, 72, 153';       // pink
            this.glowColor = 'rgba(236, 72, 153,';
        } else {
            this.color = '16, 185, 129';       // emerald
            this.glowColor = 'rgba(16, 185, 129,';
        }

        // Pulsation phase
        this.pulseSpeed = Math.random() * 0.015 + 0.005;
        this.pulsePhase = Math.random() * Math.PI * 2;

        // Some particles are "star" particles with extra glow
        this.isStar = Math.random() > 0.85;
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        // Gentle size pulsation
        this.pulsePhase += this.pulseSpeed;
        this.size = this.baseSize + Math.sin(this.pulsePhase) * 0.3;

        // Mouse attraction in world coordinates
        const worldMouseY = mouseY + window.scrollY;
        const dx = mouseX - this.x;
        const dy = worldMouseY - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 200) {
            this.x += dx * 0.001;
            this.y += dy * 0.001;
        }

        if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > documentHeight) {
            this.reset();
        }
    }

    draw() {
        const screenY = this.y - window.scrollY;
        // Only draw if within viewport + safety buffer
        if (screenY >= -10 && screenY <= canvas.height + 10) {
            // Draw soft glow halo for star particles
            if (this.isStar) {
                ctx.beginPath();
                ctx.arc(this.x, screenY, this.size * 4, 0, Math.PI * 2);
                ctx.fillStyle = `${this.glowColor} ${this.opacity * 0.08})`;
                ctx.fill();
            }

            // Main particle dot
            ctx.beginPath();
            ctx.arc(this.x, screenY, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${this.color}, ${this.opacity})`;
            ctx.fill();
        }
    }
}

function initParticles() {
    const baseCount = Math.min(80, Math.floor((canvas.width * canvas.height) / 15000));
    const densityRatio = documentHeight / Math.max(1, canvas.height);
    const targetCount = Math.min(350, Math.floor(baseCount * densityRatio));

    if (particles.length === 0) {
        for (let i = 0; i < targetCount; i++) {
            particles.push(new Particle());
        }
    } else {
        if (particles.length < targetCount) {
            const diff = targetCount - particles.length;
            for (let i = 0; i < diff; i++) {
                particles.push(new Particle());
            }
        } else if (particles.length > targetCount) {
            particles.length = targetCount;
        }

        // Keep all particles within the current bounds
        particles.forEach(p => {
            if (p.x > canvas.width) p.x = Math.random() * canvas.width;
            if (p.y > documentHeight) p.y = Math.random() * documentHeight;
        });
    }
}

function drawConnections() {
    const viewportHeight = canvas.height;
    const activeParticles = [];
    
    // Filter active particles that are inside or near the viewport
    for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        const screenY = p.y - window.scrollY;
        if (screenY >= -120 && screenY <= viewportHeight + 120) {
            activeParticles.push({
                particle: p,
                screenY: screenY
            });
        }
    }

    // Compare only active particles to optimize calculations
    for (let i = 0; i < activeParticles.length; i++) {
        const ap1 = activeParticles[i];
        const p1 = ap1.particle;
        const y1 = ap1.screenY;

        for (let j = i + 1; j < activeParticles.length; j++) {
            const ap2 = activeParticles[j];
            const p2 = ap2.particle;
            const y2 = ap2.screenY;

            const dx = p1.x - p2.x;
            const dy = y1 - y2;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < 120) {
                const opacity = (1 - dist / 120) * 0.15;
                // Gradient line using the colors of both particles
                const gradient = ctx.createLinearGradient(p1.x, y1, p2.x, y2);
                gradient.addColorStop(0, `rgba(${p1.color}, ${opacity})`);
                gradient.addColorStop(1, `rgba(${p2.color}, ${opacity})`);
                ctx.beginPath();
                ctx.strokeStyle = gradient;
                ctx.lineWidth = 0.5;
                ctx.moveTo(p1.x, y1);
                ctx.lineTo(p2.x, y2);
                ctx.stroke();
            }
        }
    }
}

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach(p => {
        p.update();
        p.draw();
    });

    drawConnections();
    animationId = requestAnimationFrame(animateParticles);
}

// Init particles
resizeCanvas();
initParticles();
animateParticles();

window.addEventListener('resize', () => {
    resizeCanvas();
    initParticles();
});

window.addEventListener('load', () => {
    resizeCanvas();
    initParticles();
});

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

// =========================================
// Cursor Glow Effect
// =========================================
const cursorGlow = document.getElementById('cursor-glow');

document.addEventListener('mousemove', (e) => {
    cursorGlow.style.left = e.clientX + 'px';
    cursorGlow.style.top = e.clientY + 'px';
});

// =========================================
// Typewriter Effect
// =========================================
const typewriterEl = document.getElementById('typewriter');
const roles = [
    'MERN Stack Developer',
    'Competitive Programmer',
    'Cloud & DevOps Explorer'
];

let roleIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typeSpeed = 80;

function typeWriter() {
    const currentRole = roles[roleIndex];

    if (isDeleting) {
        typewriterEl.textContent = currentRole.substring(0, charIndex - 1);
        charIndex--;
        typeSpeed = 40;
    } else {
        typewriterEl.textContent = currentRole.substring(0, charIndex + 1);
        charIndex++;
        typeSpeed = 80;
    }

    if (!isDeleting && charIndex === currentRole.length) {
        typeSpeed = 2000;
        isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        typeSpeed = 400;
    }

    setTimeout(typeWriter, typeSpeed);
}

// Start typewriter on load
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(typeWriter, 800);
});

// =========================================
// Scroll Progress Bar
// =========================================
const scrollProgress = document.getElementById('scroll-progress');

function updateScrollProgress() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = (scrollTop / docHeight) * 100;
    scrollProgress.style.width = progress + '%';
}

// =========================================
// Sticky Navbar & Active Menu
// =========================================
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('header nav a');
const header = document.querySelector('#header');
const menuIcon = document.querySelector('#menu-icon');
const navbar = document.querySelector('#navbar');

function handleScroll() {
    const scrollTop = window.scrollY;

    // Active Link Highlighting
    sections.forEach(sec => {
        const offset = sec.offsetTop - 200;
        const height = sec.offsetHeight;
        const id = sec.getAttribute('id');

        if (scrollTop >= offset && scrollTop < offset + height) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                const target = document.querySelector(`header nav a[href*=${id}]`);
                if (target) target.classList.add('active');
            });
        }
    });

    // Sticky Navbar
    header.classList.toggle('sticky', scrollTop > 80);

    // Close mobile menu on scroll
    menuIcon.classList.remove('bx-x');
    navbar.classList.remove('active');
}

window.addEventListener('scroll', () => {
    handleScroll();
    updateScrollProgress();
});

// =========================================
// Mobile Menu Toggle
// =========================================
menuIcon.addEventListener('click', () => {
    menuIcon.classList.toggle('bx-x');
    navbar.classList.toggle('active');
});

// Close menu when clicking a nav link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        menuIcon.classList.remove('bx-x');
        navbar.classList.remove('active');
    });
});

// =========================================
// Dark/Light Mode Toggle
// =========================================
const themeIcon = document.querySelector('#theme-icon');

// Check saved preference
let darkMode = localStorage.getItem('darkMode');

if (darkMode === 'disabled') {
    document.body.classList.add('light-mode');
    themeIcon.classList.replace('bx-sun', 'bx-moon');
}

themeIcon.addEventListener('click', () => {
    document.body.classList.toggle('light-mode');
    themeIcon.classList.toggle('bx-moon');
    themeIcon.classList.toggle('bx-sun');

    if (document.body.classList.contains('light-mode')) {
        localStorage.setItem('darkMode', 'disabled');
    } else {
        localStorage.setItem('darkMode', 'enabled');
    }
});

// =========================================
// Scroll Reveal Animations (Intersection Observer)
// =========================================
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('show');
            // One-time reveal — don't re-animate on scroll back
            revealObserver.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.12,
    rootMargin: '0px 0px -60px 0px'
});

function observeRevealElements() {
    document.querySelectorAll('.reveal-element').forEach(el => {
        // Calculate sibling index so stagger delay is set directly,
        // not via CSS nth-child which can conflict with hover transitions
        const siblings = Array.from(el.parentElement.children).filter(
            c => c.classList.contains('reveal-element')
        );
        const idx = siblings.indexOf(el);
        if (idx > 0) {
            el.style.animationDelay = (idx * 0.1) + 's';
        }
        revealObserver.observe(el);
    });
}

document.addEventListener('DOMContentLoaded', observeRevealElements);

// =========================================
// Scroll to Top Button
// =========================================
const scrollTopBtn = document.getElementById('scroll-top-btn');

window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
        scrollTopBtn.classList.add('active');
        scrollTopBtn.classList.remove('hidden');
    } else {
        scrollTopBtn.classList.remove('active');
        scrollTopBtn.classList.add('hidden');
    }
});

scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// =========================================
// Smooth Scroll for all anchor links
// =========================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;

        e.preventDefault();
        const targetEl = document.querySelector(targetId);
        if (targetEl) {
            targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// (Tilt effect removed — pure CSS hover handles all card interactions)

// =========================================
// Counter Animation for Stats (if added)
// =========================================
function animateCounter(el, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);

    function update() {
        start += increment;
        if (start >= target) {
            el.textContent = target;
            return;
        }
        el.textContent = Math.floor(start);
        requestAnimationFrame(update);
    }

    update();
}

// =========================================
// Contact Form Mailto Dynamic Builder
// =========================================
const sendMsgBtn = document.getElementById('send-msg-btn');
if (sendMsgBtn) {
    sendMsgBtn.addEventListener('click', function (e) {
        const name = document.getElementById('contact-name').value;
        const email = document.getElementById('contact-email').value;
        const message = document.getElementById('contact-message').value;
        
        let mailto = "mailto:avishekamin207@gmail.com";
        if (name || email || message) {
            const subject = encodeURIComponent(`Portfolio Message from ${name || 'Visitor'}`);
            const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`);
            mailto += `?subject=${subject}&body=${body}`;
        }
        sendMsgBtn.setAttribute('href', mailto);
    });
}

