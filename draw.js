let canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');
let drawing = false;
let panning = false;
let justPanned = false;
let panStartX, panStartY;
let offsetX = 0, offsetY = 0;
let line = [];
let color = '#000000';
let scale = 1;

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

canvas.addEventListener('wheel', function(e) {
    e.preventDefault();

    // Get mouse position
    const clientX = e.clientX - canvas.offsetLeft;
    const clientY = e.clientY - canvas.offsetTop;

    // Calculate the position in the unscaled canvas
    const x = (clientX - offsetX) / scale;
    const y = (clientY - offsetY) / scale;

    // Calculate the zoom factor
    let scaleFactor = e.deltaY < 0 ? 1.1 : 1 / 1.1;

    // Update the scale
    scale *= scaleFactor;

    // Update offset
    offsetX = clientX - x * scale;
    offsetY = clientY - y * scale;

    // Redraw everything
    drawAll();
});





canvas.addEventListener('mousedown', function(e) {
    if (e.button === 2) {
        panning = true;
    } else if (e.button === 0) {
        drawing = true;
        let mouseX = (e.clientX - canvas.offsetLeft - offsetX) / scale;
        let mouseY = (e.clientY - canvas.offsetTop - offsetY) / scale;
        line.push({
            x: mouseX,
            y: mouseY,
            color: color,
            move: true
        });
    }
});




canvas.addEventListener('mousemove', function(e) {
    if (panning) {
        offsetX += e.movementX;
        offsetY += e.movementY;
        drawAll();
    } else if (drawing) {
        let mouseX = (e.clientX - canvas.offsetLeft - offsetX) / scale;
        let mouseY = (e.clientY - canvas.offsetTop - offsetY) / scale;
        line.push({
            x: mouseX,
            y: mouseY,
            color: color,
            move: false
        });
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
    ctx.save();
    ctx.translate(offsetX, offsetY);
    ctx.scale(scale, scale);
    for (let i = 0; i < line.length; i++) {
        let point = line[i];
        ctx.lineWidth = 5;
        ctx.lineCap = 'round';
        ctx.strokeStyle = point.color;
        if (point.move) {
            ctx.beginPath();
            ctx.moveTo(point.x, point.y);
        } else {
            ctx.lineTo(point.x, point.y);
            ctx.stroke();
        }
    }
    ctx.restore();
}



function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight - 30; // Subtract the height of the toolbar
}

resizeCanvas();
