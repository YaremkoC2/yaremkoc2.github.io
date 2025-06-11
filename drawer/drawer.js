// import linked list and lines from their respective modules
import { LinkedList, LinkedListNode } from './linkedlist.js';
import { LineSeg, Point } from './lines.js';

// Get the canvas and context
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
ctx.lineCap = 'round'; // Set line cap style for smooth ends

//initialize the drawing settings
const lineStack = [];
let llSegs;
let drawing = false;
let mousePos = new Point(0, 0);
let thickness = document.getElementById('thickness');
let alpha = document.getElementById('alpha');
let color = document.getElementById('colorPicker');

// Keep the canvas size responsive
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// Event handler for mouse down
canvas.addEventListener('mousedown', (e) => {
    let pos = new Point(e.offsetX, e.offsetY);

    if (!drawing){
        drawing = true;
        mousePos = pos;
        llSegs = new LinkedList();
        lineStack.push(llSegs);
    }
});

// Event handler for mouse up
canvas.addEventListener('mouseup', (e) => {
    let pos = new Point(e.offsetX, e.offsetY);
    
    if (drawing) {
        drawing = false;
        mousePos = pos;
    }
});

// Event handler for mouse move
canvas.addEventListener('mousemove', (e) => {
    let pos = new Point(e.offsetX, e.offsetY);

    if (drawing) {
        let alphaValue = parseInt(alpha.value) / 255.0;
        let lineSeg = new LineSeg(mousePos, pos, parseInt(thickness.value), alphaValue, color.value);
        llSegs.addLast(lineSeg);

        // Draw the line segment
        ctx.beginPath();
        ctx.lineWidth = lineSeg.thickness;
        ctx.strokeStyle = lineSeg.color;
        ctx.globalAlpha = lineSeg.alpha;
        ctx.moveTo(lineSeg.startPoint.x, lineSeg.startPoint.y);
        ctx.lineTo(lineSeg.endPoint.x, lineSeg.endPoint.y);
        ctx.stroke();
        ctx.globalAlpha = 1.0;

        mousePos = pos;
    }
});
