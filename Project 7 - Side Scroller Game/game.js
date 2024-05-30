window.addEventListener('load', () => {
    const canvas = document.getElementById('canvas-el');
    const ctx = canvas.getContext('2d');
    canvas.width = 800;
    canvas.height = 720;
    const fullScreenButton = document.getElementById('fullScreenButton')

    let enemies = [];
    let score = 0;
    let gameOver = false;

    class InputHandler {
        constructor() {
            this.keys = [];
            this.touchY = '';
            this.touchThreshold = 20;
            window.addEventListener('keydown', (e) => {
                if ((e.key === 'ArrowDown' ||
                    e.key === 'ArrowUp' ||
                    e.key === 'ArrowLeft' ||
                    e.key === 'ArrowRight')
                    && this.keys.indexOf(e.key) === -1) {
                    this.keys.push(e.key);
                } else if (e.key === 'Enter' || window.addEventListener('click') && gameOver) restartGame();
            });

            
            window.addEventListener('click', () => {
                if (gameOver) {
                    restartGame();
                }
            });

            window.addEventListener('keyup', (e) => {
                if (e.key === 'ArrowDown' ||
                    e.key === 'ArrowUp' ||
                    e.key === 'ArrowLeft' ||
                    e.key === 'ArrowRight') {
                    this.keys.splice(this.keys.indexOf(e.key), 1);
                }
            });
            window.addEventListener('touchstart', (e) => {
                this.touchY = e.changedTouches[0].pageY;
            });
            window.addEventListener('touchmove', (e) => {
                const swipeDistance = e.changedTouches[0].pageY - this.touchY;
                if (swipeDistance < -this.touchThreshold && this.keys.indexOf('swipe up') === -1) this.keys.push('swipe up');
                else if (swipeDistance > this.touchThreshold && this.keys.indexOf('swipe down') === -1) {
                    this.keys.push('swipe down');
                    if (gameOver) restartGame();
                }
            });
            window.addEventListener('touchend', (e) => {
                this.keys.splice(this.keys.indexOf('swipe up'), 1);
                this.keys.splice(this.keys.indexOf('swipe down'), 1);
            });
        }
    }

    class Player {
        constructor(gameWidth, gameHeight) {
            this.gameHeight = gameHeight;
            this.gameWidth = gameWidth;
            this.width = 200;
            this.height = 200;
            this.x = 0;
            this.y = this.gameHeight - this.height;
            this.image = playerImage; // Assume this image is already loaded elsewhere

            // Animation sprite
            this.frameX = 0;
            this.frameY = 0;
            this.maxFrame = 0;
            this.fps = 20;
            this.frameTimer = 0;
            this.frameInterval = 1000 / this.fps;

            // Movement
            this.speed = 1;
            this.velocityY = 0;
            this.gravity = 1;
        }

        restart() {
            this.x = 100;
            this.y = this.gameHeight - this.height;
            this.maxFrame = 8;
            this.frameY = 0;
        }

        draw(context) {
            context.strokeStyle = 'blue';
            // context.strokeRect(this.x, this.y, this.width, this.height);
            // context.beginPath();
            // context.arc(this.x + this.width * 0.5, this.y + this.height * 0.5, this.width * 0.5, 0, Math.PI * 2);
            // context.stroke();
            // context.strokeStyle = 'blue';
            // context.strokeRect(this.x, this.y, this.width, this.height);
            context.beginPath();
            context.arc(this.x + this.width * 0.5, this.y + this.height * 0.5, this.width * 0.3, 0, Math.PI * 2);
            context.stroke();
            context.drawImage(this.image, this.frameX * this.width, this.frameY * this.height, this.width, this.height, this.x, this.y, this.width, this.height);
        }

        update(input, deltaTime, enemies) {
            // Collision detection
            enemies.forEach((enemy) => {
                if (isColliding(this, enemy)) {
                    gameOver = true;
                }
            });

            // Sprite animation
            if (this.frameTimer > this.frameInterval) {
                if (this.frameX >= this.maxFrame) this.frameX = 0;
                else this.frameX++;
                this.frameTimer = 0;
            } else {
                this.frameTimer += deltaTime;
            }

            // Controls
            if (input.keys.indexOf('ArrowRight') > -1) {
                this.speed = 5;
            } else if (input.keys.indexOf('ArrowLeft') > -1) {
                this.speed = -5;
            } else if (input.keys.indexOf('ArrowUp') > -1 && this.onGround()) {
                this.velocityY -= 32;
            } else {
                this.speed = 0;
            }

            // Horizontal movement and boundaries
            this.x += this.speed;
            if (this.x < 0) this.x = 0;
            else if (this.x > this.gameWidth - this.width) this.x = this.gameWidth - this.width;

            // Vertical movement and boundaries
            this.y += this.velocityY;
            if (!this.onGround()) {
                this.velocityY += this.gravity;
                this.maxFrame = 5;
                this.frameY = 1;
            } else {
                this.velocityY = 0;
                this.maxFrame = 8;
                this.frameY = 0;
            }
            if (this.y > this.gameHeight - this.height) this.y = this.gameHeight - this.height;
        }

        onGround() {
            return this.y >= this.gameHeight - this.height;
        }
    }

    class Background {
        constructor(gameWidth, gameHeight) {
            this.gameHeight = gameHeight;
            this.gameWidth = gameWidth;
            this.image = backgroundImage; // Assume this image is already loaded elsewhere
            this.x = 0;
            this.y = 0;
            this.width = 2400;
            this.height = 720;
            this.speed = 7;
        }

        restart() {
            this.x = 0;
        }

        draw(context) {
            context.drawImage(this.image, this.x, this.y, this.width, this.height);
            context.drawImage(this.image, this.x + this.width - this.speed, this.y, this.width, this.height);
        }

        update() {
            this.x -= this.speed;
            if (this.x < 0 - this.width) this.x = 0;
        }
    }

    class Enemy {
        constructor(gameWidth, gameHeight) {
            this.gameHeight = gameHeight;
            this.gameWidth = gameWidth;
            this.width = 160;
            this.height = 119;
            this.image = enemyImage; // Assume this image is already loaded elsewhere
            this.x = this.gameWidth;
            this.y = this.gameHeight - this.height;

            this.frameX = 0;
            this.frameY = 0;

            this.speed = 8;

            this.maxFrame = 5;
            this.fps = 20;
            this.frameTimer = 0;
            this.frameInterval = 1000 / this.fps;

            this.markedForDeletion = false;
        }

        draw(context) {
            context.strokeStyle = 'red';
            // context.strokeRect(this.x, this.y, this.width, this.height);
            // context.beginPath();
            // context.arc(this.x + this.width * 0.5, this.y + this.height * 0.5, this.width * 0.5, 0, Math.PI * 2);
            // context.stroke();
            // context.strokeStyle = 'blue';
            // context.strokeRect(this.x, this.y, this.width, this.height);
            context.beginPath();
            context.arc(this.x + this.width * 0.5, this.y + this.height * 0.5, this.width * 0.3, 0, Math.PI * 2);
            context.stroke();
            context.drawImage(this.image, this.frameX * this.width, this.frameY, this.width, this.height, this.x, this.y, this.width, this.height);
        }

        update(deltaTime) {
            if (this.frameTimer > this.frameInterval) {
                if (this.frameX < this.maxFrame) this.frameX = 0;
                else this.frameX++;
                this.frameTimer = 0;
            } else {
                this.frameTimer += deltaTime;
            }

            this.x -= this.speed;
            if (this.x < 0 - this.width) {
                this.markedForDeletion = true;
                score++;
            }
        }
    }

    function isColliding(obj1, obj2) {
        // Calculate the distance between the centers of the objects along the x-axis
        const dx = Math.abs((obj1.x + obj1.width / 2) - (obj2.x + obj2.width / 2));
    
        // Calculate the minimum distance allowed before collision (sum of half-widths)
        const minDistanceX = (obj1.width / 2) + (obj2.width / 2);
    
        // Check if the distance between the centers is less than the minimum distance for collision
        if (dx <= minDistanceX) {
            // Calculate the distance between the centers of the objects along the y-axis
            const dy = Math.abs((obj1.y + obj1.height / 2) - (obj2.y + obj2.height / 2));
    
            // Calculate the minimum distance allowed before collision (sum of half-heights)
            const minDistanceY = (obj1.height / 2) + (obj2.height / 2);
    
            // Check if the distance between the centers is less than the minimum distance for collision along both axes
            if (dy <= minDistanceY) {
                return true; // Collision detected
            }
        }
        return false; // No collision detected
    }
    

    function handleEnemies(deltaTime) {
        if (enemyTimer > enemyInterval + randomEnemyInterval) {
            enemies.push(new Enemy(canvas.width, canvas.height));
            randomEnemyInterval = Math.random() * 1000 + 500;
            enemyTimer = 0;
        } else {
            enemyTimer += deltaTime;
        }
        enemies.forEach((enemy) => {
            enemy.draw(ctx);
            enemy.update(deltaTime);
        });
        enemies = enemies.filter((enemy) => !enemy.markedForDeletion);
    }

    function displayStatusText(context) {
        context.textAlign = 'left';
        context.font = '40px Helvetica';
        context.fillStyle = 'black';
        context.fillText('Score: ' + score, 20, 50);
        context.fillStyle = 'white';
        context.fillText('Score: ' + score, 22, 52);

        if (gameOver) {
            context.textAlign = 'center';
            context.fillStyle = 'black';
            context.fillText('GAME OVER, press Enter to try again!', canvas.width * 0.5, 200);
            context.fillStyle = 'white';
            context.fillText('GAME OVER, press Enter to try again!', canvas.width * 0.5 + 2, 202);
        }
    }

    function restartGame() {
        player.restart();
        background.restart();
        enemies = [];
        score = 0;
        gameOver = false;
        animate(0);
    }

    function toggleFullScreen(){
        if(!document.fullScreenElement){
            canvas.requestFullscreen().then.catch( err => {
                alert(`Error, can't enable full-screen mode: ${err.message}`)
            }) 
        }else {
            document.exitFullscreen()
        }
    }
    fullScreenButton.addEventListener('click', toggleFullScreen)
    window.addEventListener('dblclick', toggleFullScreen)


    const input = new InputHandler();
    const player = new Player(canvas.width, canvas.height);
    const background = new Background(canvas.width, canvas.height);
    const enemy = new Enemy(canvas.width, canvas.height);

    let lastTime = 0;
    let enemyTimer = 0;
    let enemyInterval = 1000;
    let randomEnemyInterval = Math.random() * 1000 + 500;

    function animate(timeStamp) {
        const deltaTime = timeStamp - lastTime;
        lastTime = timeStamp;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        background.draw(ctx);
        background.update();
        player.draw(ctx);
        player.update(input, deltaTime, enemies);
        handleEnemies(deltaTime);
        displayStatusText(ctx);
        if (!gameOver) requestAnimationFrame(animate);
    }
    animate(0);
});
