document.addEventListener('DOMContentLoaded', () => {
    const gameContainer = document.querySelector('.game-container');
    
    // Create a start screen
    const startScreen = document.createElement('div');
    startScreen.style.cssText = `
        color: white;
        text-align: center;
        padding: 20px;
    `;
    startScreen.innerHTML = `
        <h1>Block Game</h1>
        <button onclick="startGame()">Start Game</button>
    `;
    
    gameContainer.appendChild(startScreen);
});

function startGame() {
    console.log('Game started!');
    // Add your game logic here
} 
