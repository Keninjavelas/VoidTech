// === GRAFFITI CANVAS SETUP ===
const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
let isGraffitiActive = false;
let isDrawing = false;
let lastX = 0;
let lastY = 0;

// Setup the canvas size and styles
function setupGraffiti() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  canvas.style.position = 'fixed';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.pointerEvents = 'none';
  canvas.style.zIndex = '50';
  canvas.style.display = 'block';
  document.body.appendChild(canvas);
}

// === ENABLE GRAFFITI ===
function enableGraffiti() {
  isGraffitiActive = true;
  canvas.style.pointerEvents = 'auto';
  console.log("Graffiti enabled");
}

// === DISABLE GRAFFITI ===
function disableGraffiti() {
  isGraffitiActive = false;
  isDrawing = false;
  canvas.style.pointerEvents = 'none';
  console.log("Graffiti disabled");
}

// === CLEAR CANVAS ===
function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  console.log("Canvas cleared");
}

// === DRAWING LOGIC ===
canvas.addEventListener('mousedown', (e) => {
  if (!isGraffitiActive) return;
  isDrawing = true;
  [lastX, lastY] = [e.clientX, e.clientY];
  ctx.beginPath();
  ctx.moveTo(lastX, lastY);
});

canvas.addEventListener('mousemove', (e) => {
  if (!isDrawing || !isGraffitiActive) return;
  ctx.lineTo(e.clientX, e.clientY);
  ctx.strokeStyle = `hsl(${Math.random() * 360}, 100%, 50%)`;
  ctx.lineWidth = 3;
  ctx.lineCap = 'round';
  ctx.stroke();
  [lastX, lastY] = [e.clientX, e.clientY];
});

['mouseup', 'mouseout'].forEach(event => {
  canvas.addEventListener(event, () => {
    isDrawing = false;
  });
});

// === ESCAPE KEY TO DISABLE ===
window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    disableGraffiti();
  }
});

// === REGISTER BUTTONS ONLY AFTER DOM IS READY ===
document.addEventListener('DOMContentLoaded', () => {
  setupGraffiti();

  const enableBtn = document.getElementById('enable-graffiti');
  const disableBtn = document.getElementById('disable-graffiti');
  const clearBtn = document.getElementById('clear-graffiti');
  const saveBtn = document.getElementById('save-graffiti');

  if (enableBtn) enableBtn.addEventListener('click', enableGraffiti);
  if (disableBtn) disableBtn.addEventListener('click', disableGraffiti);
  if (clearBtn) clearBtn.addEventListener('click', clearCanvas);
  if (saveBtn) {
    saveBtn.addEventListener('click', () => {
      const link = document.createElement('a');
      link.download = 'graffiti.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    });
  }
});
