const grid = document.getElementById('tetris-grid');

// Create a 10×10 grid (100 cells)
for (let i = 0; i < 100; i++) {
  const cell = document.createElement('div');
  cell.classList.add('cell');
  grid.appendChild(cell);
}
const cells = Array.from(grid.children);

//Base Tetromino class
class Tetromino {
    constructor(rotations, color, cells) {
        this.rotations = rotations;  // array of shape rotations
        this.index = 0;              // current rotation index
        this.color = color;          // color of the tetromino
        this.position = 4;           // starting position (4 is the middle of the grid)
        this.cells = cells;          // reference to the grid cells
    }

    // General-purpose draw function
    draw(offsets, targetCells, position = 0) {
        offsets.forEach(i => {
            targetCells[position + i].style.backgroundColor = this.color;
        });
    }

    // General-purpose erase function
    erase(offsets, targetCells, position = 0) {
        offsets.forEach(i => {
            targetCells[position + i].style.backgroundColor = '';
        });
    }

    // Move the tetromino down
    moveDown() {
        // Check for collision with the bottom or other pieces
        const willCollide = this.rotations[this.index].some(i => {
            const newPos = this.position + i + 10;
            return newPos >= 100 || this.cells[newPos].classList.contains('taken');
        });

        // If it will collide, lock the tetromino in place
        if (willCollide) {
            this.lock();
            return false; 
        } else {  // Otherwise, move it down
            this.erase(this.rotations[this.index], this.cells, this.position);
            this.position += 10;
            this.draw(this.rotations[this.index], this.cells, this.position);
            return true;
        }
    }

    // Lock the tetromino in place
    lock() {
        this.rotations[this.index].forEach(i => {
            const cell = this.cells[this.position + i];
            cell.classList.add('taken');
            cell.style.backgroundColor = this.color;
        });
    }
}

// Specific Tetrominos
class IShape extends Tetromino{
    constructor(cells) {
        const rotations = [
            [10, 11, 12, 13]  
        ];
        super(rotations, 'cyan', cells);
    }
}

class JShape extends Tetromino{
    constructor(cells){
        const rotations = [
            [0,  10, 11, 12]   
        ];
        super(rotations, 'blue', cells);
    }
}

class LShape extends Tetromino{
    constructor(cells) {
        const rotations = [
            [2,  10, 11, 12]   
        ];
        super(rotations, 'orange', cells);
    }
}

class OShape extends Tetromino {
    constructor(cells) {
        const rotations = [
            [0, 1, 10, 11]  
        ];
        super(rotations, 'yellow', cells);
    }
}

class SShape extends Tetromino {
    constructor(cells) {
        const rotations = [
            [1,  2,  10, 11] 
        ];
        super(rotations, 'green', cells);
    }
}

class TShape extends Tetromino {
    constructor(cells) {
        const rotations = [
            [1,  10, 11, 12]  
        ];
        super(rotations, 'purple', cells);
    }
}
  
class ZShape extends Tetromino {
    constructor(cells) {
        const rotations = [
            [0,  1,  11, 12]   
        ];
        super(rotations, 'red', cells);
    }
}

// classic random function for arrays
Array.prototype.random = function () {
    return this[Math.floor((Math.random()*this.length))];
}

// array to pick random pieces from 
const pieces = [IShape, JShape, LShape, OShape, SShape, TShape, ZShape];

// Game class
class Game {
    constructor(cells, grid) {
        this.grid = grid;            // reference to the DOM grid
        this.cells = cells;          // array of cells in the grid
        this.speed = 300;            // initial speed (tick rate)
        this.intervalId = null;      // for game loop
        this.lockedPiecesCount = 0;  // count of locked pieces

        // Initialize the game with random pieces
        this.currentPiece = new (pieces.random())(this.cells, this.next, this.held);
        this.currentPiece.draw(this.currentPiece.rotations[this.currentPiece.index], this.currentPiece.cells, this.currentPiece.position);
    }

    // Clear all cells: remove background color and 'taken' class
    clearBoard() {
        this.cells.forEach(cell => {
        cell.style.backgroundColor = '';
        cell.classList.remove('taken');
        });
    }
    
    // Game tick
    tick() {
        // Move the current piece down, check for game over, clear lines, and update score 
        const moved = this.currentPiece.moveDown();

        // If the piece can't move down, create a new piece
        if (!moved) {
            // increment the count of locked pieces and reset if we have 4 
            this.lockedPiecesCount++;
            if (this.lockedPiecesCount >= 4) {
                this.clearBoard();
                this.lockedPiecesCount = 0;
            }

            // Move next piece to current and create a new next piece
            this.currentPiece = new (pieces.random())(this.cells, this.next, this.held);
            this.currentPiece.draw(this.currentPiece.rotations[this.currentPiece.index], this.currentPiece.cells, this.currentPiece.position);
        }
    }

    // method to start or restart the game loop
    startGameLoop() {
        if (this.intervalId) clearInterval(this.intervalId);
        this.intervalId = setInterval(() => this.tick(), this.speed);
    }
}

// start the loop
const game = new Game(cells, grid);
game.startGameLoop();
