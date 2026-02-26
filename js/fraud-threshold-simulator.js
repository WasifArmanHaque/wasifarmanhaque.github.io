/* ========================================
 * Fraud Threshold Simulator
 * ======================================== */

class FraudThresholdSimulator {
  constructor() {
    this.canvas = document.getElementById('fraudThresholdCanvas');
    if (!this.canvas) return;

    this.ctx = this.canvas.getContext('2d');
    this.controls = {
      threshold: document.getElementById('fraudThreshold'),
      fraudRate: document.getElementById('fraudRate'),
      dailyVolume: document.getElementById('dailyVolume'),
      fpCost: document.getElementById('fpCost'),
      fnCost: document.getElementById('fnCost')
    };

    this.values = {
      threshold: document.getElementById('fraudThresholdValue'),
      fraudRate: document.getElementById('fraudRateValue'),
      dailyVolume: document.getElementById('dailyVolumeValue'),
      fpCost: document.getElementById('fpCostValue'),
      fnCost: document.getElementById('fnCostValue')
    };

    this.metrics = {
      precision: document.getElementById('precisionValue'),
      recall: document.getElementById('recallValue'),
      falsePositives: document.getElementById('falsePositivesValue'),
      businessCost: document.getElementById('businessCostValue')
    };

    this.nonFraudDist = { mean: 0.32, std: 0.18 };
    this.fraudDist = { mean: 0.74, std: 0.15 };

    this.init();
  }

  init() {
    this.resizeCanvas();
    this.bindEvents();
    this.update();

    window.addEventListener('resize', () => {
      this.resizeCanvas();
      this.update();
    });
  }

  bindEvents() {
    Object.values(this.controls).forEach((control) => {
      control.addEventListener('input', () => this.update());
    });
  }

  resizeCanvas() {
    const rect = this.canvas.getBoundingClientRect();
    const ratio = window.devicePixelRatio || 1;
    this.canvas.width = rect.width * ratio;
    this.canvas.height = rect.height * ratio;
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    this.ctx.scale(ratio, ratio);
    this.width = rect.width;
    this.height = rect.height;
  }

  update() {
    const threshold = Number(this.controls.threshold.value) / 100;
    const fraudRate = Number(this.controls.fraudRate.value) / 100;
    const dailyVolume = Number(this.controls.dailyVolume.value);
    const fpCost = Number(this.controls.fpCost.value);
    const fnCost = Number(this.controls.fnCost.value);

    this.values.threshold.textContent = threshold.toFixed(2);
    this.values.fraudRate.textContent = `${Math.round(fraudRate * 100)}%`;
    this.values.dailyVolume.textContent = this.formatInteger(dailyVolume);
    this.values.fpCost.textContent = `$${fpCost}`;
    this.values.fnCost.textContent = `$${fnCost}`;

    const tpr = this.tailProbability(threshold, this.fraudDist.mean, this.fraudDist.std);
    const fpr = this.tailProbability(threshold, this.nonFraudDist.mean, this.nonFraudDist.std);

    const fraudCount = dailyVolume * fraudRate;
    const nonFraudCount = dailyVolume - fraudCount;

    const tp = fraudCount * tpr;
    const fn = fraudCount * (1 - tpr);
    const fp = nonFraudCount * fpr;

    const precision = tp + fp > 0 ? tp / (tp + fp) : 0;
    const recall = tpr;
    const cost = fp * fpCost + fn * fnCost;

    this.metrics.precision.textContent = `${(precision * 100).toFixed(1)}%`;
    this.metrics.recall.textContent = `${(recall * 100).toFixed(1)}%`;
    this.metrics.falsePositives.textContent = this.formatInteger(Math.round(fp));
    this.metrics.businessCost.textContent = `$${this.formatInteger(Math.round(cost))}`;

    this.drawChart(threshold);
  }

