// classic random function for arrays
Array.prototype.random = function () 
{
    return this[Math.floor((Math.random()*this.length))];
}

// Set up the grid
const grid = document.getElementById('tetris-grid');
for (let i = 0; i < 200; i++) 
{
  const cell = document.createElement('div');
  cell.classList.add('cell');
  grid.appendChild(cell);
}
const cells = Array.from(grid.children);

//Base Tetromino class
class Tetromino 
{
    constructor(rotations, color) 
    {
        this.rotations = rotations;
        this.index = 0;
        this.color = color;
        this.position = 4;
    }

    // Draw the tetromino on the grid
    draw() 
    {
        this.rotations[this.index].forEach(i => {
            cells[this.position + i].style.backgroundColor = this.color;
        });
    }

    // Erase the tetromino from the grid
    erase() 
    {
        this.rotations[this.index].forEach(i => {
            cells[this.position + i].style.backgroundColor = '';
        });
    }

    // Move the tetromino down
    moveDown() 
    {
        const willCollide = this.rotations[this.index].some(i => {
            const newPos = this.position + i + 10;
            return newPos >= 200 || cells[newPos].classList.contains('taken');
        });

        if (willCollide) 
        {
            this.lock();
            return false; 
        } 
        else
        {
            this.erase();
            this.position += 10;
            this.draw();
            return true;
        }
    }


    // Move the tetromino left
    moveLeft() 
    {
        const canMove = this.rotations[this.index].every(i => {
            const newPos = this.position + i - 1;
            const col = (this.position + i) % 10;
            const newCol = newPos % 10;

            return (
                col !== 0 &&                      // not at left wall
                newPos >= 0 &&                    // not out of bounds
                !cells[newPos].classList.contains('taken') && // no collision
                Math.floor((this.position + i) / 10) === Math.floor(newPos / 10) // same row
            );
        });

        if (!canMove) return;

        this.erase();
        this.position -= 1;
        this.draw();
    }


    // Move the tetromino right
    moveRight() 
    {
        const canMove = this.rotations[this.index].every(i => {
            const newPos = this.position + i + 1;
            const col = (this.position + i) % 10;
            const newCol = newPos % 10;

            return (
                col !== 9 &&                      // not at right wall
                newPos < 200 &&                   // not out of bounds
                !cells[newPos].classList.contains('taken') && // no collision
                Math.floor((this.position + i) / 10) === Math.floor(newPos / 10) // same row
            );
        });

        if (!canMove) return;

        this.erase();
        this.position += 1;
        this.draw();
    }


    // Rotate the tetromino
    rotate() 
    {
        this.erase();

        const prevIndex = this.index;
        this.index = (this.index + 1) % this.rotations.length;

        // special case for IShape on the left wall and in rotation 1
        if (this.color === 'cyan' && this.position % 10 === 8 && prevIndex === 1)
        {
            const IKicks = [0, 1, 2, 3, 4];
            for (let kick of IKicks) 
            {
                if (this.isValidPosition(kick)) 
                {
                    this.position += kick;
                    this.draw();
                    return;
                }
            }
        }

        // Attempt to kick out from the wall
        const kicks = [0, -1, 1, -2, 2];
        for (let kick of kicks) 
        {
            if (this.isValidPosition(kick)) 
            {
                this.position += kick;
                this.draw();
                return;
            }
        }

        // If none work, revert rotation
        this.index = prevIndex;
        this.draw();
    }

    // Check if the tetromino is in a valid position
    isValidPosition(offset = 0) 
    {
        return this.rotations[this.index].every(i => {
            const newPos = this.position + offset + i;

            if (newPos < 0 || newPos >= 200 || cells[newPos].classList.contains('taken')) 
            {
                return false;
            }

            const baseCol = (this.position + offset) % 10;
            const blockCol = newPos % 10;

            // Prevent wrapping
            return Math.abs(blockCol - baseCol) <= 4;
        });
    }

    // Lock the tetromino in place
    lock() 
    {
        this.rotations[this.index].forEach(i => {
            const cell = cells[this.position + i];
            cell.classList.add('taken');
            cell.style.backgroundColor = this.color;
        });
    }
}

