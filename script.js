const main = document.querySelector("main");

// PLAYER CREATOR //

function Player(name, marker) {
    return { name, marker };
};

// GAMEBOARD MODULE //

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

// GAME CONTROLLER //

const GameController = (() => {
    let player1 = Player("Player 1", "X");
    let player2 = Player("Player 2", "O");
    let currentPlayer = player1;
    let gameOver = false;
    let gameStarted = false;

    function setPlayerNames(name1, name2) {
        player1.name = name1;
        player2.name = name2;
    ;}

    const playerNameForm = document.createElement("div");
    playerNameForm.classList.add("nameForm");

    const playerOneInput = document.createElement("input");
    playerOneInput.id = "playerOneInput";
    playerOneInput.classList.add("playerNames");
    playerOneInput.setAttribute("type", "text");
    playerOneInput.placeholder = "Player 1"; 

    const playerTwoInput = document.createElement("input");
    playerTwoInput.id = "playerTwoInput";
    playerTwoInput.classList.add("playerNames");
    playerTwoInput.setAttribute("type", "text");
    playerTwoInput.placeholder = player2.name; 

    const startGameButton = document.createElement("button");
    startGameButton.id = "startGameBtn";
    startGameButton.textContent = "Start Game";

    main.appendChild(playerNameForm);
    playerNameForm.appendChild(playerOneInput);
    playerNameForm.appendChild(playerTwoInput);
    playerNameForm.appendChild(startGameButton);

    const result = document.createElement("div");
    result.id = "result";
    result.style.display = "none";

    main.appendChild(result);

    const currentTurn = document.createElement("div");
    currentTurn.id = "turn";
    currentTurn.style.display = "none";

    main.appendChild(currentTurn);


    startGameButton.addEventListener("click", () => {
        const playerOne = playerOneInput.value.trim();
        const playerTwo = playerTwoInput.value.trim();

        if (!playerOne || !playerTwo) {
            alert('Introduce both players names!');
            return;
        } else if (playerOne.toLowerCase() === playerTwo.toLowerCase()) {
            alert('Players cannot have the same name!');
            return;
        }
        else {
            setPlayerNames(playerOne, playerTwo);
            gameStarted = true;
            playerNameForm.style.display = 'none';
            result.style.display = 'none';
            currentTurn.textContent = `${playerOne}'s turn`;
            currentTurn.style.display = "block";
        }
    });

    const switchPlayer = () => {
        currentPlayer = currentPlayer === player1 ? player2 : player1;
        currentTurn.textContent = `${currentPlayer.name}'s turn`;
    };

    const checkWinner = () => {
        const b = GameBoard.getBoard();
        const winCombos = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // cols
            [0, 4, 8], [2, 4, 6]             // diagonals
        ];

        return winCombos.some(combo =>
            combo.every(index => b[index] === currentPlayer.marker)
        );
    };

    const restart = () => {
        GameBoard.resetBoard();
        currentPlayer = player1;
        gameOver = false;
        gameStarted = false;

        playerNameForm.style.display = 'block';
        setPlayerNames("Player 1", "Player 2");

    };

    function playTurn(index) {
        if (!gameStarted) {
            alert('First introduce both player names and then click Start Game!');
            return false;
        }
        if (gameOver) return false;

        if (GameBoard.setCell(index, currentPlayer.marker)) {

            if (checkWinner()) {
                gameOver = true;
                result.textContent = `${currentPlayer.name} wins!`;
                result.style.display = "block";
                currentTurn.style.display = "none";
                return true;
            } else if (GameBoard.getBoard().every(cell => cell !== "")) {
                gameOver = true;
                result.textContent = "It's a draw!";
                result.style.display = "block";
                currentTurn.style.display = "none";
                return true;
            }
            switchPlayer();
            return true;
        }
        return false;
    };

    return { getCurrentPlayer: () => currentPlayer, setPlayerNames, playTurn, restart, getBoard: GameBoard.getBoard, playerNameForm: playerNameForm, result: result, currentTurn: currentTurn };
})();

// DOM CONTROLLER TO DISPLAY BOARD AND ADD INTERACTIVITY //

const DisplayController = (() => {

    const boardGrid = document.createElement("div");
    boardGrid.id = "gameGrid"
    boardGrid.classList.add("grid");

    // Create each of the 9 cells in the 3x3 grid //
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

    main.appendChild(boardGrid);
    main.appendChild(resetButton);


    resetButton.addEventListener("click", () => {
        GameController.restart();
        GameController.setPlayerNames("Player 1", "Player 2");
        document.querySelectorAll(".cell").forEach(cell => {
        cell.textContent = "";
        cell.classList.remove("played");
        });
        GameController.playerNameForm.style.display = "grid";
        GameController.result.textContent = "";
        GameController.result.style.display = "none";
        GameController.currentTurn.style.display = "none";
        GameController.currentTurn.textContent = "";

    });

    return { main };

})();

// HANDLE TURNS WHEN CLICKING //

(function cellPlay() {

    function handleClick(child) {

        if (child.classList.contains("played")) { return; }

        const current = GameController.getCurrentPlayer();
        const played = GameController.playTurn(child.id);

        if (!played) return;

        GameController.playTurn(child.id);

        child.classList.add("played");
        child.textContent = current.marker;
        }


    const gridCells = document.querySelectorAll(".cell");

    gridCells.forEach(child => {
        child.addEventListener("click", () => handleClick(child));
    });

})();