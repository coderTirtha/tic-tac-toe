document.addEventListener("DOMContentLoaded", function() {
    const board = document.querySelector(".board");
    const cells = document.querySelectorAll(".cell");
    const message = document.querySelector(".message");
    const restartButton = document.querySelector(".restart-button");
    const currentPlayerElement = document.querySelector(".current-player");
    const modeSelection = document.querySelector(".mode-selection");
    const darkModeToggle = document.querySelector("#dark-mode-toggle");

    let currentPlayer = "X";
    let gameEnded = false;
    let mode = "player";

    function handleCellClick(event) {
        const cell = event.target;
        const cellIndex = Array.from(cells).indexOf(cell);

        if (cell.textContent === "" && !gameEnded) {
            cell.textContent = currentPlayer;
            cell.classList.add(currentPlayer);

            if (checkForWin(currentPlayer)) {
                endGame(`${currentPlayer} wins!`);
            } else if (isBoardFull()) {
                endGame("It's a tie!");
            } else {
                changePlayer();
                if (mode === "bot" && currentPlayer === "O") {
                    playBotTurn();
                }
            }
        }
    }

    function restartGame() {
        currentPlayer = "X";
        gameEnded = false;
        cells.forEach(cell => {
            cell.textContent = "";
            cell.classList.remove("X", "O");
        });
        message.textContent = `Player ${currentPlayer}'s Turn`;
        restartButton.style.display = "none";
    }

    function endGame(messageText) {
        gameEnded = true;
        message.textContent = messageText;
        restartButton.style.display = "block";
    }

    function changePlayer() {
        currentPlayer = currentPlayer === "X" ? "O" : "X";
        currentPlayerElement.textContent = currentPlayer;
        message.textContent = `Player ${currentPlayer}'s Turn`;
    }

    function checkForWin(player) {
        const winPatterns = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6]
        ];

        return winPatterns.some(pattern => {
            const [a, b, c] = pattern;
            return cells[a].textContent === player && cells[b].textContent === player && cells[c].textContent === player;
        });
    }

    function isBoardFull() {
        return Array.from(cells).every(cell => cell.textContent !== "");
    }

    function playBotTurn() {
        const emptyCells = Array.from(cells).filter(cell => cell.textContent === "");
        let botMove;

        // Check if bot can win in the next move
        for (const emptyCell of emptyCells) {
            emptyCell.textContent = currentPlayer;
            if (checkForWin(currentPlayer)) {
                botMove = emptyCell;
                break;
            }
            emptyCell.textContent = "";
        }

        if (!botMove) {
            // Check if player can win in the next move and block them
            for (const emptyCell of emptyCells) {
                emptyCell.textContent = "X";
                if (checkForWin("X")) {
                    emptyCell.textContent = currentPlayer;
                    botMove = emptyCell;
                    break;
                }
                emptyCell.textContent = "";
            }
        }

        if (!botMove) {
            // Choose a random empty cell
            const randomIndex = Math.floor(Math.random() * emptyCells.length);
            botMove = emptyCells[randomIndex];
            botMove.textContent = currentPlayer;
        }

        botMove.classList.add(currentPlayer);

        if (checkForWin(currentPlayer)) {
            endGame(`${currentPlayer} wins!`);
        } else if (isBoardFull()) {
            endGame("It's a tie!");
        } else {
            changePlayer();
        }
    }

    function toggleDarkMode() {
        document.body.classList.toggle("dark-mode");
    }

    cells.forEach(cell => cell.addEventListener("click", handleCellClick));
    restartButton.addEventListener("click", restartGame);
    darkModeToggle.addEventListener("click", toggleDarkMode);

    modeSelection.addEventListener("change", function(event) {
        mode = event.target.value;
        restartGame();
    });
});