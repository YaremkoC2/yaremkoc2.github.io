const canvas = document.getElementById('draw');
const ctx = canvas.getContext('2d');
let drawing = false;

// Set drawing settings
ctx.lineWidth = 2;
ctx.lineCap = 'round';
ctx.strokeStyle = '#000';

// Mouse event handlers
canvas.addEventListener('mousedown', (e) => {
    drawing = true;
    ctx.beginPath();
    ctx.moveTo(e.offsetX, e.offsetY);
});

canvas.addEventListener('mousemove', (e) => {
    if (!drawing) return;
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.stroke();
});

canvas.addEventListener('mouseup', () => drawing = false);
canvas.addEventListener('mouseleave', () => drawing = false);

// Touch event support
canvas.addEventListener('touchstart', (e) => {
    const touch = e.touches[0];
    const rect = canvas.getBoundingClientRect();
    ctx.beginPath();
    ctx.moveTo(touch.clientX - rect.left, touch.clientY - rect.top);
    drawing = true;
});

canvas.addEventListener('touchmove', (e) => {
    if (!drawing) return;
    e.preventDefault(); // Prevent scrolling
    const touch = e.touches[0];
    const rect = canvas.getBoundingClientRect();
    ctx.lineTo(touch.clientX - rect.left, touch.clientY - rect.top);
    ctx.stroke();
});

canvas.addEventListener('touchend', () => drawing = false);
