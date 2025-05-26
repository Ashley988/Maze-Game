// Maze Game – Komplettskript

// === Globale DOM-Elemente ===
const canvas = document.getElementById("mazeCanvas");
const ctx = canvas.getContext("2d");
const mainMenu = document.getElementById("mainMenu");
const gameArea = document.getElementById("gameArea");
const playerColorInput = document.getElementById("playerColor");
const levelSelect = document.getElementById("levelSelect");
const timeSelect = document.getElementById("timeSelect");
const gameTimeSelect = document.getElementById("gameTimeSelect");
const highscoreSpan = document.getElementById("highscore");
const gameHighscoreSpan = document.getElementById("gameHighscore");
const curLevelDisplay = document.getElementById("curLevelDisplay");
const startBtn = document.getElementById("startBtn");
const restartBtn = document.getElementById("restartBtn");
const menuBtn = document.getElementById("menuBtn");
const maxLevelInfo = document.getElementById("maxLevelInfo");
const levelDisplay = document.getElementById("levelDisplay");
const timerDisplay = document.getElementById("timerDisplay");
const livesDisplay = document.getElementById("livesDisplay");
const joystickOuter = document.getElementById("joystickOuter");
const joystickThumb = document.getElementById("joystickThumb");

// === Spielvariablen ===
let player, exit, maze, enemies, lives, curLevel, timeLimit, timer, timeInterval;
let gameActive = false, joystickDir = null;
let highscore = 1, maxLevelUnlocked = 1;
let joystickActive = false;
let cellSizeBase = 28;
let moveCooldown = false;

const TOTAL_LEVELS = 100;

// === Zeitlimit-Dropdowns füllen ===
function fillTimeSelects() {
    let selects = [timeSelect, gameTimeSelect];
    for (let select of selects) {
        select.innerHTML = '';
        let opt0 = document.createElement("option");
        opt0.value = "0";
        opt0.textContent = "Kein Limit";
        select.appendChild(opt0);
        for (let t = 30; t <= 600; t += 15) {
            let min = Math.floor(t / 60), sec = t % 60;
            let label = (min > 0 ? `${min}min ` : "") + `${sec > 0 ? sec + "s" : ""}`;
            let opt = document.createElement("option");
            opt.value = t;
            opt.textContent = label;
            select.appendChild(opt);
        }
    }
}
fillTimeSelects();

// === Leveldaten und Generator ===
const handLevels = [
    // Level 1 (Beispiel, erweitere wie du willst)
    [
        [0,0,0,0,0],
        [0,2,1,3,0],
        [0,1,0,1,0],
        [0,1,0,1,0],
        [0,0,0,0,0]
    ],
    // Level 2+
    [
        [0,0,0,0,0,0,0],
        [0,2,1,1,1,3,0],
        [0,1,0,0,0,1,0],
        [0,1,0,1,0,1,0],
        [0,1,1,1,0,1,0],
        [0,0,0,0,0,0,0]
    ],
    // Level 3+
    [
        [0,0,0,0,0,0,0,0],
        [0,2,1,1,1,1,3,0],
        [0,1,0,0,0,0,1,0],
        [0,1,0,1,1,0,1,0],
        [0,1,0,0,1,0,1,0],
        [0,1,1,1,1,1,1,0],
        [0,0,0,0,0,0,0,0]
    ],
    // usw. ... 
];
// Automatische Generierung weiterer Labyrinthe für höhere Level (größer, schwieriger)
function makeLevel(n) {
    if (n <= handLevels.length) return handLevels[n - 1];
    let size = Math.min(7 + Math.floor(n / 5), 21);
    let maze = Array(size).fill().map(() => Array(size).fill(0));
    for (let y = 1; y < size - 1; y++) for (let x = 1; x < size - 1; x++) maze[y][x] = 1;
    maze[1][1] = 2; // Player
    maze[size - 2][size - 2] = 3; // Exit
    for (let i = 0; i < size * 1.8; i++) {
        let x = Math.floor(Math.random() * (size - 2)) + 1;
        let y = Math.floor(Math.random() * (size - 2)) + 1;
        if ((x !== 1 || y !== 1) && (x !== size - 2 || y !== size - 2)) maze[y][x] = 0;
    }
    let gcount = Math.min(Math.floor(1 + n / 8), 3);
    for (let g = 0; g < gcount; g++) {
        let tries = 0;
        while (tries++ < 40) {
            let gx = Math.floor(Math.random() * (size - 2)) + 1;
            let gy = Math.floor(Math.random() * (size - 2)) + 1;
            if (maze[gy][gx] === 1 && !(gx === 1 && gy === 1) && !(gx === size - 2 && gy === size - 2)) {
                maze[gy][gx] = 4; // Gegner
                break;
            }
        }
    }
    return maze;
}

