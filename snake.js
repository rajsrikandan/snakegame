import { createInitialState, setDirection, step, togglePause } from './snake-logic.js';

const CELL_COUNT = 20;
const TICK_MS = 130;

const canvas = document.getElementById('board');
const ctx = canvas.getContext('2d');
const scoreEl = document.getElementById('score');
const stateEl = document.getElementById('state');
const restartBtn = document.getElementById('restart');

let state = createInitialState(CELL_COUNT, CELL_COUNT);

function render() {
  const cellW = canvas.width / state.cols;
  const cellH = canvas.height / state.rows;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = '#ececec';
  ctx.lineWidth = 1;
  for (let i = 0; i <= state.cols; i += 1) {
    const x = i * cellW;
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas.height);
    ctx.stroke();
  }
  for (let i = 0; i <= state.rows; i += 1) {
    const y = i * cellH;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
  }

  ctx.fillStyle = '#c83c3c';
  ctx.fillRect(state.food.x * cellW, state.food.y * cellH, cellW, cellH);

  ctx.fillStyle = '#2f7f3a';
  for (const segment of state.snake) {
    ctx.fillRect(segment.x * cellW, segment.y * cellH, cellW, cellH);
  }

  scoreEl.textContent = String(state.score);
  stateEl.textContent =
    state.status === 'gameover'
      ? 'Game Over'
      : state.status === 'paused'
      ? 'Paused'
      : 'Running';
}

function tick() {
  state = step(state);
  render();
}

setInterval(tick, TICK_MS);

window.addEventListener('keydown', (event) => {
  const key = event.key.toLowerCase();

  if (key === 'arrowup' || key === 'w') state = setDirection(state, 'up');
  if (key === 'arrowdown' || key === 's') state = setDirection(state, 'down');
  if (key === 'arrowleft' || key === 'a') state = setDirection(state, 'left');
  if (key === 'arrowright' || key === 'd') state = setDirection(state, 'right');
  if (key === ' ') {
    event.preventDefault();
    state = togglePause(state);
  }
});

restartBtn.addEventListener('click', () => {
  state = createInitialState(CELL_COUNT, CELL_COUNT);
  render();
});

for (const button of document.querySelectorAll('[data-dir]')) {
  button.addEventListener('click', () => {
    state = setDirection(state, button.dataset.dir);
  });
}

render();
