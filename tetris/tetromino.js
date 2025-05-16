//Base Tetromino class
class Tetromino 
{
    constructor(rotations, color, cells) 
    {
        this.rotations = rotations;
        this.index = 0;
        this.color = color;
        this.position = 4;
        this.cells = cells;
    }

    // Draw the tetromino on the grid
    draw() 
    {
        this.rotations[this.index].forEach(i => {
            this.cells[this.position + i].style.backgroundColor = this.color;
        });
    }

    // Erase the tetromino from the grid
    erase() 
    {
        this.rotations[this.index].forEach(i => {
            this.cells[this.position + i].style.backgroundColor = '';
        });
    }

    // Move the tetromino down
    moveDown() 
    {
        // Check for collision with the bottom or other pieces
        const willCollide = this.rotations[this.index].some(i => {
            const newPos = this.position + i + 10;
            return newPos >= 200 || this.cells[newPos].classList.contains('taken');
        });

        // If it will collide, lock the tetromino in place
        if (willCollide) 
        {
            this.lock();
            return false; 
        } 
        // Otherwise, move it down
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
        // Check for collision with the left wall or other pieces
        const canMove = this.rotations[this.index].every(i => {
            const newPos = this.position + i - 1;
            const col = (this.position + i) % 10;

            return (
                col !== 0 &&                      // not at left wall
                newPos >= 0 &&                    // not out of bounds
                !this.cells[newPos].classList.contains('taken') && // no collision
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
        // Check for collision with the right wall or other pieces
        const canMove = this.rotations[this.index].every(i => {
            const newPos = this.position + i + 1;
            const col = (this.position + i) % 10;

            return (
                col !== 9 &&                      // not at right wall
                newPos < 200 &&                   // not out of bounds
                !this.cells[newPos].classList.contains('taken') && // no collision
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

            if (newPos < 0 || newPos >= 200 || this.cells[newPos].classList.contains('taken')) 
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
            const cell = this.cells[this.position + i];
            cell.classList.add('taken');
            cell.style.backgroundColor = this.color;
        });
    }
}

// Specific Tetrominos
class IShape extends Tetromino
{
    constructor(cells) 
    {
        const rotations = [
            [10, 11, 12, 13], 
            [2,  12, 22, 32],   
            [20, 21, 22, 23], 
            [1,  11, 21, 31]    
        ];
        super(rotations, 'cyan', cells);
    }
}

class JShape extends Tetromino
{
    constructor(cells)
    {
        const rotations = [
            [0,  10, 11, 12], 
            [1,  2,  11, 21],   
            [10, 11, 12, 22], 
            [1,  11, 21, 20]    
        ];
        super(rotations, 'blue', cells);
    }
}

class LShape extends Tetromino
{
    constructor(cells)
    {
        const rotations = [
            [2,  10, 11, 12], 
            [1,  11, 21, 22],   
            [10, 11, 12, 20], 
            [0,  1,  11, 21]    
        ];
        super(rotations, 'orange', cells);
    }
}

class OShape extends Tetromino
{
    constructor(cells)
    {
        const rotations = [
            [0, 1, 10, 11]  
        ];
        super(rotations, 'yellow', cells);
    }

    // OShape does not need to rotate
    rotate()
    {
        return;
    }
}

class SShape extends Tetromino
{
    constructor(cells)
    {
        const rotations = [
            [1,  2,  10, 11], 
            [1,  11, 12, 22],   
            [11, 12, 20, 21], 
            [0,  10, 11, 21]    
        ];
        super(rotations, 'green', cells );
    }
}

class TShape extends Tetromino 
{
    constructor(cells) 
    {
        const rotations = [
            [1,  10, 11, 12], 
            [1,  11, 12, 21],   
            [10, 11, 12, 21], 
            [1,  10, 11, 21]    
        ];
        super(rotations, 'purple', cells);
    }
}
  
class ZShape extends Tetromino 
{
    constructor(cells) 
    {
        const rotations = [
            [0,  1,  11, 12], 
            [2,  11, 12, 21],   
            [10, 11, 21, 22], 
            [1,  11, 10, 20]    
        ];
        super(rotations, 'red', cells);
    }
}

// export everything
export {
  Tetromino,
  IShape,
  JShape,
  LShape,
  OShape,
  SShape,
  TShape,
  ZShape
};
