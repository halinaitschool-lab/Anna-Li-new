/* ─── CURSOR (desktop only) ─── */
const isTouch = window.matchMedia('(pointer: coarse)').matches;
const cursor = document.getElementById('cursor');
const ring = document.getElementById('cursorRing');

if (!isTouch && cursor && ring) {
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
}

/* ─── HEADER SCROLL ─── */
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 60);
});

/* ─── PARALLAX HERO ─── */
const heroBg = document.getElementById('heroBg');
if (!isTouch) {
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        if (scrollY < window.innerHeight) {
            heroBg.style.transform = `scale(1.08) translateY(${scrollY * 0.35}px)`;
        }
    }, { passive: true });
}

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
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        portfolioItems.forEach(item => {
            const show = filter === 'all' || item.dataset.category === filter;
            item.classList.toggle('hidden', !show);
        });
        descBlocks.forEach(d => {
            d.classList.toggle('port-desc--active', d.dataset.for === filter);
        });
    });
});

/* ─── BOOKING DRAWER ─── */
const drawer = document.getElementById('bookingDrawer');
const drawerBackdrop = document.getElementById('drawerBackdrop');
const drawerClose = document.getElementById('drawerClose');
const drawerPackage = document.getElementById('drawerPackage');
const drawerPackageInput = document.getElementById('drawerPackageInput');
const drawerForm = document.getElementById('drawerForm');
const drawerSubmitBtn = document.getElementById('drawerSubmitBtn');
const drawerSuccess = document.getElementById('drawerSuccess');

function openDrawer(packageName) {
    if (drawerPackage) drawerPackage.textContent = packageName || 'Записатись';
    if (drawerPackageInput) drawerPackageInput.value = packageName || '';
    
    // Auto-set session type for "woman" pricing tiers
    const sessionTypeSelect = drawer.querySelector('select[name="session_type"]');
    if (sessionTypeSelect) {
        if (packageName && packageName.includes('250') || packageName.includes('450') || packageName.includes('650')) {
            // These are "for woman" pricing packages
            sessionTypeSelect.value = 'for-woman';
        } else {
            // Other buttons - let user choose
            sessionTypeSelect.value = '';
        }
    }
    
    drawer.classList.add('open');
    drawerBackdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
    setTimeout(() => drawer.querySelector('input[name="name"]')?.focus(), 400);
}

function closeDrawer() {
    drawer.classList.remove('open');
    drawerBackdrop.classList.remove('open');
    document.body.style.overflow = '';
}

if (drawerClose) drawerClose.addEventListener('click', closeDrawer);
if (drawerBackdrop) drawerBackdrop.addEventListener('click', closeDrawer);
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeDrawer(); });

if (drawerForm) {
    drawerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        drawerSubmitBtn.disabled = true;
        drawerSubmitBtn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Надсилаю...';
        try {
            const res = await fetch(drawerForm.action, {
                method: 'POST',
                body: new FormData(drawerForm),
                headers: { 'Accept': 'application/json' }
            });
            if (res.ok) {
                drawerForm.style.display = 'none';
                drawerSuccess.classList.add('visible');
                setTimeout(closeDrawer, 3200);
            } else {
                drawerSubmitBtn.disabled = false;
                drawerSubmitBtn.innerHTML = '<i class="fa-solid fa-rotate-right"></i> Спробуй ще раз';
            }
        } catch {
            drawerSubmitBtn.disabled = false;
            drawerSubmitBtn.innerHTML = '<i class="fa-solid fa-rotate-right"></i> Спробуй ще раз';
        }
    });
}