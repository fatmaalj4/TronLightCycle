// ====================================== Classes Definition ======================================
class LightCycle {
    x = NUM_CELLS_HORIZONTAL / 2;
    y = 0;
    vx = 0; // positive for right
    vy = 0; // positive for down
    alive = true;

    reset(yPos, yDir) {
        this.x = NUM_CELLS_HORIZONTAL / 2;
        this.y = yPos;
        this.vx = 0;
        this.vy = yDir;
        this.alive = true;
    }

    constructor(yPos, yDir) {
        this.y = yPos;
        this.vy = yDir;
    }
}

class Point2D {
    x = 0;
    y = 0;

    reset() {
        this.x = 0;
        this.y = 0;
    }
}

// ====================================== Canvas Setup ======================================
// Creates a 2D array filled with zeros
var create2DArray = function (numColumns, numRows) {
    var array = [];
    for (var c = 0; c < numColumns; c++) {
        array.push([]); // adds an empty 1D array at the end of "array"
        for (var r = 0; r < numRows; r++) {
            array[c].push(0); // add zero at end of the 1D array "array[c]"
        }
    }
    return array;
};

var canvas = document.getElementById("myCanvas");
var C = canvas.getContext("2d");
var canvas_rectangle = canvas.getBoundingClientRect();

var cellSize = 5; // each cell in the grid is a square of this size, in pixels

var NUM_CELLS_HORIZONTAL = canvas.width / cellSize;
var NUM_CELLS_VERTICAL = canvas.height / cellSize;
var x0 = (canvas.width - NUM_CELLS_HORIZONTAL * cellSize) / 2;
var y0 = (canvas.height - NUM_CELLS_VERTICAL * cellSize) / 2;

var grid = [[]];
var CELL_EMPTY = 0;
var CELL_OCCUPIED_P1 = 1;
var CELL_OCCUPIED_P2 = 2;

var lightCycle1_trailColor = document.getElementById('moto1color').value;
var lightCycle2_trailColor = document.getElementById('moto2color').value;

var isGameRunning = false;
// ====================================== Game Setup ======================================
let timeSpeed = 100
let timer;

// Winners Count
var playerOneWins = 0;
var playerTwoWins = 0;
var draws = 0;

// Mouse Position
const mouseDownPos = new Point2D();
const mouseUpPos = new Point2D();
var mouseDownInCanvas = false; // Indicates that the mouse down happened inside the canvas

// Current position and direction of light cycle 1
const lightCycle1 = new LightCycle(NUM_CELLS_VERTICAL - 2, -1);

// Current y-position and y-direction of light cycle 2
const lightCycle2 = new LightCycle(1, 1);

function setupGrid() {
    grid = create2DArray(NUM_CELLS_HORIZONTAL, NUM_CELLS_VERTICAL);
    grid[lightCycle1.x][lightCycle1.y] = CELL_OCCUPIED_P1; // to mark the initial grid cell as occupied
    grid[lightCycle2.x][lightCycle2.y] = CELL_OCCUPIED_P2; // to mark the initial grid cell as occupied
}

function countWinner() {
    if (!lightCycle1.alive && !lightCycle2.alive) {
        drawsDisplay.innerHTML = ++draws;
    } else if (lightCycle1.alive) {
        playerOneWinsDisplay.innerHTML = ++playerOneWins;
    } else {
        playerTwoWinsDisplay.innerHTML = ++playerTwoWins;
    }
}

setupGrid();

// ====================================== Controls ======================================
function keyDownHandler(e) {
    // console.log("keyCode: " + e.keyCode );
    // e = e || window.event;

    const arrowKeys = [38, 40, 37, 39];
    const wasdKeys = [87, 83, 65, 68];
    const keyCode = e.keyCode;

    let vx = 0;
    let vy = 0;

    if (keyCode === arrowKeys[0] || keyCode === wasdKeys[0]) {
        // up
        vy = -1;
    } else if (keyCode === arrowKeys[1] || keyCode === wasdKeys[1]) {
        // down
        vy = 1;
    } else if (keyCode === arrowKeys[2] || keyCode === wasdKeys[2]) {
        // left
        vx = -1;
    } else if (keyCode === arrowKeys[3] || keyCode === wasdKeys[3]) {
        // right
        vx = 1;
    }

    if (arrowKeys.includes(keyCode)) {
        // Player 1
        lightCycle1.vx = vx;
        lightCycle1.vy = vy;
    } else if (wasdKeys.includes(keyCode)) {
        // Player 2
        lightCycle2.vx = vx;
        lightCycle2.vy = vy;
    }
}

function mouseDownHandler(e) {
    mouseDownPos.x = e.screenX;
    mouseDownPos.y = e.screenY;
    mouseDownInCanvas = true;
}