function getLevel(n) {
    if (n < 1) n = 1;
    if (n > TOTAL_LEVELS) n = TOTAL_LEVELS;
    return makeLevel(n);
}

// === Highscore speichern/laden ===
function loadProgress() {
    highscore = +(localStorage.getItem('mazeHighscore') || 1);
    maxLevelUnlocked = +(localStorage.getItem('mazeMaxLevel') || 1);
    if (maxLevelUnlocked < 1) maxLevelUnlocked = 1;
    updateHighscore();
}
function saveProgress(level) {
    if (level > highscore) {
        highscore = level;
        localStorage.setItem('mazeHighscore', highscore);
    }
    if (level > maxLevelUnlocked) {
        maxLevelUnlocked = level;
        localStorage.setItem('mazeMaxLevel', maxLevelUnlocked);
    }
    updateHighscore();
}
function updateHighscore() {
    if (highscoreSpan) highscoreSpan.textContent = highscore;
    if (gameHighscoreSpan) gameHighscoreSpan.textContent = highscore;
    if (maxLevelInfo) maxLevelInfo.textContent = `(bis Level ${maxLevelUnlocked})`;
}

// === Level Dropdown vorbereiten ===
function updateLevelSelect() {
    levelSelect.innerHTML = "";
    let max = Math.min(TOTAL_LEVELS, maxLevelUnlocked);
    for (let i = 1; i <= max; i++) {
        let opt = document.createElement("option");
        opt.value = i;
        opt.textContent = "Level " + i;
        levelSelect.appendChild(opt);
    }
}

// === Spielstart ===
startBtn.onclick = () => {
    curLevel = +levelSelect.value;
    startLevel(curLevel);
    mainMenu.style.display = "none";
    gameArea.style.display = "block";
};
menuBtn.onclick = goToMenu;
restartBtn.onclick = () => startLevel(curLevel);

function goToMenu() {
    gameArea.style.display = "none";
    mainMenu.style.display = "flex";
    updateLevelSelect();
}

// === Level laden ===
function startLevel(level) {
    maze = getLevel(level);
    let n = maze.length, m = maze[0].length;
    canvas.width = m * cellSizeBase;
    canvas.height = n * cellSizeBase;
    // Spielfigur & Exit finden
    let foundPlayer = false, foundExit = false;
    for (let y = 0; y < n; y++) for (let x = 0; x < m; x++) {
        if (maze[y][x] === 2) { player = {x, y, color: playerColorInput.value}; foundPlayer = true; }
        if (maze[y][x] === 3) { exit = {x, y}; foundExit = true; }
    }
    if (!foundPlayer || !foundExit) {
        alert("Level-Fehler: Spieler oder Ausgang fehlt!");
        return;
    }
    enemies = [];
    for (let y = 0; y < n; y++) for (let x = 0; x < m; x++) {
        if (maze[y][x] === 4) enemies.push({x, y, dir: (level >= 4 ? "v" : "h"), t: 0, alive: true});
    }
    lives = (enemies.length > 0) ? 3 : "";
    levelDisplay.textContent = `Level ${level}`;
    curLevelDisplay.textContent = level;
    updateLives();
    // Zeitlimit synchronisieren (Menü → Ingame)
    let selected = timeSelect.value;
    gameTimeSelect.value = selected;
    timeLimit = +selected;
    timer = timeLimit;
    updateTimer();
    if (timeInterval) clearInterval(timeInterval);
    if (timeLimit > 0) {
        timeInterval = setInterval(() => {
            if (!gameActive) return;
            timer--;
            updateTimer();
            if (timer <= 0) failLevel("Zeit abgelaufen!");
        }, 1000);
    }
    player.color = playerColorInput.value;
    gameActive = true;
    joystickDir = null;
    restartBtn.style.display = "none";
    menuBtn.style.display = "none";
    drawMaze();
    requestAnimationFrame(gameLoop);
}

