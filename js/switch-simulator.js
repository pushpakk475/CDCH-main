/**
 * Circuitron Aura One - Interactive Tactile Switch Lab
 * Simulates physical rocker actuation, Web Audio feedback, dynamic room lighting, and live electrical telemetry.
 */

class SwitchSimulator {
  constructor() {
    this.rocker1 = document.getElementById('rocker1');
    this.rocker2 = document.getElementById('rocker2');
    this.statusDot = document.getElementById('labStatusDot');
    this.statusText = document.getElementById('labStatusText');
    this.ambientBg = document.getElementById('ambientVoidBg');

    // Telemetry displays
    this.telemetryWatts = document.getElementById('labWatts');
    this.telemetryVolts = document.getElementById('labVolts');
    this.telemetryAmps = document.getElementById('labAmps');

    // Scene chips
    this.sceneChips = document.querySelectorAll('.scene-chip');

    this.state = {
      switch1: false,
      switch2: false,
      activeScene: 'cyber' // warm, cyber, studio, aurora
    };

    this.sceneGlows = {
      cyber: 'radial-gradient(circle at 50% 35%, rgba(10, 132, 255, 0.18) 0%, transparent 65%), radial-gradient(circle at 80% 80%, rgba(99, 102, 241, 0.15) 0%, transparent 50%), #07080a',
      warm: 'radial-gradient(circle at 50% 35%, rgba(229, 169, 60, 0.22) 0%, transparent 65%), radial-gradient(circle at 80% 80%, rgba(217, 119, 6, 0.12) 0%, transparent 50%), #07080a',
      studio: 'radial-gradient(circle at 50% 35%, rgba(240, 245, 255, 0.16) 0%, transparent 65%), radial-gradient(circle at 80% 80%, rgba(180, 200, 230, 0.1) 0%, transparent 50%), #07080a',
      aurora: 'radial-gradient(circle at 50% 35%, rgba(48, 209, 88, 0.18) 0%, transparent 65%), radial-gradient(circle at 80% 80%, rgba(14, 165, 233, 0.15) 0%, transparent 50%), #07080a'
    };

    this.bindEvents();
    this.updateTelemetry();
  }

  bindEvents() {
    if (this.rocker1) {
      this.rocker1.addEventListener('click', () => {
        this.state.switch1 = !this.state.switch1;
        this.toggleRocker(this.rocker1, this.state.switch1);
      });
    }

    if (this.rocker2) {
      this.rocker2.addEventListener('click', () => {
        this.state.switch2 = !this.state.switch2;
        this.toggleRocker(this.rocker2, this.state.switch2);
      });
    }

    this.sceneChips.forEach(chip => {
      chip.addEventListener('click', () => {
        this.sceneChips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        this.state.activeScene = chip.getAttribute('data-scene');
        if (window.audioSynth) window.audioSynth.playSelectChime();
        this.applyLighting();
      });
    });
  }

  toggleRocker(rockerEl, isOn) {
    if (isOn) {
      rockerEl.classList.add('on');
      rockerEl.classList.remove('off');
    } else {
      rockerEl.classList.remove('on');
      rockerEl.classList.add('off');
    }

    if (window.audioSynth) {
      window.audioSynth.playSwitchClick(isOn);
    }

    this.applyLighting();
    this.updateTelemetry();
  }

  applyLighting() {
    const anyActive = this.state.switch1 || this.state.switch2;

    if (this.statusDot) {
      if (anyActive) {
        this.statusDot.classList.add('active');
      } else {
        this.statusDot.classList.remove('active');
      }
    }

    if (this.statusText) {
      if (this.state.switch1 && this.state.switch2) {
        this.statusText.textContent = "Dual Zones Active • High Efficiency Load";
      } else if (this.state.switch1) {
        this.statusText.textContent = "Zone 1 Active • Main Luminaire";
      } else if (this.state.switch2) {
        this.statusText.textContent = "Zone 2 Active • Architectural Accent";
      } else {
        this.statusText.textContent = "Standby Mode • Ultra-Low 0.06W Draw";
      }
    }

    // Dynamic Atmosphere Glow
    if (this.ambientBg) {
      if (anyActive) {
        this.ambientBg.style.background = this.sceneGlows[this.state.activeScene] || this.sceneGlows.cyber;
      } else {
        this.ambientBg.style.background = 'radial-gradient(circle at 50% 35%, rgba(20, 24, 33, 0.4) 0%, transparent 60%), #07080a';
      }
    }
  }

  updateTelemetry() {
    let watts = 0.06; // standby
    let amps = 0.00;
    const volts = 230.4;

    if (this.state.switch1 && this.state.switch2) {
      watts = 184.2;
      amps = 0.80;
    } else if (this.state.switch1) {
      watts = 112.5;
      amps = 0.49;
    } else if (this.state.switch2) {
      watts = 71.7;
      amps = 0.31;
    }

    if (this.telemetryWatts) this.telemetryWatts.textContent = `${watts.toFixed(1)} W`;
    if (this.telemetryVolts) this.telemetryVolts.textContent = `${volts.toFixed(1)} V`;
    if (this.telemetryAmps) this.telemetryAmps.textContent = `${amps.toFixed(2)} A`;
  }
}

window.SwitchSimulator = SwitchSimulator;
