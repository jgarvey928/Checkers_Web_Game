const boardElement = document.getElementById('board');
const statusElement = document.createElement('div');
statusElement.classList.add('status-indicator');
const winnerOverlay = document.getElementById('winner-overlay');
const winnerMessage = document.getElementById('winner-message');
document.body.appendChild(statusElement);

let isSinglePlayer = false;
const singlePlayerButton = document.createElement('button');
singlePlayerButton.textContent = "Enable Single Player";
singlePlayerButton.style.cssText = "display: block; margin: 10px auto 20px auto; padding: 12px 24px; font-size: 16px; font-weight: bold; cursor: pointer; background: linear-gradient(to bottom, #444, #222); color: white; border: 2px solid #555; border-radius: 25px; box-shadow: 0 4px 6px rgba(0,0,0,0.3); transition: all 0.2s ease;";

singlePlayerButton.addEventListener('mouseover', () => {
    singlePlayerButton.style.transform = 'translateY(-2px)';
    singlePlayerButton.style.boxShadow = '0 6px 12px rgba(0,0,0,0.4)';
    singlePlayerButton.style.background = 'linear-gradient(to bottom, #555, #333)';
});

singlePlayerButton.addEventListener('mouseout', () => {
    singlePlayerButton.style.transform = 'translateY(0)';
    singlePlayerButton.style.boxShadow = '0 4px 6px rgba(0,0,0,0.3)';
    singlePlayerButton.style.background = 'linear-gradient(to bottom, #444, #222)';
});

let container = boardElement;
while (container.parentNode && container.parentNode !== document.body) {
    container = container.parentNode;
}
document.body.insertBefore(singlePlayerButton, container);

singlePlayerButton.addEventListener('click', () => {
    isSinglePlayer = !isSinglePlayer;
    singlePlayerButton.textContent = isSinglePlayer ? "Disable Single Player" : "Enable Single Player";
    if (isSinglePlayer && !isRedTurn) {
        setTimeout(makeComputerMove, 500);
    }
});

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
                square.style.boxShadow = 'inset 0 0 20px #ffeb3b, 0 0 15px #ffeb3b';
                square.style.border = '2px solid #ffeb3b';
                square.style.transform = 'scale(1.1)';
                square.style.zIndex = '10';
                square.style.transition = 'all 0.2s ease';
            }

            boardElement.appendChild(square);
        }
    }
    updateStatus();
}

function handleSquareClick(event) {
    if (isSinglePlayer && !isRedTurn) return;

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
    let promoted = false;
    if (piece === 1 && row === 7) {
        board[row][col] = 3; // Red king
        promoted = true;
    } else if (piece === 2 && row === 0) {
        board[row][col] = 4; // Black king
        promoted = true;
    }

    const rowDiff = Math.abs(row - selectedRow);
    if (rowDiff === 2) {
        const jumpedRow = (row + selectedRow) / 2;
        const jumpedCol = (col + selectedCol) / 2;
        board[jumpedRow][jumpedCol] = 0;

        if (!promoted && canJumpFrom(row, col)) {
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
        if (isSinglePlayer && !isRedTurn) {
            setTimeout(makeComputerMove, 500);
        }
    }

    checkWinner();
}

function canJumpFrom(r, c) {
    const piece = board[r][c];
    if (piece === 0) return false;
    const isPieceRed = (piece === 1 || piece === 3);
    const isKing = piece === 3 || piece === 4;

    const directions = [];
    if (isPieceRed || isKing) {
        directions.push({r: 1, c: -1}, {r: 1, c: 1});
    }
    if (!isPieceRed || isKing) {
        directions.push({r: -1, c: -1}, {r: -1, c: 1});
    }

    for (const dir of directions) {
        const jumpR = r + dir.r * 2;
        const jumpC = c + dir.c * 2;
        if(jumpR >= 0 && jumpR < 8 && jumpC >= 0 && jumpC < 8 && board[jumpR][jumpC] === 0) {
            const jumpedR = r + dir.r;
            const jumpedC = c + dir.c;
            const jumpedPiece = board[jumpedR][jumpedC];
            if (isPieceRed && (jumpedPiece === 2 || jumpedPiece === 4)) {
                return true;
            } else if (!isPieceRed && (jumpedPiece === 1 || jumpedPiece === 3)) {
                return true;
            }
        }
    }
    
    return false;
}

function hasAnyValidMoves(isRed) {
    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            const piece = board[r][c];
            if (piece === 0) continue;

            const isPieceRed = (piece === 1 || piece === 3);
            if (isPieceRed !== isRed) continue;

            if (canJumpFrom(r, c)) return true;

            const isKing = (piece === 3 || piece === 4);
            const directions = [];
            if (isRed || isKing) {
                directions.push({r: 1, c: -1}, {r: 1, c: 1});
            }
            if (!isRed || isKing) {
                directions.push({r: -1, c: -1}, {r: -1, c: 1});
            }

            for (const dir of directions) {
                const nr = r + dir.r;
                const nc = c + dir.c;
                if (nr >= 0 && nr < 8 && nc >= 0 && nc < 8 && board[nr][nc] === 0) {
                    return true;
                }
            }
        }
    }
    return false;
}