  drawChart(threshold) {
    const ctx = this.ctx;
    const w = this.width;
    const h = this.height;

    ctx.clearRect(0, 0, w, h);

    const margin = { top: 30, right: 28, bottom: 36, left: 40 };
    const plotW = w - margin.left - margin.right;
    const plotH = h - margin.top - margin.bottom;

    ctx.fillStyle = 'rgba(255, 255, 255, 0.02)';
    ctx.fillRect(margin.left, margin.top, plotW, plotH);

    // Axes
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(margin.left, margin.top);
    ctx.lineTo(margin.left, margin.top + plotH);
    ctx.lineTo(margin.left + plotW, margin.top + plotH);
    ctx.stroke();

    const maxY = Math.max(
      this.gaussianPDF(this.nonFraudDist.mean, this.nonFraudDist.mean, this.nonFraudDist.std),
      this.gaussianPDF(this.fraudDist.mean, this.fraudDist.mean, this.fraudDist.std)
    ) * 1.15;

    const xToCanvas = (x) => margin.left + x * plotW;
    const yToCanvas = (y) => margin.top + plotH - (y / maxY) * plotH;

    // Non-fraud curve
    this.drawDistributionCurve(
      xToCanvas,
      yToCanvas,
      this.nonFraudDist.mean,
      this.nonFraudDist.std,
      'rgba(99, 181, 255, 0.9)',
      'rgba(99, 181, 255, 0.15)'
    );

    // Fraud curve
    this.drawDistributionCurve(
      xToCanvas,
      yToCanvas,
      this.fraudDist.mean,
      this.fraudDist.std,
      'rgba(255, 112, 142, 0.95)',
      'rgba(255, 112, 142, 0.18)'
    );

    // Threshold line
    const tx = xToCanvas(threshold);
    ctx.strokeStyle = 'rgba(100, 255, 218, 1)';
    ctx.lineWidth = 2;
    ctx.setLineDash([6, 6]);
    ctx.beginPath();
    ctx.moveTo(tx, margin.top);
    ctx.lineTo(tx, margin.top + plotH);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.fillStyle = 'rgba(100, 255, 218, 1)';
    ctx.font = '12px Inter';
    ctx.textAlign = 'center';
    ctx.fillText(`Threshold ${threshold.toFixed(2)}`, tx, margin.top - 8);

    // X-axis labels
    ctx.fillStyle = 'rgba(255, 255, 255, 0.55)';
    ctx.font = '11px Inter';
    ctx.textAlign = 'left';
    ctx.fillText('Low Risk (0.0)', margin.left, margin.top + plotH + 18);
    ctx.textAlign = 'right';
    ctx.fillText('High Risk (1.0)', margin.left + plotW, margin.top + plotH + 18);
  }

  drawDistributionCurve(xToCanvas, yToCanvas, mean, std, strokeColor, fillColor) {
    const ctx = this.ctx;
    const steps = 180;

    ctx.beginPath();
    for (let i = 0; i <= steps; i++) {
      const x = i / steps;
      const y = this.gaussianPDF(x, mean, std);
      const cx = xToCanvas(x);
      const cy = yToCanvas(y);
      if (i === 0) {
        ctx.moveTo(cx, cy);
      } else {
        ctx.lineTo(cx, cy);
      }
    }

    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.lineTo(xToCanvas(1), yToCanvas(0));
    ctx.lineTo(xToCanvas(0), yToCanvas(0));
    ctx.closePath();
    ctx.fillStyle = fillColor;
    ctx.fill();
  }

  gaussianPDF(x, mean, std) {
    const variance = std * std;
    const coefficient = 1 / Math.sqrt(2 * Math.PI * variance);
    const exponent = -((x - mean) * (x - mean)) / (2 * variance);
    return coefficient * Math.exp(exponent);
  }

  tailProbability(x, mean, std) {
    const z = (x - mean) / std;
    return 1 - this.normalCDF(z);
  }

  normalCDF(z) {
    return 0.5 * (1 + this.erf(z / Math.sqrt(2)));
  }

  erf(x) {
    const sign = x < 0 ? -1 : 1;
    const absX = Math.abs(x);
    const a1 = 0.254829592;
    const a2 = -0.284496736;
    const a3 = 1.421413741;
    const a4 = -1.453152027;
    const a5 = 1.061405429;
    const p = 0.3275911;

    const t = 1 / (1 + p * absX);
    const y = 1 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-absX * absX);

    return sign * y;
  }

  formatInteger(value) {
    return new Intl.NumberFormat('en-US').format(value);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new FraudThresholdSimulator();
});