// === Lives/Timer Update ===
function updateLives() {
    if (livesDisplay) {
        livesDisplay.textContent = lives ? `Leben: ${lives}` : "";
    }
}
function updateTimer() {
    if (timerDisplay) {
        timerDisplay.textContent = (timeLimit > 0 ? `Zeit: ${timer}s` : "");
    }
}

// === Maze Rendering ===
function drawMaze() {
    ctx.fillStyle = "#111";
    ctx.fillRect(0,0,canvas.width,canvas.height);
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 4;
    ctx.strokeRect(0,0,canvas.width,canvas.height);
    for(let y=0; y<maze.length; y++)
        for(let x=0; x<maze[0].length; x++) {
            if(maze[y][x]===0){
                ctx.fillStyle="#000";
                ctx.fillRect(x*cellSizeBase, y*cellSizeBase, cellSizeBase, cellSizeBase);
            }
            if(maze[y][x]===3){
                ctx.fillStyle="#5af";
                ctx.fillRect(x*cellSizeBase, y*cellSizeBase, cellSizeBase, cellSizeBase);
                ctx.strokeStyle="#fff";
                ctx.strokeRect(x*cellSizeBase+6, y*cellSizeBase+6, cellSizeBase-12, cellSizeBase-12);
            }
        }
    for(let e of enemies) if(e.alive){
        ctx.fillStyle="#f44";
        ctx.beginPath();
        ctx.arc(
            e.x*cellSizeBase+cellSizeBase/2,
            e.y*cellSizeBase+cellSizeBase/2,
            cellSizeBase/2.2,0,2*Math.PI
        );
        ctx.fill();
        ctx.strokeStyle="#fff";
        ctx.lineWidth=2;
        ctx.stroke();
    }
    ctx.fillStyle=player.color;
    ctx.beginPath();
    ctx.arc(
        player.x*cellSizeBase+cellSizeBase/2,
        player.y*cellSizeBase+cellSizeBase/2,
        cellSizeBase/2.3,0,2*Math.PI
    );
    ctx.fill();
    ctx.strokeStyle="#222";
    ctx.lineWidth=2;
    ctx.stroke();
}

// === Game Loop ===
function gameLoop() {
    if(!gameActive) return;
    moveEnemies();
    drawMaze();
    requestAnimationFrame(gameLoop);
}

// === Gegner bewegen ===
function moveEnemies() {
    for(let e of enemies){
        if(!e.alive) continue;
        if(e.dir==="h" && (performance.now()/350|0)%2===0){
            let nx=e.x+1, px=e.x-1;
            if(nx<maze[0].length && maze[e.y][nx]!==0) e.x=nx;
            else if(px>=0 && maze[e.y][px]!==0) e.x=px;
        }
        if(e.dir==="v" && (performance.now()/350|0)%2===0){
            let ny=e.y+1, py=e.y-1;
            if(ny<maze.length && maze[ny][e.x]!==0) e.y=ny;
            else if(py>=0 && maze[py][e.x]!==0) e.y=py;
        }
    }
}

// === Joystick Steuerung ===
joystickOuter.addEventListener("touchstart", joystickStart);
joystickOuter.addEventListener("mousedown", joystickStart);