function updateStatus() {
    if (chainJumpInProgress) {
        statusElement.textContent = isRedTurn ? "Still Red's turn" : "Still Black's turn";
    } else {
        statusElement.textContent = isRedTurn ? "Red's turn" : "Black's turn";
    }
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
    } else if (!hasAnyValidMoves(isRedTurn)) {
        winner = isRedTurn ? 'Black' : 'Red';
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

function makeComputerMove() {
    if (isRedTurn) return;

    let moves = [];
    
    if (chainJumpInProgress) {
        moves = getMovesForPiece(selectedRow, selectedCol);
    } else {
        for (let r = 0; r < 8; r++) {
            for (let c = 0; c < 8; c++) {
                if (board[r][c] === 2 || board[r][c] === 4) {
                    moves = moves.concat(getMovesForPiece(r, c));
                }
            }
        }
    }

    if (moves.length === 0) return;

    let bestMoves = [];

    // 1. King Promotion
    const promotionMoves = moves.filter(m => {
        const piece = board[m.fromR][m.fromC];
        return piece === 2 && m.toR === 0;
    });

    if (promotionMoves.length > 0) {
        bestMoves = promotionMoves;
    } else {
        const jumps = moves.filter(m => Math.abs(m.fromR - m.toR) === 2);
        
        if (jumps.length > 0) {
            // 2. Multi-jumps
            const multiJumps = jumps.filter(m => {
                const piece = board[m.fromR][m.fromC];
                const capturedR = (m.fromR + m.toR) / 2;
                const capturedC = (m.fromC + m.toC) / 2;
                const capturedPiece = board[capturedR][capturedC];

                // Simulate move
                board[m.toR][m.toC] = piece;
                board[m.fromR][m.fromC] = 0;
                board[capturedR][capturedC] = 0;

                const canChain = canJumpFrom(m.toR, m.toC);

                // Restore board
                board[m.fromR][m.fromC] = piece;
                board[m.toR][m.toC] = 0;
                board[capturedR][capturedC] = capturedPiece;

                return canChain;
            });

            if (multiJumps.length > 0) {
                bestMoves = multiJumps;
            } else {
                // 3. Single Jumps
                bestMoves = jumps;
            }
        } else {
            // 4. Random Moves
            bestMoves = moves;
        }
    }

    if (bestMoves.length > 0) {
        const move = bestMoves[Math.floor(Math.random() * bestMoves.length)];
        selectedRow = move.fromR;
        selectedCol = move.fromC;
        movePiece(move.toR, move.toC);
        renderBoard();

        if (chainJumpInProgress) {
            setTimeout(makeComputerMove, 500);
        }
    }
}

function getMovesForPiece(r, c) {
    const moves = [];
    const originalSelR = selectedRow;
    const originalSelC = selectedCol;
    
    selectedRow = r;
    selectedCol = c;
    
    const deltas = [
        {dr: 1, dc: 1}, {dr: 1, dc: -1}, {dr: -1, dc: 1}, {dr: -1, dc: -1},
        {dr: 2, dc: 2}, {dr: 2, dc: -2}, {dr: -2, dc: 2}, {dr: -2, dc: -2}
    ];

    for (const d of deltas) {
        const nr = r + d.dr;
        const nc = c + d.dc;
        if (nr >= 0 && nr < 8 && nc >= 0 && nc < 8 && isValidMove(nr, nc)) {
            moves.push({fromR: r, fromC: c, toR: nr, toC: nc});
        }
    }

    selectedRow = originalSelR;
    selectedCol = originalSelC;
    return moves;
}

boardElement.addEventListener('click', handleSquareClick);

initializeBoard();
renderBoard();
