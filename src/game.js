const canvas = document.querySelector('#game');
const ctx = canvas.getContext('2d');
const scoreEl = document.querySelector('#score');
const bestEl = document.querySelector('#best-score');
const speedEl = document.querySelector('#speed');
const startButton = document.querySelector('#start-button');
const overlay = document.querySelector('#overlay');

const keys = new Set();
const state = {
  running: false,
  paused: false,
  score: 0,
  best: Number(localStorage.getItem('ark-best-score') || 0),
  speed: 1,
  lastTime: 0,
  spawnTimer: 0,
  crystalTimer: 0,
  meteors: [],
  crystals: [],
  stars: Array.from({ length: 90 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    r: Math.random() * 1.8 + 0.3,
    v: Math.random() * 60 + 30,
  })),
  player: { x: canvas.width / 2 - 22, y: canvas.height - 86, w: 44, h: 56 },
};

bestEl.textContent = state.best;

function resetGame() {
  state.running = true;
  state.paused = false;
  state.score = 0;
  state.speed = 1;
  state.spawnTimer = 0;
  state.crystalTimer = 0;
  state.meteors = [];
  state.crystals = [];
  state.player.x = canvas.width / 2 - state.player.w / 2;
  state.lastTime = performance.now();
  overlay.classList.add('hidden');
  startButton.textContent = '重新开始';
  requestAnimationFrame(loop);
}

function drawBackground(dt) {
  ctx.fillStyle = '#020511';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = 'rgba(56, 248, 255, 0.16)';
  ctx.lineWidth = 1;
  for (const star of state.stars) {
    star.y += star.v * state.speed * dt;
    if (star.y > canvas.height) {
      star.y = -4;
      star.x = Math.random() * canvas.width;
    }
    ctx.beginPath();
    ctx.moveTo(star.x, star.y);
    ctx.lineTo(star.x, star.y + star.r * 5 * state.speed);
    ctx.stroke();
  }
}

function drawPlayer() {
  const { x, y, w, h } = state.player;
  const gradient = ctx.createLinearGradient(x, y, x + w, y + h);
  gradient.addColorStop(0, '#38f8ff');
  gradient.addColorStop(1, '#ff4fd8');
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.moveTo(x + w / 2, y);
  ctx.lineTo(x + w, y + h * 0.78);
  ctx.lineTo(x + w * 0.62, y + h);
  ctx.lineTo(x + w * 0.38, y + h);
  ctx.lineTo(x, y + h * 0.78);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#07101f';
  ctx.fillRect(x + w * 0.38, y + h * 0.45, w * 0.24, h * 0.2);
}

function spawnObstacle(collection, size, color) {
  collection.push({
    x: Math.random() * (canvas.width - size),
    y: -size,
    size,
    color,
    spin: Math.random() * Math.PI,
  });
}

function updateObjects(dt) {
  state.spawnTimer -= dt;
  state.crystalTimer -= dt;
  if (state.spawnTimer <= 0) {
    spawnObstacle(state.meteors, Math.random() * 26 + 28, '#ff4f68');
    state.spawnTimer = Math.max(0.24, 0.78 - state.speed * 0.08);
  }
  if (state.crystalTimer <= 0) {
    spawnObstacle(state.crystals, 22, '#ffd166');
    state.crystalTimer = 1.35;
  }

  moveAndDraw(state.meteors, dt, 175, drawMeteor);
  moveAndDraw(state.crystals, dt, 145, drawCrystal);
  state.meteors = state.meteors.filter((item) => item.y < canvas.height + item.size);
  state.crystals = state.crystals.filter((item) => item.y < canvas.height + item.size);
}

function moveAndDraw(collection, dt, baseSpeed, draw) {
  for (const item of collection) {
    item.y += baseSpeed * state.speed * dt;
    item.spin += dt * 4;
    draw(item);
  }
}

function drawMeteor(item) {
  ctx.save();
  ctx.translate(item.x + item.size / 2, item.y + item.size / 2);
  ctx.rotate(item.spin);
  ctx.fillStyle = item.color;
  ctx.shadowColor = item.color;
  ctx.shadowBlur = 18;
  ctx.beginPath();
  for (let i = 0; i < 7; i += 1) {
    const angle = (Math.PI * 2 * i) / 7;
    const radius = item.size * (i % 2 ? 0.38 : 0.56);
    ctx.lineTo(Math.cos(angle) * radius, Math.sin(angle) * radius);
  }
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function drawCrystal(item) {
  ctx.save();
  ctx.translate(item.x + item.size / 2, item.y + item.size / 2);
  ctx.rotate(item.spin);
  ctx.fillStyle = item.color;
  ctx.shadowColor = item.color;
  ctx.shadowBlur = 16;
  ctx.beginPath();
  ctx.moveTo(0, -item.size / 2);
  ctx.lineTo(item.size / 2, 0);
  ctx.lineTo(0, item.size / 2);
  ctx.lineTo(-item.size / 2, 0);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function rectanglesOverlap(a, b) {
  return a.x < b.x + b.size && a.x + a.w > b.x && a.y < b.y + b.size && a.y + a.h > b.y;
}

function handleCollisions() {
  if (state.meteors.some((meteor) => rectanglesOverlap(state.player, meteor))) {
    endGame();
    return;
  }
  state.crystals = state.crystals.filter((crystal) => {
    if (rectanglesOverlap(state.player, crystal)) {
      state.score += 75;
      return false;
    }
    return true;
  });
}

function updatePlayer(dt) {
  const direction = (keys.has('ArrowRight') || keys.has('d') ? 1 : 0) - (keys.has('ArrowLeft') || keys.has('a') ? 1 : 0);
  state.player.x += direction * 320 * dt;
  state.player.x = Math.max(8, Math.min(canvas.width - state.player.w - 8, state.player.x));
}

function endGame() {
  state.running = false;
  state.best = Math.max(state.best, Math.floor(state.score));
  localStorage.setItem('ark-best-score', state.best);
  bestEl.textContent = state.best;
  overlay.innerHTML = `<strong>方舟受损</strong><span>最终得分 ${Math.floor(state.score)}，点击重新挑战。</span>`;
  overlay.classList.remove('hidden');
}

function loop(now) {
  if (!state.running) return;
  const dt = Math.min((now - state.lastTime) / 1000, 0.04);
  state.lastTime = now;
  if (!state.paused) {
    state.score += dt * 20 * state.speed;
    state.speed = 1 + state.score / 1200;
    drawBackground(dt);
    updatePlayer(dt);
    updateObjects(dt);
    drawPlayer();
    handleCollisions();
    scoreEl.textContent = Math.floor(state.score);
    speedEl.textContent = `${state.speed.toFixed(1)}x`;
  }
  requestAnimationFrame(loop);
}

window.addEventListener('keydown', (event) => {
  keys.add(event.key);
  if (event.code === 'Space' && state.running) {
    state.paused = !state.paused;
    overlay.innerHTML = '<strong>已暂停</strong><span>按空格继续飞行。</span>';
    overlay.classList.toggle('hidden', !state.paused);
  }
});
window.addEventListener('keyup', (event) => keys.delete(event.key));
startButton.addEventListener('click', resetGame);

drawBackground(0);
drawPlayer();
