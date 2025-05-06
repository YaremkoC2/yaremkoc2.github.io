// Set up the grid
const grid = document.getElementById('tetris-grid');
for (let i = 0; i < 200; i++) {
  const cell = document.createElement('div');
  cell.classList.add('cell');
  grid.appendChild(cell);
}
const cells = Array.from(grid.children);
