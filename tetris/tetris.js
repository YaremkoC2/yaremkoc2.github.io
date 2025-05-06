// Set up the grid
const grid = document.getElementById('tetris-grid');
for (let i = 0; i < 200; i++) 
{
  const cell = document.createElement('div');
  cell.classList.add('cell');
  grid.appendChild(cell);
}
const cells = Array.from(grid.children);

// Base Tetromino class
class Tetromino 
{
    constructor(shape, color) 
    {
        this.shape = shape;
        this.color = color;
        this.position = 4;
    }

    draw() 
    {
        this.shape[0].forEach(i => {
        cells[this.position + i].style.backgroundColor = this.color;
        });
    }

    erase() 
    {
        this.shape[0].forEach(i => {
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
        this.erase();
        this.position -= 1;
        this.draw();
    }

    moveRight() 
    {
        this.erase();
        this.position += 1;
        this.draw();
    }
}

// Specific Tetrominos
class LShape extends Tetromino
{
    constructor()
    {
        super([[0, 1, 2, 3]], 'cyan');
    }
}

class JShape extends Tetromino
{
    constructor()
    {
        super([[0, 10, 11, 12]], 'blue');
    }
}

class LShape extends Tetromino
{
    constructor()
    {
        super([[2, 10, 11, 12]], 'orange');
    }
}

class OShape extends Tetromino
{
    constructor()
    {
        super([[0, 1, 10, 11]], 'yellow');
    }
}

class SShape extends Tetromino
{
    constructor()
    {
        super([[1, 2, 10, 11]], 'green');
    }
}

class TShape extends Tetromino 
{
    constructor() 
    {
      super([[1, 10, 11, 12]], 'purple');
    }
}

class ZShape extends Tetromino 
{
    constructor() 
    {
      super([[0, 1, 11, 12]], 'red');
    }
}
