let canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');
let drawing = false;
let panning = false;
let justPanned = false;
let panStartX, panStartY;
let offsetX = 0, offsetY = 0;
let line = [];
let color = '#000000';

// Get toolbar buttons
let drawBtn = document.getElementById('draw-btn');
let eraseBtn = document.getElementById('erase-btn');

// Set up listeners for toolbar buttons
drawBtn.addEventListener('click', function() {
    color = '#000000'; // Set color to black for drawing
});

eraseBtn.addEventListener('click', function() {
    color = '#FFFFFF'; // Set color to white for erasing
});

canvas.addEventListener('mousedown', function(e) {
  if (e.button === 2) { // Right click
      drawing = false;
      panning = true;
      panStartX = e.clientX;
      panStartY = e.clientY;
  } else { // Left click
      drawing = true;
      ctx.beginPath();  // Start a new path
      justPanned = false;
      let x = e.clientX - canvas.offsetLeft;
      let y = e.clientY - canvas.offsetTop;
      line.push({x: x - offsetX, y: y - offsetY, color: color, move: true});
  }
});



canvas.addEventListener('mousemove', function(e) {
    if (drawing) {
        draw(e);
    } else if (panning) {
        offsetX += e.clientX - panStartX;
        offsetY += e.clientY - panStartY;
        panStartX = e.clientX;
        panStartY = e.clientY;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawAll();
    }
});

canvas.addEventListener('mouseup', function(e) {
  if (e.button === 2) { // Right click
      panning = false;
      justPanned = true;
  } else { // Left click
      drawing = false;
      ctx.beginPath();  // End the path
  }
});


canvas.addEventListener('contextmenu', function(e) {
    e.preventDefault();
});

// Adjust canvas size when window size changes
window.addEventListener('resize', function() {
    resizeCanvas();
});

function draw(e) {
  if (!drawing) return;
  let x = e.clientX - canvas.offsetLeft;
  let y = e.clientY - canvas.offsetTop;
  ctx.lineWidth = 5;
  ctx.lineCap = 'round';
  ctx.strokeStyle = color;
  ctx.lineTo(x, y);
  ctx.stroke();
  // removed ctx.beginPath();
  ctx.moveTo(x, y);
  line.push({x: x - offsetX, y: y - offsetY, color: color});
}



function drawAll() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < line.length; i++) {
        let point = line[i];
        ctx.lineWidth = 5;
        ctx.lineCap = 'round';
        ctx.strokeStyle = point.color;
        if (point.move) {
            ctx.beginPath();
            ctx.moveTo(point.x + offsetX, point.y + offsetY);
        } else {
            ctx.lineTo(point.x + offsetX, point.y + offsetY);
            ctx.stroke();
        }
    }
}

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight - 30; // Subtract the height of the toolbar
}

resizeCanvas();
