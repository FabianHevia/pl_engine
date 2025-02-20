// Motor de juego básico, creado por Fabián Hevia
// Primera version de un GameEngine

class GameEngine {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.entities = [];
        this.gravity = 0.5;
        this.keys = {};
        
        // Configurar event listeners para el teclado
        window.addEventListener('keydown', (e) => this.keys[e.code] = true);
        window.addEventListener('keyup', (e) => this.keys[e.code] = false);
    }

    // Añadir una entidad al juego
    addEntity(entity) {
        this.entities.push(entity);
    }

    // Bucle principal del juego
    gameLoop() {
        this.update();
        this.render();
        requestAnimationFrame(() => this.gameLoop());
    }

    // Actualizar estado del juego
    update() {
        for (let entity of this.entities) {
            if (entity.hasGravity) {
                entity.velocityY += this.gravity;
            }
            
            entity.update(this);
            
            // Detectar colisiones
            for (let other of this.entities) {
                if (entity !== other) {
                    if (this.checkCollision(entity, other)) {
                        entity.onCollision(other);
                    }
                }
            }
        }
    }

    // Renderizar el juego
    render() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        for (let entity of this.entities) {
            entity.render(this.ctx);
        }
    }

    // Detector de colisiones básico
    checkCollision(entity1, entity2) {
        return entity1.x < entity2.x + entity2.width &&
               entity1.x + entity1.width > entity2.x &&
               entity1.y < entity2.y + entity2.height &&
               entity1.y + entity1.height > entity2.y;
    }

    // Iniciar el juego
    start() {
        this.gameLoop();
    }
}

// Clase base para entidades del juego
class GameObject {
    constructor(x, y, width, height, color) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;
        this.velocityX = 0;
        this.velocityY = 0;
        this.hasGravity = false;
    }

    update(engine) {
        this.x += this.velocityX;
        this.y += this.velocityY;
    }

    render(ctx) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    onCollision(other) {
        // Implementar en clases hijas
    }
}

// Clase para el jugador
class Player extends GameObject {
    constructor(x, y) {
        super(x, y, 32, 32, 'red');
        this.hasGravity = true;
        this.jumpForce = -12;
        this.moveSpeed = 5;
        this.isJumping = false;
    }

    update(engine) {
        // Movimiento horizontal
        if (engine.keys['ArrowLeft']) {
            this.velocityX = -this.moveSpeed;
        } else if (engine.keys['ArrowRight']) {
            this.velocityX = this.moveSpeed;
        } else {
            this.velocityX = 0;
        }

        // Salto
        if (engine.keys['Space'] && !this.isJumping) {
            this.velocityY = this.jumpForce;
            this.isJumping = true;
        }

        super.update(engine);
    }

    onCollision(other) {
        // Manejo básico de colisiones
        if (other instanceof Platform) {
            // Colisión con plataforma
            if (this.velocityY > 0) {
                this.y = other.y - this.height;
                this.velocityY = 0;
                this.isJumping = false;
            }
        }
    }
}

// Clase para plataformas
class Platform extends GameObject {
    constructor(x, y, width) {
        super(x, y, width, 16, 'green');
    }
}