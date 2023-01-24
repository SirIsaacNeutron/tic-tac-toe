// X player
let player1 = null
let player2 = null

let gameboard = null

const aiButton = document.querySelector(".ai-btn")

aiButton.addEventListener("click", createAiForm)

const twoPlayersButton = document.querySelector(".two-players-btn")

twoPlayersButton.addEventListener("click", createPlayerNamesForm)

function createAiForm() {
    const buttonsSection = document.querySelector(".buttons-section")
    buttonsSection.replaceChildren()
    buttonsSection.classList.remove("buttons-section")
    buttonsSection.classList.add("ai-section")

    const userInformation = document.createElement("p")
    userInformation.textContent = "Choose the symbol the human player (you) will be playing. The AI will play as the opposite."
    buttonsSection.appendChild(userInformation)

    const aiInformation = document.createElement("p")
    aiInformation.textContent = "The AI might make seemingly strange moves. When that happens, think about why those moves are being made :)"
    buttonsSection.appendChild(aiInformation)

    const aiButtonsSection = document.createElement("div")
    aiButtonsSection.classList.add("ai-btns-section")

    const humanPlayAsX = document.createElement("button")
    humanPlayAsX.textContent = "X"
    humanPlayAsX.addEventListener("click", () => {
        handleAiForm("X")
    })
    aiButtonsSection.appendChild(humanPlayAsX)

    const humanPlayAsO = document.createElement("button")
    humanPlayAsO.textContent = "O"
    humanPlayAsO.addEventListener("click", () => {
        handleAiForm("O")
    })
    aiButtonsSection.appendChild(humanPlayAsO)

    buttonsSection.appendChild(aiButtonsSection)
}

function handleAiForm(humanMarker) {
    if (humanMarker === "X") {
        player1 = playerFactory("Human", humanMarker)
        player2 = aiFactory("O")
    }
    else {
        player1 = aiFactory("X")
        player2 = playerFactory("Human", humanMarker)
    }

    createTicTacToeBoard(player1, player2, true)
}

function createPlayerNamesForm() {
    const buttonsSection = document.querySelector(".buttons-section")
    buttonsSection.replaceChildren()

    const nameForm = document.createElement("form")
    nameForm.classList.add("name-form")
    nameForm.setAttribute("method", "POST")

    const xLabel = document.createElement("label")
    xLabel.textContent = "X player's name:"
    xLabel.setAttribute("for", "xPlayerInput")
    nameForm.appendChild(xLabel)

    const xPlayerInput = document.createElement("input")
    xPlayerInput.setAttribute("type", "text")
    xPlayerInput.setAttribute("name", "xPlayerName")
    xPlayerInput.setAttribute("id", "xPlayerInput")
    xPlayerInput.setAttribute("required", "")
    xPlayerInput.setAttribute("value", "Player 1")
    nameForm.appendChild(xPlayerInput)

    const oLabel = document.createElement("label")
    oLabel.textContent = "O player's name:"
    oLabel.setAttribute("for", "oPlayerInput")
    nameForm.appendChild(oLabel)

    const oPlayerInput = document.createElement("input")
    oPlayerInput.setAttribute("type", "text")
    oPlayerInput.setAttribute("name", "oPlayerName")
    oPlayerInput.setAttribute("id", "oPlayerInput")
    oPlayerInput.setAttribute("required", "")
    oPlayerInput.setAttribute("value", "Player 2")
    nameForm.appendChild(oPlayerInput)

    const submitButton = document.createElement("button")
    submitButton.textContent = "Start Game"
    submitButton.setAttribute("type", "submit")
    submitButton.classList.add("submit-btn")
    nameForm.appendChild(submitButton)

    nameForm.addEventListener("submit", handleSubmission)

    buttonsSection.replaceWith(nameForm)
}

function handleSubmission(e) {
    e.preventDefault()

    const player1Name = document.getElementById("xPlayerInput").value
    const player2Name = document.getElementById("oPlayerInput").value

    player1 = playerFactory(player1Name, "X")
    player2 = playerFactory(player2Name, "O")

    // const gameSection = document.querySelector(".form-section")
    // gameSection.classList.remove("form-section")
    // gameSection.classList.add("game-section")
    // gameSection.replaceChildren()

    createTicTacToeBoard(player1, player2, false)
}

