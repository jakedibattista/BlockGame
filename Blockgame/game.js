const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
canvas.width = 800;
canvas.height = 400;
document.body.appendChild(canvas);

const player = {
    x: 50,
    y: 300,
    width: 30,
    height: 30,
    jumping: false,
    velocityY: 0
};

const obstacles = [];
let score = 0;
let gameOver = false;

const gravity = 0.8;
const jumpForce = -15;
const obstacleSpeed = 5;

function createObstacle() {
    const height = Math.random() * 100 + 50; // Random height between 50-150
    obstacles.push({
        x: canvas.width,
        y: canvas.height - height,
        width: 30,
        height: height
    });
}

function update() {
    if (gameOver) return;

    // Player physics
    if (player.jumping) {
        player.velocityY += gravity;
        player.y += player.velocityY;

        if (player.y >= 300) { // Ground level
            player.y = 300;
            player.jumping = false;
            player.velocityY = 0;
        }
    }

    // Obstacle movement
    for (let i = obstacles.length - 1; i >= 0; i--) {
        obstacles[i].x -= obstacleSpeed;

        // Remove off-screen obstacles
        if (obstacles[i].x + obstacles[i].width < 0) {
            obstacles.splice(i, 1);
            score++;
        }

        // Collision detection
        if (checkCollision(player, obstacles[i])) {
            gameOver = true;
        }
    }

    // Create new obstacles
    if (obstacles.length === 0 || obstacles[obstacles.length - 1].x < canvas.width - 300) {
        createObstacle();
    }
}

function checkCollision(rect1, rect2) {
    return rect1.x < rect2.x + rect2.width &&
           rect1.x + rect1.width > rect2.x &&
           rect1.y < rect2.y + rect2.height &&
           rect1.y + rect1.height > rect2.y;
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw ground
    ctx.fillStyle = '#333';
    ctx.fillRect(0, canvas.height - 20, canvas.width, 20);

    // Draw player
    ctx.fillStyle = '#00f';
    ctx.fillRect(player.x, player.y, player.width, player.height);

    // Draw obstacles
    ctx.fillStyle = '#f00';
    obstacles.forEach(obstacle => {
        ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
    });

    // Draw score
    ctx.fillStyle = '#000';
    ctx.font = '20px Arial';
    ctx.fillText(`Score: ${score}`, 10, 30);

    if (gameOver) {
        ctx.fillStyle = '#000';
        ctx.font = '40px Arial';
        ctx.fillText('Game Over!', canvas.width/2 - 100, canvas.height/2);
    }
}

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

// Event listeners
document.addEventListener('keydown', (event) => {
    if (event.code === 'Space' && !player.jumping) {
        player.jumping = true;
        player.velocityY = jumpForce;
    }
});

// Start game
gameLoop();
// Create start screen elements
const startScreen = document.createElement('div');
startScreen.id = 'startScreen';
startScreen.className = 'start-screen';

const title = document.createElement('h1');
title.className = 'game-title';
title.textContent = 'Block Game';

const instructions = document.createElement('div');
instructions.className = 'instructions';
instructions.innerHTML = `
    <p>Press SPACE to jump</p>
    <p>Avoid the red blocks</p>
    <p>See how far you can go!</p>
`;

const startButton = document.createElement('button');
startButton.className = 'start-button';
startButton.textContent = 'Start Game';

const highScoreDisplay = document.createElement('div');
highScoreDisplay.className = 'high-score';
highScoreDisplay.textContent = `High Score: ${localStorage.getItem('highScore') || 0}`;

startScreen.appendChild(title);
startScreen.appendChild(instructions);
startScreen.appendChild(startButton);
startScreen.appendChild(highScoreDisplay);

document.querySelector('.game-container').appendChild(startScreen);

// Hide canvas initially
canvas.style.display = 'none';

// Start button click handler
startButton.addEventListener('click', () => {
    startScreen.style.display = 'none';
    canvas.style.display = 'block';
    gameLoop();
});

// Stop the game loop initially
cancelAnimationFrame(gameLoop);
