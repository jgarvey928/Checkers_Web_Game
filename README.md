# John Garvey's Checkers Web Game

![HTML5](https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)

A fully interactive, browser-based implementation of the classic board game Checkers (also known as Draughts). This application brings the traditional tabletop experience to the web using modern web technologies.

## 🎮 Live Demo

Play the game online here: **[Checkers Web Game Live Demo](https://jgarvey928.github.io/Checkers_Web_Game/)**

## ✨ Features

### Core Gameplay
*   **Classic Rules:** Full implementation of standard checkers rules, including turn-based movement, chain jumping, and kinging promotions.
*   **Single Player Mode:** Challenge a built-in computer opponent (NPC) with intelligent move selection.
*   **Move Validation:** The game engine strictly enforces valid moves, preventing illegal actions.
*   **King Promotion:** Pieces reaching the opposite end of the board are automatically promoted to Kings, gaining multi-directional movement.
*   **Chain Jumps:** Supports complex multi-jump sequences (double/triple jumps) in a single turn.
*   **Win Detection:** Automatically detects victory conditions when a player captures all opponent pieces or blocks all moves.

### User Interface & Experience
*   **Responsive Design:** A clean, centered board layout that adapts to various screen sizes, including mobile devices.
*   **Visual Feedback:** Highlights for selected pieces and valid moves.
*   **Scoreboard:** Tracks wins for both "Me" (Player) and the opponent ("Red" or "Black").
*   **Sound Effects:** Synthesized audio cues for moves, captures, king promotions, and game wins using the Web Audio API.
*   **Particle Effects:** A celebratory confetti animation upon winning a match.

## 🛠️ Technologies Used

*   **HTML5:** Semantic markup for the game structure.
*   **CSS3:** Advanced styling with CSS Variables, Grid/Flexbox layouts, and realistic textures (wood, felt).
*   **JavaScript (ES6+):** Modular, class-based architecture handling game logic, AI, and DOM interaction.
*   **Web Audio API:** For generating dynamic sound effects without external assets.
*   **Canvas API:** For rendering high-performance visual effects like confetti.

## 🚀 How to Run Locally

This project is a static web application and requires no build steps or backend server.

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/jgarvey928/Checkers_WebApp.git
    ```
2.  **Navigate to the project directory:**
    ```bash
    cd Checkers_WebApp
    ```
3.  **Launch the Game:**
    Simply open the `index.html` file in your preferred modern web browser (Chrome, Firefox, Edge, Safari).

## 🕹️ How to Play

1.  **Start:** The game begins in Single Player mode. You play as **Red** (bottom), and the computer plays as **Black** (top).
2.  **Move:** Click on a piece to select it (highlighted in yellow), then click a valid diagonal tan square to move.
3.  **Capture:** If an opponent's piece is diagonally adjacent and the square behind it is empty, you can jump over it to capture it.
4.  **Win:** The game ends when one player loses all their pieces or cannot make a valid move.

### Game Modes

*   **Single Player (Default):** The game starts with the NPC enabled. You play as **Red** (bottom) against the computer ("Me"), which plays as **Black** (top).
*   **Two Player:** Click the **"Disable NPC (Me)"** button to switch to Two Player mode. In this mode, you can control both Red and Black pieces, allowing you to play against yourself or a friend on the same device. Click **"Enable NPC (Me)"** to return to Single Player mode.

## 👤 Author

<img src="JGarvey_Prof_Profile.jpg" alt="John S. Garvey" width="120" style="border-radius: 50%;">

**John S. Garvey**

*   [LinkedIn](https://www.linkedin.com/in/john-s-garvey/)
*   [GitHub](https://github.com/jgarvey928)
*   [Portfolio](https://jgarvey928.github.io/jsgarveyportfolio.io/)