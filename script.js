'use strict';

/**
 * @file script.js
 * @description The core logic and controller layer for the Checkers Web Application.
 * This file implements a Model-View-Controller (MVC) architectural pattern to separate
 * game rules, user interface rendering, artificial intelligence, and audio feedback.
 *
 * It utilizes modern JavaScript (ES6+) features including Classes, Arrow Functions,
 * and the Web Audio API for a rich, interactive user experience without external dependencies.
 *
 * @module CheckersGame
 * @requires window.AudioContext
 * @requires window.requestAnimationFrame
 *
 * @author John S. Garvey
 * @copyright 2023 John S. Garvey
 * @date October 2023
 */

// ==========================================
// Constants & Configuration
// ==========================================

/**
 * The dimension of the game board (8x8 grid).
 * @constant {number} BOARD_SIZE
 * @default 8
 */
const BOARD_SIZE = 8;

/**
 * Numeric representation of board pieces and states.
 * @readonly
 * @enum {number} PIECES
 */
const PIECES = { EMPTY: 0, RED: 1, BLACK: 2, RED_KING: 3, BLACK_KING: 4 };

/**
 * Text strings used throughout the user interface for localization and easy updates.
 * @readonly
 * @enum {string} LABELS
 */
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
    BTN_HELP: "Help",
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

/**
 * Color palette and visual configuration settings for the application.
 * @readonly
 * @enum {string|Array<string>} THEME
 */
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
    CONFETTI: [
        '#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5', '#2196f3', 
        '#03a9f4', '#00bcd4', '#009688', '#4caf50', '#8bc34a', '#cddc39', 
        '#ffeb3b', '#ffc107', '#ff9800', '#ff5722'
    ]
};

/**
 * CSS class names used for DOM manipulation and styling.
 * @readonly
 * @enum {string} CSS_CLASSES
 */
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

/**
 * Configuration settings for gameplay timing and visual effects.
 * @readonly
 * @type {Object<string, number>} GAME_CONFIG
 */
const GAME_CONFIG = {
    CPU_MOVE_DELAY: 500,
    WINNER_DISPLAY_TIME: 3000,
    CONFETTI_COUNT: 300,
    NOTE_DELAY: 100
};

/**
 * Configuration parameters for the Web Audio API synthesizer.
 * @readonly
 * @type {Object} AUDIO_CONFIG
 */
const AUDIO_CONFIG = {
    MOVE: { 
        type: 'triangle', freq: 150, duration: 0.1, 
        volStart: 0.3, volEnd: 0.01, freqEnd: 40 
    },
    CAPTURE: { 
        type: 'triangle', freq: 400, duration: 0.15, 
        volStart: 0.2, volEnd: 0.01, freqEnd: 100 
    },
    KING_NOTES: [523.25, 659.25, 783.99, 1046.50],
    WIN_NOTES: [523.25, 659.25, 783.99, 1046.50, 783.99, 1046.50]
};

/**
 * SVG path data for social icons.
 * @readonly
 * @enum {string} ICONS
 */
const ICONS = {
    LINKEDIN: "M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z",
    GITHUB: "M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.419-1.305.763-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12",
    CODE: "M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z",
    GLOBE: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"
};

/**
 * Data structure for profile social media links and their SVG icons.
 * @readonly
 * @type {Array<{url: string, path: string}>} SOCIAL_LINKS
 */
const SOCIAL_LINKS = [
    { label: "LinkedIn", url: "https://www.linkedin.com/in/john-s-garvey/", path: ICONS.LINKEDIN },
    { label: "GitHub Profile", url: "https://github.com/jgarvey928", path: ICONS.GITHUB },
    { label: "GitHub Repo", url: "https://github.com/jgarvey928/Checkers_Web_Game", path: ICONS.CODE },
    { label: "Portfolio", url: "https://jgarvey928.github.io/jsgarveyportfolio.io/", path: ICONS.GLOBE }
];

// ==========================================
// Utility Functions
// ==========================================

/**
 * Creates a new DOM element with the specified configuration and appends it to a parent.
 * This utility function abstracts the verbose DOM API for cleaner component creation.
 *
 * @param {string} tag - The HTML tag name to create (e.g., 'div', 'button').
 * @param {HTMLElement|null} parent - The parent DOM element to append the new element to. If null, the element is not appended.
 * @param {Object} [options={}] - Configuration options for the element.
 * @param {string} [options.className] - CSS class name(s) to apply.
 * @param {string} [options.text] - Text content to set for the element.
 * @param {string} [options.cssText] - Inline CSS styles to apply.
 * @param {Object.<string, string>} [options.attrs] - Key-value pairs of HTML attributes to set (e.g., { href: '#', target: '_blank' }).
 * @returns {HTMLElement} The newly created DOM element.
 */
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

/**
 * Creates a styled button element with hover effects and click handling.
 * Encapsulates the standard button styling and interaction logic used throughout the UI.
 *
 * @param {string} text - The text label to display on the button.
 * @param {Function} [onClick] - Optional callback function to execute when the button is clicked.
 * @returns {HTMLButtonElement} The configured button element.
 */
