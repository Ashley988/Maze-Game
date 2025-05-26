// =========== Globale DOM-Elemente ===========
const canvas = document.getElementById("mazeCanvas");
const ctx = canvas.getContext("2d");
const mainMenu = document.getElementById("mainMenu");
const gameArea = document.getElementById("gameArea");
const playerColorInput = document.getElementById("playerColor");
const levelSelect = document.getElementById("levelSelect");
const timeSelect = document.getElementById("timeLimitSelect");
const curLevelInfo = document.getElementById("curLevelInfo");
const timerDisplay = document.getElementById("timerDisplay");
const highscoreDisplay = document.getElementById("highscoreDisplay");
const highscoreSpan = document.getElementById("highscore");
const startBtn = document.getElementById("startBtn");
const restartBtn = document.getElementById("restartBtn");
const menuBtn = document.getElementById("menuBtn");
const joystickOuter = document.getElementById("joystickOuter");
const joystickThumb = document.getElementById("joystickThumb");

// =========== Spieleinstellungen ===========
const HAND_LEVELS = [
    // Level-Arrays: 0 = frei, 1 = Wand, 2 = Spieler, 3 = Ausgang, 4 = Gegner
    [
        [2,0,0,0,0],
        [1,1,1,1,0],
        [0,0,0,1,0],
        [0,1,0,1,0],
        [0,1,0,0,3]
    ],
    [
        [2,0,1,1,1],
        [1,0,1,0,0],
        [1,0,0,0,1],
        [1,1,1,0,1],
        [3,0,0,0,1]
    ],
    [
        [2,0,1,0,3],
        [1,0,1,0,1],
        [1,0,0,0,1],
        [1,1,1,0,1],
        [1,1,1,0,1]
    ],
    [
        [2,0,1,1,1],
        [1,0,0,0,3],
        [1,1,1,0,1],
        [1,0,0,0,1],
        [1,1,1,0,1]
    ],
    [
        [2,0,1,1,1],
        [1,0,0,0,1],
        [1,1,1,0,1],
        [1,0,4,0,1],
        [3,0,1,0,1]
    ],
    [
        [2,0,0,0,3],
        [1,1,1,0,1],
        [1,0,1,0,1],
        [1,0,1,0,1],
        [1,0,0,0,1]
    ],
    [
        [2,0,1,1,1],
        [1,0,0,0,1],
        [1,1,4,0,1],
        [1,0,1,0,1],
        [3,0,1,0,1]
    ],
    [
        [2,0,1,1,1],
        [1,0,0,0,1],
        [1,0,1,0,1],
        [1,0,1,0,1],
        [4,0,3,0,1]
    ],
    [
        [2,0,1,1,1,1],
        [1,0,0,0,1,1],
        [1,1,1,0,1,1],
        [1,0,1,0,1,1],
        [1,4,1,0,0,3],
        [1,1,1,1,1,1]
    ],
    [
        [2,0,1,1,1,1],
        [1,0,4,0,1,1],
        [1,1,1,0,1,1],
        [1,0,1,0,1,1],
        [1,0,1,0,0,3],
        [1,1,1,1,1,1]
    ],
];

const MAX_LEVEL = 100;
const CELL_SIZE = 48; // Spielfeld-Kachelgröße (passt fürs Handy, wird angepasst)
let player, exit, enemies, curLevel = 1, highscore = 1, maxLevelUnlocked = 1, gameActive = false, timer = 0, timeLimit = 0, timerInterval = null, joystickDir = null, joystickActive = false;

// =========== Highscore laden ===========
function loadProgress() {
    highscore = +(localStorage.getItem("mazeHighscore") || 1);
    maxLevelUnlocked = +(localStorage.getItem("mazeMaxLevel") || 1);
    if (maxLevelUnlocked < 1) maxLevelUnlocked = 1;
    highscoreSpan.textContent = highscore;
}
function saveProgress(level) {
    if (level > highscore) {
        highscore = level;
        localStorage.setItem("mazeHighscore", highscore);
    }
    if (level > maxLevelUnlocked) {
        maxLevelUnlocked = level;
        localStorage.setItem("mazeMaxLevel", maxLevelUnlocked);
    }
    highscoreSpan.textContent = highscore;
}

