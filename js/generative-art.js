/* ========================================
 * Generative Art Engine
 * ======================================== */

class GenerativeArtEngine {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');
    this.patternType = 'spirograph';
    this.colorScheme = 'neon';
    this.complexity = 5;
    this.seed = Date.now();
    this.elementCount = 0;

    this.colorSchemes = {
      neon: ['#ff006e', '#fb5607', '#ffbe0b', '#8338ec', '#3a86ff', '#06ffa5'],
      pastel: ['#ffd6e0', '#ffef9f', '#c1fba4', '#a8e6cf', '#a8d8ea', '#dda3e8'],
      fire: ['#ff0a54', '#ff477e', '#ff5a5f', '#ff006e', '#06ffa5', '#00f5ff'],
      ocean: ['#05668d', '#028090', '#00a896', '#02c39a', '#64ffda', '#f0f3bd'],
      forest: ['#606c38', '#283618', '#dda15e', '#bc6c25', '#588b8b', '#457b9d'],
      monochrome: ['#ffffff', '#e0e0e0', '#c0c0c0', '#a0a0a0', '#808080', '#606060']
    };

    this.init();
  }

  init() {
    this.resizeCanvas();
    this.drawPlaceholder();
    window.addEventListener('resize', () => {
      this.resizeCanvas();
      this.generate();
    });
  }

  resizeCanvas() {
    const rect = this.canvas.getBoundingClientRect();
    this.canvas.width = rect.width * window.devicePixelRatio;
    this.canvas.height = rect.height * window.devicePixelRatio;
    this.ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    this.width = rect.width;
    this.height = rect.height;
  }

  drawPlaceholder() {
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
    this.ctx.fillRect(0, 0, this.width, this.height);

    this.ctx.font = '20px Inter';
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('Click "Generate Art" to create unique patterns', this.width / 2, this.height / 2);
  }

  clear() {
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.95)';
    this.ctx.fillRect(0, 0, this.width, this.height);
  }

  seededRandom() {
    // Simple seeded random number generator
    this.seed = (this.seed * 9301 + 49297) % 233280;
    return this.seed / 233280;
  }

  getColor() {
    const colors = this.colorSchemes[this.colorScheme];
    return colors[Math.floor(this.seededRandom() * colors.length)];
  }

  generate() {
    this.seed = Date.now();
    this.elementCount = 0;
    this.clear();

    switch (this.patternType) {
      case 'spirograph':
        this.generateSpirograph();
        break;
      case 'fractal':
        this.generateFractalTree();
        break;
      case 'circles':
        this.generateCirclePacking();
        break;
      case 'waves':
        this.generateWaveInterference();
        break;
      case 'particles':
        this.generateParticleFlow();
        break;
    }

    this.updateInfo();
  }

  generateSpirograph() {
    const centerX = this.width / 2;
    const centerY = this.height / 2;
    const R = Math.min(this.width, this.height) * 0.3;
    const r = R / (2 + this.complexity * 0.5);
    const d = r * (1 + this.seededRandom());
    const layers = 2 + Math.floor(this.complexity * 1.5);

    for (let layer = 0; layer < layers; layer++) {
      this.ctx.beginPath();
      this.ctx.strokeStyle = this.getColor();
      this.ctx.lineWidth = 2 - (layer * 0.1);
      this.ctx.globalAlpha = 0.6;

      const ratio = (r / R) * (1 + layer * 0.2);
      const steps = 1000 + this.complexity * 200;

      for (let i = 0; i <= steps; i++) {
        const t = (i / steps) * Math.PI * 2 * (1 + this.complexity * 2);
        const x = centerX + (R - r) * Math.cos(t) + d * Math.cos(((R - r) / r) * t);
        const y = centerY + (R - r) * Math.sin(t) + d * Math.sin(((R - r) / r) * t);

        if (i === 0) {
          this.ctx.moveTo(x, y);
        } else {
          this.ctx.lineTo(x, y);
        }
      }

      this.ctx.stroke();
      this.elementCount++;
    }

    this.ctx.globalAlpha = 1;
  }

  generateFractalTree() {
    const startX = this.width / 2;
    const startY = this.height * 0.9;
    const length = this.height * 0.25;
    const angle = -Math.PI / 2;
    const depth = 4 + Math.floor(this.complexity * 1.2);

    this.drawBranch(startX, startY, length, angle, depth);
  }

  drawBranch(x, y, length, angle, depth) {
    if (depth === 0) return;

    const endX = x + length * Math.cos(angle);
    const endY = y + length * Math.sin(angle);

    this.ctx.beginPath();
    this.ctx.moveTo(x, y);
    this.ctx.lineTo(endX, endY);
    this.ctx.strokeStyle = this.getColor();
    this.ctx.lineWidth = depth * 0.8;
    this.ctx.globalAlpha = 0.7;
    this.ctx.stroke();
    this.elementCount++;

    const branches = 2 + (this.seededRandom() > 0.7 ? 1 : 0);
    const angleSpread = (Math.PI / 6) * (1 + this.seededRandom() * 0.5);

    for (let i = 0; i < branches; i++) {
      const newAngle = angle + angleSpread * (i - branches / 2 + 0.5);
      const newLength = length * (0.6 + this.seededRandom() * 0.2);
      this.drawBranch(endX, endY, newLength, newAngle, depth - 1);
    }

    this.ctx.globalAlpha = 1;
  }

  generateCirclePacking() {
    const circles = [];
    const maxCircles = 50 + this.complexity * 30;
    const maxAttempts = 5000;
    let attempts = 0;

    while (circles.length < maxCircles && attempts < maxAttempts) {
      attempts++;

      const x = this.seededRandom() * this.width;
      const y = this.seededRandom() * this.height;
      let radius = 5 + this.seededRandom() * (50 + this.complexity * 10);

      let valid = true;
      for (const circle of circles) {
        const distance = Math.sqrt((x - circle.x) ** 2 + (y - circle.y) ** 2);
        if (distance < radius + circle.radius + 2) {
          valid = false;
          break;
        }
      }

      if (valid) {
        circles.push({ x, y, radius, color: this.getColor() });
      }
    }

    // Draw circles from largest to smallest
    circles.sort((a, b) => b.radius - a.radius);

    circles.forEach(circle => {
      this.ctx.beginPath();
      this.ctx.arc(circle.x, circle.y, circle.radius, 0, Math.PI * 2);
      this.ctx.strokeStyle = circle.color;
      this.ctx.lineWidth = 2;
      this.ctx.globalAlpha = 0.6;
      this.ctx.stroke();

      // Optional fill with low opacity
      this.ctx.fillStyle = circle.color;
      this.ctx.globalAlpha = 0.1;
      this.ctx.fill();

      this.elementCount++;
    });

    this.ctx.globalAlpha = 1;
  }

  generateWaveInterference() {
    const sources = 3 + Math.floor(this.complexity * 0.7);
    const wavePoints = [];

    // Generate random wave sources
    for (let i = 0; i < sources; i++) {
      wavePoints.push({
        x: this.seededRandom() * this.width,
        y: this.seededRandom() * this.height,
        phase: this.seededRandom() * Math.PI * 2,
        color: this.getColor()
      });
    }

    const gridSize = 10 - Math.floor(this.complexity * 0.5);
    const amplitude = 20 + this.complexity * 5;

    for (let x = 0; x < this.width; x += gridSize) {
      for (let y = 0; y < this.height; y += gridSize) {
        let totalAmplitude = 0;
        let closestSource = null;
        let minDistance = Infinity;

        wavePoints.forEach(source => {
          const distance = Math.sqrt((x - source.x) ** 2 + (y - source.y) ** 2);
          const wave = Math.sin(distance / 30 - source.phase) * amplitude;
          totalAmplitude += wave;

          if (distance < minDistance) {
            minDistance = distance;
            closestSource = source;
          }
        });

        const intensity = Math.abs(totalAmplitude) / (amplitude * sources);
        if (intensity > 0.3) {
          this.ctx.beginPath();
          this.ctx.arc(x, y, Math.min(gridSize / 2, intensity * 5), 0, Math.PI * 2);
          this.ctx.fillStyle = closestSource.color;
          this.ctx.globalAlpha = intensity * 0.6;
          this.ctx.fill();
          this.elementCount++;
        }
      }
    }

    this.ctx.globalAlpha = 1;
  }

  generateParticleFlow() {
    const flowLines = 30 + this.complexity * 15;
    const pointsPerLine = 100 + this.complexity * 50;

    for (let i = 0; i < flowLines; i++) {
      const startX = this.seededRandom() * this.width;
      const startY = this.seededRandom() * this.height;
      const color = this.getColor();

      let x = startX;
      let y = startY;
      const points = [];

      for (let j = 0; j < pointsPerLine; j++) {
        points.push({ x, y });

        // Create flow field based on position
        const angle = Math.sin(x * 0.01 + this.seed * 0.001) * Math.cos(y * 0.01) * Math.PI * 2;
        const speed = 1 + this.complexity * 0.3;

        x += Math.cos(angle) * speed;
        y += Math.sin(angle) * speed;

        // Wrap around edges
        if (x < 0) x = this.width;
        if (x > this.width) x = 0;
        if (y < 0) y = this.height;
        if (y > this.height) y = 0;
      }

      // Draw the flow line
      this.ctx.beginPath();
      this.ctx.strokeStyle = color;
      this.ctx.lineWidth = 1;
      this.ctx.globalAlpha = 0.4;

      points.forEach((point, index) => {
        if (index === 0) {
          this.ctx.moveTo(point.x, point.y);
        } else {
          this.ctx.lineTo(point.x, point.y);
        }
      });

      this.ctx.stroke();
      this.elementCount++;
    }

    this.ctx.globalAlpha = 1;
  }

  download() {
    const link = document.createElement('a');
    link.download = `generative-art-${this.patternType}-${this.seed}.png`;
    link.href = this.canvas.toDataURL();
    link.click();
  }

  updateInfo() {
    document.getElementById('artElements').textContent = this.elementCount;
    document.getElementById('artPattern').textContent = this.patternType.charAt(0).toUpperCase() + this.patternType.slice(1);
    document.getElementById('artSeed').textContent = this.seed.toString().slice(-6);
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  const artEngine = new GenerativeArtEngine('generativeArtCanvas');

  // Pattern type control
  document.getElementById('patternType').addEventListener('change', (e) => {
    artEngine.patternType = e.target.value;
  });

  // Color scheme control
  document.getElementById('colorScheme').addEventListener('change', (e) => {
    artEngine.colorScheme = e.target.value;
  });

  // Complexity control
  document.getElementById('artComplexity').addEventListener('input', (e) => {
    const complexity = parseInt(e.target.value);
    artEngine.complexity = complexity;
    const labels = ['Very Low', 'Low', 'Low', 'Medium', 'Medium', 'Medium', 'High', 'High', 'Very High', 'Ultra'];
    document.getElementById('complexityValue').textContent = labels[complexity - 1];
  });

  // Generate button
  document.getElementById('generateArt').addEventListener('click', () => {
    artEngine.generate();
  });

  // Download button
  document.getElementById('downloadArt').addEventListener('click', () => {
    artEngine.download();
  });
});
