/**
 * Circuitron Aura One - High Performance 240-Frame Sequence Preloader
 * Optimized for progressive multi-tier caching, instant initial paint, and 0-flicker rendering.
 */

class FrameSequenceLoader {
  constructor(options = {}) {
    this.totalFrames = options.totalFrames || 240;
    this.basePath = options.basePath || 'ezgif-76f0eba4832cdac7-jpg';
    this.prefix = options.prefix || 'ezgif-frame-';
    this.ext = options.ext || '.jpg';
    
    this.frames = new Array(this.totalFrames).fill(null);
    this.loadedCount = 0;
    this.onProgress = options.onProgress || (() => {});
    this.onComplete = options.onComplete || (() => {});
    this.onFirstFrameReady = options.onFirstFrameReady || (() => {});
    
    this.isComplete = false;
  }

  getFramePath(index) {
    const frameNum = String(index + 1).padStart(3, '0');
    return `${this.basePath}/${this.prefix}${frameNum}${this.ext}`;
  }

  loadSingleFrame(index) {
    return new Promise((resolve) => {
      if (this.frames[index]) {
        resolve(this.frames[index]);
        return;
      }

      const img = new Image();
      img.src = this.getFramePath(index);
      
      img.onload = () => {
        this.frames[index] = img;
        this.loadedCount++;
        const percent = Math.min(100, Math.round((this.loadedCount / this.totalFrames) * 100));
        this.onProgress(percent, this.loadedCount, this.totalFrames);
        resolve(img);
      };

      img.onerror = () => {
        console.warn(`Failed to load frame ${index + 1}, retrying...`);
        // Fallback or retry
        setTimeout(() => {
          img.src = this.getFramePath(index);
        }, 1000);
      };
    });
  }

  async startLoading() {
    // 1. Tier 1: Instant load frame 0 (Hero view)
    const firstImg = await this.loadSingleFrame(0);
    this.onFirstFrameReady(firstImg);

    // 2. Tier 2: Preload coarse skeleton keyframes every 10 frames for instant navigation
    const keyframeIndices = [];
    for (let i = 0; i < this.totalFrames; i += 10) {
      if (i !== 0) keyframeIndices.push(i);
    }
    await Promise.all(keyframeIndices.map(idx => this.loadSingleFrame(idx)));

    // 3. Tier 3: Asynchronously batch-load remaining frames with concurrency control
    const remainingIndices = [];
    for (let i = 0; i < this.totalFrames; i++) {
      if (!this.frames[i]) remainingIndices.push(i);
    }

    const concurrency = 12;
    for (let i = 0; i < remainingIndices.length; i += concurrency) {
      const batch = remainingIndices.slice(i, i + concurrency);
      await Promise.all(batch.map(idx => this.loadSingleFrame(idx)));
    }

    this.isComplete = true;
    this.onComplete();
  }

  /**
   * Retrieves image for given index [0..totalFrames-1].
   * If target frame is still downloading, returns closest loaded neighbour to prevent black flash.
   */
  getFrame(index) {
    const clamped = Math.max(0, Math.min(this.totalFrames - 1, Math.floor(index)));
    if (this.frames[clamped]) {
      return this.frames[clamped];
    }

    // Find closest loaded neighbor
    let offset = 1;
    while (offset < this.totalFrames) {
      if (clamped - offset >= 0 && this.frames[clamped - offset]) {
        return this.frames[clamped - offset];
      }
      if (clamped + offset < this.totalFrames && this.frames[clamped + offset]) {
        return this.frames[clamped + offset];
      }
      offset++;
    }

    return this.frames[0]; // fallback to hero frame
  }
}

window.FrameSequenceLoader = FrameSequenceLoader;
