// import logic gates
import { And, Or, Xor, NAnd, NOr, XNor, InputNode, OutputNode, setLogicUpdateCallback } from './gates.js';

// Get the canvas and context
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// initialize components and variables
setLogicUpdateCallback(updateLogic);
const toggleTab = document.getElementById('toggleTab');
const controlWrapper = document.getElementById('controlWrapper');
const gateButtons = document.querySelectorAll('.gateButton');
const dragThreshold = 5;
const connections = [];
let controlsVisible = true;
let selectedGate = null;
let offsetX = 0;
let offsetY = 0;
let gates = [];
let dragStart = null;
let dragMoved = false;
let selectedOutputGate = null;

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

// Add pointer events for dragging gates
canvas.addEventListener('pointerdown', onPointerDown);
canvas.addEventListener('pointermove', onPointerMove);
canvas.addEventListener('pointerup', onPointerUp);

function onPointerDown(e) {
    const x = e.clientX;
    const y = e.clientY;

    //Output pin selection
    for (let gate of gates) {
        if (isNearOutput(gate, x, y)) {
            selectedOutputGate = gate;
            return; // Prevent dragging
        }
    }

    //Input pin selection
    for (let gate of gates) {
        if (isNearInput(gate, x, y)) {
            // Handled in pointerup — don't drag
            return;
        }
    }

    // Gate dragging
    for (let i = gates.length - 1; i >= 0; i--) {
        if (gates[i].isInside(x, y)) {
            selectedGate = gates[i];
            offsetX = x - selectedGate.x;
            offsetY = y - selectedGate.y;
            dragStart = { x, y };
            dragMoved = false;
            break;
        }
    }
}

function onPointerMove(e) {
    if (selectedGate) {
        const dx = e.clientX - dragStart.x;
        const dy = e.clientY - dragStart.y;

        if (Math.abs(dx) > dragThreshold || Math.abs(dy) > dragThreshold) {
            dragMoved = true;
        }

        selectedGate.setPosition(e.clientX - offsetX, e.clientY - offsetY);
        drawAll();
    }
}

function onPointerUp(e) {
    const x = e.clientX;
    const y = e.clientY;

    for (let gate of gates) {
        if (gate instanceof InputNode && !dragMoved && gate.isInside(x, y)) {
            gate.toggle();
            drawAll();
            selectedGate = null;
            return;
        }

        if (isNearOutput(gate, x, y)) {
            selectedOutputGate = gate;
            console.log('Selected output from', gate.constructor.name);
            return;
        }

        const inputHit = isNearInput(gate, x, y);
        if (selectedOutputGate && inputHit) {
            const { inputIndex } = inputHit;

            // Disallow setting inB on OutputNode
            if (inputIndex > 0 && gate instanceof OutputNode) {
                console.warn('OutputNode only has one input');
                return;
            }

            // Make connection
            connections.push({
                from: selectedOutputGate,
                to: gate,
                inputIndex
            });

            if (inputIndex === 0) gate.inA = selectedOutputGate;
            else gate.inB = selectedOutputGate;

            selectedOutputGate = null;
            updateLogic();
            return;
        }
    }

    selectedOutputGate = null;
    selectedGate = null;
}

// function to draw all gates and connections
function drawAll() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw wires
    connections.forEach(conn => {
        let fromX, fromY;

        if (conn.from instanceof OutputNode) {
            // Output is on the left side
            fromX = conn.from.x;
            fromY = conn.from.y + 20;
        } else {
            // Default output is right-center
            fromX = conn.from.x + 60;
            fromY = conn.from.y + 20;
        }

        let toX, toY;
        if (conn.to instanceof OutputNode) {
            toX = conn.to.x;
            toY = conn.to.y + 20;
        } else {
            toX = conn.to.x;
            toY = conn.to.y + (conn.inputIndex === 0 ? 10 : 30);
        }

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

// function to check if a point is near the output of a gate
function isNearOutput(gate, x, y) {
    const outX = gate.x + 60;
    const outY = gate.y + 20;
    return Math.hypot(outX - x, outY - y) < 8;
}

// function to check if a point is near the input of a gate
function isNearInput(gate, x, y) {
    // Special case for OutputNode
    if (gate instanceof OutputNode) {
        const input = { x: gate.x, y: gate.y + 20 };
        if (Math.hypot(input.x - x, input.y - y) < 8) {
            return { inputIndex: 0 };
        }
        return null;
    }

    // Regular 2-input gates
    const inA = { x: gate.x, y: gate.y + 10 };
    const inB = { x: gate.x, y: gate.y + 30 };

    if (Math.hypot(inA.x - x, inA.y - y) < 8) return { inputIndex: 0 };
    if (Math.hypot(inB.x - x, inB.y - y) < 8) return { inputIndex: 1 };
    return null;
}

// Function to update logic gates and redraw
function updateLogic() {
    // Topological sort would be best, but this brute-force loop is enough for now
    // Repeat N times to let signal propagate down multiple levels
    for (let i = 0; i < gates.length; i++) {
        for (let gate of gates) {
            // Skip InputNodes — they don't compute
            if (gate instanceof InputNode) continue;

            // Force re-evaluation by reading `output`
            // (If you cache output in a variable, update that here)
            gate.output; // triggers getOutput()
        }
    }

    drawAll();
}

