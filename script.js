// ============ LOADER ============
window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('loader').classList.add('done');
    document.body.classList.remove('loading');
    initAnimations();
  }, 1800);
});
document.body.classList.add('loading');

// ============ CUSTOM CURSOR ============
const cursor = document.querySelector('.cursor');
const follower = document.querySelector('.cursor-follower');
let mouseX = 0, mouseY = 0, followerX = 0, followerY = 0;

document.addEventListener('mousemove', e => {
  mouseX = e.clientX; mouseY = e.clientY;
  cursor.style.left = mouseX + 'px';
  cursor.style.top = mouseY + 'px';
});

(function animateFollower() {
  followerX += (mouseX - followerX) * 0.12;
  followerY += (mouseY - followerY) * 0.12;
  follower.style.left = followerX + 'px';
  follower.style.top = followerY + 'px';
  requestAnimationFrame(animateFollower);
})();

document.querySelectorAll('a, button, .beat-card, .filter-btn, .social-link').forEach(el => {
  el.addEventListener('mouseenter', () => follower.classList.add('hover'));
  el.addEventListener('mouseleave', () => follower.classList.remove('hover'));
});

// ============ NAVBAR ============
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
  updateActiveNav();
});

function updateActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const scrollY = window.scrollY + 100;
  sections.forEach(sec => {
    const top = sec.offsetTop;
    const h = sec.offsetHeight;
    const id = sec.getAttribute('id');
    const link = document.querySelector(`.nav-link[href="#${id}"]`);
    if (link) link.classList.toggle('active', scrollY >= top && scrollY < top + h);
  });
}

// ============ HAMBURGER ============
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  mobileMenu.classList.toggle('open');
});
document.querySelectorAll('.mob-link').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
  });
});

// ============ PARTICLES ============
function createParticles() {
  const container = document.getElementById('particles');
  for (let i = 0; i < 25; i++) {
    const p = document.createElement('div');
    p.classList.add('particle');
    const size = Math.random() * 4 + 2;
    p.style.cssText = `
      width:${size}px; height:${size}px;
      left:${Math.random() * 100}%;
      animation-duration:${Math.random() * 12 + 8}s;
      animation-delay:${Math.random() * 8}s;
    `;
    container.appendChild(p);
  }
}
createParticles();

// ============ SCROLL ANIMATIONS ============
function initAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, entry.target.dataset.delay || 0);
        // Skill bars
        entry.target.querySelectorAll('.skill-fill').forEach(bar => {
          bar.style.width = bar.dataset.width + '%';
        });
        // Counter animation
        entry.target.querySelectorAll('.stat-num').forEach(el => {
          animateCount(el);
        });
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right').forEach((el, i) => {
    const siblings = el.parentElement.querySelectorAll('.reveal-up');
    let idx = Array.from(siblings).indexOf(el);
    if (idx > 0) el.dataset.delay = idx * 100;
    observer.observe(el);
  });

  // Also trigger skill bars when about section comes in
  const skillObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('.skill-fill').forEach(bar => {
          bar.style.width = bar.dataset.width + '%';
        });
      }
    });
  }, { threshold: 0.3 });
  document.querySelectorAll('.skills-bar-group').forEach(el => skillObserver.observe(el));
}

// ============ COUNTER ============
function animateCount(el) {
  const target = +el.dataset.target;
  const duration = 2000;
  const step = target / (duration / 16);
  let current = 0;
  const timer = setInterval(() => {
    current += step;
    if (current >= target) { current = target; clearInterval(timer); }
    el.textContent = Math.floor(current);
  }, 16);
}

// ============ WAVEFORM ============
function drawWaveform(canvasId, playing = false) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
  const w = canvas.width, h = canvas.height;
  ctx.clearRect(0, 0, w, h);
  const bars = 60;
  const barW = w / bars - 1;
  for (let i = 0; i < bars; i++) {
    const barH = (Math.random() * 0.7 + 0.15) * h;
    const x = i * (barW + 1);
    const y = (h - barH) / 2;
    ctx.fillStyle = playing
      ? `rgba(230,0,0,${0.4 + Math.random() * 0.6})`
      : `rgba(255,255,255,0.15)`;
    ctx.fillRect(x, y, barW, barH);
  }
}

document.querySelectorAll('.waveform-canvas').forEach(c => drawWaveform(c.id));

// ============ BEAT PLAYER ============
let currentPlaying = null;

function togglePlay(btn, id) {
  const audio = document.getElementById(id);

  // If no src, show demo waveform animation
  if (currentPlaying && currentPlaying !== id) {
    const prevBtn = document.querySelector(`[onclick="togglePlay(this, '${currentPlaying}')"]`);
    if (prevBtn) {
      prevBtn.innerHTML = '<i class="fas fa-play"></i>';
      prevBtn.classList.remove('playing');
    }
    drawWaveform('wave-' + currentPlaying, false);
    if (audio.src) { const prevAudio = document.getElementById(currentPlaying); prevAudio.pause(); }
  }

  if (btn.classList.contains('playing')) {
    btn.innerHTML = '<i class="fas fa-play"></i>';
    btn.classList.remove('playing');
    if (audio.src) audio.pause();
    drawWaveform('wave-' + id, false);
    currentPlaying = null;
    stopWaveAnimation(id);
  } else {
    btn.innerHTML = '<i class="fas fa-pause"></i>';
    btn.classList.add('playing');
    if (audio.src) audio.play();
    currentPlaying = id;
    startWaveAnimation(id);
  }
}

let waveAnimations = {};
function startWaveAnimation(id) {
  function animate() {
    drawWaveform('wave-' + id, true);
    waveAnimations[id] = requestAnimationFrame(animate);
  }
  animate();
}
function stopWaveAnimation(id) {
  if (waveAnimations[id]) {
    cancelAnimationFrame(waveAnimations[id]);
    delete waveAnimations[id];
  }
  drawWaveform('wave-' + id, false);
}