function createButton(text, onClick) {
    const btn = createElement('button', null, {
        text: text,
        cssText: `
            display: block; 
            margin: 2px auto; 
            padding: 10px 5px; 
            width: 185px; 
            box-sizing: border-box; 
            font-size: 14px; 
            font-weight: bold; 
            cursor: pointer; 
            background: linear-gradient(to bottom, ${THEME.BUTTON_START}, ${THEME.BUTTON_END}); 
            color: white; 
            border: 2px solid ${THEME.BUTTON_BORDER}; 
            border-radius: 25px; 
            box-shadow: 0 4px 6px rgba(0,0,0,0.3); 
            transition: all 0.2s ease;
        `
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

/**
 * Determines if a given piece belongs to the Red player.
 *
 * @param {PIECES} piece - The numeric representation of the piece.
 * @returns {boolean} True if the piece is RED or RED_KING; otherwise false.
 */
const isRedPiece = (piece) => piece === PIECES.RED || piece === PIECES.RED_KING;

/**
 * Determines if a given piece is a King (promoted).
 *
 * @param {PIECES} piece - The numeric representation of the piece.
 * @returns {boolean} True if the piece is RED_KING or BLACK_KING; otherwise false.
 */
const isKing = (piece) => piece === PIECES.RED_KING || piece === PIECES.BLACK_KING;

/**
 * Validates if the given coordinates are within the game board boundaries.
 *
 * @param {number} row - The row index to check.
 * @param {number} col - The column index to check.
 * @returns {boolean} True if the position is within the [0, BOARD_SIZE-1] range.
 */
const isValidPos = (row, col) => row >= 0 && row < BOARD_SIZE && col >= 0 && col < BOARD_SIZE;

/**
 * Retrieves the allowed movement directions for a specific piece type.
 * Regular pieces move forward diagonally; Kings move in all diagonal directions.
 *
 * @param {PIECES} piece - The numeric representation of the piece.
 * @returns {Array<{rowOffset: number, colOffset: number}>} Array of direction objects.
 */
function getAllowedDirections(piece) {
    const directions = [];
    if (isRedPiece(piece) || isKing(piece)) {
        directions.push({rowOffset: -1, colOffset: -1}, {rowOffset: -1, colOffset: 1});
    }
    if (!isRedPiece(piece) || isKing(piece)) {
        directions.push({rowOffset: 1, colOffset: -1}, {rowOffset: 1, colOffset: 1});
    }
    return directions;
}

// ==========================================
// Controllers
// ==========================================

/**
 * AudioController
 * Manages the Web Audio API context, synthesizes sound effects, and handles playback.
 * This class abstracts the complexity of the AudioContext and provides high-level methods
 * for game events. It handles browser compatibility and auto-resuming of suspended contexts.
 */
class AudioController {
    /**
     * Initializes the AudioController and attempts to create an AudioContext.
     * Logs a warning if the Web Audio API is not supported by the browser.
     */
    constructor() {
        this.audioCtx = null;
        try {
            this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) {
            console.warn("Web Audio API is not supported in this browser.");
        }
    }

    /**
     * Synthesizes and plays a tone using an oscillator and gain node.
     * This method creates a temporary oscillator for each sound, allowing for overlapping effects.
     *
     * @param {OscillatorType} type - The oscillator waveform type.
     * @param {number} freq - The starting frequency in Hz.
     * @param {number} duration - The duration of the tone in seconds.
     * @param {number} volStart - The starting volume (gain).
     * @param {number} volEnd - The ending volume (gain) for fade-out.
     * @param {number|null} [freqEnd=null] - Optional ending frequency for frequency ramping effects (e.g., slides).
     */
    playTone(type, freq, duration, volStart = 0.1, volEnd = 0.01, freqEnd = null) {
        if (!this.audioCtx) return;
        try {
            const osc = this.audioCtx.createOscillator();
            const gain = this.audioCtx.createGain();
            osc.connect(gain);
            gain.connect(this.audioCtx.destination);
            osc.type = type;
            osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);
            if (freqEnd) osc.frequency.exponentialRampToValueAtTime(freqEnd, this.audioCtx.currentTime + duration);
            
            gain.gain.setValueAtTime(volStart, this.audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(volEnd, this.audioCtx.currentTime + duration);
            
            osc.start(this.audioCtx.currentTime);
            osc.stop(this.audioCtx.currentTime + duration);
        } catch (error) {
            console.error("Error playing tone:", error);
        }
    }

    /**
     * Triggers a predefined high-level sound effect based on game events.
     * Handles resuming the AudioContext if it was suspended by the browser.
     *
     * @param {'move'|'capture'|'king'|'win'} type - The type of sound effect to play.
     */
    playSound(type) {
        if (!this.audioCtx) return;
        if (this.audioCtx.state === 'suspended') {
            this.audioCtx.resume().catch(e => console.warn("Audio resume failed:", e));
        }
        
        if (type === 'move') {
            const cfg = AUDIO_CONFIG.MOVE;
            this.playTone(cfg.type, cfg.freq, cfg.duration, cfg.volStart, cfg.volEnd, cfg.freqEnd);
        } else if (type === 'capture') {
            const cfg = AUDIO_CONFIG.CAPTURE;
            this.playTone(cfg.type, cfg.freq, cfg.duration, cfg.volStart, cfg.volEnd, cfg.freqEnd);
        } else if (type === 'king') {
            AUDIO_CONFIG.KING_NOTES.forEach((freq, i) => setTimeout(() => this.playTone('triangle', freq, 0.3, 0.05, 0.001), i * GAME_CONFIG.NOTE_DELAY));
        } else if (type === 'win') {
            AUDIO_CONFIG.WIN_NOTES.forEach((freq, i) => setTimeout(() => this.playTone('square', freq, 0.1, 0.1, 0.01), i * GAME_CONFIG.NOTE_DELAY));
        }
    }
}

/**
 * AIController
 * Implements the logic for the computer opponent (NPC).
 * Uses a heuristic-based decision making process to select the optimal move
 * from the set of valid moves available to the Black player.
 */
class AIController {
    /**
     * Creates an instance of the AIController.
     * @param {Game} game - Reference to the main Game instance.
     */
    constructor(game) {
        this.game = game;
    }

    /**
     * Determines the best possible move for the computer player.
     * Uses a heuristic approach prioritizing promotions, multi-jumps, and then captures.
     * @returns {{fromRow: number, fromCol: number, toRow: number, toCol: number}|null} The selected move object or null if no moves are available.
     */
    makeMove() {
        const moves = this.getAllCPUMoves();
        if (moves.length === 0) return null;

        const bestMoves = this.getBestCPUMoves(moves);
        if (bestMoves.length > 0) {
            return bestMoves[Math.floor(Math.random() * bestMoves.length)];
        }
        return null;
    }

    /**
     * Retrieves all valid moves available to the computer (Black pieces).
     * @returns {Array<{fromRow: number, fromCol: number, toRow: number, toCol: number}>} An array of valid move objects.
     */
    getAllCPUMoves() {
        if (this.game.chainJumpInProgress) {
            return this.getMovesForPiece(this.game.selectedRow, this.game.selectedCol);
        }
        
        let moves = [];
        for (let row = 0; row < BOARD_SIZE; row++) {
            for (let col = 0; col < BOARD_SIZE; col++) {
                const piece = this.game.board[row][col];
                if (piece === PIECES.BLACK || piece === PIECES.BLACK_KING) {
                    moves = moves.concat(this.getMovesForPiece(row, col));
                }
            }
        }
        return moves;
    }

    /**
     * Filters and prioritizes moves based on game strategy.
     * Priority: King Promotion > Multi-Jumps > Single Jumps > Regular Moves.
     * @param {Array<{fromRow: number, fromCol: number, toRow: number, toCol: number}>} moves - The list of available moves.
     * @returns {Array<{fromRow: number, fromCol: number, toRow: number, toCol: number}>} The subset of best moves.
     */
    getBestCPUMoves(moves) {
        const promotionMoves = moves.filter(move => {
            const piece = this.game.board[move.fromRow][move.fromCol];
            return piece === PIECES.BLACK && move.toRow === BOARD_SIZE - 1;
        });
        if (promotionMoves.length > 0) return promotionMoves;

        const jumps = moves.filter(move => Math.abs(move.fromRow - move.toRow) === 2);
        if (jumps.length === 0) return moves;

        const multiJumps = jumps.filter(move => this.canChainJumpAfterMove(move));
        if (multiJumps.length > 0) return multiJumps;
        
        return jumps;
    }

    /**
     * Simulates a move to check if it enables a subsequent jump (chain jumping).
     * @param {{fromRow: number, fromCol: number, toRow: number, toCol: number}} move - The move to simulate.
     * @returns {boolean} True if a chain jump is possible immediately after this move.
     */
    canChainJumpAfterMove(move) {
        const board = this.game.board;
        const piece = board[move.fromRow][move.fromCol];
        const capturedRow = (move.fromRow + move.toRow) / 2;
        const capturedCol = (move.fromCol + move.toCol) / 2;
        const capturedPiece = board[capturedRow][capturedCol];

        // Simulate move
        board[move.toRow][move.toCol] = piece;
        board[move.fromRow][move.fromCol] = PIECES.EMPTY;
        board[capturedRow][capturedCol] = PIECES.EMPTY;

        const canChain = this.game.canJumpFrom(move.toRow, move.toCol);

        // Restore board
        board[move.fromRow][move.fromCol] = piece;
        board[move.toRow][move.toCol] = PIECES.EMPTY;
        board[capturedRow][capturedCol] = capturedPiece;

        return canChain;
    }

    /**
     * Helper to get moves for a specific piece from the Game instance.
     * @param {number} row - Row index.
     * @param {number} col - Column index.
     * @returns {Array<{fromRow: number, fromCol: number, toRow: number, toCol: number}>} Valid moves for the piece.
     */
    getMovesForPiece(row, col) {
        return this.game.getMovesForPiece(row, col);
    }
}

/**
 * UIController
 * Manages the DOM, handles rendering of the board and pieces, and controls visual effects.
 * This class acts as the View in the MVC pattern, observing the Game state and updating
 * the HTML elements accordingly.
 */
class UIController {
    /**
     * Initializes the UI controller, validates required DOM elements, and builds the initial layout.
     * @param {Game} game - Reference to the main Game instance.
     */
    constructor(game) {
        this.game = game;
        this.boardElement = document.getElementById('board');
        this.winnerOverlay = document.getElementById('winner-overlay');
        this.winnerMessage = document.getElementById('winner-message');
        
        if (!this.boardElement || !this.winnerOverlay || !this.winnerMessage) {
            throw new Error("Missing DOM elements");
        }

        this.initLayout();
        this.initConfetti();
    }

    /**
     * Sets up the initial HTML layout, including the board, controls, profile, and scoreboard.
     * Dynamically creates and appends elements to the DOM to construct the game interface.
     */
    initLayout() {
        // Viewport setup
        let viewportMeta = document.querySelector('meta[name="viewport"]');
        if (!viewportMeta) {
            viewportMeta = document.createElement('meta');
            viewportMeta.name = "viewport";
            document.head.appendChild(viewportMeta);
        }
        viewportMeta.content = "width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes";
        document.body.style.touchAction = "manipulation";
        document.body.style.overflow = "auto";

        // Title
        const titleElement = document.querySelector('h1');
        if (titleElement) titleElement.innerHTML = LABELS.TITLE;

        // Layout Containers
        let container = this.boardElement;
        while (container.parentNode && container.parentNode !== document.body) {
            container = container.parentNode;
        }
        this.gameLayout = createElement('div', null, { cssText: "position: relative; display: inline-block;" });
        document.body.insertBefore(this.gameLayout, container);
        this.gameLayout.appendChild(container);

        // Profile Group
        this.profileGroup = createElement('div', this.gameLayout, {
            cssText: `
                display: flex; 
                flex-direction: column; 
                align-items: center; 
                gap: 10px; 
                position: absolute; 
                right: 100%; 
                top: -170px; 
                margin-right: 45px; 
                width: max-content;
            `
        });
        this.createProfile();

        // Controls Group
        this.controlsGroup = createElement('div', this.gameLayout, {
            cssText: `
                display: flex; 
                flex-direction: column; 
                gap: 2px; 
                position: absolute; 
                right: 100%; 
                top: 40px; 
                margin-right: 35px; 
                width: max-content;
            `
        });
        this.statusElement = createElement('div', this.controlsGroup, {
            className: 'status-indicator',
            cssText: "padding: 8px 5px; width: 185px; box-sizing: border-box;"
        });
        this.singlePlayerButton = createButton(LABELS.BTN_DISABLE, () => this.game.toggleSinglePlayer());
        this.controlsGroup.appendChild(this.singlePlayerButton);
        this.controlsGroup.appendChild(createButton(LABELS.BTN_RESET, () => this.game.resetGame()));

        // Scoreboard
        this.createScoreboard();

        // Captured Pieces
        this.createCapturedContainer();

        // Help Button
        this.createHelpButton();

        // Help Modal
        this.createHelpModal();
    }

    /**
     * Creates the user profile section with avatar and social links.
     * Handles hover effects for the profile picture and social icons.
     */
    createProfile() {
        const profileLink = createElement('a', this.profileGroup, {
            attrs: { href: "https://www.linkedin.com/in/john-s-garvey/", target: "_blank" },
            cssText: `
                display: block; 
                width: 140px; 
                height: 140px; 
                margin: 0 auto 10px auto; 
                cursor: pointer;
            `
        });
        this.profilePic = createElement('img', profileLink, {
            attrs: { src: 'JGarvey_Prof_Profile.jpg' },
            cssText: `width: 100%; height: 100%; border-radius: 50%; border: 4px solid ${THEME.PROFILE_BORDER_ACTIVE}; box-shadow: 0 4px 8px rgba(0,0,0,0.5); object-fit: cover; transition: transform 0.3s ease;`
        });
        this.profilePic.addEventListener('mouseover', () => this.profilePic.style.transform = 'scale(1.1)');
        this.profilePic.addEventListener('mouseout', () => this.profilePic.style.transform = 'scale(1)');

        const socialContainer = createElement('div', this.profileGroup, { cssText: "display: flex; justify-content: center; gap: 5px;" });
        SOCIAL_LINKS.forEach(linkData => {
            const link = createElement('a', socialContainer, {
                attrs: { href: linkData.url, target: "_blank", title: linkData.label },
                cssText: `
                    display: inline-block; 
                    margin: 0 2px; 
                    color: ${THEME.SOCIAL_ICON}; 
                    opacity: ${THEME.SOCIAL_ICON_OPACITY}; 
                    transition: opacity 0.2s; 
                    vertical-align: middle;
                `
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
    }

    /**
     * Creates the scoreboard display for tracking wins.
     * Includes the score counters for both players and the reset score button.
     */
    createScoreboard() {
        const scoreGroup = createElement('div', this.gameLayout, {
            cssText: `
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 15px;
                position: absolute;
                left: 100%;
                top: 20px;
                margin-left: 35px;
                width: 110px;
                padding: 30px 10px;
                background-color: ${THEME.SCORE_CONTAINER_BG};
                border: 4px solid ${THEME.SCORE_CONTAINER_BORDER};
                border-radius: 6px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.5);
                font-family: 'Courier New', Courier, monospace;
                color: ${THEME.SCORE_TEXT};
            `
        });
        createElement('div', scoreGroup, { 
            text: LABELS.SCOREBOARD, 
            cssText: `
                font-weight: bold; 
                font-size: 14px; 
                text-decoration: none; 
                border-bottom: 1px solid ${THEME.SCORE_TITLE_BORDER}; 
                padding-bottom: 5px; 
                margin-bottom: 5px; 
                letter-spacing: 1px;
            ` 
        });
        this.topLabel = createElement('div', scoreGroup, { text: LABELS.ME, cssText: "font-weight: bold; font-size: 18px;" });
        
        const scoreDisplayCss = `
            font-size: 42px;
            font-family: 'Courier New', monospace;
            font-weight: bold;
            color: ${THEME.SCORE_DIGIT};
            background-color: ${THEME.SCORE_BG};
            padding: 5px 15px;
            border: 4px solid ${THEME.SCORE_BORDER};
            border-radius: 4px;
            box-shadow: inset 0 0 10px ${THEME.SCORE_BG};
            text-shadow: 0 0 5px ${THEME.SCORE_DIGIT}, 0 0 10px ${THEME.SCORE_DIGIT};
            min-width: 50px;
            text-align: center;
            letter-spacing: 2px;
        `;
        this.topScoreDisplay = createElement('div', scoreGroup, { text: "0", cssText: scoreDisplayCss + " margin-bottom: 10px;" });
        this.bottomLabel = createElement('div', scoreGroup, { text: LABELS.YOU, cssText: "font-weight: bold; font-size: 18px;" });
        this.bottomScoreDisplay = createElement('div', scoreGroup, { text: "0", cssText: scoreDisplayCss });
        const resetScoreBtn = createElement('button', scoreGroup, { 
            text: LABELS.BTN_RESET_SCORE, 
            cssText: `
                margin-top: 15px;
                padding: 8px 12px;
                background: ${THEME.RESET_SCORE_BTN_BG};
                color: ${THEME.RESET_SCORE_BTN_TEXT};
                border: 1px solid ${THEME.RESET_SCORE_BTN_BORDER};
                cursor: pointer;
                font-family: inherit;
                font-weight: bold;
                font-size: 12px;
                border-radius: 2px;
                transition: all 0.2s;
            ` 
        });
        resetScoreBtn.addEventListener('mouseover', () => resetScoreBtn.style.backgroundColor = THEME.RESET_SCORE_BTN_HOVER);
        resetScoreBtn.addEventListener('mouseout', () => resetScoreBtn.style.backgroundColor = THEME.RESET_SCORE_BTN_BG);
        resetScoreBtn.addEventListener('click', () => this.game.resetScore());
    }

    /**
     * Creates the containers for displaying captured pieces.
     * These containers are positioned at the bottom of the game layout.
     */
    createCapturedContainer() {
        const capturedContainer = createElement('div', this.gameLayout, { 
            cssText: `
                display: flex; 
                flex-direction: column; 
                gap: 5px; 
                position: absolute; 
                right: 100%; 
                bottom: 25px; 
                margin-right: 10px;
            ` 
        });
        const capturedStyle = `
            display: grid;
            grid-template-columns: repeat(4, 50px);
            grid-template-rows: repeat(3, 30px);
            gap: 5px;
            padding: 10px;
            justify-items: center;
            background-color: ${THEME.CAPTURED_BG};
            border-radius: 8px;
            border: 1px solid ${THEME.CAPTURED_BORDER};
        `;
        this.blackCaptured = createElement('div', capturedContainer, { cssText: capturedStyle });
        this.redCaptured = createElement('div', capturedContainer, { cssText: capturedStyle });
    }

    /**
     * Creates a floating help button positioned next to the title.
     * The button triggers the help modal when clicked.
     */
    createHelpButton() {
        const helpBtn = createElement('button', this.gameLayout, {
            text: "?",
            attrs: { title: "Instructions" },
            cssText: `
                position: absolute; 
                left: 100%;
                top: -60px;
                margin-left: 70px;
                width: 40px; 
                height: 40px; 
                border-radius: 50%; 
                background: linear-gradient(145deg, #444, #222);
                color: #fff; 
                border: 2px solid #777; 
                font-family: sans-serif; 
                font-weight: bold; 
                font-size: 20px; 
                cursor: pointer; 
                box-shadow: 0 4px 6px rgba(0,0,0,0.3); 
                z-index: 100; 
                display: flex;
                justify-content: center;
                align-items: center;
                transition: all 0.2s ease;
            `
        });
        
        helpBtn.addEventListener('mouseover', () => {
            helpBtn.style.transform = 'scale(1.1)';
            helpBtn.style.boxShadow = '0 6px 8px rgba(0,0,0,0.5)';
            helpBtn.style.borderColor = '#fff';
        });
        
        helpBtn.addEventListener('mouseout', () => {
            helpBtn.style.transform = 'scale(1)';
            helpBtn.style.boxShadow = '0 4px 6px rgba(0,0,0,0.3)';
            helpBtn.style.borderColor = '#777';
        });
        
        helpBtn.addEventListener('click', () => this.showHelp());
    }

    /**
     * Creates the modal overlay for displaying the Help content.
     * The modal is hidden by default and includes a close button.
     */
    createHelpModal() {
        this.helpOverlay = createElement('div', document.body, {
            cssText: `
                display: none;
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0,0,0,0.85);
                z-index: 3000;
                justify-content: center;
                align-items: center;
            `
        });
        
        const modalContainer = createElement('div', this.helpOverlay, {
            cssText: "position: relative; width: 90%; max-width: 600px; max-height: 85vh; background-color: #fff; border-radius: 8px; padding: 25px; display: flex; flex-direction: column; box-shadow: 0 0 20px rgba(0,0,0,0.5); color: #333; font-family: sans-serif;"
        });

        const closeBtn = createElement('button', modalContainer, {
            text: "×",
            cssText: "position: absolute; top: 10px; right: 15px; background: none; border: none; font-size: 28px; font-weight: bold; cursor: pointer; color: #555; line-height: 1;"
        });
        closeBtn.onclick = () => this.helpOverlay.style.display = 'none';

        this.helpContent = createElement('div', modalContainer, {
            cssText: "overflow-y: auto; padding-right: 10px; line-height: 1.6;"
        });

        this.helpOverlay.addEventListener('click', (e) => {
            if (e.target === this.helpOverlay) this.helpOverlay.style.display = 'none';
        });
    }

    /**
     * Displays the help modal with the formatted instructions.
     * Populates the modal content with HTML if it hasn't been loaded yet.
     */
    showHelp() {
        this.helpOverlay.style.display = 'flex';
        if (!this.helpContent.innerHTML) {
            this.helpContent.innerHTML = `
                <h2 style="margin-top: 0; border-bottom: 1px solid #eee; padding-bottom: 10px;">John Garvey's Checkers Web Game</h2>
                <p>A fully interactive, browser-based implementation of the classic board game Checkers (also known as Draughts). This application brings the traditional tabletop experience to the web using modern web technologies.</p>
                
                <h3 style="color: #1e4d2b;">🕹️ How to Play</h3>
                <ol>
                    <li><strong>Start:</strong> The game begins in Single Player mode. You play as <strong>Red</strong> (bottom), and the computer plays as <strong>Black</strong> (top).</li>
                    <li><strong>Move:</strong> Click on a piece to select it (highlighted in yellow), then click a valid diagonal dark square to move.</li>
                    <li><strong>Capture:</strong> If an opponent's piece is diagonally adjacent and the square behind it is empty, you can jump over it to capture it.</li>
                    <li><strong>Win:</strong> The game ends when one player loses all their pieces or cannot make a valid move.</li>
                </ol>

                <h4 style="margin-bottom: 5px;">Game Modes</h4>
                <ul style="margin-top: 5px;">
                    <li><strong>Single Player (Default):</strong> The game starts with the NPC enabled. You play as <strong>Red</strong> (bottom) against the computer ("Me"), which plays as <strong>Black</strong> (top).</li>
                    <li><strong>Two Player:</strong> Click the <strong>"Disable NPC (Me)"</strong> button to switch to Two Player mode. In this mode, you can control both Red and Black pieces, allowing you to play against yourself or a friend on the same device. Click <strong>"Enable NPC (Me)"</strong> to return to Single Player mode.</li>
                </ul>

                <h3 style="color: #1e4d2b;">✨ Features</h3>
                <h4 style="margin-bottom: 5px;">Core Gameplay</h4>
                <ul style="margin-top: 5px;">
                    <li><strong>Classic Rules:</strong> Full implementation of standard checkers rules, including turn-based movement and mandatory capturing logic.</li>
                    <li><strong>Single Player Mode:</strong> Challenge a built-in computer opponent (NPC) with intelligent move selection.</li>
                    <li><strong>Move Validation:</strong> The game engine strictly enforces valid moves, preventing illegal actions.</li>
                    <li><strong>King Promotion:</strong> Pieces reaching the opposite end of the board are automatically promoted to Kings, gaining multi-directional movement.</li>
                    <li><strong>Chain Jumps:</strong> Supports complex multi-jump sequences (double/triple jumps) in a single turn.</li>
                    <li><strong>Win Detection:</strong> Automatically detects victory conditions when a player captures all opponent pieces or blocks all moves.</li>
                </ul>

                <h3 style="color: #1e4d2b;">👤 Author</h3>
                <p style="margin: 10px 0;"><strong>John S. Garvey</strong></p>

                <h3 style="color: #1e4d2b;">Code</h3>
                <p style="margin: 10px 0;"><a href="https://github.com/jgarvey928/Checkers_Web_Game" target="_blank" style="color: #1e4d2b; text-decoration: none; font-weight: bold;">GitHub Repo</a></p>
            `;
        }
    }

    /**
     * Renders the game board based on the current state.
     * Clears the board element and rebuilds the grid of squares and pieces.
     *
     * @param {Array<Array<number>>} board - The 2D array representing the board state.
     * @param {number} selectedRow - The row index of the currently selected piece.
     * @param {number} selectedCol - The column index of the currently selected piece.
     */
    renderBoard(board, selectedRow, selectedCol) {
        this.boardElement.innerHTML = '';
        for (let row = 0; row < BOARD_SIZE; row++) {
            for (let col = 0; col < BOARD_SIZE; col++) {
                const square = createElement('div', this.boardElement, {
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
            }
        }
    }

    /**
     * Adds a visual representation of a captured piece to the side container.
     *
     * @param {number} piece - The numeric value of the captured piece.
     */
    addCapturedPiece(piece) {
        const classes = [CSS_CLASSES.PIECE, isRedPiece(piece) ? CSS_CLASSES.RED : CSS_CLASSES.BLACK];
        if (isKing(piece)) classes.push(CSS_CLASSES.KING);
        const pieceElement = createElement('div', null, { 
            className: classes.join(' '), 
            cssText: `
                width: 30px; 
                height: 30px; 
                margin: 0; 
                font-size: 14px; 
                cursor: default; 
                box-shadow: inset 0 0 0 2px rgba(0,0,0,0.2), inset 0 0 0 4px rgba(255,255,255,0.1);
            ` 
        });
        (isRedPiece(piece) ? this.redCaptured : this.blackCaptured).appendChild(pieceElement);
    }

    /**
     * Initializes the canvas context for confetti effects.
     * Creates a full-screen canvas overlay for rendering particle animations.
     */
    initConfetti() {
        this.confettiCanvas = createElement('canvas', document.body, { 
            cssText: `
                position: fixed; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: 9999;
            ` 
        });
        this.ctx = this.confettiCanvas.getContext('2d');
        this.confettiParticles = [];
    }

    /**
     * Starts the confetti animation loop.
     * Generates a new set of particles and begins the requestAnimationFrame loop.
     */
    startConfetti() {
        this.confettiCanvas.width = window.innerWidth;
        this.confettiCanvas.height = window.innerHeight;
        this.confettiParticles = [];
        for (let i = 0; i < GAME_CONFIG.CONFETTI_COUNT; i++) {
            this.confettiParticles.push({
                x: Math.random() * this.confettiCanvas.width,
                y: Math.random() * this.confettiCanvas.height - this.confettiCanvas.height,
                color: THEME.CONFETTI[Math.floor(Math.random() * THEME.CONFETTI.length)],
                size: Math.random() * 10 + 5,
                speedY: Math.random() * 3 + 2,
                speedX: Math.random() * 2 - 1,
                rotation: Math.random() * 360,
                rotationSpeed: Math.random() * 10 - 5
            });
        }
        this.animateConfetti();
    }

    /**
     * Handles the frame-by-frame animation of confetti particles.
     * Updates particle positions, rotation, and handles wrapping around the screen.
     */
    animateConfetti() {
        this.ctx.clearRect(0, 0, this.confettiCanvas.width, this.confettiCanvas.height);
        this.confettiParticles.forEach(particle => {
            particle.y += particle.speedY;
            particle.x += particle.speedX;
            particle.rotation += particle.rotationSpeed;
            if (particle.y > this.confettiCanvas.height) particle.y = -10;
            this.ctx.save();
            this.ctx.translate(particle.x, particle.y);
            this.ctx.rotate(particle.rotation * Math.PI / 180);
            this.ctx.fillStyle = particle.color;
            this.ctx.fillRect(-particle.size / 2, -particle.size / 2, particle.size, particle.size);
            this.ctx.restore();
        });
        this.confettiAnimationId = requestAnimationFrame(() => this.animateConfetti());
    }

    /**
     * Stops the confetti animation and clears the canvas.
     * Cancels the animation frame request to save resources.
     */
    stopConfetti() {
        cancelAnimationFrame(this.confettiAnimationId);
        this.ctx.clearRect(0, 0, this.confettiCanvas.width, this.confettiCanvas.height);
    }
}

/**
 * Game
 * The main controller class that coordinates game state, rules, UI updates, and AI interaction.
 * Maintains the source of truth for the board state, turn management, and win conditions.
 */
class Game {
    /**
     * Initializes the game, sets up controllers, and starts the first turn.
     * Sets default values for game state variables.
     */
    constructor() {
        this.board = [];
        this.selectedRow = -1;
        this.selectedCol = -1;
        this.isRedTurn = true;
        this.chainJumpInProgress = false;
        this.isSinglePlayer = true;
        this.blackWins = 0;
        this.redWins = 0;

        this.audio = new AudioController();
        this.ui = new UIController(this);
        this.ai = new AIController(this);

        this.ui.boardElement.addEventListener('click', (e) => this.handleSquareClick(e));
        
        this.initializeBoard();
        this.updateUI();
    }

    /**
     * Resets the board to the standard starting configuration for Checkers.
     * Rows 0-2 are Black pieces, rows 5-7 are Red pieces.
     */
    initializeBoard() {
        this.board = Array.from({ length: BOARD_SIZE }, (_, row) => 
            Array.from({ length: BOARD_SIZE }, (_, col) => {
                if ((row + col) % 2 === 0) return PIECES.EMPTY;
                if (row < 3) return PIECES.BLACK;
                if (row > 4) return PIECES.RED;
                return PIECES.EMPTY;
            })
        );
    }

    /**
     * Triggers a UI refresh to reflect the current game state.
     * Updates the board rendering and the status text.
     */
    updateUI() {
        this.ui.renderBoard(this.board, this.selectedRow, this.selectedCol);
        this.updateStatus();
    }

    /**
     * Updates the status text based on whose turn it is and the game mode.
     * Handles localization of status messages (e.g., "Your Turn" vs "Red's Turn").
     */
    updateStatus() {
        let text = "";
        if (this.chainJumpInProgress) {
            if (this.isSinglePlayer) {
                text = this.isRedTurn ? LABELS.STATUS_STILL_YOUR : LABELS.STATUS_STILL_MY;
            } else {
                text = this.isRedTurn ? LABELS.STATUS_STILL_RED : LABELS.STATUS_STILL_BLACK;
            }
        } else {
            if (this.isSinglePlayer) {
                text = this.isRedTurn ? LABELS.STATUS_YOUR : LABELS.STATUS_MY;
            } else {
                text = this.isRedTurn ? LABELS.STATUS_RED : LABELS.STATUS_BLACK;
            }
        }
        this.ui.statusElement.textContent = text;
    }

    /**
     * Handles click events on the game board, managing selection and movement logic.
     * Validates clicks based on turn, piece ownership, and move validity.
     * @param {Event} event - The DOM click event.
     */
    handleSquareClick(event) {
        try {
            if (this.isSinglePlayer && !this.isRedTurn) return;

            const square = event.target.closest('.' + CSS_CLASSES.SQUARE);
            if (!square) return;

            const row = parseInt(square.dataset.row);
            const col = parseInt(square.dataset.col);

            if (this.chainJumpInProgress) {
                if (this.isValidMove(this.selectedRow, this.selectedCol, row, col)) {
                    this.movePiece(row, col);
                }
            } else if (this.selectedRow === -1) {
                const piece = this.board[row][col];
                if (piece !== PIECES.EMPTY && this.isRedTurn === isRedPiece(piece)) {
                    this.selectedRow = row;
                    this.selectedCol = col;
                }
            } else {
                if (this.isValidMove(this.selectedRow, this.selectedCol, row, col)) {
                    this.movePiece(row, col);
                } else {
                    this.selectedRow = -1;
                    this.selectedCol = -1;
                }
            }
            this.updateUI();
        } catch (error) {
            console.error("Error handling click:", error);
        }
    }

    /**
     * Validates if a move from the selected piece to the target square is legal.
     * Checks direction, distance, and jump rules according to standard Checkers logic.
     * 
     * @param {number} fromRow - Starting row index.
     * @param {number} fromCol - Starting column index.
     * @param {number} toRow - Target row index.
     * @param {number} toCol - Target column index.
     * @returns {boolean} True if the move is valid according to Checkers rules.
     */
    isValidMove(fromRow, fromCol, toRow, toCol) {
        if (this.board[toRow][toCol] !== PIECES.EMPTY || (toRow + toCol) % 2 === 0) return false;

        const piece = this.board[fromRow][fromCol];
        const king = isKing(piece);
        const rowDiff = Math.abs(toRow - fromRow);
        const colDiff = Math.abs(toCol - fromCol);

        if (!king) {
            if (isRedPiece(piece) && toRow > fromRow) return false; // Red moves up (decreasing row index)
            if (!isRedPiece(piece) && toRow < fromRow) return false; // Black moves down (increasing row index)
        }

        if (this.chainJumpInProgress) {
            return rowDiff === 2 && colDiff === 2 && this.isJump(fromRow, fromCol, toRow, toCol);
        }

        if (rowDiff === 1 && colDiff === 1) {
            return true; // Direction already checked above
        } else if (rowDiff === 2 && colDiff === 2) {
            return this.isJump(fromRow, fromCol, toRow, toCol);
        }
        return false;
    }

    /**
     * Checks if a specific move constitutes a jump (capture).
     * Verifies that the square being jumped over contains an opponent's piece.
     * 
     * @param {number} fromRow - Starting row index.
     * @param {number} fromCol - Starting column index.
     * @param {number} toRow - Target row index.
     * @param {number} toCol - Target column index.
     * @returns {boolean} True if the move captures an opponent piece.
     */
    isJump(fromRow, fromCol, toRow, toCol) {
        const jumpedRow = (fromRow + toRow) / 2;
        const jumpedCol = (fromCol + toCol) / 2;
        const jumpedPiece = this.board[jumpedRow][jumpedCol];
        return jumpedPiece !== PIECES.EMPTY && this.isRedTurn !== isRedPiece(jumpedPiece);
    }

    /**
     * Checks if a piece at the given position has any valid jump moves available.
     * Used for enforcing mandatory jumps and chain jump logic.
     * @param {number} row - Row index of the piece.
     * @param {number} col - Column index of the piece.
     * @returns {boolean} True if a jump is possible.
     */
    canJumpFrom(row, col) {
        const piece = this.board[row][col];
        if (piece === PIECES.EMPTY) return false;
        const directions = getAllowedDirections(piece);
        for (const dir of directions) {
            const jumpRow = row + dir.rowOffset * 2;
            const jumpCol = col + dir.colOffset * 2;
            if (isValidPos(jumpRow, jumpCol) && this.board[jumpRow][jumpCol] === PIECES.EMPTY) {
                const capturedRow = row + dir.rowOffset;
                const capturedCol = col + dir.colOffset;
                const jumpedPiece = this.board[capturedRow][capturedCol];
                if (jumpedPiece !== PIECES.EMPTY && isRedPiece(piece) !== isRedPiece(jumpedPiece)) return true;
            }
        }
        return false;
    }

    /**
     * Executes a move on the board, handles captures, promotions, and turn switching.
     * Also manages chain jump logic.
     *
     * @param {number} row - Target row index.
     * @param {number} col - Target column index.
     */
    movePiece(row, col) {
        const piece = this.board[this.selectedRow][this.selectedCol];
        this.board[this.selectedRow][this.selectedCol] = PIECES.EMPTY;
        this.board[row][col] = piece;

        let promoted = false;
        if (piece === PIECES.RED && row === 0) {
            this.board[row][col] = PIECES.RED_KING;
            promoted = true;
        } else if (piece === PIECES.BLACK && row === BOARD_SIZE - 1) {
            this.board[row][col] = PIECES.BLACK_KING;
            promoted = true;
        }

        const rowDiff = Math.abs(row - this.selectedRow);
        if (rowDiff === 2) {
            const jumpedRow = (row + this.selectedRow) / 2;
            const jumpedCol = (col + this.selectedCol) / 2;
            const jumpedPiece = this.board[jumpedRow][jumpedCol];
            this.board[jumpedRow][jumpedCol] = PIECES.EMPTY;
            this.ui.addCapturedPiece(jumpedPiece);

            if (!promoted && this.canJumpFrom(row, col)) {
                this.selectedRow = row;
                this.selectedCol = col;
                this.chainJumpInProgress = true;
            } else {
                this.chainJumpInProgress = false;
            }
        } else {
            this.chainJumpInProgress = false;
        }

        if (promoted) this.audio.playSound('king');
        else if (rowDiff === 2) this.audio.playSound('capture');
        else this.audio.playSound('move');

        if (!this.chainJumpInProgress) {
            this.isRedTurn = !this.isRedTurn;
            this.selectedRow = -1;
            this.selectedCol = -1;
            if (this.isSinglePlayer && !this.isRedTurn) {
                setTimeout(() => this.makeComputerMove(), GAME_CONFIG.CPU_MOVE_DELAY);
            }
        }
        this.checkWinner();
    }

    /**
     * Triggers the AI controller to calculate and execute a move.
     * Adds a slight delay to simulate "thinking" time for better UX.
     */
    makeComputerMove() {
        const move = this.ai.makeMove();
        if (move) {
            this.selectedRow = move.fromRow;
            this.selectedCol = move.fromCol;
            this.movePiece(move.toRow, move.toCol);
            this.updateUI();
            if (this.chainJumpInProgress) setTimeout(() => this.makeComputerMove(), GAME_CONFIG.CPU_MOVE_DELAY);
        }
    }

    /**
     * Checks the board state to see if a win condition has been met.
     * A player wins if the opponent has no pieces left or no valid moves.
     */
    checkWinner() {
        const pieces = this.board.flat();
        const redHasPieces = pieces.some(isRedPiece);
        const blackHasPieces = pieces.some(p => p !== PIECES.EMPTY && !isRedPiece(p));
        let winner = null;
        if (!redHasPieces) winner = LABELS.BLACK;
        else if (!blackHasPieces) winner = LABELS.RED;
        
        if (!winner && !this.hasValidMoves()) {
            winner = this.isRedTurn ? LABELS.BLACK : LABELS.RED;
        }

        if (winner) {
            if (winner === LABELS.BLACK) this.ui.topScoreDisplay.textContent = ++this.blackWins;
            else this.ui.bottomScoreDisplay.textContent = ++this.redWins;
            this.audio.playSound('win');
            this.ui.startConfetti();
            
            let message = `${winner} wins!`;
            if (this.isSinglePlayer && winner === LABELS.RED) message = LABELS.WIN_YOU;
            else if (this.isSinglePlayer) message = LABELS.WIN_JOHN;
            this.ui.winnerMessage.textContent = message;
            this.ui.winnerOverlay.style.display = 'flex';
            setTimeout(() => { this.ui.winnerOverlay.style.display = 'none'; this.resetGame(); }, GAME_CONFIG.WINNER_DISPLAY_TIME);
        }
    }

    /**
     * Resets the game to its initial state.
     * Clears captured pieces, resets the board, and restarts the turn cycle.
     */
    resetGame() {
        this.ui.stopConfetti();
        this.ui.blackCaptured.innerHTML = '';
        this.ui.redCaptured.innerHTML = '';
        this.initializeBoard();
        this.isRedTurn = true;
        this.selectedRow = -1;
        this.selectedCol = -1;
        this.chainJumpInProgress = false;
        this.updateUI();
    }

    /**
     * Toggles between Single Player (vs CPU) and Two Player modes.
     * Updates the UI labels and profile border to reflect the active mode.
     */
    toggleSinglePlayer() {
        this.isSinglePlayer = !this.isSinglePlayer;
        this.ui.singlePlayerButton.textContent = this.isSinglePlayer ? LABELS.BTN_DISABLE : LABELS.BTN_ENABLE;
        this.ui.profilePic.style.borderColor = this.isSinglePlayer 
            ? THEME.PROFILE_BORDER_ACTIVE 
            : THEME.PROFILE_BORDER_INACTIVE;
        this.ui.topLabel.textContent = this.isSinglePlayer ? LABELS.ME : LABELS.BLACK;
        this.ui.bottomLabel.textContent = this.isSinglePlayer ? LABELS.YOU : LABELS.RED;
        if (this.isSinglePlayer && !this.isRedTurn) setTimeout(() => this.makeComputerMove(), GAME_CONFIG.CPU_MOVE_DELAY);
        this.updateStatus();
    }

    /**
     * Checks if the current player has any valid moves.
     * Iterates through all pieces of the current player to find at least one legal move.
     * @returns {boolean} True if the current player has at least one valid move.
     */
    hasValidMoves() {
        for (let row = 0; row < BOARD_SIZE; row++) {
            for (let col = 0; col < BOARD_SIZE; col++) {
                const piece = this.board[row][col];
                if (piece === PIECES.EMPTY) continue;
                if (isRedPiece(piece) === this.isRedTurn) {
                    if (this.getMovesForPiece(row, col).length > 0) return true;
                }
            }
        }
        return false;
    }

    /**
     * Resets the win counters on the scoreboard.
     * Updates the display to show 0-0.
     */
    resetScore() {
        this.blackWins = 0;
        this.redWins = 0;
        this.ui.topScoreDisplay.textContent = "0";
        this.ui.bottomScoreDisplay.textContent = "0";
    }

    /**
     * Calculates all valid moves for a specific piece at the given coordinates.
     * Used by the AI to determine possible actions and by the Game class for move validation.
     * @param {number} row - Row index.
     * @param {number} col - Column index.
     * @returns {Array<{fromRow: number, fromCol: number, toRow: number, toCol: number}>} List of valid move objects.
     */
    getMovesForPiece(row, col) {
        const moves = [];
         // Check all 8 possible moves (4 single steps, 4 jumps)
        const possibleOffsets = [
            1, -1, 2, -2
        ];

        for (const rOff of possibleOffsets) {
            for (const cOff of possibleOffsets) {
                if (Math.abs(rOff) !== Math.abs(cOff)) continue; // Must be diagonal
                const targetRow = row + rOff;
                const targetCol = col + cOff;
                
                const valid = isValidPos(targetRow, targetCol) && this.isValidMove(row, col, targetRow, targetCol);
                if (valid) {
                    moves.push({fromRow: row, fromCol: col, toRow: targetRow, toCol: targetCol});
                }
            }
        }
        return moves;
    }
}

// ==========================================
// Initialization
// ==========================================
try {
    new Game();
} catch (error) {
    console.error("Game initialization failed:", error);
}
