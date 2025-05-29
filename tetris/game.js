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
    constructor(cells, grid, next, held) 
    {
        this.grid = grid;        // reference to the DOM grid
        this.cells = cells;      // array of cells in the grid
        this.linesCleared = 0;   // used for level up
        this.score = 0;          // current score
        this.level = 1;          // current level
        this.speed = 1000;       // initial speed (tick rate)
        this.intervalId = null;  // for game loop
        this.next = next;        // reference to the next piece display
        this.held = held;        // reference to the held piece display
        this.heldPiece = null;   // no held piece initially
        this.heldFlag = false;   // flag to check if a piece has been held

        // Initialize the game with random pieces
        this.nextPiece = new (pieces.random())(this.cells, this.next, this.held);
        console.log(this.nextPiece.held);
        console.log(this.held);
        this.nextPiece.draw(this.nextPiece.display, this.nextPiece.next);
        this.currentPiece = new (pieces.random())(this.cells, this.next, this.held);
        this.currentPiece.draw(this.currentPiece.rotations[this.currentPiece.index], this.currentPiece.cells, this.currentPiece.position);
    }
    
    // Game tick
    tick() 
    {
        // Move the current piece down, check for game over, clear lines, and update score 
        const moved = this.currentPiece.moveDown();
        this.checkGameOver();
        this.clearLines();
        this.updateScore();

        // If the piece can't move down, create a new piece
        if (!moved)
        {

            // Move next piece to current and create a new next piece
            this.currentPiece = this.nextPiece; 
            this.currentPiece.draw(this.currentPiece.rotations[this.currentPiece.index], this.currentPiece.cells, this.currentPiece.position);
            this.nextPiece.erase(this.nextPiece.display, this.nextPiece.next);
            this.nextPiece = new (pieces.random())(this.cells, this.next, this.held);
            this.nextPiece.draw(this.nextPiece.display, this.nextPiece.next);

            this.heldFlag = false; // reset held flag for next piece
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
            this.linesCleared -= 10;
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

    // method to hold the current piece
    holdPiece() 
    {
        if (this.heldFlag) return; // can't hold again until next piece is placed

        this.currentPiece.erase(this.currentPiece.rotations[this.currentPiece.index], this.currentPiece.cells, this.currentPiece.position);

        if (this.heldPiece) 
        {
            this.heldPiece.erase(this.heldPiece.display, this.held);

            // Swap current piece with held piece
            const temp = this.currentPiece;
            this.currentPiece = this.heldPiece;
            this.heldPiece = temp;
            this.heldPiece.draw(this.heldPiece.display, this.heldPiece.held);

            // reset held piece position and index
            this.heldPiece.position = 4; // reset to starting position
            this.heldPiece.index = 0; // reset rotation index
        } 
        else 
        {
            // If no held piece, just set the current piece as held
            this.nextPiece.erase(this.nextPiece.display, this.nextPiece.next);

            this.heldPiece = this.currentPiece;
            this.heldPiece.draw(this.heldPiece.display, this.heldPiece.held);

            this.currentPiece = this.nextPiece;
            this.nextPiece = new (pieces.random())(this.cells, this.next, this.held);
            this.nextPiece.draw(this.nextPiece.display, this.nextPiece.next);
        }
  
        this.currentPiece.draw(this.currentPiece.rotations[this.currentPiece.index], this.currentPiece.cells, this.currentPiece.position);

        // Set flag to prevent holding again until next piece is placed
        this.heldFlag = true;
    }

    // check for game over
    checkGameOver() 
    {
        // If the top row has any taken cells, game over
        if (this.cells.slice(0, 10).some(cell => cell.classList.contains('taken'))) 
        {
            clearInterval(this.intervalId);
            alert('Game Over! Your score: ' + this.score);
        }
    }
}

export { Game };
