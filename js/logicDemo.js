import { Xor, InputNode, OutputNode, setLogicUpdateCallback } from '../logic/gates.js';

const canvas = document.getElementById('logic');
const ctx = canvas.getContext('2d');

canvas.width = 300;
canvas.height = 200;

setLogicUpdateCallback(updateLogic);

let gates = [];
let connections = [];

// Create static gates
const inputA = new InputNode();
inputA.setPosition(10, 25);

const inputB = new InputNode();
inputB.setPosition(10, 125);

const xorGate = new Xor();
xorGate.setPosition(125, 75);

const output = new OutputNode();
output.setPosition(225, 75);

// Wire up the gates
xorGate.inA = inputA;
xorGate.inB = inputB;
output.inA = xorGate;

// Track connections (for drawing wires)
connections.push(
  { from: inputA, to: xorGate, inputIndex: 0 },
  { from: inputB, to: xorGate, inputIndex: 1 },
  { from: xorGate, to: output, inputIndex: 0 }
);

// Add to gate array for rendering
gates.push(inputA, inputB, xorGate, output);

// Update logic and draw
updateLogic();

// Event listener to toggle input nodes
canvas.addEventListener('pointerup', (e) => {
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  for (let gate of gates) {
    if (gate instanceof InputNode && gate.isInside(x, y)) {
      gate.toggle();
      updateLogic();
      return;
    }
  }
});

// Redraw everything
function drawAll() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw wires
  connections.forEach(conn => {
    let fromX = conn.from instanceof OutputNode ? conn.from.x : conn.from.x + 60;
    let fromY = conn.from.y + 20;

    let toX = conn.to.x;
    let toY = conn.to instanceof OutputNode
      ? conn.to.y + 20
      : conn.inputIndex === 0 ? conn.to.y + 10 : conn.to.y + 30;

    ctx.beginPath();
    ctx.moveTo(fromX, fromY);
    ctx.lineTo(toX, toY);
    ctx.strokeStyle = conn.from.output ? 'darkgreen' : 'darkred';
    ctx.stroke();
  });

  // Draw gates
  ctx.strokeStyle = 'black';
  gates.forEach(g => g.draw(ctx));
}

// Run logic and draw
function updateLogic() {
  for (let i = 0; i < 3; i++) {
    for (let gate of gates) {
      if (gate instanceof InputNode) continue;
      gate.output;
    }
  }
  drawAll();
}