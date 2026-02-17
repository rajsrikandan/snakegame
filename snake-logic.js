const DIRECTIONS = {
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
};

const OPPOSITES = {
  up: 'down',
  down: 'up',
  left: 'right',
  right: 'left',
};

export function createInitialState(cols = 20, rows = 20, random = Math.random) {
  const startX = Math.floor(cols / 2);
  const startY = Math.floor(rows / 2);
  const snake = [
    { x: startX, y: startY },
    { x: startX - 1, y: startY },
    { x: startX - 2, y: startY },
  ];

  return {
    cols,
    rows,
    snake,
    direction: 'right',
    pendingDirection: 'right',
    food: spawnFood(cols, rows, snake, random),
    score: 0,
    status: 'running',
  };
}

export function setDirection(state, direction) {
  if (!DIRECTIONS[direction]) return state;
  if (OPPOSITES[state.direction] === direction) return state;
  return { ...state, pendingDirection: direction };
}

export function togglePause(state) {
  if (state.status === 'gameover') return state;
  return {
    ...state,
    status: state.status === 'paused' ? 'running' : 'paused',
  };
}

export function step(state, random = Math.random) {
  if (state.status !== 'running') return state;

  const direction =
    OPPOSITES[state.direction] === state.pendingDirection
      ? state.direction
      : state.pendingDirection;

  const delta = DIRECTIONS[direction];
  const head = state.snake[0];
  const nextHead = { x: head.x + delta.x, y: head.y + delta.y };
  const ateFood = nextHead.x === state.food.x && nextHead.y === state.food.y;
  const collisionBody = ateFood ? state.snake : state.snake.slice(0, -1);

  if (hitsBoundary(nextHead, state.cols, state.rows) || hitsSelf(nextHead, collisionBody)) {
    return {
      ...state,
      direction,
      pendingDirection: direction,
      status: 'gameover',
    };
  }

  const nextSnake = [nextHead, ...state.snake];

  if (!ateFood) {
    nextSnake.pop();
  }

  return {
    ...state,
    snake: nextSnake,
    direction,
    pendingDirection: direction,
    food: ateFood ? spawnFood(state.cols, state.rows, nextSnake, random) : state.food,
    score: ateFood ? state.score + 1 : state.score,
  };
}

export function spawnFood(cols, rows, snake, random = Math.random) {
  const occupied = new Set(snake.map((segment) => `${segment.x},${segment.y}`));
  const available = [];

  for (let y = 0; y < rows; y += 1) {
    for (let x = 0; x < cols; x += 1) {
      const key = `${x},${y}`;
      if (!occupied.has(key)) {
        available.push({ x, y });
      }
    }
  }

  if (available.length === 0) {
    return snake[0];
  }

  const index = Math.floor(random() * available.length);
  return available[index];
}

function hitsBoundary(point, cols, rows) {
  return point.x < 0 || point.y < 0 || point.x >= cols || point.y >= rows;
}

function hitsSelf(point, snake) {
  return snake.some((segment) => segment.x === point.x && segment.y === point.y);
}
