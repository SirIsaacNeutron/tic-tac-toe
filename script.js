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

    buttonsSection.replaceWith(nameForm)
}
