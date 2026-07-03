/* ═══════════════════════════════════════════════════
   CYBERPUNK 3.0 — PORTFOLIO SCRIPT
   ═══════════════════════════════════════════════════ */

/* ─── PORTFOLIO CONFIG — edit these to update stats ─── */
const PORTFOLIO_STATS = [
    { value: 4,  suffix: '+', label: 'YRS EXPERIENCE'  },
    { value: 10, suffix: '+', label: 'PROJECTS BUILT'   },
    { value: 4,  suffix: '',  label: 'CERTIFICATIONS'   },
    { value: 2,  suffix: '',  label: 'NATIONAL AWARDS'  }
];

document.addEventListener('DOMContentLoaded', () => {

    /* ──────────────────────────────────────────────
       2. STATS STRIP — render from config
    ────────────────────────────────────────────── */
    const statsStrip = document.getElementById('statsStrip');
    if (statsStrip) {
        statsStrip.innerHTML = PORTFOLIO_STATS.map((s, i) => `
            ${i > 0 ? '<div class="stat-divider"></div>' : ''}
            <div class="stat-item">
                <div class="stat-number-wrap">
                    <span class="stat-number" data-target="${s.value}">0</span>${s.suffix ? `<span class="stat-suffix">${s.suffix}</span>` : ''}
                </div>
                <span class="stat-label">${s.label}</span>
            </div>
        `).join('');
    }

    /* ──────────────────────────────────────────────
       2b. DYNAMIC AGE (DOB: 18 Mar 2000)
    ────────────────────────────────────────────── */
    function calcAge() {
        const dob = new Date('2000-03-18');
        const now = new Date();
        let age = now.getFullYear() - dob.getFullYear();
        const m = now.getMonth() - dob.getMonth();
        if (m < 0 || (m === 0 && now.getDate() < dob.getDate())) age--;
        return age;
    }
    const ageEl = document.getElementById('humanoid-age');
    if (ageEl) ageEl.textContent = calcAge() + ' YRS';

    /* ──────────────────────────────────────────────
       3. HERO GLITCH TYPING
    ────────────────────────────────────────────── */
    const glitchEl = document.querySelector('.glitch');
    if (glitchEl) {
        const fullText = glitchEl.getAttribute('data-text');
        glitchEl.textContent = '';
        let i = 0;
        const type = () => {
            if (i < fullText.length) {
                glitchEl.textContent += fullText[i++];
                setTimeout(type, 48);
            }
        };
        setTimeout(type, 200);
    }

    /* ──────────────────────────────────────────────
       4. SIDE NAV DOTS
    ────────────────────────────────────────────── */
    const dots = document.querySelectorAll('.side-dot');

    dots.forEach(dot => {
        dot.addEventListener('click', () => {
            const target = document.getElementById(dot.getAttribute('data-target'));
            if (target) target.scrollIntoView({ behavior: 'smooth' });
        });
    });

    const sectionIds = ['hero', 'education', 'skills', 'experience', 'projects', 'certifications', 'awards', 'testimonials'];

    const dotObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                dots.forEach(d => {
                    d.classList.toggle('active', d.getAttribute('data-target') === entry.target.id);
                });
            }
        });
    }, { threshold: 0.35 });

    sectionIds.forEach(id => {
        const el = document.getElementById(id);
        if (el) dotObserver.observe(el);
    });

    /* ──────────────────────────────────────────────
       5. STAT COUNTER ANIMATION
    ────────────────────────────────────────────── */
    function animateCounter(el) {
        const target   = parseInt(el.getAttribute('data-target'), 10);
        const step     = target / (1400 / 16);
        let current    = 0;
        const timer = setInterval(() => {
            current += step;
            if (current >= target) { current = target; clearInterval(timer); }
            el.textContent = Math.floor(current);
        }, 16);
    }

    if (statsStrip) {
        let counted = false;
        new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && !counted) {
                counted = true;
                statsStrip.querySelectorAll('.stat-number').forEach(animateCounter);
            }
        }, { threshold: 0.5 }).observe(statsStrip);
    }

    /* skill bar fill removed — now using cluster cards */

    /* ──────────────────────────────────────────────
       7. ACCORDION TIMELINE
    ────────────────────────────────────────────── */
    document.querySelectorAll('.timeline-item').forEach(item => {
        item.classList.add('tl-active');
        item.querySelector('.tl-header')?.addEventListener('click', () => {
            item.classList.toggle('tl-active');
        });
    });

    /* ──────────────────────────────────────────────
       8. SCROLL FADE-IN — staggered card animations
    ────────────────────────────────────────────── */
    const CARD_SEL = '.edu-card, .skill-cluster, .dossier-card, .cert-item, .award-badge-card, .comms-carousel, .timeline-item';

    // Section-level fade
    document.querySelectorAll('.section, .reach-out-section, #statsStrip').forEach(el => {
        el.style.opacity = '0';
        el.style.transition = 'opacity .5s ease';
        new IntersectionObserver(([e]) => {
            if (e.isIntersecting) { el.style.opacity = '1'; }
        }, { threshold: 0.05 }).observe(el);
    });

    // Card-level stagger within each section
    document.querySelectorAll('.section').forEach(section => {
        section.querySelectorAll(CARD_SEL).forEach((card, i) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            card.style.transition = `opacity .5s ease ${i * 0.09}s, transform .5s ease ${i * 0.09}s`;
            new IntersectionObserver(([e]) => {
                if (e.isIntersecting) {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }
            }, { threshold: 0.08 }).observe(card);
        });
    });

    /* ──────────────────────────────────────────────
       8b. PEER REVIEW CAROUSEL
    ────────────────────────────────────────────── */
    (function initCommsCarousel() {
        const track    = document.getElementById('commsTrack');
        const dotsWrap = document.getElementById('commsDots');
        const prevBtn  = document.getElementById('commsPrev');
        const nextBtn  = document.getElementById('commsNext');
        if (!track) return;

        const cards = Array.from(track.querySelectorAll('.comms-card'));
        let current = 0;
        let autoTimer;

        cards.forEach((_, i) => {
            const dot = document.createElement('div');
            dot.className = 'comms-dot' + (i === 0 ? ' active' : '');
            dot.addEventListener('click', () => goTo(i));
            dotsWrap.appendChild(dot);
        });

        function goTo(idx) {
            cards[current].classList.remove('active-slide');
            current = (idx + cards.length) % cards.length;
            track.style.transform = `translateX(-${current * 100}%)`;
            dotsWrap.querySelectorAll('.comms-dot').forEach((d, i) =>
                d.classList.toggle('active', i === current));
            cards[current].classList.add('active-slide');
            resetAuto();
        }

        function resetAuto() {
            clearInterval(autoTimer);
            autoTimer = setInterval(() => goTo(current + 1), 6500);
        }

        prevBtn.addEventListener('click', () => goTo(current - 1));
        nextBtn.addEventListener('click', () => goTo(current + 1));

        cards[0].classList.add('active-slide');
        resetAuto();
    })();

    /* ──────────────────────────────────────────────
       9. PROFILE HUD — reticle glitch flash
    ────────────────────────────────────────────── */
    const profileHud = document.querySelector('.profile-hud');
    if (profileHud) {
        const corners = profileHud.querySelectorAll('.hud-corner');
        profileHud.addEventListener('mouseenter', () => {
            corners.forEach(c => {
                c.style.borderColor = '#fff';
                setTimeout(() => {
                    c.style.borderColor = '#E8B84B';
                    setTimeout(() => { c.style.borderColor = ''; }, 200);
                }, 140);
            });
        });
    }
});

