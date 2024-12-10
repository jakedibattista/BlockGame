class Game {
    constructor() {
        this.gameContainer = document.querySelector('.game-container');
        this.canvas = document.createElement('canvas');
        this.canvas.width = 800;
        this.canvas.height = 600;
        this.ctx = this.canvas.getContext('2d');
        
        // Game objects
        this.paddle = {
            width: 100,
            height: 20,
            x: 350,
            y: 550
        };
        
        this.ball = {
            x: 400,
            y: 300,
            radius: 10,
            dx: 4,
            dy: -4
        };
        
        this.blocks = [];
        this.blockRows = 5;
        this.blockCols = 8;
        
        this.gameActive = false;
        this.score = 0;
        
        this.init();
    }
    
    init() {
        this.createStartScreen();
        this.createBlocks();
        this.setupEventListeners();
    }
    
    createStartScreen() {
        const startScreen = document.createElement('div');
        startScreen.className = 'start-screen';
        
        const startButton = document.createElement('button');
        startButton.textContent = 'Start Game';
        startButton.addEventListener('click', () => this.startGame());
        
        startScreen.appendChild(startButton);
        this.gameContainer.appendChild(startScreen);
    }
    
    createBlocks() {
        for(let i = 0; i < this.blockRows; i++) {
            for(let j = 0; j < this.blockCols; j++) {
                this.blocks.push({
                    x: j * 90 + 60,
                    y: i * 30 + 50,
                    width: 80,
                    height: 20,
                    active: true
                });
            }
        }
    }
    
    setupEventListeners() {
        document.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            
            // Keep paddle within canvas bounds
            if(mouseX >= 0 && mouseX <= this.canvas.width - this.paddle.width) {
                this.paddle.x = mouseX;
            }
        });
    }
    
    startGame() {
        this.gameContainer.innerHTML = '';
        this.gameContainer.appendChild(this.canvas);
        this.gameActive = true;
        this.gameLoop();
    }
    
    update() {
        // Move ball
        this.ball.x += this.ball.dx;
        this.ball.y += this.ball.dy;
        
        // Ball collision with walls
        if(this.ball.x + this.ball.radius > this.canvas.width || this.ball.x - this.ball.radius < 0) {
            this.ball.dx *= -1;
        }
        if(this.ball.y - this.ball.radius < 0) {
            this.ball.dy *= -1;
        }
        
        // Ball collision with paddle
        if(this.ball.y + this.ball.radius > this.paddle.y &&
           this.ball.x > this.paddle.x &&
           this.ball.x < this.paddle.x + this.paddle.width) {
            this.ball.dy *= -1;
        }
        
        // Ball collision with blocks
        this.blocks.forEach(block => {
            if(block.active &&
               this.ball.x > block.x &&
               this.ball.x < block.x + block.width &&
               this.ball.y > block.y &&
               this.ball.y < block.y + block.height) {
                block.active = false;
                this.ball.dy *= -1;
                this.score += 10;
            }
        });
        
        // Game over condition
        if(this.ball.y + this.ball.radius > this.canvas.height) {
            this.gameActive = false;
            this.showGameOver();
        }
    }
    
    draw() {
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw paddle
        this.ctx.fillStyle = '#4CAF50';
        this.ctx.fillRect(this.paddle.x, this.paddle.y, this.paddle.width, this.paddle.height);
        
        // Draw ball
        this.ctx.beginPath();
        this.ctx.arc(this.ball.x, this.ball.y, this.ball.radius, 0, Math.PI * 2);
        this.ctx.fillStyle = '#4CAF50';
        this.ctx.fill();
        this.ctx.closePath();
        
        // Draw blocks
        this.blocks.forEach(block => {
            if(block.active) {
                this.ctx.fillStyle = '#4CAF50';
                this.ctx.fillRect(block.x, block.y, block.width, block.height);
            }
        });
        
        // Draw score
        this.ctx.fillStyle = '#000';
        this.ctx.font = '20px Arial';
        this.ctx.fillText(`Score: ${this.score}`, 20, 30);
    }
    
    gameLoop() {
        if(this.gameActive) {
            this.update();
            this.draw();
            requestAnimationFrame(() => this.gameLoop());
        }
    }
    
    showGameOver() {
        const gameOver = document.createElement('div');
        gameOver.className = 'start-screen';
        gameOver.innerHTML = `
            <h1>Game Over</h1>
            <p>Final Score: ${this.score}</p>
            <button onclick="location.reload()">Play Again</button>
        `;
        this.gameContainer.appendChild(gameOver);
    }
}

// Start the game when the page loads
window.onload = () => new Game();
