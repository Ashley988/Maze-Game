// ========== Grunddaten und Einstellungen ==========
const canvas = document.getElementById("mazeCanvas");
const ctx = canvas.getContext("2d");
const mainMenu = document.getElementById("mainMenu");
const gameArea = document.getElementById("gameArea");
const playerColorInput = document.getElementById("playerColor");
const levelSelect = document.getElementById("levelSelect");
const timeSelect = document.getElementById("timeSelect");
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

let player, exit, maze, enemies, lives, curLevel, timer, timeLimit, timerInterval;
let gameActive = false, joystickDir = null;
let highscore = 1, maxLevelUnlocked = 1;
let joystickCenter, joystickActive = false, joystickVector = {x:0, y:0};

const cellSizeBase = 28; // Zelle px, Canvas dynamisch
const joystickOuter = document.getElementById("joystickOuter");
const joystickThumb = document.getElementById("joystickThumb");

// ====== Zeitlimit-Optionen (Dropdown vorbereiten) ======
(function fillTimeSelect() {
    let max = 600;
    for (let t = 30; t <= max; t += 15) {
        let min = Math.floor(t/60), sec = t%60;
        let label = (min > 0 ? `${min}min ` : "") + (sec > 0 ? `${sec}s` : "");
        let opt = document.createElement("option");
        opt.value = t;
        opt.textContent = label;
        timeSelect.appendChild(opt);
    }
})();

// ====== Beispiel-Levels (später erweiterbar auf 100) ======
// 0=wand, 1=weg, 2=player, 3=exit, 4=gegner-h/v
const levelDefs = [
    // Level 1 (5x5, easy)
    [
        [0,0,0,0,0],
        [0,2,1,1,0],
        [0,1,0,1,0],
        [0,1,3,1,0],
        [0,0,0,0,0],
    ],
    // Level 2 (7x7, größer)
    [
        [0,0,0,0,0,0,0],
        [0,2,1,1,1,3,0],
        [0,1,0,1,0,1,0],
        [0,1,0,1,0,1,0],
        [0,1,1,1,1,1,0],
        [0,0,0,1,0,0,0],
        [0,0,0,0,0,0,0],
    ],
    // Level 3 (8x8, Gegner horizontal)
    [
        [0,0,0,0,0,0,0,0],
        [0,2,1,1,1,1,3,0],
        [0,1,0,0,0,1,0,0],
        [0,1,0,4,0,1,1,0],
        [0,1,1,1,1,0,1,0],
        [0,0,0,0,1,0,1,0],
        [0,1,1,1,1,1,1,0],
        [0,0,0,0,0,0,0,0],
    ],
    // Level 4 (10x10, Gegner vertikal)
    [
        [0,0,0,0,0,0,0,0,0,0],
        [0,2,1,1,0,1,1,1,3,0],
        [0,1,0,1,0,1,0,1,1,0],
        [0,1,0,1,0,1,0,1,0,0],
        [0,1,0,1,0,1,0,1,0,0],
        [0,1,1,1,4,1,0,1,1,0],
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,1,1,1,1,1,1,0,0],
        [0,0,1,0,0,0,0,1,0,0],
        [0,0,0,0,0,0,0,0,0,0],
    ]
    // ... für Demo, 4 Level. Erweitere nach Wunsch! Bis 100!
];

// ====== LocalStorage Highscore laden/speichern ======
function loadProgress() {
    highscore = +(localStorage.getItem('mazeHighscore')||1);
    maxLevelUnlocked = +(localStorage.getItem('mazeMaxLevel')||1);
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
    highscoreSpan.textContent = highscore;
    gameHighscoreSpan.textContent = highscore;
    maxLevelInfo.textContent = `(bis Level ${maxLevelUnlocked})`;
}

// ====== Level Dropdown vorbereiten ======
function updateLevelSelect() {
    levelSelect.innerHTML = "";
    let max = Math.min(levelDefs.length, maxLevelUnlocked);
    for (let i = 1; i <= max; i++) {
        let opt = document.createElement("option");
        opt.value = i;
        opt.textContent = "Level " + i;
        levelSelect.appendChild(opt);
    }
}

// ====== Spielstart ======
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

// ====== Level laden, initialisieren ======
function startLevel(level) {
    maze = levelDefs[level-1];
    let n = maze.length, m = maze[0].length;
    // Canvas-Größe passend setzen
    canvas.width = m*cellSizeBase;
    canvas.height = n*cellSizeBase;
    // Spielfigur finden
    for(let y=0; y<n; y++) for(let x=0; x<m; x++) {
        if(maze[y][x]===2) player={x, y};
        if(maze[y][x]===3) exit={x, y};
    }
    // Gegner sammeln
    enemies = [];
    for(let y=0; y<n; y++) for(let x=0; x<m; x++) {
        if(maze[y][x]===4)
            enemies.push({
                x, y,
                dir: (level>=4?"v":"h"),
                t: 0, alive:true
            });
    }
    // Leben & Timer
    lives = (enemies.length>0) ? 3 : "";
    levelDisplay.textContent = `Level ${level}`;
    curLevelDisplay.textContent = level;
    updateLives();
    // Zeitlimit setzen
    timeLimit = +timeSelect.value;
    if(timerInterval) clearInterval(timerInterval);
    timer = timeLimit;
    updateTimer();
    if(timeLimit>0) {
        timerInterval = setInterval(() => {
            if (!gameActive) return;
            timer--;
            updateTimer();
            if (timer<=0) failLevel("Zeit abgelaufen!");
        },1000);
    }
    // Farben, State
    player.color = playerColorInput.value;
    gameActive = true;
    joystickDir = null;
    restartBtn.style.display = "none";
    menuBtn.style.display = "none";
    drawMaze();
    requestAnimationFrame(gameLoop);
}
function updateLives() {
    livesDisplay.textContent = lives ? `Leben: ${lives}` : "";
}
function updateTimer() {
    timerDisplay.textContent = (timeLimit>0 ? `Zeit: ${timer}s` : "");
}

