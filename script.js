// =================================================================
// SECTION 1: CONFIGURATION & GAME STATE VARIABLES
// =================================================================

// --- Game Constants ---
const SCORE_RATE = 1;
const NUM_LANES = 5;

// --- Difficulty Settings ---
let enemySpeed = 4;             // Initial speed of enemy cars
const SPEED_INCREASE = 0.25;    // How much speed increases at each milestone
const MILESTONE_POINTS = 500;   // Score needed to reach a new difficulty milestone
const SPAWN_RATE_DECREASE = 5;  // How much the spawn interval decreases at each milestone
let ENEMY_SPAWN_INTERVAL = 90;  // Initial wait time (in frames) between enemy spawns

// --- Game State Variables --
let score = 0;
let lastMilestone = 0;
let enemySpawnTimer = 0;
let gameOver = false;
let paused = false;
let animationId = null;
let playerName = "";

// --- Leaderbard ---
let leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];

// =================================================================
// SECTION 2: DOM ELEMENTS
// =================================================================

// --- Canvas Setup ---
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// --- DOM Element References ---
const startBtn = document.getElementById("startButton");
const startScreen = document.getElementById("startScreen");
const topButtons = document.getElementById("topButtons");
const gameOverScreen = document.getElementById("gameOverScreen");
const finalScoreText = document.getElementById("finalScore");
const highestScoreText = document.getElementById("highestScore");
const playAgainBtn = document.getElementById("playAgainButton");
const overlayDim = document.getElementById("overlayDim");
const pauseBtn = document.getElementById("pauseButton");
const restartBtn = document.getElementById("restartButton");

// --- Asset Loading (Images & Sounds) ---
const playerCarImg = new Image();
playerCarImg.src = "assets/playerCar.png";
const enemyCarImg = new Image();
enemyCarImg.src = "assets/enemyCar.png";
const crashSound = new Audio("assets/crash.mp3");
const levelUpSound = new Audio("assets/level-up.mp3");

// =================================================================
// SECTION 3: CORE GAME SETUP
// =================================================================

// - - Player Car Object --
const playerCar = {
    width: 42,
    height: 90,
    currentLane: 2,
    x: 0, 
    y: canvas.height - 130, // Position the car near the bottom
};

// --- Lane Calculation ---
const lanes = [];
const laneWidth = canvas.width / NUM_LANES;
for (let i = 0; i < NUM_LANES; i++) {
    lanes.push((i * laneWidth) + (laneWidth / 2));
}
playerCar.x = lanes[playerCar.currentLane] - (playerCar.width / 2); // Set initial car position

// --- Enemy Car Array ---
const enemyCars = [];

// --- Road Line Settings ---
const lineWidth = 4;
const lineLength = 60;
const lineGap = 100; // Gap between lines
let lineOffset = 0; // Used to animate downward scrolling

// =================================================================
// SECTION 4: MAIN GAME LOOP
// =================================================================

function gameLoop() {
    if (gameOver) {
        return;
    }
    if (paused) {
        return; // If the game is paused, skip the rest of the loop
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height); // clear the canvas to draw new frame

    score += SCORE_RATE; // increment score after every frame

    // --- Difficulty Increase Logic ---
    if (score - lastMilestone >= MILESTONE_POINTS) {
        // increase enemy speed
        enemySpeed += SPEED_INCREASE;

        // decrease enemy spawn interval to make them appear faster
        if (ENEMY_SPAWN_INTERVAL > 30) {
            ENEMY_SPAWN_INTERVAL -= SPAWN_RATE_DECREASE;
        }

        levelUpSound.play();
        lastMilestone = score; // Set the new milestone checkpoint
    }

    // --- Drawing ---
    drawRoad();
    drawPlayerCar();
    drawEnemyCars();
    drawScore();

    // --- Updates & Mechanics ---
    updateEnemyCars();
    checkCollisions();

    // --- Enemy Spawning Logic ---
    enemySpawnTimer++;
    if (enemySpawnTimer >= ENEMY_SPAWN_INTERVAL) {
        createEnemyCar(); // when the timer reaches target, spawn a new car
        enemySpawnTimer = 0; // and reset the timer
    }

    // Request the next frame to continue the loop
    animationId = requestAnimationFrame(gameLoop);
}