function createTicTacToeBoard(playerOne, playerTwo, isAIPlaying) {
    gameboard = gameboardFactory([playerOne, playerTwo])

    const main = document.querySelector("main")
    main.classList.add("game-section")
    main.replaceChildren()

    const restartGameButton = document.createElement("button")
    restartGameButton.textContent = "Play Again"
    restartGameButton.classList.add("play-again-btn")

    restartGameButton.addEventListener("click", () => {
        createTicTacToeBoard(playerOne, playerTwo, isAIPlaying)
    })

    main.appendChild(restartGameButton)

    const playerArea = document.createElement("div")
    playerArea.classList.add("player-section")
    
    const player1Area = document.createElement("div")
    player1Area.classList.add("player-name")
    player1Area.classList.add("current-player")
    player1Area.textContent = player1.getName()

    const player2Area = document.createElement("div")
    player2Area.classList.add("player-name")
    player2Area.textContent = player2.getName()

    playerArea.appendChild(player1Area)
    playerArea.appendChild(player2Area)

    main.appendChild(playerArea)

    const ticTacToeBoard = document.createElement("div")
    ticTacToeBoard.classList.add("tic-tac-toe-board")
    for (let i = 0; i < 3; ++i) {
        for (let j = 0; j < 3; ++j) {
            const newCell = document.createElement("div")
            newCell.classList.add("game-cell")
            newCell.classList.add(`row${i}-col${j}`)

            if (i === 0) {
                newCell.classList.add("no-top-border")
            }

            if (j === 0) {
                newCell.classList.add("no-left-border")
            }

            if (i === 2) {
                newCell.classList.add("no-bottom-border")
            }

            if (j === 2) {
                newCell.classList.add("no-right-border")
            }

            newCell.addEventListener("click", () => {
                // Do nothing if occupied cell is chosen or game is over
                if (gameboard.isCellOccupied(i, j) || gameboard.hasGameBeenWon()) { return }

                gameboard.makeMove(i, j)

                if (isAIPlaying) {
                    if (gameboard.getCurrentPlayer().getName() === "AI") {
                        const aiMove = gameboard.getCurrentPlayer().getMove()
                        const aiRow = aiMove[0]
                        const aiCol = aiMove[1]

                        const chosenCell = document.querySelector(`div.row${aiRow}-col${aiCol}`)
                        gameboard.makeMove(aiRow, aiCol)
                        chosenCell.textContent = gameboard.getCellContent(aiRow, aiCol)
                    }
                }

                if (gameboard.hasGameBeenWon()) {
                    if (gameboard.getCurrentPlayer().getMarker() === player1.getMarker()) {
                        player1Area.classList.add("victorious-player")
                    }
                    else {
                        player2Area.classList.add("victorious-player")
                    }
                    restartGameButton.classList.add("show-btn")
                }
                else {
                    // If X just made their move, show that O is the current player
                    if (gameboard.getCurrentPlayer().getMarker() !== player1.getMarker()) {
                        player1Area.classList.remove("current-player")
                        player2Area.classList.add("current-player")
                    }
                    // and vice-versa
                    else {
                        player2Area.classList.remove("current-player")
                        player1Area.classList.add("current-player")
                    }
                }

                newCell.textContent = gameboard.getCellContent(i, j)

                if (gameboard.isGameTied()) {
                    restartGameButton.classList.add("show-btn")
                    player1Area.classList.remove("current-player")
                    player2Area.classList.remove("current-player")
                }
            })

            ticTacToeBoard.appendChild(newCell)
        }
    }

    main.appendChild(ticTacToeBoard)

    if (gameboard.getCurrentPlayer().getName() === "AI") {
        const aiMove = gameboard.getCurrentPlayer().getMove()
        const aiRow = aiMove[0]
        const aiCol = aiMove[1]

        const chosenCell = document.querySelector(`div.row${aiRow}-col${aiCol}`)
        chosenCell.click()
    }
}

function playerFactory(playerName, playerMarker) {
    let name = playerName
    const marker = playerMarker

    function getMarker() {
        return marker
    }

    function getName() {
        return name
    }

    function setName(newName) {
        name = newName
    }

    return { setName, getName, getMarker }
}

