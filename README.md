# John Garvey's Checkers Web Game

A fully interactive, browser-based implementation of the classic board game Checkers (also known as Draughts). This application brings the traditional tabletop experience to the web using modern web technologies.

## 🎮 Live Demo

Play the game online here: **[jgarvey928.github.io/Checkers_Web_Game/](https://jgarvey928.github.io/Checkers_Web_Game/)**

## ✨ Features

*   **Classic Gameplay:** Full implementation of standard checkers rules, including turn-based movement and capturing.
*   **Move Validation:** The game engine enforces valid moves, preventing illegal actions.
*   **King Promotion:** Pieces reaching the opposite end of the board are automatically promoted to Kings, gaining the ability to move backward.
*   **Chain Jumps:** Supports multi-jump sequences (double/triple jumps) in a single turn.
*   **Win Detection:** Automatically detects when a player has won by capturing all opponent pieces.
*   **Responsive UI:** Clean, centered board design with visual indicators for selected pieces and game status.

## 🛠️ Technologies Used

*   **HTML5:** Structure and semantic markup of the game board.
*   **CSS3:** Styling, including a realistic wood-textured board, piece rendering, and flexbox/grid layouts.
*   **JavaScript (ES6+):** Core game logic, DOM manipulation, state management, and event handling.

## 🚀 How to Run Locally

To run this project on your local machine:

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/jgarvey928/Checkers_WebApp.git
    ```
2.  **Navigate to the project directory:**
    ```bash
    cd Checkers_WebApp
    ```
3.  **Open `index.html`:**
    Simply open the `index.html` file in your preferred web browser (Chrome, Firefox, Edge, etc.). No build step or server is required.

## 🕹️ How to Play

1.  **Red** always moves first.
2.  Click on a piece to select it (highlighted in yellow).
3.  Click on a valid diagonal dark square to move.
4.  **Jumping:** If an opponent's piece is diagonally adjacent and the square behind it is empty, you must jump over it to capture it.
5.  **Winning:** The game ends when one player loses all their pieces.