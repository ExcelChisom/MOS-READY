/**
 * MOS-READY — Confetti Effect
 */
const Confetti = {
  canvas: null,
  ctx: null,

  init() {
    this.canvas = document.getElementById('confetti-canvas');
    if (this.canvas) {
      this.ctx = this.canvas.getContext('2d');
      this._resize();
      window.addEventListener('resize', () => this._resize());
    }
  },

  _resize() {
    if (this.canvas) {
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
    }
  },

  burst() {
    if (!this.ctx) this.init();
    if (!this.ctx) return;

    const particles = [];
    const colors = ['#7c5cfc', '#f72585', '#00f5d4', '#fee440', '#ff6b35', '#a8e10c', '#3a86ff'];
    const count = 80;

    for (let i = 0; i < count; i++) {
      particles.push({
        x: window.innerWidth / 2 + (Math.random() - 0.5) * 200,
        y: window.innerHeight / 2,
        vx: (Math.random() - 0.5) * 15,
        vy: Math.random() * -15 - 5,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 8 + 3,
        rotation: Math.random() * 360,
        rotSpeed: (Math.random() - 0.5) * 10,
        gravity: 0.3 + Math.random() * 0.2,
        opacity: 1,
        shape: Math.random() > 0.5 ? 'rect' : 'circle'
      });
    }

    const animate = () => {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      let alive = false;

      particles.forEach(p => {
        if (p.opacity <= 0) return;
        alive = true;

        p.x += p.vx;
        p.vy += p.gravity;
        p.y += p.vy;
        p.rotation += p.rotSpeed;
        p.opacity -= 0.008;
        p.vx *= 0.99;

        this.ctx.save();
        this.ctx.translate(p.x, p.y);
        this.ctx.rotate(p.rotation * Math.PI / 180);
        this.ctx.globalAlpha = Math.max(0, p.opacity);
        this.ctx.fillStyle = p.color;

        if (p.shape === 'rect') {
          this.ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
        } else {
          this.ctx.beginPath();
          this.ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
          this.ctx.fill();
        }

        this.ctx.restore();
      });

      if (alive) {
        requestAnimationFrame(animate);
      } else {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      }
    };

    animate();
  }
};

window.Confetti = Confetti;
