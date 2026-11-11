/**
 * Circuitron Aura One - Apple-Grade Scrollytelling Canvas Engine (Ultra-Crisp 4K Edition)
 * Optimized for maximum image fidelity, zero muddying overlays, responsive scaling, 
 * and continuous high-density storytelling beats.
 */

class ScrollytellingEngine {
  constructor(canvasElement, trackElement, frameLoader) {
    this.canvas = canvasElement;
    this.ctx = this.canvas.getContext('2d', { alpha: false });
    this.track = trackElement;
    this.loader = frameLoader;

    this.currentFrame = 0;
    this.targetFrame = 0;
    this.lerpFactor = 0.16; // Responsive, snappy lerp
    this.scrollProgress = 0;
    this.lerpedProgress = 0;

    // Void background color matching exact frame edge (#0a0b0e / #07080a)
    this.voidColor = '#08090c';

    // DOM Elements
    this.beatHero = document.getElementById('beatHero');
    this.beatSeparation = document.getElementById('beatSeparation');
    this.beatNeural = document.getElementById('beatNeural');
    this.beatBlueprint = document.getElementById('beatBlueprint');
    this.reticlesLayer = document.getElementById('reticlesLayer');
    
    // Telemetry HUD & Timeline
    this.telemetryFrame = document.getElementById('hudFrameNum');
    this.telemetryPercent = document.getElementById('hudDisassemblyPercent');
    this.telemetryChapter = document.getElementById('hudChapterName');
    this.globalProgressBar = document.getElementById('globalProgressBar');
    this.floatingHudLeft = document.getElementById('floatingHudLeft');
    this.floatingHudRight = document.getElementById('floatingHudRight');

    // Interactive scrubber pills
    this.scrubberPills = document.querySelectorAll('.scrubber-step');

    this.isRendering = false;
    this.initCanvas();
    this.bindEvents();
  }

  initCanvas() {
    this.resizeCanvas();
    window.addEventListener('resize', () => this.resizeCanvas());
  }

  resizeCanvas() {
    // Crisp Retina scaling without artificial caps
    const dpr = window.devicePixelRatio || 1;
    const rect = this.canvas.getBoundingClientRect();
    
    this.width = rect.width || window.innerWidth;
    this.height = rect.height || window.innerHeight;
    
    this.canvas.width = Math.round(this.width * dpr);
    this.canvas.height = Math.round(this.height * dpr);
    
    // High-quality rendering properties
    this.ctx.imageSmoothingEnabled = true;
    this.ctx.imageSmoothingQuality = 'high';
    
    this.renderFrame(this.currentFrame);
  }

  bindEvents() {
    window.addEventListener('scroll', () => this.onScroll(), { passive: true });

    // Interactive timeline scrubber click
    if (this.scrubberPills) {
      this.scrubberPills.forEach((pill) => {
        pill.addEventListener('click', () => {
          const targetPct = parseFloat(pill.getAttribute('data-target-progress') || 0);
          this.scrollToProgress(targetPct);
          if (window.audioSynth) window.audioSynth.playSelectChime();
        });
      });
    }
  }

  scrollToProgress(pct) {
    const trackRect = this.track.getBoundingClientRect();
    const scrollableDistance = trackRect.height - window.innerHeight;
    const absoluteTop = window.scrollY + trackRect.top;
    const targetScrollY = absoluteTop + (scrollableDistance * pct);

    window.scrollTo({
      top: targetScrollY,
      behavior: 'smooth'
    });
  }

  onScroll() {
    const trackRect = this.track.getBoundingClientRect();
    const trackTop = -trackRect.top;
    const scrollableDistance = trackRect.height - window.innerHeight;

    if (scrollableDistance <= 0) return;

    // Compute normalized scroll progress [0..1]
    this.scrollProgress = Math.max(0, Math.min(1, trackTop / scrollableDistance));
    this.targetFrame = this.scrollProgress * (this.loader.totalFrames - 1);

    // Update global top progress bar
    if (this.globalProgressBar) {
      this.globalProgressBar.style.width = `${(this.scrollProgress * 100).toFixed(1)}%`;
    }
  }

  startRenderLoop() {
    if (this.isRendering) return;
    this.isRendering = true;

    const loop = () => {
      // Smooth frame interpolation
      const diff = this.targetFrame - this.currentFrame;
      if (Math.abs(diff) > 0.001) {
        this.currentFrame += diff * this.lerpFactor;
      } else {
        this.currentFrame = this.targetFrame;
      }

      this.lerpedProgress += (this.scrollProgress - this.lerpedProgress) * this.lerpFactor;

      this.renderFrame(this.currentFrame);
      this.updateStoryBeats(this.lerpedProgress, this.currentFrame);
      this.updateHUD(this.currentFrame, this.lerpedProgress);

      requestAnimationFrame(loop);
    };

    requestAnimationFrame(loop);
  }

