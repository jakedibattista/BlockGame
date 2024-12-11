// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Remove the test message if it exists
    const container = document.querySelector('.game-container');
    container.innerHTML = `
        <div class="start-screen" id="startScreen">
            <h1>Mario-style Platform Game</h1>
            <button id="startButton">Start Game</button>
        </div>
        <canvas id="gameCanvas" width="800" height="600" style="display: none;"></canvas>
    `;

    // Get DOM elements
    const startScreen = document.getElementById('startScreen');
    const startButton = document.getElementById('startButton');
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');

    // Game constants
    const GRAVITY = 0.5;
    const JUMP_FORCE = -12;
    const MOVEMENT_SPEED = 5;

    // Player object
    const player = {
        x: 50,
        y: canvas.height - 100,
        width: 32,
        height: 48,
        velocityX: 0,
        velocityY: 0,
        isJumping: false
    };

    // Game state
    let gameLoopId;
    let keys = {};

    // Handle keyboard input
    document.addEventListener('keydown', (e) => {
        keys[e.key] = true;
    });

    document.addEventListener('keyup', (e) => {
        keys[e.key] = false;
    });

    function updateGame() {
        // Player movement
        if (keys['ArrowRight']) {
            player.velocityX = MOVEMENT_SPEED;
        } else if (keys['ArrowLeft']) {
            player.velocityX = -MOVEMENT_SPEED;
        } else {
            player.velocityX = 0;
        }

        // Jumping
        if (keys[' '] && !player.isJumping) {
            player.velocityY = JUMP_FORCE;
            player.isJumping = true;
        }

        // Apply gravity
        player.velocityY += GRAVITY;

        // Update position
        player.x += player.velocityX;
        player.y += player.velocityY;

        // Basic ground collision
        if (player.y > canvas.height - player.height) {
            player.y = canvas.height - player.height;
            player.velocityY = 0;
            player.isJumping = false;
        }

        // Keep player in bounds
        if (player.x < 0) player.x = 0;
        if (player.x > canvas.width - player.width) player.x = canvas.width - player.width;
    }

    function drawGame() {
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw player (simple rectangle for now)
        ctx.fillStyle = 'red';
        ctx.fillRect(player.x, player.y, player.width, player.height);

        // Draw ground
        ctx.fillStyle = 'green';
        ctx.fillRect(0, canvas.height - 20, canvas.width, 20);
    }

    function gameLoop() {
        updateGame();
        drawGame();
        gameLoopId = requestAnimationFrame(gameLoop);
    }

    // Add click handler for the start button
    startButton.addEventListener('click', () => {
        startScreen.style.display = 'none';
        canvas.style.display = 'block';
        gameLoop();
    });
});
