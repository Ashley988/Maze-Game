// ================== DOM-Elemente ==================
const canvas = document.getElementById("mazeCanvas");
const ctx = canvas ? canvas.getContext("2d") : null;
const mainMenu = document.getElementById("mainMenu");
const gameArea = document.getElementById("gameArea");
const playerColorInput = document.getElementById("playerColor");
const levelSelect = document.getElementById("levelSelect");
const timeSelect = document.getElementById("timeSelect");
const highscoreSpan = document.getElementById("highscore");
const startBtn = document.getElementById("startBtn");
const restartBtn = document.getElementById("restartBtn");
const menuBtn = document.getElementById("menuBtn");
const timerDisplay = document.getElementById("timerDisplay");

// ========== Grundvariablen ==========
const TOTAL_LEVELS = 20; // Beispiel: Passe später auf 100+ an!
let player, exit, maze, enemies, lives, curLevel = 1;
let gameActive = false;
let timer = 0, timeLimit = 0, timerInterval = null;
let highscore = 1;

// ========== Leveldaten für die ersten paar Level ==========
const handLevels = [
  [
    [0,0,0,0,0],
    [0,2,1,1,0],
    [0,1,0,1,0],
    [0,1,3,1,0],
    [0,0,0,0,0]
  ],
  [
    [0,0,0,0,0,0],
    [0,2,1,1,1,0],
    [0,1,0,0,1,0],
    [0,1,1,0,1,0],
    [0,1,3,1,1,0],
    [0,0,0,0,0,0]
  ],
  // ... weitere Level!
];

// ========== Hilfsfunktionen ==========

// Robust aus localStorage lesen
function getStored(key, fallback = null) {
  try {
    let item = localStorage.getItem(key);
    if (!item || item === "undefined" || item === "null") return fallback;
    return JSON.parse(item);
  } catch (e) {
    return fallback;
  }
}

// Robust in localStorage speichern
function setStored(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {}
}

// Highscore laden
function loadProgress() {
  highscore = getStored('mazeHighscore', 1);
  if (highscore < 1) highscore = 1;
  if (highscoreSpan) highscoreSpan.textContent = highscore;
}

// Highscore speichern
function saveProgress(level) {
  if (level > highscore) {
    highscore = level;
    setStored('mazeHighscore', highscore);
    if (highscoreSpan) highscoreSpan.textContent = highscore;
  }
}

// Leveldaten holen
function getLevel(n) {
  // Handgebaute Level bis zu handLevels.length, dann automatisch
  if (n <= handLevels.length) return handLevels[n-1];
  // Automatisch generierte Level (einfaches Beispiel, besser wäre Maze-Generator!)
  let size = Math.min(7 + Math.floor(n/5), 15);
  let m = [];
  for (let y=0; y<size; y++) {
    let row = [];
    for (let x=0; x<size; x++) {
      // Rand ist Wand, sonst zufällig
      row.push((x===0 || y===0 || x===size-1 || y===size-1) ? 0 : (Math.random()<0.3?0:1));
    }
    m.push(row);
  }
  // Start und Ziel einbauen
  m[1][1] = 2;
  m[size-2][size-2] = 3;
  return m;
}

// Timer-Anzeige aktualisieren
function updateTimer() {
  if(timerDisplay) {
    timerDisplay.textContent = (timeLimit > 0) ? `Zeit: ${timer}s` : "";
  }
}

// Maze zeichnen
function drawMaze() {
  if (!ctx || !maze) return;
  ctx.fillStyle = "#111";
  ctx.fillRect(0,0,canvas.width,canvas.height);

  const cellSize = Math.floor(canvas.width / maze[0].length);

  for(let y=0; y<maze.length; y++) {
    for(let x=0; x<maze[0].length; x++) {
      if(maze[y][x] === 0) {
        ctx.fillStyle = "#222";
        ctx.fillRect(x*cellSize, y*cellSize, cellSize, cellSize);
      } else if(maze[y][x] === 2) {
        ctx.fillStyle = player.color;
        ctx.beginPath();
        ctx.arc(x*cellSize+cellSize/2, y*cellSize+cellSize/2, cellSize/2.5, 0, 2*Math.PI);
        ctx.fill();
      } else if(maze[y][x] === 3) {
        ctx.fillStyle = "#4af";
        ctx.fillRect(x*cellSize+cellSize*0.25, y*cellSize+cellSize*0.25, cellSize*0.5, cellSize*0.5);
      }
    }
  }
}

// Maze starten
function startLevel(level) {
  maze = getLevel(level);
  curLevel = level;
  player = { x:1, y:1, color: playerColorInput ? playerColorInput.value : "#FFD600" };
  exit = { x: maze[0].length-2, y: maze.length-2 };
  lives = 3;
  gameActive = true;
  canvas.width = canvas.height = 320; // Handygröße
  timer = timeLimit = Number(timeSelect ? timeSelect.value : 0);
  updateTimer();
  drawMaze();
}

// ========== Events ==========

if (startBtn) {
  startBtn.onclick = () => {
    let selectedLevel = levelSelect ? Number(levelSelect.value) : 1;
    startLevel(selectedLevel || 1);
  };
}

if (restartBtn) {
  restartBtn.onclick = () => {
    startLevel(curLevel || 1);
  };
}

if (menuBtn) {
  menuBtn.onclick = () => {
    if (mainMenu) mainMenu.style.display = "flex";
    if (gameArea) gameArea.style.display = "none";
  };
}

// ========== Initialisierung ==========

window.onload = function() {
  loadProgress();
  if (mainMenu) mainMenu.style.display = "flex";
  if (gameArea) gameArea.style.display = "none";
};