function joystickStart(e) {
    e.preventDefault();
    joystickActive = true;
    updateJoystick(e);
    document.addEventListener("mousemove", updateJoystick);
    document.addEventListener("touchmove", updateJoystick);
    document.addEventListener("mouseup", joystickEnd);
    document.addEventListener("touchend", joystickEnd);
}

function joystickEnd() {
    joystickActive = false;
    joystickDir = null;
    joystickThumb.style.transform = "";
    document.removeEventListener("mousemove", updateJoystick);
    document.removeEventListener("touchmove", updateJoystick);
    document.removeEventListener("mouseup", joystickEnd);
    document.removeEventListener("touchend", joystickEnd);
}

function updateJoystick(e) {
    let rect = joystickOuter.getBoundingClientRect();
    let cx = rect.left + rect.width/2, cy = rect.top + rect.height/2;
    let x, y;
    if (e.touches && e.touches[0]) {
        x = e.touches[0].clientX; y = e.touches[0].clientY;
    } else {
        x = e.clientX; y = e.clientY;
    }
    let dx = x-cx, dy = y-cy, dist = Math.sqrt(dx*dx+dy*dy);
    let max = rect.width/2-18;
    if(dist > max){ dx = dx*max/dist; dy = dy*max/dist; }
    joystickThumb.style.transform = `translate(${dx}px,${dy}px)`;
    let angle = Math.atan2(dy, dx);
    if(dist>18){
        if(angle<-Math.PI*0.75 || angle>Math.PI*0.75) joystickDir="left";
        else if(angle<-Math.PI*0.25 && angle>-Math.PI*0.75) joystickDir="up";
        else if(angle<Math.PI*0.25 && angle>-Math.PI*0.25) joystickDir="right";
        else if(angle<Math.PI*0.75 && angle>Math.PI*0.25) joystickDir="down";
        movePlayer(joystickDir);
    }
}

// === Spieler-Bewegung ===
function movePlayer(dir){
    if(moveCooldown) return;
    let nx=player.x, ny=player.y;
    if(dir==="up") ny--;
    if(dir==="down") ny++;
    if(dir==="left") nx--;
    if(dir==="right") nx++;
    if(nx>=0 && ny>=0 && ny<maze.length && nx<maze[0].length && maze[ny][nx]!==0){
        player.x=nx; player.y=ny;
        for(let e of enemies) if(e.x===nx&&e.y===ny){
            if(lives>1){lives--;updateLives();failFlash();}
            else {failLevel("Von Gegner gefangen!");}
        }
        if(nx===exit.x && ny===exit.y){
            saveProgress(curLevel+1);
            setTimeout(()=>{
                if(curLevel<TOTAL_LEVELS){
                    curLevel++; startLevel(curLevel);
                }else{
                    alert("Alle Level geschafft!");
                }
            }, 500);
            return;
        }
    }
    drawMaze();
    moveCooldown=true;
    setTimeout(()=>{moveCooldown=false;}, 150);
}

function failFlash(){
    canvas.style.boxShadow="0 0 22px #f44";
    setTimeout(()=>canvas.style.boxShadow="",200);
}

function failLevel(reason){
    gameActive=false;
    if(timeInterval) clearInterval(timeInterval);
    restartBtn.style.display = "inline-block";
    menuBtn.style.display = "inline-block";
    alert(reason + " Versuch's nochmal!");
}

// === Zeitlimit Ingame-Änderung ===
gameTimeSelect.addEventListener('change', function(){
    timeLimit = +this.value;
    timer = timeLimit;
    updateTimer();
    if (timeInterval) clearInterval(timeInterval);
    if (timeLimit > 0 && gameActive) {
        timeInterval = setInterval(() => {
            if (!gameActive) return;
            timer--;
            updateTimer();
            if (timer <= 0) failLevel("Zeit abgelaufen!");
        }, 1000);
    }
});

// === Initialisierung ===
window.onload = function(){
    loadProgress();
    updateLevelSelect();
};
