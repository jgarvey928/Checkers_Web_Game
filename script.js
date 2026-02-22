const boardElement = document.getElementById('board');
const statusElement = document.createElement('div');
statusElement.classList.add('status-indicator');
const winnerOverlay = document.getElementById('winner-overlay');
const winnerMessage = document.getElementById('winner-message');
document.body.appendChild(statusElement);

let board = [];
let selectedRow = -1;
let selectedCol = -1;
let isRedTurn = true;
let chainJumpInProgress = false;

function initializeBoard() {
    board = [];
    for (let row = 0; row < 8; row++) {
        board[row] = [];
        for (let col = 0; col < 8; col++) {
            if ((row + col) % 2 !== 0) {
                if (row < 3) {
                    board[row][col] = 1; // Red piece
                } else if (row > 4) {
                    board[row][col] = 2; // Black piece
                } else {
                    board[row][col] = 0; // Empty
                }
            } else {
                board[row][col] = 0; // Empty
            }
        }
    }
}

function renderBoard() {
    boardElement.innerHTML = '';
    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            const square = document.createElement('div');
            square.classList.add('square');
            if ((row + col) % 2 === 0) {
                square.classList.add('light');
            } else {
                square.classList.add('dark');
            }
            square.dataset.row = row;
            square.dataset.col = col;

            const piece = board[row][col];
            if (piece !== 0) {
                const pieceElement = document.createElement('div');
                pieceElement.classList.add('piece');
                if (piece === 1) {
                    pieceElement.classList.add('red');
                } else if (piece === 2) {
                    pieceElement.classList.add('black');
                } else if (piece === 3) {
                    pieceElement.classList.add('red', 'king');
                } else if (piece === 4) {
                    pieceElement.classList.add('black', 'king');
                }
                square.appendChild(pieceElement);
            }
            
            if (row === selectedRow && col === selectedCol) {
                square.classList.add('selected');
            }

            boardElement.appendChild(square);
        }
    }
    updateStatus();
}

function handleSquareClick(event) {
    const square = event.target.closest('.square');
    if (!square) return;

    const row = parseInt(square.dataset.row);
    const col = parseInt(square.dataset.col);

    if (chainJumpInProgress) {
        if (isValidMove(row, col)) {
            movePiece(row, col);
        }
    } else {
        if (selectedRow === -1) {
            if ((isRedTurn && (board[row][col] === 1 || board[row][col] === 3)) || (!isRedTurn && (board[row][col] === 2 || board[row][col] === 4))) {
                selectedRow = row;
                selectedCol = col;
            }
        } else {
            if (isValidMove(row, col)) {
                movePiece(row, col);
            } else {
                selectedRow = -1;
                selectedCol = -1;
            }
        }
    }
    renderBoard();
}

function isValidMove(row, col) {
    if (board[row][col] !== 0 || (row + col) % 2 === 0) {
        return false;
    }

    const piece = board[selectedRow][selectedCol];
    const isKing = (piece === 3 || piece === 4);
    const rowDiff = Math.abs(row - selectedRow);
    const colDiff = Math.abs(col - selectedCol);

    if (!isKing) {
        if (isRedTurn && row < selectedRow) return false;
        if (!isRedTurn && row > selectedRow) return false;
    }

    if (chainJumpInProgress) {
        return rowDiff === 2 && colDiff === 2 && isJump(row, col);
    }

    if (rowDiff === 1 && colDiff === 1) {
        if (isKing) {
            return true;
        }
        if (isRedTurn && row > selectedRow) {
            return true;
        } else if (!isRedTurn && row < selectedRow) {
            return true;
        }
    } else if (rowDiff === 2 && colDiff === 2) {
        return isJump(row, col);
    }

    return false;
}

function isJump(row, col) {
    const jumpedRow = (row + selectedRow) / 2;
    const jumpedCol = (col + selectedCol) / 2;
    const jumpedPiece = board[jumpedRow][jumpedCol];

    if (isRedTurn && (jumpedPiece === 2 || jumpedPiece === 4)) {
        return true;
    } else if (!isRedTurn && (jumpedPiece === 1 || jumpedPiece === 3)) {
        return true;
    }
    return false;
}

function movePiece(row, col) {
    const piece = board[selectedRow][selectedCol];
    board[selectedRow][selectedCol] = 0;
    board[row][col] = piece;

    // King promotion
    if (piece === 1 && row === 7) {
        board[row][col] = 3; // Red king
    } else if (piece === 2 && row === 0) {
        board[row][col] = 4; // Black king
    }

    const rowDiff = Math.abs(row - selectedRow);
    if (rowDiff === 2) {
        const jumpedRow = (row + selectedRow) / 2;
        const jumpedCol = (col + selectedCol) / 2;
        board[jumpedRow][jumpedCol] = 0;

        if (canJumpFrom(row, col)) {
            selectedRow = row;
            selectedCol = col;
            chainJumpInProgress = true;
        } else {
            chainJumpInProgress = false;
        }
    } else {
        chainJumpInProgress = false;
    }

    if (!chainJumpInProgress) {
        isRedTurn = !isRedTurn;
        selectedRow = -1;
        selectedCol = -1;
    }

    checkWinner();
}

function canJumpFrom(r, c) {
    const piece = board[r][c];
    if (piece === 0) return false;
    const isKing = piece === 3 || piece === 4;

    const directions = [];
    if (isRedTurn || isKing) {
        directions.push({r: 1, c: -1}, {r: 1, c: 1});
    }
    if (!isRedTurn || isKing) {
        directions.push({r: -1, c: -1}, {r: -1, c: 1});
    }

    for (const dir of directions) {
        const jumpR = r + dir.r * 2;
        const jumpC = c + dir.c * 2;
        if(jumpR >= 0 && jumpR < 8 && jumpC >= 0 && jumpC < 8 && board[jumpR][jumpC] === 0) {
            const jumpedR = r + dir.r;
            const jumpedC = c + dir.c;
            const jumpedPiece = board[jumpedR][jumpedC];
            if (isRedTurn && (jumpedPiece === 2 || jumpedPiece === 4)) {
                return true;
            } else if (!isRedTurn && (jumpedPiece === 1 || jumpedPiece === 3)) {
                return true;
            }
        }
    }
    
    return false;
}

function updateStatus() {
    statusElement.textContent = isRedTurn ? "Red's turn" : "Black's turn";
}

function checkWinner() {
    let redHasPieces = false;
    let blackHasPieces = false;
    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            if (board[r][c] === 1 || board[r][c] === 3) {
                redHasPieces = true;
            } else if (board[r][c] === 2 || board[r][c] === 4) {
                blackHasPieces = true;
            }
        }
    }

    let winner = null;
    if (!redHasPieces) {
        winner = 'Black';
    } else if (!blackHasPieces) {
        winner = 'Red';
    }

    if (winner) {
        winnerMessage.textContent = `${winner} wins!`;
        winnerOverlay.style.display = 'flex';
        setTimeout(() => {
            winnerOverlay.style.display = 'none';
            resetGame();
        }, 3000);
    }
}

function resetGame() {
    initializeBoard();
    isRedTurn = true;
    selectedRow = -1;
    selectedCol = -1;
    chainJumpInProgress = false;
    renderBoard();
}


boardElement.addEventListener('click', handleSquareClick);

initializeBoard();
renderBoard();