// Specific Tetrominos
class IShape extends Tetromino
{
    constructor() 
    {
        const rotations = [
            [10, 11, 12, 13], 
            [2,  12, 22, 32],   
            [20, 21, 22, 23], 
            [1,  11, 21, 31]    
        ];
        super(rotations, 'cyan');
    }
}

class JShape extends Tetromino
{
    constructor()
    {
        const rotations = [
            [0,  10, 11, 12], 
            [1,  2,  11, 21],   
            [10, 11, 12, 22], 
            [1,  11, 21, 20]    
        ];
        super(rotations, 'blue');
    }
}

class LShape extends Tetromino
{
    constructor()
    {
        const rotations = [
            [2,  10, 11, 12], 
            [1,  11, 21, 22],   
            [10, 11, 12, 20], 
            [0,  1,  11, 21]    
        ];
        super(rotations, 'orange');
    }
}

class OShape extends Tetromino
{
    constructor()
    {
        const rotations = [
            [0, 1, 10, 11]  
        ];
        super(rotations, 'yellow');
    }

    rotate()
    {
        return;
    }
}

class SShape extends Tetromino
{
    constructor()
    {
        const rotations = [
            [1,  2,  10, 11], 
            [1,  11, 12, 22],   
            [11, 12, 20, 21], 
            [0,  10, 11, 21]    
        ];
        super(rotations, 'green');
    }
}

class TShape extends Tetromino 
{
    constructor() 
    {
        const rotations = [
            [1,  10, 11, 12], 
            [1,  11, 12, 21],   
            [10, 11, 12, 21], 
            [1,  10, 11, 21]    
        ];
        super(rotations, 'purple');
    }
}
  
class ZShape extends Tetromino 
{
    constructor() 
    {
        const rotations = [
            [0,  1,  11, 12], 
            [2,  11, 12, 21],   
            [10, 11, 21, 22], 
            [1,  11, 10, 20]    
        ];
        super(rotations, 'red');
    }
}

// array to pick random pieces from 
const pieces = [IShape, JShape, LShape, OShape, SShape, TShape, ZShape];

// Game class
class Game 
{
    constructor() 
    {
        this.currentPiece = new (pieces.random())();
        this.currentPiece.draw();
    }
    
    // Game tick
    tick() 
    {
        const moved = this.currentPiece.moveDown();
        if (!moved) 
        {
            this.clearLines();

            this.currentPiece = new (pieces.random())();
            this.currentPiece.draw();
        }
    }

    // Check for completed lines
    clearLines() 
    {
        for (let row = 0; row < 20; row++) 
        {
            const start = row * 10;
            const line = cells.slice(start, start + 10);

            if (line.every(cell => cell.classList.contains('taken'))) 
            {
                // Clear the line
                line.forEach(cell => {
                    cell.classList.remove('taken');
                    cell.style.backgroundColor = '';
                });

                // Remove cleared cells from the DOM and array
                const cleared = cells.splice(start, 10);

                // Create 10 new empty cells at the top
                const newCells = Array(10).fill(null).map(() => {
                    const cell = document.createElement('div');
                    cell.classList.add('cell');
                    return cell;
                });

                // Insert new cells at the beginning
                cells.unshift(...newCells);

                // Rebuild the grid DOM
                grid.innerHTML = ''; // Clear grid
                cells.forEach(cell => grid.appendChild(cell)); // Re-render
            }
        }
    }
}
  
// Initialize
const game = new Game();
setInterval(() => game.tick(), 1000);

document.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft') game.currentPiece.moveLeft();
    if (e.key === 'ArrowRight') game.currentPiece.moveRight();
    if (e.key === 'ArrowDown') 
    {
        const moved = game.currentPiece.moveDown();
        if (!moved) 
        {
            game.currentPiece = new (pieces.random())();
            game.currentPiece.draw();
        }
    }
    if (e.key === 'ArrowUp') game.currentPiece.rotate();
});
