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
}



var canvas = document.getElementById("myCanvas");
var C = canvas.getContext("2d");
var canvas_rectangle = canvas.getBoundingClientRect();

var cellSize = 5; // each cell in the grid is a square of this size, in pixels

var NUM_CELLS_HORIZONTAL = canvas.width / cellSize;
var NUM_CELLS_VERTICAL = canvas.height / cellSize;
var x0 = (canvas.width - NUM_CELLS_HORIZONTAL * cellSize) / 2;
var y0 = (canvas.height - NUM_CELLS_VERTICAL * cellSize) / 2;

var grid = create2DArray(NUM_CELLS_HORIZONTAL, NUM_CELLS_VERTICAL);
var CELL_EMPTY = 0;
var CELL_OCCUPIED = 1;

class LightCycle {
    x = NUM_CELLS_HORIZONTAL / 2
    y = 0
    vx = 0 // positive for right
    vy = 0 // positive for down
    alive = true
}

// Current position and direction of light cycle 1
const lightCycle1 = new LightCycle()
lightCycle1.y = NUM_CELLS_VERTICAL - 2
lightCycle1.vy = -1

// Current y-position and y-direction of light cycle 2
const lightCycle2 = new LightCycle()
lightCycle2.y = 2
lightCycle2.vy = 1

grid[lightCycle1.x][lightCycle1.y] = CELL_OCCUPIED; // to mark the initial grid cell as occupied
grid[lightCycle2.x][lightCycle2.y] = CELL_OCCUPIED; // to mark the initial grid cell as occupied

function keyDownHandler(e) {
    // console.log("keyCode: " + e.keyCode );
    // e = e || window.event;
    const arrowKeys = [38, 40, 37, 39]
    const wasdKeys = [87, 83, 65, 68]
    const keyCode = e.keyCode

    let vx = 0
    let vy = 0

    if (keyCode === arrowKeys[0] || keyCode === wasdKeys[0]) { // up
        vy = -1;
    }
    else if (keyCode === arrowKeys[1] || keyCode === wasdKeys[1]) { // down
        vy = 1;
    }
    else if (keyCode === arrowKeys[2] || keyCode === wasdKeys[2]) { // left
        vx = -1;
    }
    else if (keyCode === arrowKeys[3] || keyCode === wasdKeys[3]) { // right
        vx = 1;
    }

    if (arrowKeys.includes(keyCode)) { // Player 1
        lightCycle1.vx = vx;
        lightCycle1.vy = vy;
    } else if (wasdKeys.includes(keyCode)) { // Player 2
        lightCycle2.vx = vx;
        lightCycle2.vy = vy;
    }
}

document.onkeydown = keyDownHandler;


var redraw = function () {
    C.fillStyle = "#000000";
    // C.clearRect(0, 0, canvas.width, canvas.height);
    C.fillRect(0, 0, canvas.width, canvas.height);

    C.fillStyle = "#00ffff";
    for (var i = 0; i < NUM_CELLS_HORIZONTAL; ++i) {
        for (var j = 0; j < NUM_CELLS_VERTICAL; ++j) {
            if (grid[i][j] === CELL_OCCUPIED)
                C.fillRect(x0 + i * cellSize + 1, y0 + j * cellSize + 1, cellSize - 2, cellSize - 2);
        }
    }

    const getHeadColor = (lightCycle) => {
        C.fillStyle = lightCycle.alive ? "#ff0000" : "#ffffff";
        C.fillRect(x0 + lightCycle.x * cellSize, y0 + lightCycle.y * cellSize, cellSize, cellSize);
    }

    getHeadColor(lightCycle1) // Player 1
    getHeadColor(lightCycle2) // Player 2
}

var hasCollided = function (new_x, new_y) {
    return new_x < 0 || new_x >= NUM_CELLS_HORIZONTAL
        || new_y < 0 || new_y >= NUM_CELLS_VERTICAL
        || grid[new_x][new_y] === CELL_OCCUPIED
}

var updateLightCycle = function (lightCycle) {
    var new_x = lightCycle.x + lightCycle.vx;
    var new_y = lightCycle.y + lightCycle.vy;

    // Check for collision with grid boundaries and with trail
    if (hasCollided(new_x, new_y)) {
        lightCycle.alive = false;
    }
    else {
        grid[new_x][new_y] = CELL_OCCUPIED;
        lightCycle.x = new_x;
        lightCycle.y = new_y;
    }
}

var advance = function () {
    if (lightCycle1.alive && lightCycle2.alive) {
        updateLightCycle(lightCycle1)
        updateLightCycle(lightCycle2)
        redraw();
    }
}

setInterval(function () { advance(); }, 100 /*milliseconds*/);