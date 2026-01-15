/* ========================================
 * Neural Network Visualizer
 * ======================================== */

class NeuralNetworkVisualizer {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');
    this.layers = [4, 6, 4]; // Default architecture: Input, Hidden, Output
    this.neurons = [];
    this.connections = [];
    this.animationFrame = null;
    this.isAnimating = false;
    this.animationSpeed = 5;

    this.colors = {
      neuron: 'rgba(100, 255, 218, 0.8)',
      neuronActive: 'rgba(100, 255, 218, 1)',
      connection: 'rgba(255, 255, 255, 0.1)',
      connectionActive: 'rgba(100, 255, 218, 0.6)',
      gradient: 'rgba(102, 126, 234, 0.3)'
    };

    this.init();
  }

  init() {
    this.resizeCanvas();
    this.calculatePositions();
    this.draw();
    window.addEventListener('resize', () => {
      this.resizeCanvas();
      this.calculatePositions();
      this.draw();
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

  calculatePositions() {
    this.neurons = [];
    this.connections = [];

    const layerSpacing = this.width / (this.layers.length + 1);
    const maxNeuronsInLayer = Math.max(...this.layers);

    // Calculate neuron positions
    this.layers.forEach((neuronCount, layerIndex) => {
      const layerNeurons = [];
      const neuronSpacing = this.height / (neuronCount + 1);

      for (let i = 0; i < neuronCount; i++) {
        layerNeurons.push({
          x: layerSpacing * (layerIndex + 1),
          y: neuronSpacing * (i + 1),
          activation: 0,
          layerIndex: layerIndex,
          neuronIndex: i
        });
      }

      this.neurons.push(layerNeurons);
    });

    // Calculate connections
    for (let i = 0; i < this.layers.length - 1; i++) {
      for (let j = 0; j < this.neurons[i].length; j++) {
        for (let k = 0; k < this.neurons[i + 1].length; k++) {
          this.connections.push({
            from: this.neurons[i][j],
            to: this.neurons[i + 1][k],
            weight: Math.random() * 2 - 1,
            activation: 0
          });
        }
      }
    }
  }

  draw() {
    this.ctx.clearRect(0, 0, this.width, this.height);

    // Draw connections
    this.connections.forEach(conn => {
      const alpha = conn.activation > 0 ? conn.activation : 0.1;
      const color = conn.activation > 0 ? this.colors.connectionActive : this.colors.connection;

      this.ctx.beginPath();
      this.ctx.moveTo(conn.from.x, conn.from.y);
      this.ctx.lineTo(conn.to.x, conn.to.y);
      this.ctx.strokeStyle = color.replace('0.6)', `${alpha})`).replace('0.1)', `${alpha * 0.1})`);
      this.ctx.lineWidth = conn.activation > 0 ? 2 : 1;
      this.ctx.stroke();
    });

    // Draw neurons
    this.neurons.forEach((layer, layerIndex) => {
      layer.forEach(neuron => {
        const radius = neuron.activation > 0 ? 12 + neuron.activation * 6 : 10;

        // Outer glow when active
        if (neuron.activation > 0) {
          const gradient = this.ctx.createRadialGradient(
            neuron.x, neuron.y, 0,
            neuron.x, neuron.y, radius * 2
          );
          gradient.addColorStop(0, `rgba(100, 255, 218, ${neuron.activation * 0.4})`);
          gradient.addColorStop(1, 'rgba(100, 255, 218, 0)');

          this.ctx.beginPath();
          this.ctx.arc(neuron.x, neuron.y, radius * 2, 0, Math.PI * 2);
          this.ctx.fillStyle = gradient;
          this.ctx.fill();
        }

        // Neuron body
        this.ctx.beginPath();
        this.ctx.arc(neuron.x, neuron.y, radius, 0, Math.PI * 2);
        this.ctx.fillStyle = neuron.activation > 0 ? this.colors.neuronActive : this.colors.neuron;
        this.ctx.fill();

        // Border
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        this.ctx.lineWidth = 2;
        this.ctx.stroke();
      });
    });

    // Draw layer labels
    this.ctx.font = '12px Inter';
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    this.ctx.textAlign = 'center';

    const labels = ['Input', ...Array(this.layers.length - 2).fill(0).map((_, i) => `Hidden ${i + 1}`), 'Output'];
    this.neurons.forEach((layer, i) => {
      this.ctx.fillText(labels[i], layer[0].x, 30);
    });
  }

  activate() {
    if (this.isAnimating) return;

    this.isAnimating = true;
    let currentLayer = 0;
    let currentNeuron = 0;
    let step = 0;
    const maxSteps = 100;
    // Map speed 1-10 to delay values (higher delay = slower animation)
    const speedMap = [30, 25, 20, 15, 12, 10, 8, 6, 4, 2];
    const speed = speedMap[this.animationSpeed - 1];

    const animate = () => {
      step++;

      // Reset all activations gradually
      this.neurons.forEach(layer => {
        layer.forEach(neuron => {
          neuron.activation = Math.max(0, neuron.activation - 0.05);
        });
      });

      this.connections.forEach(conn => {
        conn.activation = Math.max(0, conn.activation - 0.05);
      });

      // Activate current layer
      if (step % speed === 0) {
        if (currentLayer < this.layers.length) {
          this.neurons[currentLayer].forEach(neuron => {
            neuron.activation = 1;
          });

          // Activate connections to next layer
          if (currentLayer < this.layers.length - 1) {
            this.connections.forEach(conn => {
              if (conn.from.layerIndex === currentLayer) {
                conn.activation = Math.abs(conn.weight);
              }
            });
          }

          currentLayer++;
        }
      }

      this.draw();

      if (step < maxSteps) {
        this.animationFrame = requestAnimationFrame(animate);
      } else {
        this.isAnimating = false;
        // Fade out
        const fadeOut = () => {
          let allZero = true;
          this.neurons.forEach(layer => {
            layer.forEach(neuron => {
              if (neuron.activation > 0) {
                neuron.activation = Math.max(0, neuron.activation - 0.05);
                allZero = false;
              }
            });
          });

          this.connections.forEach(conn => {
            if (conn.activation > 0) {
              conn.activation = Math.max(0, conn.activation - 0.05);
              allZero = false;
            }
          });

          this.draw();

          if (!allZero) {
            requestAnimationFrame(fadeOut);
          }
        };
        fadeOut();
      }
    };

    animate();
  }

  addLayer() {
    if (this.layers.length >= 6) return; // Max 6 layers
    this.layers.splice(this.layers.length - 1, 0, 4); // Add before output layer
    this.calculatePositions();
    this.draw();
    this.updateInfo();
  }

  removeLayer() {
    if (this.layers.length <= 2) return; // Min 2 layers (input + output)
    this.layers.splice(this.layers.length - 2, 1); // Remove last hidden layer
    this.calculatePositions();
    this.draw();
    this.updateInfo();
  }

  reset() {
    this.layers = [4, 6, 4];
    this.calculatePositions();
    this.draw();
    this.updateInfo();
  }

  updateLayerSize(size) {
    if (this.layers.length > 2) {
      this.layers[this.layers.length - 2] = size; // Update last hidden layer
    } else {
      this.layers[0] = size; // Update input layer if only 2 layers
    }
    this.calculatePositions();
    this.draw();
    this.updateInfo();
  }

  setAnimationSpeed(speed) {
    this.animationSpeed = speed;
  }

  updateInfo() {
    document.getElementById('layerCount').textContent = this.layers.length;
    const totalNeurons = this.layers.reduce((sum, count) => sum + count, 0);
    document.getElementById('neuronCount').textContent = totalNeurons;
    document.getElementById('connectionCount').textContent = this.connections.length;
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  const visualizer = new NeuralNetworkVisualizer('neuralNetworkCanvas');

  // Control event listeners
  document.getElementById('addLayer').addEventListener('click', () => {
    visualizer.addLayer();
  });

  document.getElementById('removeLayer').addEventListener('click', () => {
    visualizer.removeLayer();
  });

  document.getElementById('resetNetwork').addEventListener('click', () => {
    visualizer.reset();
  });

  document.getElementById('layerSize').addEventListener('input', (e) => {
    const size = parseInt(e.target.value);
    visualizer.updateLayerSize(size);
    document.getElementById('layerSizeValue').textContent = `${size} neurons`;
  });

  document.getElementById('animationSpeed').addEventListener('input', (e) => {
    const speed = parseInt(e.target.value);
    visualizer.setAnimationSpeed(speed);
    const speedLabels = ['Very Slow', 'Slow', 'Slow', 'Medium', 'Medium', 'Medium', 'Fast', 'Fast', 'Very Fast', 'Ultra Fast'];
    document.getElementById('animationSpeedValue').textContent = speedLabels[speed - 1];
  });

  document.getElementById('activateNetwork').addEventListener('click', () => {
    visualizer.activate();
  });

  // Initial info update
  visualizer.updateInfo();
});
