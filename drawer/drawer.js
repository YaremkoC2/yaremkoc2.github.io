// Get the canvas and context
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// Keep the canvas size responsive
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    // Optional: re-render existing lines here
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas(); // initial size
