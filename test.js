// En tu HTML necesitas un canvas:
// <canvas id="gameCanvas" width="800" height="600"></canvas>

// Inicializar el motor
const game = new GameEngine('gameCanvas');

// Crear jugador
const player = new Player(100, 100);
game.addEntity(player);

// Crear algunas plataformas
const platform1 = new Platform(50, 400, 200);
const platform2 = new Platform(300, 300, 200);
game.addEntity(platform1);
game.addEntity(platform2);

// Iniciar el juego
game.start();