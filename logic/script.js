// import logic gates
import { And, Or, Xor, NAnd, NOr, XNor } from './gates.js';

// get the toggle tab and control wrapper
const toggleTab = document.getElementById('toggleTab');
const controlWrapper = document.getElementById('controlWrapper');
let controlsVisible = true;

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