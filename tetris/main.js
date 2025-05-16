// import game logic
import { Game } from './game.js';

// Set up the grid
const grid = document.getElementById('tetris-grid');
for (let i = 0; i < 200; i++) 
{
  const cell = document.createElement('div');
  cell.classList.add('cell');
  grid.appendChild(cell);
}
const cells = Array.from(grid.children);
  
// Initialize
const game = new Game(cells, grid);
game.startGameLoop();

document.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft') game.currentPiece.moveLeft();
    if (e.key === 'ArrowRight') game.currentPiece.moveRight();
    if (e.key === 'ArrowDown') game.currentPiece.moveDown();
    if (e.key === 'ArrowUp') game.currentPiece.rotate();
});
