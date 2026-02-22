'use strict';

const titleElement = document.querySelector('h1');

// --- Constants ---
const BOARD_SIZE = 8;
const PIECES = { EMPTY: 0, RED: 1, BLACK: 2, RED_KING: 3, BLACK_KING: 4 };

const LABELS = {
    TITLE: "John Garvey's<br>Checkers Game",
    ME: "Me",
    YOU: "You",
    RED: "Red",
    BLACK: "Black",
    JOHN: "John",
    BTN_DISABLE: "Disable NPC (Me)",
    BTN_ENABLE: "Enable NPC (Me)",
    BTN_RESET: "Reset Game",
    BTN_RESET_SCORE: "Reset Score",
    SCOREBOARD: "SCOREBOARD",
    WIN_YOU: "You Win!",
    WIN_JOHN: "John Wins!",
    STATUS_YOUR: "Your Turn",
    STATUS_MY: "My Turn",
    STATUS_RED: "Red's Turn",
    STATUS_BLACK: "Black's Turn",
    STATUS_STILL_YOUR: "Still Your Turn",
    STATUS_STILL_MY: "Still My Turn",
    STATUS_STILL_RED: "Still Red's Turn",
    STATUS_STILL_BLACK: "Still Black's Turn"
};

const THEME = {
    SELECTION: '#ffeb3b',
    SCORE_DIGIT: '#ff0000',
    SCORE_BG: '#000',
    SCORE_BORDER: '#333',
    SCORE_CONTAINER_BG: '#111',
    SCORE_CONTAINER_BORDER: '#333',
    SCORE_TEXT: '#fff',
    SCORE_TITLE_BORDER: '#555',
    BUTTON_START: '#444',
    BUTTON_END: '#222',
    BUTTON_BORDER: '#555',
    BUTTON_HOVER_START: '#555',
    BUTTON_HOVER_END: '#333',
    RESET_SCORE_BTN_BG: '#333',
    RESET_SCORE_BTN_BORDER: '#555',
    RESET_SCORE_BTN_HOVER: '#444',
    RESET_SCORE_BTN_TEXT: '#fff',
    PROFILE_BORDER_ACTIVE: 'black',
    PROFILE_BORDER_INACTIVE: 'white',
    CAPTURED_BG: 'rgba(0,0,0,0.15)',
    CAPTURED_BORDER: '#555',
    SOCIAL_ICON: 'black',
    SOCIAL_ICON_OPACITY: '0.6',
    SOCIAL_ICON_HOVER_OPACITY: '1',
    CONFETTI: ['#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5', '#2196f3', '#03a9f4', '#00bcd4', '#009688', '#4caf50', '#8bc34a', '#cddc39', '#ffeb3b', '#ffc107', '#ff9800', '#ff5722']
};

const CSS_CLASSES = {
    SQUARE: 'square',
    LIGHT: 'light',
    DARK: 'dark',
    PIECE: 'piece',
    RED: 'red',
    BLACK: 'black',
    KING: 'king',
    SELECTED: 'selected'
};

const GAME_CONFIG = {
    CPU_MOVE_DELAY: 500,
    WINNER_DISPLAY_TIME: 3000,
    CONFETTI_COUNT: 300,
    NOTE_DELAY: 100
};

const AUDIO_CONFIG = {
    MOVE: { type: 'triangle', freq: 150, duration: 0.1, volStart: 0.3, volEnd: 0.01, freqEnd: 40 },
    CAPTURE: { type: 'triangle', freq: 400, duration: 0.15, volStart: 0.2, volEnd: 0.01, freqEnd: 100 },
    KING_NOTES: [523.25, 659.25, 783.99, 1046.50],
    WIN_NOTES: [523.25, 659.25, 783.99, 1046.50, 783.99, 1046.50]
};

