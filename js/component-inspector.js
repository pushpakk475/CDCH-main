/**
 * Circuitron Aura One - Interactive Component Inspector
 * Coordinates floating technical reticles, hotspots, and the flyout glass spec drawer.
 */

const COMPONENT_DATA = {
  faceplate: {
    tag: "SURFACE ARCHITECTURE",
    title: "Ion-Strengthened Glass Faceplate",
    desc: "4.0mm diamond-milled monolithic crystal glass with an oleophobic anti-fingerprint surface and zero-gap bevel profile.",
    stats: [
      { label: "Surface Hardness", val: "9H Mohs" },
      { label: "Optical Clarity", val: "99.4%" },
      { label: "Thermal Shock", val: "Up to 300°C" },
      { label: "Coating", val: "Nano-Oleophobic" }
    ]
  },
  rocker: {
    tag: "TACTILE MECHANISM",
    title: "Beryllium-Copper Rocker Contacts",
    desc: "Precision dual-pivot actuation mechanism with beryllium-copper spring contacts engineered for zero contact bounce and instantaneous tactile feedback.",
    stats: [
      { label: "Actuation Force", val: "1.2 N" },
      { label: "Rated Cycles", val: "100,000+" },
      { label: "Contact Bounce", val: "<0.2 ms" },
      { label: "Acoustic Pitch", val: "Crisp 1.8kHz" }
    ]
  },
  neuralCore: {
    tag: "INTELLIGENT SILICON",
    title: "32-Bit Cortex-M4 Neural Logic Board",
    desc: "Dedicated power microprocessor sampling the AC sine wave at 20,000 Hz. Switches precisely at zero-crossing to eliminate arcing and spark degradation.",
    stats: [
      { label: "Sampling Rate", val: "20,000 Hz" },
      { label: "Arc Elimination", val: "99.98%" },
      { label: "Standby Draw", val: "<0.08 W" },
      { label: "Wireless", val: "Matter / Thread" }
    ]
  },
  ribbonBus: {
    tag: "CURRENT ROUTING",
    title: "High-Purity OFC Ribbon Distribution Bus",
    desc: "Multi-phase 99.99% oxygen-free copper flat harness with silicone dielectric shielding for zero crosstalk and ultra-low internal resistance.",
    stats: [
      { label: "Current Capacity", val: "32A Peak" },
      { label: "Purity", val: "99.99% OFC" },
      { label: "Temp Tolerance", val: "-40°C to +150°C" },
      { label: "Resistance", val: "0.003 Ω/m" }
    ]
  },
  subChassis: {
    tag: "STRUCTURAL CORE",
    title: "CNC T6061 Aluminum Sub-Chassis",
    desc: "Rigid aerospace-grade aluminum chassis providing EMI isolation, precise module alignment, and integrated passive heat sinking.",
    stats: [
      { label: "Tensile Strength", val: "310 MPa" },
      { label: "Thermal Cond.", val: "167 W/m·K" },
      { label: "Machining Tol.", val: "±0.02 mm" },
      { label: "EMI Shielding", val: ">60 dB" }
    ]
  },
  safetyBox: {
    tag: "ISOLATION HOUSING",
    title: "UL94-V0 Flame-Retardant Safety Enclosure",
    desc: "Self-extinguishing dielectric polycarbonate rear box engineered for 4,000V lightning surge isolation and universal junction-box fitment.",
    stats: [
      { label: "Dielectric Surge", val: "4,000V AC" },
      { label: "Flame Rating", val: "UL94-V0" },
      { label: "Ingress", val: "IP44 Sealed" },
      { label: "Compatibility", val: "Universal EU/US/IN" }
    ]
  }
};

class ComponentInspector {
  constructor() {
    this.drawer = document.getElementById('inspectorDetailCard');
    this.tagEl = document.getElementById('inspectorTag');
    this.titleEl = document.getElementById('inspectorTitle');
    this.descEl = document.getElementById('inspectorDesc');
    this.statsContainer = document.getElementById('inspectorStats');
    this.closeBtn = document.getElementById('inspectorCloseBtn');
    this.hotspots = document.querySelectorAll('.exploded-hotspot');

    this.activeHotspot = null;
    this.bindEvents();
  }

  bindEvents() {
    this.hotspots.forEach(spot => {
      spot.addEventListener('mouseenter', () => {
        if (window.audioSynth) window.audioSynth.playHoverChime();
      });

      spot.addEventListener('click', (e) => {
        e.stopPropagation();
        const partKey = spot.getAttribute('data-part');
        this.selectPart(partKey, spot);
      });
    });

    if (this.closeBtn) {
      this.closeBtn.addEventListener('click', () => this.closeDrawer());
    }

    // Close when clicking outside
    document.addEventListener('click', (e) => {
      if (this.drawer && !this.drawer.contains(e.target) && !e.target.closest('.exploded-hotspot')) {
        this.closeDrawer();
      }
    });
  }

  selectPart(partKey, hotspotEl) {
    const data = COMPONENT_DATA[partKey];
    if (!data) return;

    if (window.audioSynth) window.audioSynth.playSelectChime();

    // Toggle active hotspot class
    this.hotspots.forEach(h => h.classList.remove('active'));
    if (hotspotEl) hotspotEl.classList.add('active');
    this.activeHotspot = hotspotEl;

    // Populate drawer content
    if (this.tagEl) this.tagEl.textContent = data.tag;
    if (this.titleEl) this.titleEl.textContent = data.title;
    if (this.descEl) this.descEl.textContent = data.desc;

    if (this.statsContainer) {
      this.statsContainer.innerHTML = data.stats.map(s => `
        <div class="inspector-stat-item">
          <span>${s.label}</span>
          <strong>${s.val}</strong>
        </div>
      `).join('');
    }

    // Show drawer
    if (this.drawer) {
      this.drawer.classList.add('active');
    }
  }

  closeDrawer() {
    if (this.drawer) this.drawer.classList.remove('active');
    this.hotspots.forEach(h => h.classList.remove('active'));
    this.activeHotspot = null;
  }
}

window.ComponentInspector = ComponentInspector;
