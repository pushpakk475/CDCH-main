/**
 * Circuitron Aura One - Main Application Bootstrap & UI Controller
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Elements
  const preloader = document.getElementById('scrollyPreloader');
  const preloaderFill = document.getElementById('preloaderFill');
  const preloaderPercent = document.getElementById('preloaderPercent');
  const canvasEl = document.getElementById('scrollyCanvas');
  const trackEl = document.getElementById('scrollyTrack');
  const soundBtn = document.getElementById('soundToggleBtn');
  const stickyBuyBar = document.getElementById('stickyBuyBar');

  // Finish selector
  const finishCards = document.querySelectorAll('.finish-card');

  // Preorder Modal elements
  const openModalBtns = document.querySelectorAll('.open-preorder-modal');
  const closeModalBtn = document.getElementById('modalCloseBtn');
  const modalOverlay = document.getElementById('modalOverlay');
  const modalPrice = document.getElementById('modalPrice');
  const gangSelect = document.getElementById('gangSelect');
  const finishSelect = document.getElementById('finishSelect');
  const engravingInput = document.getElementById('engravingInput');
  const engravingPreview = document.getElementById('engravingPreview');
  const checkoutBtn = document.getElementById('checkoutSubmitBtn');

  // 2. Initialize Frame Sequence Loader (240 Frames)
  const loader = new FrameSequenceLoader({
    totalFrames: 240,
    basePath: 'ezgif-76f0eba4832cdac7-jpg',
    prefix: 'ezgif-frame-',
    ext: '.jpg',
    onProgress: (percent) => {
      if (preloaderFill) preloaderFill.style.width = `${percent}%`;
      if (preloaderPercent) preloaderPercent.textContent = `${percent}%`;
    },
    onComplete: () => {
      // All frames cached - hide preloader smoothly
      setTimeout(() => {
        if (preloader) preloader.classList.add('loaded');
      }, 200);
    }
  });

  // 3. Initialize Scrollytelling Engine IMMEDIATELY
  const scrollyEngine = new ScrollytellingEngine(canvasEl, trackEl, loader);
  scrollyEngine.startRenderLoop();

  // Start downloading frames
  loader.startLoading();

  // 4. Initialize Interactive Components
  const inspector = new ComponentInspector();
  const labSimulator = new SwitchSimulator();

  // 5. Sound Design Button
  if (soundBtn) {
    soundBtn.addEventListener('click', () => {
      const isSoundOn = window.audioSynth.toggleSound();
      if (isSoundOn) {
        soundBtn.classList.add('active');
        soundBtn.querySelector('.btn-label').textContent = 'Audio On';
      } else {
        soundBtn.classList.remove('active');
        soundBtn.querySelector('.btn-label').textContent = 'Audio Off';
      }
    });
  }

  // 6. Sticky Buy Bar Observer
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    if (scrollY > window.innerHeight * 0.7) {
      stickyBuyBar.classList.add('visible');
    } else {
      stickyBuyBar.classList.remove('visible');
    }
  }, { passive: true });

  // 7. Finish Studio Switcher
  finishCards.forEach(card => {
    card.addEventListener('click', () => {
      finishCards.forEach(c => c.classList.remove('active'));
      card.classList.add('active');
      const finishKey = card.getAttribute('data-finish');
      if (finishSelect) finishSelect.value = finishKey;
      if (window.audioSynth) window.audioSynth.playSelectChime();
    });
  });

  // 8. Modal Pre-Order Drawer Handlers
  openModalBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      if (modalOverlay) modalOverlay.classList.add('open');
      if (window.audioSynth) window.audioSynth.playSelectChime();
    });
  });

  if (closeModalBtn) {
    closeModalBtn.addEventListener('click', () => {
      if (modalOverlay) modalOverlay.classList.remove('open');
    });
  }

  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) {
        modalOverlay.classList.remove('open');
      }
    });
  }

  // Live Pricing Calculation
  const gangPrices = {
    '1': 99,
    '2': 129,
    '4': 189,
    '6': 249
  };

  const updateModalPrice = () => {
    const gangVal = gangSelect ? gangSelect.value : '2';
    const base = gangPrices[gangVal] || 129;
    if (modalPrice) modalPrice.textContent = `$${base}`;
  };

  if (gangSelect) {
    gangSelect.addEventListener('change', updateModalPrice);
  }

  // Live Laser Engraving Preview
  if (engravingInput && engravingPreview) {
    engravingInput.addEventListener('input', () => {
      const text = engravingInput.value.trim().toUpperCase();
      engravingPreview.textContent = text ? `[ ${text} ]` : `[ AURA ONE ]`;
    });
  }

  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', (e) => {
      e.preventDefault();
      checkoutBtn.innerHTML = `
        <span style="display:inline-flex; align-items:center; gap:8px;">
          <span class="status-dot active"></span> Reserved Successfully
        </span>
      `;
      checkoutBtn.style.background = '#30d158';
      checkoutBtn.style.color = '#000000';
      if (window.audioSynth) window.audioSynth.playSelectChime();

      setTimeout(() => {
        if (modalOverlay) modalOverlay.classList.remove('open');
        setTimeout(() => {
          checkoutBtn.innerHTML = 'Complete Reservation';
          checkoutBtn.style.background = '#ffffff';
        }, 500);
      }, 1800);
    });
  }

  // 9. Smooth Scrolling Navigation Anchor Links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || !targetId) return;
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        targetEl.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
});
