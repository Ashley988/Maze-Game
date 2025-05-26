// ==== DOM-Elemente ====
const canvas = document.getElementById("mazeCanvas");
const ctx = canvas.getContext("2d");
const mainMenu = document.getElementById("mainMenu");
const gameArea = document.getElementById("gameArea");
const playerColorInput = document.getElementById("playerColorInput");
const levelSelect = document.getElementById("levelSelect");
const timeSelect = document.getElementById("timeSelect");
const highscoreSpan = document.getElementById("highscoreSpan");
const gameHighscoreSpan = document.getElementById("gameHighscoreSpan");
const levelDisplay = document.getElementById("levelDisplay");
const timerDisplay = document.getElementById("timerDisplay");
const livesDisplay = document.getElementById("livesDisplay");
const startBtn = document.getElementById("startBtn");
const restartBtn = document.getElementById("restartBtn");
const menuBtn = document.getElementById("menuBtn");
const joystickOuter = document.getElementById("joystickOuter");
const joystickThumb = document.getElementById("joystickThumb");

// ==== Konstanten und Variablen ====
const TOTAL_LEVELS = 50; // max. Level
let highscore = 1;
let maxLevelUnlocked = 1;
let player, exit, maze, enemies, lives, timer, timeLimit, curLevel;
let gameActive = false;
let joystickActive = false;
let joystickDir = null;
let timerInterval = null;
let cellSize = 40;

// ==== Level Auswahl füllen ====
function updateLevelSelect() {
    levelSelect.innerHTML = '';
    for (let i = 1; i <= maxLevelUnlocked; i++) {
        const opt = document.createElement("option");
        opt.value = i;
        opt.textContent = i;
        levelSelect.appendChild(opt);
    }
}
updateLevelSelect();

// ==== Zeitlimit Auswahl füllen ====
function fillTimeSelect() {
    timeSelect.innerHTML = '';
    let opt = document.createElement("option");
    opt.value = "0";
    opt.textContent = "Kein Limit";
    timeSelect.appendChild(opt);
    for (let t = 30; t <= 600; t += 15) {
        let opt = document.createElement("option");
        opt.value = t;
        opt.textContent = `${Math.floor(t/60)}:${String(t%60).padStart(2,"0")} min`;
        timeSelect.appendChild(opt);
    }
}
fillTimeSelect();

// ==== Highscore laden/speichern ====
function loadProgress() {
    highscore = +(localStorage.getItem('mazeHighscore') || 1);
    maxLevelUnlocked = +(localStorage.getItem('mazeMaxLevel') || 1);
    highscoreSpan.textContent = highscore;
    gameHighscoreSpan.textContent = "Highscore: " + highscore;
    updateLevelSelect();
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
    highscoreSpan.textContent = highscore;
    gameHighscoreSpan.textContent = "Highscore: " + highscore;
    updateLevelSelect();
}
loadProgress();

// ==== Level-Generator ====
function generateMaze(level) {
    // Simple Maze-Gen, keine Sackgassen, aber lösbar
    const size = Math.min(7 + Math.floor(level / 5), 20);
    let maze = Array(size).fill(0).map(() => Array(size).fill(1));
    // Start & Exit setzen
    maze[1][1] = 2; // Player
    maze[size-2][size-2] = 3; // Exit
    // Gänge bauen (simple recursive division könnte man besser machen)
    for (let y = 1; y < size-1; y++) {
        for (let x = 1; x < size-1; x++) {
            if ((x%2==1 || y%2==1) && Math.random() > 0.22) maze[y][x] = 0;
        }
    }
    // Gegner ab Level 5
    let enemyList = [];
    if (level >= 5) {
        let nEnemy = Math.min(Math.floor(level/5)+1, Math.floor(size/3));
        for (let i=0;i<nEnemy;i++) {
            let ex, ey;
            do {
                ex = 1 + Math.floor(Math.random()*(size-2));
                ey = 1 + Math.floor(Math.random()*(size-2));
            } while (maze[ey][ex]!==0 || (ex===1&&ey===1) || (ex===size-2&&ey===size-2));
            enemyList.push({x: ex, y: ey, dir: (i%2?"h":"v"), alive: true, t: 0});
        }
    }
    return {maze, enemyList, size};
}

