const grid = document.getElementById('tetris-grid');

// Create a 10×10 grid (100 cells)
for (let i = 0; i < 100; i++) {
  const cell = document.createElement('div');
  cell.classList.add('cell');
  grid.appendChild(cell);
}

// Fill random cells for demo
setInterval(() => {
  const cells = document.querySelectorAll('.cell');
  const rand = Math.floor(Math.random() * 100);
  cells[rand].classList.toggle('filled');
}, 200);
