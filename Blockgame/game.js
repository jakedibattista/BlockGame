// Game canvas setup
const gameContainer = document.querySelector('.game-container');
const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
canvas.width = 800;
canvas.height = 600;

// Game variables
let gameStarted = false;
let score = 0;
let player = {
    x: 100,
    y: 500,
    width: 40,
    height: 40,
    jumping: false,
    jumpPower: -15,
    velocity: 0,
    gravity: 0.8
};

let obstacles = [];
const obstacleSpeed = 5;

// Create start screen
const startScreen = document.createElement('div');
startScreen.style.position = 'absolute';
startScreen.style.width = '100%';
startScreen.style.height = '100%';
startScreen.style.display = 'flex';
startScreen.style.flexDirection = 'column';
startScreen.style.justifyContent = 'center';
startScreen.style.alignItems = 'center';
startScreen.style.background = 'rgba(0, 0, 0, 0.8)';
startScreen.style.color = 'white';
startScreen.innerHTML = `
    <h1 style="font-size: 48px; margin-bottom: 20px;">Jake's Block Game</h1>
    <button style="padding: 15px 30px; font-size: 20px; cursor: pointer; background: #4CAF50; border: none; color: white; border-radius: 5px;">Start Game</button>
`;

// Add elements to container
gameContainer.appendChild(canvas);
gameContainer.appendChild(startScreen);

// Event listeners
startScreen.querySelector('button').addEventListener('click', startGame);
document.addEventListener('keydown', (e) => {
    if (e.code === 'Space' && !player.jumping && gameStarted) {
        player.jumping = true;
        player.velocity = player.jumpPower;
    }
});

function startGame() {
    gameStarted = true;
    startScreen.style.display = 'none';
    requestAnimationFrame(gameLoop);
    spawnObstacle();
}

function spawnObstacle() {
    if (gameStarted) {
        obstacles.push({
            x: canvas.width,
            y: 500,
            width: 30,
            height: 40
        });
        setTimeout(spawnObstacle, Math.random() * 1000 + 1500);
    }
}

function drawPlayer() {
    ctx.fillStyle = '#4CAF50';
    ctx.fillRect(player.x, player.y, player.width, player.height);
}

function drawObstacles() {
    ctx.fillStyle = '#FF4444';
    obstacles.forEach(obstacle => {
        ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
    });
}

function drawScore() {
    ctx.fillStyle = 'white';
    ctx.font = '24px Arial';
    ctx.fillText(`Score: ${score}`, 20, 40);
}

function updatePlayer() {
    if (player.jumping) {
        player.velocity += player.gravity;
        player.y += player.velocity;

        if (player.y >= 500) {
            player.y = 500;
            player.jumping = false;
            player.velocity = 0;
        }
    }
}

function updateObstacles() {
    obstacles.forEach((obstacle, index) => {
        obstacle.x -= obstacleSpeed;
        
        // Remove off-screen obstacles
        if (obstacle.x + obstacle.width < 0) {
            obstacles.splice(index, 1);
            score++;
        }

        // Collision detection
        if (player.x < obstacle.x + obstacle.width &&
            player.x + player.width > obstacle.x &&
            player.y < obstacle.y + obstacle.height &&
            player.y + player.height > obstacle.y) {
            gameOver();
        }
    });
}

function gameOver() {
    gameStarted = false;
    obstacles = [];
    score = 0;
    player.y = 500;
    player.jumping = false;
    player.velocity = 0;
    startScreen.style.display = 'flex';
}

function drawGround() {
    ctx.fillStyle = '#333';
    ctx.fillRect(0, 540, canvas.width, 60);
}

function gameLoop() {
    if (gameStarted) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        drawGround();
        updatePlayer();
        updateObstacles();
        drawPlayer();
        drawObstacles();
        drawScore();
        
        requestAnimationFrame(gameLoop);
    }
}

