const board = document.getElementById("board");
const statusText = document.getElementById("status");
const restartBtn = document.getElementById("restartButton");
const playCountElement = document.getElementById("playCount");
let cells = document.querySelectorAll(".cell");

let boardState = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "x";
let gameActive = true;
let playCount = localStorage.getItem('playCount') || 0;

const WIN_PATTERNS = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
];

// Initialize play count display
playCountElement.textContent = `Total Plays: ${playCount}`;

function handleClick(e) {
    const index = e.target.dataset.index;
    if (!gameActive || boardState[index] !== "") return;
    
    e.target.style.animation = 'cellPulse 0.3s ease';
    setTimeout(() => e.target.style.animation = '', 300);

    boardState[index] = currentPlayer;
    e.target.classList.add(currentPlayer);
    e.target.textContent = currentPlayer.toUpperCase();
    
    if (checkWin(currentPlayer)) {
        endGame(currentPlayer === "x" ? "You Win! 🎉" : "AI Wins! 🤖");
        highlightWinningCombination(currentPlayer);
        return;
    }

    if (boardState.every(cell => cell !== "")) {
        endGame("It's a Draw!");
        return;
    }

    currentPlayer = currentPlayer === "x" ? "o" : "x";
    statusText.textContent = currentPlayer === "x" ? "Your Turn (X)" : "AI Thinking...";

    if (currentPlayer === "o") {
        statusText.classList.add('thinking');
        setTimeout(aiMove, 1000);
    }
}

function aiMove() {
    statusText.classList.remove('thinking');
    let bestMove = minimax(boardState, "o").index;
    
    cells[bestMove].style.animation = 'cellPulse 0.5s ease';
    setTimeout(() => cells[bestMove].style.animation = '', 500);

    boardState[bestMove] = "o";
    cells[bestMove].classList.add("o");
    cells[bestMove].textContent = "O";

    if (checkWin("o")) {
        endGame("AI Wins! 🤖");
        highlightWinningCombination("o");
        return;
    }

    if (boardState.every(cell => cell !== "")) {
        endGame("It's a Draw!");
        return;
    }

    currentPlayer = "x";
    statusText.textContent = "Your Turn (X)";
}

function minimax(board, player) {
    if (checkWin("x")) return { score: -10 };
    if (checkWin("o")) return { score: 10 };
    if (!board.includes("")) return { score: 0 };

    let bestMove = { score: player === "o" ? -Infinity : Infinity };
    board.forEach((cell, i) => {
        if (cell === "") {
            board[i] = player;
            let score = minimax(board, player === "o" ? "x" : "o").score;
            board[i] = "";
            if ((player === "o" && score > bestMove.score) || (player === "x" && score < bestMove.score)) {
                bestMove = { score, index: i };
            }
        }
    });
    return bestMove;
}

function checkWin(player) {
    return WIN_PATTERNS.some(pattern => pattern.every(i => boardState[i] === player));
}

function highlightWinningCombination(player) {
    WIN_PATTERNS.forEach(pattern => {
        if (pattern.every(i => boardState[i] === player)) {
            pattern.forEach(i => {
                cells[i].classList.add('winning');
            });
        }
    });
}

function endGame(message) {
    playCount++;
    localStorage.setItem('playCount', playCount);
    playCountElement.textContent = `Total Plays: ${playCount}`;
    
    statusText.textContent = message;
    gameActive = false;
    document.getElementById("resultText").textContent = message;
    document.getElementById("resultModal").style.display = 'block';
}

function restartGame() {
    boardState = ["", "", "", "", "", "", "", "", ""];
    gameActive = true;
    currentPlayer = "x";
    statusText.textContent = "Your Turn (X)";
    cells.forEach(cell => {
        cell.classList.remove("x", "o", "winning");
        cell.textContent = "";
        cell.style.animation = "";
    });
    document.getElementById("resultModal").style.display = 'none';
}

cells.forEach(cell => cell.addEventListener("click", handleClick));
restartBtn.addEventListener("click", restartGame);