// =================================================================
// SECTION 5: GAME LOGIC & HELPER FUNCTIONS
// =================================================================

// --- Drawing Functions ---
function drawRoad() {
    ctx.fillStyle = 'white';
    const centerX = canvas.width / 2 - lineWidth / 2;

    for (let y = -lineLength; y < canvas.height; y += lineLength + lineGap) {
        ctx.fillRect(centerX, y + lineOffset, lineWidth, lineLength);
    }

    // Update lineOffset for animation
    lineOffset += 2; // Speed of road scroll
    if (lineOffset >= lineLength + lineGap) {
        lineOffset = 0;
    }
}

function drawPlayerCar() {
    ctx.drawImage(playerCarImg, playerCar.x, playerCar.y, playerCar.width, playerCar.height);
}

function drawEnemyCars() {
    for (const enemy of enemyCars) {
        ctx.drawImage(enemyCarImg, enemy.x, enemy.y, enemy.width, enemy.height);
    }
}

function drawScore() {
    const text = "Score: " + score;
    ctx.font = "24px Arial";
    ctx.fillStyle = "white";
    ctx.fillText(text, 10, 30); // Draw score at the top left
}

// --- Enemy & Collision Functions ---
function createEnemyCar() {
    const carWidth = 42;
    const carHeight = 90;
    const randomLane = Math.floor(Math.random() * NUM_LANES);

    // This logic prevents the first two cars from spawning directly in the player's lane
    if (enemyCars.length < 2 && playerCar.currentLane === randomLane) {
        const newLane = (randomLane + 1) % NUM_LANES;
        const x = lanes[newLane] - carWidth / 2;
        const y = -carHeight;
        enemyCars.push({ x, y, width: carWidth, height: carHeight });
    } else {
        const x = lanes[randomLane] - (carWidth / 2); // Center the enemy in the random lane
        const y = -carHeight;
        enemyCars.push({ x, y, width: carWidth, height: carHeight });
    }
}

function updateEnemyCars() {
    for (let i = enemyCars.length - 1; i >= 0; i--) {
        enemyCars[i].y += enemySpeed;

        // removes the enemy car from the array if they move off the screen
        if (enemyCars[i].y > canvas.height) {
            enemyCars.splice(i, 1);
        }
    }
}

function checkCollisions() {
    for (const enemy of enemyCars) {
        const hit =
            playerCar.x < enemy.x + enemy.width &&
            playerCar.x + playerCar.width > enemy.x &&
            playerCar.y < enemy.y + enemy.height &&
            playerCar.y + playerCar.height > enemy.y;

        if (hit) {
            crashSound.play();
            gameOver = true;
            handleGameOver();
        }
    }
}

// =================================================================
// SECTION 6: UI, STATE MANAGEMENT & UTILITIES
// =================================================================

function handleGameOver() {

  ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Save or update leaderboard
    
    const existing = leaderboard.find(entry => entry.name.toLowerCase() === playerName.toLocaleLowerCase());
    let highScore = score;
    if (!existing || score > existing.score) {
        if (existing) {
            existing.score = score;
        } else {
            leaderboard.push({ name: playerName, score });
        }
        localStorage.setItem("leaderboard", JSON.stringify(leaderboard));
        updateLeaderboardDisplay();
    } else {
        highScore = existing.score;
    }

    // Show Game Over screen
    overlayDim.style.display = "block";
    finalScoreText.textContent = score;
    highestScoreText.textContent = highScore;
    gameOverScreen.style.display = "flex";
    topButtons.style.display = "none";
}

