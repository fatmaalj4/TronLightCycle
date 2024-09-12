// Creates a 2D array filled with zeros
var create2DArray = function( numColumns, numRows ) {
	var array = [];
	for ( var c = 0; c < numColumns; c++ ) {
		array.push([]); // adds an empty 1D array at the end of "array"
		for ( var r = 0; r < numRows; r++ ) {
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
var x0 = ( canvas.width - NUM_CELLS_HORIZONTAL * cellSize ) /2;
var y0 = ( canvas.height - NUM_CELLS_VERTICAL * cellSize ) /2;

var grid = create2DArray( NUM_CELLS_HORIZONTAL, NUM_CELLS_VERTICAL );
var CELL_EMPTY = 0;
var CELL_OCCUPIED = 1;

// Current position and direction of light cycle 1
var lightCycle1_x = NUM_CELLS_HORIZONTAL / 2;
var lightCycle1_y = NUM_CELLS_VERTICAL - 2;
var lightCycle1_vx = 0; // positive for right
var lightCycle1_vy = -1; // positive for down
var lightCycle1_alive = true;

grid[lightCycle1_x][lightCycle1_y] = CELL_OCCUPIED; // to mark the initial grid cell as occupied

function keyDownHandler(e) {
	// console.log("keyCode: " + e.keyCode );
	// e = e || window.event;

	if (e.keyCode === 38) { // up arrow
		lightCycle1_vx = 0;
		lightCycle1_vy = -1;
	}
	else if (e.keyCode === 40) { // down arrow
		lightCycle1_vx = 0;
		lightCycle1_vy = 1;
	}
	else if (e.keyCode === 37) { // left arrow
		lightCycle1_vy = 0;
		lightCycle1_vx = -1;
	}
	else if (e.keyCode === 39) { // right arrow
		lightCycle1_vy = 0;
		lightCycle1_vx = 1;
	}
}

document.onkeydown = keyDownHandler;


var redraw = function() {
	C.fillStyle = "#000000";
	// C.clearRect(0, 0, canvas.width, canvas.height);
	C.fillRect(0,0,canvas.width,canvas.height);
	C.fillStyle = "#00ffff";

	for ( var i = 0; i < NUM_CELLS_HORIZONTAL; ++i ) {
		for ( var j = 0; j < NUM_CELLS_VERTICAL; ++j ) {
			if ( grid[i][j] === CELL_OCCUPIED )
					C.fillRect( x0+i*cellSize+1, y0+j*cellSize+1, cellSize-2, cellSize-2 );
		}
	}
	C.fillStyle = lightCycle1_alive ? "#ff0000" : "#ffffff";
	C.fillRect( x0+lightCycle1_x*cellSize, y0+lightCycle1_y*cellSize, cellSize, cellSize );

}

var advance = function() {

	if ( lightCycle1_alive ) {
		var new1_x = lightCycle1_x + lightCycle1_vx;
		var new1_y = lightCycle1_y + lightCycle1_vy;

		// Check for collision with grid boundaries and with trail
		if (
			new1_x < 0 || new1_x >= NUM_CELLS_HORIZONTAL
			|| new1_y < 0 || new1_y >= NUM_CELLS_VERTICAL
			|| grid[new1_x][new1_y] === CELL_OCCUPIED
		) {
			lightCycle1_alive = false;
		}
		else {
			grid[new1_x][new1_y] = CELL_OCCUPIED;
			lightCycle1_x = new1_x;
			lightCycle1_y = new1_y;
		}
		redraw();
	}
}

setInterval( function() { advance(); }, 100 /*milliseconds*/ );