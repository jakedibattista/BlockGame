class Game {
    constructor() {
        // Simplified canvas setup
        this.canvas = document.createElement('canvas');
        this.canvas.width = 400;  // Reduced canvas size
        this.canvas.height = 400;
        this.ctx = this.canvas.getContext('2d');
        document.body.appendChild(this.canvas);  // Direct append to body
        
        // Simplified paddle
        this.paddle = {
            width: 60,
            height: 10,
            x: 170,
            y: 350
        };
        
        // Simplified ball
        this.ball = {
            x: 200,
            y: 200,
            radius: 5,
            dx: 3,
            dy: -3
        };
        
        // Simplified blocks
        this.blocks = [];
        this.blockRows = 3;  // Fewer rows
        this.blockCols = 5;  // Fewer columns
        
        this.score = 0;
        this.gameActive = true;
        
        // Initialize and start immediately
        this.createBlocks();
        this.setupEventListeners();
        this.gameLoop();
    }
    
    createBlocks() {
        for(let i = 0; i < this.blockRows; i++) {
            for(let j = 0; j < this.blockCols; j++) {
                this.blocks.push({
                    x: j * 70 + 30,
                    y: i * 30 + 30,
                    width: 60,
                    height: 15,
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
        document.body.appendChild(gameOver);
    }
}

// Start game immediately
new Game();
