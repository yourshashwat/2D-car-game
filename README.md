# 🏎️ 2D Car Racing Game

A classic and responsive 2D car racing game built entirely with vanilla HTML, CSS, and JavaScript. The goal is simple: dodge the oncoming enemy cars for as long as possible to set a new high score. The game features progressively increasing difficulty and saves your highest scores locally.

This project was built to demonstrate core JavaScript game development principles, including the game loop, DOM manipulation, collision detection, and state management.

## ✨ Key Features

*   **Player Name Entry:** Personalize your game experience by entering your name.
*   **Persistent Leaderboard:** Your highest scores are saved directly in your browser using `localStorage`, allowing you to compete against yourself.
*   **Progressive Difficulty:** The game gets harder over time! Enemy cars speed up and spawn more frequently as your score increases.
*   **Responsive Controls:** Play using the arrow keys on a desktop or use the on-screen touch controls on a mobile device.
*   **Pause and Restart:** Easily pause the game to take a break or restart a new round at any time.
*   **Sound Effects:** Audio feedback for crashes and "level-up" milestones enhances the gameplay experience.
*   **Clean UI:** A simple and intuitive user interface for the start screen, game over screen, and leaderboard.

## 📸 Screenshot

![Game Screenshot](./game-screenshot.png)

*(To add your own screenshot, replace `game-screenshot.png` with the path to your image file.)*

## 🛠️ Tech Stack

This project is built using only frontend technologies, with no external libraries or frameworks.

*   **HTML5:** For the core structure and layout of the game.
*   **CSS3:** For styling the game elements, animations, and responsive design.
*   **Vanilla JavaScript:** For all game logic, including the game loop, player controls, collision detection, and DOM manipulation.

## 🏁 How to Play / Run Locally

No complex setup or build process is required!

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/your-repo-name.git
    ```
2.  **Navigate to the project directory:**
    ```bash
    cd your-repo-name
    ```
3.  **Open the `index.html` file:**
    Simply open the `index.html` file in your favorite web browser (like Chrome, Firefox, or Safari) to start playing.

## 🔮 Future Enhancements (Planned)

While the current version is a complete client-side game, the following features are planned to transform this into a full-stack web application:

*   **Backend API:** Build a server using Node.js and Express to handle game logic centrally.
*   **MongoDB Database:** Move from `localStorage` to a MongoDB database to store all user and score data.
*   **User Authentication:** Implement a full user registration and login system to give each player a unique, persistent identity.
*   **Global Leaderboard:** With a centralized database, the leaderboard will become global, allowing players from all over the world to compete.

