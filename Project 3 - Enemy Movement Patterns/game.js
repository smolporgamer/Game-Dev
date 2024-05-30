/** @type {HTMLCanvasElement} **/

const canvas = document.getElementById('canvas-el');
const ctx = canvas.getContext('2d');
const CANVAS_HEIGHT = canvas.height = 1000;
const CANVAS_WIDTH = canvas.width = 500;

const numberOfEnemies = 30
const enemiesArray = []

function createImage(imageSrc) {
    const image = new Image();
    image.onload = function() {
        console.log("Image loaded successfully:", imageSrc);
    };
    image.onerror = function() {
        console.error("Error loading image:", imageSrc);
    };
    image.src = imageSrc; // Set the source inside the function
    return image;
}

let enemyImage1 = createImage('./assets/img/enemies/enemy1.png');
let enemyImage2 = createImage('./assets/img/enemies/enemy2.png');
let enemyImage3 = createImage('./assets/img/enemies/enemy3.png');
let enemyImage4 = createImage('./assets/img/enemies/enemy4.png');

let gameFrame = 0;

class Enemy {
    constructor(){
        //enemyImage1
        //            0    -  4 start at 2
        // this.speed = Math.random() * 4 - 2;


        //sprite
        this.speed = Math.random() * 4 + 1
        this.spriteWidth = 213;
        this.spriteHeight = 213;
        this.width = this.spriteWidth / 2.5
        this.height = this.spriteHeight / 2.5

        //random location of class
        this.x = Math.random() * (canvas.width - this.width);
        this.y = Math.random() * (canvas.height - this. height);

        this.frame = 0

        // SHAKE - flap speed
        this.flapSpeed = Math.floor(Math.random() * 3 + 1)
        // this.x = Math.random() * (canvas.width - this.width)
        // this.y = Math.random() * (canvas.height - this.height)

        // ANGLE - sine & cos (up down motion of sprite)
        // this.angle = Math.random() * 100 // up down motion
        // this.angleSpeed = Math.random() * 1.5 + 0.5
        // this.curve = Math.random() * 200 + 50

        this.newX = Math.random() * (canvas.width - this.width);
        this.newY = Math.random() * (canvas.height - this. height);
        this.interval = Math.floor(Math.random() * 200 + 50)

    }
    // sine = x - horizontol
    // cosine = y - vertical

    update(){
        //random pop location
        if(gameFrame % this.interval === 0){
            this.newX = Math.random() * (canvas.width - this.width);
            this.newY = Math.random() * (canvas.height - this. height);
        }
        let dx = this.x - this.newX
        let dy = this.y - this.newY
        this.x -= dx/70
        this.y -= dy/70

        // random movement pattern
        // this.x = canvas.width/2 * Math.sin(this.angle * Math.PI/270) + (canvas.width / 2 - this.width/2)
        // this.y = canvas.height/2 * Math.cos(this.angle * Math.PI/90) + (canvas.height / 2 - this.height/2)

        // SHAKE / flap speed
        // this.x += Math.random() * 5 - 2.5
        // this.y += Math.random() * 5 - 2.5

        // ANGLE - simplest way to manipulate npc animations
        this.x -= this.speed
        // this.y += this.curve * Math.sin(this.angle)
        this.angle += this.angleSpeed

        //if character is completely hidden = reset this.x to canvas width
        if(this.x + this.width < 0) this.x = canvas.width
        if(gameFrame % this.flapSpeed == 0){
         this.frame > 4 ? this.frame = 0 : this.frame++
        }
    }
    draw(){
        // ctx.strokeRect(this.x, this.y, this.width, this.height)
        // ctx.drawImage(enemyImage1, this.x, this.y)
        ctx.drawImage(enemyImage4, this.frame * this.spriteWidth, 0, this.spriteWidth, this.spriteHeight,
                     this.x, this.y, this.width, this.height)

    }
}

for(let i = 0; i < numberOfEnemies; i++){
    enemiesArray.push(new Enemy())
}

function animate(){
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

    enemiesArray.forEach((enemy) => {
        enemy.draw()
        enemy.update()
    })
    gameFrame++
    requestAnimationFrame(animate)
}
animate()