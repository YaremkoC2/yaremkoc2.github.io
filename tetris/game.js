// Import tetrominos
import { Tetromino, IShape, JShape, LShape, OShape, SShape, TShape, ZShape} from './tetromino.js';

// classic random function for arrays
Array.prototype.random = function () 
{
    return this[Math.floor((Math.random()*this.length))];
}

// array to pick random pieces from 
const pieces = [IShape, JShape, LShape, OShape, SShape, TShape, ZShape];

// Game class
class Game 
{
    constructor(cells, grid, next) 
    {
        this.grid = grid;        // reference to the DOM grid
        this.cells = cells;      // array of cells in the grid
        this.linesCleared = 0;   // used for level up
        this.score = 0;          // current score
        this.level = 1;          // current level
        this.speed = 1000;       // initial speed (tick rate)
        this.intervalId = null;  // for game loop
        this.next = next;        // reference to the next piece display

        // Initialize the game with random pieces
        this.nextPiece = new (pieces.random())(this.cells, this.next);
        this.nextPiece.drawNext();
        this.currentPiece = new (pieces.random())(this.cells, this.next);
        this.currentPiece.draw();
    }
    
    // Game tick
    tick() 
    {
        // Move the current piece down, clear lines, and update score
        const moved = this.currentPiece.moveDown();
        this.clearLines();
        this.updateScore();

        // If the piece can't move down, create a new piece
        if (!moved) 
        {
            // Move next piece to current and create a new next piece
            this.currentPiece = this.nextPiece; 
            this.currentPiece.draw();
            this.nextPiece.eraseNext();
            this.nextPiece = new (pieces.random())(this.cells, this.next);
            this.nextPiece.drawNext();
        }
    }

    // Check for completed lines
    clearLines() 
    {
        let numCleared = 0; // track number of cleared lines on this tick

        // Check each row for completed lines
        for (let row = 0; row < 20; row++) 
        {
            const start = row * 10;
            const line = this.cells.slice(start, start + 10);

            if (line.every(cell => cell.classList.contains('taken'))) 
            {
                // Clear the line
                line.forEach(cell => {
                    cell.classList.remove('taken');
                    cell.style.backgroundColor = '';
                });

                // Remove cleared cells from the DOM and array
                this.cells.splice(start, 10);

                // Create 10 new empty cells at the top
                const newCells = Array(10).fill(null).map(() => {
                    const cell = document.createElement('div');
                    cell.classList.add('cell');
                    return cell;
                });

                // Insert new cells at the beginning
                this.cells.unshift(...newCells);

                // Rebuild the grid DOM
                this.grid.innerHTML = ''; // Clear grid
                this.cells.forEach(cell => this.grid.appendChild(cell)); // Re-render

                numCleared++;
            }
        }
        
        // Update score based on number of cleared lines
        if (numCleared == 1) this.score += 100 * this.level;
        if (numCleared == 2) this.score += 300 * this.level;
        if (numCleared == 3) this.score += 500 * this.level;
        if (numCleared == 4) this.score += 800 * this.level;

        // Update lines cleared
        this.linesCleared += numCleared;
        if (this.linesCleared >= 10) 
        {
            this.level++;
            this.linesCleared = this.linesCleared - 10;
            this.speed = Math.max(100, this.speed - 100);
            this.startGameLoop(); 
        }
    }

    // Update the score display
    updateScore() 
    {
        const scoreDisplay = document.getElementById('score');
        scoreDisplay.innerText = `Score : ${this.score}`;
        const levelDisplay = document.getElementById('level');
        levelDisplay.innerText = `Level : ${this.level}`;
    }

    // method to start or restart the game loop
    startGameLoop() 
    {
        if (this.intervalId) clearInterval(this.intervalId);
        this.intervalId = setInterval(() => this.tick(), this.speed);
    }
}

export { Game };
