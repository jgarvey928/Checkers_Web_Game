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

const socialContainer = document.createElement('div');
socialContainer.style.cssText = "position: absolute; top: 20px; right: 20px; z-index: 100;";

const createIcon = (url, pathData) => {
    const link = document.createElement('a');
    link.href = url;
    link.target = "_blank";
    link.style.cssText = "display: inline-block; margin: 0 10px; color: black; opacity: 0.6; transition: opacity 0.2s; vertical-align: middle;";
    
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("width", "24");
    svg.setAttribute("height", "24");
    svg.style.fill = "currentColor";
    
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", pathData);
    
    svg.appendChild(path);
    link.appendChild(svg);
    
    link.addEventListener('mouseover', () => link.style.opacity = "1");
    link.addEventListener('mouseout', () => link.style.opacity = "0.6");
    
    return link;
};

socialContainer.appendChild(createIcon("https://www.linkedin.com/in/john-s-garvey/", "M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"));
socialContainer.appendChild(createIcon("https://github.com/jgarvey928", "M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.419-1.305.763-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"));
socialContainer.appendChild(createIcon("https://jgarvey928.github.io/jsgarveyportfolio.io/", "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"));

document.body.appendChild(socialContainer);

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
