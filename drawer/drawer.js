// import linked list and lines from their respective modules
import { LinkedList, LinkedListNode } from './linkedlist.js';
import { LineSeg, Point } from './lines.js';

// Get the canvas and context
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
ctx.lineCap = 'round';
let currentPath = new Path2D();

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
        currentPath = new Path2D();
        currentPath.moveTo(pos.x, pos.y);
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
        // Optional: Add a distance check to reduce over-segmentation
        if (Math.hypot(pos.x - mousePos.x, pos.y - mousePos.y) < 2) return;

        let alphaValue = parseInt(alpha.value) / 255.0;
        let lineSeg = new LineSeg(mousePos, pos, parseInt(thickness.value), alphaValue, color.value);
        llSegs.addLast(lineSeg);

        // Add to path
        currentPath.lineTo(pos.x, pos.y);

        // Redraw everything
        //ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.lineWidth = lineSeg.thickness;
        ctx.strokeStyle = lineSeg.color;
        ctx.globalAlpha = lineSeg.alpha;
        ctx.stroke(currentPath);
        ctx.globalAlpha = 1.0;

        mousePos = pos;
    }
});

//assign the reduce complexity function to a button
document.getElementById('reduce').addEventListener('click', () => reduceComplexity(llSegs));

// function to reduce complexity of the linked list
function reduceComplexity(linkedList) {
    if (linkedList.Count > 1) {
        let scan = linkedList.First;

        while (scan !== null && scan.next !== null) {
            const first = scan.value;
            const second = scan.next.value;

            // Merge segments
            const consolidatedSeg = new LineSeg(
                first.startPoint,
                second.endPoint,
                first.thickness,
                first.alpha,
                first.color
            );

            scan.value = consolidatedSeg;

            // Remove the next node, which we merged into scan
            linkedList.remove(scan.next);

            // Move to next node (which is now scan.next)
            scan = scan.next;
        }

        Render();
    }
}

// Function to render the entire canvas
function Render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    lineStack.forEach(ll => {
        let scan = ll.First;
        ctx.beginPath();

        while (scan !== null) {
            const seg = scan.value;
            ctx.lineWidth = seg.thickness;
            ctx.strokeStyle = seg.color;
            ctx.globalAlpha = seg.alpha;

            ctx.moveTo(seg.startPoint.x, seg.startPoint.y);
            ctx.lineTo(seg.endPoint.x, seg.endPoint.y);
            scan = scan.next;
        }

        ctx.stroke();
    });

    ctx.globalAlpha = 1.0;
}
