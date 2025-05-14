// Factory function for creating players

function Player(name, marker) {
    return { name, marker };
};

// GameBoard module

const GameBoard = (() => {
    let board = ["", "", "", "", "", "", "", "", ""];

    const getBoard = () => board;

    const setCell = (index, marker) => {
        if (board[index] === "") {
            board[index] = marker;
            return true;
        }
        return false;
    };

    const resetBoard = () => {
        board = ["", "", "", "", "", "", "", "", ""];
    };

    return { getBoard, setCell, resetBoard };
})();

// Game controller

const GameController = (() => {
    const player1 = Player("Player 1", "X");
    const player2 = Player("Player 2", "O");
    let currentPlayer = player1;
    let gameOver = false;

    const switchPlayer = () => {
        currentPlayer = currentPlayer === player1 ? player2 : player1;
        console.log(`Current player switched to: ${currentPlayer.name}`);
    };

    const checkWinner = () => {
        const b = GameBoard.getBoard();
        const winCombos = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // cols
            [0, 4, 8], [2, 4, 6]          // diags
        ];

        return winCombos.some(combo =>
            combo.every(index => b[index] === currentPlayer.marker)
        );
    };

    const restart = () => {
        GameBoard.resetBoard();
        currentPlayer = player1;
        gameOver = false;
        console.log("Game restarted.");
    };

    function playTurn(index) {
        if (GameBoard.setCell(index, currentPlayer.marker)) {
            console.log(`${currentPlayer.name} played at index ${index}`);

        if (checkWginner()) {
            console.log(`${currentPlayer.name} wins!`);
            gameOver = true;
            return;
        } else if (GameBoard.getBoard().every(cell => cell !== "")) {
            console.log("It's a draw!");
            gameOver = true;
            return;
        }
        switchPlayer();
        }
    };

    return { getCurrentPlayer: () => currentPlayer, playTurn, restart, getBoard: GameBoard.getBoard, isGameOver: () => gameOver };
})();

// DOM controller to display Board and add interactivity
const DisplayController = (() => {

    const main = document.querySelector("main");

/*     const playerNames = document.createElement("div");
    playerNames.id = "playerNames";
    playerNames.classList.add("names");
    playerNames.textContent = "testestestestest"; */

    const boardGrid = document.createElement("div");
    boardGrid.id = "gameGrid"
    boardGrid.classList.add("grid");

    // Create each of the 9 cells in the 3x3 grid
    for (let i = 0; i < 9; i++) {
        const cell = document.createElement("div");
        cell.id = i;
        cell.classList.add("cell");
        boardGrid.appendChild(cell);
    };

    const resetButton = document.createElement("button");
    resetButton.id = "resetBtn"
    resetButton.classList.add("reset");
    resetButton.textContent = "Reset game";

/*     main.appendChild(playerNames); */
    main.appendChild(boardGrid);
    main.appendChild(resetButton);


    resetButton.addEventListener("click", () => {
        GameController.restart();
        document.querySelectorAll(".cell").forEach(cell => {
        cell.textContent = "";
        cell.classList.remove("played");
        });
    });



})();

// Handle turns with clicking

(function cellPlay() {

    function handleClick(child) {
        if (GameController.isGameOver()) {
            return;
        }
        else if (child.classList.contains("played")) {
            console.log("Cell already taken!");
            return;
        }

        const current = GameController.getCurrentPlayer();

        GameController.playTurn(child.id);

        child.classList.add("played");
        child.textContent = current.marker;
        }


    const gridCells = document.querySelectorAll(".cell");

    gridCells.forEach(child => {
        child.addEventListener("click", () => handleClick(child));
    });

})();


// TO DO: Clean up the interface to allow players to put in their names and add a display element that shows the results upon game end! //