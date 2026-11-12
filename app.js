/**
 * ============================================================================
 * Starlight Over Champagne Sea — Interactive Birthday Surprise Engine
 * Optimized for Mobile Phones & Tablets (Touch, Hold, Flip, Mic Blow, Audio)
 * ============================================================================
 */

(function () {
  const cfg = window.BIRTHDAY_CONFIG || {};

  // --------------------------------------------------------------------------
  // 1. Populate Content from config.js
  // --------------------------------------------------------------------------
  function hydrateContent() {
    setText('hero-date-badge', cfg.birthdayDate || 'SPECIAL DAY · 2026');
    setText('hero-title', cfg.heroTitle || 'Happy Birthday');
    setText('hero-recipient', cfg.recipientName || 'ที่รักของเค้า');
    setText('hero-subtitle', cfg.heroSubtitle || '');

    if (cfg.cakeSection) {
      setText('cake-title', cfg.cakeSection.title);
      setText('cake-instruction', cfg.cakeSection.instruction);
      setText('cake-flavor-label', cfg.cakeSection.cakeFlavorLabel);
      setText('after-blow-title', cfg.cakeSection.afterBlowTitle);
      setText('after-blow-message', cfg.cakeSection.afterBlowMessage);
    }

    if (cfg.letter) {
      setText('envelope-recipient-label', cfg.letter.envelopeLabel);
      setText('envelope-seal-hint', cfg.letter.sealHint);
      setText('letter-salutation', cfg.letter.salutation);
      setText('letter-closing', cfg.letter.closing);
      setText('letter-sender', cfg.senderName || 'คนที่รักเธอที่สุด');

      const bodyContainer = document.getElementById('letter-paragraphs');
      if (bodyContainer && Array.isArray(cfg.letter.paragraphs)) {
        bodyContainer.innerHTML = cfg.letter.paragraphs
          .map(
            (p) =>
              `<p class="text-[#2e2927] text-[17px] md:text-[18px] font-body-th leading-[1.9] mb-5">${escapeHtml(
                p
              )}</p>`
          )
          .join('');
      }
    }

    renderMemories();
    renderStarWishes();
  }

  function setText(id, text) {
    const el = document.getElementById(id);
    if (el && text !== undefined) el.textContent = text;
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  // --------------------------------------------------------------------------
  // 2. Render 3D Flip Polaroid Memories
  // --------------------------------------------------------------------------
  function renderMemories() {
    const grid = document.getElementById('memories-grid');
    if (!grid || !Array.isArray(cfg.memories)) return;

    const rotations = ['-rotate-1', 'rotate-1', '-rotate-2'];

    grid.innerHTML = cfg.memories
      .map((item, idx) => {
        const tilt = rotations[idx % rotations.length];
        return `
        <article
          class="polaroid-scene ${tilt} select-none"
          data-memory-id="${escapeHtml(item.id)}"
          role="button"
          tabindex="0"
          aria-label="แตะเพื่อพลิกดูข้อความด้านหลังรูป ${escapeHtml(item.thaiTitle)}"
        >
          <div class="polaroid-inner">
            <!-- Front of Polaroid -->
            <div class="polaroid-face">
              <div class="relative w-full h-[265px] rounded-lg overflow-hidden bg-[#ebe3d5]">
                <img
                  src="${escapeHtml(item.imageUrl)}"
                  alt="${escapeHtml(item.thaiTitle)}"
                  loading="lazy"
                  width="600"
                  height="530"
                  class="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                />
                <div class="absolute top-3 left-3 px-3 py-1 rounded-full bg-black/45 backdrop-blur-md text-[#fbf7f0] text-xs font-display-en">
                  ${escapeHtml(item.date || `Memory ${idx + 1}`)}
                </div>
                <div class="absolute bottom-3 right-3 px-2.5 py-1 rounded-full bg-[#fbf7f0]/90 text-[#544b47] text-xs font-body-th shadow-sm">
                  แตะเพื่อพลิกรูป ↻
                </div>
              </div>
              <div class="pt-4 pb-1 text-center">
                <p class="font-serif-italic text-[#965d4c] text-xl leading-tight mb-1">
                  ${escapeHtml(item.caption)}
                </p>
                <h3 class="font-heading-th text-[#231f1e] text-[18px] font-medium">
                  ${escapeHtml(item.thaiTitle)}
                </h3>
              </div>
            </div>

            <!-- Back of Polaroid (Secret Note) -->
            <div class="polaroid-face polaroid-back">
              <div class="flex items-center justify-between border-b border-[#c89d54]/30 pb-3">
                <span class="font-display-en text-sm text-[#965d4c]">${escapeHtml(
                  item.date || 'Secret Note'
                )}</span>
                <span class="text-xs text-[#7d726d] font-body-th">แตะเพื่อพลิกกลับ ↺</span>
              </div>
              <div class="my-auto py-4 text-center">
                <div class="text-[#c89d54] text-2xl mb-3" aria-hidden="true">✦</div>
                <p class="font-body-th text-[#231f1e] text-[17px] leading-[1.85]">
                  “${escapeHtml(item.backNote)}”
                </p>
              </div>
              <div class="text-right font-serif-italic text-[#965d4c] text-base">
                — With all my love
              </div>
            </div>
          </div>
        </article>
      `;
      })
      .join('');

    grid.querySelectorAll('.polaroid-scene').forEach((card) => {
      const toggleFlip = () => {
        card.classList.toggle('is-flipped');
        SoundEngine.playSoftChime(660, 0.08);
      };
      card.addEventListener('click', toggleFlip);
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          toggleFlip();
        }
      });
    });
  }

  // --------------------------------------------------------------------------
  // 3. Render Starlight Wishes Over the Meadow
  // --------------------------------------------------------------------------
  function renderStarWishes() {
    const container = document.getElementById('star-wishes-grid');
    const detailBox = document.getElementById('star-wish-display');
    const detailTitle = document.getElementById('star-wish-title');
    const detailText = document.getElementById('star-wish-detail');
    const detailLabel = document.getElementById('star-wish-label');

    if (!container || !Array.isArray(cfg.starWishes)) return;

    container.innerHTML = cfg.starWishes
      .map(
        (w, index) => `
      <button
        type="button"
        data-wish-index="${index}"
        class="wish-orb-btn group text-left p-5 rounded-2xl bg-[#13283f]/80 border border-[#e8c792]/30 backdrop-blur-md text-[#fbf7f0] flex items-start gap-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#e8c792]"
      >
        <span class="w-11 h-11 rounded-full bg-gradient-to-br from-[#f2dfb6] to-[#c89d54] text-[#091326] flex items-center justify-center shrink-0 font-display-en text-lg font-semibold shadow-md group-hover:scale-110 transition-transform">
          ★
        </span>
        <div>
          <span class="block text-xs text-[#f2dfb6]/80 font-body-th mb-0.5">${escapeHtml(
            w.label
          )}</span>
          <span class="block font-heading-th text-[17px] text-[#fbf7f0] font-medium">${escapeHtml(
            w.title
          )}</span>
        </div>
      </button>
    `
      )
      .join('');

    const buttons = container.querySelectorAll('.wish-orb-btn');
    buttons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const idx = Number(btn.getAttribute('data-wish-index'));
        const wish = cfg.starWishes[idx];
        if (!wish) return;

        buttons.forEach((b) => b.classList.remove('unlocked'));
        btn.classList.add('unlocked');

        if (detailLabel) detailLabel.textContent = wish.label;
        if (detailTitle) detailTitle.textContent = wish.title;
        if (detailText) detailText.textContent = wish.detail;
        if (detailBox) {
          detailBox.classList.remove('hidden');
          detailBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }

        // Play warm harp note based on index
        const notes = [523.25, 587.33, 659.25, 783.99];
        SoundEngine.playSoftChime(notes[idx % notes.length], 0.14);
      });
    });
  }

  // --------------------------------------------------------------------------
  // 4. Web Audio API Music Box ("Happy Birthday") + Gentle Sea Breeze Ambience
  // --------------------------------------------------------------------------
  const SoundEngine = {
    ctx: null,
    isPlaying: false,
    melodyTimer: null,
    customAudio: null,
    seaGain: null,

    init() {
      if (!this.ctx) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) {
          this.ctx = new AudioCtx();
        }
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
    },

    playSoftChime(freq = 587.33, volume = 0.1) {
      try {
        this.init();
        if (!this.ctx) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);

        gain.gain.setValueAtTime(0.001, now);
        gain.gain.exponentialRampToValueAtTime(volume, now + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.4);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 1.45);
      } catch (_) {
        // Ignore audio errors if blocked by browser policy
      }
    },

    playCelebrationChord() {
      const chord = [523.25, 659.25, 783.99, 1046.5, 1318.5];
      chord.forEach((freq, idx) => {
        setTimeout(() => this.playSoftChime(freq, 0.12), idx * 95);
      });
    },

    toggleMusic() {
      if (this.isPlaying) {
        this.stopMusic();
      } else {
        this.startMusic();
      }
      return this.isPlaying;
    },

    startMusic() {
      if (cfg.customAudioUrl && cfg.customAudioUrl.trim() !== '') {
        if (!this.customAudio) {
          this.customAudio = new Audio(cfg.customAudioUrl);
          this.customAudio.loop = true;
        }
        this.customAudio.play().catch(() => {});
        this.isPlaying = true;
        updateAudioUI(true);
        return;
      }

      this.init();
      if (!this.ctx) return;
      this.isPlaying = true;
      updateAudioUI(true);

      // Start subtle ocean wave hush
      this.startOceanWaveAmbience();

      // Music box notes for "Happy Birthday to You" in warm F Major / C Major
      // [frequency, durationInBeats]
      const melody = [
        [392.0, 0.75], [392.0, 0.25], [440.0, 1], [392.0, 1], [523.25, 1], [493.88, 2],
        [392.0, 0.75], [392.0, 0.25], [440.0, 1], [392.0, 1], [587.33, 1], [523.25, 2],
        [392.0, 0.75], [392.0, 0.25], [783.99, 1], [659.25, 1], [523.25, 1], [493.88, 1], [440.0, 2],
        [698.46, 0.75], [698.46, 0.25], [659.25, 1], [523.25, 1], [587.33, 1], [523.25, 2.5]
      ];

      let noteIndex = 0;
      const playNextNote = () => {
        if (!this.isPlaying) return;
        const [freq, beats] = melody[noteIndex];
        this.playSoftChime(freq, 0.09);
        // Subtle lower harmony note on downbeats
        if (beats >= 1) {
          this.playSoftChime(freq * 0.5, 0.04);
        }
        noteIndex = (noteIndex + 1) % melody.length;
        this.melodyTimer = setTimeout(playNextNote, beats * 520);
      };

      playNextNote();
    },

    startOceanWaveAmbience() {
      try {
        if (!this.ctx || this.seaGain) return;
        const bufferSize = 2 * this.ctx.sampleRate;
        const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        let b0 = 0, b1 = 0, b2 = 0;
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          b0 = 0.997 * b0 + white * 0.029;
          b1 = 0.985 * b1 + white * 0.032;
          b2 = 0.950 * b2 + white * 0.048;
          output[i] = (b0 + b1 + b2) * 0.12;
        }
        const whiteNoise = this.ctx.createBufferSource();
        whiteNoise.buffer = noiseBuffer;
        whiteNoise.loop = true;

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 360;

        this.seaGain = this.ctx.createGain();
        this.seaGain.gain.value = 0.035;

        whiteNoise.connect(filter);
        filter.connect(this.seaGain);
        this.seaGain.connect(this.ctx.destination);
        whiteNoise.start(0);
      } catch (_) {}
    },

    stopMusic() {
      this.isPlaying = false;
      if (this.melodyTimer) {
        clearTimeout(this.melodyTimer);
        this.melodyTimer = null;
      }
      if (this.customAudio) {
        this.customAudio.pause();
      }
      if (this.seaGain && this.ctx) {
        try {
          this.seaGain.gain.setValueAtTime(0.0001, this.ctx.currentTime);
        } catch (_) {}
      }
      updateAudioUI(false);
    }
  };

  function updateAudioUI(playing) {
    const btn = document.getElementById('audio-toggle-btn');
    const label = document.getElementById('audio-toggle-label');
    const disc = document.getElementById('audio-vinyl-icon');
    if (btn) btn.setAttribute('aria-pressed', String(playing));
    if (label) label.textContent = playing ? 'เพลงคลอริมทะเล: เปิด' : 'เปิดเพลงคลอเบาๆ';
    if (disc) {
      disc.classList.toggle('playing', playing);
    }
  }

  // --------------------------------------------------------------------------
  // 5. Starlit Sky, Shimmering Ocean & Meadow Fireflies Canvas (#starlight-canvas)
  // --------------------------------------------------------------------------
  function initScenicCanvas() {
    const canvas = document.getElementById('starlight-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let width = 0;
    let height = 0;
    let stars = [];
    let fireflies = [];
    let seaSparkles = [];
    let shootingStars = [];

    function resize() {
      const rect = canvas.parentElement.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      createParticles();
    }

    function createParticles() {
      const starCount = Math.min(Math.floor((width * height) / 4200), 160);
      const colors = ['#fff9eb', '#f5deb3', '#ffd9c0', '#d8e6ff'];
      stars = Array.from({ length: starCount }, () => ({
        x: Math.random() * width,
        y: Math.random() * (height * 0.72),
        r: Math.random() * 1.7 + 0.5,
        alpha: Math.random() * 0.75 + 0.25,
        speed: Math.random() * 0.025 + 0.008,
        phase: Math.random() * Math.PI * 2,
        color: colors[Math.floor(Math.random() * colors.length)]
      }));

      // Shimmering sparkles on the ocean surface (76% to 90% of hero height)
      const seaCount = Math.min(Math.floor(width / 9), 95);
      seaSparkles = Array.from({ length: seaCount }, () => {
        const spread = (Math.random() - 0.5) * (width * 0.78);
        return {
          x: width * 0.5 + spread,
          y: height * (0.765 + Math.random() * 0.13),
          w: Math.random() * 18 + 4,
          phase: Math.random() * Math.PI * 2,
          speed: Math.random() * 0.04 + 0.015
        };
      });

      // Golden-emerald fireflies drifting out of the green meadow grass
      const fireflyCount = 24;
      fireflies = Array.from({ length: fireflyCount }, () => ({
        x: Math.random() * width,
        y: height * (0.72 + Math.random() * 0.26),
        vx: (Math.random() - 0.5) * 0.35,
        vy: -(Math.random() * 0.35 + 0.12),
        r: Math.random() * 2.2 + 1.2,
        phase: Math.random() * Math.PI * 2,
        color: Math.random() > 0.35 ? '#f5df9d' : '#a8f0c6'
      }));
    }

    function spawnShootingStar(targetX, targetY) {
      const startX = targetX !== undefined ? targetX : Math.random() * (width * 0.75) + width * 0.1;
      const startY = targetY !== undefined ? targetY : Math.random() * (height * 0.35) + 20;
      shootingStars.push({
        x: startX,
        y: startY,
        vx: 5.5 + Math.random() * 3,
        vy: 2.2 + Math.random() * 1.8,
        len: 75 + Math.random() * 45,
        life: 1.0
      });
    }

    // Spawn occasional gentle shooting star automatically
    setInterval(() => {
      if (document.visibilityState === 'visible' && shootingStars.length < 2) {
        spawnShootingStar();
      }
    }, 4500);

    // Interactive Touch/Click on Sky to spawn shooting stars & chime
    canvas.addEventListener('pointerdown', (e) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      spawnShootingStar(x, y);
      const chimeNotes = [587.33, 659.25, 783.99, 880, 1046.5];
      const randomNote = chimeNotes[Math.floor(Math.random() * chimeNotes.length)];
      SoundEngine.playSoftChime(randomNote, 0.08);
    });

    function renderFrame() {
      ctx.clearRect(0, 0, width, height);

      // 1. Twinkling Stars
      for (const s of stars) {
        s.phase += s.speed;
        const twinkle = 0.35 + 0.65 * Math.sin(s.phase);
        ctx.globalAlpha = s.alpha * twinkle;
        ctx.fillStyle = s.color;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();

        // 4-point star sparkle on bigger stars
        if (s.r > 1.65 && twinkle > 0.82) {
          ctx.strokeStyle = s.color;
          ctx.lineWidth = 0.6;
          ctx.beginPath();
          ctx.moveTo(s.x - s.r * 3, s.y);
          ctx.lineTo(s.x + s.r * 3, s.y);
          ctx.moveTo(s.x, s.y - s.r * 3);
          ctx.lineTo(s.x, s.y + s.r * 3);
          ctx.stroke();
        }
      }

      // 2. Shooting Stars
      for (let i = shootingStars.length - 1; i >= 0; i--) {
        const st = shootingStars[i];
        st.x += st.vx;
        st.y += st.vy;
        st.life -= 0.022;

        if (st.life <= 0) {
          shootingStars.splice(i, 1);
          continue;
        }

        const grad = ctx.createLinearGradient(
          st.x,
          st.y,
          st.x - st.vx * (st.len / 6),
          st.y - st.vy * (st.len / 6)
        );
        grad.addColorStop(0, `rgba(255, 248, 228, ${st.life})`);
        grad.addColorStop(1, 'rgba(255, 248, 228, 0)');

        ctx.globalAlpha = 1;
        ctx.strokeStyle = grad;
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(st.x, st.y);
        ctx.lineTo(st.x - st.vx * (st.len / 6), st.y - st.vy * (st.len / 6));
        ctx.stroke();
      }

      // 3. Shimmering Sea Reflections
      for (const sp of seaSparkles) {
        sp.phase += sp.speed;
        const glow = 0.2 + 0.8 * Math.abs(Math.sin(sp.phase));
        ctx.globalAlpha = glow * 0.55;
        ctx.fillStyle = '#f5dfb5';
        ctx.fillRect(sp.x - sp.w / 2, sp.y, sp.w, 1.6);
      }

      // 4. Meadow Fireflies rising from the green grass
      for (const f of fireflies) {
        f.x += f.vx + Math.sin(f.phase) * 0.25;
        f.y += f.vy;
        f.phase += 0.04;

        if (f.y < height * 0.55) {
          f.y = height * 0.96;
          f.x = Math.random() * width;
        }

        const pulse = 0.3 + 0.7 * Math.abs(Math.sin(f.phase));
        ctx.globalAlpha = pulse * 0.85;
        ctx.shadowBlur = 10;
        ctx.shadowColor = f.color;
        ctx.fillStyle = f.color;
        ctx.beginPath();
        ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      ctx.globalAlpha = 1;
      requestAnimationFrame(renderFrame);
    }

    window.addEventListener('resize', resize);
    resize();
    requestAnimationFrame(renderFrame);
  }

  // --------------------------------------------------------------------------
  // 6. Interactive Birthday Cake & Candle Blowing (Touch Hold + Tap + Mic Blow)
  // --------------------------------------------------------------------------
  function initBirthdayCake() {
    const flameGroup = document.getElementById('candle-flame');
    const smokeGroup = document.getElementById('candle-smoke');
    const stageCard = document.getElementById('cake-stage-card');
    const holdBtn = document.getElementById('blow-candle-btn');
    const holdBtnText = document.getElementById('blow-candle-btn-text');
    const micBtn = document.getElementById('mic-blow-btn');
    const relightBtn = document.getElementById('relight-candle-btn');
    const wishStatus = document.getElementById('wish-status-text');
    const afterBlowPanel = document.getElementById('after-blow-panel');
    const progressCircle = document.getElementById('wish-progress-circle');

    let isExtinguished = false;
    let holdInterval = null;
    let holdProgress = 0;
    const circumference = 2 * Math.PI * 26; // r=26

    function setRingProgress(percent) {
      if (!progressCircle) return;
      const offset = circumference - (percent / 100) * circumference;
      progressCircle.style.strokeDashoffset = String(offset);
    }

    function extinguishCandle() {
      if (isExtinguished) return;
      isExtinguished = true;
      clearInterval(holdInterval);

      if (flameGroup) {
        flameGroup.classList.remove('holding-wish');
        flameGroup.classList.add('extinguished');
      }
      if (smokeGroup) {
        smokeGroup.classList.remove('active');
        void smokeGroup.offsetWidth;
        smokeGroup.classList.add('active');
      }
      if (stageCard) {
        stageCard.classList.add('candle-out');
      }
      if (wishStatus) {
        wishStatus.textContent =
          (cfg.cakeSection && cfg.cakeSection.afterBlowTitle) ||
          'เย้! ขอให้คำอธิษฐานทุกข้อเป็นจริงนะ ✨';
      }
      if (afterBlowPanel) {
        afterBlowPanel.classList.remove('hidden');
      }
      if (holdBtn) {
        holdBtn.classList.add('hidden');
      }
      if (micBtn) {
        micBtn.classList.add('hidden');
      }
      if (relightBtn) {
        relightBtn.classList.remove('hidden');
      }

      SoundEngine.playCelebrationChord();
      if (!SoundEngine.isPlaying) {
        SoundEngine.startMusic();
      }
      ConfettiEngine.burst();
    }

    function relightCandle() {
      isExtinguished = false;
      holdProgress = 0;
      setRingProgress(0);

      if (flameGroup) {
        flameGroup.classList.remove('extinguished', 'holding-wish');
      }
      if (smokeGroup) {
        smokeGroup.classList.remove('active');
      }
      if (stageCard) {
        stageCard.classList.remove('candle-out');
      }
      if (wishStatus) {
        wishStatus.textContent =
          (cfg.cakeSection && cfg.cakeSection.instruction) ||
          'แตะค้างที่เปลวเทียนหรือปุ่มด้านล่างเพื่ออธิษฐานและเป่าเทียน';
      }
      if (afterBlowPanel) {
        afterBlowPanel.classList.add('hidden');
      }
      if (holdBtn) {
        holdBtn.classList.remove('hidden');
      }
      if (micBtn) {
        micBtn.classList.remove('hidden');
      }
      if (relightBtn) {
        relightBtn.classList.add('hidden');
      }
      if (holdBtnText) {
        holdBtnText.textContent = 'แตะค้างเพื่ออธิษฐานและเป่าเทียน';
      }
      SoundEngine.playSoftChime(523.25, 0.09);
    }

    function startHoldingWish(e) {
      if (e && e.cancelable) e.preventDefault();
      if (isExtinguished) return;

      if (flameGroup) flameGroup.classList.add('holding-wish');
      if (wishStatus) {
        wishStatus.textContent =
          (cfg.cakeSection && cfg.cakeSection.wishPromptWhileHolding) ||
          'กำลังเก็บคำอธิษฐานของเธอไว้ในดวงดาว...';
      }
      if (holdBtnText) {
        holdBtnText.textContent = 'กำลังอธิษฐาน... (ปล่อยเพื่อเป่าเทียน)';
      }

      SoundEngine.playSoftChime(440, 0.06);

      clearInterval(holdInterval);
      holdInterval = setInterval(() => {
        holdProgress = Math.min(100, holdProgress + 5);
        setRingProgress(holdProgress);
        if (holdProgress >= 100) {
          extinguishCandle();
        }
      }, 45);
    }

    function stopHoldingWish() {
      if (isExtinguished) return;
      clearInterval(holdInterval);
      if (flameGroup) flameGroup.classList.remove('holding-wish');

      // If user held at least briefly (or tapped on mobile/tablet), blow out the candle!
      if (holdProgress >= 15) {
        setRingProgress(100);
        extinguishCandle();
      } else {
        //Even on a quick tap, let's make it super responsive and blow out after a quick wish!
        setRingProgress(100);
        extinguishCandle();
      }
    }

    if (holdBtn) {
      holdBtn.addEventListener('pointerdown', startHoldingWish);
      holdBtn.addEventListener('pointerup', stopHoldingWish);
      holdBtn.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          extinguishCandle();
        }
      });
    }

    if (flameGroup) {
      flameGroup.addEventListener('pointerdown', startHoldingWish);
      flameGroup.addEventListener('pointerup', stopHoldingWish);
    }

    if (relightBtn) {
      relightBtn.addEventListener('click', relightCandle);
    }

    // Optional Microphone Blow Detection
    let micStream = null;
    let micAnimFrame = null;

    if (micBtn) {
      micBtn.addEventListener('click', async () => {
        if (isExtinguished) return;
        try {
          micStream = await navigator.mediaDevices.getUserMedia({ audio: true });
          SoundEngine.init();
          const audioCtx = SoundEngine.ctx;
          const source = audioCtx.createMediaStreamSource(micStream);
          const analyser = audioCtx.createAnalyser();
          analyser.fftSize = 256;
          source.connect(analyser);

          const data = new Uint8Array(analyser.frequencyBinCount);
          micBtn.textContent = 'เป่าลมเข้าที่ไมค์ได้เลย... 💨';

          const checkBlow = () => {
            if (isExtinguished) {
              stopMic();
              return;
            }
            analyser.getByteFrequencyData(data);
            // Low frequencies spike when blowing air into mic
            let lowFreqSum = 0;
            for (let i = 0; i < 18; i++) lowFreqSum += data[i];
            const avg = lowFreqSum / 18;

            if (avg > 82) {
              extinguishCandle();
              stopMic();
              return;
            }
            micAnimFrame = requestAnimationFrame(checkBlow);
          };
          checkBlow();
        } catch (_) {
          if (wishStatus) {
            wishStatus.textContent = 'แตะที่ปุ่มหรือที่เปลวเทียนเพื่อเป่าเทียนแทนได้เลยนะ ✨';
          }
        }
      });
    }

    function stopMic() {
      if (micAnimFrame) cancelAnimationFrame(micAnimFrame);
      if (micStream) {
        micStream.getTracks().forEach((t) => t.stop());
        micStream = null;
      }
      if (micBtn) micBtn.textContent = 'เป่าผ่านไมค์ 🎙️';
    }
  }

  // --------------------------------------------------------------------------
  // 7. 3D Wax-Seal Envelope Opener
  // --------------------------------------------------------------------------
  function initEnvelope() {
    const sealBtn = document.getElementById('open-envelope-btn');
    const closedBox = document.getElementById('envelope-closed-state');
    const openLetterBox = document.getElementById('envelope-open-state');
    const foldBackBtn = document.getElementById('close-letter-btn');

    if (sealBtn && closedBox && openLetterBox) {
      sealBtn.addEventListener('click', () => {
        SoundEngine.playSoftChime(587.33, 0.12);
        setTimeout(() => SoundEngine.playSoftChime(880, 0.1), 140);
        closedBox.classList.add('hidden');
        openLetterBox.classList.remove('hidden');
        openLetterBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
      });
    }

    if (foldBackBtn && closedBox && openLetterBox) {
      foldBackBtn.addEventListener('click', () => {
        openLetterBox.classList.add('hidden');
        closedBox.classList.remove('hidden');
        SoundEngine.playSoftChime(440, 0.08);
      });
    }
  }

  // --------------------------------------------------------------------------
  // 8. Celebration Confetti & Starlight Shower (#confetti-canvas)
  // --------------------------------------------------------------------------
  const ConfettiEngine = {
    particles: [],
    animating: false,

    burst() {
      const canvas = document.getElementById('confetti-canvas');
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const palette = ['#e8c792', '#b87d6b', '#fbf7f0', '#689f7c', '#f5b8a6', '#d4af37'];

      for (let i = 0; i < 110; i++) {
        const angle = (Math.random() * Math.PI) + Math.PI;
        const speed = Math.random() * 9 + 4;
        this.particles.push({
          x: w * 0.5 + (Math.random() - 0.5) * 140,
          y: h * 0.55,
          vx: Math.cos(angle) * speed * (Math.random() * 1.5),
          vy: -Math.random() * 12 - 4,
          size: Math.random() * 8 + 5,
          color: palette[Math.floor(Math.random() * palette.length)],
          rotation: Math.random() * 360,
          rotSpeed: (Math.random() - 0.5) * 11,
          gravity: 0.22 + Math.random() * 0.08,
          alpha: 1
        });
      }

      if (!this.animating) {
        this.animating = true;
        const step = () => {
          ctx.clearRect(0, 0, w, h);
          for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            p.x += p.vx;
            p.y += p.vy;
            p.vy += p.gravity;
            p.rotation += p.rotSpeed;
            if (p.y > h * 0.85) p.alpha -= 0.025;

            if (p.alpha <= 0 || p.y > h + 40) {
              this.particles.splice(i, 1);
              continue;
            }

            ctx.save();
            ctx.globalAlpha = Math.max(0, p.alpha);
            ctx.translate(p.x, p.y);
            ctx.rotate((p.rotation * Math.PI) / 180);
            ctx.fillStyle = p.color;
            ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.65);
            ctx.restore();
          }

          if (this.particles.length > 0) {
            requestAnimationFrame(step);
          } else {
            ctx.clearRect(0, 0, w, h);
            this.animating = false;
          }
        };
        requestAnimationFrame(step);
      }
    }
  };

  // --------------------------------------------------------------------------
  // 9. Initialize Everything on DOMContentLoaded
  // --------------------------------------------------------------------------
  document.addEventListener('DOMContentLoaded', () => {
    hydrateContent();
    initScenicCanvas();
    initBirthdayCake();
    initEnvelope();

    const audioBtn = document.getElementById('audio-toggle-btn');
    if (audioBtn) {
      audioBtn.addEventListener('click', () => {
        SoundEngine.toggleMusic();
      });
    }
  });
})();

