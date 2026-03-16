/* ─── CURSOR ─── */
const cursor = document.getElementById('cursor');
const ring = document.getElementById('cursorRing');
let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;

document.addEventListener('mousemove', e => {
    mouseX = e.clientX; mouseY = e.clientY;
    cursor.style.left = mouseX + 'px';
    cursor.style.top = mouseY + 'px';
});

function animateRing() {
    ringX += (mouseX - ringX) * 0.12;
    ringY += (mouseY - ringY) * 0.12;
    ring.style.left = ringX + 'px';
    ring.style.top = ringY + 'px';
    requestAnimationFrame(animateRing);
}
animateRing();

document.querySelectorAll('a, button').forEach(el => {
    el.addEventListener('mouseenter', () => {
        cursor.style.transform = 'translate(-50%,-50%) scale(2)';
        ring.style.transform = 'translate(-50%,-50%) scale(1.5)';
    });
    el.addEventListener('mouseleave', () => {
        cursor.style.transform = 'translate(-50%,-50%) scale(1)';
        ring.style.transform = 'translate(-50%,-50%) scale(1)';
    });
});

/* ─── HEADER SCROLL ─── */
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 60);
});

/* ─── PARALLAX HERO ─── */
const heroBg = document.getElementById('heroBg');
window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    if (scrollY < window.innerHeight) {
        heroBg.style.transform = `scale(1.08) translateY(${scrollY * 0.35}px)`;
    }
}, { passive: true });

/* ─── MOBILE NAV ─── */
const navToggle = document.getElementById('navToggle');
const navOverlay = document.getElementById('navOverlay');

navToggle.addEventListener('click', () => {
    const isOpen = navOverlay.classList.toggle('open');
    navToggle.classList.toggle('open', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
});

function closeNav() {
    navOverlay.classList.remove('open');
    navToggle.classList.remove('open');
    document.body.style.overflow = '';
}

/* ─── SCROLL REVEAL ─── */
const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
revealEls.forEach(el => observer.observe(el));

/* ─── PORTFOLIO FILTER ─── */
const filterBtns = document.querySelectorAll('.portfolio__filter');
const portfolioItems = document.querySelectorAll('.p-item');
const descBlocks = document.querySelectorAll('.port-desc');

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const filter = btn.dataset.filter;

        // update active button
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        // filter items
        portfolioItems.forEach(item => {
            const cat = item.dataset.category;
            const show = filter === 'all' || cat === filter;
            if (show) {
                item.classList.remove('hidden');
            } else {
                item.classList.add('hidden');
            }
        });

        // update descriptions
        descBlocks.forEach(d => {
            d.classList.remove('port-desc--active');
            if (d.dataset.for === filter) {
                d.classList.add('port-desc--active');
            }
        });
    });
});

/* ─── STAGGER CARDS ─── */
document.querySelectorAll('.outcome-card, .pricing-card, .benefit, .review-card, .for-whom__card').forEach((el, i) => {
    el.style.transitionDelay = `${i * 0.06}s`;
});