function mouseUpHandler(e) {
    if (mouseDownInCanvas) {
        mouseUpPos.x = e.screenX;
        mouseUpPos.y = e.screenY;

        const delta_x = mouseUpPos.x - mouseDownPos.x;
        const delta_y = mouseUpPos.y - mouseDownPos.y;

        lightCycle1.vx = 0;
        lightCycle1.vy = 0;

        if (Math.abs(delta_x) > Math.abs(delta_y)) {
            lightCycle1.vx = delta_x > 0 ? 1 : -1; // if true, vers la droite, else vers la gauche
        } else {
            lightCycle1.vy = delta_y > 0 ? 1 : -1; // if true, vers le bas, else vers le haut
        }

        mouseDownInCanvas = false; // resets the variable
    }
}

myCanvas.onmousedown = mouseDownHandler;
document.onkeydown = keyDownHandler;
document.onmouseup = mouseUpHandler;

// ====================================== LightCycle Updates ======================================
var redraw = function () {
    C.fillStyle = "#000000";
    C.fillRect(0, 0, canvas.width, canvas.height);

    //les couleurs du tracé des joueurs
    for (var i = 0; i < NUM_CELLS_HORIZONTAL; ++i) {
        for (var j = 0; j < NUM_CELLS_VERTICAL; ++j) {
            if (grid[i][j] === 1) {
                C.fillStyle = lightCycle1_trailColor; // Couleur de joueur 1
                C.fillRect(
                    x0 + i * cellSize + 1,
                    y0 + j * cellSize + 1,
                    cellSize - 2,
                    cellSize - 2
                );
            } else if (grid[i][j] === 2) {
                C.fillStyle = lightCycle2_trailColor; // Couleur de joueur 2
                C.fillRect(
                    x0 + i * cellSize + 1,
                    y0 + j * cellSize + 1,
                    cellSize - 2,
                    cellSize - 2
                );
            }
        }
    }


    const getHeadColor = (lightCycle) => {
        C.fillStyle = lightCycle.alive ? "#ff0000" : "#ffffff";
        C.fillRect(
            x0 + lightCycle.x * cellSize,
            y0 + lightCycle.y * cellSize,
            cellSize,
            cellSize
        );
    };

    getHeadColor(lightCycle1); // Player 1
    getHeadColor(lightCycle2); // Player 2
};


var hasCollided = function (new_x, new_y) {
    return (
        new_x < 0 ||
        new_x >= NUM_CELLS_HORIZONTAL ||
        new_y < 0 ||
        new_y >= NUM_CELLS_VERTICAL ||
        grid[new_x][new_y] === CELL_OCCUPIED_P1 ||
        grid[new_x][new_y] === CELL_OCCUPIED_P2
    );
};

var updateLightCycle = function (lightCycle, playerNum) {
    var new_x = lightCycle.x + lightCycle.vx;
    var new_y = lightCycle.y + lightCycle.vy;

    // Check for collision with grid boundaries and with trail
    if (hasCollided(new_x, new_y)) {
        lightCycle.alive = false;
    } else {
        grid[new_x][new_y] = playerNum; // 1 pour joueur 1, 2 pour joueur 2
        lightCycle.x = new_x;
        lightCycle.y = new_y;
    }
};


function advanceTimeout() {
    timeSpeed *= 0.995
    // console.log('Time Speed: ' + timeSpeed)

    // un message pour prouver que l'animation continue
    if (isGameRunning) {
        console.log("Game is running: animating next frame");
        
        advance();
        timer = setTimeout(advanceTimeout, timeSpeed);
    }
}

function advance() {
    if (lightCycle1.alive && lightCycle2.alive) {
        updateLightCycle(lightCycle1, 1); // 1 pour joueur 1
        updateLightCycle(lightCycle2, 2); // 2 pour joueur 2
        redraw();
    } else {
        countWinner();
        restartGame();
    }
}

function startGame() {
    if (!isGameRunning) {
        isGameRunning = true;
        console.log("Game started");

        advanceTimeout(); // Lance la première itération
    }
}

async function pauseGame() {
    if (isGameRunning) {
        isGameRunning = false; // Arrête le jeu
        console.log("Game paused");

        // Promise to make sure the timer is cleared
        const promise = new Promise((a, b) => {
            clearTimeout(timer)
            setTimeout(() => { a() }, timeSpeed + 1)
        })

        await promise
    }
}

async function restartGame() {
    await pauseGame() // Stoppe la boucle de jeu actuelle

    // Remette la vitesse du temps à 100%
    timeSpeed = 100

    // Réinitialise l'état des LightCycles
    lightCycle1.reset(NUM_CELLS_VERTICAL - 2, -1); // player 1
    lightCycle2.reset(1, 1); // player 2

    // Réinitialise la grille
    setupGrid();

    // Récupérer les nouvelles couleurs après redémarrage
    lightCycle1_trailColor = document.getElementById('moto1color').value;
    lightCycle2_trailColor = document.getElementById('moto2color').value;

    // Reset Mouse Position
    mouseDownPos.reset();
    mouseUpPos.reset();
    mouseDownInCanvas = false;

    // Redessine le canvas avec les nouvelles couleurs
    redraw();

    // Redémarre le jeu
    startGame();
}




window.onload = function () {
    startGame();
};