  /**
   * Ultra-crisp frame drawing with maximum clarity and no contrast-destroying overlays
   */
  renderFrame(frameIndex) {
    const img = this.loader.getFrame(frameIndex);
    if (!img || !img.complete || img.naturalWidth === 0) return;

    const dpr = window.devicePixelRatio || 1;
    const cw = this.canvas.width;
    const ch = this.canvas.height;

    // 1. Clear base with exact dark void color
    this.ctx.fillStyle = this.voidColor;
    this.ctx.fillRect(0, 0, cw, ch);

    // 2. Compute proportional scaling - Prominent, crisp, filling the screen with presence
    const imgW = img.naturalWidth;
    const imgH = img.naturalHeight;
    
    // Scale up to 98% of viewport height/width so it feels commanding and immersive
    const scale = Math.min((cw * 0.96) / imgW, (ch * 0.94) / imgH);

    const dw = imgW * scale;
    const dh = imgH * scale;
    const dx = (cw - dw) / 2;
    const dy = (ch - dh) / 2;

    // Ensure smoothing is active on context
    this.ctx.imageSmoothingEnabled = true;
    this.ctx.imageSmoothingQuality = 'high';

    // 3. Draw image with 100% natural clarity and pristine highlights
    this.ctx.drawImage(img, Math.round(dx), Math.round(dy), Math.round(dw), Math.round(dh));
  }

  /**
   * Choreographs continuous storytelling beats without dead empty spaces
   */
  updateStoryBeats(progress, frame) {
    // Seamless continuous intervals with smooth cross-fades
    const isHero = progress >= 0.0 && progress <= 0.22;
    this.setBeatState(this.beatHero, isHero);

    const isSeparation = progress > 0.22 && progress <= 0.50;
    this.setBeatState(this.beatSeparation, isSeparation);

    const isNeural = progress > 0.50 && progress <= 0.76;
    this.setBeatState(this.beatNeural, isNeural);

    const isBlueprint = progress > 0.76 && progress <= 1.0;
    this.setBeatState(this.beatBlueprint, isBlueprint);

    // Show floating telemetry flanks during active exploration
    if (this.floatingHudLeft && this.floatingHudRight) {
      if (progress > 0.15) {
        this.floatingHudLeft.classList.add('visible');
        this.floatingHudRight.classList.add('visible');
      } else {
        this.floatingHudLeft.classList.remove('visible');
        this.floatingHudRight.classList.remove('visible');
      }
    }

    // Reticles & Component Hotspots visibility during exploded isometric phase (frame 145+)
    if (this.reticlesLayer) {
      if (frame >= 140 && progress >= 0.72) {
        this.reticlesLayer.classList.add('visible');
      } else {
        this.reticlesLayer.classList.remove('visible');
      }
    }

    // Update Scrubber Active Pill
    if (this.scrubberPills) {
      let activeIndex = 0;
      if (progress > 0.76) activeIndex = 3;
      else if (progress > 0.50) activeIndex = 2;
      else if (progress > 0.22) activeIndex = 1;

      this.scrubberPills.forEach((pill, idx) => {
        if (idx === activeIndex) {
          pill.classList.add('active');
        } else {
          pill.classList.remove('active');
        }
      });
    }
  }

  setBeatState(el, isActive) {
    if (!el) return;
    if (isActive) {
      el.classList.add('active');
    } else {
      el.classList.remove('active');
    }
  }

  /**
   * Updates real-time telemetry readout in the top HUD
   */
  updateHUD(frame, progress) {
    if (this.telemetryFrame) {
      const current = String(Math.round(frame) + 1).padStart(3, '0');
      this.telemetryFrame.textContent = `${current} / 240`;
    }

    if (this.telemetryPercent) {
      const percent = Math.min(100, Math.round((frame / (this.loader.totalFrames - 1)) * 100));
      this.telemetryPercent.textContent = `${percent}%`;
    }

    if (this.telemetryChapter) {
      let chapter = "ACT I • MONOLITH";
      if (progress > 0.22 && progress <= 0.50) chapter = "ACT II • UNCOUPLING";
      else if (progress > 0.50 && progress <= 0.76) chapter = "ACT III • SILICON CORE";
      else if (progress > 0.76) chapter = "ACT IV • EXPLODED ANATOMY";
      this.telemetryChapter.textContent = chapter;
    }
  }
}

window.ScrollytellingEngine = ScrollytellingEngine;
