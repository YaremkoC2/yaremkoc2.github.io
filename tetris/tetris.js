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

    draw() 
    {
        this.rotations[this.index].forEach(i => {
            cells[this.position + i].style.backgroundColor = this.color;
        });
    }

    erase() 
    {
        this.rotations[this.index].forEach(i => {
            cells[this.position + i].style.backgroundColor = '';
        });
    }

    moveDown() 
    {
        this.erase();
        this.position += 10;
        this.draw();
    }

    moveLeft() 
    {
        // Check if any cell would go off the left edge
        const wouldHitLeftEdge = this.rotations[this.index].some(i => {
            const col = (this.position + i) % 10;
            return col === 0;
        });

        if (wouldHitLeftEdge) return;

        this.erase();
        this.position -= 1;
        this.draw();
    }

    moveRight() 
    {
        // Check if any cell would go off the left edge
        const wouldHitRightEdge = this.rotations[this.index].some(i => {
            const col = (this.position + i) % 10;
            return col === 9;
        });

        if (wouldHitRightEdge) return;

        this.erase();
        this.position += 1;
        this.draw();
    }

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
  
    tick() 
    {
        this.currentPiece.moveDown();
    }
}
  
// Initialize
const game = new Game();
setInterval(() => game.tick(), 1000);

// Controls
document.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft') game.currentPiece.moveLeft();
    if (e.key === 'ArrowRight') game.currentPiece.moveRight();
    if (e.key === 'ArrowDown') game.currentPiece.moveDown();
    if (e.key === 'ArrowUp') game.currentPiece.rotate();
});