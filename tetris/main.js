// import game logic
import { Game } from './game.js';

// Set up the game grid
const gameGrid = document.getElementById('tetris-grid');
for (let i = 0; i < 200; i++) 
{
  const cell = document.createElement('div');
  cell.classList.add('cell');
  gameGrid.appendChild(cell);
}

// set up next piece display
const nextGrid = document.getElementById('next-piece');
for (let i = 0; i < 16; i++) 
{
  const cell = document.createElement('div');
  cell.classList.add('cell');
  nextGrid.appendChild(cell);
}

// set up the held piece display
const heldGrid = document.getElementById('held-piece');
for (let i = 0; i < 16; i++) 
{
  const cell = document.createElement('div');
  cell.classList.add('cell');
  heldGrid.appendChild(cell);
}

// get all cells from the grids
const gameCells = Array.from(gameGrid.children);
const nextCells = Array.from(nextGrid.children);
const heldCells = Array.from(heldGrid.children);
  
// Initialize
const game = new Game(gameCells, gameGrid, nextCells, heldCells);
game.startGameLoop();

// Add event listeners for controls
document.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft') game.currentPiece.moveLeft();
    if (e.key === 'ArrowRight') game.currentPiece.moveRight();
    if (e.key === 'ArrowDown') game.currentPiece.moveDown();
    if (e.key === 'ArrowUp') game.currentPiece.rotate();
    if (e.key === ' ') game.holdPiece(); 
});