// ====== Maze Rendering ======
function drawMaze() {
    // Schwarz, Rahmen
    ctx.fillStyle = "#111";
    ctx.fillRect(0,0,canvas.width,canvas.height);
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 4;
    ctx.strokeRect(0,0,canvas.width,canvas.height);
    // Zellen
    for(let y=0; y<maze.length; y++)
        for(let x=0; x<maze[0].length; x++) {
            if(maze[y][x]===0){
                ctx.fillStyle="#000";
                ctx.fillRect(x*cellSizeBase, y*cellSizeBase, cellSizeBase, cellSizeBase);
            }
            if(maze[y][x]===3){
                // Ausgang
                ctx.fillStyle="#5af";
                ctx.fillRect(x*cellSizeBase, y*cellSizeBase, cellSizeBase, cellSizeBase);
                ctx.strokeStyle="#fff";
                ctx.strokeRect(x*cellSizeBase+6, y*cellSizeBase+6, cellSizeBase-12, cellSizeBase-12);
            }
        }
    // Gegner
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
    // Player
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

// ====== Game Loop ======
function gameLoop() {
    if(!gameActive) return;
    moveEnemies();
    drawMaze();
    requestAnimationFrame(gameLoop);
}

// ====== Gegner bewegen ======
function moveEnemies() {
    for(let e of enemies){
        if(!e.alive) continue;
        // Horizontal
        if(e.dir==="h" && (performance.now()/430)%1<0.5){
            let nx=e.x+1, px=e.x-1;
            if(nx<maze[0].length && maze[e.y][nx]!==0) e.x=nx;
            else if(px>=0 && maze[e.y][px]!==0) e.x=px;
        }
        // Vertikal
        if(e.dir==="v" && (performance.now()/530)%1<0.5){
            let ny=e.y+1, py=e.y-1;
            if(ny<maze.length && maze[ny][e.x]!==0) e.y=ny;
            else if(py>=0 && maze[py][e.x]!==0) e.y=py;
        }
    }
}

// ====== Joystick Steuerung ======
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
    if(dist > max){
        dx = dx*max/dist; dy = dy*max/dist;
    }
    joystickThumb.style.transform = `translate(${dx}px,${dy}px)`;
    // Richtung bestimmen
    let angle = Math.atan2(dy, dx);
    if(dist>18){
        if(angle>-Math.PI*0.75 && angle<-Math.PI*0.25) joystickDir="up";
        else if(angle>-Math.PI*0.25 && angle<Math.PI*0.25) joystickDir="right";
        else if(angle>Math.PI*0.25 && angle<Math.PI*0.75) joystickDir="down";
        else joystickDir="left";
        movePlayer(joystickDir);
    }
}

// ====== Spieler-Bewegung ======
let moveCooldown = false;
function movePlayer(dir){
    if(moveCooldown) return;
    let nx=player.x, ny=player.y;
    if(dir==="up") ny--;
    if(dir==="down") ny++;
    if(dir==="left") nx--;
    if(dir==="right") nx++;
    // Prüfen auf Gänge
    if(nx>=0 && ny>=0 && ny<maze.length && nx<maze[0].length && maze[ny][nx]!==0){
        player.x=nx; player.y=ny;
        // Gegnerkontakt
        for(let e of enemies) if(e.x===nx&&e.y===ny&&e.alive){
            if(lives>1){lives--;updateLives();failFlash();return;}
            else {failLevel("Von Gegner gefangen!"); return;}
        }
        // Ausgang erreicht
        if(nx===exit.x && ny===exit.y){
            // Nächstes Level freischalten
            saveProgress(curLevel+1);
            setTimeout(()=>{
                if(curLevel<levelDefs.length){
                    curLevel++; startLevel(curLevel);
                }else{
                    alert("Alle Level geschafft!"); goToMenu();
                }
            }, 500);
            return;
        }
        // Schritt erfolgreich
        drawMaze();
        moveCooldown=true;
        setTimeout(()=>{moveCooldown=false;}, 140);
    }
}

function failFlash(){
    canvas.style.boxShadow="0 0 22px #f44";
    setTimeout(()=>canvas.style.boxShadow="",220);
}

function failLevel(reason){
    gameActive=false;
    if(timerInterval) clearInterval(timerInterval);
    restartBtn.style.display = "inline-block";
    menuBtn.style.display = "inline-block";
    alert(reason + " Versuch's nochmal!");
}

window.onload = function(){
    loadProgress();
    updateLevelSelect();
};
