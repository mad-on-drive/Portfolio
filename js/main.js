/* ============================================
   Portfolio OS · Main Script
   ============================================ */

// ── Stars ────────────────────────────────────
(function initStars() {
  const canvas = document.getElementById('stars');
  const ctx = canvas.getContext('2d');
  let stars = [];
  let W, H;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function makeStars(n) {
    stars = [];
    for (let i = 0; i < n; i++) {
      stars.push({
        x: Math.random() * W,
        y: Math.random() * H,
        r: Math.random() * 1.2 + 0.2,
        a: Math.random(),
        speed: Math.random() * 0.004 + 0.001,
        phase: Math.random() * Math.PI * 2
      });
    }
  }

  let frame = 0;
  function draw() {
    ctx.clearRect(0, 0, W, H);
    frame++;
    stars.forEach(s => {
      s.a = 0.3 + 0.5 * Math.sin(frame * s.speed + s.phase);
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(200, 200, 255, ${s.a})`;
      ctx.fill();
    });
    requestAnimationFrame(draw);
  }

  resize();
  makeStars(220);
  draw();
  window.addEventListener('resize', () => { resize(); makeStars(220); });
})();


// ── Clock ─────────────────────────────────────
function updateClock() {
  const now = new Date();
  const h = String(now.getHours()).padStart(2, '0');
  const m = String(now.getMinutes()).padStart(2, '0');
  const s = String(now.getSeconds()).padStart(2, '0');
  const time = h + ':' + m;
  const liveTime = time + ':' + s;

  const days   = ['SUNDAY','MONDAY','TUESDAY','WEDNESDAY','THURSDAY','FRIDAY','SATURDAY'];
  const months = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];
  const dateStr = days[now.getDay()] + ' · ' + months[now.getMonth()] + ' ' + String(now.getDate()).padStart(2, '0');

  const statusTime = document.getElementById('hs-time');
  const bigTime    = document.getElementById('hs-big-time');
  const dateEl     = document.getElementById('hs-date');
  const lockTime   = document.getElementById('ls-time');

  if (statusTime) statusTime.textContent = liveTime;
  if (bigTime)    bigTime.textContent    = liveTime;
  if (dateEl)     dateEl.textContent     = dateStr;
  if (lockTime)   lockTime.textContent   = liveTime;
}
updateClock();
setInterval(updateClock, 1000);


// ── Lock screen unlock ────────────────────────
function unlockPhone() {
  const lockscreen = document.getElementById('lockscreen');
  const phoneScreen = document.getElementById('phoneScreen');
  if (!lockscreen || lockscreen.classList.contains('unlocked')) return false;
  lockscreen.classList.add('unlocked');
  phoneScreen.classList.add('unlocked');
  return true;
}

(function initUnlock() {
  const lockscreen = document.getElementById('lockscreen');
  const unlockBtn = document.getElementById('unlockBtn');
  if (!lockscreen || !unlockBtn) return;

  unlockBtn.addEventListener('click', unlockPhone);
  lockscreen.addEventListener('click', (e) => {
    if (e.target === unlockBtn || unlockBtn.contains(e.target)) return;
    unlockPhone();
  });
})();


// ── App open / close ──────────────────────────
let currentApp = null;

function openApp(name) {
  unlockPhone();
  if (currentApp) closeApp(currentApp, false);
  const el = document.getElementById('app-' + name);
  if (!el) return;
  el.classList.add('open');
  currentApp = name;

  // Highlight the matching desc-item
  document.querySelectorAll('.desc-item').forEach(d => {
    d.style.opacity = d.dataset.app === name ? '1' : '0.3';
  });
}

function closeApp(name, resetDesc = true) {
  const el = document.getElementById('app-' + name);
  if (el) el.classList.remove('open');
  currentApp = null;

  if (resetDesc) {
    document.querySelectorAll('.desc-item').forEach(d => {
      d.style.opacity = '';
    });
  }
}

// Allow desc-items to trigger app open
document.querySelectorAll('.desc-item').forEach(item => {
  item.addEventListener('click', () => openApp(item.dataset.app));
});

// Swipe down to close
(function swipeToClose() {
  const screen = document.getElementById('phoneScreen');
  let startY = null;

  screen.addEventListener('touchstart', e => {
    startY = e.touches[0].clientY;
  }, { passive: true });

  screen.addEventListener('touchend', e => {
    if (startY === null) return;
    const diff = e.changedTouches[0].clientY - startY;
    if (diff > 60 && currentApp) closeApp(currentApp);
    startY = null;
  }, { passive: true });
})();


// ── Subtle phone parallax on desktop ─────────
(function parallax() {
  const phone = document.getElementById('phone');
  if (!phone || window.matchMedia('(max-width:900px)').matches) return;

  document.addEventListener('mousemove', e => {
    const cx = window.innerWidth  / 2;
    const cy = window.innerHeight / 2;
    const dx = (e.clientX - cx) / cx;
    const dy = (e.clientY - cy) / cy;
    phone.style.transform = `perspective(1000px) rotateY(${dx * 4}deg) rotateX(${-dy * 3}deg)`;
  });

  document.addEventListener('mouseleave', () => {
    phone.style.transform = 'perspective(1000px) rotateY(0deg) rotateX(0deg)';
  });
})();


// ── Entrance animation for phone on scroll ────
(function scrollReveal() {
  const phone = document.querySelector('.phone-stage');
  if (!phone) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  phone.style.opacity   = '0';
  phone.style.transform = 'translateY(40px)';
  phone.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
  observer.observe(phone);
})();