/* ═══════════════════════════════════════════════════
   MODAL — CERTIFICATE / IMAGE VIEWER
   ═══════════════════════════════════════════════════ */
function openModal(src) {
    const modal    = document.getElementById('cert-modal');
    const modalImg = document.getElementById('modal-img');
    if (!modal || !modalImg) return;
    modal.style.display = 'block';
    modalImg.src = src;
}

function closeModal() {
    const modal = document.getElementById('cert-modal');
    if (modal) modal.style.display = 'none';
}

/* ═══════════════════════════════════════════════════
   MODAL — CONTACT
   ═══════════════════════════════════════════════════ */
function openContactModal() {
    const modal = document.getElementById('contact-modal');
    if (modal) modal.style.display = 'block';
}

function closeContactModal() {
    const modal = document.getElementById('contact-modal');
    if (modal) modal.style.display = 'none';
}

/* ═══════════════════════════════════════════════════
   MODAL — CLASSIFIED DOSSIER
   ═══════════════════════════════════════════════════ */
function openClassifiedModal() {
    const modal = document.getElementById('classified-modal');
    if (modal) modal.style.display = 'block';
}

function closeClassifiedModal() {
    const modal = document.getElementById('classified-modal');
    if (modal) modal.style.display = 'none';
}

/* ═══════════════════════════════════════════════════
   CLOSE MODALS ON OUTSIDE CLICK
   ═══════════════════════════════════════════════════ */
window.addEventListener('click', e => {
    ['cert-modal', 'contact-modal', 'classified-modal'].forEach(id => {
        const modal = document.getElementById(id);
        if (modal && e.target === modal) modal.style.display = 'none';
    });
});
