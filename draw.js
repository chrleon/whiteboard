let canvas = document.querySelector('#draw-area');
let ctx = canvas.getContext('2d');
let color = 'black';

let drawing = false;

canvas.addEventListener('mousedown', function(e) {
    drawing = true;
    draw(e);
});

canvas.addEventListener('mouseup', function() {
    drawing = false;
    ctx.beginPath();
});

canvas.addEventListener('mousemove', function(e) {
    if (!drawing) return;
    draw(e);
});

function draw(e) {
    ctx.lineWidth = 5;
    ctx.lineCap = 'round';
    ctx.strokeStyle = color;

    ctx.lineTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
}

document.getElementById('pen').addEventListener('click', function() {
    color = 'black';
});

document.getElementById('eraser').addEventListener('click', function() {
    color = 'white';
});
