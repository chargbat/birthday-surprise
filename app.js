/**
 * ============================================================================
 * Starlight Over Champagne Sea — Artisanal Interactive Motion, Canvas & Audio
 * Crafted for Mobile, Tablet & Desktop (Touch, Hold, 3D Flip, Mic Blow, Audio)
 * ============================================================================
 */

(function () {
  const cfg = window.BIRTHDAY_CONFIG || {};

  // --------------------------------------------------------------------------
  // 0. Gentle Haptic Feedback Helper (Safe on iOS / Desktop)
  // --------------------------------------------------------------------------
  function triggerHaptic(pattern = 12) {
    try {
      if (typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function') {
        navigator.vibrate(pattern);
      }
    } catch (_) {
      // Ignore on unsupported devices
    }
  }

  function setText(id, text) {
    const el = document.getElementById(id);
    if (el && text !== undefined && text !== null) {
      el.textContent = text;
    }
  }

  function escapeHtml(str) {
    return String(str ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  // --------------------------------------------------------------------------
  // 1. Hydrate DOM Content from config.js
  // --------------------------------------------------------------------------
  function hydrateContent() {
    setText('hero-date-badge', cfg.birthdayDate || 'A Night Beneath the Stars');
    setText('hero-title', cfg.heroTitle || 'Happy Birthday');
    setText('hero-recipient', cfg.recipientName || 'ที่รักของเค้า');
    setText('hero-subtitle', cfg.heroSubtitle || '');

    if (cfg.cakeSection) {
      setText('cake-title', cfg.cakeSection.title);
      setText('cake-instruction', cfg.cakeSection.instruction);
      setText('wish-status-text', cfg.cakeSection.instruction);
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

    renderStarWishes();
  }

  // --------------------------------------------------------------------------
  // 2. Interactive Touch/Cursor Stardust Trail, Ripples & Floating Bokeh
  //    (#ambient-fx-canvas)
  // --------------------------------------------------------------------------
  const AmbientFx = {
    canvas: null,
    ctx: null,
    width: 0,
    height: 0,
    motes: [],
    trailParticles: [],
    ripples: [],
    shockwaves: [],
    wishSparks: [],
    isWishHolding: false,
    wishTarget: { x: 0, y: 0 },
    lastPointerTime: 0,

    init() {
      const canvas = document.getElementById('ambient-fx-canvas');
      if (!canvas) return;
      this.canvas = canvas;
      this.ctx = canvas.getContext('2d');

      const resize = () => {
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        canvas.width = this.width * dpr;
        canvas.height = this.height * dpr;
        this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      };

      resize();
      window.addEventListener('resize', resize);
      this.motes = [];

      // Pointer move stardust trail
      window.addEventListener(
        'pointermove',
        (e) => {
          const now = performance.now();
          if (now - this.lastPointerTime < 22) return;
          this.lastPointerTime = now;
          this.spawnTrailParticle(e.clientX, e.clientY);
        },
        { passive: true }
      );

      // Pointer down golden aura ripple + 7 tiny 4-point star sparks
      window.addEventListener(
        'pointerdown',
        (e) => {
          this.spawnTapRipple(e.clientX, e.clientY);
          this.spawnBurst(e.clientX, e.clientY, 7);
        },
        { passive: true }
      );

      const animate = () => {
        this.render();
        requestAnimationFrame(animate);
      };
      requestAnimationFrame(animate);
    },

    spawnTrailParticle(x, y) {
      if (!this.ctx) return;
      const count = Math.random() > 0.55 ? 2 : 1;
      for (let i = 0; i < count; i++) {
        this.trailParticles.push({
          x: x + (Math.random() - 0.5) * 10,
          y: y + (Math.random() - 0.5) * 10,
          vx: (Math.random() - 0.5) * 0.65,
          vy: -(Math.random() * 0.75 + 0.25),
          r: Math.random() * 2.1 + 0.9,
          wobble: Math.random() * Math.PI * 2,
          wobbleSpeed: Math.random() * 0.08 + 0.04,
          life: 1.0,
          decay: Math.random() * 0.022 + 0.018,
          isStar: Math.random() > 0.45,
          color: Math.random() > 0.3 ? '#f4dd9e' : '#fffaf0'
        });
      }
    },

    spawnTapRipple(x, y) {
      if (!this.ctx) return;
      this.ripples.push({
        x,
        y,
        r: 4,
        maxR: 48,
        life: 1.0
      });
    },

    spawnBurst(x, y, count = 7) {
      if (!this.ctx) return;
      for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.35;
        const speed = 1.4 + Math.random() * 2.4;
        this.trailParticles.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 0.35,
          r: Math.random() * 2.5 + 1.4,
          wobble: Math.random() * Math.PI * 2,
          wobbleSpeed: 0.06,
          life: 1.0,
          decay: 0.024 + Math.random() * 0.012,
          isStar: true,
          color: i % 2 === 0 ? '#f4dd9e' : '#fffdf7'
        });
      }
    },

    setWishHolding(isHolding, targetRect) {
      this.isWishHolding = Boolean(isHolding);
      if (targetRect) {
        this.wishTarget = {
          x: targetRect.left + targetRect.width * 0.5,
          y: targetRect.top + targetRect.height * 0.5
        };
      }
    },

    triggerWishShockwave(x, y) {
      if (!this.ctx) return;
      const cx = x || this.width * 0.5;
      const cy = y || this.height * 0.5;
      this.shockwaves.push({
        x: cx,
        y: cy,
        r: 8,
        maxR: Math.max(this.width, this.height) * 0.45,
        life: 1.0
      });
      this.spawnBurst(cx, cy, 18);
    },

    drawFourPointStar(ctx, x, y, radius) {
      const inner = radius * 0.36;
      ctx.beginPath();
      ctx.moveTo(x, y - radius);
      ctx.lineTo(x + inner, y - inner);
      ctx.lineTo(x + radius, y);
      ctx.lineTo(x + inner, y + inner);
      ctx.lineTo(x, y + radius);
      ctx.lineTo(x - inner, y + inner);
      ctx.lineTo(x - radius, y);
      ctx.lineTo(x - inner, y - inner);
      ctx.closePath();
      ctx.fill();
    },

    render() {
      const ctx = this.ctx;
      if (!ctx) return;
      ctx.clearRect(0, 0, this.width, this.height);

      // 1. Ambient Floating Gold & Botanical Motes
      for (const m of this.motes) {
        m.phase += m.speed;
        m.x += m.vx + Math.sin(m.phase) * 0.18;
        m.y += m.vy;

        if (m.y < -20) {
          m.y = this.height + 20;
          m.x = Math.random() * this.width;
        }
        if (m.x < -20) m.x = this.width + 20;
        if (m.x > this.width + 20) m.x = -20;

        const pulse = 0.35 + 0.65 * Math.abs(Math.sin(m.phase));
        ctx.save();
        ctx.globalAlpha = pulse;
        if (m.isBokeh) {
          const grad = ctx.createRadialGradient(m.x, m.y, 0, m.x, m.y, m.r * 3.2);
          grad.addColorStop(0, m.color);
          grad.addColorStop(1, 'rgba(244, 221, 158, 0)');
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(m.x, m.y, m.r * 3.2, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.fillStyle = m.color;
          ctx.beginPath();
          ctx.arc(m.x, m.y, m.r, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }

      // 2. Wish-Holding Spiral Sparks converging toward the candle flame
      if (this.isWishHolding) {
        const flameEl = document.getElementById('candle-flame');
        if (flameEl) {
          const rect = flameEl.getBoundingClientRect();
          this.wishTarget.x = rect.left + rect.width * 0.5;
          this.wishTarget.y = rect.top + rect.height * 0.5;
        }

        if (Math.random() < 0.75) {
          const angle = Math.random() * Math.PI * 2;
          const dist = 70 + Math.random() * 95;
          this.wishSparks.push({
            angle,
            dist,
            size: Math.random() * 2.4 + 1.2,
            life: 1.0,
            color: Math.random() > 0.35 ? '#f4dd9e' : '#fffaf0'
          });
        }
      }

      for (let i = this.wishSparks.length - 1; i >= 0; i--) {
        const sp = this.wishSparks[i];
        sp.angle += 0.085;
        sp.dist *= 0.94;
        sp.life -= 0.024;

        if (sp.life <= 0 || sp.dist < 4) {
          this.wishSparks.splice(i, 1);
          continue;
        }

        const sx = this.wishTarget.x + Math.cos(sp.angle) * sp.dist;
        const sy = this.wishTarget.y + Math.sin(sp.angle) * sp.dist * 0.72;

        ctx.save();
        ctx.globalAlpha = sp.life;
        ctx.fillStyle = sp.color;
        ctx.shadowBlur = 8;
        ctx.shadowColor = '#f4dd9e';
        this.drawFourPointStar(ctx, sx, sy, sp.size * 1.4);
        ctx.restore();
      }

      // 3. Expanding Tap Aura Ripples
      for (let i = this.ripples.length - 1; i >= 0; i--) {
        const rp = this.ripples[i];
        rp.r += (rp.maxR - rp.r) * 0.14;
        rp.life -= 0.038;
        if (rp.life <= 0) {
          this.ripples.splice(i, 1);
          continue;
        }
        ctx.save();
        ctx.globalAlpha = rp.life * 0.65;
        ctx.strokeStyle = '#f4dd9e';
        ctx.lineWidth = 1.35;
        ctx.beginPath();
        ctx.arc(rp.x, rp.y, rp.r, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }

      // 4. Candle Extinguish Wish Shockwaves
      for (let i = this.shockwaves.length - 1; i >= 0; i--) {
        const sw = this.shockwaves[i];
        sw.r += (sw.maxR - sw.r) * 0.085;
        sw.life -= 0.022;
        if (sw.life <= 0) {
          this.shockwaves.splice(i, 1);
          continue;
        }
        ctx.save();
        ctx.globalAlpha = sw.life * 0.75;
        ctx.strokeStyle = '#f4dd9e';
        ctx.lineWidth = 2.2 * sw.life;
        ctx.shadowBlur = 16;
        ctx.shadowColor = 'rgba(244, 221, 158, 0.65)';
        ctx.beginPath();
        ctx.arc(sw.x, sw.y, sw.r, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }

      // 5. Pointer Stardust Trail & Burst Sparks
      for (let i = this.trailParticles.length - 1; i >= 0; i--) {
        const p = this.trailParticles[i];
        p.wobble += p.wobbleSpeed;
        p.x += p.vx + Math.sin(p.wobble) * 0.25;
        p.y += p.vy;
        p.life -= p.decay;

        if (p.life <= 0) {
          this.trailParticles.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = Math.max(0, p.life);
        ctx.fillStyle = p.color;
        if (p.isStar) {
          this.drawFourPointStar(ctx, p.x, p.y, p.r * 1.55);
        } else {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }
    }
  };

  function initAmbientFxCanvas() {
    AmbientFx.init();
  }

  // --------------------------------------------------------------------------
  // 2B. Interactive 3D Card Tilt & Specular Foil Sheen
  // --------------------------------------------------------------------------
  function initInteractiveCards() {
    const selectors = [
      '.cake-stage-card',
      '.envelope-outer-box',
      '.letter-sheet-view',
      '.starlight-card-reveal'
    ];
    const cards = document.querySelectorAll(selectors.join(','));

    cards.forEach((card) => {
      card.addEventListener(
        'pointermove',
        (e) => {
          const rect = card.getBoundingClientRect();
          if (!rect.width || !rect.height) return;
          const xNorm = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
          const yNorm = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));
          const xPercent = (xNorm * 100).toFixed(1);
          const yPercent = (yNorm * 100).toFixed(1);
          const tiltRx = ((0.5 - yNorm) * 3.5).toFixed(2);
          const tiltRy = ((xNorm - 0.5) * 3.5).toFixed(2);

          card.style.setProperty('--pointer-x', `${xPercent}%`);
          card.style.setProperty('--pointer-y', `${yPercent}%`);
          card.style.setProperty('--tilt-rx', `${tiltRx}deg`);
          card.style.setProperty('--tilt-ry', `${tiltRy}deg`);
        },
        { passive: true }
      );

      card.addEventListener(
        'pointerleave',
        () => {
          card.style.setProperty('--pointer-x', '50%');
          card.style.setProperty('--pointer-y', '50%');
          card.style.setProperty('--tilt-rx', '0deg');
          card.style.setProperty('--tilt-ry', '0deg');
        },
        { passive: true }
      );
    });
  }

  // --------------------------------------------------------------------------
  // 2C. Scroll-Triggered Choreographed Section Reveals
  // --------------------------------------------------------------------------
  function initScrollReveal() {
    const revealEls = document.querySelectorAll('.reveal-on-scroll');
    if (!revealEls.length) return;

    if (!('IntersectionObserver' in window)) {
      revealEls.forEach((el) => el.classList.add('is-visible'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px'
      }
    );

    revealEls.forEach((el) => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.92) {
        el.classList.add('is-visible');
      }
      observer.observe(el);
    });
  }

  // --------------------------------------------------------------------------
  // 3. Render Starlight Wishes & Golden Voucher (#star-wishes-grid)
  // --------------------------------------------------------------------------
  function renderStarWishes() {
    const container = document.getElementById('star-wishes-grid');
    const detailBox = document.getElementById('star-wish-display');
    const detailTitle = document.getElementById('star-wish-title');
    const detailText = document.getElementById('star-wish-detail');
    const detailLabel = document.getElementById('star-wish-label');

    if (!container || !Array.isArray(cfg.starWishes) || cfg.starWishes.length === 0) return;

    const starFourPointSvg = `
      <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 1.75L14.65 9.35L22.25 12L14.65 14.65L12 22.25L9.35 14.65L1.75 12L9.35 9.35L12 1.75Z" />
      </svg>
    `;

    container.innerHTML = cfg.starWishes
      .map(
        (w, index) => `
      <button
        type="button"
        data-wish-index="${index}"
        aria-pressed="false"
        class="star-charm-button group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#e8c792]"
      >
        <span class="star-charm-icon group-hover:scale-110 transition-transform duration-300">
          ${starFourPointSvg}
        </span>
        <div class="min-w-0">
          <span class="block text-xs text-[#f4dd9e]/85 font-body-th mb-0.5">${escapeHtml(
            w.label
          )}</span>
          <span class="block font-heading-th text-[17px] md:text-[18px] text-[#fffaf0] font-medium leading-snug">${escapeHtml(
            w.title
          )}</span>
        </div>
      </button>
    `
      )
      .join('');

    const buttons = container.querySelectorAll('.star-charm-button');
    const notes = [523.25, 587.33, 659.25, 783.99];

    function selectWish(idx, userTriggered = false, sourceBtn = null) {
      const wish = cfg.starWishes[idx];
      if (!wish) return;

      buttons.forEach((b, i) => {
        const isCurrent = i === idx;
        b.classList.toggle('active', isCurrent);
        b.setAttribute('aria-pressed', String(isCurrent));
      });

      if (detailLabel) detailLabel.textContent = wish.label;
      if (detailTitle) detailTitle.textContent = wish.title;
      if (detailText) detailText.textContent = wish.detail;

      if (detailBox) {
        detailBox.classList.remove('hidden');
        const isGoldenVoucher = idx === 3 || wish.id === 'wish-4';
        detailBox.classList.toggle('golden-ticket-voucher', isGoldenVoucher);

        // Re-trigger tactile pop animation on every wish switch
        detailBox.classList.remove('wish-card-pop');
        void detailBox.offsetWidth;
        detailBox.classList.add('wish-card-pop');

        if (userTriggered) {
          detailBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      }

      if (userTriggered) {
        triggerHaptic(idx === 3 ? [15, 40, 20] : 12);
        SoundEngine.playSoftChime(notes[idx % notes.length], 0.12, 1.35);

        if (sourceBtn) {
          const rect = sourceBtn.getBoundingClientRect();
          AmbientFx.spawnBurst(
            rect.left + rect.width * 0.5,
            rect.top + rect.height * 0.5,
            idx === 3 ? 14 : 9
          );
        }
      }
    }

    buttons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const idx = Number(btn.getAttribute('data-wish-index'));
        selectWish(idx, true, btn);
      });
    });

    // Subtly pre-populate the first star wish so the card is ready
    selectWish(0, false);
  }

  // --------------------------------------------------------------------------
  // 4. Web Audio API Mechanical Music Box / Celesta + Sea Breeze Ambience
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
        this.ctx.resume().catch(() => {});
      }
    },

    /**
     * Synthesizes a realistic acoustic music box / celesta tine chime:
     * Fundamental sine wave + 2nd harmonic (18% gain, faster decay) + 3rd harmonic (6% gain, metallic tine attack)
     */
    playSoftChime(freq = 587.33, volume = 0.1, duration = 1.55) {
      try {
        this.init();
        if (!this.ctx) return;
        const now = this.ctx.currentTime;

        const masterGain = this.ctx.createGain();
        masterGain.connect(this.ctx.destination);
        masterGain.gain.setValueAtTime(0.0001, now);
        masterGain.gain.linearRampToValueAtTime(volume, now + 0.018);
        masterGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

        // 1. Fundamental Warm Sine
        const osc1 = this.ctx.createOscillator();
        const gain1 = this.ctx.createGain();
        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(freq, now);
        gain1.gain.setValueAtTime(1.0, now);
        osc1.connect(gain1);
        gain1.connect(masterGain);

        // 2. 2nd Harmonic (Octave overtone, 18% gain, faster decay)
        const osc2 = this.ctx.createOscillator();
        const gain2 = this.ctx.createGain();
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(freq * 2, now);
        gain2.gain.setValueAtTime(0.18, now);
        gain2.gain.exponentialRampToValueAtTime(0.001, now + duration * 0.55);
        osc2.connect(gain2);
        gain2.connect(masterGain);

        // 3. 3rd Harmonic (Delicate celesta bell shimmer, 6% gain, rapid decay)
        const osc3 = this.ctx.createOscillator();
        const gain3 = this.ctx.createGain();
        osc3.type = 'triangle';
        osc3.frequency.setValueAtTime(freq * 3, now);
        gain3.gain.setValueAtTime(0.06, now);
        gain3.gain.exponentialRampToValueAtTime(0.0008, now + duration * 0.28);
        osc3.connect(gain3);
        gain3.connect(masterGain);

        osc1.start(now);
        osc2.start(now);
        osc3.start(now);

        const stopTime = now + duration + 0.05;
        osc1.stop(stopTime);
        osc2.stop(stopTime);
        osc3.stop(stopTime);
      } catch (_) {
        // Ignore audio errors when blocked by autoplay policy
      }
    },

    playCelebrationChord() {
      const chord = [523.25, 659.25, 783.99, 1046.5, 1318.5];
      chord.forEach((freq, idx) => {
        setTimeout(() => this.playSoftChime(freq, 0.11, 1.8), idx * 90);
      });
    },

    toggleMusic() {
      triggerHaptic(10);
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

      this.startOceanWaveAmbience();

      // Acoustic Music Box & Rolled Harp Arpeggio arrangement of
      // "Can't Help Falling in Love" (Elvis Presley) in warm C Major
      // Format: [melodyFreq, beats, optionalRolledChordArray]
      const melody = [
        // "Wise men say... only fools rush in..."
        [523.25, 2.0, [261.63, 329.63, 392.00]], // Wise (C)
        [783.99, 2.0, [246.94, 329.63, 392.00]], // men (Em/B)
        [523.25, 3.0, [220.00, 261.63, 329.63]], // say (Am)
        [587.33, 0.5],                            // on-
        [659.25, 0.5],                            // -ly
        [698.46, 2.0, [174.61, 261.63, 349.23]], // fools (F)
        [659.25, 2.0, [196.00, 261.63, 329.63]], // rush (C/G)
        [587.33, 3.2, [196.00, 246.94, 293.66]], // in (G)

        // "But I can't help falling in love with you..."
        [392.00, 0.8],                            // But
        [440.00, 2.0, [174.61, 261.63, 349.23]], // I (F)
        [493.88, 2.0, [196.00, 246.94, 293.66]], // can't (G)
        [523.25, 2.0, [220.00, 261.63, 329.63]], // help (Am)
        [587.33, 1.0, [174.61, 261.63, 349.23]], // fall- (F)
        [659.25, 1.0],                            // -ing
        [698.46, 1.0],                            // in
        [659.25, 2.0, [196.00, 261.63, 329.63]], // love (C/G)
        [587.33, 2.0, [196.00, 246.94, 349.23]], // with (G7)
        [523.25, 3.8, [261.63, 329.63, 392.00]], // you (C)

        // "Like a river flows... surely to the sea..."
        [493.88, 0.6],                            // Like
        [659.25, 1.4, [164.81, 246.94, 329.63]], // a (Em)
        [783.99, 1.0],                            // ri-
        [987.77, 1.0],                            // -ver
        [880.00, 2.8, [220.00, 261.63, 329.63]], // flows (Am)
        [493.88, 0.6],                            // sure-
        [659.25, 1.4, [164.81, 246.94, 329.63]], // -ly (Em)
        [783.99, 1.0],                            // to
        [987.77, 1.0],                            // the
        [880.00, 2.8, [220.00, 261.63, 329.63]], // sea (Am)

        // "Darling so it goes... some things are meant to be..."
        [493.88, 0.6],                            // Dar-
        [659.25, 1.4, [164.81, 246.94, 329.63]], // -ling (Em)
        [783.99, 1.0],                            // so
        [987.77, 1.0],                            // it
        [880.00, 2.5, [220.00, 261.63, 329.63]], // goes (Am)
        [783.99, 1.2, [293.66, 349.23, 440.00]], // Some (Dm)
        [698.46, 1.8],                            // things
        [880.00, 1.0, [196.00, 293.66, 349.23]], // are (G7)
        [783.99, 1.5],                            // meant
        [659.25, 1.5],                            // to
        [587.33, 3.2, [196.00, 246.94, 293.66]], // be (G)

        // "Take my hand... take my whole life too..."
        [523.25, 2.0, [261.63, 329.63, 392.00]], // Take (C)
        [783.99, 2.0, [246.94, 329.63, 392.00]], // my (Em/B)
        [523.25, 3.0, [220.00, 261.63, 329.63]], // hand (Am)
        [587.33, 0.5],                            // take
        [659.25, 0.5],                            // my
        [698.46, 2.0, [174.61, 261.63, 349.23]], // whole (F)
        [659.25, 2.0, [196.00, 261.63, 329.63]], // life (C/G)
        [587.33, 3.2, [196.00, 246.94, 293.66]], // too (G)

        // "For I can't help falling in love with you..."
        [392.00, 0.8],                            // For
        [440.00, 2.0, [174.61, 261.63, 349.23]], // I (F)
        [493.88, 2.0, [196.00, 246.94, 293.66]], // can't (G)
        [523.25, 2.0, [220.00, 261.63, 329.63]], // help (Am)
        [587.33, 1.0, [174.61, 261.63, 349.23]], // fall- (F)
        [659.25, 1.0],                            // -ing
        [698.46, 1.0],                            // in
        [659.25, 2.0, [196.00, 261.63, 329.63]], // love (C/G)
        [587.33, 2.0, [196.00, 246.94, 349.23]], // with (G7)
        [523.25, 4.5, [261.63, 329.63, 392.00]]  // you (C)
      ];

      let noteIndex = 0;
      const playNextNote = () => {
        if (!this.isPlaying) return;
        const [freq, beats, chord] = melody[noteIndex];
        this.playSoftChime(freq, 0.088, Math.max(1.6, beats * 0.95));

        // Gently roll the warm harp accompaniment chord on downbeats
        if (Array.isArray(chord)) {
          chord.forEach((cFreq, idx) => {
            setTimeout(() => {
              if (this.isPlaying) {
                this.playSoftChime(cFreq, 0.032, 2.2);
              }
            }, idx * 75);
          });
        }

        noteIndex = (noteIndex + 1) % melody.length;
        this.melodyTimer = setTimeout(playNextNote, beats * 520);
      };

      if (this.melodyTimer) clearTimeout(this.melodyTimer);
      playNextNote();
    },

    startOceanWaveAmbience() {
      try {
        if (!this.ctx) return;
        if (this.seaGain) {
          this.seaGain.gain.setTargetAtTime(0.032, this.ctx.currentTime, 0.5);
          return;
        }
        const bufferSize = 3 * this.ctx.sampleRate;
        const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        let b0 = 0,
          b1 = 0,
          b2 = 0;
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          b0 = 0.997 * b0 + white * 0.028;
          b1 = 0.985 * b1 + white * 0.032;
          b2 = 0.95 * b2 + white * 0.045;
          // Gentle tidal swell envelope
          const swell = 0.65 + 0.35 * Math.sin((i / bufferSize) * Math.PI * 2);
          output[i] = (b0 + b1 + b2) * 0.11 * swell;
        }
        const pinkNoise = this.ctx.createBufferSource();
        pinkNoise.buffer = noiseBuffer;
        pinkNoise.loop = true;

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 340;

        this.seaGain = this.ctx.createGain();
        this.seaGain.gain.value = 0.032;

        pinkNoise.connect(filter);
        filter.connect(this.seaGain);
        this.seaGain.connect(this.ctx.destination);
        pinkNoise.start(0);
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
          this.seaGain.gain.setTargetAtTime(0.0001, this.ctx.currentTime, 0.25);
        } catch (_) {}
      }
      updateAudioUI(false);
    }
  };

  function updateAudioUI(playing) {
    const btn = document.getElementById('audio-toggle-btn');
    const label = document.getElementById('audio-toggle-label');
    const waveIndicator = document.getElementById('audio-wave-indicator');
    const vinylIcon = document.getElementById('audio-vinyl-icon');

    if (btn) btn.setAttribute('aria-pressed', String(playing));
    if (label) {
      label.textContent = playing ? 'กำลังบรรเลงเพลงริมทะเล' : 'เสียงกล่องดนตรี & คลื่นทะเล';
    }
    if (waveIndicator) {
      waveIndicator.classList.toggle('playing', playing);
    }
    if (vinylIcon) {
      vinylIcon.classList.toggle('playing', playing);
    }
  }

  // --------------------------------------------------------------------------
  // 5. Scenic Night Sky, Luminous Moon, Specular Sea & Fireflies (#starlight-canvas)
  // --------------------------------------------------------------------------
  function initScenicCanvas() {
    const canvas = document.getElementById('starlight-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let width = 0;
    let height = 0;
    let time = 0;
    let stars = [];
    let seaShimmerLines = [];
    let fireflies = [];
    let shootingStars = [];
    let stardustSparks = [];

    function resize() {
      const parent = canvas.parentElement || document.body;
      const rect = parent.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width || window.innerWidth;
      height = rect.height || window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      createSceneElements();
    }

    function createSceneElements() {
      // 1. Twinkling Stars with warm champagne, ivory, blush, and pale celestial blue tints
      const starCount = Math.min(Math.floor((width * height) / 3800), 175);
      const starPalette = ['#fffaf0', '#f6e3ba', '#ffd9c4', '#dce8ff', '#f3d39c'];
      stars = Array.from({ length: starCount }, () => ({
        x: Math.random() * width,
        y: Math.random() * (height * 0.7),
        r: Math.random() * 1.65 + 0.45,
        baseAlpha: Math.random() * 0.65 + 0.3,
        speed: Math.random() * 0.022 + 0.007,
        phase: Math.random() * Math.PI * 2,
        color: starPalette[Math.floor(Math.random() * starPalette.length)]
      }));

      // 2. Specular Moonlight Reflection Path on Water Surface (72% to 88% height)
      const lineCount = 38;
      seaShimmerLines = Array.from({ length: lineCount }, (_, idx) => {
        const progress = idx / (lineCount - 1); // 0 near horizon, 1 closer to shore
        const yRatio = 0.725 + progress * 0.155;
        return {
          yRatio,
          spreadFactor: 0.08 + progress * 0.28,
          widthBase: 14 + progress * 58,
          thickness: 0.8 + progress * 1.4,
          phase: Math.random() * Math.PI * 2,
          speed: 0.018 + (1 - progress) * 0.02,
          offsetSeed: (Math.random() - 0.5) * 2
        };
      });

      // 3. Coastal Meadow Fireflies with organic sine/turbulence drift
      const fireflyCount = Math.min(Math.max(Math.floor(width / 42), 20), 34);
      fireflies = Array.from({ length: fireflyCount }, () => ({
        x: Math.random() * width,
        y: height * (0.68 + Math.random() * 0.28),
        vx: (Math.random() - 0.5) * 0.32,
        vy: -(Math.random() * 0.28 + 0.08),
        r: Math.random() * 2.0 + 1.1,
        phase: Math.random() * Math.PI * 2,
        turbulenceSeed: Math.random() * 100,
        color: Math.random() > 0.3 ? '#f4dd9e' : '#9be8be'
      }));
    }

    function spawnShootingStar(targetX, targetY) {
      const startX =
        targetX !== undefined
          ? targetX
          : Math.random() * (width * 0.7) + width * 0.08;
      const startY =
        targetY !== undefined
          ? targetY
          : Math.random() * (height * 0.32) + height * 0.05;

      const angle = (Math.PI / 7) + (Math.random() - 0.5) * 0.22;
      const speed = 6.5 + Math.random() * 3.2;

      shootingStars.push({
        x: startX,
        y: startY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        len: 85 + Math.random() * 45,
        life: 1.0
      });
    }

    // Occasional gentle shooting star across the night sky
    setInterval(() => {
      if (document.visibilityState === 'visible' && shootingStars.length < 2) {
        spawnShootingStar();
      }
    }, 4600);

    // Interactive Touch/Click on Sky to summon a shooting star + celesta chime
    canvas.addEventListener('pointerdown', (e) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      spawnShootingStar(x, y);
      triggerHaptic(8);
      const pentatonicNotes = [523.25, 587.33, 659.25, 783.99, 880, 1046.5];
      const note = pentatonicNotes[Math.floor(Math.random() * pentatonicNotes.length)];
      SoundEngine.playSoftChime(note, 0.075, 1.4);
    });

    function drawLuminousMoon(moonX, moonY, moonRadius) {
      ctx.save();

      // Multi-stop atmospheric outer halo
      const haloGrad = ctx.createRadialGradient(
        moonX,
        moonY,
        moonRadius * 0.6,
        moonX,
        moonY,
        moonRadius * 5.2
      );
      haloGrad.addColorStop(0, 'rgba(255, 248, 224, 0.32)');
      haloGrad.addColorStop(0.3, 'rgba(244, 221, 158, 0.14)');
      haloGrad.addColorStop(0.65, 'rgba(212, 163, 89, 0.04)');
      haloGrad.addColorStop(1, 'rgba(12, 22, 38, 0)');

      ctx.fillStyle = haloGrad;
      ctx.beginPath();
      ctx.arc(moonX, moonY, moonRadius * 5.2, 0, Math.PI * 2);
      ctx.fill();

      // Luminous Warm Moon Disc
      const discGrad = ctx.createRadialGradient(
        moonX - moonRadius * 0.25,
        moonY - moonRadius * 0.25,
        moonRadius * 0.1,
        moonX,
        moonY,
        moonRadius
      );
      discGrad.addColorStop(0, '#fffdf7');
      discGrad.addColorStop(0.7, '#f7e6c0');
      discGrad.addColorStop(1, '#e6c587');

      ctx.shadowBlur = 24;
      ctx.shadowColor = 'rgba(247, 230, 192, 0.55)';
      ctx.fillStyle = discGrad;
      ctx.beginPath();
      ctx.arc(moonX, moonY, moonRadius, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      // Subtle earthshine / crescent sculptural shading on upper-right edge
      const shadeGrad = ctx.createRadialGradient(
        moonX + moonRadius * 0.38,
        moonY - moonRadius * 0.22,
        moonRadius * 0.1,
        moonX + moonRadius * 0.2,
        moonY - moonRadius * 0.1,
        moonRadius * 0.95
      );
      shadeGrad.addColorStop(0, 'rgba(18, 32, 56, 0.18)');
      shadeGrad.addColorStop(1, 'rgba(18, 32, 56, 0)');
      ctx.fillStyle = shadeGrad;
      ctx.beginPath();
      ctx.arc(moonX, moonY, moonRadius, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    }

    function renderFrame() {
      time += 0.016;
      ctx.clearRect(0, 0, width, height);

      // Position moon gracefully in the upper right-center sky
      const moonX = width * (width < 640 ? 0.78 : 0.74);
      const moonY = height * 0.16;
      const moonRadius = Math.max(18, Math.min(width * 0.035, 28));

      // 1. Twinkling Starfield & 4-Point Cross-Diffraction Spikes
      for (const s of stars) {
        s.phase += s.speed;
        const twinkle = 0.38 + 0.62 * Math.sin(s.phase);
        const alpha = s.baseAlpha * twinkle;

        ctx.globalAlpha = alpha;
        ctx.fillStyle = s.color;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();

        // Delicate 4-point cross-diffraction spikes on brightest stars
        if (s.r > 1.48 && twinkle > 0.76) {
          const spikeLen = s.r * (3.2 + twinkle * 1.4);
          ctx.strokeStyle = s.color;
          ctx.lineWidth = 0.65;
          ctx.beginPath();
          ctx.moveTo(s.x - spikeLen, s.y);
          ctx.lineTo(s.x + spikeLen, s.y);
          ctx.moveTo(s.x, s.y - spikeLen);
          ctx.lineTo(s.x, s.y + spikeLen);
          ctx.stroke();
        }
      }

      // 2. Luminous Moon with Multi-Stop Halo
      ctx.globalAlpha = 1;
      drawLuminousMoon(moonX, moonY, moonRadius);

      // 3. Realistic Specular Moonlight Reflection Path on Water Surface (72%-88% height)
      const reflectionCenterX = width * 0.5 + (moonX - width * 0.5) * 0.35;
      for (let i = 0; i < seaShimmerLines.length; i++) {
        const line = seaShimmerLines[i];
        line.phase += line.speed;

        const y = height * line.yRatio;
        const waveOffset =
          Math.sin(line.phase + i * 0.45) * (width * line.spreadFactor * 0.28) +
          line.offsetSeed * (width * line.spreadFactor * 0.45);
        const x = reflectionCenterX + waveOffset;
        const shimmerWidth =
          line.widthBase * (0.65 + 0.35 * Math.sin(line.phase * 1.3 + i));
        const alpha = 0.16 + 0.42 * Math.abs(Math.sin(line.phase));

        const lineGrad = ctx.createLinearGradient(
          x - shimmerWidth / 2,
          y,
          x + shimmerWidth / 2,
          y
        );
        lineGrad.addColorStop(0, 'rgba(244, 221, 158, 0)');
        lineGrad.addColorStop(0.5, `rgba(255, 245, 214, ${alpha})`);
        lineGrad.addColorStop(1, 'rgba(244, 221, 158, 0)');

        ctx.globalAlpha = 1;
        ctx.strokeStyle = lineGrad;
        ctx.lineWidth = line.thickness;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(x - shimmerWidth / 2, y);
        ctx.lineTo(x + shimmerWidth / 2, y);
        ctx.stroke();
      }

      // 4. Shooting Stars with Tapered Golden Trail + Stardust Wake Sparks
      for (let i = shootingStars.length - 1; i >= 0; i--) {
        const st = shootingStars[i];
        st.x += st.vx;
        st.y += st.vy;
        st.life -= 0.018;

        // Spawn tiny fading stardust spark particles along the wake
        if (st.life > 0.15 && Math.random() < 0.65) {
          stardustSparks.push({
            x: st.x - st.vx * 0.5 + (Math.random() - 0.5) * 4,
            y: st.y - st.vy * 0.5 + (Math.random() - 0.5) * 4,
            vx: (Math.random() - 0.5) * 0.4,
            vy: Math.random() * 0.45 + 0.1,
            r: Math.random() * 1.4 + 0.5,
            life: 0.75 + Math.random() * 0.25
          });
        }

        if (st.life <= 0) {
          shootingStars.splice(i, 1);
          continue;
        }

        const tailX = st.x - st.vx * (st.len / 6.5);
        const tailY = st.y - st.vy * (st.len / 6.5);

        const grad = ctx.createLinearGradient(st.x, st.y, tailX, tailY);
        grad.addColorStop(0, `rgba(255, 252, 240, ${st.life})`);
        grad.addColorStop(0.35, `rgba(244, 221, 158, ${st.life * 0.75})`);
        grad.addColorStop(1, 'rgba(244, 221, 158, 0)');

        ctx.globalAlpha = 1;
        ctx.strokeStyle = grad;
        ctx.lineWidth = 2.2;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(st.x, st.y);
        ctx.lineTo(tailX, tailY);
        ctx.stroke();

        // Glowing star head
        ctx.fillStyle = `rgba(255, 253, 245, ${st.life})`;
        ctx.beginPath();
        ctx.arc(st.x, st.y, 1.8, 0, Math.PI * 2);
        ctx.fill();
      }

      // Render fading stardust wake sparks
      for (let i = stardustSparks.length - 1; i >= 0; i--) {
        const sp = stardustSparks[i];
        sp.x += sp.vx;
        sp.y += sp.vy;
        sp.life -= 0.032;
        if (sp.life <= 0) {
          stardustSparks.splice(i, 1);
          continue;
        }
        ctx.globalAlpha = sp.life;
        ctx.fillStyle = '#f6e3ba';
        ctx.beginPath();
        ctx.arc(sp.x, sp.y, sp.r, 0, Math.PI * 2);
        ctx.fill();
      }

      // 5. Coastal Meadow Fireflies with Organic Sine Turbulence
      for (const f of fireflies) {
        f.phase += 0.035;
        const turbulenceX =
          Math.sin(time * 1.4 + f.turbulenceSeed) * 0.28 +
          Math.cos(f.phase * 0.8) * 0.18;
        const turbulenceY = Math.sin(time * 1.9 + f.turbulenceSeed) * 0.12;

        f.x += f.vx + turbulenceX;
        f.y += f.vy + turbulenceY;

        if (f.y < height * 0.52) {
          f.y = height * 0.96;
          f.x = Math.random() * width;
        }
        if (f.x < -20) f.x = width + 20;
        if (f.x > width + 20) f.x = -20;

        const pulse = 0.25 + 0.75 * Math.abs(Math.sin(f.phase));
        ctx.save();
        ctx.globalAlpha = pulse * 0.88;
        ctx.shadowBlur = 12;
        ctx.shadowColor = f.color;
        ctx.fillStyle = f.color;
        ctx.beginPath();
        ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
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
    const wishRipple = document.getElementById('candle-wish-ripple');
    const stageCard = document.getElementById('cake-stage-card');
    const holdBtn = document.getElementById('blow-candle-btn');
    const holdBtnText = document.getElementById('blow-candle-btn-text');
    const micBtn = document.getElementById('mic-blow-btn');
    const micBtnText = document.getElementById('mic-blow-btn-text');
    const relightBtn = document.getElementById('relight-candle-btn');
    const wishStatus = document.getElementById('wish-status-text');
    const afterBlowPanel = document.getElementById('after-blow-panel');
    const progressCircle = document.getElementById('wish-progress-circle');

    let isExtinguished = false;
    let holdInterval = null;
    let holdProgress = 0;

    // Dynamically calculate circumference from the SVG circle's r attribute
    const r = progressCircle ? Number(progressCircle.getAttribute('r')) || 20 : 20;
    const circumference = 2 * Math.PI * r;

    if (progressCircle) {
      progressCircle.style.strokeDasharray = String(circumference);
      progressCircle.style.strokeDashoffset = String(circumference);
    }

    function setRingProgress(percent) {
      if (!progressCircle) return;
      const clamped = Math.max(0, Math.min(100, percent));
      const offset = circumference - (clamped / 100) * circumference;
      progressCircle.style.strokeDashoffset = String(offset);
    }

    function setMicLabel(text) {
      if (micBtnText) {
        micBtnText.textContent = text;
      } else if (micBtn) {
        micBtn.textContent = text;
      }
    }

    function extinguishCandle() {
      if (isExtinguished) return;
      isExtinguished = true;
      clearInterval(holdInterval);
      setRingProgress(100);
      triggerHaptic([20, 45, 30]);

      AmbientFx.setWishHolding(false);

      if (flameGroup) {
        const rect = flameGroup.getBoundingClientRect();
        AmbientFx.triggerWishShockwave(
          rect.left + rect.width * 0.5,
          rect.top + rect.height * 0.5
        );
        flameGroup.classList.remove('holding-wish');
        flameGroup.classList.add('extinguished');
      } else {
        AmbientFx.triggerWishShockwave();
      }

      if (wishRipple) {
        wishRipple.classList.remove('active');
        void wishRipple.offsetWidth;
        wishRipple.classList.add('active');
      }

      if (smokeGroup) {
        smokeGroup.classList.remove('active');
        void smokeGroup.offsetWidth;
        smokeGroup.classList.add('active');
      }
      if (stageCard) {
        stageCard.classList.remove('holding-wish-stage');
        stageCard.classList.add('candle-out');
      }
      if (wishStatus) {
        wishStatus.textContent =
          (cfg.cakeSection && cfg.cakeSection.afterBlowTitle) ||
          'ขอให้คำอธิษฐานทุกข้อของเธอเป็นจริงนะ';
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
      triggerHaptic(12);

      AmbientFx.setWishHolding(false);

      if (flameGroup) {
        flameGroup.classList.remove('extinguished', 'holding-wish');
        const rect = flameGroup.getBoundingClientRect();
        AmbientFx.spawnBurst(rect.left + rect.width * 0.5, rect.top + rect.height * 0.5, 10);
      }
      if (wishRipple) {
        wishRipple.classList.remove('active');
      }
      if (smokeGroup) {
        smokeGroup.classList.remove('active');
      }
      if (stageCard) {
        stageCard.classList.remove('candle-out', 'holding-wish-stage');
      }
      if (wishStatus) {
        wishStatus.textContent =
          (cfg.cakeSection && cfg.cakeSection.instruction) ||
          'แตะค้างที่เปลวเทียนหรือปุ่มด้านล่างเพื่ออธิษฐาน แล้วปล่อยมือเพื่อดับเทียน';
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
      setMicLabel('เป่าลมผ่านไมโครโฟน');
      SoundEngine.playSoftChime(523.25, 0.09, 1.3);
    }

    const chargingHarpNotes = [440.0, 493.88, 523.25, 587.33, 659.25, 783.99];

    function startHoldingWish(e) {
      if (e && e.cancelable) e.preventDefault();
      if (isExtinguished) return;

      triggerHaptic(10);
      if (flameGroup) {
        flameGroup.classList.add('holding-wish');
        AmbientFx.setWishHolding(true, flameGroup.getBoundingClientRect());
      }
      if (stageCard) {
        stageCard.classList.add('holding-wish-stage');
      }
      if (wishStatus) {
        wishStatus.textContent =
          (cfg.cakeSection && cfg.cakeSection.wishPromptWhileHolding) ||
          'กำลังส่งคำอธิษฐานของเธอขึ้นไปเก็บไว้บนดวงดาว...';
      }
      if (holdBtnText) {
        holdBtnText.textContent = 'กำลังอธิษฐาน... (ปล่อยเพื่อเป่าเทียน)';
      }

      SoundEngine.playSoftChime(440, 0.065, 1.1);

      clearInterval(holdInterval);
      let stepCount = 0;
      holdInterval = setInterval(() => {
        holdProgress = Math.min(100, holdProgress + 5);
        setRingProgress(holdProgress);
        stepCount++;

        // Play soft ascending harp notes as the wish charges
        if (stepCount % 4 === 0 && holdProgress < 100) {
          const noteIdx = Math.min(
            Math.floor(holdProgress / 18),
            chargingHarpNotes.length - 1
          );
          SoundEngine.playSoftChime(chargingHarpNotes[noteIdx], 0.055, 1.0);
          triggerHaptic(6);
        }

        if (holdProgress >= 100) {
          extinguishCandle();
        }
      }, 45);
    }

    function stopHoldingWish() {
      if (isExtinguished) return;
      clearInterval(holdInterval);
      if (flameGroup) flameGroup.classList.remove('holding-wish');
      if (stageCard) stageCard.classList.remove('holding-wish-stage');
      AmbientFx.setWishHolding(false);

      setRingProgress(100);
      extinguishCandle();
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

    // Optional Microphone Wind-Blow Detection
    let micStream = null;
    let micAnimFrame = null;

    if (micBtn) {
      micBtn.addEventListener('click', async () => {
        if (isExtinguished) return;
        triggerHaptic(10);
        try {
          micStream = await navigator.mediaDevices.getUserMedia({ audio: true });
          SoundEngine.init();
          const audioCtx = SoundEngine.ctx;
          const source = audioCtx.createMediaStreamSource(micStream);
          const analyser = audioCtx.createAnalyser();
          analyser.fftSize = 256;
          source.connect(analyser);

          const data = new Uint8Array(analyser.frequencyBinCount);
          setMicLabel('เป่าลมเบาๆ เข้าที่ไมค์ได้เลย...');

          const checkBlow = () => {
            if (isExtinguished) {
              stopMic();
              return;
            }
            analyser.getByteFrequencyData(data);
            let lowFreqSum = 0;
            for (let i = 0; i < 18; i++) lowFreqSum += data[i];
            const avg = lowFreqSum / 18;

            if (avg > 80) {
              extinguishCandle();
              stopMic();
              return;
            }
            micAnimFrame = requestAnimationFrame(checkBlow);
          };
          checkBlow();
        } catch (_) {
          if (wishStatus) {
            wishStatus.textContent =
              'แตะที่ปุ่มหรือแตะที่เปลวเทียนเพื่อเป่าเทียนแทนได้เลยนะ';
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
      setMicLabel('เป่าลมผ่านไมโครโฟน');
    }
  }

  // --------------------------------------------------------------------------
  // 7. Choreographed 3D Wax-Seal Envelope Opener
  // --------------------------------------------------------------------------
  function initEnvelope() {
    const sealBtn = document.getElementById('open-envelope-btn');
    const closedBox = document.getElementById('envelope-closed-state');
    const openLetterBox = document.getElementById('envelope-open-state');
    const foldBackBtn = document.getElementById('close-letter-btn');
    let isOpening = false;

    if (sealBtn && closedBox && openLetterBox) {
      sealBtn.addEventListener('click', () => {
        if (isOpening) return;
        isOpening = true;

        triggerHaptic([15, 30, 20]);
        SoundEngine.playSoftChime(523.25, 0.1, 1.3);
        setTimeout(() => SoundEngine.playSoftChime(659.25, 0.11, 1.45), 110);
        setTimeout(() => SoundEngine.playSoftChime(783.99, 0.12, 1.65), 220);

        const rect = sealBtn.getBoundingClientRect();
        AmbientFx.spawnBurst(
          rect.left + rect.width * 0.5,
          rect.top + rect.height * 0.5,
          14
        );

        closedBox.classList.add('is-opening');

        setTimeout(() => {
          closedBox.classList.add('hidden');
          closedBox.classList.remove('is-opening');
          openLetterBox.classList.remove('hidden');
          openLetterBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
          isOpening = false;
        }, 420);
      });
    }

    if (foldBackBtn && closedBox && openLetterBox) {
      foldBackBtn.addEventListener('click', () => {
        triggerHaptic(10);
        openLetterBox.classList.add('hidden');
        closedBox.classList.remove('hidden', 'is-opening');
        SoundEngine.playSoftChime(440, 0.08, 1.2);
        closedBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
      });
    }
  }

  // --------------------------------------------------------------------------
  // 8. Luxury 3D Gold Foil & Rose Petal Confetti (#confetti-canvas)
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

      // Champagne gold foil, warm ivory, blush rose petal, and sage leaf palette
      const palette = [
        { main: '#e8c792', highlight: '#fff6df', shape: 'foil' },
        { main: '#d4a359', highlight: '#f4dd9e', shape: 'foil' },
        { main: '#e5b2a3', highlight: '#fae3dc', shape: 'petal' },
        { main: '#c98878', highlight: '#eabcb0', shape: 'petal' },
        { main: '#faf6f0', highlight: '#ffffff', shape: 'petal' },
        { main: '#689f7c', highlight: '#9ec9ad', shape: 'leaf' }
      ];

      for (let i = 0; i < 115; i++) {
        const style = palette[Math.floor(Math.random() * palette.length)];
        const spreadAngle = Math.PI + (Math.random() - 0.5) * 1.45;
        const speed = Math.random() * 10 + 4.5;

        this.particles.push({
          x: w * 0.5 + (Math.random() - 0.5) * 160,
          y: h * 0.54,
          vx: Math.cos(spreadAngle) * speed * (Math.random() * 1.45),
          vy: -Math.random() * 12.5 - 4.5,
          size: Math.random() * 8 + 5.5,
          color: style.main,
          highlight: style.highlight,
          shape: style.shape,
          tilt: Math.random() * 10 - 5,
          tiltAngle: Math.random() * Math.PI * 2,
          tiltAngleIncrement: Math.random() * 0.08 + 0.04,
          wobble: Math.random() * Math.PI * 2,
          wobbleSpeed: Math.random() * 0.07 + 0.03,
          rotation: Math.random() * Math.PI * 2,
          rotSpeed: (Math.random() - 0.5) * 0.08,
          gravity: 0.19 + Math.random() * 0.07,
          drag: 0.988,
          alpha: 1
        });
      }

      if (!this.animating) {
        this.animating = true;
        const step = () => {
          ctx.clearRect(0, 0, w, h);

          for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            p.wobble += p.wobbleSpeed;
            p.tiltAngle += p.tiltAngleIncrement;
            p.rotation += p.rotSpeed;

            p.vx *= p.drag;
            p.x += p.vx + Math.sin(p.wobble) * 1.1;
            p.y += p.vy;
            p.vy += p.gravity;
            p.tilt = Math.sin(p.tiltAngle) * 12;

            if (p.y > h * 0.82) {
              p.alpha -= 0.022;
            }

            if (p.alpha <= 0 || p.y > h + 50) {
              this.particles.splice(i, 1);
              continue;
            }

            const scaleY = Math.cos(p.tiltAngle);
            const shimmerMix = Math.abs(scaleY) > 0.65;

            ctx.save();
            ctx.globalAlpha = Math.max(0, p.alpha);
            ctx.translate(p.x, p.y);
            ctx.rotate(p.rotation);
            ctx.scale(1, Math.max(0.22, Math.abs(scaleY)));

            ctx.fillStyle = shimmerMix ? p.highlight : p.color;

            if (p.shape === 'petal') {
              // Soft organic rose petal silhouette
              ctx.beginPath();
              ctx.ellipse(0, 0, p.size * 0.65, p.size * 0.45, 0, 0, Math.PI * 2);
              ctx.fill();
            } else if (p.shape === 'leaf') {
              // Pointed botanical sage leaf silhouette
              ctx.beginPath();
              ctx.moveTo(-p.size * 0.7, 0);
              ctx.quadraticCurveTo(0, -p.size * 0.45, p.size * 0.7, 0);
              ctx.quadraticCurveTo(0, p.size * 0.45, -p.size * 0.7, 0);
              ctx.fill();
            } else {
              // Luxury chamfered champagne gold foil ribbon
              ctx.fillRect(
                -p.size * 0.6,
                -p.size * 0.35,
                p.size * 1.2,
                p.size * 0.7
              );
            }

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
    initAmbientFxCanvas();
    initScenicCanvas();
    initBirthdayCake();
    initEnvelope();
    initInteractiveCards();
    initScrollReveal();

    const audioBtn = document.getElementById('audio-toggle-btn');
    if (audioBtn) {
      audioBtn.addEventListener('click', () => {
        SoundEngine.toggleMusic();
      });
    }
  });
})();
