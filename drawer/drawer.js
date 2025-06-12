// import linked list and lines from their respective modules
import { LinkedList, LinkedListNode } from './linkedlist.js';
import { LineSeg, Point } from './lines.js';

// Get the canvas and context
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
ctx.lineCap = 'round';
ctx.lineJoin = 'round';
let currentPath = new Path2D();

//initialize the drawing settings
const lineStack = loadLines();
let llSegs;
let drawing = false;
let mousePos = new Point(0, 0);
let thickness = document.getElementById('thickness');
let alpha = document.getElementById('alpha');
let color = document.getElementById('colorPicker');
let lineCount = document.getElementById('segmentCount');
const toggleTab = document.getElementById('toggleTab');
const controlWrapper = document.getElementById('controlWrapper');
let controlsVisible = true;

// Keep the canvas size responsive
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    Render();
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
    controlWrapper.style.transform = 'translateX(-93%)';
    toggleTab.textContent = '↑';
  }
});

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
        saveLines();
    }
});

// Event handler for mouse move
canvas.addEventListener('mousemove', (e) => {
    let pos = new Point(e.offsetX, e.offsetY);

    if (drawing) {
        if (Math.hypot(pos.x - mousePos.x, pos.y - mousePos.y) < 2) return;

        let alphaValue = parseInt(alpha.value) / 255.0;
        let lineSeg = new LineSeg(mousePos, pos, parseInt(thickness.value), alphaValue, color.value);
        llSegs.addLast(lineSeg);

        Render();
        mousePos = pos;
    }
});

// Touch start
canvas.addEventListener('touchstart', (e) => {
    e.preventDefault(); // Prevent scrolling

    const touch = e.touches[0];
    const rect = canvas.getBoundingClientRect();
    const pos = new Point(touch.clientX - rect.left, touch.clientY - rect.top);

    if (!drawing) {
        drawing = true;
        mousePos = pos;
        llSegs = new LinkedList();
        currentPath = new Path2D();
        currentPath.moveTo(pos.x, pos.y);
        lineStack.push(llSegs);
    }
}, { passive: false });

// Touch end
canvas.addEventListener('touchend', (e) => {
    e.preventDefault();
    drawing = false;
    saveLines();
}, { passive: false });

// Touch move
canvas.addEventListener('touchmove', (e) => {
    e.preventDefault();

    if (!drawing) return;

    const touch = e.touches[0];
    const rect = canvas.getBoundingClientRect();
    const pos = new Point(touch.clientX - rect.left, touch.clientY - rect.top);

    if (Math.hypot(pos.x - mousePos.x, pos.y - mousePos.y) < 2) return;

    const alphaValue = parseInt(alpha.value) / 255.0;
    const lineSeg = new LineSeg(mousePos, pos, parseInt(thickness.value), alphaValue, color.value);
    llSegs.addLast(lineSeg);

    Render();
    mousePos = pos;
}, { passive: false });

//assign the buttons to their respective functions
document.getElementById('reduce').addEventListener('click', () => reduceComplexity(llSegs));
document.getElementById('undoLine').addEventListener('click', () => undoLine());
document.getElementById('undoSeg').addEventListener('click', () => undoSeg());
document.getElementById('clear').addEventListener('click', () => { clearCanvas(); });

// function to reduce complexity of the linked list
function reduceComplexity(linkedList) {
    if (linkedList.Count > 2) {
        let scan = linkedList.First;

        while (scan !== null && scan.next !== null) {
            if (scan.next === null) break;

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
        saveLines();
    }
}

// Function to undo the last drawn line
function undoLine() {
    if (lineStack.length > 0) {
        lineStack.pop();
        llSegs = lineStack.at(-1) || new LinkedList();
        Render();
        saveLines();
    }
}

// function remove the last segment from the current linked list
function undoSeg(){
    if (lineStack.at(-1).Count > 0) {
        
        lineStack.at(-1).removeLast();

        if (llSegs.Count === 1) {
            lineStack.pop();
            llSegs = lineStack.at(-1) || new LinkedList();
        }

        Render();
        saveLines();
    }
}

// function to clear the canvas
function clearCanvas() {
    lineStack.length = 0; // Clear the stack
    llSegs = new LinkedList(); // Reset current linked list
    Render(); // Redraw the canvas
    saveLines(); // Save the cleared state
}

// Function to render the entire canvas
function Render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    lineStack.forEach(ll => {
        if (ll.Count === 0) return;

        ctx.beginPath();

        // Collect points from linked list segments
        const points = [];
        let scan = ll.First;
        while (scan !== null) {
            points.push(scan.value.startPoint);
            scan = scan.next;
        }
        // Add the last segment’s endPoint
        if (ll.Last) {
            points.push(ll.Last.value.endPoint);
        }

        if (points.length < 2) return;

        // Start path at first point
        ctx.moveTo(points[0].x, points[0].y);

        // Use quadratic Bezier curve to smooth the path
        for (let i = 1; i < points.length - 1; i++) {
            const xc = (points[i].x + points[i + 1].x) / 2;
            const yc = (points[i].y + points[i + 1].y) / 2;
            ctx.quadraticCurveTo(points[i].x, points[i].y, xc, yc);
        }
        // Curve to the last point
        ctx.lineTo(points[points.length - 1].x, points[points.length - 1].y);

        // Style using the first segment’s style as example (adjust if needed)
        const firstSeg = ll.First.value;
        ctx.lineWidth = firstSeg.thickness;
        ctx.strokeStyle = firstSeg.color;
        ctx.globalAlpha = firstSeg.alpha;

        ctx.stroke();
    });

    ctx.globalAlpha = 1.0;
    CountLines();
}

// fucntion to count the number of segments and lines
function CountLines() {
    let totalSegments = 0;
    let totalLines = 0;

    lineStack.forEach(ll => {
        totalSegments += ll.Count;
        if (ll.Count > 0) {
            totalLines++;
        }
    });

    lineCount.textContent = `Segments: ${totalSegments}, Lines: ${totalLines}`;
}

// function to save the lines to local storage
function saveLines() {
    const serializableStack = lineStack.map(linkedList => {
        const segments = [];
        let current = linkedList.First;
        while (current !== null) {
            const seg = current.value;
            segments.push({
                start: seg.startPoint,
                end: seg.endPoint,
                thickness: seg.thickness,
                alpha: seg.alpha,
                color: seg.color
            });
            current = current.next;
        }
        return segments;
    });

    localStorage.setItem('drawnLines', JSON.stringify(serializableStack));
}

// function to load the lines from local storage
function loadLines() {
    const data = localStorage.getItem('drawnLines');
    if (!data) return [];

    const parsed = JSON.parse(data);
    return parsed.map(segList => {
        const ll = new LinkedList();
        segList.forEach(seg => {
            ll.addLast(new LineSeg(
                new Point(seg.start.x, seg.start.y),
                new Point(seg.end.x, seg.end.y),
                seg.thickness,
                seg.alpha,
                seg.color
            ));
        });
        return ll;
    });
}