// =========== Level-Optionen füllen ===========
function fillLevelSelect() {
    levelSelect.innerHTML = "";
    for (let i = 1; i <= maxLevelUnlocked; i++) {
        let opt = document.createElement("option");
        opt.value = i;
        opt.textContent = "Level " + i;
        levelSelect.appendChild(opt);
    }
}

// =========== Zeitlimit-Optionen füllen ===========
function fillTimeSelect() {
    timeSelect.innerHTML = "";
    let opt0 = document.createElement("option");
    opt0.value = 0;
    opt0.textContent = "Kein Limit";
    timeSelect.appendChild(opt0);
    for (let t = 30; t <= 600; t += 15) {
        let opt = document.createElement("option");
        opt.value = t;
        let min = Math.floor(t/60), sec = t%60;
        let label = (min > 0 ? min + "min " : "") + sec + "s";
        opt.textContent = label;
        timeSelect.appendChild(opt);
    }
}

// =========== Level laden/generieren ===========
function getLevel(n) {
    if (n <= HAND_LEVELS.length) return JSON.parse(JSON.stringify(HAND_LEVELS[n-1]));
    // Ab Level 11 generieren wir automatisch: immer lösbar, aber schwieriger!
    let size = 7 + Math.floor(n/5);
    size = Math.min(size, 18);
    let maze = Array(size).fill().map(() => Array(size).fill(1));
    let px = 1, py = 1, ex = size-2, ey = size-2;
    maze[py][px] = 2; maze[ey][ex] = 3;
    // Grundgang von Start zu Exit (random Walk, garantiert lösbar)
    let path = [[px, py]];
    for (let i = 0; i < size*size; i++) {
        let [x, y] = path[path.length-1];
        let moves = [];
        if (x > 1) moves.push([x-1, y]);
        if (y > 1) moves.push([x, y-1]);
        if (x < size-2) moves.push([x+1, y]);
        if (y < size-2) moves.push([x, y+1]);
        moves = moves.filter(([nx, ny]) => maze[ny][nx] !== 0);
        if (moves.length === 0) break;
        let [nx, ny] = moves[Math.floor(Math.random()*moves.length)];
        maze[ny][nx] = 0;
        path.push([nx, ny]);
        if (nx === ex && ny === ey) break;
    }
    // Zusätzliche Wege
    for (let i = 0; i < size*2; i++) {
        let x = 1 + Math.floor(Math.random()*(size-2));
        let y = 1 + Math.floor(Math.random()*(size-2));
        maze[y][x] = 0;
    }
    // Gegner ab Level 15
    if (n >= 15) {
        let placed = 0;
        while (placed < Math.min(1 + Math.floor(n/10), 5)) {
            let gx = 2 + Math.floor(Math.random()*(size-4));
            let gy = 2 + Math.floor(Math.random()*(size-4));
            if (maze[gy][gx] === 0 && !(gx === px && gy === py) && !(gx === ex && gy === ey)) {
                maze[gy][gx] = 4;
                placed++;
            }
        }
    }
    return maze;
}

