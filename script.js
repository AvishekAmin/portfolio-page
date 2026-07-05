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
let animationId;

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

class Particle {
    constructor() {
        this.reset();
    }

    reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 0.5;
        this.speedX = (Math.random() - 0.5) * 0.4;
        this.speedY = (Math.random() - 0.5) * 0.4;
        this.opacity = Math.random() * 0.5 + 0.1;
        this.color = Math.random() > 0.7 ? '139, 92, 246' : '6, 182, 212';
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        // Mouse attraction
        const dx = mouseX - this.x;
        const dy = mouseY - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 200) {
            this.x += dx * 0.001;
            this.y += dy * 0.001;
        }

        if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
            this.reset();
        }
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${this.color}, ${this.opacity})`;
        ctx.fill();
    }
}

function initParticles() {
    particles = [];
    const count = Math.min(80, Math.floor((canvas.width * canvas.height) / 15000));
    for (let i = 0; i < count; i++) {
        particles.push(new Particle());
    }
}

function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < 120) {
                const opacity = (1 - dist / 120) * 0.15;
                ctx.beginPath();
                ctx.strokeStyle = `rgba(6, 182, 212, ${opacity})`;
                ctx.lineWidth = 0.5;
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
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

