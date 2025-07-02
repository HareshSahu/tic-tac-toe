let currentPlayer = "X";
let gameActive = true;

function myFun(cell) {
    if (!gameActive || cell.innerHTML !== "") return;

    cell.innerHTML = currentPlayer;
    checkWinner();
    currentPlayer = currentPlayer === "X" ? "O" : "X";
}

function checkWinner() {
    const winCombinations = [
        ["div1", "div2", "div3"],
        ["div4", "div5", "div6"],
        ["div7", "div8", "div9"],
        ["div1", "div4", "div7"],
        ["div2", "div5", "div8"],
        ["div3", "div6", "div9"],
        ["div1", "div5", "div9"],
        ["div3", "div5", "div7"]
    ];

    for (let combo of winCombinations) {
        const [a, b, c] = combo.map(id => document.getElementById(id).innerHTML);
        if (a !== "" && a === b && b === c) {
            alert(`🎉 Player ${a} wins!`);
            gameActive = false;
            return;
        }
    }

    // Check draw
    const allFilled = [...Array(9).keys()].every(i => document.getElementById(`div${i + 1}`).innerHTML !== "");
    if (allFilled) {
        alert("🤝 It's a draw!");
        gameActive = false;
    }
}

function resetGame() {
    for (let i = 1; i <= 9; i++) {
        document.getElementById(`div${i}`).innerHTML = "";
    }
    currentPlayer = "X";
    gameActive = true;
}