// =========== Spiel starten ===========
function startLevel(level) {
    let maze = getLevel(level);
    curLevel = level;
    // Canvas dynamisch skalieren
    let size = maze.length;
    canvas.width = canvas.height = Math.max(240, Math.min(420, size*CELL_SIZE));
    // Spielfigur/Gegner/Exit setzen
    player = {x:0,y:0,color:playerColorInput.value};
    exit = {x:0,y:0};
    enemies = [];
    for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
            if (maze[y][x] === 2) {player.x=x;player.y=y;}
            if (maze[y][x] === 3) {exit.x=x;exit.y=y;}
            if (maze[y][x] === 4) {enemies.push({x:x,y:y,dir:Math.random()>0.5?"h":"v",t:0,alive:true});}
        }
    }
    gameActive = true;
    timer = +timeSelect.value;
    timeLimit = timer;
    updateUI();
    drawMaze(maze);
    if (timerInterval) clearInterval(timerInterval);
    if (timer > 0) {
        timerInterval = setInterval(() => {
            if (!gameActive) return;
            timer--;
            updateUI();
            if (timer <= 0) failLevel("Zeit abgelaufen!");
        }, 1000);
    }
    // Game-Loop
    requestAnimationFrame(function loop() {
        if (!gameActive) return;
        moveEnemies(maze);
        drawMaze(maze);
        requestAnimationFrame(loop);
    });
    // Joystick Reset
    joystickDir = null;
    joystickActive = false;
    joystickThumb.style.transform = "";
}

// =========== UI-Update ===========
function updateUI() {
    curLevelInfo.innerHTML = `<span style="color:gold;font-weight:bold;">Level ${curLevel}</span>`;
    timerDisplay.textContent = timeLimit > 0 ? `⏰ ${timer}s` : "";
    highscoreDisplay.textContent = `Highscore: ${highscore}`;
    highscoreSpan.textContent = highscore;
}

// =========== Labyrinth rendern ===========
function drawMaze(maze) {
    ctx.clearRect(0,0,canvas.width,canvas.height);
    let size = maze.length;
    let cell = canvas.width / size;
    // Hintergrund + Rahmen
    ctx.fillStyle = "#111";
    ctx.fillRect(0,0,canvas.width,canvas.height);
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 4;
    ctx.strokeRect(0,0,canvas.width,canvas.height);
    // Felder
    for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
            if (maze[y][x] === 1) {
                ctx.fillStyle = "#222";
                ctx.fillRect(x*cell, y*cell, cell, cell);
            }
            if (maze[y][x] === 3) {
                ctx.fillStyle = "#77d";
                ctx.fillRect(x*cell+cell*0.1, y*cell+cell*0.1, cell*0.8, cell*0.8);
                ctx.strokeStyle = "#fff";
                ctx.lineWidth = 2;
                ctx.strokeRect(x*cell+cell*0.1, y*cell+cell*0.1, cell*0.8, cell*0.8);
            }
        }
    }
    // Gegner
    enemies.forEach(e => {
        if (!e.alive) return;
        ctx.beginPath();
        ctx.arc(e.x*cell+cell/2, e.y*cell+cell/2, cell/2.3, 0, 2*Math.PI);
        ctx.fillStyle = "#f44";
        ctx.fill();
        ctx.strokeStyle = "#fff";
        ctx.lineWidth = 2;
        ctx.stroke();
    });
    // Spieler
    ctx.beginPath();
    ctx.arc(player.x*cell+cell/2, player.y*cell+cell/2, cell/2.4, 0, 2*Math.PI);
    ctx.fillStyle = player.color;
    ctx.fill();
    ctx.strokeStyle = "#222";
    ctx.lineWidth = 2;
    ctx.stroke();
}

// =========== Gegner bewegen ===========
function moveEnemies(maze) {
    for (let e of enemies) {
        if (!e.alive) continue;
        let dx = 0, dy = 0;
        if (e.dir === "h") dx = Math.random()>0.5?1:-1;
        else dy = Math.random()>0.5?1:-1;
        let nx = e.x + dx, ny = e.y + dy;
        if (maze[ny] && maze[ny][nx] === 0 && !(nx === player.x && ny === player.y)) {
            e.x = nx; e.y = ny;
        }
        // Kollision mit Spieler
        if (e.x === player.x && e.y === player.y) failLevel("Vom Gegner erwischt!");
    }
}