function gameboardFactory(playersArray, currentPlayer_ = playersArray[0]) {
    const xPlayer = playersArray[0]
    const yPlayer = playersArray[1]
    
    let currentPlayer = currentPlayer_
    const EMPTY_SPACE = ""
    
    let board = createBoard()

    function createBoard() {
        const newBoard = []
        for (let i = 0; i < 3; ++i) {
            const newRow = [EMPTY_SPACE, EMPTY_SPACE, EMPTY_SPACE]
            newBoard.push(newRow)
        }
        return newBoard
    }

    function getBoard() {
        return board
    }

    function setBoard(newBoard) {
        board = newBoard
    }

    function getCopy() {
        // By passing in the currentPlayer of the object (instead of currentPlayer_),
        // we can preserve the turn logic of makeMove
        const gameboardCopy = gameboardFactory(playersArray, currentPlayer)

        // Make a new version of the board separate from the old one
        const boardCopy = []
        for (let i = 0; i < 3; ++i) {
            boardCopy.push([EMPTY_SPACE, EMPTY_SPACE, EMPTY_SPACE])
            for (let j = 0; j < 3; ++j) {
                boardCopy[i][j] = board[i][j]
            }
        }

        gameboardCopy.setBoard(boardCopy)

        return gameboardCopy
    }

    function getCurrentPlayer() {
        return currentPlayer
    }

    function hasGameBeenWon() {
        // top row
        if (board[0][0] !== EMPTY_SPACE && board[0][0] === board[0][1] && board[0][1] === board[0][2]) { return true }

        // top left to bottom right diagonal
        if (board[0][0] !== EMPTY_SPACE && board[0][0] === board[1][1] && board[1][1] === board[2][2]) { return true }

        // leftmost column
        if (board[0][0] !== EMPTY_SPACE && board[0][0] === board[1][0] && board[1][0] === board[2][0]) { return true }

        // top right to bottom left diagonal
        if (board[0][2] !== EMPTY_SPACE && board[0][2] === board[1][1] && board[1][1] === board[2][0]) { return true }

        // rightmost column
        if (board[0][2] !== EMPTY_SPACE && board[0][2] === board[1][2] && board[1][2] === board[2][2]) { return true }

        // middle row
        if (board[1][0] !== EMPTY_SPACE && board[1][0] === board[1][1] && board[1][1] === board[1][2]) { return true }

        // middle column
        if (board[0][1] !== EMPTY_SPACE && board[0][1] === board[1][1] && board[1][1] === board[2][1]) { return true }

        // bottom row
        if (board[2][0] !== EMPTY_SPACE && board[2][0] === board[2][1] && board[2][1] === board[2][2]) { return true }
        return false
    }

    function makeMove(row, col) {
        if (!isCellOccupied(row, col)) {
            board[row][col] = currentPlayer.getMarker()

            // Don't update currentPlayer on victories
            if (hasGameBeenWon()) { return }

            if (currentPlayer === xPlayer) {
                currentPlayer = yPlayer
            }
            else {
                currentPlayer = xPlayer
            }
        }
    }

    function getWinnerMarker() {
        return currentPlayer === xPlayer ? "X" : "O"
    }

    function getAllPossibleMoves() {
        const allMoves = []
        for (let i = 0; i < 3; ++i) {
            for (let j = 0; j < 3; ++j) {
                if (board[i][j] === EMPTY_SPACE) {
                    allMoves.push([i, j])
                }
            }
        }
        return allMoves
    }

    function isCellOccupied(row, col) {
        return board[row][col] !== EMPTY_SPACE
    }

    function getCellContent(row, col) {
        return board[row][col]
    }

    function isGameTied() {
        for (let i = 0; i < 3; ++i) {
            const currentRow = board[i]
            if (currentRow.includes(EMPTY_SPACE)) {
                return false
            }
        }
        return true
    }

    return { getWinnerMarker, getAllPossibleMoves, setBoard, getBoard, getCopy, getCurrentPlayer, hasGameBeenWon, makeMove, isCellOccupied, getCellContent, isGameTied }
}

function aiFactory(aiMarker) {
    const aiPlayer = playerFactory("AI", aiMarker)

    let evaluatedMove = null

    function getMove() {
        const gameboardCopy = gameboard.getCopy()

        // console.log(gameboardCopy.getBoard())

        if (aiMarker === "X") {
            minimax(gameboardCopy, 4, true, true)
        }
        else {
            minimax(gameboardCopy, 4, false, true)
        }

        return evaluatedMove
    }

    /** Taken from https://stackoverflow.com/questions/6274339/how-can-i-shuffle-an-array
     * Shuffles array in place. ES6 version
     * @param {Array} a items An array containing the items.
     */
    function shuffle(a) {
        for (let i = a.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [a[i], a[j]] = [a[j], a[i]];
        }
        return a;
    }

    // minimax algorithm: https://en.wikipedia.org/wiki/Minimax#Pseudocode 
    function minimax(gameboardState, depth, isX, isInitialCall) {

        if (depth === 0 || gameboardState.hasGameBeenWon() || gameboardState.isGameTied()) {
            if (gameboardState.hasGameBeenWon()) {
                const winnerMarker = gameboardState.getWinnerMarker()
                // X is the maximizing player
                if (winnerMarker === "X") {
                    return 1
                }
                return -1
            }
            return 0
        }

        const allMoves = gameboardState.getAllPossibleMoves()
        // allMoves is in order ([0, 0], [0, 1], ...) and the AI is indfifferent to moves of
        // equal value
        // So it will always choose the earliest index in allMoves... unless we shuffle it
        if (isInitialCall) {
            shuffle(allMoves)
        }

        if (isX) {
            let value = -100
            for (let i = 0; i < allMoves.length; ++i) {
                const potentialRow = allMoves[i][0]
                const potentialCol = allMoves[i][1]

                const gameboardStateCopy = gameboardState.getCopy()
                gameboardStateCopy.makeMove(potentialRow, potentialCol)

                const result = minimax(gameboardStateCopy, depth - 1, false, false)

                if (result > value) {
                    value = result
                    if (isInitialCall) {
                        evaluatedMove = [potentialRow, potentialCol]
                    }               
                }
            }
            return value
        }
        // if O
        let value = 100
        for (let i = 0; i < allMoves.length; ++i) {
            const potentialRow = allMoves[i][0]
            const potentialCol = allMoves[i][1]

            const gameboardStateCopy = gameboardState.getCopy()
            gameboardStateCopy.makeMove(potentialRow, potentialCol)

            const result = minimax(gameboardStateCopy, depth - 1, true, false)
            if (result < value) {
                value = result
                if (isInitialCall) {
                    evaluatedMove = [potentialRow, potentialCol]
                }
            }
        }
        return value

    }

    return { ...aiPlayer, getMove }
}