// ==== Spielfeld-Setup ====
function startLevel(level) {
    let {maze: mz, enemyList, size} = generateMaze(level);
    maze = mz;
    let p = null, e = null;
    for(let y=0;y<size;y++)for(let x=0;x<size;x++){
        if(maze[y][x]===2) p={x,y};
        if(maze[y][x]===3) e={x,y};
    }
    player = {x:p.x,y:p.y,color:playerColorInput.value};
    exit = {x:e.x,y:e.y};
    enemies = enemyList;
    lives = enemies.length ? 3 : "";
    cellSize = Math.floor(Math.min(320, window.innerWidth*0.9) / size);
    canvas.width = cellSize*size;
    canvas.height = cellSize*size;
    curLevel = level;
    levelDisplay.textContent = `Level: ${level}`;
    timerDisplay.textContent = "";
    livesDisplay.textContent = enemies.length ? `Leben: ${lives}` : "";
    gameArea.style.display = "block";
    mainMenu.style.display = "none";
    timer = timeLimit = +timeSelect.value;
    clearInterval(timerInterval);
    if (timeLimit > 0) {
        timerInterval = setInterval(() => {
            if (!gameActive) return;
            timer--;
            updateTimer();
            if (timer <= 0) failLevel("Zeit abgelaufen!");
        }, 1000);
    }
    updateTimer();
    gameActive = true;
    joystickDir = null;
    restartBtn.style.display = "none";
    drawMaze();
    requestAnimationFrame(gameLoop);
}

// ==== Maze-Rendering ====
function drawMaze() {
    ctx.fillStyle = "#111";
    ctx.fillRect(0,0,canvas.width,canvas.height);
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 4;
    ctx.strokeRect(0,0,canvas.width,canvas.height);

    for(let y=0;y<maze.length;y++) {
        for(let x=0;x<maze[0].length;x++) {
            if(maze[y][x]===1) {
                ctx.fillStyle="#222";
                ctx.fillRect(x*cellSize, y*cellSize, cellSize, cellSize);
            }
            if(maze[y][x]===3) {
                ctx.fillStyle="#5af";
                ctx.fillRect(x*cellSize+cellSize*0.2, y*cellSize+cellSize*0.2, cellSize*0.6, cellSize*0.6);
                ctx.strokeStyle="#fff";
                ctx.strokeRect(x*cellSize+cellSize*0.2, y*cellSize+cellSize*0.2, cellSize*0.6, cellSize*0.6);
            }
        }
    }
    // Gegner
    for(const e of enemies) if(e.alive) {
        ctx.fillStyle="#f44";
        ctx.beginPath();
        ctx.arc(e.x*cellSize+cellSize/2, e.y*cellSize+cellSize/2, cellSize/3, 0, 2*Math.PI);
        ctx.fill();
        ctx.strokeStyle="#fff";
        ctx.lineWidth=2;
        ctx.stroke();
    }
    // Player
    ctx.fillStyle=player.color;
    ctx.beginPath();
    ctx.arc(player.x*cellSize+cellSize/2, player.y*cellSize+cellSize/2, cellSize/3, 0, 2*Math.PI);
    ctx.fill();
    ctx.strokeStyle="#222";
    ctx.lineWidth=2;
    ctx.stroke();
}

// ==== Game-Loop ====
function gameLoop() {
    if (!gameActive) return;
    moveEnemies();
    drawMaze();
    requestAnimationFrame(gameLoop);
}

// ==== Gegner bewegen ====
function moveEnemies() {
    for(let e of enemies) if(e.alive) {
        if (Math.random()>0.75) continue;
        if (e.dir==="h") {
            let d = Math.random()<0.5?-1:1;
            let nx = e.x+d;
            if (maze[e.y][nx]===0) e.x=nx;
        } else {
            let d = Math.random()<0.5?-1:1;
            let ny = e.y+d;
            if (maze[ny][e.x]===0) e.y=ny;
        }
    }
}