// ============ BEAT FILTERS ============
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    document.querySelectorAll('.beat-card').forEach(card => {
      const show = filter === 'all' || card.dataset.genre === filter;
      card.classList.toggle('hidden', !show);
      if (show) {
        card.style.animation = 'none';
        card.offsetHeight;
        card.style.animation = 'fadeIn 0.4s ease';
      }
    });
  });
});

// ============ UPLOAD TOGGLE ============
function toggleUpload() {
  const form = document.getElementById('uploadForm');
  form.classList.toggle('open');
}

function addBeat() {
  const name = document.getElementById('newBeatName').value;
  const genre = document.getElementById('newBeatGenre').value;
  const bpm = document.getElementById('newBeatBPM').value;
  const key = document.getElementById('newBeatKey').value;
  const price = document.getElementById('newBeatPrice').value;
  const file = document.getElementById('newBeatFile').files[0];

  if (!name || !bpm || !key || !price) {
    alert('Please fill in all fields!');
    return;
  }

  const icons = ['fa-fire', 'fa-bolt', 'fa-crown', 'fa-heart', 'fa-skull', 'fa-crosshairs', 'fa-gem', 'fa-star'];
  const randomIcon = icons[Math.floor(Math.random() * icons.length)];
  const beatId = 'beat_' + Date.now();
  const audioSrc = file ? URL.createObjectURL(file) : '';
  const genreLabels = { trap: 'Trap', drill: 'Drill', hiphop: 'Hip-Hop', rnb: 'R&B' };
  const hue = Math.floor(Math.random() * 20);

  const card = document.createElement('div');
  card.className = 'beat-card reveal-up visible';
  card.dataset.genre = genre;
  card.style.animation = 'fadeIn 0.6s ease';
  card.innerHTML = `
    <div class="beat-cover">
      <div class="beat-cover-art" style="--hue: ${hue}">
        <i class="fas ${randomIcon}"></i>
      </div>
      <button class="beat-play-btn" onclick="togglePlay(this, '${beatId}')">
        <i class="fas fa-play"></i>
      </button>
    </div>
    <div class="beat-waveform">
      <canvas class="waveform-canvas" id="wave-${beatId}"></canvas>
    </div>
    <div class="beat-info">
      <div class="beat-meta">
        <h3>${name}</h3>
        <span class="beat-genre">${genreLabels[genre] || genre}</span>
      </div>
      <div class="beat-details">
        <span><i class="fas fa-tachometer-alt"></i> ${bpm} BPM</span>
        <span><i class="fas fa-key"></i> ${key}</span>
      </div>
      <div class="beat-actions">
        <span class="beat-price">${price}</span>
        <a href="#contact" class="btn-buy">Buy License</a>
      </div>
    </div>
    <audio id="${beatId}" src="${audioSrc}"></audio>
  `;

  document.getElementById('beatsGrid').insertBefore(card, document.getElementById('beatsGrid').firstChild);
  setTimeout(() => drawWaveform('wave-' + beatId), 100);

  // Reset
  document.getElementById('newBeatName').value = '';
  document.getElementById('newBeatBPM').value = '';
  document.getElementById('newBeatKey').value = '';
  document.getElementById('newBeatPrice').value = '';
  document.getElementById('newBeatFile').value = '';
  toggleUpload();
}

// ============ TESTIMONIALS SLIDER ============
let currentSlide = 0;
const track = document.getElementById('testimonialTrack');
const cards = track.querySelectorAll('.testimonial-card');
const dotsContainer = document.getElementById('testimonialDots');
let visibleCount = window.innerWidth > 900 ? 3 : window.innerWidth > 600 ? 2 : 1;

function initTestimonials() {
  dotsContainer.innerHTML = '';
  const total = cards.length - visibleCount + 1;
  for (let i = 0; i < total; i++) {
    const dot = document.createElement('div');
    dot.className = 't-dot' + (i === 0 ? ' active' : '');
    dot.addEventListener('click', () => goToSlide(i));
    dotsContainer.appendChild(dot);
  }
}

function goToSlide(n) {
  currentSlide = n;
  const cardWidth = cards[0].offsetWidth + 24;
  track.style.transform = `translateX(-${n * cardWidth}px)`;
  document.querySelectorAll('.t-dot').forEach((d, i) => d.classList.toggle('active', i === n));
}

initTestimonials();

setInterval(() => {
  const maxSlide = cards.length - visibleCount;
  currentSlide = currentSlide >= maxSlide ? 0 : currentSlide + 1;
  goToSlide(currentSlide);
}, 4000);

window.addEventListener('resize', () => {
  visibleCount = window.innerWidth > 900 ? 3 : window.innerWidth > 600 ? 2 : 1;
  initTestimonials();
  goToSlide(0);
});

// ============ CONTACT FORM ============
function submitForm(e) {
  e.preventDefault();
  const form = document.getElementById('contactForm');
  const success = document.getElementById('formSuccess');
  form.style.opacity = '0';
  form.style.transform = 'scale(0.95)';
  setTimeout(() => {
    form.style.display = 'none';
    success.classList.add('show');
  }, 400);
}

// ============ SMOOTH SCROLL ============
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ============ CSS KEYFRAME INJECT ============
const style = document.createElement('style');
style.textContent = `
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;
document.head.appendChild(style);

// Redraw waveforms on resize
window.addEventListener('resize', () => {
  document.querySelectorAll('.waveform-canvas').forEach(c => {
    if (!waveAnimations[c.id.replace('wave-', '')]) drawWaveform(c.id);
  });
});
