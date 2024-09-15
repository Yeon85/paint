const canvas = document.getElementById("jsCanvas");
const ctx = canvas.getContext("2d");
const colors = document.getElementsByClassName("jsColor");
const range = document.getElementById("jsRange");
const mode = document.getElementById("jsMode");
const saveBtn = document.getElementById("jsSave");
const colorPicker = document.getElementById("jsColorPicker"); // Added color picker
const prevBtn = document.getElementById("jsPrev"); // Previous button
const nextBtn = document.getElementById("jsNext"); // Next button

const INITIAL_COLOR = "#000000";
const CANVAS_SIZE = 700;

let painting = false;
let filling = false;
let history = []; // To store canvas states
let historyIndex = -1; // To keep track of current history state

ctx.strokeStyle = INITIAL_COLOR;
ctx.fillStyle = INITIAL_COLOR;
ctx.lineWidth = 2.5; // Line width

canvas.width = CANVAS_SIZE;
canvas.height = CANVAS_SIZE;

ctx.fillStyle = "white";
ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

// Save the current state of the canvas
function saveState() {
    if (historyIndex < history.length - 1) {
        history = history.slice(0, historyIndex + 1);
    }
    history.push(canvas.toDataURL());
    historyIndex++;
}

// Restore a specific state of the canvas
function restoreState(index) {
    const img = new Image();
    img.src = history[index];
    img.onload = () => {
        ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
        ctx.drawImage(img, 0, 0);
    };
}

function stopPainting() {
    painting = false;
}

function startPainting() {
    painting = true;
}

function onMouseMove(event) {
    const x = event.offsetX;
    const y = event.offsetY;
    if (!painting) {
        ctx.beginPath();
        ctx.moveTo(x, y);
    } else {
        ctx.lineTo(x, y);
        ctx.stroke();
    }
}

function handleColorClick(event) {
    const color = event.target.style.backgroundColor;
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
}

function handleColorPickerChange(event) {
    const color = event.target.value;
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
}

function handleRangeChange(event) {
    const size = event.target.value;
    ctx.lineWidth = size;
}

function handleModeClick() {
    filling = !filling;
    mode.innerText = filling ? "Paint" : "Fill";
}

function handleCanvasClick() {
    if (filling) {
        saveState(); // Save the state before filling
        ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
    }
}

function handleSaveClick() {
    const image = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = image;
    link.download = "PaintJS[EXPORT]";
    link.click();
}

function handlePrevClick() {
    if (historyIndex > 0) {
        restoreState(--historyIndex);
    }
}

function handleNextClick() {
    if (historyIndex < history.length - 1) {
        restoreState(++historyIndex);
    }
}

// Event Listeners
if (canvas) {
    canvas.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("mousedown", startPainting);
    canvas.addEventListener("mouseup", stopPainting);
    canvas.addEventListener("mouseleave", stopPainting);
    canvas.addEventListener("click", handleCanvasClick);
}

Array.from(colors).forEach(color => color.addEventListener("click", handleColorClick));

if (range) {
    range.addEventListener("input", handleRangeChange);
}

if (mode) {
    mode.addEventListener("click", handleModeClick);
}

if (saveBtn) {
    saveBtn.addEventListener("click", handleSaveClick);
}

if (colorPicker) {
    colorPicker.addEventListener("input", handleColorPickerChange);
}

if (prevBtn) { // Ensure Previous button is included
    prevBtn.addEventListener("click", handlePrevClick);
}

if (nextBtn) { // Ensure Next button is included
    nextBtn.addEventListener("click", handleNextClick);
}