// Get canvas element and context
let canvas = document.querySelector('#draw-area');
let ctx = canvas.getContext('2d');

// Default drawing color
let color = 'black';

// State variables
let drawing = false;   // Whether we're currently drawing
let panning = false;   // Whether we're currently panning
let panStartX = 0;     // X-coordinate where the current pan started
let panStartY = 0;     // Y-coordinate where the current pan started
let offsetX = 0;       // Total X-panning offset
let offsetY = 0;       // Total Y-panning offset

// Points that have been drawn
let line = [];

// On mousedown, start drawing or panning
canvas.addEventListener('mousedown', function(e) {
    if (e.button === 2) {  // right click
        drawing = false;
        panning = true;
        panStartX = e.clientX;
        panStartY = e.clientY;
    } else {  // left click
        drawing = true;
        draw(e);
    }
});

// On mouseup, stop drawing or panning
canvas.addEventListener('mouseup', function(e) {
    if (e.button === 2) {  // right click
        panning = false;
    } else {  // left click
        drawing = false;
        ctx.beginPath();
    }
});

// On mousemove, draw or pan
canvas.addEventListener('mousemove', function(e) {
    if (panning) {
        drawing = false;
        offsetX += e.clientX - panStartX;
        offsetY += e.clientY - panStartY;
        panStartX = e.clientX;
        panStartY = e.clientY;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawAll();
    } else if (drawing) {
        draw(e);
    }
});

// Prevent the context menu from showing up on right click
canvas.addEventListener('contextmenu', function(e) {
    e.preventDefault();
});

// On pen click, switch to drawing mode
document.getElementById('pen').addEventListener('click', function() {
    color = 'black';
});

// On eraser click, switch to erasing mode
document.getElementById('eraser').addEventListener('click', function() {
    color = 'white';
});

// Draw a point at the current mouse position
function draw(e) {
    if (!drawing) return;
    let x = e.clientX - canvas.offsetLeft - offsetX;
    let y = e.clientY - canvas.offsetTop - offsetY;
    ctx.lineWidth = 5;
    ctx.lineCap = 'round';
    ctx.strokeStyle = color;
    line.push({x, y, color});
    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
}

// Redraw all points that have been drawn
function drawAll() {
    for (let point of line) {
        ctx.lineWidth = 5;
        ctx.lineCap = 'round';
        ctx.strokeStyle = point.color;
        ctx.lineTo(point.x + offsetX, point.y + offsetY);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(point.x + offsetX, point.y + offsetY);
    }
}
