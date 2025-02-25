const grid = document.getElementById("grid");
const gridSize = document.getElementById("gridSize");
const sizeValue = document.getElementById("sizeValue");
const colorPicker = document.getElementById("colorPicker");
const eraseBtn = document.getElementById("erase");
const restartBtn = document.getElementById("restart");
let eraseMode = false;
let isDrawing = false;

function createGrid(size) {
    grid.innerHTML = " ";
    grid.style.gridTemplateColumns = `repeat(${size}, 25px)`;
    grid.style.gridTemplateRows = `repeat(${size}, 25px)`;
    
    for (let i = 0; i < size * size; i++) {
        const cell = document.createElement("div");
        cell.classList.add("cell");
        cell.style.width = "20px";
        cell.style.height = "20px";
        
        // Paint functionality
        cell.addEventListener("mousedown", (e) => {
            isDrawing = true;
            e.target.style.backgroundColor = eraseMode ? "white" : colorPicker.value;
        });
        
        cell.addEventListener("mouseover", (e) => {
            if (isDrawing) {
                e.target.style.backgroundColor = eraseMode ? "white" : colorPicker.value;
                e.target.classList.add("painted");
                setTimeout(() => e.target.classList.remove("painted"), 200);
            }
        });
        
        cell.addEventListener("mouseup", () => isDrawing = false);
        grid.appendChild(cell);
    }
}

document.addEventListener("mouseup", () => isDrawing = false);

gridSize.addEventListener("input", () => {
    sizeValue.textContent = gridSize.value;
    createGrid(gridSize.value);
});

eraseBtn.addEventListener("click", () => {
    eraseMode = !eraseMode;
    eraseBtn.textContent = `Erase: ${eraseMode ? "On" : "Off"}`;
    eraseBtn.dataset.active = eraseMode;
});

restartBtn.addEventListener("click", () => {
    createGrid(gridSize.value);
    eraseMode = false;
    eraseBtn.textContent = "Erase: Off";
    eraseBtn.dataset.active = false;
    setTimeout(() => {
        restartBtn.classList.add('restart-animation');
        setTimeout(() => restartBtn.classList.remove('restart-animation'), 500);
    }, 100);
});

createGrid(gridSize.value);