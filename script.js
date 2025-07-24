const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const startBtn = document.getElementById("startBtn");
const pauseBtn = document.getElementById("pauseBtn");
const restartBtn = document.getElementById("restartBtn");
const themeBtn = document.getElementById("themeBtn");
const scoreText = document.getElementById("score");
const highScoreText = document.getElementById("highScore");

const grid = 20;
let snake = [];
let dx = grid;
let dy = 0;
let food = {};
let score = 0;
let speed = 250;
let isPaused = false;
let gameInterval;

let highScore = localStorage.getItem("highScore") || 0;
highScoreText.textContent = "High Score: " + highScore;

// Sound effects
const eatSound = new Audio("https://www.fesliyanstudios.com/play-mp3/387");
const gameOverSound = new Audio("https://www.fesliyanstudios.com/play-mp3/438");

function initGame() {
  snake = [{ x: 160, y: 160 }];
  dx = grid;
  dy = 0;
  food = getRandomFood();
  score = 0;
  speed = 250;
  isPaused = false;
  updateScore();
  clearInterval(gameInterval);
  gameInterval = setInterval(draw, speed);
}

function getRandomFood() {
  return {
    x: Math.floor(Math.random() * 20) * grid,
    y: Math.floor(Math.random() * 20) * grid,
  };
}

function updateScore() {
  scoreText.textContent = "Score: " + score;
  if (score > highScore) {
    highScore = score;
    localStorage.setItem("highScore", score);
    highScoreText.textContent = "High Score: " + highScore;
  }
}

function increaseSpeed() {
  clearInterval(gameInterval);
  gameInterval = setInterval(draw, speed);
}

function draw() {
  if (isPaused) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  let head = { x: snake[0].x + dx, y: snake[0].y + dy };

  // Collision
  if (
    head.x < 0 || head.x >= canvas.width ||
    head.y < 0 || head.y >= canvas.height ||
    snake.some(seg => seg.x === head.x && seg.y === head.y)
  ) {
    gameOverSound.play();
    clearInterval(gameInterval);
    alert("Game Over! Score: " + score);
    return;
  }

  snake.unshift(head);

  if (head.x === food.x && head.y === food.y) {
    score++;
    eatSound.play();
    updateScore();
    food = getRandomFood();

    if (score === 10) { speed = 180; increaseSpeed(); }
    else if (score === 20) { speed = 120; increaseSpeed(); }
    else if (score === 40) { speed = 80; increaseSpeed(); }
  } else {
    snake.pop();
  }

  // Draw food
  ctx.fillStyle = "red";
  ctx.fillRect(food.x, food.y, grid - 2, grid - 2);

  // Draw snake
  ctx.fillStyle = "green";
  for (let part of snake) {
    ctx.fillRect(part.x, part.y, grid - 2, grid - 2);
  }
}

// Controls
document.addEventListener("keydown", e => {
  if (e.key === "ArrowUp" && dy === 0) { dx = 0; dy = -grid; }
  else if (e.key === "ArrowDown" && dy === 0) { dx = 0; dy = grid; }
  else if (e.key === "ArrowLeft" && dx === 0) { dx = -grid; dy = 0; }
  else if (e.key === "ArrowRight" && dx === 0) { dx = grid; dy = 0; }
});

// Swipe Controls for mobile
let touchStartX, touchStartY;
canvas.addEventListener("touchstart", e => {
  touchStartX = e.touches[0].clientX;
  touchStartY = e.touches[0].clientY;
});
canvas.addEventListener("touchmove", e => {
  if (!touchStartX || !touchStartY) return;

  let xDiff = touchStartX - e.touches[0].clientX;
  let yDiff = touchStartY - e.touches[0].clientY;

  if (Math.abs(xDiff) > Math.abs(yDiff)) {
    if (xDiff > 0 && dx === 0) { dx = -grid; dy = 0; }
    else if (xDiff < 0 && dx === 0) { dx = grid; dy = 0; }
  } else {
    if (yDiff > 0 && dy === 0) { dx = 0; dy = -grid; }
    else if (yDiff < 0 && dy === 0) { dx = 0; dy = grid; }
  }

  touchStartX = null;
  touchStartY = null;
});

// Buttons
startBtn.addEventListener("click", initGame);
pauseBtn.addEventListener("click", () => {
  isPaused = !isPaused;
  pauseBtn.textContent = isPaused ? "▶ Resume" : "⏸ Pause";
});
restartBtn.addEventListener("click", () => {
  initGame();
  pauseBtn.textContent = "⏸ Pause";
});

// Dark mode toggle
themeBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark");
});