function updateLeaderboardDisplay() {
    const list = document.getElementById("leaderboardList");
    list.innerHTML = "";

    leaderboard
        .sort((a, b) => b.score - a.score) // Sort from high to low
        .slice(0, 5)                       //  Show only top 5
        .forEach((entry, index) => {
            const li = document.createElement("li");
            li.innerText = `${index + 1}. ${" " + entry.name}: ${" " + entry.score}`;
            list.appendChild(li);
        });
}

/** Resets all game variables to their initial state. */
function resetGame() {
    if (animationId) {
        cancelAnimationFrame(animationId);
    }
    score = 0;
    enemySpeed = 4;
    lastMilestone = 0;
    enemyCars.length = 0; // Clear enemy cars
    ENEMY_SPAWN_INTERVAL = 90;
    enemySpawnTimer = 0;
    gameOver = false;
    paused = false;

    // Reset player car position
    playerCar.currentLane = 2;
    playerCar.x = lanes[playerCar.currentLane] - (playerCar.width / 2);
    playerCar.y = canvas.height - 130;

    // Reset UI elements
    pauseBtn.innerText = "Pause";
    overlayDim.style.display = "none";
    gameOverScreen.style.display = "none";
    topButtons.style.display = "flex";

    updateLeaderboardDisplay();
}

function formatName(name) {
    return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
}


// =================================================================
// SECTION 7: EVENT LISTENERS
// =================================================================

// --- Button Clicks ---
startBtn.addEventListener("click", () => {
    const input = document.getElementById("playerNameInput");
    const name = input.value.trim();
    if (name === "") {
        alert("Please enter your name to start the game.");
        return;
    }
    playerName = formatName(name);
    startScreen.style.display = "none"; // Hide the start screen
    topButtons.style.display = "flex"; // Show the top buttons

    // Waiting for images to be fully loaded before starting
    if (playerCarImg.complete && enemyCarImg.complete) {
        animationId = requestAnimationFrame(gameLoop);
    } else {
        // Set up onload events if images aren't ready yet
        playerCarImg.onload = () => {
            if (enemyCarImg.complete) animationId = requestAnimationFrame(gameLoop);
        };
        enemyCarImg.onload = () => {
            if (playerCarImg.complete) animationId = requestAnimationFrame(gameLoop);
        };
    }
});

playAgainBtn.addEventListener("click", () => {
    resetGame();
    // After resetting, hide game elements and show the start screen again
    topButtons.style.display = "none";
    startScreen.style.display = "block";
});

restartBtn.addEventListener("click", () => {
    resetGame();
    // Restart the game loop immediately
    animationId = requestAnimationFrame(gameLoop);
});

pauseBtn.addEventListener("click", () => {
    paused = !paused;
    pauseBtn.innerText = paused ? "Play" : "Pause";

    // If un-pausing, restart the game loop
    if (!paused && !gameOver) {
        animationId = requestAnimationFrame(gameLoop);
    }
});

// --- Player Controls ---
document.addEventListener('keydown', (event) => {
    if (gameOver || paused) return;

    if (event.key === 'ArrowLeft') {
        if (playerCar.currentLane > 0) {
            playerCar.currentLane--;
        }
    } else if (event.key === 'ArrowRight') {
        if (playerCar.currentLane < NUM_LANES - 1) {
            playerCar.currentLane++;
        }
    }
    playerCar.x = lanes[playerCar.currentLane] - (playerCar.width / 2);
});

document.getElementById("leftButton").addEventListener("click", () => {
    if (gameOver || paused) return;
    if (playerCar.currentLane > 0) {
        playerCar.currentLane--;
        playerCar.x = lanes[playerCar.currentLane] - (playerCar.width / 2);
    }
});

document.getElementById("rightButton").addEventListener("click", () => {
    if (gameOver || paused) return;
    if (playerCar.currentLane < NUM_LANES - 1) {
        playerCar.currentLane++;
        playerCar.x = lanes[playerCar.currentLane] - (playerCar.width / 2);
    }
});

// =================================================================
// SECTION 8: INITIALIZATION
// =================================================================

// Display the leaderboard when the page first loads
updateLeaderboardDisplay();
