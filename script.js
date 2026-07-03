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
       1. BOOT SCREEN
    ────────────────────────────────────────────── */
    const bootScreen = document.getElementById('boot-screen');

    const bootLines = [
        { text: '> SYSTEM BOOT SEQUENCE INITIATED...', hi: false },
        { text: '> LOADING KERNEL MODULES.............. OK', hi: false },
        { text: '> NEURAL INTERFACE DETECTED............ OK', hi: false },
        { text: '> IDENTITY: MANOJITH THIYAGESWARAKUMAR', hi: true  },
        { text: '> CLEARANCE LEVEL: ALPHA', hi: true  },
        { text: '> ALL SYSTEMS NOMINAL.................. OK', hi: false },
        { text: '> STATUS: ONLINE', hi: true  },
    ];

    function runBoot() {
        if (!bootScreen) return;

        /* Only play once per browser session */
        if (sessionStorage.getItem('bootDone')) {
            bootScreen.style.display = 'none';
            return;
        }

        const linesEl    = document.getElementById('boot-lines');
        const barWrap    = document.getElementById('boot-bar-wrap');
        const fillEl     = document.getElementById('boot-fill');
        const pctEl      = document.getElementById('boot-pct');
        let idx = 0;

        function addLine() {
            if (idx < bootLines.length) {
                const { text, hi } = bootLines[idx++];
                const div = document.createElement('div');
                div.className = 'boot-line' + (hi ? ' hi' : '');
                div.textContent = text;
                linesEl.appendChild(div);
                setTimeout(addLine, 270);
            } else {
                /* Show progress bar */
                barWrap.style.display = 'block';
                let pct = 0;
                const ticker = setInterval(() => {
                    pct = Math.min(pct + 2, 100);
                    if (pctEl) pctEl.textContent = pct + '%';
                    if (pct >= 100) clearInterval(ticker);
                }, 25);
                setTimeout(() => { if (fillEl) fillEl.style.width = '100%'; }, 80);

                /* Fade out */
                setTimeout(() => {
                    bootScreen.style.opacity = '0';
                    bootScreen.style.transition = 'opacity .6s ease';
                    setTimeout(() => {
                        bootScreen.style.display = 'none';
                        sessionStorage.setItem('bootDone', '1');
                    }, 620);
                }, 1700);
            }
        }

        setTimeout(addLine, 300);
    }

    runBoot();

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
        setTimeout(type, sessionStorage.getItem('bootDone') ? 200 : 2800);
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

    const sectionIds = ['hero', 'academic_logs', 'core_capabilities',
        'operational_history', 'prime_works', 'projects',
        'certificate_creds', 'honors', 'testimonials'];

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
    document.querySelectorAll('.tl-header').forEach(header => {
        header.addEventListener('click', () => {
            const item = header.closest('.timeline-item');
            const isActive = item.classList.contains('tl-active');
            document.querySelectorAll('.timeline-item').forEach(i => i.classList.remove('tl-active'));
            if (!isActive) item.classList.add('tl-active');
        });
    });
    const firstTl = document.querySelector('.timeline-item');
    if (firstTl) firstTl.classList.add('tl-active');

    /* ──────────────────────────────────────────────
       8. SCROLL FADE-IN (sections & cards)
    ────────────────────────────────────────────── */
    const fadeTargets = document.querySelectorAll(
        '.section, .dossier-card, .cert-item, .award-badge-card, .comms-carousel, .edu-card, .skill-cluster, #statsStrip'
    );

    const fadeObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity    = '1';
                entry.target.style.transform  = 'translateY(0)';
                fadeObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.08 });

    fadeTargets.forEach((el, i) => {
        el.style.opacity    = '0';
        el.style.transform  = 'translateY(22px)';
        el.style.transition = `opacity .55s ease ${(i % 6) * 0.06}s, transform .55s ease ${(i % 6) * 0.06}s`;
        fadeObserver.observe(el);
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
                    c.style.borderColor = '#ff00aa';
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
    const modal    = document.getElementById('classified-modal');
    const overlay  = document.getElementById('decryption-overlay');
    const content  = document.getElementById('dossier-content');
    const fill     = document.querySelector('.progress-fill');
    if (!modal) return;

    modal.style.display   = 'block';
    overlay.style.display = 'flex';
    content.style.display = 'none';
    if (fill) fill.style.width = '0%';

    setTimeout(() => { if (fill) fill.style.width = '100%'; }, 100);
    setTimeout(() => {
        overlay.style.display = 'none';
        content.style.display = 'block';
    }, 2100);
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
