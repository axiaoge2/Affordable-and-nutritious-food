// 五彩纸屑效果工具函数

export interface ConfettiConfig {
  particleCount?: number;
  spread?: number;
  startVelocity?: number;
  decay?: number;
  scalar?: number;
}

export const triggerConfetti = (config: ConfettiConfig = {}) => {
  const {
    particleCount = 50,
    spread = 70,
    startVelocity = 30,
    decay = 0.9,
    scalar = 1
  } = config;

  // 创建五彩纸屑粒子
  const colors = ['#ff6b6b', '#ffd93d', '#6bcf7f', '#4d96ff', '#c44dff', '#ff9ff3'];
  const particles: HTMLDivElement[] = [];

  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    const color = colors[Math.floor(Math.random() * colors.length)];
    const angle = (Math.random() * spread - spread / 2) * (Math.PI / 180);
    const velocity = startVelocity * (0.5 + Math.random() * 0.5);

    particle.style.cssText = `
      position: fixed;
      width: ${4 + Math.random() * 4}px;
      height: ${8 + Math.random() * 8}px;
      background: ${color};
      left: 50%;
      top: 50%;
      pointer-events: none;
      z-index: 9999;
      border-radius: 2px;
      transform-origin: center;
    `;

    document.body.appendChild(particle);
    particles.push(particle);

    // 动画参数
    let x = 0;
    let y = 0;
    let vx = Math.cos(angle) * velocity;
    let vy = Math.sin(angle) * velocity - Math.random() * 10;
    let rotation = Math.random() * 360;
    const rotationSpeed = (Math.random() - 0.5) * 20;
    let opacity = 1;

    const animate = () => {
      // 更新位置
      x += vx;
      y += vy;
      vy += 0.5; // 重力
      vx *= decay;
      rotation += rotationSpeed;
      opacity -= 0.01;

      particle.style.transform = `translate(${x}px, ${y}px) rotate(${rotation}deg) scale(${scalar})`;
      particle.style.opacity = opacity.toString();

      if (opacity > 0 && y < window.innerHeight) {
        requestAnimationFrame(animate);
      } else {
        particle.remove();
      }
    };

    animate();
  }

  // 清理
  setTimeout(() => {
    particles.forEach(p => p.remove());
  }, 5000);
};

export const celebrateSuccess = () => {
  // 连续爆炸效果
  triggerConfetti({ particleCount: 100, spread: 120, startVelocity: 45 });
  setTimeout(() => {
    triggerConfetti({ particleCount: 50, spread: 80, startVelocity: 35 });
  }, 200);
};