// =========== Spieler bewegen ===========
function movePlayer(dir,maze) {
    if (!gameActive) return;
    let size = maze.length;
    let dx=0, dy=0;
    if (dir==="up") dy=-1;
    if (dir==="down") dy=1;
    if (dir==="left") dx=-1;
    if (dir==="right") dx=1;
    let nx = player.x + dx, ny = player.y + dy;
    if (maze[ny] && maze[ny][nx] !== undefined && maze[ny][nx] !== 1) {
        player.x = nx; player.y = ny;
        // Check exit
        if (nx === exit.x && ny === exit.y) {
            gameActive = false;
            saveProgress(curLevel+1);
            setTimeout(()=>{
                if (curLevel+1 <= MAX_LEVEL) {
                    startLevel(curLevel+1);
                } else {
                    alert("Du hast alle Level geschafft!");
                    showMenu();
                }
            }, 400);
        }
        // Check Gegner
        for (let e of enemies) {
            if (e.x === player.x && e.y === player.y && e.alive) failLevel("Vom Gegner erwischt!");
        }
    }
}

// =========== Game Over ===========
function failLevel(msg) {
    gameActive = false;
    if (timerInterval) clearInterval(timerInterval);
    restartBtn.style.display = "inline-block";
    menuBtn.style.display = "inline-block";
    setTimeout(()=>alert(msg+"\nVersuch's nochmal!"), 200);
}

// =========== Menü anzeigen ===========
function showMenu() {
    gameArea.style.display = "none";
    mainMenu.classList.add("active");
    fillLevelSelect();
    updateUI();
}

// =========== Joystick-Steuerung ===========
joystickOuter.addEventListener("touchstart", joystickStart);
joystickOuter.addEventListener("mousedown", joystickStart);
function joystickStart(e) {
    joystickActive = true;
    document.addEventListener("mousemove", updateJoystick);
    document.addEventListener("mouseup", joystickEnd);
    document.addEventListener("touchmove", updateJoystick);
    document.addEventListener("touchend", joystickEnd);
    updateJoystick(e);
}
function joystickEnd() {
    joystickActive = false;
    joystickThumb.style.transform = "";
    joystickDir = null;
    document.removeEventListener("mousemove", updateJoystick);
    document.removeEventListener("mouseup", joystickEnd);
    document.removeEventListener("touchmove", updateJoystick);
    document.removeEventListener("touchend", joystickEnd);
}
function updateJoystick(e) {
    if (!joystickActive) return;
    let rect = joystickOuter.getBoundingClientRect();
    let cx = rect.left + rect.width/2, cy = rect.top + rect.height/2;
    let x, y;
    if (e.touches && e.touches[0]) {
        x = e.touches[0].clientX; y = e.touches[0].clientY;
    } else {
        x = e.clientX; y = e.clientY;
    }
    let dx = x - cx, dy = y - cy;
    let dist = Math.sqrt(dx*dx + dy*dy);
    let angle = Math.atan2(dy, dx);
    if (dist > 24) {
        joystickThumb.style.transform = `translate(${dx/2}px,${dy/2}px)`;
        let dir = null;
        if (Math.abs(dx) > Math.abs(dy)) dir = dx>0 ? "right" : "left";
        else dir = dy>0 ? "down" : "up";
        joystickDir = dir;
        let maze = getLevel(curLevel);
        movePlayer(dir, maze);
    }
}

// =========== Events ===========
startBtn.onclick = () => {
    mainMenu.classList.remove("active");
    gameArea.style.display = "block";
    restartBtn.style.display = "none";
    menuBtn.style.display = "none";
    startLevel(+levelSelect.value);
};
restartBtn.onclick = () => {
    restartBtn.style.display = "none";
    menuBtn.style.display = "none";
    startLevel(curLevel);
};
menuBtn.onclick = showMenu;
playerColorInput.onchange = updateUI;

// =========== Init ===========
window.onload = () => {
    loadProgress();
    fillLevelSelect();
    fillTimeSelect();
    updateUI();
    showMenu();
};
