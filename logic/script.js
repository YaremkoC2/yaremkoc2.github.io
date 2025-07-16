// import logic gates
import { And, Or, Xor, NAnd, NOr, XNor } from './gates.js';

// Get the canvas and context
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// initialize components
const toggleTab = document.getElementById('toggleTab');
const controlWrapper = document.getElementById('controlWrapper');
const gateButtons = document.querySelectorAll('.gateButton');
let controlsVisible = true;
let selectedGate = null;
let offsetX = 0;
let offsetY = 0;
let gates = [];

// Keep the canvas size responsive
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// event handler for the toggle tab
toggleTab.addEventListener('click', () => {
  controlsVisible = !controlsVisible;

  if (controlsVisible) {
    controlWrapper.style.transform = 'translateX(0)';
    toggleTab.textContent = '↓';
  } else {
    controlWrapper.style.transform = 'translateX(-88%)';
    toggleTab.textContent = '↑';
  }
});

// Add event listeners to gate buttons
gateButtons.forEach(button => {
    button.addEventListener('click', () => {
        const type = button.dataset.type;
        let gate;

        switch (type) {
            case 'AND': gate = new And(); break;
            case 'OR': gate = new Or(); break;
            case 'XOR': gate = new Xor(); break;
            case 'NAND': gate = new NAnd(); break;
            case 'NOR': gate = new NOr(); break;
            case 'XNOR': gate = new XNor(); break;
            case 'INPUT': gate = new InputNode(); break;
            case 'OUTPUT': gate = new OutputNode(); break;
        }

        if (gate) {
            gate.setPosition(200, 100); // Spawn at default position
            gates.push(gate);
            drawAll();
        }
    });
});

canvas.addEventListener('mousedown', (e) => {
    const x = e.clientX;
    const y = e.clientY;

    // Check if user clicked a gate
    for (let i = gates.length - 1; i >= 0; i--) {
        if (gates[i].isInside(x, y)) {
            selectedGate = gates[i];
            offsetX = x - selectedGate.x;
            offsetY = y - selectedGate.y;
            break;
        }
    }
});

canvas.addEventListener('mousemove', (e) => {
    if (selectedGate) {
        selectedGate.setPosition(e.clientX - offsetX, e.clientY - offsetY);
        drawAll();
    }
});

canvas.addEventListener('mouseup', () => {
    selectedGate = null;
});

canvas.addEventListener('mouseleave', () => {
    selectedGate = null;
});

// function to draw all gates
function drawAll() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    gates.forEach(g => g.draw(ctx));
}
