// X player
let player1 = null
let player2 = null

let gameboard = null

const twoPlayersButton = document.querySelector(".two-players-btn")

twoPlayersButton.addEventListener("click", createPlayerNamesForm)

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

    createTicTacToeBoard(player1, player2)
}

function createTicTacToeBoard(playerOne, playerTwo) {
    gameboard = gameboardFactory([playerOne, playerTwo])

    const main = document.querySelector("main")
    main.classList.add("game-section")
    main.replaceChildren()

    const restartGameButton = document.createElement("button")
    restartGameButton.textContent = "Play Again"
    restartGameButton.classList.add("play-again-btn")

    restartGameButton.addEventListener("click", () => {
        createTicTacToeBoard(playerOne, playerTwo)
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
            newCell.classList.add(`${i}-${j}`)

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

                const currentPlayer = gameboard.getCurrentPlayer() 

                gameboard.makeMove(i, j)

                if (gameboard.hasGameBeenWon()) {
                    if (currentPlayer.getMarker() === player1.getMarker()) {
                        player1Area.classList.add("victorious-player")
                    }
                    else {
                        player2Area.classList.add("victorious-player")
                    }
                    restartGameButton.classList.add("show-btn")
                }
                else {
                    // If X just made their move, show that O is the current player
                    if (currentPlayer.getMarker() === player1.getMarker()) {
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

function gameboardFactory(playersArray) {
    const xPlayer = playersArray[0]
    const yPlayer = playersArray[1]
    
    let currentPlayer = xPlayer
    const EMPTY_SPACE = ""
    
    const board = createBoard()

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

            if (currentPlayer === xPlayer) {
                currentPlayer = yPlayer
            }
            else {
                currentPlayer = xPlayer
            }
        }
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

    return { getBoard, getCurrentPlayer, hasGameBeenWon, makeMove, isCellOccupied, getCellContent, isGameTied }
}