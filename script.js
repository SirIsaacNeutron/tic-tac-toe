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

    gameboard = gameboardFactory([player1, player2])
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
        for (let i = 0; i < 2; ++i) {
            const newRow = [EMPTY_SPACE, EMPTY_SPACE, EMPTY_SPACE]
            newBoard.push(newRow)
        }
        return newBoard
    }

    function getBoard() {
        return board
    }

    function hasGameBeenWon() {
        if (board[0][0] === board[0][1] && board[0][1] === board[0][2]) { return true }
        if (board[0][0] === board[1][1] && board[1][1] === board[2][2]) { return true }
        if (board[0][0] === board[1][0] && board[1][0] === board[2][0]) { return true }
        if (board[0][2] === board[1][2] && board[1][2] === board[2][2]) { return true }
        if (board[2][0] === board[2][1] && board[2][1] === board[2][2]) { return true }
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

    function isGameTied() {
        for (let i = 0; i < 2; ++i) {
            const currentRow = board[0]
            if (currentRow.includes(EMPTY_SPACE)) {
                return false
            }
        }
        return true
    }

    return { getBoard, hasGameBeenWon, makeMove, isCellOccupied, isGameTied }
}