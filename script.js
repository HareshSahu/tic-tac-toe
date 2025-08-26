const boardEl = document.getElementById('board');
const statusEl = document.getElementById('status');
const resetBtn = document.getElementById('resetBtn');
const newGameBtn = document.getElementById('newGameBtn');
const cpuToggle = document.getElementById('cpuToggle');
const xWinsEl = document.getElementById('xWins');
const oWinsEl = document.getElementById('oWins');
const drawsEl = document.getElementById('draws');

const WINS = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
];

let board = Array(9).fill(null);
let xTurn = true;
let locked = false;
let score = { X: 0, O: 0, D: 0 };

function initBoard() {
    boardEl.innerHTML = '';
    for (let i = 0; i < 9; i++) {
        const cell = document.createElement('button');
        cell.className = 'cell';
        cell.dataset.idx = i;
        cell.addEventListener('click', onCellClick);
        boardEl.appendChild(cell);
    }
    updateStatus();
}

function onCellClick(e) {
    const i = +e.currentTarget.dataset.idx;
    if (locked || board[i]) return;
    makeMove(i, xTurn ? 'X' : 'O');
    if (!locked && cpuToggle.checked && !xTurn) {
        setTimeout(() => {
            const move = bestCpuMove();
            if (move != null) makeMove(move, 'O');
        }, 180);
    }
}

function makeMove(i, player) {
    board[i] = player;
    const cell = boardEl.children[i];
    cell.textContent = player;
    cell.classList.add('disabled');

    const win = checkWin(player);
    if (win) {
        locked = true;
        highlight(win);
        statusEl.textContent = `${player} wins!`;
        score[player]++; updateScore();
        return;
    }
    if (board.every(Boolean)) {
        locked = true; statusEl.textContent = 'Draw!';
        score.D++; updateScore();
        return;
    }
    xTurn = !xTurn;
    updateStatus();
}

function checkWin(p) {
    for (const line of WINS) {
        const [a, b, c] = line;
        if (board[a] === p && board[b] === p && board[c] === p) return line;
    }
    return null;
}

function highlight(line) {
    for (const i of line) {
        boardEl.children[i].classList.add('win');
    }
    [...boardEl.children].forEach(c => c.classList.add('disabled'));
}

function updateStatus() {
    statusEl.textContent = `Turn: ${xTurn ? 'X' : 'O'}`;
}

function updateScore() {
    xWinsEl.textContent = score.X;
    oWinsEl.textContent = score.O;
    drawsEl.textContent = score.D;
}

function resetBoard(keepScore = true) {
    board = Array(9).fill(null); locked = false; xTurn = true;
    [...boardEl.children].forEach(c => { c.textContent = ''; c.className = 'cell'; });
    if (!keepScore) score = { X: 0, O: 0, D: 0 }, updateScore();
    updateStatus();
}

function bestCpuMove() {
    let move = findTactical('O'); if (move != null) return move;
    move = findTactical('X'); if (move != null) return move;
    if (!board[4]) return 4;
    const corners = [0, 2, 6, 8].filter(i => !board[i]);
    if (corners.length) return pickRandom(corners);
    const sides = [1, 3, 5, 7].filter(i => !board[i]);
    if (sides.length) return pickRandom(sides);
    return null;
}

function findTactical(player) {
    for (const [a, b, c] of WINS) {
        const idxs = [a, b, c];
        const mine = idxs.filter(i => board[i] === player).length;
        const empties = idxs.filter(i => !board[i]);
        if (mine === 2 && empties.length === 1) return empties[0];
    }
    return null;
}

function pickRandom(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

resetBtn.addEventListener('click', () => resetBoard());
newGameBtn.addEventListener('click', () => resetBoard(false));

initBoard();