const SOCIAL_LINKS = [
    { url: "https://www.linkedin.com/in/john-s-garvey/", path: "M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" },
    { url: "https://github.com/jgarvey928", path: "M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.419-1.305.763-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" },
    { url: "https://jgarvey928.github.io/jsgarveyportfolio.io/", path: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" }
];

if (titleElement) titleElement.innerHTML = LABELS.TITLE;

// Ensure viewport allows zooming and scrolling on mobile devices
let viewportMeta = document.querySelector('meta[name="viewport"]');
if (!viewportMeta) {
    viewportMeta = document.createElement('meta');
    viewportMeta.name = "viewport";
    document.head.appendChild(viewportMeta);
}
viewportMeta.content = "width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes";
document.body.style.touchAction = "manipulation";
document.body.style.overflow = "auto";

// --- Global State ---
let board = [];
let selectedRow = -1;
let selectedCol = -1;
let isRedTurn = true;
let chainJumpInProgress = false;
let isSinglePlayer = true;
let blackWins = 0;
let redWins = 0;

// --- Helper Functions ---
function createElement(tag, parent, options = {}) {
    const el = document.createElement(tag);
    if (options.className) el.className = options.className;
    if (options.text) el.textContent = options.text;
    if (options.cssText) el.style.cssText = options.cssText;
    if (options.attrs) {
        Object.entries(options.attrs).forEach(([key, value]) => el.setAttribute(key, value));
    }
    if (parent) parent.appendChild(el);
    return el;
}

function createButton(text, onClick) {
    const btn = createElement('button', null, {
        text: text,
        cssText: `display: block; margin: 2px auto; padding: 10px 5px; width: 185px; box-sizing: border-box; font-size: 14px; font-weight: bold; cursor: pointer; background: linear-gradient(to bottom, ${THEME.BUTTON_START}, ${THEME.BUTTON_END}); color: white; border: 2px solid ${THEME.BUTTON_BORDER}; border-radius: 25px; box-shadow: 0 4px 6px rgba(0,0,0,0.3); transition: all 0.2s ease;`
    });
    btn.addEventListener('mouseover', () => {
        btn.style.transform = 'translateY(-2px)';
        btn.style.boxShadow = '0 6px 12px rgba(0,0,0,0.4)';
        btn.style.background = `linear-gradient(to bottom, ${THEME.BUTTON_HOVER_START}, ${THEME.BUTTON_HOVER_END})`;
    });
    btn.addEventListener('mouseout', () => {
        btn.style.transform = 'translateY(0)';
        btn.style.boxShadow = '0 4px 6px rgba(0,0,0,0.3)';
        btn.style.background = `linear-gradient(to bottom, ${THEME.BUTTON_START}, ${THEME.BUTTON_END})`;
    });
    if (onClick) btn.addEventListener('click', onClick);
    return btn;
}

const isRedPiece = (piece) => piece === PIECES.RED || piece === PIECES.RED_KING;
const isKing = (piece) => piece === PIECES.RED_KING || piece === PIECES.BLACK_KING;
const isValidPos = (row, col) => row >= 0 && row < BOARD_SIZE && col >= 0 && col < BOARD_SIZE;

function getAllowedDirections(piece) {
    const directions = [];
    if (isRedPiece(piece) || isKing(piece)) directions.push({rowOffset: -1, colOffset: -1}, {rowOffset: -1, colOffset: 1});
    if (!isRedPiece(piece) || isKing(piece)) directions.push({rowOffset: 1, colOffset: -1}, {rowOffset: 1, colOffset: 1});
    return directions;
}

// --- UI Setup ---
const boardElement = document.getElementById('board');
const winnerOverlay = document.getElementById('winner-overlay');
const winnerMessage = document.getElementById('winner-message');

if (!boardElement || !winnerOverlay || !winnerMessage) {
    console.error("Critical DOM elements missing. Game cannot initialize.");
    throw new Error("Initialization failed: Missing DOM elements");
}

const statusElement = createElement('div', null, {
    className: 'status-indicator',
    cssText: "padding: 8px 5px; width: 185px; box-sizing: border-box;"
});

const singlePlayerButton = createButton(LABELS.BTN_DISABLE); // Event listener added later to access other elements
const resetButton = createButton(LABELS.BTN_RESET, resetGame);

let container = boardElement;
while (container.parentNode && container.parentNode !== document.body) {
    container = container.parentNode;
}

const gameLayout = createElement('div', null, { cssText: "position: relative; display: inline-block;" });

const profileGroup = createElement('div', gameLayout, {
    cssText: "display: flex; flex-direction: column; align-items: center; gap: 10px; position: absolute; right: 100%; top: -170px; margin-right: 40px; width: max-content;"
});

const controlsGroup = createElement('div', gameLayout, {
    cssText: "display: flex; flex-direction: column; gap: 2px; position: absolute; right: 100%; top: 18px; margin-right: 35px; width: max-content;"
});

document.body.insertBefore(gameLayout, container);
gameLayout.appendChild(container);

const scoreGroup = createElement('div', gameLayout, {
    cssText: `display: flex; flex-direction: column; align-items: center; gap: 15px; position: absolute; left: 100%; top: 20px; margin-left: 35px; width: 110px; padding: 30px 10px; background-color: ${THEME.SCORE_CONTAINER_BG}; border: 4px solid ${THEME.SCORE_CONTAINER_BORDER}; border-radius: 6px; box-shadow: 0 4px 12px rgba(0,0,0,0.5); font-family: 'Courier New', Courier, monospace; color: ${THEME.SCORE_TEXT};`
});

createElement('div', scoreGroup, {
    text: LABELS.SCOREBOARD,
    cssText: `font-weight: bold; font-size: 14px; text-decoration: none; border-bottom: 1px solid ${THEME.SCORE_TITLE_BORDER}; padding-bottom: 5px; margin-bottom: 5px; letter-spacing: 1px;`
});

const topLabel = createElement('div', scoreGroup, {
    text: isSinglePlayer ? LABELS.ME : LABELS.BLACK,
    cssText: "font-weight: bold; font-size: 18px;"
});

const scoreDisplayCss = `font-size: 42px; font-family: 'Courier New', monospace; font-weight: bold; color: ${THEME.SCORE_DIGIT}; background-color: ${THEME.SCORE_BG}; padding: 5px 15px; border: 4px solid ${THEME.SCORE_BORDER}; border-radius: 4px; box-shadow: inset 0 0 10px ${THEME.SCORE_BG}; text-shadow: 0 0 5px ${THEME.SCORE_DIGIT}, 0 0 10px ${THEME.SCORE_DIGIT}; min-width: 50px; text-align: center; letter-spacing: 2px;`;

const topScoreDisplay = createElement('div', scoreGroup, {
    text: "0",
    cssText: scoreDisplayCss + " margin-bottom: 10px;"
});

const bottomLabel = createElement('div', scoreGroup, {
    text: isSinglePlayer ? LABELS.YOU : LABELS.RED,
    cssText: "font-weight: bold; font-size: 18px;"
});

const bottomScoreDisplay = createElement('div', scoreGroup, {
    text: "0",
    cssText: scoreDisplayCss
});

const resetScoreButton = createElement('button', scoreGroup, {
    text: LABELS.BTN_RESET_SCORE,
    cssText: `margin-top: 15px; padding: 8px 12px; background: ${THEME.RESET_SCORE_BTN_BG}; color: ${THEME.RESET_SCORE_BTN_TEXT}; border: 1px solid ${THEME.RESET_SCORE_BTN_BORDER}; cursor: pointer; font-family: inherit; font-weight: bold; font-size: 12px; border-radius: 2px; transition: all 0.2s;`
});
resetScoreButton.addEventListener('mouseover', () => resetScoreButton.style.backgroundColor = THEME.RESET_SCORE_BTN_HOVER);
resetScoreButton.addEventListener('mouseout', () => resetScoreButton.style.backgroundColor = THEME.RESET_SCORE_BTN_BG);

resetScoreButton.addEventListener('click', () => {
    blackWins = 0;
    redWins = 0;
    topScoreDisplay.textContent = "0";
    bottomScoreDisplay.textContent = "0";
});

const profileLink = createElement('a', profileGroup, {
    attrs: { href: "https://www.linkedin.com/in/john-s-garvey/", target: "_blank" },
    cssText: "display: block; width: 140px; height: 140px; margin: 0 auto 10px auto; cursor: pointer;"
});

const profilePic = createElement('img', profileLink, {
    attrs: { src: 'JGarvey_Prof_Profile.jpg' },
    cssText: `width: 100%; height: 100%; border-radius: 50%; border: 4px solid ${THEME.PROFILE_BORDER_ACTIVE}; box-shadow: 0 4px 8px rgba(0,0,0,0.5); object-fit: cover; transition: transform 0.3s ease;`
});
profilePic.addEventListener('mouseover', () => profilePic.style.transform = 'scale(1.1)');
profilePic.addEventListener('mouseout', () => profilePic.style.transform = 'scale(1)');

controlsGroup.appendChild(statusElement);
controlsGroup.appendChild(singlePlayerButton);
controlsGroup.appendChild(resetButton);

const capturedContainer = createElement('div', gameLayout, {
    cssText: "display: flex; flex-direction: column; gap: 5px; position: absolute; right: 100%; bottom: 25px; margin-right: 10px;"
});

const capturedStyle = `display: grid; grid-template-columns: repeat(4, 50px); grid-template-rows: repeat(3, 30px); gap: 5px; padding: 10px; justify-items: center; background-color: ${THEME.CAPTURED_BG}; border-radius: 8px; border: 1px solid ${THEME.CAPTURED_BORDER};`;
const blackCaptured = createElement('div', capturedContainer, { cssText: capturedStyle });
const redCaptured = createElement('div', capturedContainer, { cssText: capturedStyle });

const socialContainer = createElement('div', profileGroup, {
    cssText: "display: flex; justify-content: center; gap: 5px;"
});

SOCIAL_LINKS.forEach(linkData => {
    const link = createElement('a', socialContainer, {
        attrs: { href: linkData.url, target: "_blank" },
        cssText: `display: inline-block; margin: 0 10px; color: ${THEME.SOCIAL_ICON}; opacity: ${THEME.SOCIAL_ICON_OPACITY}; transition: opacity 0.2s; vertical-align: middle;`
    });
    
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("width", "32");
    svg.setAttribute("height", "32");
    svg.style.fill = "currentColor";
    
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", linkData.path);
    
    svg.appendChild(path);
    link.appendChild(svg);
    
    link.addEventListener('mouseover', () => link.style.opacity = THEME.SOCIAL_ICON_HOVER_OPACITY);
    link.addEventListener('mouseout', () => link.style.opacity = THEME.SOCIAL_ICON_OPACITY);
});

singlePlayerButton.addEventListener('click', () => {
    isSinglePlayer = !isSinglePlayer;
    singlePlayerButton.textContent = isSinglePlayer ? LABELS.BTN_DISABLE : LABELS.BTN_ENABLE;
    profilePic.style.borderColor = isSinglePlayer ? THEME.PROFILE_BORDER_ACTIVE : THEME.PROFILE_BORDER_INACTIVE;
    topLabel.textContent = isSinglePlayer ? LABELS.ME : LABELS.BLACK;
    bottomLabel.textContent = isSinglePlayer ? LABELS.YOU : LABELS.RED;
    if (isSinglePlayer && !isRedTurn) {
        setTimeout(makeComputerMove, GAME_CONFIG.CPU_MOVE_DELAY);
    }
    updateStatus();
});

// --- Core Game Logic ---
/**
 * Initializes the game board grid and places pieces in starting positions.
 */
function initializeBoard() {
    board = Array.from({ length: BOARD_SIZE }, (_, row) => 
        Array.from({ length: BOARD_SIZE }, (_, col) => {
            if ((row + col) % 2 === 0) return PIECES.EMPTY;
            if (row < 3) return PIECES.BLACK;
            if (row > 4) return PIECES.RED;
            return PIECES.EMPTY;
        })
    );
}

/**
 * Determines if a move to the specified coordinates is valid.
 * @param {number} row - The target row.
 * @param {number} col - The target column.
 * @returns {boolean} True if the move is allowed.
 */
function isValidMove(row, col) {
    if (board[row][col] !== PIECES.EMPTY || (row + col) % 2 === 0) {
        return false;
    }

    const piece = board[selectedRow][selectedCol];
    const king = isKing(piece);
    const rowDiff = Math.abs(row - selectedRow);
    const colDiff = Math.abs(col - selectedCol);

    if (!king) {
        if (isRedTurn && row > selectedRow) return false;
        if (!isRedTurn && row < selectedRow) return false;
    }

    if (chainJumpInProgress) {
        return rowDiff === 2 && colDiff === 2 && isJump(row, col);
    }

    if (rowDiff === 1 && colDiff === 1) {
        if (king) return true;
        return isRedTurn ? row < selectedRow : row > selectedRow;
    } else if (rowDiff === 2 && colDiff === 2) {
        return isJump(row, col);
    }

    return false;
}

/**
 * Checks if a move is a capturing jump.
 * @param {number} row - The target row.
 * @param {number} col - The target column.
 * @returns {boolean} True if the move captures an opponent piece.
 */
function isJump(row, col) {
    const jumpedRow = (row + selectedRow) / 2;
    const jumpedCol = (col + selectedCol) / 2;
    const jumpedPiece = board[jumpedRow][jumpedCol];

    return jumpedPiece !== PIECES.EMPTY && isRedTurn !== isRedPiece(jumpedPiece);
}

/**
 * Checks if a piece at the given position can make a capturing jump.
 * @param {number} row - Row of the piece.
 * @param {number} col - Column of the piece.
 * @returns {boolean} True if a jump is possible.
 */
function canJumpFrom(row, col) {
    const piece = board[row][col];
    if (piece === PIECES.EMPTY) return false;
    
    const directions = getAllowedDirections(piece);

    for (const direction of directions) {
        const jumpRow = row + direction.rowOffset * 2;
        const jumpCol = col + direction.colOffset * 2;
        if(isValidPos(jumpRow, jumpCol) && board[jumpRow][jumpCol] === PIECES.EMPTY) {
            const capturedRow = row + direction.rowOffset;
            const capturedCol = col + direction.colOffset;
            const jumpedPiece = board[capturedRow][capturedCol];
            if (jumpedPiece !== PIECES.EMPTY && isRedPiece(piece) !== isRedPiece(jumpedPiece)) {
                return true;
            }
        }
    }
    
    return false;
}

/**
 * Checks if the current player has any valid moves available.
 * @param {boolean} isRed - True if checking for Red player, false for Black.
 * @returns {boolean} True if at least one valid move exists.
 */
function hasAnyValidMoves(isRed) {
    for (let row = 0; row < BOARD_SIZE; row++) {
        for (let col = 0; col < BOARD_SIZE; col++) {
            const piece = board[row][col];
            if (piece === PIECES.EMPTY) continue;

            const red = isRedPiece(piece);
            if (red !== isRed) continue;

            if (canJumpFrom(row, col)) return true;

            const directions = getAllowedDirections(piece);

            for (const direction of directions) {
                const targetRow = row + direction.rowOffset;
                const targetCol = col + direction.colOffset;
                if (isValidPos(targetRow, targetCol) && board[targetRow][targetCol] === PIECES.EMPTY) {
                    return true;
                }
            }
        }
    }
    return false;
}

// --- Game Actions ---
/**
 * Executes a move, updates the board, handles captures and promotions.
 * @param {number} row - Target row.
 * @param {number} col - Target column.
 */
function movePiece(row, col) {
    const piece = board[selectedRow][selectedCol];
    board[selectedRow][selectedCol] = PIECES.EMPTY;
    board[row][col] = piece;

    // King promotion
    let promoted = false;
    if (piece === PIECES.RED && row === 0) {
        board[row][col] = PIECES.RED_KING;
        promoted = true;
    } else if (piece === PIECES.BLACK && row === BOARD_SIZE - 1) {
        board[row][col] = PIECES.BLACK_KING;
        promoted = true;
    }

    const rowDiff = Math.abs(row - selectedRow);
    if (rowDiff === 2) {
        const jumpedRow = (row + selectedRow) / 2;
        const jumpedCol = (col + selectedCol) / 2;
        const jumpedPiece = board[jumpedRow][jumpedCol];
        board[jumpedRow][jumpedCol] = PIECES.EMPTY;
        addCapturedPiece(jumpedPiece);

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

    if (promoted) {
        playSound('king');
    } else if (rowDiff === 2) {
        playSound('capture');
    } else {
        playSound('move');
    }

    if (!chainJumpInProgress) {
        isRedTurn = !isRedTurn;
        selectedRow = -1;
        selectedCol = -1;
        if (isSinglePlayer && !isRedTurn) {
            setTimeout(makeComputerMove, GAME_CONFIG.CPU_MOVE_DELAY);
        }
    }

    checkWinner();
}

/**
 * Checks for a win condition (no pieces left or no moves left).
 */
function checkWinner() {
    const pieces = board.flat();
    const redHasPieces = pieces.some(isRedPiece);
    const blackHasPieces = pieces.some(piece => piece !== PIECES.EMPTY && !isRedPiece(piece));

    let winner = null;
    if (!redHasPieces) {
        winner = LABELS.BLACK;
    } else if (!blackHasPieces) {
        winner = LABELS.RED;
    } else if (!hasAnyValidMoves(isRedTurn)) {
        winner = isRedTurn ? LABELS.BLACK : LABELS.RED;
    }

    if (winner) {
        if (winner === LABELS.BLACK) {
            blackWins++;
            topScoreDisplay.textContent = blackWins;
        } else {
            redWins++;
            bottomScoreDisplay.textContent = redWins;
        }
        playSound('win');
        startConfetti();
        if (isSinglePlayer) {
            winnerMessage.textContent = (winner === LABELS.RED) ? LABELS.WIN_YOU : LABELS.WIN_JOHN;
        } else {
            winnerMessage.textContent = `${winner} wins!`;
        }
        winnerOverlay.style.display = 'flex';
        setTimeout(() => {
            winnerOverlay.style.display = 'none';
            resetGame();
        }, GAME_CONFIG.WINNER_DISPLAY_TIME);
    }
}

/**
 * Resets the game state to the initial setup.
 */
function resetGame() {
    stopConfetti();
    blackCaptured.innerHTML = '';
    redCaptured.innerHTML = '';
    initializeBoard();
    isRedTurn = true;
    selectedRow = -1;
    selectedCol = -1;
    chainJumpInProgress = false;
    renderBoard();
}

/**
 * Updates the status text indicator.
 */
function updateStatus() {
    if (chainJumpInProgress) {
        if (isSinglePlayer) {
            statusElement.textContent = isRedTurn ? LABELS.STATUS_STILL_YOUR : LABELS.STATUS_STILL_MY;
        } else {
            statusElement.textContent = isRedTurn ? LABELS.STATUS_STILL_RED : LABELS.STATUS_STILL_BLACK;
        }
    } else {
        if (isSinglePlayer) {
            statusElement.textContent = isRedTurn ? LABELS.STATUS_YOUR : LABELS.STATUS_MY;
        } else {
            statusElement.textContent = isRedTurn ? LABELS.STATUS_RED : LABELS.STATUS_BLACK;
        }
    }
}

// --- AI Logic ---
/**
 * Executes the computer's turn logic.
 */
function makeComputerMove() {
    try {
        if (isRedTurn) return;

        const moves = getAllCPUMoves();
        if (moves.length === 0) return;

        const bestMoves = getBestCPUMoves(moves);

        if (bestMoves.length > 0) {
            const move = bestMoves[Math.floor(Math.random() * bestMoves.length)];
            selectedRow = move.fromRow;
            selectedCol = move.fromCol;
            movePiece(move.toRow, move.toCol);
            renderBoard();

            if (chainJumpInProgress) {
                setTimeout(makeComputerMove, GAME_CONFIG.CPU_MOVE_DELAY);
            }
        }
    } catch (error) {
        console.error("Error in CPU move:", error);
    }
}

/**
 * Retrieves all possible moves for the computer player.
 * @returns {Array} List of valid move objects.
 */
function getAllCPUMoves() {
    if (chainJumpInProgress) {
        return getMovesForPiece(selectedRow, selectedCol);
    }
    
    let moves = [];
    for (let row = 0; row < BOARD_SIZE; row++) {
        for (let col = 0; col < BOARD_SIZE; col++) {
            if (board[row][col] === PIECES.BLACK || board[row][col] === PIECES.BLACK_KING) {
                moves = moves.concat(getMovesForPiece(row, col));
            }
        }
    }
    return moves;
}

/**
 * Filters moves to find the best options (promotions, jumps).
 * @param {Array} moves - List of available moves.
 * @returns {Array} List of best move objects.
 */
function getBestCPUMoves(moves) {
    // 1. King Promotion
    const promotionMoves = moves.filter(move => {
        const piece = board[move.fromRow][move.fromCol];
        return piece === PIECES.BLACK && move.toRow === BOARD_SIZE - 1;
    });
    if (promotionMoves.length > 0) return promotionMoves;

    const jumps = moves.filter(move => Math.abs(move.fromRow - move.toRow) === 2);
    if (jumps.length === 0) return moves; // No jumps, return all moves (Random Moves)

    // 2. Multi-jumps
    const multiJumps = jumps.filter(canChainJumpAfterMove);
    if (multiJumps.length > 0) return multiJumps;
    
    // 3. Single Jumps
    return jumps;
}

/**
 * Simulates a move to check if it leads to a chain jump.
 * @param {Object} move - The move object to simulate.
 * @returns {boolean} True if a subsequent jump is possible.
 */
function canChainJumpAfterMove(move) {
    const piece = board[move.fromRow][move.fromCol];
    const capturedRow = (move.fromRow + move.toRow) / 2;
    const capturedCol = (move.fromCol + move.toCol) / 2;
    const capturedPiece = board[capturedRow][capturedCol];

    // Simulate move
    board[move.toRow][move.toCol] = piece;
    board[move.fromRow][move.fromCol] = PIECES.EMPTY;
    board[capturedRow][capturedCol] = PIECES.EMPTY;

    const canChain = canJumpFrom(move.toRow, move.toCol);

    // Restore board
    board[move.fromRow][move.fromCol] = piece;
    board[move.toRow][move.toCol] = PIECES.EMPTY;
    board[capturedRow][capturedCol] = capturedPiece;

    return canChain;
}

/**
 * Calculates all valid moves for a specific piece.
 * @param {number} row - Row of the piece.
 * @param {number} col - Column of the piece.
 * @returns {Array} List of valid moves.
 */
function getMovesForPiece(row, col) {
    const moves = [];
    const originalSelR = selectedRow;
    const originalSelC = selectedCol;
    
    selectedRow = row;
    selectedCol = col;
    
    const deltas = [
        {rowOffset: 1, colOffset: 1}, {rowOffset: 1, colOffset: -1}, {rowOffset: -1, colOffset: 1}, {rowOffset: -1, colOffset: -1},
        {rowOffset: 2, colOffset: 2}, {rowOffset: 2, colOffset: -2}, {rowOffset: -2, colOffset: 2}, {rowOffset: -2, colOffset: -2}
    ];

    for (const delta of deltas) {
        const targetRow = row + delta.rowOffset;
        const targetCol = col + delta.colOffset;
        if (isValidPos(targetRow, targetCol) && isValidMove(targetRow, targetCol)) {
            moves.push({fromRow: row, fromCol: col, toRow: targetRow, toCol: targetCol});
        }
    }

    selectedRow = originalSelR;
    selectedCol = originalSelC;
    return moves;
}

// --- UI Rendering & Interaction ---
/**
 * Renders the game board DOM based on the current state.
 */
function renderBoard() {
    boardElement.innerHTML = '';
    for (let row = 0; row < BOARD_SIZE; row++) {
        for (let col = 0; col < BOARD_SIZE; col++) {
            const square = createElement('div', boardElement, {
                className: `${CSS_CLASSES.SQUARE} ${(row + col) % 2 === 0 ? CSS_CLASSES.LIGHT : CSS_CLASSES.DARK}`,
                attrs: { 'data-row': row, 'data-col': col }
            });

            const piece = board[row][col];
            if (piece !== PIECES.EMPTY) {
                const classes = [CSS_CLASSES.PIECE, isRedPiece(piece) ? CSS_CLASSES.RED : CSS_CLASSES.BLACK];
                if (isKing(piece)) classes.push(CSS_CLASSES.KING);
                createElement('div', square, { className: classes.join(' ') });
            }
            
            if (row === selectedRow && col === selectedCol) {
                square.classList.add(CSS_CLASSES.SELECTED);
                square.style.boxShadow = `inset 0 0 20px ${THEME.SELECTION}, 0 0 15px ${THEME.SELECTION}`;
                square.style.border = `2px solid ${THEME.SELECTION}`;
                square.style.transform = 'scale(1.1)';
                square.style.zIndex = '10';
                square.style.transition = 'all 0.2s ease';
            }

            boardElement.appendChild(square);
        }
    }
    updateStatus();
}

/**
 * Adds a captured piece to the side container.
 * @param {number} piece - The piece value.
 */
function addCapturedPiece(piece) {
    const classes = [CSS_CLASSES.PIECE, isRedPiece(piece) ? CSS_CLASSES.RED : CSS_CLASSES.BLACK];
    if (isKing(piece)) classes.push(CSS_CLASSES.KING);

    const pieceElement = createElement('div', null, {
        className: classes.join(' '),
        cssText: "width: 30px; height: 30px; margin: 0; font-size: 14px; cursor: default; box-shadow: inset 0 0 0 2px rgba(0,0,0,0.2), inset 0 0 0 4px rgba(255,255,255,0.1);"
    });
    
    (isRedPiece(piece) ? redCaptured : blackCaptured).appendChild(pieceElement);
}

/**
 * Handles click events on the game board squares.
 * @param {Event} event - The click event.
 */
function handleSquareClick(event) {
    try {
        if (isSinglePlayer && !isRedTurn) return;

        const square = event.target.closest('.' + CSS_CLASSES.SQUARE);
        if (!square) return;

        const row = parseInt(square.dataset.row);
        const col = parseInt(square.dataset.col);

        if (chainJumpInProgress) {
            if (isValidMove(row, col)) {
                movePiece(row, col);
            }
        } else if (selectedRow === -1) {
            if (board[row][col] !== PIECES.EMPTY && isRedTurn === isRedPiece(board[row][col])) {
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
        renderBoard();
    } catch (error) {
        console.error("Error handling square click:", error);
    }
}

// --- Audio System ---
let audioCtx;
try {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
} catch (e) {
    console.warn("Web Audio API is not supported in this browser.");
}

/**
 * Plays a synthesized tone using the Web Audio API.
 * @param {string} type - Oscillator type (sine, square, triangle, sawtooth).
 * @param {number} freq - Frequency in Hz.
 * @param {number} duration - Duration in seconds.
 * @param {number} volStart - Starting volume.
 * @param {number} volEnd - Ending volume.
 * @param {number} [freqEnd] - Optional ending frequency for ramps.
 */
function playTone(type, freq, duration, volStart = 0.1, volEnd = 0.01, freqEnd = null) {
    if (!audioCtx) return;
    try {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.type = type;
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
        if (freqEnd) osc.frequency.exponentialRampToValueAtTime(freqEnd, audioCtx.currentTime + duration);
        
        gain.gain.setValueAtTime(volStart, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(volEnd, audioCtx.currentTime + duration);
        
        osc.start(audioCtx.currentTime);
        osc.stop(audioCtx.currentTime + duration);
    } catch (error) {
        console.error("Error playing tone:", error);
    }
}

/**
 * Triggers a predefined sound effect.
 * @param {string} type - The type of sound ('move', 'capture', 'king', 'win').
 */
function playSound(type) {
    if (!audioCtx) return;
    if (audioCtx.state === 'suspended') {
        audioCtx.resume().catch(e => console.warn("Audio resume failed:", e));
    }
    
    if (type === 'move') {
        playTone(AUDIO_CONFIG.MOVE.type, AUDIO_CONFIG.MOVE.freq, AUDIO_CONFIG.MOVE.duration, AUDIO_CONFIG.MOVE.volStart, AUDIO_CONFIG.MOVE.volEnd, AUDIO_CONFIG.MOVE.freqEnd);
    } else if (type === 'capture') {
        playTone(AUDIO_CONFIG.CAPTURE.type, AUDIO_CONFIG.CAPTURE.freq, AUDIO_CONFIG.CAPTURE.duration, AUDIO_CONFIG.CAPTURE.volStart, AUDIO_CONFIG.CAPTURE.volEnd, AUDIO_CONFIG.CAPTURE.freqEnd);
    } else if (type === 'king') {
        AUDIO_CONFIG.KING_NOTES.forEach((freq, i) => {
            setTimeout(() => playTone('triangle', freq, 0.3, 0.05, 0.001), i * GAME_CONFIG.NOTE_DELAY);
        });
    } else if (type === 'win') {
        // Retro 8-Bit Celebration
        AUDIO_CONFIG.WIN_NOTES.forEach((freq, i) => {
            setTimeout(() => playTone('square', freq, 0.1, 0.1, 0.01), i * GAME_CONFIG.NOTE_DELAY);
        });
    }
}

// --- Visual Effects ---
const confettiCanvas = createElement('canvas', document.body, {
    cssText: "position: fixed; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: 9999;"
});
const ctx = confettiCanvas.getContext('2d');
let confettiParticles = [];
let confettiAnimationId;

/**
 * Starts the confetti celebration effect.
 */
function startConfetti() {
    confettiCanvas.width = window.innerWidth;
    confettiCanvas.height = window.innerHeight;
    confettiParticles = [];
    
    for (let i = 0; i < GAME_CONFIG.CONFETTI_COUNT; i++) {
        confettiParticles.push({
            x: Math.random() * confettiCanvas.width,
            y: Math.random() * confettiCanvas.height - confettiCanvas.height,
            color: THEME.CONFETTI[Math.floor(Math.random() * THEME.CONFETTI.length)],
            size: Math.random() * 10 + 5,
            speedY: Math.random() * 3 + 2,
            speedX: Math.random() * 2 - 1,
            rotation: Math.random() * 360,
            rotationSpeed: Math.random() * 10 - 5
        });
    }
    animateConfetti();
}

/**
 * Animates the confetti particles.
 */
function animateConfetti() {
    ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
    confettiParticles.forEach(particle => {
        particle.y += particle.speedY;
        particle.x += particle.speedX;
        particle.rotation += particle.rotationSpeed;
        
        if (particle.y > confettiCanvas.height) particle.y = -10;
        
        ctx.save();
        ctx.translate(particle.x, particle.y);
        ctx.rotate(particle.rotation * Math.PI / 180);
        ctx.fillStyle = particle.color;
        ctx.fillRect(-particle.size / 2, -particle.size / 2, particle.size, particle.size);
        ctx.restore();
    });
    confettiAnimationId = requestAnimationFrame(animateConfetti);
}

/**
 * Stops the confetti animation and clears the canvas.
 */
function stopConfetti() {
    cancelAnimationFrame(confettiAnimationId);
    ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
}

boardElement.addEventListener('click', handleSquareClick);

// --- Initialization ---
try {
    initializeBoard();
    renderBoard();
} catch (error) {
    console.error("Game initialization failed:", error);
}