// ==== Spieler bewegen (Touch/Joystick) ====
joystickOuter.addEventListener('touchstart', joystickStart);
joystickOuter.addEventListener('mousedown', joystickStart);
function joystickStart(e) {
    joystickActive = true;
    updateJoystick(e);
    document.addEventListener('mousemove', updateJoystick);
    document.addEventListener('touchmove', updateJoystick);
    document.addEventListener('mouseup', joystickEnd);
    document.addEventListener('touchend', joystickEnd);
}
function joystickEnd() {
    joystickActive = false;
    joystickThumb.style.transform = "";
    document.removeEventListener('mousemove', updateJoystick);
    document.removeEventListener('touchmove', updateJoystick);
    document.removeEventListener('mouseup', joystickEnd);
    document.removeEventListener('touchend', joystickEnd);
}
function updateJoystick(e) {
    if (!joystickActive) return;
    let rect = joystickOuter.getBoundingClientRect();
    let cx = rect.left+rect.width/2, cy = rect.top+rect.height/2;
    let x, y;
    if (e.touches && e.touches.length) {
        x = e.touches[0].clientX; y = e.touches[0].clientY;
    } else {
        x = e.clientX; y = e.clientY;
    }
    let dx = x-cx, dy = y-cy;
    let dist = Math.sqrt(dx*dx+dy*dy);
    let max = rect.width/2-18;
    if (dist > max) { dx = dx*max/dist; dy = dy*max/dist; }
    joystickThumb.style.transform = `translate(${dx}px,${dy}px)`;
    if (dist>18) {
        let angle = Math.atan2(dy, dx);
        if (angle>=-Math.PI/4 && angle<Math.PI/4) joystickDir="right";
        else if (angle>=Math.PI/4 && angle<3*Math.PI/4) joystickDir="down";
        else if (angle<=-Math.PI/4 && angle>-3*Math.PI/4) joystickDir="up";
        else joystickDir="left";
        movePlayer(joystickDir);
    }
}
function movePlayer(dir) {
    if (!gameActive) return;
    let nx=player.x, ny=player.y;
    if(dir==="up") ny--;
    if(dir==="down") ny++;
    if(dir==="left") nx--;
    if(dir==="right") nx++;
    if(nx<0||ny<0||ny>=maze.length||nx>=maze[0].length) return;
    if(maze[ny][nx]===1) return; // Wand
    player.x=nx; player.y=ny;
    // Kollision mit Gegner
    for(const e of enemies) if(e.alive&&e.x===nx&&e.y===ny){
        if(lives>1){ lives--; livesDisplay.textContent=`Leben: ${lives}`; return;}
        else failLevel("Von Gegner erwischt!");
        return;
    }
    // Ziel erreicht
    if(nx===exit.x && ny===exit.y){
        saveProgress(curLevel+1);
        setTimeout(()=>{
            if(curLevel<TOTAL_LEVELS){
                startLevel(curLevel+1);
            }else{
                alert("Alle Level geschafft! Highscore: "+highscore);
                goToMenu();
            }
        }, 500);
        return;
    }
    drawMaze();
}

// ==== Hilfsfunktionen ====
function failLevel(msg) {
    gameActive = false;
    clearInterval(timerInterval);
    restartBtn.style.display = "inline-block";
    menuBtn.style.display = "inline-block";
    setTimeout(()=>alert(msg + " Versuch's nochmal!"), 10);
}
function updateTimer() {
    timerDisplay.textContent = (timeLimit > 0 ? `Zeit: ${timer}s` : "");
}

// ==== Buttons ====
startBtn.onclick = () => {
    let l = parseInt(levelSelect.value) || 1;
    startLevel(l);
};
restartBtn.onclick = () => startLevel(curLevel);
menuBtn.onclick = goToMenu;
function goToMenu() {
    gameActive = false;
    clearInterval(timerInterval);
    mainMenu.style.display = "block";
    gameArea.style.display = "none";
    updateLevelSelect();
}

// ==== Initialisieren ====
window.onload = function() {
    loadProgress();
    updateLevelSelect();
};
